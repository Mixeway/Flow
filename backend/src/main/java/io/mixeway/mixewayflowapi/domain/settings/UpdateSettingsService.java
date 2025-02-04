package io.mixeway.mixewayflowapi.domain.settings;

import io.mixeway.mixewayflowapi.api.admin.dto.ConfigScaRequestDto;
import io.mixeway.mixewayflowapi.api.admin.dto.ConfigSmtpRequestDto;
import io.mixeway.mixewayflowapi.api.admin.dto.ConfigWizRequestDto;
import io.mixeway.mixewayflowapi.db.entity.Settings;
import io.mixeway.mixewayflowapi.db.repository.SettingsRepository;
import io.mixeway.mixewayflowapi.exceptions.SettingsException;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Log4j2
public class UpdateSettingsService {
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
}
