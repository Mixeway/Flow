package io.mixeway.mixewayflowapi.api.coderepo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RunOrchScanDetailsDto {
    String name;
    String description;
    String explanation;
    String recommendation;
    String location;
    String source;
    String status;
    String severity;
}
