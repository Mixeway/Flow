package io.mixeway.mixewayflowapi.integrations.repo.service;

import io.mixeway.mixewayflowapi.api.coderepo.service.FindingService;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.domain.finding.FindFindingService;
import io.mixeway.mixewayflowapi.integrations.repo.apiclient.BitbucketApiClientService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${frontend.url}")
    private String frontendUrl;

    /**
     * Posts commit build status for every finished scan; if {@code prId} is set, also posts a PR comment.
     */
    @Transactional(readOnly = true)
    public void publishAfterScan(CodeRepo codeRepo, CodeRepoBranch branch, String commit, Long prId) {
        if (codeRepo.getType() != CodeRepo.RepoType.BITBUCKET) {
            return;
        }
        if (commit == null || commit.isBlank()) {
            log.warn("[Bitbucket Scan Report] Skipping publish: empty commit for {}", codeRepo.getName());
            return;
        }

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

        String reportUrl = buildReportUrl(codeRepo, branch);
        String statusState;
        String description;
        if (urgent > 0) {
            statusState = "FAILED";
            description = truncateDescription(String.format("Failed: %d urgent, %d notable — %s", urgent, notable, summarizeBySource(bySource)));
        } else if (notable > 0) {
            // Bitbucket build API has no distinct "warning" state; SUCCESSFUL + explicit description.
            statusState = "SUCCESSFUL";
            description = truncateDescription(String.format("Warning: %d notable (no urgent) — %s", notable, summarizeBySource(bySource)));
        } else {
            statusState = "SUCCESSFUL";
            description = truncateDescription("No urgent or notable findings — " + summarizeBySource(bySource));
        }

        try {
            bitbucketApiClientService.postCommitBuildStatus(codeRepo, commit, statusState, description, reportUrl).block();
        } catch (Exception e) {
            log.error("[Bitbucket Scan Report] Failed to post commit status for {}: {}", codeRepo.getName(), e.getMessage(), e);
        }

        String insightDetails = truncateForInsight(String.format(
                "Urgent: %d, Notable: %d. %s",
                urgent, notable, summarizeBySource(bySource)));
        String insightResult = urgent > 0 ? "FAILED" : "PASSED";
        try {
            bitbucketApiClientService.putCommitCodeInsightReport(
                    codeRepo, commit, insightResult, insightDetails, reportUrl, urgent, notable).block();
        } catch (Exception e) {
            log.error("[Bitbucket Scan Report] Failed to PUT Code Insights report for {}: {}", codeRepo.getName(), e.getMessage(), e);
        }

        if (prId == null || prId <= 0) {
            return;
        }

        try {
            StringBuilder pr = new StringBuilder();
            pr.append("### Urgency (Flow)\n\n");
            pr.append(String.format("- **Urgent:** %d\n- **Notable:** %d\n", urgent, notable));
            pr.append("\n| Source | Urgent | Notable |\n|--------|-------:|--------:|\n");
            for (Finding.Source s : Finding.Source.values()) {
                int[] c = bySource.get(s);
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
