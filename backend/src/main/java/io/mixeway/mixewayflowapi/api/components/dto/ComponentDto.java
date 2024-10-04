package io.mixeway.mixewayflowapi.api.components.dto;

import lombok.Data;

@Data
public class ComponentDto {
    String name;
    String version;
    String groupId;
    Long id;
}
