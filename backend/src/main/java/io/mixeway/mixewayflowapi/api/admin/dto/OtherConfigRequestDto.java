package io.mixeway.mixewayflowapi.api.admin.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class OtherConfigRequestDto {
    private String geminiApiKey;

    private boolean enableLlmEvaluation;
    private String llmApiUrl;
    private String llmApiKey;
    private String llmModel;
}