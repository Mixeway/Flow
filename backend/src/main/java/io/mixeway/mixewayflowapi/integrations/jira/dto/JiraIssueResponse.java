package io.mixeway.mixewayflowapi.integrations.jira.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class JiraIssueResponse {
    private String id;
    private String key;
    private String self;
}
