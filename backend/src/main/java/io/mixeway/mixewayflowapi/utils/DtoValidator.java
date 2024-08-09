package io.mixeway.mixewayflowapi.utils;

import io.mixeway.mixewayflowapi.api.team.dto.ChangeTeamRequestDto;

public class DtoValidator {

    public static void validate(DTO dto) {
        var factory = jakarta.validation.Validation.buildDefaultValidatorFactory();
        var validator = factory.getValidator();
        var violations = validator.validate(dto);

        if (!violations.isEmpty()) {
            StringBuilder sb = new StringBuilder();
            for (var violation : violations) {
                sb.append(violation.getMessage()).append("\n");
            }
            throw new IllegalArgumentException(sb.toString());
        }
    }
}
