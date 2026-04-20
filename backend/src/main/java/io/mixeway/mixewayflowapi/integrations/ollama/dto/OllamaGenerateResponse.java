package io.mixeway.mixewayflowapi.integrations.ollama.dto;

import lombok.Data;

@Data
public class OllamaGenerateResponse {
    private String response;
    private String model;
    private boolean done;
}
