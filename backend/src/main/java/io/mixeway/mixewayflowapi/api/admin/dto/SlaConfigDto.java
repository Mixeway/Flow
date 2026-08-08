package io.mixeway.mixewayflowapi.api.admin.dto;

import io.mixeway.mixewayflowapi.db.entity.Settings;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Remediation SLA in days per severity, counted from the date a finding was first seen.
 * A null value means no SLA is tracked for that severity.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SlaConfigDto {

    @Min(1)
    @Max(3650)
    private Integer criticalDays = 14;

    @Min(1)
    @Max(3650)
    private Integer highDays = 30;

    @Min(1)
    @Max(3650)
    private Integer mediumDays;

    @Min(1)
    @Max(3650)
    private Integer lowDays;

    public static SlaConfigDto fromSettings(Settings settings) {
        if (settings == null) {
            return new SlaConfigDto();
        }
        return new SlaConfigDto(
                settings.getSlaCriticalDays(),
                settings.getSlaHighDays(),
                settings.getSlaMediumDays(),
                settings.getSlaLowDays()
        );
    }
}
