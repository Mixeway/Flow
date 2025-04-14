package io.mixeway.mixewayflowapi.api.teamfindings.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class TeamFindingsAndVulnsResponseDto {
    Long id;
    String name;
    String location;
    @JsonProperty("component_name")
    String componentName;
    @JsonProperty("remote_id")
    String remoteId;
    String source;
    String status;
    String severity;
    String inserted;
    @JsonProperty("last_seen")
    String lastSeen;
    String Description;
    String Explanation;
    String Recommendation;
}