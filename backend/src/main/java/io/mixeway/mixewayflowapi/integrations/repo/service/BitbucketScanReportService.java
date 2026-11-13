package io.mixeway.mixewayflowapi.integrations.repo.service;

import io.mixeway.mixewayflowapi.api.coderepo.service.FindingService;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.entity.ScanInfo;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoBranchRepository;
import io.mixeway.mixewayflowapi.db.repository.ScanInfoRepository;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.finding.FindFindingService;
import io.mixeway.mixewayflowapi.integrations.repo.apiclient.BitbucketApiClientService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.MalformedURLException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

/**
 * Publishes Flow scan results to Bitbucket: commit build status (Cloud + Server),
 * Bitbucket Cloud Code Insights report ({@code PUT .../reports/{id}}), and optional PR comment.
 * The same verdict is posted again when findings are reviewed in Flow or an SBOM arrives from the pipeline.
 * Urgency uses the same rules as {@link FindingService#calculateUrgency(Finding)}.
 */
@Service
@RequiredArgsConstructor
@Log4j2
public class BitbucketScanReportService {

    private static final int MAX_STATUS_DESCRIPTION_LEN = 450;
    private static final int MAX_INSIGHT_DETAILS_LEN = 1200;

    private final FindFindingService findFindingService;
    private final FindingService findingService;
    private final BitbucketApiClientService bitbucketApiClientService;
    private final GitCommentService gitCommentService;
    private final FindCodeRepoService findCodeRepoService;
    private final CodeRepoBranchRepository codeRepoBranchRepository;
    private final ScanInfoRepository scanInfoRepository;

    @Value("${frontend.url}")
    private String frontendUrl;

    /**
     * Posts commit build status for every finished scan; if {@code prId} is set, also posts a PR comment.
     */
    @Transactional(readOnly = true)
    public void publishAfterScan(CodeRepo codeRepo, CodeRepoBranch branch, String commit, Long prId) {
        if (!canPublish(codeRepo, commit)) {
            return;
        }
        Urgency urgency = urgencyOf(codeRepo, branch);
        postVerdict(codeRepo, branch, commit, urgency);
        if (prId != null && prId > 0) {
            postPullRequestComment(codeRepo, branch, prId, urgency);
        }
    }

    /**
     * Marks the build as still running: the code has been scanned, but the dependencies are scanned
     * from an SBOM the pipeline has yet to upload. The verdict follows once that SBOM is in.
     */
    public void publishAwaitingSbom(CodeRepo codeRepo, CodeRepoBranch branch, String commit) {
        if (!canPublish(codeRepo, commit)) {
            return;
        }
        String description = "Code scanned - waiting for the SBOM from the pipeline to scan dependencies";
        postStatusAndReport(codeRepo, commit, "INPROGRESS", "PENDING", description, description,
                buildReportUrl(codeRepo, branch), 0, 0);
    }

    /**
     * Fails the build when the SBOM uploaded by the pipeline could not be scanned, so that it is not
     * left running or passed on findings that do not include the dependencies.
     */
    public void publishSbomScanFailed(CodeRepo codeRepo, CodeRepoBranch branch, String commit) {
        if (!canPublish(codeRepo, commit)) {
            return;
        }
        String description = "Failed: the SBOM uploaded from the pipeline could not be scanned";
        postStatusAndReport(codeRepo, commit, "FAILED", "FAILED", description, description,
                buildReportUrl(codeRepo, branch), 0, 0);
    }

    /**
     * Posts the verdict again for the commit last scanned on the branch. Called after findings were
     * suppressed or re-activated in Flow, so that the build follows the review without a new commit.
     *
     * @return whether a status was posted
     */
    @Transactional(readOnly = true)
    public boolean refreshBuildStatus(long codeRepoId, long branchId) {
        CodeRepo codeRepo = findCodeRepoService.findById(codeRepoId).orElse(null);
        if (codeRepo == null || codeRepo.getType() != CodeRepo.RepoType.BITBUCKET) {
            return false;
        }
        if (!codeRepo.isScanNotRunning()) {
            // The running scan posts the verdict itself when it ends, for the commit it scans.
            return false;
        }
        CodeRepoBranch branch = codeRepoBranchRepository.findById(branchId).orElse(null);
        if (branch == null) {
            return false;
        }
        List<ScanInfo> scanned = scanInfoRepository.findScannedCommits(codeRepo, branch, PageRequest.of(0, 1));
        if (scanned.isEmpty()) {
            log.debug("[Bitbucket Scan Report] No scanned commit of {} / {} to refresh the build status of",
                    codeRepo.getName(), branch.getName());
            return false;
        }
        String commit = scanned.get(0).getCommitId();
        log.info("[Bitbucket Scan Report] Findings of {} / {} were reviewed - refreshing the build status of commit {}",
                codeRepo.getName(), branch.getName(), commit);
        postVerdict(codeRepo, branch, commit, urgencyOf(codeRepo, branch));
        return true;
    }

    private boolean canPublish(CodeRepo codeRepo, String commit) {
        if (codeRepo.getType() != CodeRepo.RepoType.BITBUCKET) {
            return false;
        }
        if (commit == null || commit.isBlank()) {
            log.warn("[Bitbucket Scan Report] Skipping publish: empty commit for {}", codeRepo.getName());
            return false;
        }
        return true;
    }

    /** Urgent and notable findings still open on the branch, in total and per source. */
    private record Urgency(int urgent, int notable, Map<Finding.Source, int[]> bySource) {
    }

    private Urgency urgencyOf(CodeRepo codeRepo, CodeRepoBranch branch) {
        List<Finding> findings = findFindingService.getCodeRepoFindings(codeRepo, branch);

        int urgent = 0;
        int notable = 0;
        Map<Finding.Source, int[]> bySource = new EnumMap<>(Finding.Source.class);
        for (Finding.Source s : Finding.Source.values()) {
            bySource.put(s, new int[]{0, 0});
        }

        for (Finding f : findings) {
            if (f.getStatus() != Finding.Status.NEW && f.getStatus() != Finding.Status.EXISTING) {
                continue;
            }
            String u = findingService.calculateUrgency(f);
            if ("urgent".equals(u)) {
                urgent++;
                bySource.get(f.getSource())[0]++;
            } else if ("notable".equals(u)) {
                notable++;
                bySource.get(f.getSource())[1]++;
            }
        }
        return new Urgency(urgent, notable, bySource);
    }

    private void postVerdict(CodeRepo codeRepo, CodeRepoBranch branch, String commit, Urgency urgency) {
        int urgent = urgency.urgent();
        int notable = urgency.notable();
        String bySource = summarizeBySource(urgency.bySource());

        String statusState;
        String description;
        if (urgent > 0) {
            statusState = "FAILED";
            description = String.format("Failed: %d urgent, %d notable — %s", urgent, notable, bySource);
        } else if (notable > 0) {
            // Bitbucket build API has no distinct "warning" state; SUCCESSFUL + explicit description.
            statusState = "SUCCESSFUL";
            description = String.format("Warning: %d notable (no urgent) — %s", notable, bySource);
        } else {
            statusState = "SUCCESSFUL";
            description = "No urgent or notable findings — " + bySource;
        }
        String insightDetails = String.format("Urgent: %d, Notable: %d. %s", urgent, notable, bySource);

        postStatusAndReport(codeRepo, commit, statusState, urgent > 0 ? "FAILED" : "PASSED", description,
                insightDetails, buildReportUrl(codeRepo, branch), urgent, notable);
    }

    private void postStatusAndReport(CodeRepo codeRepo, String commit, String statusState, String insightResult,
                                     String description, String insightDetails, String reportUrl,
                                     int urgent, int notable) {
        try {
            bitbucketApiClientService.postCommitBuildStatus(
                    codeRepo, commit, statusState, truncateDescription(description), reportUrl).block();
        } catch (Exception e) {
            log.error("[Bitbucket Scan Report] Failed to post commit status for {}: {}", codeRepo.getName(), e.getMessage(), e);
        }

        try {
            bitbucketApiClientService.putCommitCodeInsightReport(
                    codeRepo, commit, insightResult, truncateForInsight(insightDetails), reportUrl, urgent, notable).block();
        } catch (Exception e) {
            log.error("[Bitbucket Scan Report] Failed to PUT Code Insights report for {}: {}", codeRepo.getName(), e.getMessage(), e);
        }
    }

    private void postPullRequestComment(CodeRepo codeRepo, CodeRepoBranch branch, Long prId, Urgency urgency) {
        try {
            StringBuilder pr = new StringBuilder();
            pr.append("### Urgency (Flow)\n\n");
            pr.append(String.format("- **Urgent:** %d\n- **Notable:** %d\n", urgency.urgent(), urgency.notable()));
            pr.append("\n| Source | Urgent | Notable |\n|--------|-------:|--------:|\n");
            for (Finding.Source s : Finding.Source.values()) {
                int[] c = urgency.bySource().get(s);
                if (c[0] + c[1] > 0) {
                    pr.append(String.format("| %s | %d | %d |\n", s, c[0], c[1]));
                }
            }
            pr.append("\n---\n\n");
            pr.append(gitCommentService.buildSecurityScanComment(codeRepo, branch));
            bitbucketApiClientService.commentPullRequest(codeRepo, prId, pr.toString()).block();
        } catch (MalformedURLException e) {
            log.error("[Bitbucket Scan Report] Unable to build PR comment for {}: {}", codeRepo.getName(), e.getMessage());
        } catch (Exception e) {
            log.error("[Bitbucket Scan Report] Failed to post PR comment for {}: {}", codeRepo.getName(), e.getMessage(), e);
        }
    }

    private String buildReportUrl(CodeRepo codeRepo, CodeRepoBranch branch) {
        String baseUrl = (frontendUrl.startsWith("http") ? "" : "https://") + frontendUrl + "#/show-repo/" + codeRepo.getId();
        String encodedBranch = URLEncoder.encode(branch.getName(), StandardCharsets.UTF_8);
        return baseUrl + "?branch=" + encodedBranch;
    }

    private static String summarizeBySource(Map<Finding.Source, int[]> bySource) {
        StringBuilder sb = new StringBuilder();
        for (Map.Entry<Finding.Source, int[]> e : bySource.entrySet()) {
            if (e.getValue()[0] + e.getValue()[1] == 0) {
                continue;
            }
            if (sb.length() > 0) {
                sb.append("; ");
            }
            sb.append(e.getKey().name()).append(": ");
            sb.append(e.getValue()[0]).append(" urgent, ").append(e.getValue()[1]).append(" notable");
        }
        return sb.length() > 0 ? sb.toString() : "no urgency-tagged findings";
    }

    private static String truncateDescription(String s) {
        if (s.length() <= MAX_STATUS_DESCRIPTION_LEN) {
            return s;
        }
        return s.substring(0, MAX_STATUS_DESCRIPTION_LEN - 3) + "...";
    }

    private static String truncateForInsight(String s) {
        if (s.length() <= MAX_INSIGHT_DETAILS_LEN) {
            return s;
        }
        return s.substring(0, MAX_INSIGHT_DETAILS_LEN - 3) + "...";
    }
}
