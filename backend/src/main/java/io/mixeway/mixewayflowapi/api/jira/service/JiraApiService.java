package io.mixeway.mixewayflowapi.api.jira.service;

import io.mixeway.mixewayflowapi.api.jira.dto.CreateJiraTicketsResponseDto;
import io.mixeway.mixewayflowapi.api.jira.dto.JiraConfigRequestDto;
import io.mixeway.mixewayflowapi.api.jira.dto.JiraConfigResponseDto;
import io.mixeway.mixewayflowapi.db.entity.*;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.finding.FindFindingService;
import io.mixeway.mixewayflowapi.domain.jira.JiraConfigurationService;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import io.mixeway.mixewayflowapi.integrations.jira.apiclient.JiraApiClientService;
import io.mixeway.mixewayflowapi.utils.PermissionFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class JiraApiService {
    private final JiraConfigurationService jiraConfigurationService;
    private final JiraApiClientService jiraApiClientService;
    private final FindTeamService findTeamService;
    private final FindCodeRepoService findCodeRepoService;
    private final FindFindingService findFindingService;
    private final PermissionFactory permissionFactory;

    public JiraConfigResponseDto getConfiguration(Long teamId, Principal principal) {
        Team team = findTeamService.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));
        permissionFactory.canUserAccessTeam(team, principal);

        Optional<JiraConfiguration> config = jiraConfigurationService.findByTeam(team);
        if (config.isPresent()) {
            return mapToResponseDto(config.get());
        }
        JiraConfigResponseDto dto = new JiraConfigResponseDto();
        dto.setTeamId(teamId);
        dto.setConfigured(false);
        return dto;
    }

    @Transactional
    public JiraConfigResponseDto createConfiguration(Long teamId, JiraConfigRequestDto request, Principal principal) {
        Team team = findTeamService.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));
        permissionFactory.canUserManageTeam(team, principal);

        JiraConfiguration config = jiraConfigurationService.create(
                team,
                normalizeUrl(request.getJiraUrl()),
                request.getJiraToken(),
                request.getJiraProjectKey(),
                request.getJiraIssueType(),
                request.getJiraUsername(),
                request.isAutoCreateEnabled(),
                request.getAutoSeverityThreshold()
        );
        return mapToResponseDto(config);
    }

    @Transactional
    public JiraConfigResponseDto updateConfiguration(Long teamId, JiraConfigRequestDto request, Principal principal) {
        Team team = findTeamService.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));
        permissionFactory.canUserManageTeam(team, principal);

        JiraConfiguration config = jiraConfigurationService.update(
                team,
                normalizeUrl(request.getJiraUrl()),
                request.getJiraToken(),
                request.getJiraProjectKey(),
                request.getJiraIssueType(),
                request.getJiraUsername(),
                request.isAutoCreateEnabled(),
                request.getAutoSeverityThreshold()
        );
        return mapToResponseDto(config);
    }

    @Transactional
    public void deleteConfiguration(Long teamId, Principal principal) {
        Team team = findTeamService.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));
        permissionFactory.canUserManageTeam(team, principal);
        jiraConfigurationService.delete(team);
    }

    public boolean testConnection(Long teamId, Principal principal) {
        Team team = findTeamService.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));
        permissionFactory.canUserAccessTeam(team, principal);

        JiraConfiguration config = jiraConfigurationService.findByTeam(team)
                .orElseThrow(() -> new IllegalStateException("No JIRA configuration found"));
        return jiraApiClientService.testConnection(config);
    }

    public List<Map<String, String>> fetchProjects(JiraConfigRequestDto request) {
        return jiraApiClientService.fetchProjects(
                request.getJiraUrl(),
                request.getJiraUsername(),
                request.getJiraToken()
        );
    }

    public List<String> fetchIssueTypes(JiraConfigRequestDto request) {
        return jiraApiClientService.fetchIssueTypes(
                request.getJiraUrl(),
                request.getJiraUsername(),
                request.getJiraToken(),
                request.getJiraProjectKey()
        );
    }

    /**
     * Create a single JIRA ticket for a specific finding.
     */
    @Transactional
    public String createTicket(Long teamId, Long findingId, Principal principal) {
        Team team = findTeamService.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));
        permissionFactory.canUserAccessTeam(team, principal);

        JiraConfiguration config = jiraConfigurationService.findByTeam(team)
                .orElseThrow(() -> new IllegalStateException("No JIRA configuration found for this team"));

        Finding finding = findFindingService.findById(findingId)
                .orElseThrow(() -> new IllegalArgumentException("Finding not found"));

        validateFindingBelongsToTeam(finding, team);

        if (finding.getJiraTicketKey() != null) {
            throw new IllegalStateException("Finding already has a JIRA ticket: " + finding.getJiraTicketKey());
        }

        return jiraApiClientService.createTicketForFinding(config, finding);
    }

    /**
     * Create JIRA tickets for multiple findings (grouped intelligently).
     */
    @Transactional
    public CreateJiraTicketsResponseDto createTicketsBulk(Long teamId, List<Long> findingIds, Principal principal) {
        Team team = findTeamService.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));
        permissionFactory.canUserAccessTeam(team, principal);

        JiraConfiguration config = jiraConfigurationService.findByTeam(team)
                .orElseThrow(() -> new IllegalStateException("No JIRA configuration found for this team"));

        List<Finding> findings = findingIds.stream()
                .map(id -> findFindingService.findById(id).orElse(null))
                .filter(f -> f != null && f.getJiraTicketKey() == null)
                .collect(Collectors.toList());

        findings.forEach(f -> validateFindingBelongsToTeam(f, team));

        int ticketsCreated = jiraApiClientService.createTicketsGrouped(config, findings);

        return new CreateJiraTicketsResponseDto(
                ticketsCreated,
                findings.size(),
                String.format("Created %d grouped tickets for %d findings", ticketsCreated, findings.size())
        );
    }

    private void validateFindingBelongsToTeam(Finding finding, Team team) {
        if (finding.getCodeRepo() != null) {
            List<CodeRepo> teamRepos = findCodeRepoService.findByTeam(team);
            if (!teamRepos.contains(finding.getCodeRepo())) {
                throw new IllegalArgumentException("Finding does not belong to the specified team");
            }
        }
    }

    private JiraConfigResponseDto mapToResponseDto(JiraConfiguration config) {
        JiraConfigResponseDto dto = new JiraConfigResponseDto();
        dto.setId(config.getId());
        dto.setTeamId(config.getTeam().getId());
        dto.setJiraUrl(config.getJiraUrl());
        dto.setJiraProjectKey(config.getJiraProjectKey());
        dto.setJiraIssueType(config.getJiraIssueType());
        dto.setJiraUsername(config.getJiraUsername());
        dto.setAutoCreateEnabled(config.isAutoCreateEnabled());
        dto.setAutoSeverityThreshold(config.getAutoSeverityThreshold());
        dto.setConfigured(true);
        return dto;
    }

    private String normalizeUrl(String url) {
        if (url != null && url.endsWith("/")) {
            return url.substring(0, url.length() - 1);
        }
        return url;
    }
}
