package io.mixeway.mixewayflowapi.db.entity;

import jakarta.persistence.*;
import lombok.Getter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Table(name = "jira_configuration", uniqueConstraints = {@UniqueConstraint(columnNames = "team_id")})
public class JiraConfiguration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false, unique = true)
    private Team team;

    @Column(name = "jira_url", nullable = false)
    private String jiraUrl;

    @Column(name = "jira_token", nullable = false)
    private String jiraToken;

    @Column(name = "jira_project_key", nullable = false, length = 50)
    private String jiraProjectKey;

    @Column(name = "jira_issue_type", nullable = false, length = 50)
    private String jiraIssueType;

    @Column(name = "jira_username")
    private String jiraUsername;

    @Column(name = "auto_create_enabled", nullable = false)
    private boolean autoCreateEnabled;

    @Column(name = "auto_severity_threshold", length = 20)
    private String autoSeverityThreshold;

    @CreationTimestamp
    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;

    @UpdateTimestamp
    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    protected JiraConfiguration() {}

    public JiraConfiguration(Team team, String jiraUrl, String jiraToken, String jiraProjectKey,
                             String jiraIssueType, String jiraUsername, boolean autoCreateEnabled,
                             String autoSeverityThreshold) {
        this.team = team;
        this.jiraUrl = jiraUrl;
        this.jiraToken = jiraToken;
        this.jiraProjectKey = jiraProjectKey;
        this.jiraIssueType = jiraIssueType != null ? jiraIssueType : "Bug";
        this.jiraUsername = jiraUsername;
        this.autoCreateEnabled = autoCreateEnabled;
        this.autoSeverityThreshold = autoSeverityThreshold != null ? autoSeverityThreshold : "HIGH";
    }

    public void update(String jiraUrl, String jiraToken, String jiraProjectKey,
                       String jiraIssueType, String jiraUsername, boolean autoCreateEnabled,
                       String autoSeverityThreshold) {
        this.jiraUrl = jiraUrl;
        if (jiraToken != null && !jiraToken.isBlank()) {
            this.jiraToken = jiraToken;
        }
        this.jiraProjectKey = jiraProjectKey;
        this.jiraIssueType = jiraIssueType != null ? jiraIssueType : "Bug";
        this.jiraUsername = jiraUsername;
        this.autoCreateEnabled = autoCreateEnabled;
        this.autoSeverityThreshold = autoSeverityThreshold;
    }
}
