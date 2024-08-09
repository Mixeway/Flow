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
    Component component;
    List<String> vulnerabilities;
    List<String> affectedReposUrl;
}
