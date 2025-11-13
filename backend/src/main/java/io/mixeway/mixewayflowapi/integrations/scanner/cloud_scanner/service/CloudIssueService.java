package io.mixeway.mixewayflowapi.integrations.scanner.cloud_scanner.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.mixeway.mixewayflowapi.domain.settings.FindSettingsService;
import io.mixeway.mixewayflowapi.integrations.scanner.cloud_scanner.dto.CloudIssueReport;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

@Log4j2
@Service
public class CloudIssueService {
    private final FindSettingsService findSettingsService;
    private final WebClient webClient;

    public CloudIssueService(FindSettingsService findSettingsService, WebClient webClient) {
        this.findSettingsService = findSettingsService;
        this.webClient = webClient;
    }

    public CloudIssueReport runCloudIssueScanner(String projectId, String wizAuthToken) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        String cloudIssueJSONReport = fetchCloudIssues(projectId, wizAuthToken);
        CloudIssueReport cloudIssueReport = objectMapper.readValue(cloudIssueJSONReport, CloudIssueReport.class);
        return cloudIssueReport;
    }

    public String fetchCloudIssues(String projectId, String wizAuthToken) {
        String query = "query GetIssuesBySeverity { issuesV2(filterBy: { severity: [CRITICAL, HIGH], status: [OPEN, IN_PROGRESS], project: \\\"" + projectId + "\\\" }, first: 500) { nodes { id severity status type createdAt entitySnapshot { name type cloudPlatform } sourceRules { ... on CloudConfigurationRule { name description } ... on Control { name description resolutionRecommendationPlainText} } validatedAsExploitable } } }";

        String requestBody = "{\"query\": \"" + query + "\"}";

        String response = webClient.post()
                .uri("https://api.eu13.app.wiz.io/graphql")
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + wizAuthToken)
                .body(BodyInserters.fromValue(requestBody))
                .retrieve()
                .bodyToMono(String.class)
                .block();
        return response;
    }

}
