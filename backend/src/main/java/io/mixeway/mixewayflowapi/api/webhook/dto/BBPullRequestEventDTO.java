package io.mixeway.mixewayflowapi.api.webhook.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class BBPullRequestEventDTO {
    private PullRequestDTO pullrequest;
    private RepositoryDTO repository;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class PullRequestDTO {
        private Long id;
        private String title;
        private String state;
        private BranchRefDTO source;
        private BranchRefDTO destination;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class BranchRefDTO {
        private BranchDTO branch;
        private CommitDTO commit;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class BranchDTO {
        private String name;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CommitDTO {
        private String hash;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class RepositoryDTO {
        private String uuid;
        @JsonProperty("full_name")
        private String fullName;
        private LinksDTO links;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class LinksDTO {
        private HrefDTO html;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class HrefDTO {
        private String href;
    }
}
