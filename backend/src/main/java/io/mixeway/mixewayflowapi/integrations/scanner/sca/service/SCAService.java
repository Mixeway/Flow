package io.mixeway.mixewayflowapi.integrations.scanner.sca.service;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.Settings;
import io.mixeway.mixewayflowapi.domain.settings.FindSettingsService;
import io.mixeway.mixewayflowapi.domain.settings.UpdateSettingsService;
import io.mixeway.mixewayflowapi.integrations.scanner.sca.apiclient.DependencyTrackApiClientService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URISyntaxException;

@Service
@RequiredArgsConstructor
@Log4j2
public class SCAService {

    @Value("${dependency-track.url}")
    private String dependencyTrackUrl;

    private final DependencyTrackApiClientService dependencyTrackApiClientService;
    private final FindSettingsService findSettingsService;
    private final UpdateSettingsService updateSettingsService;

    public void initialize() throws URISyntaxException {
        try {
            Settings settings = findSettingsService.get();
            if (settings.isScaModeEmbeded() && settings.getScaApiKey() == null) {
                log.info("[SCA Initializer] SCA Mode is Embedded, APIKey not generated. Starting to initialize...");
                String apiKey = dependencyTrackApiClientService.initializeAndGetApiKey();
                updateSettingsService.changeSettingsScaConfig(dependencyTrackUrl, apiKey);
                log.info("[SCA Initializer] SCA Initialized");
            } else if (settings.isScaModeEmbeded()) {
                if (dependencyTrackApiClientService.getOAuthToken() != null) {
                    log.info("[SCA Initializer] SCA Initialized properly");
                }
            } else {
                log.error("[SCA Initializer] Unknown or not supported SCA option, review Your settings.");
            }
        } catch (Exception e ) {
            log.error("[SCA Service] Cannot initialize Dependency Track embedded.");
        }
    }
    public void createDtrackProject(CodeRepo codeRepo){
        Settings settings= findSettingsService.get();
        dependencyTrackApiClientService.createProject(settings, codeRepo);
    }

    public boolean runScan(String repoDir, CodeRepo codeRepo, CodeRepoBranch codeRepoBranch) throws IOException, InterruptedException {
        Settings settings= findSettingsService.get();
         return dependencyTrackApiClientService.runScan(repoDir, codeRepo, settings, codeRepoBranch);
    }
}
