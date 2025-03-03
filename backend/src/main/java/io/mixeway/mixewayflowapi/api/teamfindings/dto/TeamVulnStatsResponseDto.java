package io.mixeway.mixewayflowapi.api.teamfindings.dto;

import lombok.Data;

@Data
public class TeamVulnStatsResponseDto {
    Long sast;
    Long iac;
    Long sca;
    Long secrets;
    Long cloud;
    public TeamVulnStatsResponseDto(Long sast, Long iac, Long sca, Long secrets, Long cloud) {
        this.sast = sast;
        this.iac = iac;
        this.sca = sca;
        this.secrets = secrets;
        this.cloud = cloud;
    }

    public TeamVulnStatsResponseDto(){};
}
