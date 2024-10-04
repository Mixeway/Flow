package io.mixeway.mixewayflowapi.api.components.dto;

import lombok.Data;

import java.util.List;

@Data
public class ComponentProjectionDto {
    private Long componentId;
    private String componentName;
    private List<String> vulnerabilityNames;
    private List<String> affectedRepoUrls;

    // Constructor
    public ComponentProjectionDto(Long componentId, String componentName, List<String> vulnerabilityNames, List<String> affectedRepoUrls) {
        this.componentId = componentId;
        this.componentName = componentName;
        this.vulnerabilityNames = vulnerabilityNames;
        this.affectedRepoUrls = affectedRepoUrls;
    }

}
