package io.mixeway.mixewayflowapi.integrations.scanner.gitlab_scanner;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.domain.finding.CreateFindingService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.*;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
@Log4j2
public class GitLabRules {
    private final WebClient webClient;
    private final CreateFindingService createFindingService;

    @Autowired
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
            log.info(path);
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
        File file = new File("backend/src/main/java/io/mixeway/mixewayflowapi/integrations/scanner/gitlab_scanner/rules.json");
        JsonNode rulesArray = objectMapper.readTree(file);
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
        String repo = getRepositoryName(codeRepo);
        String domain = getGitLabDomain(codeRepo);

        try {
            String projectPath = URLEncoder.encode(repo.toString(), StandardCharsets.UTF_8.toString());
            URI uri = new URI("https://" + domain + "/api/v4/projects/" + projectPath + "/repository/branches");

            String response = webClient.get()
                    .uri(uri)
                    .header("PRIVATE-TOKEN", token)
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
