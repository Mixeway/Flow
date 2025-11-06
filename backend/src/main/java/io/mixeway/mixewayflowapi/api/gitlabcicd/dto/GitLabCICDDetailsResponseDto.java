package io.mixeway.mixewayflowapi.api.gitlabcicd.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GitLabCICDDetailsResponseDto {
    String name;
    String description;
    String location;
    String source;
    String status;
    String severity;
}
