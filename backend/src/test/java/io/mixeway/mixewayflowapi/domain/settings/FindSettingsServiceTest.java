package io.mixeway.mixewayflowapi.domain.settings;

import io.mixeway.mixewayflowapi.api.admin.dto.AdditionalScannerConfigDto;
import io.mixeway.mixewayflowapi.api.admin.dto.ConfigWizRequestDto;
import io.mixeway.mixewayflowapi.config.TestConfig;
import io.mixeway.mixewayflowapi.db.entity.Settings;
import io.mixeway.mixewayflowapi.exceptions.SettingsException;
import org.junit.jupiter.api.Order;
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
@Order(0)
class FindSettingsServiceTest {
    @Autowired
    FindSettingsService findSettingsService;
    @Autowired
    UpdateSettingsService updateSettingsService;

    @Test
    void get() {
        Settings settings = findSettingsService.get();
        assertNotNull(settings);
    }
    @Test
    void getAdditionalScannerConfig_DefaultState() {
        AdditionalScannerConfigDto config = findSettingsService.getAdditionalScannerConfig();
        assertNotNull(config);
    }

    @Test
    void getAdditionalScannerConfig_AfterEnablingWiz() throws SettingsException {
        // First enable Wiz
        ConfigWizRequestDto configWizRequestDto = new ConfigWizRequestDto();
        configWizRequestDto.setEnabled(true);
        configWizRequestDto.setClientId("test-client-id");
        configWizRequestDto.setSecret("test-secret");
        updateSettingsService.changeSettingsWizConfig(configWizRequestDto);

        // Then get the config
        AdditionalScannerConfigDto config = findSettingsService.getAdditionalScannerConfig();
        assertNotNull(config);
        assertTrue(config.isWizEnabled());
    }

    @Test
    void getAdditionalScannerConfig_AfterDisablingWiz() throws SettingsException {
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

        // Finally get the config
        AdditionalScannerConfigDto config = findSettingsService.getAdditionalScannerConfig();
        assertNotNull(config);
        assertFalse(config.isWizEnabled());
    }
}