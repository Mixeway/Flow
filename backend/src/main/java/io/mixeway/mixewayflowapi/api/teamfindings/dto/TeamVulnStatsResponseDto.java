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
    public TeamVulnStatsResponseDto(Long sast, Long iac, Long sca, Long secrets, Long gitlab, Long cloud) {
        this.sast = sast;
        this.iac = iac;
        this.sca = sca;
        this.secrets = secrets;
        this.gitlab = gitlab;
        this.cloud = cloud;
    }

    public TeamVulnStatsResponseDto(){};
}
