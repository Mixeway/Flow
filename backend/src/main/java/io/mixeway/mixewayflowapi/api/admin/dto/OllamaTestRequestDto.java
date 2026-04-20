package io.mixeway.mixewayflowapi.api.admin.dto;

import lombok.Data;

@Data
public class OllamaTestRequestDto {
    /** When set, tests this URL instead of saved settings (e.g. before Save). */
    private String baseUrl;
}
