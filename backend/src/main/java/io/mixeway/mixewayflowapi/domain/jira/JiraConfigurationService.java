package io.mixeway.mixewayflowapi.domain.jira;

import io.mixeway.mixewayflowapi.db.entity.JiraConfiguration;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.repository.JiraConfigurationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
public class JiraConfigurationService {
    private final JiraConfigurationRepository jiraConfigurationRepository;

    public Optional<JiraConfiguration> findByTeam(Team team) {
        return jiraConfigurationRepository.findByTeam(team);
    }

    public Optional<JiraConfiguration> findByTeamId(Long teamId) {
        return jiraConfigurationRepository.findByTeamId(teamId);
    }

    @Transactional
    public JiraConfiguration create(Team team, String jiraUrl, String jiraToken, String jiraProjectKey,
                                     String jiraIssueType, String jiraUsername, boolean autoCreateEnabled,
                                     String autoSeverityThreshold) {
        Optional<JiraConfiguration> existing = jiraConfigurationRepository.findByTeam(team);
        if (existing.isPresent()) {
            throw new IllegalStateException("JIRA configuration already exists for team: " + team.getName());
        }
        JiraConfiguration config = new JiraConfiguration(team, jiraUrl, jiraToken, jiraProjectKey,
                jiraIssueType, jiraUsername, autoCreateEnabled, autoSeverityThreshold);
        JiraConfiguration saved = jiraConfigurationRepository.save(config);
        log.info("[JIRA] Created configuration for team {} with project {}", team.getName(), jiraProjectKey);
        return saved;
    }

    @Transactional
    public JiraConfiguration update(Team team, String jiraUrl, String jiraToken, String jiraProjectKey,
                                     String jiraIssueType, String jiraUsername, boolean autoCreateEnabled,
                                     String autoSeverityThreshold) {
        JiraConfiguration config = jiraConfigurationRepository.findByTeam(team)
                .orElseThrow(() -> new IllegalStateException("No JIRA configuration found for team: " + team.getName()));
        config.update(jiraUrl, jiraToken, jiraProjectKey, jiraIssueType, jiraUsername, autoCreateEnabled, autoSeverityThreshold);
        JiraConfiguration saved = jiraConfigurationRepository.save(config);
        log.info("[JIRA] Updated configuration for team {} with project {}", team.getName(), jiraProjectKey);
        return saved;
    }

    @Transactional
    public void delete(Team team) {
        jiraConfigurationRepository.deleteByTeam(team);
        log.info("[JIRA] Deleted configuration for team {}", team.getName());
    }
}
