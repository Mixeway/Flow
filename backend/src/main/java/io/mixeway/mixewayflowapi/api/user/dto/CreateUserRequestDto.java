package io.mixeway.mixewayflowapi.api.user.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import io.mixeway.mixewayflowapi.utils.DTO;
import io.mixeway.mixewayflowapi.utils.DtoValidator;
import io.mixeway.mixewayflowapi.utils.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;

import java.util.List;

@Getter
public final class CreateUserRequestDto implements DTO {

    @NotBlank(message = "Username must not be blank")
    @Pattern(regexp = "^(?=.{1,39}$)[a-zA-Z0-9]([a-zA-Z0-9]|-(?!-))*[a-zA-Z0-9]$", message = "Username must be alphanumeric and up to 20 characters long")
    private final String username;

    @NotNull(message = "Role must not be null")
    private final Role role;

    @NotBlank(message = "Password must not be blank")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private final String password;

    @Size(max = 100, message = "Teams list can have a maximum of 100 elements")
    private final List<Long> teams;

    @JsonCreator
    private CreateUserRequestDto(String username, Role role, String password, List<Long> teams) {
        this.username = username;
        this.role = role;
        this.password = password;
        this.teams = teams;
        validate(this);
    }

    public static CreateUserRequestDto of(String username, Role role, String password, List<Long> teams) {
        CreateUserRequestDto dto = new CreateUserRequestDto(username, role, password, teams);
        validate(dto);
        return dto;
    }

    private static void validate(CreateUserRequestDto dto) {
        DtoValidator.validate(dto);
    }
}
