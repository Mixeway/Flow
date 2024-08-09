package io.mixeway.mixewayflowapi.domain.finding;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.entity.Vulnerability;
import io.mixeway.mixewayflowapi.db.repository.FindingRepository;
import io.mixeway.mixewayflowapi.domain.vulnerability.GetOrCreateVulnerabilityService;
import io.mixeway.mixewayflowapi.integrations.scanner.iac.dto.KicsReport;
import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.BearerScanSecurity;
import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;
import io.mixeway.mixewayflowapi.integrations.scanner.secrets.dto.Secret;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

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

    @Transactional
    public void saveFindings(List<Finding> newFindings, CodeRepoBranch repoWhereFindingWasFound, CodeRepo repoInWhichFindingWasFound, Finding.Source source) {
        newFindings = mergeFindings(newFindings);
        List<Finding> existingFindings = findingRepository.findBySourceAndCodeRepoBranchAndCodeRepo(source, repoWhereFindingWasFound, repoInWhichFindingWasFound);

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
                findingRepository.save(existingFinding);
                existingFindingsMap.remove(key);
            } else {
                newFinding.updateStatus(Finding.Status.NEW, null);
                findingRepository.save(newFinding);
            }
        }

        // Mark remaining existing findings as REMOVED
        for (Finding remainingFinding : existingFindingsMap.values()) {
            if (remainingFinding.getStatus() != Finding.Status.SUPRESSED) {
                remainingFinding.updateStatus(Finding.Status.REMOVED, null);
                findingRepository.save(remainingFinding);
            }
        }
    }

    private String findingKey(Finding finding) {
        return finding.getVulnerability().getName() + "|" + finding.getSeverity() + "|" + finding.getLocation();
    }

    public List<Finding> mapSecretsToFindings(List<Secret> secrets, CodeRepoBranch codeRepoBranch, CodeRepo codeRepo) {
        return secrets.stream().map(secret -> {
            Vulnerability vulnerability = getOrCreateVulnerabilityService.getOrCreate(secret.getDescription(), null, null, null, null);
            return new Finding(
                    vulnerability,
                    null,
                    codeRepoBranch,
                    codeRepo,
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
                        .map(fileIssue -> {
                            Vulnerability vulnerability = getOrCreateVulnerabilityService.getOrCreate(
                                    query.getQueryName(),
                                    query.getDescription(),
                                    query.getQueryUrl(),
                                    null,
                                    null
                            );
                            return new Finding(
                                    vulnerability,
                                    null,
                                    codeRepoBranch,
                                    codeRepo,
                                    fileIssue.getSearchKey() + " - expected: " + fileIssue.getExpectedValue(),
                                    fileIssue.getFileName() + ":" + fileIssue.getLine(),
                                    mapSeverity(query.getSeverity()),
                                    Finding.Source.IAC
                            );
                        })
                ).collect(Collectors.toList());
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
            findings.addAll(mapItemsToFindings(scanSecurity.getCritical(), codeRepoBranch, codeRepo, Finding.Severity.CRITICAL));
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

    private List<Finding> mapItemsToFindings(List<Item> items, CodeRepoBranch codeRepoBranch, CodeRepo codeRepo, Finding.Severity severity) {
        return items.stream().map(item -> {
            Vulnerability vulnerability = getOrCreateVulnerabilityService.getOrCreate(item.getTitle(), item.getDescription(), null, item.getDocumentationUrl(), null);
            return new Finding(
                    vulnerability,
                    null,
                    codeRepoBranch,
                    codeRepo,
                    "Code where problem is found: " + item.getCodeExtract(),
                    item.getFilename() + ":" + item.getLineNumber(),
                    severity,
                    Finding.Source.SAST
            );
        }).collect(Collectors.toList());
    }
}
