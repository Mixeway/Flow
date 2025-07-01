package io.mixeway.mixewayflowapi.integrations.scanner.zap.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ZapReport {
    @JsonProperty("@programName")
    private String programName;

    @JsonProperty("@version")
    private String version;

    @JsonProperty("@generated")
    private String generated;

    @JsonProperty("site")
    private List<Site> sites;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Site {
        @JsonProperty("@name")
        private String name;

        @JsonProperty("@host")
        private String host;

        @JsonProperty("@port")
        private String port;

        @JsonProperty("@ssl")
        private String ssl;

        @JsonProperty("alerts")
        private List<Alert> alerts;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Alert {
        @JsonProperty("pluginid")
        private String pluginId;

        @JsonProperty("alertRef")
        private String alertRef;

        @JsonProperty("alert")
        private String alert;

        @JsonProperty("name")
        private String name;

        @JsonProperty("riskcode")
        private String riskCode;

        @JsonProperty("confidence")
        private String confidence;

        @JsonProperty("riskdesc")
        private String riskDesc;

        @JsonProperty("desc")
        private String description;

        @JsonProperty("instances")
        private List<Instance> instances;

        @JsonProperty("count")
        private String count;

        @JsonProperty("solution")
        private String solution;

        @JsonProperty("reference")
        private String reference;

        @JsonProperty("cweid")
        private String cweId;

        @JsonProperty("wascid")
        private String wascId;

        @JsonProperty("sourceid")
        private String sourceId;

        @JsonProperty("otherinfo")
        private String otherInfo;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Instance {
        @JsonProperty("id")
        private String id;

        @JsonProperty("uri")
        private String uri;

        @JsonProperty("method")
        private String method;

        @JsonProperty("param")
        private String param;

        @JsonProperty("attack")
        private String attack;

        @JsonProperty("evidence")
        private String evidence;

        @JsonProperty("otherinfo")
        private String otherInfo;
    }
}
