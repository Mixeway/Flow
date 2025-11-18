package io.mixeway.mixewayflowapi.integrations.scanner.cloud_scanner.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.mixeway.mixewayflowapi.domain.settings.FindSettingsService;
import io.mixeway.mixewayflowapi.integrations.scanner.cloud_scanner.dto.CloudScannerReport;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;

@Log4j2
@Service
public class CloudScannerService {
    private final FindSettingsService findSettingsService;
    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public CloudScannerService(FindSettingsService findSettingsService, WebClient webClient) {
        this.findSettingsService = findSettingsService;
        this.webClient = webClient;
        this.objectMapper = new ObjectMapper();
    }

    public CloudScannerReport runCloudScanner(String projectId, String wizAuthToken) throws Exception {
        List<JsonNode> allNodes = fetchAllVulnerabilityFindings(projectId, wizAuthToken);

        CloudScannerReport report = new CloudScannerReport();

        CloudScannerReport.VulnerabilityData vulnerabilityData = new CloudScannerReport.VulnerabilityData();

        CloudScannerReport.VulnerabilityFindings findings = new CloudScannerReport.VulnerabilityFindings();
        List<CloudScannerReport.Node> nodeList = new ArrayList<>();
        ObjectMapper mapper = new ObjectMapper();

        for (JsonNode jsonNode : allNodes) {
            CloudScannerReport.Node node = mapper.treeToValue(jsonNode, CloudScannerReport.Node.class);
            nodeList.add(node);
        }
        findings.setNodes(nodeList);

        vulnerabilityData.setVulnerabilityFindings(findings);
        report.setData(vulnerabilityData);

        return report;
    }


    private List<JsonNode> fetchAllVulnerabilityFindings(String projectId, String wizAuthToken) throws Exception {
        List<JsonNode> allNodes = new ArrayList<>();
        String endCursor = null;
        boolean hasNextPage = true;

        while (hasNextPage) {
            String query = "query VulnerabilityFindings($project_name: [String!], $after: String) { " +
                    "vulnerabilityFindings(first: 200, after: $after, filterBy: {status: [OPEN, IN_PROGRESS], assetType: VIRTUAL_MACHINE, severity: [HIGH, CRITICAL], hasExploit: true, hasFix: true, detectionMethod: [PACKAGE, OS], projectId: $project_name}) { " +
                    "nodes { name severity vulnerableAsset { ... on VulnerableAssetBase { subscriptionExternalId name } } detailedName CVEDescription version fixedVersion remediation epssProbability epssPercentile hasExploit } " +
                    "pageInfo { endCursor hasNextPage } } }";

            String variables = "{\"project_name\":\"" + projectId + "\", \"after\": " + (endCursor != null ? "\"" + endCursor + "\"" : "null") + "}";
            String requestBody = "{\"query\": \"" + query + "\", \"variables\": " + variables + "}";

            String response = webClient.post()
                    .uri("https://api.eu13.app.wiz.io/graphql")
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + wizAuthToken)
                    .body(BodyInserters.fromValue(requestBody))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode jsonNode = objectMapper.readTree(response);
            JsonNode nodes = jsonNode.path("data").path("vulnerabilityFindings").path("nodes");
            JsonNode pageInfo = jsonNode.path("data").path("vulnerabilityFindings").path("pageInfo");

            if (nodes.isArray()) {
                for (JsonNode node : nodes) {
                    allNodes.add(node);
                }
            }

            hasNextPage = pageInfo.path("hasNextPage").asBoolean(false);
            endCursor = pageInfo.path("endCursor").asText(null);
        }

        return allNodes;
    }
}
