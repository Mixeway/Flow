package io.mixeway.mixewayflowapi.domain.settings;

import io.mixeway.mixewayflowapi.api.admin.dto.AdditionalScannerConfigDto;
import io.mixeway.mixewayflowapi.db.entity.Settings;
import io.mixeway.mixewayflowapi.db.repository.SettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FindSettingsService {
    private final SettingsRepository settingsRepository;

    // ASUME Settings have only one row
    public Settings get(){
        return settingsRepository.findAll().stream().findFirst().orElse(null);
    }

    public AdditionalScannerConfigDto getAdditionalScannerConfig() {
        Settings settings = get();
        if (settings == null) {
            return new AdditionalScannerConfigDto(); // Returns default values (false)
        }
        return AdditionalScannerConfigDto.fromSettings(settings);
    }
}
