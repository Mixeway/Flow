package io.mixeway.mixewayflowapi.api.jira.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateJiraTicketsResponseDto {
    private int ticketsCreated;
    private int findingsProcessed;
    private String message;
}
