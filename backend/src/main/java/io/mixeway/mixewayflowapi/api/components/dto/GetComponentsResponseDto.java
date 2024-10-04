package io.mixeway.mixewayflowapi.api.components.dto;

import io.mixeway.mixewayflowapi.db.entity.Component;
import io.mixeway.mixewayflowapi.db.entity.Vulnerability;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetComponentsResponseDto {
    ComponentDto component;
    Long componentId;
    String componentName;
    String componentVersion;
    String componentGroupId;
    List<String> vulnerabilityNames;
    List<String> vulnerabilities;
    List<String> affectedReposUrl;
}
