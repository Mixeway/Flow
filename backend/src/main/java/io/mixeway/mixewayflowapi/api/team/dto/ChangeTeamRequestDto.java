package io.mixeway.mixewayflowapi.api.team.dto;

import io.mixeway.mixewayflowapi.utils.DTO;
import io.mixeway.mixewayflowapi.utils.DtoValidator;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;

import java.util.List;

@Getter
public final class ChangeTeamRequestDto implements DTO {

    @NotNull(message = "ID must not be null")
    @Min(value = 1, message = "ID must be greater than 0")
    private final Long id;

    @Size(max = 100, message = "Users list can have a maximum of 100 elements")
    private final List<Long> users;

    private ChangeTeamRequestDto(Long id, List<Long> users) {
        this.id = id;
        this.users = users;
    }

    public static ChangeTeamRequestDto of(Long id, List<Long> users) {
        ChangeTeamRequestDto dto = new ChangeTeamRequestDto(id, users);
        DtoValidator.validate(dto);
        return dto;
    }


}
