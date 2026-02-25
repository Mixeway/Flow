package io.mixeway.mixewayflowapi.api.jira.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class CreateJiraTicketsRequestDto {
    @NotEmpty(message = "At least one finding ID must be provided")
    private List<Long> findingIds;
}
