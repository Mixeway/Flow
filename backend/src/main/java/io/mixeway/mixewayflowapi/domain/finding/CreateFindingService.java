package io.mixeway.mixewayflowapi.domain.finding;

import io.mixeway.mixewayflowapi.db.entity.*;
import io.mixeway.mixewayflowapi.db.projection.SuppressedFindingProjection;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoRepository;
import io.mixeway.mixewayflowapi.db.repository.FindingRepository;
import io.mixeway.mixewayflowapi.domain.coderepo.UpdateCodeRepoService;
import io.mixeway.mixewayflowapi.domain.component.GetOrCreateComponentService;
import io.mixeway.mixewayflowapi.domain.jira.JiraTicketLifecycleService;
import io.mixeway.mixewayflowapi.domain.jira.NewFindingsEvent;
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
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.IdentityHashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class CreateFindingService {
    private static final String AI_FALSE_POSITIVE_COMMENT = "Assessed and suppressed by AI";

    private final FindingRepository findingRepository;
    private final GetOrCreateVulnerabilityService getOrCreateVulnerabilityService;
    private final CheckSuppressRuleService checkSuppressRuleService;
    private final GetOrCreateComponentService getOrCreateComponentService;
    private final UpdateCodeRepoService updateCodeRepoService;
    private final CodeRepoRepository codeRepoRepository;
    private final JiraTicketLifecycleService jiraTicketLifecycleService;
    private final ApplicationEventPublisher eventPublisher;

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
        for (Finding newFinding : newFindings) {
            if (newFinding.getFingerprint() == null) {
                newFinding.identifyBy(FindingFingerprint.of(newFinding));
            }
        }
        // Create a map for quick lookup of existing findings by key (vulnerability, severity, location)
        var existingFindingsMap = existingFindings.stream()
                .collect(Collectors.toMap(this::findingKey, finding -> finding));
        // Edits elsewhere in a file move a finding to another line; it is still the same finding.
        Map<Finding, Finding> movedFindings = findMovedFindings(newFindings, existingFindingsMap);

        // A suppression is a decision about a vulnerability at a location in the repository, not about
        // one branch: whatever was reviewed on a feature branch has to stay suppressed after the merge.
        RepoSuppressions repoSuppressions = loadRepoSuppressions(repoInWhichFindingWasFound);
        Map<String, Long> scannedPerIdentity = newFindings.stream()
                .map(this::identityKey)
                .filter(java.util.Objects::nonNull)
                .collect(Collectors.groupingBy(identity -> identity, Collectors.counting()));
        int inheritedSuppressions = 0;
        int relocatedFindings = 0;

        // Update or create new findings
        List<Finding> findingsForJira = new ArrayList<>();
        for (Finding newFinding : newFindings) {
            Finding existingFinding = existingFindingsMap.remove(findingKey(newFinding));
            if (existingFinding == null && movedFindings.containsKey(newFinding)) {
                existingFinding = movedFindings.get(newFinding);
                existingFindingsMap.remove(findingKey(existingFinding));
                existingFinding.relocate(newFinding.getLocation(), newFinding.getExplanation());
                relocatedFindings++;
            }
            if (existingFinding != null) {
                existingFinding.identifyBy(newFinding.getFingerprint());
                if (existingFinding.getStatus() != Finding.Status.SUPRESSED) {
                    existingFinding.updateStatus(Finding.Status.EXISTING, null);
                    // The finding was already known on this branch when the same one got suppressed on another.
                    if (inheritSuppressionAtSameLocation(existingFinding, repoSuppressions)) {
                        inheritedSuppressions++;
                        jiraTicketLifecycleService.onFindingSuppressed(existingFinding);
                    }
                }
                existingFinding.copyAiVerificationFrom(newFinding);
                applyAiFalsePositive(existingFinding);
                existingFinding.noteFindingDetected();  // Ensure updatedDate is always updated
                findingRepository.saveAndFlush(existingFinding);
                // Include existing findings without a JIRA ticket (e.g. JIRA integration enabled after scans started)
                if (existingFinding.getStatus() == Finding.Status.EXISTING
                        && (existingFinding.getJiraTicketKey() == null || existingFinding.getJiraTicketKey().isBlank())) {
                    findingsForJira.add(existingFinding);
                }
            } else {
                // Auto-suppress across branches: if (repo, vuln, location) is already SUPRESSED in any branch, inherit that state
                newFinding.updateStatus(Finding.Status.NEW, null);
                if (inheritSuppressionAtSameLocation(newFinding, repoSuppressions)
                        || inheritSuppressionOfMovedCode(newFinding, repoInWhichFindingWasFound, repoSuppressions, scannedPerIdentity)) {
                    inheritedSuppressions++;
                }
                applyAiFalsePositive(newFinding);
                Finding savedFinding = findingRepository.saveAndFlush(newFinding);
                checkSuppressRuleService.validate(savedFinding);
                if (savedFinding.getStatus() == Finding.Status.NEW) {
                    findingsForJira.add(savedFinding);
                }
            }
        }

        // Publish event for auto JIRA ticket creation (processed after transaction commits)
        // Includes both NEW findings and EXISTING findings without a JIRA ticket
        if (!findingsForJira.isEmpty()) {
            List<Long> findingIds = findingsForJira.stream()
                    .map(Finding::getId)
                    .collect(Collectors.toList());
            eventPublisher.publishEvent(new NewFindingsEvent(findingIds));
        }

        // Mark remaining existing findings as REMOVED
        for (Finding remainingFinding : existingFindingsMap.values()) {
            if (remainingFinding.getStatus() != Finding.Status.SUPRESSED) {
                remainingFinding.updateStatus(Finding.Status.REMOVED, null);
                findingRepository.saveAndFlush(remainingFinding);
                jiraTicketLifecycleService.onFindingRemoved(remainingFinding);
            }
        }
        if (repoInWhichFindingWasFound != null) {
            log.info("[Finding Service] Saved {} findings for {}. Source: {}", newFindings.size(), repoInWhichFindingWasFound.getName(), source.toString());
            if (relocatedFindings > 0) {
                log.info("[Finding Service] {} finding(s) in {} recognised at a new line of the same file. Source: {}",
                        relocatedFindings, repoInWhichFindingWasFound.getName(), source);
            }
            if (inheritedSuppressions > 0) {
                log.info("[Finding Service] {} finding(s) in {} inherited a suppression made on another branch. Source: {}",
                        inheritedSuppressions, repoInWhichFindingWasFound.getName(), source);
            }
        } else {
            log.info("[Finding Service] Saved {} findings. Source: {}", newFindings.size(), source.toString());
        }

    }

    /**
     * Pairs findings the scan reports at a location where the branch had none with the known finding
     * they are: same vulnerability, severity and fingerprint, and no longer reported where it used to be.
     * A pair is made only when it is the single possibility on both sides; identical code flagged twice
     * in a file cannot be told apart, and guessing could hand a suppression to the wrong occurrence.
     */
    private Map<Finding, Finding> findMovedFindings(List<Finding> scanned, Map<String, Finding> knownByKey) {
        Set<String> scannedKeys = scanned.stream().map(this::findingKey).collect(Collectors.toSet());
        Map<String, List<Finding>> appeared = scanned.stream()
                .filter(finding -> !knownByKey.containsKey(findingKey(finding)) && movedKey(finding) != null)
                .collect(Collectors.groupingBy(this::movedKey));
        Map<String, List<Finding>> disappeared = knownByKey.values().stream()
                .filter(finding -> !scannedKeys.contains(findingKey(finding)) && movedKey(finding) != null)
                .collect(Collectors.groupingBy(this::movedKey));

        // Scanned findings have no id yet and would all be equal to each other.
        Map<Finding, Finding> moved = new IdentityHashMap<>();
        appeared.forEach((identity, findings) -> {
            if (findings.size() != 1) {
                return;
            }
            List<Finding> candidates = disappeared.getOrDefault(identity, List.of());
            // A finding removed long ago may have left a row behind; the one still alive is the one that moved.
            List<Finding> alive = candidates.stream().filter(finding -> finding.getStatus() != Finding.Status.REMOVED).toList();
            if (alive.size() == 1) {
                moved.put(findings.get(0), alive.get(0));
            } else if (alive.isEmpty() && candidates.size() == 1) {
                moved.put(findings.get(0), candidates.get(0));
            }
        });
        return moved;
    }

    private String movedKey(Finding finding) {
        String fingerprint = FindingFingerprint.of(finding);
        if (fingerprint == null || finding.getVulnerability() == null) {
            return null;
        }
        return finding.getVulnerability().getId() + "|" + finding.getSeverity() + "|" + fingerprint;
    }

    /** Suppressions in force in the repository: by vulnerability and location, and by vulnerability and fingerprint. */
    private record RepoSuppressions(Map<String, SuppressedFindingProjection> byLocation,
                                    Map<String, SuppressedFindingProjection> byFingerprint) {
    }

    private RepoSuppressions loadRepoSuppressions(CodeRepo codeRepo) {
        RepoSuppressions suppressions = new RepoSuppressions(new HashMap<>(), new HashMap<>());
        if (codeRepo == null) {
            return suppressions;
        }
        LocalDate today = LocalDate.now();
        for (SuppressedFindingProjection suppressed : findingRepository.findSuppressedInRepo(codeRepo)) {
            if (isInForce(suppressed.getSuppressedReason(), suppressed.getSuppressedUntil(), today)) {
                suppressions.byLocation().putIfAbsent(suppressed.getVulnerabilityId() + "|" + suppressed.getLocation(), suppressed);
                if (suppressed.getFingerprint() != null) {
                    suppressions.byFingerprint().putIfAbsent(suppressed.getVulnerabilityId() + "|" + suppressed.getFingerprint(), suppressed);
                }
            }
        }
        return suppressions;
    }

    private boolean inheritSuppressionAtSameLocation(Finding finding, RepoSuppressions repoSuppressions) {
        if (finding.getVulnerability() == null) {
            return false;
        }
        SuppressedFindingProjection suppressed = repoSuppressions.byLocation()
                .get(finding.getVulnerability().getId() + "|" + finding.getLocation());
        if (suppressed == null) {
            return false;
        }
        finding.updateStatus(Finding.Status.SUPRESSED, suppressed.getSuppressedReason(), suppressed.getSuppressedUntil());
        return true;
    }

    /**
     * A merge usually shifts line numbers, so the finding reviewed on the feature branch shows up on the
     * target branch at another line of the same file. It is recognised by its fingerprint - the flagged
     * content being identical. When the scan reports that content more than once in the file there is no
     * telling which occurrence was reviewed, so none of them inherits the suppression.
     */
    private boolean inheritSuppressionOfMovedCode(Finding finding, CodeRepo codeRepo, RepoSuppressions repoSuppressions,
                                                  Map<String, Long> scannedPerIdentity) {
        String identity = identityKey(finding);
        if (codeRepo == null || identity == null || scannedPerIdentity.getOrDefault(identity, 0L) != 1L) {
            return false;
        }
        SuppressedFindingProjection sameFingerprint = repoSuppressions.byFingerprint().get(identity);
        if (sameFingerprint != null) {
            finding.updateStatus(Finding.Status.SUPRESSED, sameFingerprint.getSuppressedReason(), sameFingerprint.getSuppressedUntil());
            return true;
        }
        if (!FindingFingerprint.LINE_BASED_SOURCES.contains(finding.getSource())) {
            return false;
        }
        // Findings suppressed before fingerprints were stored are recognised by their explanation.
        String file = FindingFingerprint.fileOf(finding.getLocation());
        LocalDate today = LocalDate.now();
        for (Finding suppressed : findingRepository.findSuppressedWithSameExplanation(
                codeRepo, finding.getVulnerability(), finding.getSource(), finding.getExplanation())) {
            if (file != null && file.equals(FindingFingerprint.fileOf(suppressed.getLocation()))
                    && isInForce(suppressed.getSuppressedReason(), suppressed.getSuppressedUntil(), today)) {
                finding.updateStatus(Finding.Status.SUPRESSED, suppressed.getSuppressedReason(), suppressed.getSuppressedUntil());
                return true;
            }
        }
        return false;
    }

    /** A temporary suppression expires on its end date, when the scheduler re-activates the finding. */
    private static boolean isInForce(Finding.SuppressedReason reason, LocalDate suppressedUntil, LocalDate today) {
        return reason != null && (suppressedUntil == null || suppressedUntil.isAfter(today));
    }

    /** What a finding is regardless of its line: vulnerability and fingerprint. Null without a fingerprint. */
    private String identityKey(Finding finding) {
        if (finding.getFingerprint() == null || finding.getVulnerability() == null) {
            return null;
        }
        return finding.getVulnerability().getId() + "|" + finding.getFingerprint();
    }

    /**
     * Immediately persists AI verification fields for a single SAST finding identified by its
     * branch + location. Called after each item is verified so that restarts don't discard
     * already-completed verdicts.
     */
    @Transactional
    public void saveAiVerificationForSastItem(String location, CodeRepoBranch codeRepoBranch,
            Finding.AiVerificationGrade grade, Double confidence, String reasoning, String recommendation) {
        saveAiVerification(location, codeRepoBranch, Finding.Source.SAST, grade, confidence, reasoning, recommendation);
    }

    /**
     * Immediately persists AI verification fields for a single finding identified by
     * branch + location + source.
     */
    @Transactional
    public void saveAiVerification(String location, CodeRepoBranch codeRepoBranch, Finding.Source source,
            Finding.AiVerificationGrade grade, Double confidence, String reasoning, String recommendation) {
        if (grade == null || grade == Finding.AiVerificationGrade.NOT_VERIFIED) {
            return;
        }
        List<Finding> findings = findingRepository.findByBranchAndLocationAndSourceExcludingStatus(
                codeRepoBranch, location, source, Finding.Status.REMOVED);
        for (Finding finding : findings) {
            finding.setAiVerification(grade, confidence, reasoning, recommendation);
            applyAiFalsePositive(finding);
            findingRepository.save(finding);
        }
        if (!findings.isEmpty()) {
            log.debug("[Finding Service] Intermediate AI save: {} finding(s) at {} source={} grade={} confidence={}",
                    findings.size(), location, source, grade, confidence);
        }
    }

    /**
     * A false-positive AI verdict suppresses the finding immediately and records who decided it.
     * An existing suppression with a different reason is left unchanged.
     */
    private void applyAiFalsePositive(Finding finding) {
        if (finding.getAiVerificationGrade() != Finding.AiVerificationGrade.FALSE_POSITIVE) {
            return;
        }
        if (finding.getStatus() == Finding.Status.REMOVED) {
            return;
        }
        if (finding.getStatus() != Finding.Status.SUPRESSED) {
            finding.suppress(Finding.SuppressedReason.FALSE_POSITIVE.name());
            jiraTicketLifecycleService.onFindingSuppressed(finding);
        } else if (finding.getSuppressedReason() != Finding.SuppressedReason.FALSE_POSITIVE) {
            return;
        }
        boolean alreadyCommented = finding.getComments().stream()
                .anyMatch(comment -> AI_FALSE_POSITIVE_COMMENT.equals(comment.getMessage()));
        if (!alreadyCommented) {
            finding.addComment(new Comment(AI_FALSE_POSITIVE_COMMENT, finding));
        }
    }

    private String findingKey(Finding finding) {
        Long vulnId = finding.getVulnerability() != null ? finding.getVulnerability().getId() : null;
        return vulnId + "|" + finding.getSeverity() + "|" + finding.getLocation();
    }

    public List<Finding> mapSecretsToFindings(List<Secret> secrets, CodeRepoBranch codeRepoBranch, CodeRepo codeRepo) {
        return secrets.stream().map(secret -> {
            Vulnerability vulnerability = getOrCreateVulnerabilityService.getOrCreate(secret.getDescription(), null, null, null, null, null, null, null);
            Finding finding = new Finding(
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
            finding.identifyBy(FindingFingerprint.ofSecret(secret.getFile(), secret.getRuleId(), secret.getSecret()));
            return finding;
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
                    String baseUrl = "https://app.wiz.io/issues#~(issue~'";
                    String nodeId = node.getId();

                    return new Finding(
                            vulnerability,
                            null,
                            null,
                            null,
                            cloudSubscription,
                            "Vulnerable Asset: " + node.getEntitySnapshot().getName() +
                                    ", Vulnerable Asset Type: " + node.getEntitySnapshot().getType() +
                                    ", Issue Type: " + node.getType() +
                                    ", (Details: " + baseUrl + nodeId + "))",
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
                Finding existingFinding = mergedFindingsMap.get(key);
                existingFinding.copyAiVerificationFrom(finding);
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

            Boolean hasExploit = (vuln.getKnownExploited() != null && !vuln.getKnownExploited().isEmpty());

            Vulnerability vulnerability = getOrCreateVulnerabilityService.getOrCreate(
                    vuln.getId(),
                    vuln.getDescription(),
                    vuln.getDataSource(),
                    recommendation,
                    mapSeverity(vuln.getSeverity()),
                    epssProbability,
                    epssPercentile,
                    hasExploit
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
            Finding finding = new Finding(
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

            if (item.getAiVerdict() != null) {
                Finding.AiVerificationGrade grade = switch (item.getAiVerdict()) {
                    case "TRUE_POSITIVE" -> Finding.AiVerificationGrade.TRUE_POSITIVE;
                    case "FALSE_POSITIVE" -> Finding.AiVerificationGrade.FALSE_POSITIVE;
                    case "UNCERTAIN" -> Finding.AiVerificationGrade.UNCERTAIN;
                    default -> Finding.AiVerificationGrade.NOT_VERIFIED;
                };
                finding.setAiVerification(grade, item.getAiConfidence(), item.getAiReasoning(), item.getAiRecommendation());
            }

            return finding;
        }).collect(Collectors.toList());
    }
}