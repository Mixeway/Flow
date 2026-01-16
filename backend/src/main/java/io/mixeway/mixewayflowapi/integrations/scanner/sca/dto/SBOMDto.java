package io.mixeway.mixewayflowapi.integrations.scanner.sca.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SBOMDto {

    @JsonProperty("components")
    private List<SbomComponent> components;
    @JsonProperty("dependencies")
    private List<SbomDependency> dependencies;



    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SbomComponent {
        @JsonProperty("purl")
        private String purl;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SbomDependency {
        @JsonProperty("ref")
        private String ref;
        @JsonProperty("dependsOn")
        private List<String> dependsOn;
    }
}