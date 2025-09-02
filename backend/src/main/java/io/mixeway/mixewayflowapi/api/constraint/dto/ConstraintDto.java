package io.mixeway.mixewayflowapi.api.constraint.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ConstraintDto {
    Long id;
    String text;
    Long vulnerabilityId;
}
