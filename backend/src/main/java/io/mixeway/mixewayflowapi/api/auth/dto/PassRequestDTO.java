package io.mixeway.mixewayflowapi.api.auth.dto;

import io.mixeway.mixewayflowapi.utils.DTO;
import io.mixeway.mixewayflowapi.utils.DtoValidator;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public final class PassRequestDTO implements DTO {

    @NotEmpty(message = "Password must not be empty")
    @Size(min = 8, max = 100, message = "The length of the password must be at least 8 characters")
    private final String password;

    @NotEmpty(message = "Password repeat must not be empty")
    @Size(min = 8, max = 100, message = "The length of the password must be at least 8 characters")
    private final String passwordRepeat;

    private PassRequestDTO(String password, String passwordRepeat) {
        this.password = password;
        this.passwordRepeat = passwordRepeat;
    }

    public static PassRequestDTO of(String password, String passwordRepeat) {
        PassRequestDTO dto = new PassRequestDTO(password, passwordRepeat);
        validate(dto);
        return dto;
    }

    private static void validate(PassRequestDTO dto) {
        DtoValidator.validate(dto);

        if (!dto.password.equals(dto.passwordRepeat)) {
            throw new IllegalArgumentException("Passwords do not match");
        }
    }
}
