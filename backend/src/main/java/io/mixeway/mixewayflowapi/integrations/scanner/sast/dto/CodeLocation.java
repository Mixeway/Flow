package io.mixeway.mixewayflowapi.integrations.scanner.sast.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class CodeLocation {
    private int start;
    private int end;
    private Column column;
}