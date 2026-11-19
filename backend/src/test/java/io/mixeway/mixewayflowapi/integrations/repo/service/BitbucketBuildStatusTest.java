package io.mixeway.mixewayflowapi.integrations.repo.service;

import io.mixeway.mixewayflowapi.api.coderepo.service.FindingService;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.entity.ScanInfo;
import io.mixeway.mixewayflowapi.db.entity.Vulnerability;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoBranchRepository;
import io.mixeway.mixewayflowapi.db.repository.ScanInfoRepository;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.finding.FindFindingService;
import io.mixeway.mixewayflowapi.integrations.repo.apiclient.BitbucketApiClientService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

/**
 * The Bitbucket build status of a commit follows the review of its findings in Flow and, for a scan
 * whose SBOM comes from the pipeline, waits for that SBOM.
 */
class BitbucketBuildStatusTest {

    private static final long REPO_ID = 5L;
    private static final long BRANCH_ID = 9L;
    private static final String LAST_SCANNED_COMMIT = "0a1b2c3d4e5f60718293a4b5c6d7e8f901234567";

    private FindFindingService findFindingService;
    private BitbucketApiClientService bitbucket;
    private ScanInfoRepository scanInfoRepository;
    private BitbucketScanReportService reportService;

    private CodeRepo repo;
    private CodeRepoBranch branch;

    @BeforeEach
    void setUp() {
        findFindingService = mock(FindFindingService.class);
        FindingService findingService = mock(FindingService.class);
        bitbucket = mock(BitbucketApiClientService.class);
        FindCodeRepoService findCodeRepoService = mock(FindCodeRepoService.class);
        CodeRepoBranchRepository branchRepository = mock(CodeRepoBranchRepository.class);
        scanInfoRepository = mock(ScanInfoRepository.class);
        reportService = new BitbucketScanReportService(findFindingService, findingService, bitbucket,
                mock(GitCommentService.class), findCodeRepoService, branchRepository, scanInfoRepository);
        ReflectionTestUtils.setField(reportService, "frontendUrl", "flow.example.test");

        repo = mock(CodeRepo.class);
        when(repo.getId()).thenReturn(REPO_ID);
        when(repo.getName()).thenReturn("workspace/repo");
        when(repo.getType()).thenReturn(CodeRepo.RepoType.BITBUCKET);
        when(repo.isScanNotRunning()).thenReturn(true);
        branch = mock(CodeRepoBranch.class);
        when(branch.getId()).thenReturn(BRANCH_ID);
        when(branch.getName()).thenReturn("feature/x");

        when(findCodeRepoService.findById(REPO_ID)).thenReturn(Optional.of(repo));
        when(branchRepository.findById(BRANCH_ID)).thenReturn(Optional.of(branch));
        when(findingService.calculateUrgency(any())).thenReturn("urgent");
        when(bitbucket.postCommitBuildStatus(any(), any(), any(), any(), any())).thenReturn(Mono.empty());
        when(bitbucket.putCommitCodeInsightReport(any(), any(), any(), any(), any(), anyInt(), anyInt()))
                .thenReturn(Mono.empty());

        ScanInfo lastScan = mock(ScanInfo.class);
        when(lastScan.getCommitId()).thenReturn(LAST_SCANNED_COMMIT);
        when(scanInfoRepository.findScannedCommits(eq(repo), eq(branch), any())).thenReturn(List.of(lastScan));
    }

    @Test
    void suppressingTheLastUrgentFindingTurnsTheBuildGreen() {
        Finding suppressed = finding();
        suppressed.suppress(Finding.SuppressedReason.ACCEPTED.name());
        branchHas(suppressed);

        assertTrue(reportService.refreshBuildStatus(REPO_ID, BRANCH_ID));

        verify(bitbucket).postCommitBuildStatus(eq(repo), eq(LAST_SCANNED_COMMIT), eq("SUCCESSFUL"),
                contains("No urgent or notable findings"), contains("show-repo/" + REPO_ID));
        verify(bitbucket).putCommitCodeInsightReport(eq(repo), eq(LAST_SCANNED_COMMIT), eq("PASSED"),
                anyString(), anyString(), eq(0), eq(0));
        verify(bitbucket, never()).commentPullRequest(any(), anyLong(), anyString());
    }

    @Test
    void buildStaysFailedWhileAnUrgentFindingIsOpen() {
        Finding suppressed = finding();
        suppressed.suppress(Finding.SuppressedReason.ACCEPTED.name());
        Finding open = finding();
        open.updateStatus(Finding.Status.EXISTING, null);
        branchHas(suppressed, open);

        assertTrue(reportService.refreshBuildStatus(REPO_ID, BRANCH_ID));

        verify(bitbucket).postCommitBuildStatus(eq(repo), eq(LAST_SCANNED_COMMIT), eq("FAILED"),
                contains("1 urgent"), anyString());
    }

    @Test
    void reviewDuringAScanIsLeftToTheScanToReport() {
        when(repo.isScanNotRunning()).thenReturn(false);

        assertFalse(reportService.refreshBuildStatus(REPO_ID, BRANCH_ID));

        verifyNoInteractions(bitbucket);
    }

    @Test
    void branchThatWasNeverScannedHasNoBuildToRefresh() {
        when(scanInfoRepository.findScannedCommits(eq(repo), eq(branch), any())).thenReturn(List.of());

        assertFalse(reportService.refreshBuildStatus(REPO_ID, BRANCH_ID));

        verifyNoInteractions(bitbucket);
    }

    @Test
    void repositoriesOnOtherGitServersAreLeftAlone() {
        when(repo.getType()).thenReturn(CodeRepo.RepoType.GITLAB);

        assertFalse(reportService.refreshBuildStatus(REPO_ID, BRANCH_ID));

        verifyNoInteractions(bitbucket);
    }

    @Test
    void scanWaitingForTheSbomFromThePipelineKeepsTheBuildRunning() {
        reportService.publishAwaitingSbom(repo, branch, LAST_SCANNED_COMMIT);

        verify(bitbucket).postCommitBuildStatus(eq(repo), eq(LAST_SCANNED_COMMIT), eq("INPROGRESS"),
                contains("waiting for the SBOM"), anyString());
        verify(bitbucket).putCommitCodeInsightReport(eq(repo), eq(LAST_SCANNED_COMMIT), eq("PENDING"),
                anyString(), anyString(), eq(0), eq(0));
    }

    @Test
    void sbomThatCouldNotBeScannedFailsTheBuild() {
        reportService.publishSbomScanFailed(repo, branch, LAST_SCANNED_COMMIT);

        verify(bitbucket).postCommitBuildStatus(eq(repo), eq(LAST_SCANNED_COMMIT), eq("FAILED"),
                contains("SBOM"), anyString());
    }

    private void branchHas(Finding... findings) {
        when(findFindingService.getCodeRepoFindings(repo, branch)).thenReturn(List.of(findings));
    }

    private Finding finding() {
        return new Finding(mock(Vulnerability.class), null, branch, repo, null, "explanation", "src/Dao.java:10",
                Finding.Severity.CRITICAL, Finding.Source.SAST);
    }
}
