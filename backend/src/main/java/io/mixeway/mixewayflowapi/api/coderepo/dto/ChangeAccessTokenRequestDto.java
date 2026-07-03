package io.mixeway.mixewayflowapi.api.coderepo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangeAccessTokenRequestDto {

    @NotBlank(message = "Access token cannot be empty.")
    private String accessToken;
}
