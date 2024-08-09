package io.mixeway.mixewayflowapi.api.coderepo.dto;

import lombok.Data;

@Data
public class GetFindingResponseDto {
    VulnsResponseDto vulnsResponseDto;
    String description;
    String recommendation;
    String explanation;
    String refs;
}
