package io.mixeway.mixewayflowapi.integrations.repo.service;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.domain.finding.FindFindingService;
import io.mixeway.mixewayflowapi.integrations.repo.apiclient.GitHubApiClientService;
import io.mixeway.mixewayflowapi.integrations.repo.apiclient.GitLabApiClientService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.MalformedURLException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Log4j2
public class GitCommentService {
    private final FindFindingService findFindingService;
    @Value("${frontend.url}")
    String frontendUrl;
    private final GitLabApiClientService gitLabApiClientService;
    private final GitHubApiClientService gitHubApiClientService;



    public void processMergeComment(CodeRepo codeRepo, CodeRepoBranch codeRepoBranch, Long iid) throws MalformedURLException {
        List<Finding> findings = findFindingService.getCodeRepoFindings(codeRepo, codeRepoBranch);

        int sastCritical = countFindings(findings, Finding.Source.SAST, Finding.Severity.CRITICAL, Finding.Status.EXISTING, Finding.Status.NEW);
        int sastHigh = countFindings(findings, Finding.Source.SAST, Finding.Severity.HIGH, Finding.Status.EXISTING, Finding.Status.NEW);
        int sastRest = countRestFindings(findings, Finding.Source.SAST, Finding.Status.EXISTING, Finding.Status.NEW);

        int scaCritical = countFindings(findings, Finding.Source.SCA, Finding.Severity.CRITICAL, Finding.Status.EXISTING, Finding.Status.NEW);
        int scaHigh = countFindings(findings, Finding.Source.SCA, Finding.Severity.HIGH, Finding.Status.EXISTING, Finding.Status.NEW);
        int scaRest = countRestFindings(findings, Finding.Source.SCA, Finding.Status.EXISTING, Finding.Status.NEW);

        int iacCritical = countFindings(findings, Finding.Source.IAC, Finding.Severity.CRITICAL, Finding.Status.EXISTING, Finding.Status.NEW);
        int iacHigh = countFindings(findings, Finding.Source.IAC, Finding.Severity.HIGH, Finding.Status.EXISTING, Finding.Status.NEW);
        int iacRest = countRestFindings(findings, Finding.Source.IAC, Finding.Status.EXISTING, Finding.Status.NEW);

        int secretsCritical = countFindings(findings, Finding.Source.SECRETS, Finding.Severity.CRITICAL, Finding.Status.EXISTING, Finding.Status.NEW);
        int secretsHigh = countFindings(findings, Finding.Source.SECRETS, Finding.Severity.HIGH, Finding.Status.EXISTING, Finding.Status.NEW);
        int secretsRest = countRestFindings(findings, Finding.Source.SECRETS, Finding.Status.EXISTING, Finding.Status.NEW);
        String status ="";
        int critAndHigh = sastCritical + sastHigh + scaCritical + scaHigh + iacCritical + iacHigh + secretsCritical + secretsHigh;
        if (critAndHigh > 5) {
            status = "Danger 🚨🚨";
        } else if (critAndHigh > 0 && critAndHigh < 5) {
            status = "Warning ⚠ ⚠";
        } else {
            status = "OK ✅✅";
        }
        String message = generateSecurityReport(status, sastCritical, sastHigh, sastRest,
                secretsCritical, secretsHigh, secretsRest, iacCritical, iacHigh, iacRest,
                !codeRepo.getIacScan().equals(CodeRepo.ScanStatus.NOT_PERFORMED),scaCritical, scaHigh, scaRest,
                (frontendUrl.startsWith("http") ? "":"https://") + frontendUrl+"#/show-repo/"+codeRepo.getId());
        if (codeRepo.getType().equals(CodeRepo.RepoType.GITLAB)){
            log.info("[Git Comment Service] About to put comment for Merge Request for {}", codeRepo.getName());
            gitLabApiClientService.commentMergeRequest(codeRepo, iid, message).block();
        } else if (codeRepo.getType().equals(CodeRepo.RepoType.GITHUB)){
            log.info("[Git Comment Service] About to put comment for Pull Request for {}", codeRepo.getName());
            gitHubApiClientService.commentMergeRequest(codeRepo, iid, message).block();
        }

    }


    private String generateSecurityReport(String status, int sastCrit, int sastHigh, int sastRest,
                                          int secretsCrit, int secretsHigh, int secretsRest,
                                          int iacCrit, int iacHigh, int iacRest,
                                          boolean scaEnabled, Integer scaCrit, Integer scaHigh, Integer scaRest, String detailsLink) {
        // Conditional SCA Section
        String scaSection;
        if (scaEnabled) {
            scaSection = String.format(
                    "📦 **SCA**: Critical: %d, High: %d\n",
                    scaCrit, scaHigh);
        } else {
            scaSection = "📦 **SCA**: Scan not performed.\n";
        }

        // Build the report
        return String.format(
                "# 🔒 Security Bot Report\n" +
                        "**Outcome**: %s\n\n" +
                        "## Scan Summary:\n" +
                        "🛡️ **SAST**: Critical: %d, High: %d\n" +
                        "🔑 **Secrets**: Critical: %d, High: %d\n" +
                        "🏗️ **IAC**: Critical: %d, High: %d\n" +
                        scaSection +
                        "\n[🔍 View Detailed Report](%s)",
                status,
                sastCrit, sastHigh,
                secretsCrit, secretsHigh,
                iacCrit, iacHigh,
                detailsLink);
    }

    private int countFindings(List<Finding> findings, Finding.Source source, Finding.Severity severity, Finding.Status... statuses) {
        return (int) findings.stream()
                .filter(f -> (source == null || f.getSource() == source) &&
                        (severity == null || f.getSeverity() == severity) &&
                        (statuses.length == 0 || java.util.Arrays.asList(statuses).contains(f.getStatus())))
                .count();
    }
    private int countRestFindings(List<Finding> findings, Finding.Source source, Finding.Status... statuses) {
        return (int) findings.stream()
                .filter(f -> f.getSource() == source &&
                        f.getSeverity() != Finding.Severity.CRITICAL &&
                        f.getSeverity() != Finding.Severity.HIGH &&
                        java.util.Arrays.asList(statuses).contains(f.getStatus()))
                .count();
    }

}
