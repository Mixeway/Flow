package io.mixeway.mixewayflowapi.api.user.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import io.mixeway.mixewayflowapi.utils.DTO;
import io.mixeway.mixewayflowapi.utils.DtoValidator;
import io.mixeway.mixewayflowapi.utils.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public final class ChangeRoleRequestDto implements DTO {

    @NotNull(message = "Role must not be null")
    private final Role role;

    @JsonCreator
    private ChangeRoleRequestDto(Role role) {
        this.role = role;
        validate(this);
    }

    public static ChangeRoleRequestDto of(Role role) {
        ChangeRoleRequestDto dto = new ChangeRoleRequestDto(role);
        validate(dto);
        return dto;
    }

    private static void validate(ChangeRoleRequestDto dto) {
        DtoValidator.validate(dto);
    }
}
