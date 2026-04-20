package io.mixeway.mixewayflowapi.api.admin.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OllamaConfigRequestDto {
    @NotNull
    private Boolean ollamaEnabled;
    private String ollamaBaseUrl;
    private String ollamaModel;
    @Min(5)
    @Max(3600)
    private int ollamaTimeoutSeconds = 120;
    @NotNull
    private Boolean ollamaFpAnalysisEnabled;
    @Min(1)
    @Max(50)
    private int ollamaFpBatchSize = 5;
}
