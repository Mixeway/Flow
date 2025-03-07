package io.mixeway.mixewayflowapi.integrations.scanner.cloud_scanner.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.mixeway.mixewayflowapi.domain.settings.FindSettingsService;
import io.mixeway.mixewayflowapi.integrations.scanner.cloud_scanner.dto.CloudScannerReport;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

@Log4j2
@Service
public class CloudScannerService {
    private final FindSettingsService findSettingsService;
    private final WebClient webClient;

    public CloudScannerReport runCloudScanner(String projectId, String wizAuthToken) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        String cloudScannerJSONReport = fetchVulnerabilityFindings(projectId, wizAuthToken);
        CloudScannerReport cloudScannerReport = objectMapper.readValue(cloudScannerJSONReport, CloudScannerReport.class);
        return cloudScannerReport;
    }

    public CloudScannerService(FindSettingsService findSettingsService, WebClient webClient) {
        this.findSettingsService = findSettingsService;
        this.webClient = webClient;
    }

    public String fetchVulnerabilityFindings(String projectId, String wizAuthToken) {
        String query = "query VulnerabilityFindings($project_name: [String!]) { " +
                "vulnerabilityFindings(first: 800 filterBy: {status: [OPEN, IN_PROGRESS], assetType: VIRTUAL_MACHINE, severity: CRITICAL, hasExploit: true, hasFix: true, detectionMethod: [PACKAGE, OS], projectId: $project_name} orderBy: {direction: DESC}) { " +
                "nodes { name severity vulnerableAsset { ... on VulnerableAssetBase { subscriptionExternalId name } } detailedName CVEDescription version fixedVersion remediation epssProbability epssPercentile hasExploit} }}";

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
        return response;
    }

}
