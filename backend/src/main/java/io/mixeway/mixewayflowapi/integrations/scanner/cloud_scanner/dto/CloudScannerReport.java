package io.mixeway.mixewayflowapi.integrations.scanner.cloud_scanner.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
public class CloudScannerReport {

    @JsonProperty("data")
    private VulnerabilityData data;

    @Data
    public static class VulnerabilityData {
        @JsonProperty("vulnerabilityFindings")
        private VulnerabilityFindings vulnerabilityFindings;
    }

    @Data
    public static class VulnerabilityFindings {
        @JsonProperty("nodes")
        private List<Node> nodes = new ArrayList<>();
    }

    @Data
    public static class Node {
        @JsonProperty("name")
        private String name;

        @JsonProperty("severity")
        private String severity;

        @JsonProperty("vulnerableAsset")
        private VulnerableAsset vulnerableAsset;

        @JsonProperty("detailedName")
        private String detailedName;

        @JsonProperty("CVEDescription")
        private String cveDescription;

        @JsonProperty("version")
        private String version;

        @JsonProperty("fixedVersion")
        private String fixedVersion;

        @JsonProperty("remediation")
        private String remediation;

        @JsonProperty("epssProbability")
        private BigDecimal epssProbability;

        @JsonProperty("epssPercentile")
        private BigDecimal epssPercentile;

        @JsonProperty("hasExploit")
        private Boolean hasExploit;


        @Data
        public static class VulnerableAsset {
            @JsonProperty("subscriptionExternalId")
            private String subscriptionExternalId;

            @JsonProperty("name")
            private String name;
        }
    }
}
