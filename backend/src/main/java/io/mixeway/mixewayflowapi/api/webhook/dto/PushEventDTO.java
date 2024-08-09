package io.mixeway.mixewayflowapi.api.webhook.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class PushEventDTO {
    private String ref;
    private String after;
    private ProjectDTO project;


    @Data
    public static class ProjectDTO {
        private Long id;

    }
}
