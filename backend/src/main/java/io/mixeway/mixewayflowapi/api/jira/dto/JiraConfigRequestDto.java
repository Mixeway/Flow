package io.mixeway.mixewayflowapi.api.jira.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class JiraConfigRequestDto {
    @NotBlank(message = "JIRA URL is required")
    private String jiraUrl;

    @NotBlank(message = "JIRA token is required")
    private String jiraToken;

    @NotBlank(message = "JIRA project key is required")
    private String jiraProjectKey;

    private String jiraIssueType = "Bug";

    private String jiraUsername;

    private boolean autoCreateEnabled = false;

    private String autoSeverityThreshold = "HIGH";
}
