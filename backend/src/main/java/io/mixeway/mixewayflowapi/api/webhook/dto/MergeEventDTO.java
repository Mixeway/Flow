package io.mixeway.mixewayflowapi.api.webhook.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class MergeEventDTO {
    private ProjectDTO project;
    @JsonProperty("object_attributes")
    private ObjectAttributesDTO objectAttributes;

    @Data
    public static class ProjectDTO {
        private Long id;

    }

    @Data
    public static class ObjectAttributesDTO {
        @JsonProperty("source_branch")
        private String sourceBranch;
        @JsonProperty("target_branch")
        private String targetBranch;
        private String url;
        @JsonProperty("last_commit")
        private LastCommitDTO lastCommitDTO;

        @Data
        public static class LastCommitDTO {
            String id;
        }
    }
}
