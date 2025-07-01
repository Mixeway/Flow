package io.mixeway.mixewayflowapi.api.coderepo.dto;

import lombok.Data;

@Data
public class VulnStatsResponseDto {
    Long sast;
    Long iac;
    Long sca;
    Long secrets;
    Long gitlab;
    Long dast;
    public VulnStatsResponseDto(Long sast, Long iac, Long sca, Long secrets,Long gitlab, Long dast) {
        this.sast = sast;
        this.iac = iac;
        this.sca = sca;
        this.secrets = secrets;
        this.gitlab = gitlab;
        this.dast = dast;
    }

    public VulnStatsResponseDto(){};
}
