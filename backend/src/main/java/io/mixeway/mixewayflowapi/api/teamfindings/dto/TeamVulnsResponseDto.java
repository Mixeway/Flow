package io.mixeway.mixewayflowapi.api.teamfindings.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class TeamVulnsResponseDto {
    Long id;
    String name;
    String location;
    String source;
    String status;
    String severity;
    String inserted;
    @JsonProperty("last_seen")
    String lastSeen;
    @JsonProperty("component_name")
    String componentName;
    String urgency;
    String repoUrl;


}