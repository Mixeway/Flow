package io.mixeway.mixewayflowapi.config;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.Settings;
import io.mixeway.mixewayflowapi.integrations.scanner.sca.apiclient.DependencyTrackApiClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;



import static org.mockito.Mockito.*;
import static org.mockito.Mockito.mock;

@TestConfiguration
@RequiredArgsConstructor
public class TestConfig {

    @Bean
    @Primary
    public DependencyTrackApiClientService dependencyTrackApiClientService() {
        DependencyTrackApiClientService dependencyTrackApiClientService = mock(DependencyTrackApiClientService.class);
        doNothing().when(dependencyTrackApiClientService).createProject(any(Settings.class), any(CodeRepo.class));
        return dependencyTrackApiClientService;
    }
}
