package io.mixeway.mixewayflowapi.api.coderepo.dto;

import lombok.Data;

@Data
public class VulnStatsResponseDto {
    Long sast;
    Long iac;
    Long sca;
    Long secrets;
    Long gitlab;
    public VulnStatsResponseDto(Long sast, Long iac, Long sca, Long secrets,Long gitlab) {
        this.sast = sast;
        this.iac = iac;
        this.sca = sca;
        this.secrets = secrets;
        this.gitlab = gitlab;
    }

    public VulnStatsResponseDto(){};
}
