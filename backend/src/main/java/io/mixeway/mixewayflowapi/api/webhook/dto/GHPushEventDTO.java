package io.mixeway.mixewayflowapi.api.webhook.dto;

import lombok.Data;

@Data
public class GHPushEventDTO {
    private String ref;
    private String after;
    private RepositoryDTO repository;


    @Data
    public static class RepositoryDTO {
        private Long id;

    }
}
