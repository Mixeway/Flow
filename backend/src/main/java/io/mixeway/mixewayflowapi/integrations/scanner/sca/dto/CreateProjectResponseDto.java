package io.mixeway.mixewayflowapi.integrations.scanner.sca.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class CreateProjectResponseDto {
    String name;
    String classifier;
    String uuid;
}
