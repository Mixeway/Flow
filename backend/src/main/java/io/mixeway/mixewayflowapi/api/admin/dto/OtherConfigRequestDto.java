package io.mixeway.mixewayflowapi.api.admin.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class OtherConfigRequestDto {
    @NotNull
    private String geminiApiKey;
}