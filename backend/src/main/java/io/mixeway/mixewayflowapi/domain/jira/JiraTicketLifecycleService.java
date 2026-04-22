package io.mixeway.mixewayflowapi.domain.jira;

import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.entity.JiraConfiguration;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.repository.JiraConfigurationRepository;
import io.mixeway.mixewayflowapi.integrations.jira.apiclient.JiraApiClientService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

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

    @Async
    public void onFindingSuppressed(Finding finding) {
        closeTicketIfExists(finding, "Finding suppressed. Reason: " + finding.getSuppressedReason());
    }

    @Async
    public void onFindingRemoved(Finding finding) {
        closeTicketIfExists(finding, "Finding no longer detected (marked as REMOVED).");
    }

    /**
     * Automatically creates grouped JIRA tickets for new findings.
     * Findings are grouped by vulnerability name + source + repo (same logic as manual bulk).
     * Only findings meeting the severity threshold are included.
     */
    @Async
    public void onNewFindings(List<Finding> findings) {
        if (findings == null || findings.isEmpty()) return;

        // Group findings by team, then create grouped tickets per team
        var findingsByTeam = findings.stream()
                .filter(f -> f.getJiraTicketKey() == null || f.getJiraTicketKey().isBlank())
                .collect(Collectors.groupingBy(this::resolveTeam));

        for (var entry : findingsByTeam.entrySet()) {
            Team team = entry.getKey();
            if (team == null) continue;

            try {
                Optional<JiraConfiguration> configOpt = jiraConfigurationRepository.findByTeam(team);
                if (configOpt.isEmpty()) continue;

                JiraConfiguration config = configOpt.get();
                if (!config.isAutoCreateEnabled()) continue;

                // Filter findings by severity threshold
                List<Finding> eligible = entry.getValue().stream()
                        .filter(f -> severityMeetsThreshold(f.getSeverity().name(), config.getAutoSeverityThreshold()))
                        .collect(Collectors.toList());

                if (eligible.isEmpty()) continue;

                int created = jiraApiClientService.createTicketsGrouped(config, eligible);
                log.info("[JIRA Lifecycle] Auto-created {} grouped tickets for {} findings (team: {})",
                        created, eligible.size(), team.getName());
            } catch (Exception e) {
                log.error("[JIRA Lifecycle] Error auto-creating grouped tickets for team {}: {}",
                        team.getName(), e.getMessage());
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
