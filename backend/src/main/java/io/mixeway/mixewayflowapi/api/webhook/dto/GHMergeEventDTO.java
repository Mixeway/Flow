package io.mixeway.mixewayflowapi.api.webhook.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GHMergeEventDTO {

    private String action;
    private Long number;

    @JsonProperty("pull_request")
    private PullRequestDTO pullRequest;

    private RepositoryDTO repository;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class PullRequestDTO {
        private Long id;
        private String state;

        private Long number;

        @JsonProperty("head")
        private HeadBaseDTO head;

        @JsonProperty("base")
        private HeadBaseDTO base;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class HeadBaseDTO {
        private String ref;
        private String sha;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class RepositoryDTO {
        private Long id;
        private String name;

        @JsonProperty("full_name")
        private String fullName;

        @JsonProperty("default_branch")
        private String defaultBranch;
    }
}
