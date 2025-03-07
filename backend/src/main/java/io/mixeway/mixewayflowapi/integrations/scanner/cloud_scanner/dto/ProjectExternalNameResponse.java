package io.mixeway.mixewayflowapi.integrations.scanner.cloud_scanner.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProjectExternalNameResponse {
    @JsonProperty("data")
    private ProjectData data;

    @Getter
    @Setter
    public static class ProjectData {
        @JsonProperty("project")
        private Project project;
    }

    @Getter
    @Setter
    public static class Project {
        @JsonProperty("name")
        private String externalProjectName;
    }
}
