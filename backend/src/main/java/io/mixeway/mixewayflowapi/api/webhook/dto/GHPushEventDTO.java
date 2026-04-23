package io.mixeway.mixewayflowapi.api.webhook.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GHPushEventDTO {
    private String ref;
    private String after;
    private RepositoryDTO repository;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class RepositoryDTO {
        private Long id;
    }
}
