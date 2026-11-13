package io.mixeway.mixewayflowapi.api.cicd.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.mixeway.mixewayflowapi.api.cicd.dto.CicdScanRequestDto;
import io.mixeway.mixewayflowapi.api.cicd.dto.CodeRepoDto;
import io.mixeway.mixewayflowapi.api.gitlabcicd.service.GitLabCICDService;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.coderepobranch.GetOrCreateCodeRepoBranchService;
import io.mixeway.mixewayflowapi.domain.finding.FindFindingService;
import io.mixeway.mixewayflowapi.scanmanager.service.ScanManagerService;
import io.mixeway.mixewayflowapi.scanmanager.service.ScanManagerService.ScanRequest;
import io.mixeway.mixewayflowapi.utils.StatusDTO;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.transaction.PlatformTransactionManager;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.Principal;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * A pipeline starts a scan of the commit it builds, builds its SBOM meanwhile, uploads it and gets
 * the result of both.
 */
class CicdPipelineSbomTest {

    private static final String REPO_URL = "https://bitbucket.org/workspace/repo";
    private static final String BRANCH = "feature/x";
    private static final String COMMIT = "0a1b2c3d4e5f60718293a4b5c6d7e8f901234567";
    private static final String SBOM = "{\"bomFormat\":\"CycloneDX\",\"components\":[]}";

    private FindCodeRepoService findCodeRepoService;
    private ScanManagerService scanManagerService;
    private GitLabCICDService gitLabCICDService;
    private CICDService cicdService;

    private CodeRepo repo;
    private CodeRepoBranch branch;
    private final Principal principal = () -> "pipeline-user";
    private Path storedSbomDir;

    @BeforeEach
    void setUp() {
        findCodeRepoService = mock(FindCodeRepoService.class);
        GetOrCreateCodeRepoBranchService branchService = mock(GetOrCreateCodeRepoBranchService.class);
        scanManagerService = mock(ScanManagerService.class);
        gitLabCICDService = mock(GitLabCICDService.class);
        cicdService = new CICDService(findCodeRepoService, branchService, mock(FindFindingService.class),
                mock(ValidateStatusMapper.class), scanManagerService, gitLabCICDService, new ObjectMapper(),
                mock(PlatformTransactionManager.class));
        ReflectionTestUtils.setField(cicdService, "frontendUrl", "https://flow.example.test/");

        repo = mock(CodeRepo.class);
        when(repo.getId()).thenReturn(5L);
        when(repo.getName()).thenReturn("workspace/repo");
        when(repo.isScanNotRunning()).thenReturn(true);
        branch = mock(CodeRepoBranch.class);
        when(branch.getName()).thenReturn(BRANCH);
        when(findCodeRepoService.findByUrl(REPO_URL, principal)).thenReturn(Optional.of(repo));
        when(findCodeRepoService.findCodeRepoByUrl(REPO_URL)).thenReturn(Optional.of(repo));
        when(branchService.getOrCreateCodeRepoBranch(BRANCH, repo)).thenReturn(branch);
    }

    @AfterEach
    void removeStoredSbom() throws IOException {
        if (storedSbomDir != null) {
            Files.deleteIfExists(storedSbomDir.resolve("sbom.json"));
            Files.deleteIfExists(storedSbomDir);
        }
    }

    @Test
    void pipelineStartsAScanThatLeavesTheSbomToIt() {
        when(scanManagerService.requestScan(repo, branch, COMMIT, 12L, true)).thenReturn(ScanRequest.STARTED);

        ResponseEntity<StatusDTO> response = cicdService.startScan(scanRequest(true), principal);

        assertEquals(HttpStatus.ACCEPTED, response.getStatusCode());
        assertEquals("started", response.getBody().getStatus());
    }

    @Test
    void pipelineIsToldWhenItsScanRequestWasThrottled() {
        when(scanManagerService.requestScan(repo, branch, COMMIT, 12L, false)).thenReturn(ScanRequest.THROTTLED);

        ResponseEntity<StatusDTO> response = cicdService.startScan(scanRequest(false), principal);

        assertEquals(HttpStatus.TOO_MANY_REQUESTS, response.getStatusCode());
        assertEquals("throttled", response.getBody().getStatus());
    }

    @Test
    void scanOfARepositoryTheUserMayNotSeeIsNotStarted() {
        when(findCodeRepoService.findByUrl(REPO_URL, principal)).thenReturn(Optional.empty());

        ResponseEntity<StatusDTO> response = cicdService.startScan(scanRequest(true), principal);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(scanManagerService, never()).requestScan(any(), any(), any(), any(), anyBoolean());
    }

    @Test
    void uploadedSbomIsScannedAndTheResultReturned() throws IOException {
        when(scanManagerService.scanRepositoryFromPipelineSbom(eq(repo), eq(branch), any(), eq(COMMIT), eq(12L)))
                .thenReturn(CompletableFuture.completedFuture(null));
        when(gitLabCICDService.createScanSummary(repo, branch, "flow.example.test"))
                .thenReturn("{\"totalNumberOfFindings\":0}");

        ResponseEntity<?> response = cicdService.uploadSbom(REPO_URL, BRANCH, COMMIT, 12L, null, true,
                sbomFile(SBOM), principal);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("{\"totalNumberOfFindings\":0}", response.getBody());
        ArgumentCaptor<Path> workDir = ArgumentCaptor.forClass(Path.class);
        verify(scanManagerService).scanRepositoryFromPipelineSbom(eq(repo), eq(branch), workDir.capture(),
                eq(COMMIT), eq(12L));
        storedSbomDir = workDir.getValue();
        assertEquals(SBOM, Files.readString(storedSbomDir.resolve("sbom.json")));
    }

    @Test
    void uploadThatDoesNotWaitIsAcceptedWhileTheScanGoesOn() throws IOException {
        when(scanManagerService.scanRepositoryFromPipelineSbom(eq(repo), eq(branch), any(), any(), any()))
                .thenReturn(new CompletableFuture<>());

        ResponseEntity<?> response = cicdService.uploadSbom(REPO_URL, BRANCH, null, null, null, false,
                sbomFile(SBOM), principal);

        assertEquals(HttpStatus.ACCEPTED, response.getStatusCode());
        assertEquals("accepted", ((StatusDTO) response.getBody()).getStatus());
        ArgumentCaptor<Path> workDir = ArgumentCaptor.forClass(Path.class);
        verify(scanManagerService).scanRepositoryFromPipelineSbom(eq(repo), eq(branch), workDir.capture(),
                eq(null), eq(null));
        storedSbomDir = workDir.getValue();
        verify(gitLabCICDService, never()).createScanSummary(any(), any(), any());
    }

    @Test
    void sbomThatCouldNotBeScannedFailsTheUpload() throws IOException {
        when(scanManagerService.scanRepositoryFromPipelineSbom(eq(repo), eq(branch), any(), any(), any()))
                .thenReturn(CompletableFuture.failedFuture(new IOException("grype failed")));

        ResponseEntity<?> response = cicdService.uploadSbom(REPO_URL, BRANCH, COMMIT, null, null, true,
                sbomFile(SBOM), principal);

        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, response.getStatusCode());
        verify(gitLabCICDService, never()).createScanSummary(any(), any(), any());
    }

    @Test
    void fileThatIsNotJsonIsRejected() throws IOException {
        ResponseEntity<?> response = cicdService.uploadSbom(REPO_URL, BRANCH, COMMIT, null, null, true,
                sbomFile("<bom/>"), principal);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(((StatusDTO) response.getBody()).getStatus().startsWith("Invalid JSON SBOM"));
        verify(scanManagerService, never()).scanRepositoryFromPipelineSbom(any(), any(), any(), any(), any());
    }

    @Test
    void sbomForARepositoryTheUserMayNotSeeIsNotScanned() throws IOException {
        when(findCodeRepoService.findByUrl(REPO_URL, principal)).thenReturn(Optional.empty());

        ResponseEntity<?> response = cicdService.uploadSbom(REPO_URL, BRANCH, COMMIT, null, null, true,
                sbomFile(SBOM), principal);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(scanManagerService, never()).scanRepositoryFromPipelineSbom(any(), any(), any(), any(), any());
    }

    @Test
    void resultIsNotReadyWhileAnUploadedSbomWaitsToBeScanned() {
        when(scanManagerService.isPipelineSbomScanPending(5L)).thenReturn(true);
        CodeRepoDto check = new CodeRepoDto();
        check.setRepoUrl(REPO_URL);
        check.setBranch(BRANCH);

        assertEquals(HttpStatus.LOCKED, cicdService.validateCodeRepo(check).getStatusCode());
    }

    private CicdScanRequestDto scanRequest(boolean sbomFromPipeline) {
        CicdScanRequestDto request = new CicdScanRequestDto();
        request.setRepoUrl(REPO_URL);
        request.setBranch(BRANCH);
        request.setCommitId(COMMIT);
        request.setPullRequestId(12L);
        request.setSbomFromPipeline(sbomFromPipeline);
        return request;
    }

    private static MockMultipartFile sbomFile(String content) {
        return new MockMultipartFile("file", "bom.json", "application/json", content.getBytes(StandardCharsets.UTF_8));
    }
}
