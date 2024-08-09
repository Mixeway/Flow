package io.mixeway.mixewayflowapi.api.user.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.mixeway.mixewayflowapi.utils.DTO;
import io.mixeway.mixewayflowapi.utils.DtoValidator;
import jakarta.validation.constraints.Size;
import lombok.Getter;

import java.util.List;

@Getter
public final class ChangeTeamRequestDto implements DTO {

    @Size(max = 100, message = "Teams list can have a maximum of 100 elements")
    private final List<Long> teams;



    @JsonCreator
    private ChangeTeamRequestDto(List<Long> teams) {
        this.teams = teams;
        validate(this);
    }

    public static ChangeTeamRequestDto of(List<Long> teams) {
        ChangeTeamRequestDto dto = new ChangeTeamRequestDto(teams);
        validate(dto);
        return dto;
    }

    private static void validate(ChangeTeamRequestDto dto) {
        DtoValidator.validate(dto);
    }
}
