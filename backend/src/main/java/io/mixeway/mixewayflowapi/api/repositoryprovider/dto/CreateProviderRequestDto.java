package io.mixeway.mixewayflowapi.api.repositoryprovider.dto;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateProviderRequestDto {

    @NotNull(message = "Provider type must not be null")
    private CodeRepo.RepoType providerType;

    @NotBlank(message = "API URL must not be blank")
    private String apiUrl;

    @NotBlank(message = "Access token must not be blank")
    private String accessToken;

    @NotNull(message = "Default team ID must not be null")
    private Long defaultTeamId;
}