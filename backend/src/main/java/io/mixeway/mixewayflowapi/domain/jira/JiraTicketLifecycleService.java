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

import java.util.Optional;

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
