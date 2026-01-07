package io.mixeway.mixewayflowapi.domain.finding;

import io.mixeway.mixewayflowapi.db.entity.*;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoRepository;
import io.mixeway.mixewayflowapi.db.repository.FindingRepository;
import io.mixeway.mixewayflowapi.domain.coderepo.UpdateCodeRepoService;
import io.mixeway.mixewayflowapi.domain.component.GetOrCreateComponentService;
import io.mixeway.mixewayflowapi.domain.suppressrule.CheckSuppressRuleService;
import io.mixeway.mixewayflowapi.domain.vulnerability.GetOrCreateVulnerabilityService;
import io.mixeway.mixewayflowapi.integrations.scanner.cloud_scanner.dto.CloudIssueReport;
import io.mixeway.mixewayflowapi.integrations.scanner.cloud_scanner.dto.CloudScannerReport;
import io.mixeway.mixewayflowapi.integrations.scanner.iac.dto.KicsReport;
import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.BearerScanSecurity;
import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;
import io.mixeway.mixewayflowapi.integrations.scanner.sca.dto.GrypeReport;
import io.mixeway.mixewayflowapi.integrations.scanner.secrets.dto.Secret;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class CreateFindingService {
    private final FindingRepository findingRepository;
    private final GetOrCreateVulnerabilityService getOrCreateVulnerabilityService;
    private final CheckSuppressRuleService checkSuppressRuleService;
    private final GetOrCreateComponentService getOrCreateComponentService;
    private final UpdateCodeRepoService updateCodeRepoService;
    private final CodeRepoRepository codeRepoRepository;

    @Transactional
    public void saveFindings(List<Finding> newFindings, CodeRepoBranch repoWhereFindingWasFound, CodeRepo repoInWhichFindingWasFound, Finding.Source source, CloudSubscription cloudSubscription) {
        newFindings = mergeFindings(newFindings);
        List<Finding> existingFindings;

        // Handle different types of findings based on source
        if (source == Finding.Source.CLOUD_SCANNER || source == Finding.Source.CLOUD_ISSUE) {
            existingFindings = findingRepository.findBySourceAndCloudSubscription(source, cloudSubscription);
        } else {
            existingFindings = findingRepository.findBySourceAndCodeRepoBranchAndCodeRepo(source, repoWhereFindingWasFound, repoInWhichFindingWasFound);
        }
        // Create a map for quick lookup of existing findings by key (vulnerability, severity, location)
        var existingFindingsMap = existingFindings.stream()
                .collect(Collectors.toMap(this::findingKey, finding -> finding));

        // Update or create new findings
        for (Finding newFinding : newFindings) {
            String key = findingKey(newFinding);
            if (existingFindingsMap.containsKey(key)) {
                Finding existingFinding = existingFindingsMap.get(key);
                if (existingFinding.getStatus() == Finding.Status.REMOVED) {
                    existingFinding.updateStatus(Finding.Status.EXISTING, existingFinding.getSuppressedReason());
                } else if (existingFinding.getStatus() != Finding.Status.SUPRESSED) {
                    existingFinding.updateStatus(Finding.Status.EXISTING, existingFinding.getSuppressedReason());
                }
                existingFinding.noteFindingDetected();  // Ensure updatedDate is always updated
                findingRepository.saveAndFlush(existingFinding);
                existingFindingsMap.remove(key);
            } else {
                // Auto-suppress across branches: if (repo, vuln, location) is already SUPRESSED in any branch, inherit that state
                if (repoInWhichFindingWasFound != null) {
                    Finding exemplar = findingRepository.findFirstByCodeRepoAndVulnerabilityAndLocationAndStatus(
                            repoInWhichFindingWasFound,
                            newFinding.getVulnerability(),
                            newFinding.getLocation(),
                            Finding.Status.SUPRESSED
                    );
                    if (exemplar != null) {
                        newFinding.updateStatus(Finding.Status.SUPRESSED, exemplar.getSuppressedReason());
                    } else {
                        newFinding.updateStatus(Finding.Status.NEW, null);
                    }
                } else {
                    newFinding.updateStatus(Finding.Status.NEW, null);
                }
                checkSuppressRuleService.validate(findingRepository.saveAndFlush(newFinding));
            }
        }

        // Mark remaining existing findings as REMOVED
        for (Finding remainingFinding : existingFindingsMap.values()) {
            if (remainingFinding.getStatus() != Finding.Status.SUPRESSED) {
                remainingFinding.updateStatus(Finding.Status.REMOVED, null);
                findingRepository.saveAndFlush(remainingFinding);
            }
        }
        if (repoInWhichFindingWasFound != null) {
            log.info("[Finding Service] Saved {} findings for {}. Source: {}", newFindings.size(), repoInWhichFindingWasFound.getName(), source.toString());
        } else {
            log.info("[Finding Service] Saved {} findings. Source: {}", newFindings.size(), source.toString());
        }

    }

    private String findingKey(Finding finding) {
        Long vulnId = finding.getVulnerability() != null ? finding.getVulnerability().getId() : null;
        return vulnId + "|" + finding.getSeverity() + "|" + finding.getLocation();
    }

    public List<Finding> mapSecretsToFindings(List<Secret> secrets, CodeRepoBranch codeRepoBranch, CodeRepo codeRepo) {
        return secrets.stream().map(secret -> {
            Vulnerability vulnerability = getOrCreateVulnerabilityService.getOrCreate(secret.getDescription(), null, null, null, null, null, null, null);
            return new Finding(
                    vulnerability,
                    null,
                    codeRepoBranch,
                    codeRepo,
                    null,
                    "Found Secret in file " + secret.getFile() + ". Full fingerprint: " + secret.getFingerprint(),
                    secret.getFile() + ":" + secret.getStartLine(),
                    Finding.Severity.CRITICAL,
                    Finding.Source.SECRETS
            );
        }).collect(Collectors.toList());
    }

    public List<Finding> mapKicsReportToFindings(KicsReport kicsReport, CodeRepo codeRepo, CodeRepoBranch codeRepoBranch) {
        return kicsReport.getQueries().stream()
                .flatMap(query -> query.getFiles().stream()
                        .filter(fileIssue ->
                                !("Privilege Escalation Allowed".equals(query.getQueryName()) && fileIssue.getActualValue() != null && fileIssue.getActualValue().contains("allowPrivilegeEscalation is undefined")))
                        .map(fileIssue -> {
                            Vulnerability vulnerability = getOrCreateVulnerabilityService.getOrCreate(
                                    query.getQueryName(),
                                    query.getDescription(),
                                    query.getQueryUrl(),
                                    null,
                                    null,
                                    null,
                                    null,
                                    null
                            );
                            return new Finding(
                                    vulnerability,
                                    null,
                                    codeRepoBranch,
                                    codeRepo,
                                    null,
                                    fileIssue.getSearchKey() + " - expected: " + fileIssue.getExpectedValue(),
                                    fileIssue.getFileName() + ":" + fileIssue.getLine(),
                                    mapSeverity(query.getSeverity()),
                                    Finding.Source.IAC
                            );
                        })
                ).collect(Collectors.toList());
    }

    public List<Finding> mapCloudScannerReportToFindings(CloudScannerReport cloudScannerReport, CloudSubscription cloudSubscription) {
        return cloudScannerReport.getData().getVulnerabilityFindings().getNodes().stream()
                .map(node -> {
                    Vulnerability vulnerability = getOrCreateVulnerabilityService.getOrCreate(
                            node.getName(),
                            node.getCveDescription(),
                            null,
                            node.getRemediation(),
                            mapSeverity(node.getSeverity()),
                            node.getEpssProbability(),
                            node.getEpssPercentile(),
                            node.getHasExploit()
                    );
                    return new Finding(
                            vulnerability,
                            null,
                            null,
                            null,
                            cloudSubscription,
                            "Vulnerable Asset: " + node.getVulnerableAsset().getName() +
                                    ", Vulnerability in: " + node.getDetailedName() +
                                    ", Version: " + node.getVersion() +
                                    ", Fixed Version: " + node.getFixedVersion(),
                            node.getVulnerableAsset().getName() + ":" + node.getDetailedName(),
                            mapSeverity(node.getSeverity()),
                            Finding.Source.CLOUD_SCANNER
                    );
                })
                .collect(Collectors.toList());
    }

    public List<Finding> mapCloudIssueReportToFindings(CloudIssueReport cloudIssueReport, CloudSubscription cloudSubscription) {
        return cloudIssueReport.getData().getIssuesV2().getNodes().stream()
                .map(node -> {
                    Vulnerability vulnerability = getOrCreateVulnerabilityService.getOrCreate(
                            node.getSourceRules().get(0).getName(),
                            node.getSourceRules().get(0).getDescription(),
                            null,
                            node.getSourceRules().get(0).getResolutionRecommendationPlainText(),
                            mapSeverity(node.getSeverity()),
                            null,
                            null,
                            node.getValidatedAsExploitable()
                    );
                    return new Finding(
                            vulnerability,
                            null,
                            null,
                            null,
                            cloudSubscription,
                            "Vulnerable Asset: " + node.getEntitySnapshot().getName() +
                                    ", Vulnerable Asset Type: " + node.getEntitySnapshot().getType() +
                                    ", Issue Type: " + node.getType(),
                            node.getEntitySnapshot().getName(),
                            mapSeverity(node.getSeverity()),
                            Finding.Source.CLOUD_ISSUE
                    );
                })
                .collect(Collectors.toList());
    }

    public Finding mapGitLabScannerReportToFindings(CodeRepo codeRepo, CodeRepoBranch codeRepoBranch, String name, String severity, String explanation, String location, String description, String remediation) {
        Vulnerability vulnerability = getOrCreateVulnerabilityService.getOrCreate(
                name,
                description,
                null,
                remediation,
                mapSeverity(severity),
                null,
                null,
                null
        );

        return new Finding(
                vulnerability,
                null,
                codeRepoBranch,
                codeRepo,
                null,
                explanation == null ? "Incorrect configuration of " + location : explanation,
                location,
                mapSeverity(severity),
                Finding.Source.GITLAB_SCANNER
        );
    }

    private Finding.Severity mapSeverity(String severity) {
        return switch (severity.toUpperCase()) {
            case "CRITICAL" -> Finding.Severity.CRITICAL;
            case "HIGH" -> Finding.Severity.HIGH;
            case "MEDIUM" -> Finding.Severity.MEDIUM;
            case "LOW" -> Finding.Severity.LOW;
            case "INFO" -> Finding.Severity.INFO;
            default -> throw new IllegalArgumentException("Unknown severity: " + severity);
        };
    }

    private List<Finding> mergeFindings(List<Finding> findings) {
        // Use a LinkedHashMap to preserve the order of insertion
        Map<String, Finding> mergedFindingsMap = new LinkedHashMap<>();

        for (Finding finding : findings) {
            String key = generateKey(finding);
            if (!mergedFindingsMap.containsKey(key)) {
                mergedFindingsMap.put(key, finding);
            } else {
                // Merge logic: Assuming merging means combining data, adjust as necessary
                Finding existingFinding = mergedFindingsMap.get(key);
                // Adjust merging logic here if needed
            }
        }

        return new ArrayList<>(mergedFindingsMap.values());
    }

    private String generateKey(Finding finding) {
        return finding.getLocation() + "|" + finding.getVulnerability().getId();
    }

    public List<Finding> mapBearerScanToFindings(BearerScanSecurity scanSecurity, CodeRepo codeRepo, CodeRepoBranch codeRepoBranch) {
        List<Finding> findings = new ArrayList<>();

        if (scanSecurity.getCritical() != null) {
            findings.addAll(mapItemsToFindings(
                    scanSecurity.getCritical().stream()
                            .filter(item -> !item.getTitle().equals("Usage of hard-coded secret"))
                            .toList(),
                    codeRepoBranch,
                    codeRepo, Finding.Severity.CRITICAL));
        }
        if (scanSecurity.getHigh() != null) {
            findings.addAll(mapItemsToFindings(scanSecurity.getHigh(), codeRepoBranch, codeRepo, Finding.Severity.HIGH));
        }
        if (scanSecurity.getMedium() != null) {
            findings.addAll(mapItemsToFindings(scanSecurity.getMedium(), codeRepoBranch, codeRepo, Finding.Severity.MEDIUM));
        }
        if (scanSecurity.getLow() != null) {
            findings.addAll(mapItemsToFindings(scanSecurity.getLow(), codeRepoBranch, codeRepo, Finding.Severity.LOW));
        }

        return findings;
    }

    @Transactional
    public void processGrypeComponents(GrypeReport grypeReport, CodeRepo codeRepo) {
        CodeRepo managedRepo = codeRepoRepository.findById(codeRepo.getId())
                .orElseThrow(() -> new IllegalArgumentException("CodeRepo not found"));

        List<Component> components = grypeReport.getMatches().stream()
                .map(match -> getOrCreateComponentService.getOrCreate(
                        match.getArtifact().getName(),
                        match.getArtifact().getType(),
                        match.getArtifact().getVersion(),
                        "nvd"
                ))
                .distinct()
                .toList();

        updateCodeRepoService.updateComponents(components, managedRepo);
    }


    @Transactional
    public List<Finding> mapGrypeReportToFindings(GrypeReport grypeReport, CodeRepo codeRepo, CodeRepoBranch codeRepoBranch) {
        List<Finding> findings = new ArrayList<>();

        for (GrypeReport.Match match : grypeReport.getMatches()) {
            GrypeReport.Vulnerability vuln = match.getVulnerability();
            GrypeReport.Artifact artifact = match.getArtifact();

            Component component = getOrCreateComponentService.getOrCreate(
                    artifact.getName(),
                    artifact.getType(),
                    artifact.getVersion(),
                    "nvd"
            );

            BigDecimal epssProbability = null;
            BigDecimal epssPercentile = null;
            if (vuln.getEpss() != null && !vuln.getEpss().isEmpty()) {
                epssProbability = BigDecimal.valueOf(vuln.getEpss().get(0).getEpss());
                epssPercentile = BigDecimal.valueOf(vuln.getEpss().get(0).getPercentile());
            }

            String recommendation = null;
            if (vuln.getFix() != null && vuln.getFix().getVersions() != null && !vuln.getFix().getVersions().isEmpty()) {
                recommendation = "Update package to version " + vuln.getFix().getVersions().get(0);
            }

            Vulnerability vulnerability = getOrCreateVulnerabilityService.getOrCreate(
                    vuln.getId(),
                    vuln.getDescription(),
                    vuln.getDataSource(),
                    recommendation,
                    mapSeverity(vuln.getSeverity()),
                    epssProbability,
                    epssPercentile,
                    null
            );

            Hibernate.initialize(vulnerability.getComponents());
            if (!vulnerability.getComponents().contains(component)) {
                vulnerability.getComponents().add(component);
            }

            String location = (artifact.getName() != null ? artifact.getName() : "") +
                    (artifact.getVersion() != null ? ":" + artifact.getVersion() : "");

            Finding finding = new Finding(
                    vulnerability,
                    component,
                    codeRepoBranch,
                    codeRepo,
                    null,
                    vuln.getDescription(),
                    location,
                    mapSeverity(vuln.getSeverity()),
                    Finding.Source.SCA
            );
            findings.add(finding);
        }

        return findings;
    }

    private List<Finding> mapItemsToFindings(List<Item> items, CodeRepoBranch codeRepoBranch, CodeRepo codeRepo, Finding.Severity severity) {
        return items.stream().map(item -> {
            Vulnerability vulnerability = getOrCreateVulnerabilityService.getOrCreate(item.getTitle(), item.getDescription(), null, item.getDocumentationUrl(), null, null, null, null);
            return new Finding(
                    vulnerability,
                    null,
                    codeRepoBranch,
                    codeRepo,
                    null,
                    "Code where problem is found: " + item.getCodeExtract(),
                    item.getFilename() + ":" + item.getLineNumber(),
                    severity,
                    Finding.Source.SAST
            );
        }).collect(Collectors.toList());
    }
}