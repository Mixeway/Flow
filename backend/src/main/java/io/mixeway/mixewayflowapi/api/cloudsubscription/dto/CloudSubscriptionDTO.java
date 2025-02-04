package io.mixeway.mixewayflowapi.api.cloudsubscription.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CloudSubscriptionDTO {
    @NotBlank(message = "Name is required")
    private String name;
}