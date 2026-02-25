package io.mixeway.mixewayflowapi.integrations.repo.service;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.domain.finding.FindFindingService;
import io.mixeway.mixewayflowapi.integrations.repo.apiclient.BitbucketApiClientService;
import io.mixeway.mixewayflowapi.integrations.repo.apiclient.GitHubApiClientService;
import io.mixeway.mixewayflowapi.integrations.repo.apiclient.GitLabApiClientService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.MalformedURLException;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class GitCommentService {
    private final FindFindingService findFindingService;
    @Value("${frontend.url}")
    String frontendUrl;
    private final GitLabApiClientService gitLabApiClientService;
    private final GitHubApiClientService gitHubApiClientService;
    private final BitbucketApiClientService bitbucketApiClientService;

    private static final int TOP_FINDINGS_LIMIT = 5;

    public void processMergeComment(CodeRepo codeRepo, CodeRepoBranch codeRepoBranch, Long iid) throws MalformedURLException {
        List<Finding> findings = findFindingService.getCodeRepoFindings(codeRepo, codeRepoBranch);

        int sastCritical = countFindings(findings, Finding.Source.SAST, Finding.Severity.CRITICAL, Finding.Status.EXISTING, Finding.Status.NEW);
        int sastHigh = countFindings(findings, Finding.Source.SAST, Finding.Severity.HIGH, Finding.Status.EXISTING, Finding.Status.NEW);
        int sastMedium = countFindings(findings, Finding.Source.SAST, Finding.Severity.MEDIUM, Finding.Status.EXISTING, Finding.Status.NEW);
        int sastLow = countFindings(findings, Finding.Source.SAST, Finding.Severity.LOW, Finding.Status.EXISTING, Finding.Status.NEW);

        int scaCritical = countFindings(findings, Finding.Source.SCA, Finding.Severity.CRITICAL, Finding.Status.EXISTING, Finding.Status.NEW);
        int scaHigh = countFindings(findings, Finding.Source.SCA, Finding.Severity.HIGH, Finding.Status.EXISTING, Finding.Status.NEW);
        int scaMedium = countFindings(findings, Finding.Source.SCA, Finding.Severity.MEDIUM, Finding.Status.EXISTING, Finding.Status.NEW);
        int scaLow = countFindings(findings, Finding.Source.SCA, Finding.Severity.LOW, Finding.Status.EXISTING, Finding.Status.NEW);

        int iacCritical = countFindings(findings, Finding.Source.IAC, Finding.Severity.CRITICAL, Finding.Status.EXISTING, Finding.Status.NEW);
        int iacHigh = countFindings(findings, Finding.Source.IAC, Finding.Severity.HIGH, Finding.Status.EXISTING, Finding.Status.NEW);
        int iacMedium = countFindings(findings, Finding.Source.IAC, Finding.Severity.MEDIUM, Finding.Status.EXISTING, Finding.Status.NEW);
        int iacLow = countFindings(findings, Finding.Source.IAC, Finding.Severity.LOW, Finding.Status.EXISTING, Finding.Status.NEW);

        int secretsCritical = countFindings(findings, Finding.Source.SECRETS, Finding.Severity.CRITICAL, Finding.Status.EXISTING, Finding.Status.NEW);
        int secretsHigh = countFindings(findings, Finding.Source.SECRETS, Finding.Severity.HIGH, Finding.Status.EXISTING, Finding.Status.NEW);
        int secretsMedium = countFindings(findings, Finding.Source.SECRETS, Finding.Severity.MEDIUM, Finding.Status.EXISTING, Finding.Status.NEW);
        int secretsLow = countFindings(findings, Finding.Source.SECRETS, Finding.Severity.LOW, Finding.Status.EXISTING, Finding.Status.NEW);

        int totalCritical = sastCritical + scaCritical + iacCritical + secretsCritical;
        int totalHigh = sastHigh + scaHigh + iacHigh + secretsHigh;
        int critAndHigh = totalCritical + totalHigh;

        String status;
        if (critAndHigh > 5) {
            status = "🚨 Danger";
        } else if (critAndHigh > 0) {
            status = "⚠️ Warning";
        } else {
            status = "✅ Passed";
        }

        List<Finding> topCriticalFindings = getTopCriticalFindings(findings);
        boolean scaEnabled = !codeRepo.getIacScan().equals(CodeRepo.ScanStatus.NOT_PERFORMED);
        String detailsLink = (frontendUrl.startsWith("http") ? "" : "https://") + frontendUrl + "#/show-repo/" + codeRepo.getId();

        String message = generateSecurityReport(
                status, critAndHigh,
                sastCritical, sastHigh, sastMedium, sastLow,
                secretsCritical, secretsHigh, secretsMedium, secretsLow,
                iacCritical, iacHigh, iacMedium, iacLow,
                scaEnabled, scaCritical, scaHigh, scaMedium, scaLow,
                topCriticalFindings, detailsLink);

        if (codeRepo.getType().equals(CodeRepo.RepoType.GITLAB)) {
            log.info("[Git Comment Service] About to put comment for Merge Request for {}", codeRepo.getName());
            gitLabApiClientService.commentMergeRequest(codeRepo, iid, message).block();
        } else if (codeRepo.getType().equals(CodeRepo.RepoType.GITHUB)) {
            log.info("[Git Comment Service] About to put comment for Pull Request for {}", codeRepo.getName());
            gitHubApiClientService.commentMergeRequest(codeRepo, iid, message).block();
        } else if (codeRepo.getType().equals(CodeRepo.RepoType.BITBUCKET)) {
            log.info("[Git Comment Service] About to put comment for Pull Request for {}", codeRepo.getName());
            bitbucketApiClientService.commentPullRequest(codeRepo, iid, message).block();
        }
    }

    private List<Finding> getTopCriticalFindings(List<Finding> findings) {
        Comparator<Finding> severityOrder = Comparator.comparingInt(f -> {
            switch (f.getSeverity()) {
                case CRITICAL: return 0;
                case HIGH: return 1;
                default: return 2;
            }
        });

        return findings.stream()
                .filter(f -> f.getStatus() == Finding.Status.NEW || f.getStatus() == Finding.Status.EXISTING)
                .filter(f -> f.getSeverity() == Finding.Severity.CRITICAL || f.getSeverity() == Finding.Severity.HIGH)
                .sorted(severityOrder)
                .limit(TOP_FINDINGS_LIMIT)
                .collect(Collectors.toList());
    }

    private String generateSecurityReport(String status, int critAndHigh,
                                          int sastCrit, int sastHigh, int sastMedium, int sastLow,
                                          int secretsCrit, int secretsHigh, int secretsMedium, int secretsLow,
                                          int iacCrit, int iacHigh, int iacMedium, int iacLow,
                                          boolean scaEnabled, int scaCrit, int scaHigh, int scaMedium, int scaLow,
                                          List<Finding> topCriticalFindings, String detailsLink) {
        StringBuilder sb = new StringBuilder();

        sb.append("## 🔒 Flow Security Scan\n\n");
        sb.append(String.format("**Status:** %s", status));
        if (critAndHigh > 0) {
            sb.append(String.format(" — **%d** critical/high issue%s found", critAndHigh, critAndHigh == 1 ? "" : "s"));
        }
        sb.append("\n\n---\n\n");

        sb.append("### Findings Overview\n\n");
        sb.append("| Scanner | 🔴 Critical | 🟠 High | 🟡 Medium | 🔵 Low |\n");
        sb.append("|---------|:-----------:|:-------:|:---------:|:------:|\n");
        sb.append(String.format("| 🛡️ SAST | %d | %d | %d | %d |\n", sastCrit, sastHigh, sastMedium, sastLow));
        sb.append(String.format("| 🔑 Secrets | %d | %d | %d | %d |\n", secretsCrit, secretsHigh, secretsMedium, secretsLow));
        sb.append(String.format("| 🏗️ IaC | %d | %d | %d | %d |\n", iacCrit, iacHigh, iacMedium, iacLow));
        if (scaEnabled) {
            sb.append(String.format("| 📦 SCA | %d | %d | %d | %d |\n", scaCrit, scaHigh, scaMedium, scaLow));
        } else {
            sb.append("| 📦 SCA | — | — | — | — |\n");
        }

        if (!topCriticalFindings.isEmpty()) {
            sb.append("\n---\n\n");
            sb.append("### 🚨 Top Critical & High Findings\n\n");
            sb.append("| # | Severity | Vulnerability | Location |\n");
            sb.append("|:-:|:--------:|---------------|----------|\n");
            for (int i = 0; i < topCriticalFindings.size(); i++) {
                Finding f = topCriticalFindings.get(i);
                String sevIcon = f.getSeverity() == Finding.Severity.CRITICAL ? "🔴 Critical" : "🟠 High";
                String vulnName = f.getVulnerability() != null ? f.getVulnerability().getName() : "Unknown";
                String location = f.getLocation() != null ? truncate(f.getLocation(), 60) : "—";
                sb.append(String.format("| %d | %s | `%s` | `%s` |\n", i + 1, sevIcon, vulnName, location));
            }
        }

        sb.append("\n---\n\n");
        sb.append(String.format("> 🔍 [**View Full Report**](%s)", detailsLink));
        sb.append("\n\n<sub>🤖 Automated by Flow Security Bot</sub>\n");

        return sb.toString();
    }

    private String truncate(String value, int maxLen) {
        if (value.length() <= maxLen) {
            return value;
        }
        return value.substring(0, maxLen - 3) + "...";
    }

    private int countFindings(List<Finding> findings, Finding.Source source, Finding.Severity severity, Finding.Status... statuses) {
        return (int) findings.stream()
                .filter(f -> (source == null || f.getSource() == source) &&
                        (severity == null || f.getSeverity() == severity) &&
                        (statuses.length == 0 || java.util.Arrays.asList(statuses).contains(f.getStatus())))
                .count();
    }

}
