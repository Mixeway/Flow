package io.mixeway.mixewayflowapi.integrations.scanner.sca.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.Getter;

import java.util.List;

@Getter
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GetApiKeyResponseDto {

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ResponseObject {
        private String uuid;
        private String name;
        private List<ApiKey> apiKeys;

        @Data
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class ApiKey {
            private String key;
        }
    }
}
