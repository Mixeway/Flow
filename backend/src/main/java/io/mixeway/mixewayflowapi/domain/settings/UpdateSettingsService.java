package io.mixeway.mixewayflowapi.domain.settings;

import io.mixeway.mixewayflowapi.api.admin.dto.ConfigScaRequestDto;
import io.mixeway.mixewayflowapi.api.admin.dto.ConfigSmtpRequestDto;
import io.mixeway.mixewayflowapi.api.admin.dto.ConfigWizRequestDto;
import io.mixeway.mixewayflowapi.api.admin.dto.LlmSourceConfigDto;
import io.mixeway.mixewayflowapi.api.admin.dto.OtherConfigRequestDto;
import io.mixeway.mixewayflowapi.api.admin.dto.SlaConfigDto;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.entity.Settings;
import io.mixeway.mixewayflowapi.db.repository.SettingsRepository;
import io.mixeway.mixewayflowapi.exceptions.SettingsException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Log4j2
public class UpdateSettingsService {
    private static final int DEFAULT_CONTEXT_WINDOW = 8192;
    private static final int DEFAULT_SCAN_CONCURRENCY = 2;
    private static final int MIN_CONTEXT_WINDOW = 256;
    private static final int MAX_CONTEXT_WINDOW = 200000;
    private static final int MAX_SCAN_CONCURRENCY = 16;

    private final SettingsRepository settingsRepository;
    private final FindSettingsService findSettingsService;


    @Transactional
    public void changeSettingsScaConfig(ConfigScaRequestDto configScaRequestDto) throws SettingsException {
        Settings settings = findSettingsService.get();
        if (configScaRequestDto.isScaTypeEmbedded()){
            settings.configScaEmbedded();
            settingsRepository.save(settings);
            log.info("[Settings] Changed SCA Config. Selected SCA Embedded Dependency-Track");
        } else if (configScaRequestDto.isScaTypeExternal()){
            settings.configScaExternalDT(configScaRequestDto.getScaApiUrl(), configScaRequestDto.getScaApiKey());
            settingsRepository.save(settings);
            log.info("[Settings] Changed SCA Config. Selected SCA External Dependency-Track - {}", configScaRequestDto.getScaApiUrl());
        } else {
            log.warn("[Settings] Error setting SCA config - external Dependency-Track or embedded is required");
            throw new SettingsException("Embedded or external option must be selected");

        }
    }

    @Transactional
    public void changeSettingsScaConfig(String hostname, String apikey) throws SettingsException {
        Settings settings = findSettingsService.get();
        if(hostname!= null && apikey!=null){
            settings.configScaEmbeddedInitialized(hostname, apikey);
            settingsRepository.save(settings);
        } else {
            log.error("SCA scanner when initialized must have hostname and apikey not null");
        }
    }


    @Transactional
    public void changeSettingSmtpConfig(ConfigSmtpRequestDto configSmtpRequestDto){
        Settings settings = findSettingsService.get();
        if (configSmtpRequestDto.isEnabled()){
            settings.enableSMTP(configSmtpRequestDto.getHostname(), configSmtpRequestDto.getPort(), configSmtpRequestDto.getUsername(),
                    configSmtpRequestDto.getPassword(), configSmtpRequestDto.isTls(), configSmtpRequestDto.isStartls());
            settingsRepository.save(settings);
            log.info("[Settings] Changed Settings Config. Enabled SMTP");
        } else {
            settings.disableSMTP();
            settingsRepository.save(settings);
            log.info("[Settings] Disabled SMTP Config");
        }
    }

    @Transactional
    public void changeSettingsWizConfig(ConfigWizRequestDto configWizRequestDto) throws SettingsException {
        Settings settings = findSettingsService.get();
        if (configWizRequestDto.isEnabled()) {
            if (configWizRequestDto.getClientId() == null || configWizRequestDto.getSecret() == null) {
                log.warn("[Settings] Error setting Wiz config - client ID and secret are required when enabling Wiz");
                throw new SettingsException("Client ID and secret are required when enabling Wiz");
            }
            settings.enableWiz(configWizRequestDto.getClientId(), configWizRequestDto.getSecret());
            settingsRepository.save(settings);
            log.info("[Settings] Changed Wiz Config. Enabled Wiz scanner with client ID: {}", configWizRequestDto.getClientId());
        } else {
            settings.disableWiz();
            settingsRepository.save(settings);
            log.info("[Settings] Disabled Wiz Config");
        }
    }

    /**
     * Stores the remediation SLA per severity. A null value clears the SLA for that severity,
     * which is how "no SLA tracked" is expressed.
     */
    @Transactional
    public void changeSlaConfig(SlaConfigDto slaConfigDto) throws SettingsException {
        Settings settings = findSettingsService.get();
        if (settings == null) {
            log.error("[Settings] Cannot store SLA config, settings row is missing");
            throw new SettingsException("Settings are not initialized");
        }

        settings.configSla(
                slaConfigDto.getCriticalDays(),
                slaConfigDto.getHighDays(),
                slaConfigDto.getMediumDays(),
                slaConfigDto.getLowDays()
        );
        settingsRepository.save(settings);
        log.info("[Settings] Changed SLA config - critical: {}, high: {}, medium: {}, low: {}",
                slaConfigDto.getCriticalDays(), slaConfigDto.getHighDays(),
                slaConfigDto.getMediumDays(), slaConfigDto.getLowDays());
    }

    @Transactional
    public void changeSettingsOther(OtherConfigRequestDto otherConfigRequestDto) throws SettingsException {
        Settings settings = findSettingsService.get();
        if(otherConfigRequestDto.getGeminiApiKey() != null){
            settings.setGeminiApiKey(otherConfigRequestDto.getGeminiApiKey());
        }

        settingsRepository.save(settings);
    }

    @Transactional
    public void changeSettingsLlm(List<LlmSourceConfigDto> llmSources) throws SettingsException {
        if (llmSources == null) {
            throw new SettingsException("LLM source configuration is required");
        }
        Settings settings = findSettingsService.get();
        applyLlmSources(settings, llmSources);
        settingsRepository.save(settings);
    }

    private void applyLlmSources(Settings settings, List<LlmSourceConfigDto> llmSources) throws SettingsException {
        for (LlmSourceConfigDto dto : llmSources) {
            if (dto == null || !hasText(dto.getSource())) {
                throw new SettingsException("LLM source is required");
            }
            Finding.Source source;
            try {
                source = Finding.Source.valueOf(dto.getSource().trim());
            } catch (IllegalArgumentException ex) {
                throw new SettingsException("Unknown LLM source: " + dto.getSource());
            }

            int contextWindow = normalizeContextWindow(dto.getContextWindow(), source, dto.isEnabled());
            int scanConcurrency = normalizeScanConcurrency(dto.getScanConcurrency(), source, dto.isEnabled());
            String severities = normalizeSeverities(dto.getSeverities(), source, dto.isEnabled());
            if (dto.isEnabled()) {
                String apiKey = resolveLlmApiKey(storedLlmApiKey(settings, source), dto.getApiKey());
                if (!hasText(dto.getApiUrl()) || !hasText(apiKey) || !hasText(dto.getModel())) {
                    log.warn("[Settings] Error enabling LLM for {} - API URL, API key and model are required", source);
                    throw new SettingsException("API URL, API key and model are required when enabling LLM for " + source);
                }
                settings.upsertLlmSource(source, true, dto.getApiUrl().trim(), apiKey, dto.getModel().trim(), contextWindow, scanConcurrency, severities);
                log.info("[Settings] LLM enabled for {} with URL: {}", source, dto.getApiUrl());
            } else {
                settings.upsertLlmSource(source, false, null, null, null, contextWindow, scanConcurrency, severities);
                log.info("[Settings] LLM disabled for {}", source);
            }
        }
    }

    private String storedLlmApiKey(Settings settings, Finding.Source source) {
        return settings.sourceLlmApiKey(source);
    }

    private String resolveLlmApiKey(String storedApiKey, String requestedApiKey) {
        if (hasText(requestedApiKey) && !isMaskedSecret(requestedApiKey)) {
            return requestedApiKey;
        }
        return storedApiKey;
    }

    private boolean isMaskedSecret(String value) {
        return "************".equals(value);
    }

    private int normalizeContextWindow(Integer value, Finding.Source source, boolean required) throws SettingsException {
        if (value == null) {
            if (required) {
                throw new SettingsException("Context window is required when enabling LLM for " + source);
            }
            return DEFAULT_CONTEXT_WINDOW;
        }
        if (value < MIN_CONTEXT_WINDOW || value > MAX_CONTEXT_WINDOW) {
            throw new SettingsException("Context window for " + source + " must be between " + MIN_CONTEXT_WINDOW + " and " + MAX_CONTEXT_WINDOW);
        }
        return value;
    }

    private String normalizeSeverities(List<String> requested, Finding.Source source, boolean required) throws SettingsException {
        Set<Finding.Severity> selected = EnumSet.noneOf(Finding.Severity.class);
        if (requested != null) {
            for (String value : requested) {
                if (value == null || value.isBlank()) {
                    continue;
                }
                try {
                    selected.add(Finding.Severity.valueOf(value.trim().toUpperCase()));
                } catch (IllegalArgumentException ex) {
                    throw new SettingsException("Unknown severity for " + source + ": " + value);
                }
            }
        }
        if (selected.isEmpty()) {
            if (required) {
                throw new SettingsException("Select at least one severity when enabling LLM for " + source);
            }
            return "CRITICAL,HIGH";
        }
        List<String> ordered = new ArrayList<>();
        for (Finding.Severity severity : Finding.Severity.values()) {
            if (selected.contains(severity)) {
                ordered.add(severity.name());
            }
        }
        return String.join(",", ordered);
    }

    private int normalizeScanConcurrency(Integer value, Finding.Source source, boolean required) throws SettingsException {
        if (value == null) {
            if (required) {
                throw new SettingsException("Scan concurrency is required when enabling LLM for " + source);
            }
            return DEFAULT_SCAN_CONCURRENCY;
        }
        if (value < 1 || value > MAX_SCAN_CONCURRENCY) {
            throw new SettingsException("Scan concurrency for " + source + " must be between 1 and " + MAX_SCAN_CONCURRENCY);
        }
        return value;
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }
}
