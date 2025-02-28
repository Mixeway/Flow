package io.mixeway.mixewayflowapi.integrations.scanner.cloud_scanner.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.mixeway.mixewayflowapi.db.entity.Settings;
import io.mixeway.mixewayflowapi.domain.settings.FindSettingsService;
import io.mixeway.mixewayflowapi.integrations.scanner.cloud_scanner.dto.CloudScannerReport;
import io.mixeway.mixewayflowapi.integrations.scanner.cloud_scanner.dto.ProjectExternalNameResponse;
import io.mixeway.mixewayflowapi.scanmanager.service.ScanManagerService;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class FetchProjectExternalName {
    private final FindSettingsService findSettingsService;
    private final WebClient webClient;
    private final ScanManagerService scanManagerService;

    public FetchProjectExternalName(FindSettingsService findSettingsService, WebClient webClient, ScanManagerService scanManagerService) {
        this.findSettingsService = findSettingsService;
        this.webClient = webClient;
        this.scanManagerService = scanManagerService;
    }
    public String fetchProjectExternalName(String projectId) {
        ObjectMapper objectMapper = new ObjectMapper();
        Settings settings = findSettingsService.get();

        String wizClientID = settings.getWizClientId();
        String wizSecret = settings.getWizSecret();

        if (wizClientID == null || wizClientID.isEmpty()) {
            throw new IllegalStateException("Wiz clientID is not configured in settings.");
        }
        if (wizSecret == null || wizSecret.isEmpty()) {
            throw new IllegalStateException("Wiz secret is not configured in settings.");
        }

        String wizAuthToken = scanManagerService.generateWizAuthToken(wizClientID, wizSecret);

        String query = "query fetchProjectExternalName($project_name: ID) { " +
                "  project(id: $project_name) { " +
                "    name " +
                "  } " +
                "}";

        String variables = "{\"project_name\":\"" + projectId + "\"}";
        String requestBody = "{\"query\": \"" + query + "\", \"variables\": " + variables + "}";

        String response = webClient.post()
                .uri("https://api.eu13.app.wiz.io/graphql")
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + wizAuthToken)
                .body(BodyInserters.fromValue(requestBody))
                .retrieve()
                .bodyToMono(String.class)
                .block();

        try {
            ProjectExternalNameResponse responseDTO = objectMapper.readValue(response, ProjectExternalNameResponse.class);
            return responseDTO.getData().getProject().getExternalProjectName();
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse response: " + e.getMessage(), e);
        }
    }
}
