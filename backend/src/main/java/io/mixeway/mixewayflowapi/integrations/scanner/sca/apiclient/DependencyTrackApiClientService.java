package io.mixeway.mixewayflowapi.integrations.scanner.sca.apiclient;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.Settings;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoRepository;
import io.mixeway.mixewayflowapi.domain.coderepo.UpdateCodeRepoService;
import io.mixeway.mixewayflowapi.domain.dtrack.ProcessDTrackVulnDataService;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import io.mixeway.mixewayflowapi.exceptions.ScanException;
import io.mixeway.mixewayflowapi.integrations.scanner.sca.dto.*;
import io.mixeway.mixewayflowapi.integrations.scanner.sca.service.CdxGenService;
import io.mixeway.mixewayflowapi.utils.Constants;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import reactor.core.publisher.Mono;

import java.io.File;
import java.io.IOException;
import java.net.ConnectException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.Base64;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

/**
 * Service responsible for interacting with Dependency Track API.
 * This service provides methods for obtaining OAuth tokens, API keys, creating projects,
 * uploading SBOMs, and retrieving vulnerabilities and components.
 */
@Service
@Log4j2
@RequiredArgsConstructor
public class DependencyTrackApiClientService {

    private final UpdateCodeRepoService updateCodeRepoService;
    private final ProcessDTrackVulnDataService processDTrackVulnDataService;
    private final CdxGenService cdxGenService;
    private final CodeRepoRepository codeRepoRepository;
    private final FindTeamService findTeamService;

    @Value("${dependency-track.url}")
    private String dependencyTrackUrl;

    /**
     * Obtains an OAuth token from Dependency Track using the default username and password.
     *
     * @return The OAuth token, or null if the authentication fails.
     */
    public String getOAuthToken() {
        WebClient webClient = WebClient.builder()
                .codecs(configurer -> configurer
                        .defaultCodecs()
                        .maxInMemorySize(32 * 1024 * 1024))
                .baseUrl(dependencyTrackUrl + Constants.DEPENDENCYTRACK_URL_LOGIN)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                .build();

        Mono<ResponseEntity<String>> responseMono = webClient.method(HttpMethod.POST)
                .bodyValue(Constants.DEPENDENCYTRACK_LOGIN_STRING)
                .retrieve()
                .toEntity(String.class);

        ResponseEntity<String> response = responseMono.block();

        if (response != null && response.getStatusCode().equals(HttpStatus.OK)) {
            log.debug("[Dependency Track] Successfully logged");
            return response.getBody();
        }
        return null;
    }

    /**
     * Retrieves the API key for the Automation team using the obtained OAuth token,
     * and saves it to the database if found.
     *
     * @return The API key, or null if not found.
     */
    public String getApiKey() {
        String oAuthToken = getOAuthToken();
        WebClient webClient = WebClient.builder()
                .baseUrl(dependencyTrackUrl + Constants.DEPENDENCYTRACK_URL_APIKEY)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + oAuthToken)
                .build();

        Mono<ResponseEntity<List<GetApiKeyResponseDto.ResponseObject>>> responseMono = webClient.method(HttpMethod.GET)
                .retrieve()
                .toEntityList(GetApiKeyResponseDto.ResponseObject.class);

        ResponseEntity<List<GetApiKeyResponseDto.ResponseObject>> response = responseMono.block();

        if (response != null && response.getStatusCode().equals(HttpStatus.OK)) {
            List<GetApiKeyResponseDto.ResponseObject> responseBody = response.getBody();
            if (responseBody != null) {
                for (GetApiKeyResponseDto.ResponseObject obj : responseBody) {
                    if ("Automation".equals(obj.getName()) && !obj.getApiKeys().isEmpty()) {
                        this.setPermissions(obj.getUuid());
                        return obj.getApiKeys().get(0).getKey();  // Return the API key directly
                    }
                }
            }
        }
        return null;
    }

    /**
     * Sets the necessary permissions for the Automation API user in Dependency Track.
     * These permissions are required to view and create projects, upload BOMs, and analyze vulnerabilities.
     *
     * @param automationTeamUuid The UUID of the Automation team.
     */
    private void setPermissions(String automationTeamUuid) {
        String oAuthToken = getOAuthToken();
        String[] permissions = new String[]{"ACCESS_MANAGEMENT", "BOM_UPLOAD", "PORTFOLIO_MANAGEMENT", "PROJECT_CREATION_UPLOAD", "SYSTEM_CONFIGURATION", "VIEW_PORTFOLIO", "VULNERABILITY_ANALYSIS"};

        for (String permission : permissions) {
            WebClient webClient = WebClient.builder()
                    .baseUrl(dependencyTrackUrl + Constants.DEPENDENCYTRACK_URL_PERMISSIONS + permission + "/team/" + automationTeamUuid)
                    .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + oAuthToken)
                    .build();
            Mono<ResponseEntity<String>> responseMono = webClient.method(HttpMethod.POST)
                    .retrieve()
                    .toEntity(String.class);

            ResponseEntity<String> response = responseMono.block();

            if (response != null && response.getStatusCode().equals(HttpStatus.OK)) {
                log.info("[Dependency Track] Added permission {} for Automation ApiKey", permission);
            }
        }
    }

    /**
     * Initializes the API key by changing the default admin password and then retrieving the API key.
     *
     * @return The initialized API key, or null if initialization fails.
     */
    public String initializeAndGetApiKey() {
        WebClient webClient = WebClient.builder()
                .baseUrl(dependencyTrackUrl + Constants.DEPENDENCYTRACK_URL_CHANGE_PASSWORD)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                .build();

        Mono<ResponseEntity<String>> responseMono = webClient.method(HttpMethod.POST)
                .bodyValue(Constants.DEPENDENCYTRACK_CHANGE_PASSWORD_STRING)
                .retrieve()
                .toEntity(String.class);

        try {
            ResponseEntity<String> response = responseMono.block();

            if (response != null && response.getStatusCode().equals(HttpStatus.OK)) {
                log.info("[Dependency Track] Default admin password changed");
                return this.getApiKey();
            }
        } catch (WebClientRequestException e){
            log.error("[Dependency Track] Error during initialization - {}", e.getLocalizedMessage());
        }

        return null;
    }

    /**
     * Creates a new project in Dependency Track for the specified code repository.
     *
     * @param settings  The settings containing the API key.
     * @param codeRepo  The code repository for which the project is created.
     */
    @Transactional
    public void createProject(Settings settings, CodeRepo codeRepo) {
        // Fetch the team eagerly using FindTeamService to avoid LazyInitializationException
        Optional<Team> teamOptional = findTeamService.findById(codeRepo.getTeam().getId());
        if (teamOptional.isEmpty()) {
            throw new EntityNotFoundException("Team not found with ID: " + codeRepo.getTeam().getId());
        }

        Team team = teamOptional.get();
        String projectName = team.getName() + "-" + codeRepo.getName();

        WebClient webClient = WebClient.builder()
                .baseUrl(dependencyTrackUrl + Constants.DEPENDENCYTRACK_GET_PROJECTS)
                .defaultHeader(Constants.DEPENDENCYTRACK_APIKEY_HEADER, settings.getScaApiKey())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();

        Mono<ResponseEntity<CreateProjectResponseDto>> responseMono = webClient.method(HttpMethod.PUT)
                .bodyValue(new CreateProjectRequestDto(projectName))
                .retrieve()
                .toEntity(CreateProjectResponseDto.class);

        try {
            ResponseEntity<CreateProjectResponseDto> response = responseMono.block();

            if (response != null && response.getStatusCode().equals(HttpStatus.CREATED)) {
                updateCodeRepoService.updateScaUUID(codeRepo, response.getBody().getUuid());
                log.info("[Dependency Track] Created Project for {} - {}", codeRepo.getRepourl(), response.getBody().getUuid());
            }
        } catch (Exception e){
            log.error("[SCA Service] Unable to connect with dTrack: {}", e.getMessage());
        }
    }

    /**
     * Searches for a file named sbom.json in the specified directory.
     *
     * @param dir The directory path to search.
     * @return The sbom.json file if found, or null if not found.
     */
    private File findSbom(String dir) {
        File directory = new File(dir);

        if (directory.isDirectory()) {
            File[] files = directory.listFiles();

            if (files != null) {
                for (File file : files) {
                    if (file.isFile() && "sbom.json".equals(file.getName())) {
                        return file;
                    }
                }
            }
        }
        return null;
    }

    /**
     * Runs a scan for the specified code repository and branch using the Dependency Track API.
     * If an SBOM file is found, it uploads the SBOM and processes vulnerabilities.
     *
     * @param dir           The directory to search for the SBOM file.
     * @param codeRepo      The code repository entity.
     * @param settings      The settings containing the API key.
     * @param codeRepoBranch The branch of the code repository.
     * @return True if the scan was performed, false if no SBOM was found.
     * @throws IOException          If an I/O error occurs during the scan.
     * @throws InterruptedException If the scan process is interrupted.
     */
    @Transactional
    public boolean runScan(String dir, CodeRepo codeRepo, Settings settings, CodeRepoBranch codeRepoBranch) throws IOException, InterruptedException, ScanException {
        File sbomFile = findSbom(dir);
        if (sbomFile == null) {
            cdxGenService.generateBom(dir,codeRepo,codeRepoBranch);
        }
        sbomFile = findSbom(dir);
        if (sbomFile != null) {
            log.info("[Dependency Track] SBOM detected in {}, proceeding with SCA scan...", codeRepo.getRepourl());
            sendBomToDTrack(codeRepo, sbomFile.getPath(), settings);
            TimeUnit.SECONDS.sleep(60);
            loadVulnerabilities(codeRepo, settings, codeRepoBranch);
            return true;
        } else {
            updateCodeRepoService.setScaPending(codeRepo);
            log.info("[Dependency Track] No SBOM in {}, skipping SCA scan", codeRepo.getRepourl());
            return false;
        }
    }

    /**
     * Uploads the SBOM file to Dependency Track for the specified code repository.
     * If the project doesn't exist, it creates it and retries the upload.
     *
     * @param codeRepo  The code repository entity.
     * @param bomPath   The path to the SBOM file.
     * @param settings  The settings containing the API key.
     * @throws IOException If an I/O error occurs during the upload.
     */
    private void sendBomToDTrack(CodeRepo codeRepo, String bomPath, Settings settings) throws IOException, ScanException {
        try {
            uploadBomToDTrack(codeRepo, bomPath, settings);
        } catch (ScanException e) {
            if (e.getMessage() != null && e.getMessage().contains("The project could not be found")) {
                log.info("[Dependency Track] Project not found for {}. Creating project and retrying upload...", codeRepo.getRepourl());
                createProject(settings, codeRepo);
                // Wait a bit for project creation to complete
                try {
                    TimeUnit.SECONDS.sleep(5);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new ScanException("Upload interrupted during retry");
                }
                // Retry upload
                uploadBomToDTrack(codeRepo, bomPath, settings);
            } else {
                throw e;
            }
        }
    }

    /**
     * Helper method to perform the actual SBOM upload to Dependency Track.
     *
     * @param codeRepo The code repository entity.
     * @param bomPath  The path to the SBOM file.
     * @param settings The settings containing the API key.
     * @throws IOException   If an I/O error occurs during the upload.
     * @throws ScanException If the upload fails.
     */
    private void uploadBomToDTrack(CodeRepo codeRepo, String bomPath, Settings settings) throws IOException, ScanException {
        WebClient webClient = WebClient.builder()
                .codecs(configurer -> configurer
                        .defaultCodecs()
                        .maxInMemorySize(32 * 1024 * 1024))
                .baseUrl(dependencyTrackUrl + Constants.DEPENDENCYTRACK_URL_UPLOAD_BOM)
                .defaultHeader(Constants.DEPENDENCYTRACK_APIKEY_HEADER, settings.getScaApiKey())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();

        Mono<ResponseEntity<String>> responseMono = webClient.method(HttpMethod.PUT)
                .bodyValue(new SendBomRequestDto(codeRepo.getScaUUID(), encodeFileToBase64Binary(bomPath)))
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(), clientResponse ->
                        clientResponse.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("[Dependency Track] Error uploading SBOM: {}", errorBody);
                                    return Mono.error(new ScanException("Error uploading SBOM: " + errorBody));
                                })
                )
                .toEntity(String.class);

        try {
            ResponseEntity<String> response = responseMono.block();

            if (response != null && response.getStatusCode().equals(HttpStatus.OK)) {
                log.info("[Dependency Track] Uploaded SBOM to Dependency Track for {}", codeRepo.getRepourl());
            }
        } catch (Exception e) {
            if (e instanceof ScanException) {
                throw (ScanException) e;
            }
            log.error("[Dependency Track] Error uploading SBOM - {}", e.getMessage());
            throw new ScanException("Failed to upload SBOM: " + e.getMessage());
        }
    }

    /**
     * Encodes the content of the specified file to a Base64 string.
     *
     * @param fileName The file name to encode.
     * @return The Base64 encoded string of the file content.
     * @throws IOException If an I/O error occurs during encoding.
     */
    private static String encodeFileToBase64Binary(String fileName) throws IOException {
        File file = new File(fileName);
        byte[] fileContent = Files.readAllBytes(file.toPath());
        return Base64.getEncoder().encodeToString(fileContent);
    }

    /**
     * Loads vulnerabilities for the specified code repository and branch from Dependency Track,
     * and processes the vulnerabilities and components.
     *
     * @param codeRepo       The code repository entity.
     * @param settings       The settings containing the API key.
     * @param codeRepoBranch The branch of the code repository.
     * @return A list of vulnerabilities.
     */
    private List<DTrackGetVulnResponseDto> loadVulnerabilities(CodeRepo codeRepo, Settings settings, CodeRepoBranch codeRepoBranch) {
        WebClient webClient = WebClient.builder()
                .codecs(configurer -> configurer
                        .defaultCodecs()
                        .maxInMemorySize(32 * 1024 * 1024))
                .baseUrl(dependencyTrackUrl + Constants.DEPENDENCYTRACK_URL_VULNS + codeRepo.getScaUUID())
                .defaultHeader(Constants.DEPENDENCYTRACK_APIKEY_HEADER, settings.getScaApiKey())
                .build();

        Mono<ResponseEntity<List<DTrackGetVulnResponseDto>>> responseMono = webClient.method(HttpMethod.GET)
                .retrieve()
                .toEntityList(DTrackGetVulnResponseDto.class);

        ResponseEntity<List<DTrackGetVulnResponseDto>> response = responseMono.block();

        if (response != null && response.getStatusCode().equals(HttpStatus.OK)) {
            processDTrackVulnDataService.processVulnerabilities(response.getBody(), codeRepo, codeRepoBranch);
            getComponents(codeRepo, settings);
            log.info("[Dependency Track] Loaded vulnerabilities SCA from: {}", codeRepo.getRepourl());
        }

        return new ArrayList<>();
    }

    /**
     * Retrieves and processes the components for the specified code repository from Dependency Track.
     *
     * @param codeRepo  The code repository entity.
     * @param settings  The settings containing the API key.
     */
    private void getComponents(CodeRepo codeRepo, Settings settings) {
        codeRepo = codeRepoRepository.findById(codeRepo.getId())
                .orElseThrow(() -> new EntityNotFoundException("CodeRepo not found with ID")) ;

        WebClient webClient = WebClient.builder()
                .codecs(configurer -> configurer
                        .defaultCodecs()
                        .maxInMemorySize(32 * 1024 * 1024))
                .baseUrl(dependencyTrackUrl + Constants.DEPENDENCYTRACK_URL_GET_COMPONENTS + codeRepo.getScaUUID() + "?limit=2000&offset=0")
                .defaultHeader(Constants.DEPENDENCYTRACK_APIKEY_HEADER, settings.getScaApiKey())
                .build();

        Mono<ResponseEntity<List<DTrackGetVulnResponseDto.Component>>> responseMono = webClient.method(HttpMethod.GET)
                .retrieve()
                .toEntityList(DTrackGetVulnResponseDto.Component.class);

        ResponseEntity<List<DTrackGetVulnResponseDto.Component>> response = responseMono.block();

        if (response != null && response.getStatusCode().equals(HttpStatus.OK)) {
            processDTrackVulnDataService.processComponents(response.getBody(), codeRepo);
        }
    }
}
