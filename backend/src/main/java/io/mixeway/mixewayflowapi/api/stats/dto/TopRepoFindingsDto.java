package io.mixeway.mixewayflowapi.api.stats.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopRepoFindingsDto {
    private Long repoId;
    private String repoName;
    private String teamName;

    private long sast;
    private long sca;
    private long iac;
    private long secrets;
    private long dast;
    private long gitlab;

    private long urgent;
    private long notable;
    private long total;
}
