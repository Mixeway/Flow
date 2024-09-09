package io.mixeway.mixewayflowapi.api.webhook.dto;

import lombok.Data;

@Data
public class GHMergeEventDTO {
    private PullRequestDTO pullRequest;
    private RepositoryDTO repository;

    @Data
    public static class PullRequestDTO {
        private Long id;
        private HeadDTO head;
        private BaseDTO base;
        private String state;

        @Data
        public static class HeadDTO {
            private String ref;
            private String sha;
        }

        @Data
        public static class BaseDTO {
            private String ref;
            private String sha;
        }
    }

    @Data
    public static class RepositoryDTO {
        private Long id;
    }
}
