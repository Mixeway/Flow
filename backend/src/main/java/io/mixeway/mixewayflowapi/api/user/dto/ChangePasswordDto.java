package io.mixeway.mixewayflowapi.api.user.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import io.mixeway.mixewayflowapi.utils.DTO;
import io.mixeway.mixewayflowapi.utils.DtoValidator;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public final class ChangePasswordDto implements DTO {

    @NotNull(message = "Password must not be null")
    @NotEmpty(message = "Password must not be empty")
    @Size(min = 8, message = "The length of the password must be at least 8 characters")
    private final String password;

    @JsonCreator
    private ChangePasswordDto(String password) {
        this.password = password;
        validate(this);
    }

    public static ChangePasswordDto of(String password) {
        ChangePasswordDto dto = new ChangePasswordDto(password);
        validate(dto);
        return dto;
    }

    private static void validate(ChangePasswordDto dto) {
        DtoValidator.validate(dto);
    }
}
