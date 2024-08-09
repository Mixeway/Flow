package io.mixeway.mixewayflowapi.domain.settings;

import io.mixeway.mixewayflowapi.db.entity.Settings;
import io.mixeway.mixewayflowapi.db.repository.SettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetOrCreateSettingsService {
    private final SettingsRepository settingsRepository;

//    public Settings getSettings() {
//        return settingsRepository.findAll().stream().findFirst().orElseGet(this::createSettings);
//    }

//    private Settings createSettings(){
//        Settings settings = new Settings(false);
//        return settingsRepository.save(settings);
//    }
}
