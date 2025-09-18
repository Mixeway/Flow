package io.mixeway.mixewayflowapi.api.coderepo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class RenameCodeRepoRequestDto {
    @NotBlank
    @Size(max = 200)
    private String newName;
}