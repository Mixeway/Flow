package io.mixeway.mixewayflowapi.api.webhook.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class BBPushEventDTO {
    private PushDTO push;
    private RepositoryDTO repository;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class PushDTO {
        private List<ChangeDTO> changes;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ChangeDTO {
        @JsonProperty("new")
        private RefDTO newRef;
        @JsonProperty("old")
        private RefDTO oldRef;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class RefDTO {
        private String name;
        private String type;
        private TargetDTO target;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TargetDTO {
        private String hash;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class RepositoryDTO {
        private String uuid;
        @JsonProperty("full_name")
        private String fullName;
        private LinksDTO links;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class LinksDTO {
        private HrefDTO html;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class HrefDTO {
        private String href;
    }
}
