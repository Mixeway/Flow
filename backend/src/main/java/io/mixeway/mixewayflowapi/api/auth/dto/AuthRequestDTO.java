package io.mixeway.mixewayflowapi.api.auth.dto;

import io.mixeway.mixewayflowapi.utils.DTO;
import io.mixeway.mixewayflowapi.utils.DtoValidator;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public final class AuthRequestDTO implements DTO {
    @NotBlank(message = "Username cannot be blank")
    @Size(max = 20, message = "Username must be up to 20 characters long")
    @Pattern(regexp = "^[a-zA-Z0-9]+$", message = "Username must be alphanumeric")
    private final String username;

    @NotBlank(message = "Password cannot be blank")
    private final String password;

    private AuthRequestDTO(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public static AuthRequestDTO of(String username, String password) {
        AuthRequestDTO dto = new AuthRequestDTO(username, password);
        validate(dto);
        return dto;
    }

    private static void validate(AuthRequestDTO dto) {
        DtoValidator.validate(dto);
    }
}
