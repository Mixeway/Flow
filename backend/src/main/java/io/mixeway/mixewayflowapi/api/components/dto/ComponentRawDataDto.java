package io.mixeway.mixewayflowapi.api.components.dto;

import lombok.Data;

@Data
public class ComponentRawDataDto {
    private Long componentId;
    private String componentName;
    private String componentVersion;
    private String componentGroupId;
    private String vulnerabilityName;
    private String repoUrl;

    public ComponentRawDataDto(Long componentId, String componentName, String componentVersion, String componentGroupId, String vulnerabilityName, String repoUrl) {
        this.componentId = componentId;
        this.componentVersion = componentVersion;
        this.componentGroupId = componentGroupId;
        this.componentName = componentName;
        this.vulnerabilityName = vulnerabilityName;
        this.repoUrl = repoUrl;
    }

    // Getters and setters...
}
