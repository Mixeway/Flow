package io.mixeway.mixewayflowapi.api.coderepo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateCommentRequestDto {
    @NotBlank(message = "Comment message cannot be blank")
    private String message;
}
