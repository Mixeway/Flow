package io.mixeway.mixewayflowapi.api.coderepo.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BulkChangeTeamRequestDto {

    @NotEmpty(message = "Repository IDs cannot be empty.")
    private List<Long> repositoryIds;

    @NotNull(message = "New team ID must not be null.")
    private Long newTeamId;
}