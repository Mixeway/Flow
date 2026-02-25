package io.mixeway.mixewayflowapi.api.jira.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JiraConfigResponseDto {
    private long id;
    private long teamId;
    private String jiraUrl;
    private String jiraProjectKey;
    private String jiraIssueType;
    private String jiraUsername;
    private boolean autoCreateEnabled;
    private String autoSeverityThreshold;
    private boolean configured;
}
