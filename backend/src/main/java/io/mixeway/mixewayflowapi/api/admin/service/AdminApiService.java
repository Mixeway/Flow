package io.mixeway.mixewayflowapi.api.admin.service;

import io.mixeway.mixewayflowapi.api.admin.dto.ConfigScaRequestDto;
import io.mixeway.mixewayflowapi.api.admin.dto.ConfigSmtpRequestDto;
import io.mixeway.mixewayflowapi.db.entity.Settings;
import io.mixeway.mixewayflowapi.domain.settings.FindSettingsService;
import io.mixeway.mixewayflowapi.domain.settings.UpdateSettingsService;
import io.mixeway.mixewayflowapi.exceptions.SettingsException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminApiService {
    private final UpdateSettingsService updateSettingsService;
    private final FindSettingsService findSettingsService;


    public void scaConfig(ConfigScaRequestDto configScaRequestDto) throws SettingsException {
        updateSettingsService.changeSettingsScaConfig(configScaRequestDto);
    }

    public void smtpConfig(ConfigSmtpRequestDto configSmtpRequestDto) {
        updateSettingsService.changeSettingSmtpConfig(configSmtpRequestDto);
    }

    public Settings get() {
        return findSettingsService.get();
    }
}
