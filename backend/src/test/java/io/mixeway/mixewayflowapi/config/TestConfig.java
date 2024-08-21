package io.mixeway.mixewayflowapi.config;

import io.mixeway.mixewayflowapi.api.coderepo.dto.CreateCodeRepoRequestDto;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.Settings;
import io.mixeway.mixewayflowapi.domain.coderepo.UpdateCodeRepoService;
import io.mixeway.mixewayflowapi.domain.dtrack.ProcessDTrackVulnDataService;
import io.mixeway.mixewayflowapi.integrations.repo.dto.ImportCodeRepoResponseDto;
import io.mixeway.mixewayflowapi.integrations.repo.service.GetCodeRepoInfoService;
import io.mixeway.mixewayflowapi.integrations.scanner.sca.apiclient.DependencyTrackApiClientService;
import org.mockito.Mock;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

import java.net.MalformedURLException;
import java.util.HashMap;

import static org.mockito.Mockito.*;
import static org.mockito.Mockito.mock;

@TestConfiguration
public class TestConfig {


    @Bean
    @Primary
    public DependencyTrackApiClientService dependencyTrackApiClientService() {
        DependencyTrackApiClientService dependencyTrackApiClientService = mock(DependencyTrackApiClientService.class);
        doNothing().when(dependencyTrackApiClientService).createProject(any(Settings.class), any(CodeRepo.class));
        return dependencyTrackApiClientService;
    }
}
