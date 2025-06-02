package io.mixeway.mixewayflowapi.integrations.scanner.gitlab_scanner;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.domain.finding.CreateFindingService;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.File;
import java.io.IOException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
@Log4j2
public class GitLabRules {
    private final WebClient webClient;
    private final CreateFindingService createFindingService;

    public GitLabRules(WebClient webClient, CreateFindingService createFindingService) {
        this.webClient = webClient;
        this.createFindingService = createFindingService;
    }

    public String getRepositoryName(CodeRepo codeRepo) {
        String url = codeRepo.getRepourl();
        try {
            String path = new java.net.URI(url).getPath();
            if (path.startsWith("/")) {
                path = path.substring(1);
            }
            if (path.endsWith("/")) {
                path = path.substring(0, path.length() - 1);
            }
            return path;
         } catch (Exception e) {
            log.info("[GitLabScannerService] Couldn't fetch path for repository: {}", codeRepo.getRepourl());
            return null;
        }
    }

    public String getGitLabDomain(CodeRepo codeRepo) {
        String url = codeRepo.getRepourl();
        try {
            return new java.net.URI(url).getHost();
        } catch (Exception e) {
            log.info("[GitLabScannerService] Couldn't fetch domain for repository: {}", codeRepo.getRepourl());
            return null;
        }
    }

    public JsonNode findRule(String ruleName) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rulesArray = objectMapper.readTree(new File("rules.json"));
        for (JsonNode rule : rulesArray) {
            String name = rule.path("name").asText();
            if (name.equals(ruleName)) {
                return rule;
            }
        }
        return null;
    }

    public void checkDefaultBranchProtection(CodeRepo codeRepo) {
        String token = codeRepo.getAccessToken();
        String encodedRepositoryName = getRepositoryName(codeRepo);
        String domain = getGitLabDomain(codeRepo);

        String uri = "https://" + domain + "/api/v4/projects/" + encodedRepositoryName + "/repository/branches?private_token=" + token;
        try {
            String response = webClient.get()
                    .uri(uri)
                    .header("Content-Type", "application/json")
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode branches = objectMapper.readTree(response);

            for (JsonNode branch : branches) {
                boolean isProtected = branch.get("protected").asBoolean();
                boolean isDefault = branch.get("default").asBoolean();

                if (!isProtected && isDefault) {
                    JsonNode rule = findRule("Default branch is not protected");
                    Finding finding = createFindingService.mapGitLabScannerReportToFindings(codeRepo, codeRepo.getDefaultBranch(), rule.get("name").asText(), rule.get("severity").asText(), rule.get("location").asText(), rule.get("description").asText(), rule.get("recommendation").asText());
                    log.info("[GitLabScanner] Detected configuration \"{}\" in repository {}", rule.get("name").asText(), codeRepo.getRepourl());
                    createFindingService.saveFindings(List.of(finding), codeRepo.getDefaultBranch(), codeRepo, Finding.Source.GITLAB_SCANNER);
                }
            }
        }  catch (Exception e) {
        log.error("[GitLabScannerService] Unexpected error for repository {}: {}", codeRepo.getRepourl(), e.getMessage(), e);
        }
    }
}
