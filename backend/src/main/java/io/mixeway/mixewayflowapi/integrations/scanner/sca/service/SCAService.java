package io.mixeway.mixewayflowapi.integrations.scanner.sca.service;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.Settings;
import io.mixeway.mixewayflowapi.domain.settings.FindSettingsService;
import io.mixeway.mixewayflowapi.domain.settings.UpdateSettingsService;
import io.mixeway.mixewayflowapi.exceptions.SettingsException;
import io.mixeway.mixewayflowapi.integrations.scanner.sca.apiclient.DependencyTrackApiClientService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URISyntaxException;

/**
 * Service responsible for managing Software Composition Analysis (SCA) processes, including
 * initializing the Dependency Track instance, creating projects, and running scans.
 */
@Service
@RequiredArgsConstructor
@Log4j2
public class SCAService {

    @Value("${dependency-track.url}")
    private String dependencyTrackUrl;

    private final DependencyTrackApiClientService dependencyTrackApiClientService;
    private final FindSettingsService findSettingsService;
    private final UpdateSettingsService updateSettingsService;

    /**
     * Initializes the SCA environment by setting up the Dependency Track instance and generating
     * the necessary API key if it is not already available. Logs the progress and outcome.
     *
     */
    public void initialize()  {
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
        } catch (Exception e) {
            log.error("[SCA Service] Cannot initialize Dependency Track embedded.", e);
        }
    }

    /**
     * Creates a new project in Dependency Track for the specified code repository.
     *
     * @param codeRepo The code repository for which the project will be created.
     */
    public void createDtrackProject(CodeRepo codeRepo) {
        Settings settings = findSettingsService.get();
        dependencyTrackApiClientService.createProject(settings, codeRepo);
    }

    /**
     * Runs a Software Composition Analysis (SCA) scan on the specified code repository and branch.
     * The scan is performed using Dependency Track, and the results are processed and saved.
     *
     * @param repoDir        The directory containing the code repository to be scanned.
     * @param codeRepo       The code repository entity.
     * @param codeRepoBranch The branch of the code repository to be scanned.
     * @return {@code true} if the scan was successful and the results were processed, {@code false} otherwise.
     * @throws IOException          If an I/O error occurs during the scan process.
     * @throws InterruptedException If the scan process is interrupted.
     */
    public boolean runScan(String repoDir, CodeRepo codeRepo, CodeRepoBranch codeRepoBranch) throws IOException, InterruptedException {
        Settings settings = findSettingsService.get();
        return dependencyTrackApiClientService.runScan(repoDir, codeRepo, settings, codeRepoBranch);
    }
}
