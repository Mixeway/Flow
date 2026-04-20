package io.mixeway.mixewayflowapi.api.admin.service;

import io.mixeway.mixewayflowapi.api.admin.dto.*;
import io.mixeway.mixewayflowapi.db.entity.Settings;
import io.mixeway.mixewayflowapi.domain.settings.FindSettingsService;
import io.mixeway.mixewayflowapi.domain.settings.UpdateSettingsService;
import io.mixeway.mixewayflowapi.exceptions.SettingsException;
import io.mixeway.mixewayflowapi.integrations.ollama.dto.OllamaTagsResponse;
import io.mixeway.mixewayflowapi.integrations.ollama.service.OllamaClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminApiService {
    private final UpdateSettingsService updateSettingsService;
    private final FindSettingsService findSettingsService;
    private final OllamaClient ollamaClient;


    public void scaConfig(ConfigScaRequestDto configScaRequestDto) throws SettingsException {
        updateSettingsService.changeSettingsScaConfig(configScaRequestDto);
    }

    public void smtpConfig(ConfigSmtpRequestDto configSmtpRequestDto) {
        updateSettingsService.changeSettingSmtpConfig(configSmtpRequestDto);
    }

    public Settings get() {
        return findSettingsService.get();
    }

    public void wizConfig(ConfigWizRequestDto configWizRequestDto) throws SettingsException {
        updateSettingsService.changeSettingsWizConfig(configWizRequestDto);
    }
    public AdditionalScannerConfigDto getAdditionalScannerConfig() {
        return findSettingsService.getAdditionalScannerConfig();
    }

    public boolean isWizEnabled() {
        Settings settings = findSettingsService.get();
        return settings.isEnableWiz();
    }

    public void otherConfig(OtherConfigRequestDto otherConfigRequestDto) throws SettingsException {
        updateSettingsService.changeSettingsOther(otherConfigRequestDto);
    }

    public void ollamaConfig(OllamaConfigRequestDto dto) {
        updateSettingsService.changeOllamaConfig(dto);
    }

    public OllamaTestConnectionResponseDto testOllamaConnection(OllamaTestRequestDto req) {
        Settings s = findSettingsService.get();
        String base;
        if (req != null && req.getBaseUrl() != null && !req.getBaseUrl().isBlank()) {
            base = req.getBaseUrl().trim();
        } else if (s != null && s.getOllamaBaseUrl() != null && !s.getOllamaBaseUrl().isBlank()) {
            base = s.getOllamaBaseUrl().trim();
        } else {
            base = "http://localhost:11434";
        }
        int timeout = s != null ? s.getOllamaTimeoutSeconds() : 120;
        Optional<OllamaTagsResponse> tags = ollamaClient.tags(base, timeout);
        if (tags.isEmpty()) {
            return new OllamaTestConnectionResponseDto(false, List.of(), "Could not reach Ollama at " + base);
        }
        List<String> models = OllamaClient.modelNames(tags.get());
        return new OllamaTestConnectionResponseDto(true, models, null);
    }
}
