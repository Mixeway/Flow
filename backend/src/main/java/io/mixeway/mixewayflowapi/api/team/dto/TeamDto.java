package io.mixeway.mixewayflowapi.api.team.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class TeamDto {
    Long id;
    String name;
    String remoteIdentifier;
    List<SimpleUserDto> users;
}
