package io.mixeway.mixewayflowapi.api.coderepo.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ChangeTeamRequestDto {
    @NotNull(message = "New team ID is required")
    private Long newTeamId;
}