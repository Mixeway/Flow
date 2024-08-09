package io.mixeway.mixewayflowapi.integrations.scanner.sast.dto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;


import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class BearerScanSecurity {
    private List<Item> critical;
    private List<Item> high;
    private List<Item> medium;
    private List<Item> low;
}
