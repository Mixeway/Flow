package io.mixeway.mixewayflowapi.api.admin.dto;

import io.mixeway.mixewayflowapi.db.entity.Settings;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AdditionalScannerConfigDto {
    private boolean wizEnabled;

    public static AdditionalScannerConfigDto fromSettings(Settings settings) {
        AdditionalScannerConfigDto dto = new AdditionalScannerConfigDto();
        dto.setWizEnabled(settings.isEnableWiz());
        return dto;
    }
}
