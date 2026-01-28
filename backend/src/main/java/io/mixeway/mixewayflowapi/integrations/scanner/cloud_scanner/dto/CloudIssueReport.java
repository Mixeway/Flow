package io.mixeway.mixewayflowapi.integrations.scanner.cloud_scanner.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class CloudIssueReport {

    @JsonProperty("data")
    private IssuesV2Data data;

    @JsonIgnoreProperties(ignoreUnknown = true)
    @Data
    public static class IssuesV2Data {
        @JsonProperty("issuesV2")
        private IssuesV2 issuesV2;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    @Data
    public static class IssuesV2 {
        @JsonProperty("nodes")
        private List<Node> nodes = new ArrayList<>();

    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    @Data
    public static class Node {

        @JsonProperty("severity")
        private String severity;

        @JsonProperty("type")
        private String type;

        @JsonProperty("entitySnapshot")
        private EntitySnapshot entitySnapshot;

        @JsonProperty("sourceRules")
        private List<SourceRule> sourceRules;

        @JsonProperty("validatedAsExploitable")
        private Boolean validatedAsExploitable;

    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    @Data
    public static class EntitySnapshot {
        @JsonProperty("name")
        private String name;

        @JsonProperty("type")
        private String type;

    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    @Data
    public static class SourceRule {
        @JsonProperty("name")
        private String name;

        @JsonProperty("description")
        private String description;

        @JsonProperty("resolutionRecommendationPlainText")
        private String resolutionRecommendationPlainText;
    }
}
