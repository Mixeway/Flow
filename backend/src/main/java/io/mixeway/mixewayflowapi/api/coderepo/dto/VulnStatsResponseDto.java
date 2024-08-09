package io.mixeway.mixewayflowapi.api.coderepo.dto;

import lombok.Data;

@Data
public class VulnStatsResponseDto {
    Long sast;
    Long iac;
    Long sca;
    Long secrets;
    public VulnStatsResponseDto(Long sast, Long iac, Long sca, Long secrets) {
        this.sast = sast;
        this.iac = iac;
        this.sca = sca;
        this.secrets = secrets;
    }

    public VulnStatsResponseDto(){};
}
