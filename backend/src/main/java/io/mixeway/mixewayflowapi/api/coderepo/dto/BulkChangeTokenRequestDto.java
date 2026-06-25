package io.mixeway.mixewayflowapi.api.coderepo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BulkChangeTokenRequestDto {

    @NotEmpty(message = "Repository IDs cannot be empty.")
    private List<Long> repositoryIds;

    @NotBlank(message = "Access token cannot be empty.")
    private String accessToken;
}
