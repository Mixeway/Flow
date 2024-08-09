package io.mixeway.mixewayflowapi.api.coderepo.dto;

import io.mixeway.mixewayflowapi.utils.DTO;
import io.mixeway.mixewayflowapi.utils.DtoValidator;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public final class CreateCodeRepoRequestDto implements DTO {

    @NotBlank(message = "Name must not be blank")
    @Pattern(regexp = "^[a-zA-Z0-9-_]+$", message = "Name must be alphanumeric with dashes allowed (e.g., test-repo123)")
    private final String name;

    @NotBlank(message = "Repository URL must not be blank")
    @Pattern(regexp = "^(http|https)://([a-zA-Z0-9.-]+)(:[0-9]+)?$", message = "Repository URL must be a valid URL with or without a port, without paths")
    private final String repoUrl;

    @NotBlank(message = "Access token must not be blank")
    @Size(max = 30, message = "Access token must be at most 30 characters long")
    @Pattern(regexp = "^[a-zA-Z0-9._-]+$", message = "Access token can contain alphanumeric characters, dots, and underscores")
    private final String accessToken;

    @NotNull(message = "Remote ID must not be null")
    private final Long remoteId;

    @NotNull(message = "Team must not be null")
    private final Long team;

    private CreateCodeRepoRequestDto(String name, String repoUrl, String accessToken, Long remoteId, Long team) {
        this.name = name;
        this.repoUrl = repoUrl;
        this.accessToken = accessToken;
        this.remoteId = remoteId;
        this.team = team;
        validate(this);
    }

    public static CreateCodeRepoRequestDto of(String name, String repoUrl, String accessToken, Long remoteId, Long team) {
        return new CreateCodeRepoRequestDto(name, repoUrl, accessToken, remoteId, team);
    }

    private static void validate(CreateCodeRepoRequestDto dto) {
        DtoValidator.validate(dto);
    }
}
