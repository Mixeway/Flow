package io.mixeway.mixewayflowapi.api.webhook.dto;

import lombok.Data;

@Data
public class GLPushEventDTO {
    private String ref;
    private String after;
    private ProjectDTO project;


    @Data
    public static class ProjectDTO {
        private Long id;
        private String web_url;

    }
}
