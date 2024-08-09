package io.mixeway.mixewayflowapi.api.team.dto;

import lombok.Data;

import java.util.List;

@Data
public class CreateTeamRequestDto {
    String name;
    List<Long> users;
}
