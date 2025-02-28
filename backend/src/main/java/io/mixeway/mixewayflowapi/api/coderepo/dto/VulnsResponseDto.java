package io.mixeway.mixewayflowapi.api.coderepo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class VulnsResponseDto {
    Long id;
    String name;
    String location;
    String source;
    String status;
    String severity;
    String inserted;
    @JsonProperty("last_seen")
    String lastSeen;
}
