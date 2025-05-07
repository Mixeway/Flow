// RunModeRequestDto.java
package io.mixeway.mixewayflowapi.api.admin.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RunModeRequestDto {
    @NotNull(message = "Mode is required")
    private String mode;
}