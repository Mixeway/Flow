package io.mixeway.mixewayflowapi.api.teamfindings.dto;

import lombok.Data;

@Data
public class TeamVulnStatsResponseDto {
    Long sast;
    Long iac;
    Long sca;
    Long secrets;
    Long gitlab;
    Long cloud;
    Long dast;
    public TeamVulnStatsResponseDto(Long sast, Long iac, Long sca, Long secrets, Long gitlab, Long cloud, Long dast) {
        this.sast = sast;
        this.iac = iac;
        this.sca = sca;
        this.secrets = secrets;
        this.gitlab = gitlab;
        this.cloud = cloud;
        this.dast = dast;
    }

    public TeamVulnStatsResponseDto(){};
}
