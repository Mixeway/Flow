package io.mixeway.mixewayflowapi.integrations.jira.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JiraIssueRequest {
    private Fields fields;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Fields {
        private Project project;
        private String summary;
        private String description;
        private IssueType issuetype;
        private Priority priority;
        private Map<String, Object> labels;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Project {
        private String key;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class IssueType {
        private String name;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Priority {
        private String name;
    }
}
