package io.mixeway.mixewayflowapi.scanmanager.service;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.domain.coderepo.UpdateCodeRepoService;
import io.mixeway.mixewayflowapi.integrations.repo.service.BitbucketScanReportService;
import io.mixeway.mixewayflowapi.integrations.repo.service.GitCommentService;
import io.mixeway.mixewayflowapi.integrations.repo.service.GitService;
import io.mixeway.mixewayflowapi.integrations.scanner.iac.service.IaCService;
import io.mixeway.mixewayflowapi.integrations.scanner.sast.service.SASTService;
import io.mixeway.mixewayflowapi.integrations.scanner.sca.service.SCAGrypeService;
import io.mixeway.mixewayflowapi.integrations.scanner.secrets.service.SecretsService;
import io.mixeway.mixewayflowapi.integrations.scanner.zap.service.ZAPService;
import io.mixeway.mixewayflowapi.scanmanager.service.ScanManagerService.ScanRequest;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.timeout;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * A scan started by a pipeline that builds its own SBOM leaves the dependencies to that SBOM and holds
 * its verdict back until the SBOM has been uploaded and scanned.
 */
@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class PipelineSbomScanTest {

    private static final String COMMIT = "0a1b2c3d4e5f60718293a4b5c6d7e8f901234567";
    private static final long PULL_REQUEST = 12L;

    @Mock private GitService gitService;
    @Mock private SecretsService secretsService;
    @Mock private IaCService iaCService;
    @Mock private SASTService sastService;
    @Mock private ZAPService zapService;
    @Mock private UpdateCodeRepoService updateCodeRepoService;
    @Mock private GitCommentService gitCommentService;
    @Mock private BitbucketScanReportService bitbucketScanReportService;
    @Mock private SCAGrypeService scaGrypeService;

    @InjectMocks
    private ScanManagerService scanManagerService;

    private CodeRepo repo;
    private CodeRepoBranch branch;
    private String cloneDir;
    private Path sbomDir;

    @BeforeEach
    void setUp() throws Exception {
        String name = "flow-unit-test-" + UUID.randomUUID();
        cloneDir = "/tmp/" + name;
        repo = mock(CodeRepo.class);
        when(repo.getId()).thenReturn(77L);
        when(repo.getName()).thenReturn(name);
        when(repo.getRepourl()).thenReturn("https://bitbucket.org/workspace/repo");
        when(repo.getType()).thenReturn(CodeRepo.RepoType.BITBUCKET);
        branch = mock(CodeRepoBranch.class);
        when(branch.getId()).thenReturn(9L);
        when(branch.getName()).thenReturn("feature/x");

        sbomDir = Files.createTempDirectory("flow-sbom-test-");
        Files.writeString(sbomDir.resolve("sbom.json"), "{}");
    }

    @AfterEach
    void tearDown() throws Exception {
        scanManagerService.shutdownExecutors();
        Files.deleteIfExists(sbomDir.resolve("sbom.json"));
        Files.deleteIfExists(sbomDir);
    }

    @Test
    void sbomFromThePipelineIsScannedAndReportedForItsCommit() throws Exception {
        scanManagerService.scanRepositoryFromPipelineSbom(repo, branch, sbomDir, COMMIT, PULL_REQUEST)
                .get(10, TimeUnit.SECONDS);

        verify(scaGrypeService).runGrype(sbomDir.toAbsolutePath().toString(), repo, branch);
        verify(updateCodeRepoService).updateCodeRepoStatus(repo, branch, COMMIT);
        verify(bitbucketScanReportService).publishAfterScan(repo, branch, COMMIT, PULL_REQUEST);
        assertFalse(scanManagerService.isPipelineSbomScanPending(77L));
        assertFalse(Files.exists(sbomDir), "the uploaded SBOM is removed once scanned");
    }

    @Test
    void sbomIsPendingUntilItHasBeenScanned() throws Exception {
        CompletableFuture<Void> scanning = new CompletableFuture<>();
        CompletableFuture<Void> release = new CompletableFuture<>();
        doAnswer(invocation -> {
            scanning.complete(null);
            release.get(10, TimeUnit.SECONDS);
            return null;
        }).when(scaGrypeService).runGrype(anyString(), any(), any());

        CompletableFuture<Void> scanned =
                scanManagerService.scanRepositoryFromPipelineSbom(repo, branch, sbomDir, COMMIT, null);
        scanning.get(10, TimeUnit.SECONDS);

        assertTrue(scanManagerService.isPipelineSbomScanPending(77L));
        assertFalse(scanned.isDone());

        release.complete(null);
        scanned.get(10, TimeUnit.SECONDS);
        assertFalse(scanManagerService.isPipelineSbomScanPending(77L));
    }

    @Test
    void sbomThatCannotBeScannedFailsTheBuildInsteadOfPassingIt() throws Exception {
        doThrow(new IOException("grype failed")).when(scaGrypeService).runGrype(anyString(), any(), any());

        CompletableFuture<Void> scanned =
                scanManagerService.scanRepositoryFromPipelineSbom(repo, branch, sbomDir, COMMIT, PULL_REQUEST);

        ExecutionException failure = assertThrows(ExecutionException.class, () -> scanned.get(10, TimeUnit.SECONDS));
        assertInstanceOf(IOException.class, failure.getCause());
        verify(bitbucketScanReportService).publishSbomScanFailed(repo, branch, COMMIT);
        verify(bitbucketScanReportService, never()).publishAfterScan(any(), any(), any(), any());
    }

    @Test
    void scanLeavesTheDependenciesToThePipelineAndHoldsItsVerdictUntilTheSbomIsIn() throws Exception {
        assertEquals(ScanRequest.STARTED,
                scanManagerService.requestScan(repo, branch, COMMIT, PULL_REQUEST, true));

        // Uploaded right after the scan request, without commit or pull request: not throttled, and
        // reported for the commit and pull request of the scan it belongs to.
        scanManagerService.scanRepositoryFromPipelineSbom(repo, branch, sbomDir, null, null)
                .get(20, TimeUnit.SECONDS);

        verify(sastService).runBearerScan(cloneDir, repo, branch);
        verify(scaGrypeService, times(1)).runGrype(anyString(), any(), any());
        verify(scaGrypeService).runGrype(sbomDir.toAbsolutePath().toString(), repo, branch);
        InOrder verdict = inOrder(bitbucketScanReportService);
        verdict.verify(bitbucketScanReportService).publishAwaitingSbom(repo, branch, COMMIT);
        verdict.verify(bitbucketScanReportService).publishAfterScan(repo, branch, COMMIT, PULL_REQUEST);
        verdict.verifyNoMoreInteractions();
    }

    @Test
    void sbomWithoutAKnownCommitIsReportedForTheLastScannedOne() throws Exception {
        scanManagerService.scanRepositoryFromPipelineSbom(repo, branch, sbomDir, null, null)
                .get(10, TimeUnit.SECONDS);

        verify(bitbucketScanReportService).refreshBuildStatus(77L, 9L);
        verify(bitbucketScanReportService, never()).publishAfterScan(any(), any(), any(), any());
    }

    @Test
    void mergeRequestOnAnotherGitServerIsCommentedOnceTheSbomIsIn() throws Exception {
        when(repo.getType()).thenReturn(CodeRepo.RepoType.GITLAB);
        assertEquals(ScanRequest.STARTED,
                scanManagerService.requestScan(repo, branch, COMMIT, PULL_REQUEST, true));

        scanManagerService.scanRepositoryFromPipelineSbom(repo, branch, sbomDir, null, null)
                .get(20, TimeUnit.SECONDS);

        verify(gitCommentService, times(1)).processMergeComment(repo, branch, PULL_REQUEST);
    }

    @Test
    void scanThatWasNotToldAboutAnSbomScansTheDependenciesItselfAndReportsAtOnce() throws Exception {
        assertEquals(ScanRequest.STARTED,
                scanManagerService.requestScan(repo, branch, COMMIT, PULL_REQUEST, false));

        verify(bitbucketScanReportService, timeout(20_000)).publishAfterScan(repo, branch, COMMIT, PULL_REQUEST);
        verify(scaGrypeService).runGrype(cloneDir, repo, branch);
        verify(bitbucketScanReportService, never()).publishAwaitingSbom(any(), any(), any());
    }

    @Test
    void scanRequestedAgainRightAwayIsThrottled() {
        assertEquals(ScanRequest.STARTED, scanManagerService.requestScan(repo, branch, COMMIT, null, true));

        assertEquals(ScanRequest.THROTTLED, scanManagerService.requestScan(repo, branch, COMMIT, null, true));
        verify(bitbucketScanReportService, never()).refreshBuildStatus(anyLong(), anyLong());
    }
}
