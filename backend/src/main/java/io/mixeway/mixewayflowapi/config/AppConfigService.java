package io.mixeway.mixewayflowapi.config;

import io.mixeway.mixewayflowapi.db.entity.AppConfig;
import io.mixeway.mixewayflowapi.db.repository.AppConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AppConfigService {
    private final AppConfigRepository appConfigRepository;

    public enum RunMode {
        STANDALONE, SAAS
    }

    public RunMode getRunMode() {
        Optional<AppConfig> runModeConfig = appConfigRepository.findByKey("RUN_MODE");

        if (runModeConfig.isPresent()) {
            String value = runModeConfig.get().getValue();

            try {
                return RunMode.valueOf(value);
            } catch (IllegalArgumentException e) {
                // Default to STANDALONE if the value is invalid
                return RunMode.STANDALONE;
            }
        }

        // Default to STANDALONE if not configured
        return RunMode.STANDALONE;
    }

    public boolean isSaasMode() {
        return getRunMode() == RunMode.SAAS;
    }

    public void setRunMode(RunMode mode) {
        Optional<AppConfig> runModeConfig = appConfigRepository.findByKey("RUN_MODE");

        if (runModeConfig.isPresent()) {
            AppConfig config = runModeConfig.get();
            config.updateValue(mode.name());
            appConfigRepository.save(config);
        } else {
            AppConfig config = new AppConfig("RUN_MODE", mode.name());
            appConfigRepository.save(config);
        }
    }
}