package io.mixeway.mixewayflowapi.integrations.scanner.sca.apiclient;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.Settings;
import io.mixeway.mixewayflowapi.domain.coderepo.UpdateCodeRepoService;
import io.mixeway.mixewayflowapi.domain.dtrack.ProcessDTrackVulnDataService;
import io.mixeway.mixewayflowapi.integrations.scanner.sca.dto.*;
import io.mixeway.mixewayflowapi.utils.Constants;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.Base64;
import java.util.concurrent.TimeUnit;


@Service
@Log4j2
@RequiredArgsConstructor
public class DependencyTrackApiClientService {
    private final UpdateCodeRepoService updateCodeRepoService;
    private final ProcessDTrackVulnDataService processDTrackVulnDataService;

    @Value("${dependency-track.url}")
    private String dependencyTrackUrl;


    /**
     * Getting oAuth token for Dependency track using default username and password
     *
     * @return oAuth token
     */
    public String getOAuthToken(){
        WebClient webClient = WebClient.builder()
                .baseUrl(dependencyTrackUrl + Constants.DEPENDENCYTRACK_URL_LOGIN)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                .build();

        Mono<ResponseEntity<String>> responseMono = webClient.method(HttpMethod.POST)
                .bodyValue(Constants.DEPENDENCYTRACK_LOGIN_STRING)
                .retrieve()
                .toEntity(String.class);

        // Block to get the response synchronously
        ResponseEntity<String> response = responseMono.block();

        if (response != null && response.getStatusCode().equals(HttpStatus.OK)) {
            log.debug("[Dependency Track] Successfully logged");
            return response.getBody();
        }
        return null;
    }

    /**
     * Using obtained oAuth token to check apiKey which is set for Automation team and then save it to DB
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

        // Block to get the response synchronously
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
        return null; // or throw an exception if necessary
    }

    /**
     * Default API user doesn't have permission to view or create projects, those hase to be added
     *
     * @param automationTeamUuid
     */
    private void setPermissions(String automationTeamUuid) {
        String oAuthToken = getOAuthToken();
        String[] permissions = new String[] {"ACCESS_MANAGEMENT", "BOM_UPLOAD","PORTFOLIO_MANAGEMENT","PROJECT_CREATION_UPLOAD","SYSTEM_CONFIGURATION","VIEW_PORTFOLIO","VULNERABILITY_ANALYSIS"};

        for (String permision : permissions) {
            WebClient webClient = WebClient.builder()
                    .baseUrl(dependencyTrackUrl + Constants.DEPENDENCYTRACK_URL_PERMISSIONS + permision + "/team/" + automationTeamUuid)
                    .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + oAuthToken)
                    .build();
            Mono<ResponseEntity<String>> responseMono = webClient.method(HttpMethod.POST)
                    .retrieve()
                    .toEntity(String.class);

            // Block to get the response synchronously
            ResponseEntity<String> response = responseMono.block();

            if (response != null && response.getStatusCode().equals(HttpStatus.OK)) {
                log.info("[Dependency Track] Added team {} for Automation ApiKey", permision);
            }
        }
    }

    public String initializeAndGetApiKey() {
        // Create the WebClient and set up the request
        WebClient webClient = WebClient.builder()
                .baseUrl(dependencyTrackUrl + Constants.DEPENDENCYTRACK_URL_CHANGE_PASSWORD)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                .build();
        // CHange default password
        Mono<ResponseEntity<String>> responseMono = webClient.method(HttpMethod.POST)
                .bodyValue(Constants.DEPENDENCYTRACK_CHANGE_PASSWORD_STRING)
                .retrieve()
                .toEntity(String.class);

        ResponseEntity<String> response = responseMono.block();

        if (response != null && response.getStatusCode().equals(HttpStatus.OK)) {
            log.info("[Dependency Track] Default admin password changed");
            return this.getApiKey();
        }

        return null;
    }


    public void createProject(Settings settings, CodeRepo codeRepo) {
        WebClient webClient = WebClient.builder()
                .baseUrl(dependencyTrackUrl + Constants.DEPENDENCYTRACK_GET_PROJECTS)
                .defaultHeader(Constants.DEPENDENCYTRACK_APIKEY_HEADER, settings.getScaApiKey())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
        Mono<ResponseEntity<CreateProjectResponseDto>> responseMono = webClient.method(HttpMethod.PUT)
                .bodyValue(new CreateProjectRequestDto(codeRepo.getTeam().getName()+"-"+codeRepo.getName()))
                .retrieve()
                .toEntity(CreateProjectResponseDto.class);

        ResponseEntity<CreateProjectResponseDto> response = responseMono.block();

        if (response != null && response.getStatusCode().equals(HttpStatus.CREATED)) {
            updateCodeRepoService.updateScaUUID(codeRepo, response.getBody().getUuid());

            log.info("[Dependency Track] Create Project for {} - {}", codeRepo.getRepourl(), response.getBody().getUuid());
        }
    }
    /**
     * Browse the given directory looking for a file named sbom.json.
     *
     * @param dir The directory path to search.
     * @return File representing the sbom.json file, or null if not found.
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


    public boolean runScan(String dir, CodeRepo codeRepo, Settings settings, CodeRepoBranch codeRepoBranch) throws IOException, InterruptedException {
        File sbomFile = findSbom(dir);
        if (sbomFile != null) {
            log.info("[Dependency Track] SBOM detected in {}, proceeding with SCA scan...", codeRepo.getRepourl());
            sendBomToDTrack(codeRepo, sbomFile.getPath(), settings);
            TimeUnit.SECONDS.sleep(5);
            loadVulnerabilities(codeRepo, settings, codeRepoBranch);
            return true;
        } else {
            log.info("[Dependency Track] No SBOM in {}, skipping SCA scan", codeRepo.getRepourl());
            return false;
        }
    }

    private void sendBomToDTrack(CodeRepo codeRepo, String bomPath, Settings settings) throws IOException {
        WebClient webClient = WebClient.builder()
                .baseUrl(dependencyTrackUrl + Constants.DEPENDENCYTRACK_URL_UPLOAD_BOM)
                .defaultHeader(Constants.DEPENDENCYTRACK_APIKEY_HEADER, settings.getScaApiKey())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
        Mono<ResponseEntity<String>> responseMono = webClient.method(HttpMethod.PUT)
                .bodyValue(new SendBomRequestDto(codeRepo.getScaUUID(), encodeFileToBase64Binary(bomPath)))
                .retrieve()
                .toEntity(String.class);

        ResponseEntity<String> response = responseMono.block();

        if (response != null && response.getStatusCode().equals(HttpStatus.OK)) {
            log.info("[Dependency Track] Uploaded SBOM to Dependency Track for {}", codeRepo.getRepourl());
        }
    }
    /**
     * Encodes file content to base64
     * @param fileName file name to encode
     * @return return base64 string
     * @throws IOException
     */
    private static String encodeFileToBase64Binary(String fileName) throws IOException {
        File file = new File(fileName);
        byte[] fileContent = Files.readAllBytes(file.toPath());
        return Base64.getEncoder().encodeToString(fileContent);
    }


    private List<DTrackGetVulnResponseDto> loadVulnerabilities(CodeRepo codeRepo, Settings settings, CodeRepoBranch codeRepoBranch ){
        WebClient webClient = WebClient.builder()
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

    private void getComponents(CodeRepo codeRepo, Settings settings) {
        WebClient webClient = WebClient.builder()
                .baseUrl(dependencyTrackUrl + Constants.DEPENDENCYTRACK_URL_GET_COMPONENTS + codeRepo.getScaUUID() +"?limit=2000&offset=0")
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
