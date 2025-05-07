// OrganizationCreateRequestDto.java
package io.mixeway.mixewayflowapi.api.organization.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrganizationCreateRequestDto {
    @NotBlank(message = "Organization name is required")
    private String name;

    @NotNull(message = "Plan type is required")
    private String planType;

    @NotNull(message = "Admin user ID is required")
    private Long adminUserId;

    private boolean active = true;
}