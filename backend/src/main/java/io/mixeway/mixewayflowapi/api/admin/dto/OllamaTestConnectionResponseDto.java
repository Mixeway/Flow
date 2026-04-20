package io.mixeway.mixewayflowapi.api.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OllamaTestConnectionResponseDto {
    private boolean ok;
    private List<String> models;
    private String message;
}
