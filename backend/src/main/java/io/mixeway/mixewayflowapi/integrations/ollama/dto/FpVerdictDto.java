package io.mixeway.mixewayflowapi.integrations.ollama.dto;

import lombok.Data;

@Data
public class FpVerdictDto {
    private String verdict;
    private String confidence;
    private String reasoning;
}
