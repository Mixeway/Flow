package io.mixeway.mixewayflowapi.api.admin.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LlmSourceConfigDto {
    private String source;
    private boolean enabled;
    private String apiUrl;
    private String apiKey;
    private String model;
    private Integer contextWindow;
    private Integer scanConcurrency;
}
