package io.mixeway.mixewayflowapi.integrations.scanner.sca.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.sql.Timestamp;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class DTrackGetVulnResponseDto {
    private String vulnId;
    private String source;
    private String description;
    private Timestamp published;
    private String recommendation;
    private String references;
    private String Severity;
    private List<Component> components;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Component{
        private String group;
        private String name;
        private String version;
        private String description;
    }
}
