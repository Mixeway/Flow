package io.mixeway.mixewayflowapi.api.admin.service;

import io.mixeway.mixewayflowapi.api.admin.dto.*;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.entity.Settings;
import io.mixeway.mixewayflowapi.domain.settings.FindSettingsService;
import io.mixeway.mixewayflowapi.domain.settings.UpdateSettingsService;
import io.mixeway.mixewayflowapi.exceptions.SettingsException;
import io.mixeway.mixewayflowapi.integrations.llm.service.LlmApiClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminApiService {
    private final UpdateSettingsService updateSettingsService;
    private final FindSettingsService findSettingsService;
    private final LlmApiClient llmApiClient;


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

    public void llmConfig(List<LlmSourceConfigDto> llmSources) throws SettingsException {
        updateSettingsService.changeSettingsLlm(llmSources);
    }

    public LlmConnectivityResultDto testLlmConnectivity(LlmSourceConfigDto request) {
        if (request == null) {
            return LlmConnectivityResultDto.failure("LLM configuration is required", null, 0L);
        }
        if (!StringUtils.hasText(request.getApiUrl())) {
            return LlmConnectivityResultDto.failure("API URL is required", null, 0L);
        }
        if (!StringUtils.hasText(request.getModel())) {
            return LlmConnectivityResultDto.failure("Model name is required", null, 0L);
        }

        String apiKey = resolveTestApiKey(request);
        LlmApiClient.ConnectivityCheckResult result =
                llmApiClient.checkConnectivity(request.getApiUrl().trim(), apiKey, request.getModel().trim());
        if (result.ok()) {
            return LlmConnectivityResultDto.success(result.elapsedMs());
        }
        return LlmConnectivityResultDto.failure(result.message(), result.httpStatus(), result.elapsedMs());
    }

    private String resolveTestApiKey(LlmSourceConfigDto request) {
        String requested = request.getApiKey();
        if (StringUtils.hasText(requested) && !"************".equals(requested)) {
            return requested.trim();
        }
        if (!StringUtils.hasText(request.getSource())) {
            return null;
        }
        try {
            Finding.Source source = Finding.Source.valueOf(request.getSource().trim());
            Settings settings = findSettingsService.get();
            return settings == null ? null : settings.sourceLlmApiKey(source);
        } catch (IllegalArgumentException ignored) {
            return null;
        }
    }

    public void slaConfig(SlaConfigDto slaConfigDto) throws SettingsException {
        updateSettingsService.changeSlaConfig(slaConfigDto);
    }

    public SlaConfigDto getSlaConfig() {
        return findSettingsService.getSlaConfig();
    }
}
