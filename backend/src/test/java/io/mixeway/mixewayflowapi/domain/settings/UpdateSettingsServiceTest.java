package io.mixeway.mixewayflowapi.domain.settings;

import io.mixeway.mixewayflowapi.api.admin.dto.ConfigScaRequestDto;
import io.mixeway.mixewayflowapi.api.admin.dto.ConfigSmtpRequestDto;
import io.mixeway.mixewayflowapi.api.admin.dto.ConfigWizRequestDto;
import io.mixeway.mixewayflowapi.config.TestConfig;
import io.mixeway.mixewayflowapi.db.entity.Settings;
import io.mixeway.mixewayflowapi.exceptions.SettingsException;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@RunWith(SpringRunner.class)
@ActiveProfiles("ut")
@Import(TestConfig.class)
class UpdateSettingsServiceTest {
    @Autowired
    FindSettingsService findSettingsService;
    @Autowired
    UpdateSettingsService updateSettingsService;

    @Test
    void changeSettingsScaConfig() throws SettingsException {
        ConfigScaRequestDto configScaRequestDto = new ConfigScaRequestDto();
        configScaRequestDto.setScaTypeEmbedded(true);
        configScaRequestDto.setScaTypeExternal(false);
        configScaRequestDto.setScaApiUrl("https://example.com");
        configScaRequestDto.setScaApiUrl("test");

        updateSettingsService.changeSettingsScaConfig(configScaRequestDto);

        Settings settings = findSettingsService.get();
        assertTrue(settings.isScaModeEmbeded());
    }

    @Test
    void testChangeSettingsScaConfig() throws SettingsException {
        updateSettingsService.changeSettingsScaConfig("https://example2.com","testtest");
        Settings settings = findSettingsService.get();
        assertEquals("testtest", settings.getScaApiKey());
        assertEquals("https://example2.com", settings.getScaApiUrl());
    }

    @Test
    void changeSettingSmtpConfig() {
        ConfigSmtpRequestDto configSmtpRequestDto = new ConfigSmtpRequestDto();
        configSmtpRequestDto.setEnabled(true);
        configSmtpRequestDto.setTls(true);
        configSmtpRequestDto.setStartls(true);
        configSmtpRequestDto.setHostname("test.com");
        configSmtpRequestDto.setPort(587);
        configSmtpRequestDto.setUsername("user");
        configSmtpRequestDto.setPassword("password");

        updateSettingsService.changeSettingSmtpConfig(configSmtpRequestDto);

        Settings settings = findSettingsService.get();

        assertTrue(settings.isSmtpStarttls());
        assertTrue(settings.isSmtpTls());
        assertEquals("test.com", settings.getSmtpHostname());
        assertEquals("user", settings.getSmtpUsername());
        assertEquals("password", settings.getSmtpPassword());
        assertEquals(587, settings.getSmtpPort());
    }
    @Test
    void changeSettingsWizConfig_Enable() throws SettingsException {
        ConfigWizRequestDto configWizRequestDto = new ConfigWizRequestDto();
        configWizRequestDto.setEnabled(true);
        configWizRequestDto.setClientId("test-client-id");
        configWizRequestDto.setSecret("test-secret");

        updateSettingsService.changeSettingsWizConfig(configWizRequestDto);

        Settings settings = findSettingsService.get();
        assertTrue(settings.isEnableWiz());
        assertEquals("test-client-id", settings.getWizClientId());
        assertEquals("test-secret", settings.getWizSecret());
    }

    @Test
    void changeSettingsWizConfig_Disable() throws SettingsException {
        // First enable Wiz
        ConfigWizRequestDto enableDto = new ConfigWizRequestDto();
        enableDto.setEnabled(true);
        enableDto.setClientId("test-client-id");
        enableDto.setSecret("test-secret");
        updateSettingsService.changeSettingsWizConfig(enableDto);

        // Then disable it
        ConfigWizRequestDto disableDto = new ConfigWizRequestDto();
        disableDto.setEnabled(false);
        updateSettingsService.changeSettingsWizConfig(disableDto);

        Settings settings = findSettingsService.get();
        assertFalse(settings.isEnableWiz());
        assertNull(settings.getWizClientId());
        assertNull(settings.getWizSecret());
    }

    @Test
    void changeSettingsWizConfig_EnableWithoutCredentials() {
        ConfigWizRequestDto configWizRequestDto = new ConfigWizRequestDto();
        configWizRequestDto.setEnabled(true);
        // Not setting clientId and secret

        assertThrows(SettingsException.class, () -> {
            updateSettingsService.changeSettingsWizConfig(configWizRequestDto);
        });
    }
}