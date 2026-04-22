package io.mixeway.mixewayflowapi.domain.jira;

import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.entity.JiraConfiguration;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.repository.FindingRepository;
import io.mixeway.mixewayflowapi.db.repository.JiraConfigurationRepository;
import io.mixeway.mixewayflowapi.integrations.jira.apiclient.JiraApiClientService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Handles JIRA ticket lifecycle events triggered by finding status changes.
 * Runs asynchronously to avoid blocking the main suppression/removal flow.
 */
@Service
@RequiredArgsConstructor
@Log4j2
public class JiraTicketLifecycleService {
    private final JiraConfigurationRepository jiraConfigurationRepository;
    private final JiraApiClientService jiraApiClientService;
    private final FindingRepository findingRepository;

    @Async
    public void onFindingSuppressed(Finding finding) {
        closeTicketIfExists(finding, "Finding suppressed. Reason: " + finding.getSuppressedReason());
    }

    @Async
    public void onFindingRemoved(Finding finding) {
        closeTicketIfExists(finding, "Finding no longer detected (marked as REMOVED).");
    }

    /**
     * Listens for NewFindingsEvent AFTER the transaction that created the findings has committed.
     * Runs asynchronously so it doesn't block the caller.
     * Loads findings fresh from DB to ensure lazy associations (codeRepo, team) are accessible.
     */
    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(propagation = Propagation.REQUIRES_NEW, readOnly = true)
    public void handleNewFindingsEvent(NewFindingsEvent event) {
        List<Long> findingIds = event.getFindingIds();
        if (findingIds == null || findingIds.isEmpty()) return;

        log.info("[JIRA Lifecycle] Processing {} new findings for auto-ticket creation", findingIds.size());

        // Load findings fresh from DB with a new transaction/session
        List<Finding> findings = findingRepository.findAllById(findingIds);
        if (findings.isEmpty()) {
            log.warn("[JIRA Lifecycle] No findings found for IDs: {}", findingIds);
            return;
        }

        processNewFindings(findings);
    }

    private void processNewFindings(List<Finding> findings) {
        // Group findings by team, then create grouped tickets per team
        var findingsByTeam = findings.stream()
                .filter(f -> f.getJiraTicketKey() == null || f.getJiraTicketKey().isBlank())
                .filter(f -> resolveTeam(f) != null)
                .collect(Collectors.groupingBy(this::resolveTeam));

        for (var entry : findingsByTeam.entrySet()) {
            Team team = entry.getKey();

            try {
                Optional<JiraConfiguration> configOpt = jiraConfigurationRepository.findByTeam(team);
                if (configOpt.isEmpty()) continue;

                JiraConfiguration config = configOpt.get();
                if (!config.isAutoCreateEnabled()) {
                    log.debug("[JIRA Lifecycle] Auto-create disabled for team {}", team.getName());
                    continue;
                }

                // Filter findings by severity threshold
                List<Finding> eligible = entry.getValue().stream()
                        .filter(f -> severityMeetsThreshold(f.getSeverity().name(), config.getAutoSeverityThreshold()))
                        .collect(Collectors.toList());

                if (eligible.isEmpty()) {
                    log.debug("[JIRA Lifecycle] No findings meet severity threshold {} for team {}",
                            config.getAutoSeverityThreshold(), team.getName());
                    continue;
                }

                log.info("[JIRA Lifecycle] Creating grouped tickets for {} eligible findings (team: {}, threshold: {})",
                        eligible.size(), team.getName(), config.getAutoSeverityThreshold());

                int created = jiraApiClientService.createTicketsGrouped(config, eligible);
                log.info("[JIRA Lifecycle] Auto-created {} grouped tickets for {} findings (team: {})",
                        created, eligible.size(), team.getName());
            } catch (Exception e) {
                log.error("[JIRA Lifecycle] Error auto-creating grouped tickets for team {}: {}",
                        team.getName(), e.getMessage(), e);
            }
        }
    }

    private boolean severityMeetsThreshold(String findingSeverity, String threshold) {
        int findingOrder = severityOrder(findingSeverity);
        int thresholdOrder = severityOrder(threshold);
        return findingOrder <= thresholdOrder;
    }

    private int severityOrder(String severity) {
        if (severity == null) return 5;
        return switch (severity.toUpperCase()) {
            case "CRITICAL" -> 0;
            case "HIGH" -> 1;
            case "MEDIUM" -> 2;
            case "LOW" -> 3;
            case "INFO" -> 4;
            default -> 5;
        };
    }

    private void closeTicketIfExists(Finding finding, String comment) {
        if (finding.getJiraTicketKey() == null || finding.getJiraTicketKey().isBlank()) {
            return;
        }
        try {
            Team team = resolveTeam(finding);
            if (team == null) return;

            Optional<JiraConfiguration> configOpt = jiraConfigurationRepository.findByTeam(team);
            if (configOpt.isEmpty()) {
                log.warn("[JIRA Lifecycle] No JIRA config found for team of finding {}", finding.getId());
                return;
            }

            jiraApiClientService.closeTicket(configOpt.get(), finding.getJiraTicketKey(), comment);
        } catch (Exception e) {
            log.error("[JIRA Lifecycle] Error closing ticket {} for finding {}: {}",
                    finding.getJiraTicketKey(), finding.getId(), e.getMessage());
        }
    }

    private Team resolveTeam(Finding finding) {
        if (finding.getCodeRepo() != null) {
            return finding.getCodeRepo().getTeam();
        }
        if (finding.getCloudSubscription() != null) {
            return finding.getCloudSubscription().getTeam();
        }
        return null;
    }
}
