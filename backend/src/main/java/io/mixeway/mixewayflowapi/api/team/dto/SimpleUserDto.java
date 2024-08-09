package io.mixeway.mixewayflowapi.api.team.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SimpleUserDto {
    Long id;
    String username;
}
