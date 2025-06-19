package io.mixeway.mixewayflowapi.integrations.scanner.gitlab_scanner.rules;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.entity.RepositoryAllowlist;
import io.mixeway.mixewayflowapi.domain.finding.CreateFindingService;
import io.mixeway.mixewayflowapi.domain.finding.UpdateFindingService;
import io.mixeway.mixewayflowapi.domain.repositoryallowlist.FindRepositoryAllowlistService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.io.*;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Map;
import java.util.stream.StreamSupport;

@Component
@Log4j2
public class GitLabRules {
    private final WebClient webClient;
    private final CreateFindingService createFindingService;
    private final UpdateFindingService updateFindingService;
    private final FindRepositoryAllowlistService findRepositoryAllowlistService;

    @Autowired
    public GitLabRules(WebClient webClient, CreateFindingService createFindingService, UpdateFindingService updateFindingService, FindRepositoryAllowlistService findRepositoryAllowlistService) {
        this.webClient = webClient;
        this.createFindingService = createFindingService;
        this.updateFindingService = updateFindingService;
        this.findRepositoryAllowlistService = findRepositoryAllowlistService;
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
        InputStream inputStream = getClass().getClassLoader().getResourceAsStream("gitlab_rules/rules.json");
        if (inputStream == null) {
            throw new FileNotFoundException("Rules file not found in classpath");
        }
        JsonNode rulesArray = objectMapper.readTree(inputStream);
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
            String response;
            try {
                response = webClient.get()
                        .uri(uri)
                        .header("PRIVATE-TOKEN", token)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();
            } catch (WebClientResponseException e) {
                if (e.getStatusCode().value() == 403) {
                    log.warn("[GitLabScannerService] API request failed for repository {}: HTTP Status 403 Forbidden - Access denied for rule 'Default branch is not protected'", codeRepo.getRepourl());
                } else {
                    log.error("[GitLabScannerService] API request failed for repository {}: HTTP Status {} - {} for rule 'Default branch is not protected'",
                            codeRepo.getRepourl(), e.getRawStatusCode(), e.getResponseBodyAsString());
                }
                return;
            } catch (Exception e) {
                log.error("[GitLabScannerService] Unexpected error during API request for repository {}: {} for rule 'Default branch is not protected'",
                        codeRepo.getRepourl(), e.getMessage(), e);
                return;
            }
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode branches = objectMapper.readTree(response);

            for (JsonNode branch : branches) {
                boolean isProtected = branch.get("protected").asBoolean();
                boolean isDefault = branch.get("default").asBoolean();
                JsonNode rule = findRule("Default branch is not protected");
                if (!isProtected && isDefault) {
                    Finding finding = createFindingService.mapGitLabScannerReportToFindings(codeRepo, codeRepo.getDefaultBranch(), rule.get("name").asText(), rule.get("severity").asText(), null, rule.get("location").asText(), rule.get("description").asText(), rule.get("recommendation").asText());
                    log.info("[GitLabScanner] Detected configuration \"{}\" in repository {}", rule.get("name").asText(), codeRepo.getRepourl());
                    createFindingService.saveFinding(finding, codeRepo.getDefaultBranch(), codeRepo, Finding.Source.GITLAB_SCANNER);
                } else {
                    updateFindingService.verifyGitLabFinding(rule.get("name").asText(), codeRepo, codeRepo.getDefaultBranch(), rule.get("location").asText());
                }
            }
        } catch (Exception e) {
            log.error("[GitLabScannerService] Unexpected error for repository {}: {}", codeRepo.getRepourl(), e.getMessage(), e);
        }
    }

    public void checkMembersPrivileges(CodeRepo codeRepo) {
        String token = codeRepo.getAccessToken();
        String repo = getRepositoryName(codeRepo);
        String domain = getGitLabDomain(codeRepo);

        try {
            String projectPath = URLEncoder.encode(repo.toString(), StandardCharsets.UTF_8.toString());
            URI uri = new URI("https://" + domain + "/api/v4/projects/" + projectPath + "/members/all");
            String response;
            try {
                response = webClient.get()
                        .uri(uri)
                        .header("PRIVATE-TOKEN", token)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();
            } catch (WebClientResponseException e) {
                if (e.getStatusCode().value() == 403) {
                    log.warn("[GitLabScannerService] API request failed for repository {}: HTTP Status 403 Forbidden - Access denied for rule 'Too many members with high privileges'", codeRepo.getRepourl());
                } else {
                    log.error("[GitLabScannerService] API request failed for repository {}: HTTP Status {} - {} for rule 'Too many members with high privileges'",
                            codeRepo.getRepourl(), e.getRawStatusCode(), e.getResponseBodyAsString());
                }
                return;
            } catch (Exception e) {
                log.error("[GitLabScannerService] Unexpected error during API request for repository {}: {} for rule 'Too many members with high privileges'",
                        codeRepo.getRepourl(), e.getMessage(), e);
                return;
            }

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode members = objectMapper.readTree(response);
            int memberCount = members.size();

            if (memberCount > 1) {
                int privilegedMembers = 0;
                for (JsonNode member : members) {
                    int role = member.get("access_level").asInt();
                    if (role == 40 || role == 50 || role == 60) {
                        privilegedMembers += 1;
                    }
                }
                JsonNode rule = findRule("Too many members with high privileges");
                if ((float) privilegedMembers / memberCount > 0.8) {
                    Finding finding = createFindingService.mapGitLabScannerReportToFindings(codeRepo, codeRepo.getDefaultBranch(), rule.get("name").asText(), rule.get("severity").asText(), null, rule.get("location").asText(), rule.get("description").asText(), rule.get("recommendation").asText());
                    log.info("[GitLabScanner] Detected configuration \"{}\" in repository {}", rule.get("name").asText(), codeRepo.getRepourl());
                    createFindingService.saveFinding(finding, codeRepo.getDefaultBranch(), codeRepo, Finding.Source.GITLAB_SCANNER);
                } else {
                    updateFindingService.verifyGitLabFinding(rule.get("name").asText(), codeRepo, codeRepo.getDefaultBranch(), rule.get("location").asText());
                }
            }
        } catch (Exception e) {
            log.error("[v] Unexpected error for repository {}: {}", codeRepo.getRepourl(), e.getMessage(), e);
        }
    }

    public void checkRunnersTags(CodeRepo codeRepo) {
        String token = codeRepo.getAccessToken();
        String repo = getRepositoryName(codeRepo);
        String domain = getGitLabDomain(codeRepo);

        try {
            String projectPath = URLEncoder.encode(repo.toString(), StandardCharsets.UTF_8.toString());
            URI uri = new URI("https://" + domain + "/api/v4/projects/" + projectPath + "/runners");

            String response;
            try {
                response = webClient.get()
                        .uri(uri)
                        .header("PRIVATE-TOKEN", token)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();
            } catch (WebClientResponseException e) {
                if (e.getStatusCode().value() == 403) {
                    log.warn("[GitLabScannerService] API request failed for repository {}: HTTP Status 403 Forbidden - Access denied for rule 'Untagged runner'", codeRepo.getRepourl());
                } else {
                    log.error("[GitLabScannerService] API request failed for repository {}: HTTP Status {} - {} for rule 'Untagged runner'",
                            codeRepo.getRepourl(), e.getRawStatusCode(), e.getResponseBodyAsString());
                }
                return;
            } catch (Exception e) {
                log.error("[GitLabScannerService] Unexpected error during API request for repository {}: {} for rule 'Untagged runner'",
                        codeRepo.getRepourl(), e.getMessage(), e);
                return;
            }

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode runners = objectMapper.readTree(response);

            for (JsonNode runner : runners) {
                int runnerId = runner.get("id").asInt();

                URI runnerUri = new URI("https://" + domain + "/api/v4/runners/" + runnerId);

                String runnerResponse;
                try {
                    runnerResponse = webClient.get()
                            .uri(runnerUri)
                            .header("PRIVATE-TOKEN", token)
                            .retrieve()
                            .bodyToMono(String.class)
                            .block();
                } catch (WebClientResponseException e) {
                    if (e.getStatusCode().value() == 403) {
                        log.warn("[GitLabScannerService] API request failed for repository {}: HTTP Status 403 Forbidden - Access denied for rule 'Untagged runner'", codeRepo.getRepourl());
                    } else {
                        log.error("[GitLabScannerService] API request failed for repository {}: HTTP Status {} - {} for rule 'Untagged runner'",
                                codeRepo.getRepourl(), e.getRawStatusCode(), e.getResponseBodyAsString());
                    }
                    return;
                } catch (Exception e) {
                    log.error("[GitLabScannerService] Unexpected error during API request for repository {}: {} for rule 'Untagged runner'",
                            codeRepo.getRepourl(), e.getMessage(), e);
                    return;
                }

                ObjectMapper runnerObjectMapper = new ObjectMapper();
                JsonNode runnerDetails = runnerObjectMapper.readTree(runnerResponse);
                JsonNode rule = findRule("Untagged runner");
                if (runnerDetails.get("tag_list").isArray() && runnerDetails.get("tag_list").size() == 0) {
                    Finding finding = createFindingService.mapGitLabScannerReportToFindings(codeRepo, codeRepo.getDefaultBranch(), rule.get("name").asText(), rule.get("severity").asText(), "Incorrect configuration of " + rule.get("location").asText(), rule.get("location").asText() + " (" + runnerDetails.get("id").asInt() + ")", rule.get("description").asText(), rule.get("recommendation").asText());
                    log.info("[GitLabScanner] Detected configuration \"{}\" in repository {} for runner: {}", rule.get("name").asText(), codeRepo.getRepourl(), runnerDetails.get("description").asText());
                    createFindingService.saveFinding(finding, codeRepo.getDefaultBranch(), codeRepo, Finding.Source.GITLAB_SCANNER);
                } else {
                    updateFindingService.verifyGitLabFinding(rule.get("name").asText(), codeRepo, codeRepo.getDefaultBranch(), rule.get("location").asText() + " (" + runnerDetails.get("id").asInt() + ")");
                }
            }
        } catch (Exception e) {
            log.error("[GitLabScanner] Unexpected error for repository {}: {}", codeRepo.getRepourl(), e.getMessage(), e);
        }
    }

    public void checkJobsTags(CodeRepo codeRepo) {
        String token = codeRepo.getAccessToken();
        String repo = getRepositoryName(codeRepo);
        String domain = getGitLabDomain(codeRepo);

        try {
            String projectPath = URLEncoder.encode(repo.toString(), StandardCharsets.UTF_8.toString());
            URI uri = new URI("https://" + domain + "/api/v4/projects/" + projectPath + "/runners");

            String response;
            try {
                response = webClient.get()
                        .uri(uri)
                        .header("PRIVATE-TOKEN", token)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();
            } catch (WebClientResponseException e) {
                if (e.getStatusCode().value() == 403) {
                    log.warn("[GitLabScanner] API request failed for repository {}: HTTP Status 403 Forbidden - Access denied for rule 'Runner allows untagged jobs'", codeRepo.getRepourl());
                } else {
                    log.error("[GitLabScanner] API request failed for repository {}: HTTP Status {} - {} for rule 'Runner allows untagged jobs'",
                            codeRepo.getRepourl(), e.getRawStatusCode(), e.getResponseBodyAsString());
                }
                return;
            } catch (Exception e) {
                log.error("[GitLabScanner] Unexpected error during API request for repository {}: {} for rule 'Runner allows untagged jobs'",
                        codeRepo.getRepourl(), e.getMessage(), e);
                return;
            }

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode runners = objectMapper.readTree(response);

            for (JsonNode runner : runners) {
                int runnerId = runner.get("id").asInt();

                URI runnerUri = new URI("https://" + domain + "/api/v4/runners/" + runnerId);

                String runnerResponse;
                try {
                    runnerResponse = webClient.get()
                            .uri(runnerUri)
                            .header("PRIVATE-TOKEN", token)
                            .retrieve()
                            .bodyToMono(String.class)
                            .block();
                } catch (WebClientResponseException e) {
                    if (e.getStatusCode().value() == 403) {
                        log.warn("[GitLabScanner] API request failed for repository {}: HTTP Status 403 Forbidden - Access denied for rule 'Runner allows untagged jobs'", codeRepo.getRepourl());
                    } else {
                        log.error("[GitLabScanner] API request failed for repository {}: HTTP Status {} - {} for rule 'Runner allows untagged jobs'",
                                codeRepo.getRepourl(), e.getRawStatusCode(), e.getResponseBodyAsString());
                    }
                    return;
                } catch (Exception e) {
                    log.error("[GitLabScanner] Unexpected error during API request for repository {}: {} for rule 'Runner allows untagged jobs'",
                            codeRepo.getRepourl(), e.getMessage(), e);
                    return;
                }

                ObjectMapper runnerObjectMapper = new ObjectMapper();
                JsonNode runnerDetails = runnerObjectMapper.readTree(runnerResponse);
                JsonNode rule = findRule("Runner allows untagged jobs");
                if (runnerDetails.get("run_untagged").asBoolean()) {
                    Finding finding = createFindingService.mapGitLabScannerReportToFindings(codeRepo, codeRepo.getDefaultBranch(), rule.get("name").asText(), rule.get("severity").asText(), "Incorrect configuration of " + rule.get("location").asText(), rule.get("location").asText() + " (" + runnerDetails.get("id").asInt() + ")", rule.get("description").asText(), rule.get("recommendation").asText());
                    log.info("[GitLabScanner] Detected configuration \"{}\" in repository {} for runner: {}", rule.get("name").asText(), codeRepo.getRepourl(), runnerDetails.get("description").asText());
                    createFindingService.saveFinding(finding, codeRepo.getDefaultBranch(), codeRepo, Finding.Source.GITLAB_SCANNER);
                } else {
                    updateFindingService.verifyGitLabFinding(rule.get("name").asText(), codeRepo, codeRepo.getDefaultBranch(), rule.get("location").asText() + " (" + runnerDetails.get("id").asInt() + ")");
                }
            }
        } catch (Exception e) {
            log.error("[GitLabScanner] Unexpected error for repository {}: {}", codeRepo.getRepourl(), e.getMessage(), e);
        }
    }

    public void checkJobsProtection(CodeRepo codeRepo) {
        String token = codeRepo.getAccessToken();
        String repo = getRepositoryName(codeRepo);
        String domain = getGitLabDomain(codeRepo);

        try {
            String projectPath = URLEncoder.encode(repo.toString(), StandardCharsets.UTF_8.toString());
            URI uri = new URI("https://" + domain + "/api/v4/projects/" + projectPath + "/runners");

            String response;
            try {
                response = webClient.get()
                        .uri(uri)
                        .header("PRIVATE-TOKEN", token)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();
            } catch (WebClientResponseException e) {
                if (e.getStatusCode().value() == 403) {
                    log.warn("[GitLabScanner] API request failed for repository {}: HTTP Status 403 Forbidden - Access denied for rule 'Runner allows unprotected jobs'", codeRepo.getRepourl());
                } else {
                    log.error("[GitLabScanner] API request failed for repository {}: HTTP Status {} - {} for rule 'Runner allows unprotected jobs'",
                            codeRepo.getRepourl(), e.getRawStatusCode(), e.getResponseBodyAsString());
                }
                return;
            } catch (Exception e) {
                log.error("[GitLabScanner] Unexpected error during API request for repository {}: {} for rule 'Runner allows unprotected jobs'",
                        codeRepo.getRepourl(), e.getMessage(), e);
                return;
            }

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode runners = objectMapper.readTree(response);

            for (JsonNode runner : runners) {
                int runnerId = runner.get("id").asInt();

                URI runnerUri = new URI("https://" + domain + "/api/v4/runners/" + runnerId);

                String runnerResponse;
                try {
                    runnerResponse = webClient.get()
                            .uri(runnerUri)
                            .header("PRIVATE-TOKEN", token)
                            .retrieve()
                            .bodyToMono(String.class)
                            .block();
                } catch (WebClientResponseException e) {
                    if (e.getStatusCode().value() == 403) {
                        log.warn("[GitLabScanner] API request failed for repository {}: HTTP Status 403 Forbidden - Access denied for rule 'Runner allows unprotected jobs'", codeRepo.getRepourl());
                    } else {
                        log.error("[GitLabScanner] API request failed for repository {}: HTTP Status {} - {} for rule 'Runner allows unprotected jobs'",
                                codeRepo.getRepourl(), e.getRawStatusCode(), e.getResponseBodyAsString());
                    }
                    return;
                } catch (Exception e) {
                    log.error("[GitLabScanner] Unexpected error during API request for repository {}: {} for rule 'Runner allows unprotected jobs'",
                            codeRepo.getRepourl(), e.getMessage(), e);
                    return;
                }

                ObjectMapper runnerObjectMapper = new ObjectMapper();
                JsonNode runnerDetails = runnerObjectMapper.readTree(runnerResponse);
                JsonNode rule = findRule("Runner allows unprotected jobs");
                if (!runnerDetails.get("access_level").asText().equals("ref_protected")) {
                    Finding finding = createFindingService.mapGitLabScannerReportToFindings(codeRepo, codeRepo.getDefaultBranch(), rule.get("name").asText(), rule.get("severity").asText(), "Incorrect configuration of " + rule.get("location").asText(), rule.get("location").asText() + " (" + runnerDetails.get("id").asInt() + ")", rule.get("description").asText(), rule.get("recommendation").asText());
                    log.info("[GitLabScanner] Detected configuration \"{}\" in repository {} for runner: {}", rule.get("name").asText(), codeRepo.getRepourl(), runnerDetails.get("description").asText());
                    createFindingService.saveFinding(finding, codeRepo.getDefaultBranch(), codeRepo, Finding.Source.GITLAB_SCANNER);
                } else {
                    updateFindingService.verifyGitLabFinding(rule.get("name").asText(), codeRepo, codeRepo.getDefaultBranch(), rule.get("location").asText() + " (" + runnerDetails.get("id").asInt() + ")");
                }
            }
        } catch (Exception e) {
            log.error("[GitLabScanner] Unexpected error for repository {}: {}", codeRepo.getRepourl(), e.getMessage(), e);
        }
    }

    public void checkRunnersExecutors(CodeRepo codeRepo) {
        String token = codeRepo.getAccessToken();
        String repo = getRepositoryName(codeRepo);
        String domain = getGitLabDomain(codeRepo);

        try {
            String query = """
                        query {
                          project(fullPath: "%s") {
                            runners {
                              nodes {
                                managers {
                                  nodes {
                                    id
                                    status
                                    platformName
                                    executorName
                                    systemId
                                  }
                                }
                              }
                            }
                          }
                        }
                    """.formatted(repo);

            Map<String, String> requestBody = Map.of("query", query);

            String response;
            try {
                response = webClient.post()
                        .uri("https://" + domain + "/api/graphql")
                        .header("PRIVATE-TOKEN", token)
                        .bodyValue(requestBody)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();
            } catch (WebClientResponseException e) {
                if (e.getStatusCode().value() == 403) {
                    log.warn("[GitLabScanner] API request failed for repository {}: HTTP Status 403 Forbidden - Access denied for rule 'Runner uses insecure executor type'", codeRepo.getRepourl());
                } else {
                    log.error("[GitLabScanner] API request failed for repository {}: HTTP Status {} - {} for rule 'Runner uses insecure executor type'",
                            codeRepo.getRepourl(), e.getRawStatusCode(), e.getResponseBodyAsString());
                }
                return;
            } catch (Exception e) {
                log.error("[GitLabScanner] Unexpected error during API request for repository {}: {} for rule 'Runner uses insecure executor type'",
                        codeRepo.getRepourl(), e.getMessage(), e);
                return;
            }

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode root = objectMapper.readTree(response);

            JsonNode project = root.path("data").path("project");
            JsonNode runners = project.path("runners").path("nodes");

            if (runners.isArray()) {
                for (JsonNode runnerNode : runners) {
                    JsonNode managers = runnerNode.path("managers").path("nodes");
                    if (managers.isArray()) {
                        for (JsonNode manager : managers) {
                            String executorName = manager.path("executorName").asText();
                            String runnerId = manager.path("id").asText();

                            JsonNode rule = findRule("Runner uses insecure executor type");
                            if (!executorName.equals("docker") && !executorName.equals("kubernetes")) {
                                Finding finding = createFindingService.mapGitLabScannerReportToFindings(codeRepo, codeRepo.getDefaultBranch(), rule.get("name").asText(), rule.get("severity").asText(), "Incorrect configuration of " + rule.get("location").asText(), rule.get("location").asText() + " (" + runnerId + ")", rule.get("description").asText(), rule.get("recommendation").asText());
                                log.info("[GitLabScanner] Detected configuration \"{}\" in repository {} for runner: {}", rule.get("name").asText(), codeRepo.getRepourl(), runnerId);
                                createFindingService.saveFinding(finding, codeRepo.getDefaultBranch(), codeRepo, Finding.Source.GITLAB_SCANNER);
                            } else {
                                updateFindingService.verifyGitLabFinding(rule.get("name").asText(), codeRepo, codeRepo.getDefaultBranch(), rule.get("location").asText() + " (" + runnerId + ")"
                                );
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("[GitLabScanner] Unexpected error for repository {}: {}", codeRepo.getRepourl(), e.getMessage(), e);
        }
    }

    public void checkAccessTokensScope(CodeRepo codeRepo) {
        String token = codeRepo.getAccessToken();
        String repo = getRepositoryName(codeRepo);
        String domain = getGitLabDomain(codeRepo);

        try {
            String projectPath = URLEncoder.encode(repo.toString(), StandardCharsets.UTF_8.toString());
            URI uri = new URI("https://" + domain + "/api/v4/projects/" + projectPath + "/access_tokens");

            String response;
            try {
                response = webClient.get()
                        .uri(uri)
                        .header("PRIVATE-TOKEN", token)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();
            } catch (WebClientResponseException e) {
                if (e.getStatusCode().value() == 403) {
                    log.warn("[GitLabScanner] API request failed for repository {}: HTTP Status 403 Forbidden - Access denied for rule 'Access token with api scope'", codeRepo.getRepourl());
                } else {
                    log.error("[GitLabScanner] API request failed for repository {}: HTTP Status {} - {} for rule 'Access token with api scope'",
                            codeRepo.getRepourl(), e.getRawStatusCode(), e.getResponseBodyAsString());
                }
                return;
            } catch (Exception e) {
                log.error("[GitLabScanner] Unexpected error during API request for repository {}: {} for rule 'Access token with api scope'",
                        codeRepo.getRepourl(), e.getMessage(), e);
                return;
            }

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode tokens = objectMapper.readTree(response);

            for (JsonNode tokenInfo : tokens) {
                if (tokenInfo.has("scopes") && tokenInfo.get("scopes").isArray()) {
                    boolean hasApiScope = StreamSupport.stream(tokenInfo.get("scopes").spliterator(), false).anyMatch(scope -> "api".equals(scope.asText()));
                    JsonNode rule = findRule("Access token with api scope");
                    if (hasApiScope) {
                        Finding finding = createFindingService.mapGitLabScannerReportToFindings(codeRepo, codeRepo.getDefaultBranch(), rule.get("name").asText(), rule.get("severity").asText(), null, rule.get("location").asText() + " (" + tokenInfo.get("name").asText() + ")", rule.get("description").asText(), rule.get("recommendation").asText());
                        log.info("[GitLabScanner] Detected configuration \"{}\" in repository {}", rule.get("name").asText(), codeRepo.getRepourl());
                        createFindingService.saveFinding(finding, codeRepo.getDefaultBranch(), codeRepo, Finding.Source.GITLAB_SCANNER);
                    } else {
                        updateFindingService.verifyGitLabFinding(rule.get("name").asText(), codeRepo, codeRepo.getDefaultBranch(), rule.get("location").asText() + " (" + tokenInfo.get("name").asText() + ")");
                    }
                }
            }
        } catch (Exception e) {
            log.error("[GitLabScanner] Unexpected error for repository {}: {}", codeRepo.getRepourl(), e.getMessage(), e);
        }
    }

    public void checkDescription(CodeRepo codeRepo) {
        String token = codeRepo.getAccessToken();
        String repo = getRepositoryName(codeRepo);
        String domain = getGitLabDomain(codeRepo);

        try {
            String projectPath = URLEncoder.encode(repo.toString(), StandardCharsets.UTF_8.toString());
            URI uri = new URI("https://" + domain + "/api/v4/projects/" + projectPath);

            String response;
            try {
                response = webClient.get()
                        .uri(uri)
                        .header("PRIVATE-TOKEN", token)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();
            } catch (WebClientResponseException e) {
                if (e.getStatusCode().value() == 403) {
                    log.warn("[GitLabScanner] API request failed for repository {}: HTTP Status 403 Forbidden - Access denied for rule 'Lack of repository description'", codeRepo.getRepourl());
                } else {
                    log.error("[GitLabScanner] API request failed for repository {}: HTTP Status {} - {} for rule 'Lack of repository description'",
                            codeRepo.getRepourl(), e.getRawStatusCode(), e.getResponseBodyAsString());
                }
                return;
            } catch (Exception e) {
                log.error("[GitLabScanner] Unexpected error during API request for repository {}: {} for rule 'Lack of repository description'",
                        codeRepo.getRepourl(), e.getMessage(), e);
                return;
            }

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode description = objectMapper.readTree(response);

            JsonNode rule = findRule("Lack of repository description");
            if (description.get("description").asText().equals("")) {
                Finding finding = createFindingService.mapGitLabScannerReportToFindings(codeRepo, codeRepo.getDefaultBranch(), rule.get("name").asText(), rule.get("severity").asText(), null, rule.get("location").asText(), rule.get("description").asText(), rule.get("recommendation").asText());
                log.info("[GitLabScanner] Detected configuration \"{}\" in repository {}", rule.get("name").asText(), codeRepo.getRepourl());
                createFindingService.saveFinding(finding, codeRepo.getDefaultBranch(), codeRepo, Finding.Source.GITLAB_SCANNER);
            } else {
                updateFindingService.verifyGitLabFinding(rule.get("name").asText(), codeRepo, codeRepo.getDefaultBranch(), rule.get("location").asText());
            }
        } catch (Exception e) {
            log.error("[GitLabScanner] Unexpected error for repository {}: {}", codeRepo.getRepourl(), e.getMessage(), e);
        }
    }

    public void checkReadmeFile(CodeRepo codeRepo) {
        String token = codeRepo.getAccessToken();
        String repo = getRepositoryName(codeRepo);
        String domain = getGitLabDomain(codeRepo);

        try {
            String projectPath = URLEncoder.encode(repo.toString(), StandardCharsets.UTF_8.toString());
            URI uri = new URI("https://" + domain + "/api/v4/projects/" + projectPath + "/repository/tree");

            String response;
            try {
                response = webClient.get()
                        .uri(uri)
                        .header("PRIVATE-TOKEN", token)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();
            } catch (WebClientResponseException e) {
                if (e.getStatusCode().value() == 403) {
                    log.warn("[GitLabScanner] API request failed for repository {}: HTTP Status 403 Forbidden - Access denied for rule 'Lack of README file'", codeRepo.getRepourl());
                } else {
                    log.error("[GitLabScanner] API request failed for repository {}: HTTP Status {} - {} for rule 'Lack of README file'",
                            codeRepo.getRepourl(), e.getRawStatusCode(), e.getResponseBodyAsString());
                }
                return;
            } catch (Exception e) {
                log.error("[GitLabScanner] Unexpected error during API request for repository {}: {} for rule 'Lack of README file'",
                        codeRepo.getRepourl(), e.getMessage(), e);
                return;
            }

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode files = objectMapper.readTree(response);

            JsonNode rule = findRule("Lack of README file");

            boolean readmeExists = false;
            boolean reamdeIsEmpty = false;
            String ReadmePath = "";

            for (JsonNode file : files) {
                String path = file.get("path").asText();
                if (path.toLowerCase().contains("readme.md")) {
                    readmeExists = true;
                    ReadmePath = path;
                    break;
                }
            }

            if (readmeExists) {
                URI readmeUri = new URI("https://" + domain + "/api/v4/projects/" + projectPath + "/repository/files/" + URLEncoder.encode(ReadmePath, StandardCharsets.UTF_8.toString()) + "/raw");

                String readmeContent;
                try {
                    readmeContent = webClient.get()
                            .uri(readmeUri)
                            .header("PRIVATE-TOKEN", token)
                            .retrieve()
                            .bodyToMono(String.class)
                            .block();
                } catch (WebClientResponseException e) {
                    if (e.getStatusCode().value() == 403) {
                        log.warn("[GitLabScanner] API request failed for repository {}: HTTP Status 403 Forbidden - Access denied for rule 'Lack of README file'", codeRepo.getRepourl());
                    } else {
                        log.error("[GitLabScanner] API request failed for repository {}: HTTP Status {} - {} for rule 'Lack of README file'",
                                codeRepo.getRepourl(), e.getRawStatusCode(), e.getResponseBodyAsString());
                    }
                    return;
                } catch (Exception e) {
                    log.error("[GitLabScanner] Unexpected error during API request for repository {}: {} for rule 'Lack of README file'",
                            codeRepo.getRepourl(), e.getMessage(), e);
                    return;
                }
                if (readmeContent == null || readmeContent.trim().isEmpty()) {
                    reamdeIsEmpty = true;
                }
            }

            if (!readmeExists || reamdeIsEmpty) {
                Finding finding = createFindingService.mapGitLabScannerReportToFindings(codeRepo, codeRepo.getDefaultBranch(), rule.get("name").asText(), rule.get("severity").asText(), null, rule.get("location").asText(), rule.get("description").asText(), rule.get("recommendation").asText());
                log.info("[GitLabScanner] Detected configuration \"{}\" in repository {}", rule.get("name").asText(), codeRepo.getRepourl());
                createFindingService.saveFinding(finding, codeRepo.getDefaultBranch(), codeRepo, Finding.Source.GITLAB_SCANNER);
            } else {
                updateFindingService.verifyGitLabFinding(rule.get("name").asText(), codeRepo, codeRepo.getDefaultBranch(), rule.get("location").asText());
            }
        } catch (Exception e) {
            log.error("[GitLabScanner] Unexpected error for repository {}: {}", codeRepo.getRepourl(), e.getMessage(), e);
        }
    }

    public void checkContributingFile(CodeRepo codeRepo) {
        String token = codeRepo.getAccessToken();
        String repo = getRepositoryName(codeRepo);
        String domain = getGitLabDomain(codeRepo);

        try {
            String projectPath = URLEncoder.encode(repo.toString(), StandardCharsets.UTF_8.toString());
            URI uri = new URI("https://" + domain + "/api/v4/projects/" + projectPath + "/repository/tree");

            String response;
            try {
                response = webClient.get()
                        .uri(uri)
                        .header("PRIVATE-TOKEN", token)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();
            } catch (WebClientResponseException e) {
                if (e.getStatusCode().value() == 403) {
                    log.warn("[GitLabScanner] API request failed for repository {}: HTTP Status 403 Forbidden - Access denied for rule 'Lack of CONTRIBUTING file'", codeRepo.getRepourl());
                } else {
                    log.error("[GitLabScanner] API request failed for repository {}: HTTP Status {} - {} for rule 'Lack of CONTRIBUTING file'",
                            codeRepo.getRepourl(), e.getRawStatusCode(), e.getResponseBodyAsString());
                }
                return;
            } catch (Exception e) {
                log.error("[GitLabScanner] Unexpected error during API request for repository {}: {} for rule 'Lack of CONTRIBUTING file'",
                        codeRepo.getRepourl(), e.getMessage(), e);
                return;
            }

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode files = objectMapper.readTree(response);

            JsonNode rule = findRule("Lack of CONTRIBUTING file");

            boolean contributingExists = false;
            boolean contributingIsEmpty = false;
            String contributingPath = "";

            for (JsonNode file : files) {
                String path = file.get("path").asText();
                if (path.toLowerCase().contains("contributing.md")) {
                    contributingExists = true;
                    contributingPath = path;
                    break;
                }
            }

            if (contributingExists) {
                URI contributingUri = new URI("https://" + domain + "/api/v4/projects/" + projectPath + "/repository/files/" + URLEncoder.encode(contributingPath, StandardCharsets.UTF_8.toString()) + "/raw");
                String contributingContent;
                try {
                    contributingContent = webClient.get()
                            .uri(contributingUri)
                            .header("PRIVATE-TOKEN", token)
                            .retrieve()
                            .bodyToMono(String.class)
                            .block();
                } catch (WebClientResponseException e) {
                    if (e.getStatusCode().value() == 403) {
                        log.warn("[GitLabScanner] API request failed for repository {}: HTTP Status 403 Forbidden - Access denied for rule 'Lack of CONTRIBUTING file'", codeRepo.getRepourl());
                    } else {
                        log.error("[GitLabScanner] API request failed for repository {}: HTTP Status {} - {} for rule 'Lack of CONTRIBUTING file'",
                                codeRepo.getRepourl(), e.getRawStatusCode(), e.getResponseBodyAsString());
                    }
                    return;
                } catch (Exception e) {
                    log.error("[GitLabScanner] Unexpected error during API request for repository {}: {} for rule 'Lack of CONTRIBUTING file'",
                            codeRepo.getRepourl(), e.getMessage(), e);
                    return;
                }

                if (contributingContent == null || contributingContent.trim().isEmpty()) {
                    contributingIsEmpty = true;
                }
            }

            if (!contributingExists || contributingIsEmpty) {
                Finding finding = createFindingService.mapGitLabScannerReportToFindings(codeRepo, codeRepo.getDefaultBranch(), rule.get("name").asText(), rule.get("severity").asText(), null, rule.get("location").asText(), rule.get("description").asText(), rule.get("recommendation").asText());
                log.info("[GitLabScanner] Detected configuration \"{}\" in repository {}", rule.get("name").asText(), codeRepo.getRepourl());
                createFindingService.saveFinding(finding, codeRepo.getDefaultBranch(), codeRepo, Finding.Source.GITLAB_SCANNER);
            } else {
                updateFindingService.verifyGitLabFinding(rule.get("name").asText(), codeRepo, codeRepo.getDefaultBranch(), rule.get("location").asText());
            }
        } catch (Exception e) {
            log.error("[GitLabScanner] Unexpected error for repository {}: {}", codeRepo.getRepourl(), e.getMessage(), e);
        }
    }

    public void checkSecurityFile(CodeRepo codeRepo) {
        String token = codeRepo.getAccessToken();
        String repo = getRepositoryName(codeRepo);
        String domain = getGitLabDomain(codeRepo);

        try {
            String projectPath = URLEncoder.encode(repo.toString(), StandardCharsets.UTF_8.toString());
            URI uri = new URI("https://" + domain + "/api/v4/projects/" + projectPath + "/repository/tree");

            String response;
            try {
                response = webClient.get()
                        .uri(uri)
                        .header("PRIVATE-TOKEN", token)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();
            } catch (WebClientResponseException e) {
                if (e.getStatusCode().value() == 403) {
                    log.warn("[GitLabScanner] API request failed for repository {}: HTTP Status 403 Forbidden - Access denied for rule 'Lack of SECURITY file'", codeRepo.getRepourl());
                } else {
                    log.error("[GitLabScanner] API request failed for repository {}: HTTP Status {} - {} for rule 'Lack of SECURITY file'",
                            codeRepo.getRepourl(), e.getRawStatusCode(), e.getResponseBodyAsString());
                }
                return;
            } catch (Exception e) {
                log.error("[GitLabScanner] Unexpected error during API request for repository {}: {} for rule 'Lack of SECURITY file'",
                        codeRepo.getRepourl(), e.getMessage(), e);
                return;
            }

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode files = objectMapper.readTree(response);

            JsonNode rule = findRule("Lack of SECURITY file");

            boolean securityExists = false;
            boolean securityIsEmpty = false;
            String securityPath = "";

            for (JsonNode file : files) {
                String path = file.get("path").asText();
                if (path.toLowerCase().contains("contributing")) {
                    securityExists = true;
                    securityPath = path;
                    break;
                }
            }

            if (securityExists) {
                URI securityUri = new URI("https://" + domain + "/api/v4/projects/" + projectPath + "/repository/files/" + URLEncoder.encode(securityPath, StandardCharsets.UTF_8.toString()) + "/raw");
                String securityContent;
                try {
                    securityContent = webClient.get()
                            .uri(securityUri)
                            .header("PRIVATE-TOKEN", token)
                            .retrieve()
                            .bodyToMono(String.class)
                            .block();
                } catch (WebClientResponseException e) {
                    if (e.getStatusCode().value() == 403) {
                        log.warn("[GitLabScanner] API request failed for repository {}: HTTP Status 403 Forbidden - Access denied for rule 'Lack of SECURITY file'", codeRepo.getRepourl());
                    } else {
                        log.error("[GitLabScanner] API request failed for repository {}: HTTP Status {} - {} for rule 'Lack of SECURITY file'",
                                codeRepo.getRepourl(), e.getRawStatusCode(), e.getResponseBodyAsString());
                    }
                    return;
                } catch (Exception e) {
                    log.error("[GitLabScanner] Unexpected error during API request for repository {}: {} for rule 'Lack of SECURITY file'",
                            codeRepo.getRepourl(), e.getMessage(), e);
                    return;
                }

                if (securityContent == null || securityContent.trim().isEmpty()) {
                    securityIsEmpty = true;
                }
            }

            if (!securityExists || securityIsEmpty) {
                Finding finding = createFindingService.mapGitLabScannerReportToFindings(codeRepo, codeRepo.getDefaultBranch(), rule.get("name").asText(), rule.get("severity").asText(), null, rule.get("location").asText(), rule.get("description").asText(), rule.get("recommendation").asText());
                log.info("[GitLabScanner] Detected configuration \"{}\" in repository {}", rule.get("name").asText(), codeRepo.getRepourl());
                createFindingService.saveFinding(finding, codeRepo.getDefaultBranch(), codeRepo, Finding.Source.GITLAB_SCANNER);
            } else {
                updateFindingService.verifyGitLabFinding(rule.get("name").asText(), codeRepo, codeRepo.getDefaultBranch(), rule.get("location").asText());
            }
        } catch (Exception e) {
            log.error("[GitLabScanner] Unexpected error for repository {}: {}", codeRepo.getRepourl(), e.getMessage(), e);
        }
    }

    public void checkExternalRepositories(CodeRepo codeRepo) {
        String token = codeRepo.getAccessToken();
        String repo = getRepositoryName(codeRepo);
        String domain = getGitLabDomain(codeRepo);

        try {
            String projectPath = URLEncoder.encode(repo.toString(), StandardCharsets.UTF_8.toString());
            URI uri = new URI("https://" + domain + "/api/v4/projects/" + projectPath + "/repository/tree");

            String response;
            try {
                response = webClient.get()
                        .uri(uri)
                        .header("PRIVATE-TOKEN", token)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();
            } catch (WebClientResponseException e) {
                if (e.getStatusCode().value() == 403) {
                    log.warn("[GitLabScanner] API request failed for repository {}: HTTP Status 403 Forbidden - Access denied for rule 'Usage of external repository'", codeRepo.getRepourl());
                } else {
                    log.error("[GitLabScanner] API request failed for repository {}: HTTP Status {} - {} for rule 'Usage of external repository'",
                            codeRepo.getRepourl(), e.getRawStatusCode(), e.getResponseBodyAsString());
                }
                return;
            } catch (Exception e) {
                log.error("[GitLabScanner] Unexpected error during API request for repository {}: {} for rule 'Usage of external repository'",
                        codeRepo.getRepourl(), e.getMessage(), e);
                return;
            }

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode files = objectMapper.readTree(response);

            JsonNode rule = findRule("Usage of external repository");

            String[] repositoryAllowlist = StreamSupport.stream(findRepositoryAllowlistService.findAll().spliterator(), false).map(RepositoryAllowlist::getRepositoryDomain).toArray(String[]::new);

            for (JsonNode file : files) {
                String path = file.get("path").asText();
                if (path.toLowerCase().contains("dockerfile") || path.toLowerCase().contains("docker-compose")) {
                    URI fileUri = new URI("https://" + domain + "/api/v4/projects/" + projectPath + "/repository/files/" + URLEncoder.encode(path, StandardCharsets.UTF_8.toString()) + "/raw");

                    String fileContent;
                    try {
                        fileContent = webClient.get()
                                .uri(fileUri)
                                .header("PRIVATE-TOKEN", token)
                                .retrieve()
                                .bodyToMono(String.class)
                                .block();
                    } catch (WebClientResponseException e) {
                        if (e.getStatusCode().value() == 403) {
                            log.warn("[GitLabScanner] API request failed for repository {}: HTTP Status 403 Forbidden - Access denied for rule 'Usage of external repository'", codeRepo.getRepourl());
                        } else {
                            log.error("[GitLabScanner] API request failed for repository {}: HTTP Status {} - {} for rule 'Usage of external repository'",
                                    codeRepo.getRepourl(), e.getRawStatusCode(), e.getResponseBodyAsString());
                        }
                        return;
                    } catch (Exception e) {
                        log.error("[GitLabScanner] Unexpected error during API request for repository {}: {} for rule 'Usage of external repository'",
                                codeRepo.getRepourl(), e.getMessage(), e);
                        return;
                    }

                    String[] lines = fileContent.split("\n");
                    for (String line : lines) {
                        line = line.trim();
                        if (line.startsWith("FROM") || line.startsWith("image:")) {
                            boolean matchesAllowlist = false;
                            for (String allowedRepo : repositoryAllowlist) {
                                if (line.contains(allowedRepo)) {
                                    matchesAllowlist = true;
                                }
                            }
                            if (!matchesAllowlist) {
                                Finding finding = createFindingService.mapGitLabScannerReportToFindings(codeRepo, codeRepo.getDefaultBranch(), rule.get("name").asText(), rule.get("severity").asText(), null, rule.get("location").asText() + " (" + path + "/" + line + ")", rule.get("description").asText(), rule.get("recommendation").asText());
                                log.info("[GitLabScanner] Detected configuration \"{}\" in repository {}", rule.get("name").asText(), codeRepo.getRepourl());
                                createFindingService.saveFinding(finding, codeRepo.getDefaultBranch(), codeRepo, Finding.Source.GITLAB_SCANNER);
                            } else {
                                updateFindingService.verifyGitLabFinding(rule.get("name").asText(), codeRepo, codeRepo.getDefaultBranch(), rule.get("location").asText() + " (" + path + "/" + line + ")");
                            }
                        }
                    }
                }
            }

        } catch (Exception e) {
            log.error("[GitLabScanner] Unexpected error for repository {}: {}", codeRepo.getRepourl(), e.getMessage(), e);
        }
    }

    public void checkProtectedBranchesAccessLevel(CodeRepo codeRepo) {
        String token = codeRepo.getAccessToken();
        String repo = getRepositoryName(codeRepo);
        String domain = getGitLabDomain(codeRepo);

        try {
            String projectPath = URLEncoder.encode(repo.toString(), StandardCharsets.UTF_8.toString());
            URI uri = new URI("https://" + domain + "/api/v4/projects/" + projectPath + "/protected_branches");

            String response;
            try {
                response = webClient.get()
                        .uri(uri)
                        .header("PRIVATE-TOKEN", token)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();
            } catch (WebClientResponseException e) {
                if (e.getStatusCode().value() == 403) {
                    log.warn("[GitLabScanner] API request failed for repository {}: HTTP Status 403 Forbidden - Access denied for rule 'Protected branch with insufficient access level'", codeRepo.getRepourl());
                } else {
                    log.error("[GitLabScanner] API request failed for repository {}: HTTP Status {} - {} for rule 'Protected branch with insufficient access level'",
                            codeRepo.getRepourl(), e.getRawStatusCode(), e.getResponseBodyAsString());
                }
                return;
            } catch (Exception e) {
                log.error("[GitLabScanner] Unexpected error during API request for repository {}: {} for rule 'Protected branch with insufficient access level'",
                        codeRepo.getRepourl(), e.getMessage(), e);
                return;
            }

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode branches = objectMapper.readTree(response);
            if (branches.isArray()) {
                for (JsonNode branch : branches) {
                    JsonNode rule = findRule("Protected branch with insufficient access level");
                    boolean isSecureAccess = true;
                    for (JsonNode pushAccess : branch.get("push_access_levels")) {
                        if (!pushAccess.get("access_level_description").asText().equals("Maintainers") && !pushAccess.get("access_level_description").asText().equals("No one") && !pushAccess.get("access_level_description").asText().equals("Instance admins")) {
                            isSecureAccess = false;
                        }
                    }

                    for (JsonNode mergeAccess : branch.get("merge_access_levels")) {
                        if (!mergeAccess.get("access_level_description").asText().equals("Maintainers") && !mergeAccess.get("access_level_description").asText().equals("No one") && !mergeAccess.get("access_level_description").asText().equals("Instance admins")) {
                            isSecureAccess = false;
                        }

                    }

                    if (!isSecureAccess) {
                        Finding finding = createFindingService.mapGitLabScannerReportToFindings(codeRepo, codeRepo.getDefaultBranch(), rule.get("name").asText(), rule.get("severity").asText(), null, rule.get("location").asText() + " (" + branch.get("name").asText() + ")", rule.get("description").asText(), rule.get("recommendation").asText());
                        log.info("[GitLabScanner] Detected configuration \"{}\" in repository {}", rule.get("name").asText(), codeRepo.getRepourl());
                        createFindingService.saveFinding(finding, codeRepo.getDefaultBranch(), codeRepo, Finding.Source.GITLAB_SCANNER);
                    } else {
                        updateFindingService.verifyGitLabFinding(rule.get("name").asText(), codeRepo, codeRepo.getDefaultBranch(), rule.get("location").asText() + " (" + branch.get("name").asText() + ")");
                    }
                }
            }
        } catch (Exception e) {
            log.error("[GitLabScanner] Unexpected error for repository {}: {}", codeRepo.getRepourl(), e.getMessage(), e);
        }
    }


    public void checkSecretsInVariables(CodeRepo codeRepo) {
        String token = codeRepo.getAccessToken();
        String repo = getRepositoryName(codeRepo);
        String domain = getGitLabDomain(codeRepo);

        try {
            String projectPath = URLEncoder.encode(repo.toString(), StandardCharsets.UTF_8.toString());
            URI uri = new URI("https://" + domain + "/api/v4/projects/" + projectPath + "/variables");

            String response;
            try {
                response = webClient.get()
                        .uri(uri)
                        .header("PRIVATE-TOKEN", token)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();
            } catch (WebClientResponseException e) {
                if (e.getStatusCode().value() == 403) {
                    log.warn("[GitLabScanner] API request failed for repository {}: HTTP Status 403 Forbidden - Access denied for rule 'Secret stored in GitLab CI/CD variables'", codeRepo.getRepourl());
                } else {
                    log.error("[GitLabScanner] API request failed for repository {}: HTTP Status {} - {} for rule 'Secret stored in GitLab CI/CD variables'",
                            codeRepo.getRepourl(), e.getRawStatusCode(), e.getResponseBodyAsString());
                }
                return;
            } catch (Exception e) {
                log.error("[GitLabScanner] Unexpected error during API request for repository {}: {} for rule 'Secret stored in GitLab CI/CD variables'",
                        codeRepo.getRepourl(), e.getMessage(), e);
                return;
            }

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode variables = objectMapper.readTree(response);

            for (JsonNode variable : variables) {
                String variableName = variable.get("key").asText();
                JsonNode rule = findRule("Secret stored in GitLab CI/CD variables");
                if (variableName.toLowerCase().contains("secret") || variableName.toLowerCase().contains("key") || variableName.toLowerCase().contains("token") || variableName.toLowerCase().contains("pass")) {
                    Finding finding = createFindingService.mapGitLabScannerReportToFindings(codeRepo, codeRepo.getDefaultBranch(), rule.get("name").asText(), rule.get("severity").asText(), null, rule.get("location").asText() + " (" + variableName + ")", rule.get("description").asText(), rule.get("recommendation").asText());
                    log.info("[GitLabScanner] Detected configuration \"{}\" in repository {}", rule.get("name").asText(), codeRepo.getRepourl());
                    createFindingService.saveFinding(finding, codeRepo.getDefaultBranch(), codeRepo, Finding.Source.GITLAB_SCANNER);
                } else {
                    updateFindingService.verifyGitLabFinding(rule.get("name").asText(), codeRepo, codeRepo.getDefaultBranch(), rule.get("location").asText() + " (" + variableName + ")");
                }
            }
        } catch (Exception e) {
            log.error("[GitLabScanner] Unexpected error for repository {}: {}", codeRepo.getRepourl(), e.getMessage(), e);
        }
    }

    public void checkSuccessfulPipelineOnMerge(CodeRepo codeRepo) {
        String token = codeRepo.getAccessToken();
        String repo = getRepositoryName(codeRepo);
        String domain = getGitLabDomain(codeRepo);

        try {
            String projectPath = URLEncoder.encode(repo.toString(), StandardCharsets.UTF_8.toString());
            URI uri = new URI("https://" + domain + "/api/v4/projects/" + projectPath);
            String response;
            try {
                response = webClient.get()
                        .uri(uri)
                        .header("PRIVATE-TOKEN", token)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();
            } catch (WebClientResponseException e) {
                if (e.getStatusCode().value() == 403) {
                    log.warn("[GitLabScannerService] API request failed for repository {}: HTTP Status 403 Forbidden - Access denied for rule 'Pipeline must succeed before merging'", codeRepo.getRepourl());
                } else {
                    log.error("[GitLabScannerService] API request failed for repository {}: HTTP Status {} - {} for rule 'Pipeline must succeed before merging'",
                            codeRepo.getRepourl(), e.getRawStatusCode(), e.getResponseBodyAsString());
                }
                return;
            } catch (Exception e) {
                log.error("[GitLabScannerService] Unexpected error during API request for repository {}: {} for rule 'Pipeline must succeed before merging'",
                        codeRepo.getRepourl(), e.getMessage(), e);
                return;
            }

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode settings = objectMapper.readTree(response);
            JsonNode rule = findRule("Pipeline must succeed before merging");

            if (!settings.get("only_allow_merge_if_pipeline_succeeds").asBoolean()) {
                Finding finding = createFindingService.mapGitLabScannerReportToFindings(codeRepo, codeRepo.getDefaultBranch(), rule.get("name").asText(), rule.get("severity").asText(), null, rule.get("location").asText(), rule.get("description").asText(), rule.get("recommendation").asText());
                log.info("[GitLabScanner] Detected configuration \"{}\" in repository {}", rule.get("name").asText(), codeRepo.getRepourl());
                createFindingService.saveFinding(finding, codeRepo.getDefaultBranch(), codeRepo, Finding.Source.GITLAB_SCANNER);
            } else {
                updateFindingService.verifyGitLabFinding(rule.get("name").asText(), codeRepo, codeRepo.getDefaultBranch(), rule.get("location").asText());

            }
        } catch (Exception e) {
            log.error("[GitLabScanner] Unexpected error for repository {}: {}", codeRepo.getRepourl(), e.getMessage(), e);
        }
    }

    public void checkSkippedPipelineOnMerge(CodeRepo codeRepo) {
        String token = codeRepo.getAccessToken();
        String repo = getRepositoryName(codeRepo);
        String domain = getGitLabDomain(codeRepo);

        try {
            String projectPath = URLEncoder.encode(repo.toString(), StandardCharsets.UTF_8.toString());
            URI uri = new URI("https://" + domain + "/api/v4/projects/" + projectPath);
            String response;
            try {
                response = webClient.get()
                        .uri(uri)
                        .header("PRIVATE-TOKEN", token)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();
            } catch (WebClientResponseException e) {
                if (e.getStatusCode().value() == 403) {
                    log.warn("[GitLabScannerService] API request failed for repository {}: HTTP Status 403 Forbidden - Access denied for rule 'Merge on skipped pipelines allowed'", codeRepo.getRepourl());
                } else {
                    log.error("[GitLabScannerService] API request failed for repository {}: HTTP Status {} - {} for rule 'Merge on skipped pipelines allowed'",
                            codeRepo.getRepourl(), e.getRawStatusCode(), e.getResponseBodyAsString());
                }
                return;
            } catch (Exception e) {
                log.error("[GitLabScannerService] Unexpected error during API request for repository {}: {} for rule 'Merge on skipped pipelines allowed'",
                        codeRepo.getRepourl(), e.getMessage(), e);
                return;
            }

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode settings = objectMapper.readTree(response);
            JsonNode rule = findRule("Merge on skipped pipelines allowed");

            if (settings.get("allow_merge_on_skipped_pipeline").asBoolean()) {
                Finding finding = createFindingService.mapGitLabScannerReportToFindings(codeRepo, codeRepo.getDefaultBranch(), rule.get("name").asText(), rule.get("severity").asText(), null, rule.get("location").asText(), rule.get("description").asText(), rule.get("recommendation").asText());
                log.info("[GitLabScanner] Detected configuration \"{}\" in repository {}", rule.get("name").asText(), codeRepo.getRepourl());
                createFindingService.saveFinding(finding, codeRepo.getDefaultBranch(), codeRepo, Finding.Source.GITLAB_SCANNER);
            } else {
                updateFindingService.verifyGitLabFinding(rule.get("name").asText(), codeRepo, codeRepo.getDefaultBranch(), rule.get("location").asText());

            }
        } catch (Exception e) {
            log.error("[GitLabScanner] Unexpected error for repository {}: {}", codeRepo.getRepourl(), e.getMessage(), e);
        }
    }

    public void checkContainerRegistryAccessControl(CodeRepo codeRepo) {
        String token = codeRepo.getAccessToken();
        String repo = getRepositoryName(codeRepo);
        String domain = getGitLabDomain(codeRepo);

        try {
            String projectPath = URLEncoder.encode(repo.toString(), StandardCharsets.UTF_8.toString());
            URI uri = new URI("https://" + domain + "/api/v4/projects/" + projectPath + "/registry/protection/repository/rules");

            String response;
            try {
                response = webClient.get()
                        .uri(uri)
                        .header("PRIVATE-TOKEN", token)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();
            } catch (WebClientResponseException e) {
                if (e.getStatusCode().value() == 403) {
                    log.warn("[GitLabScanner] API request failed for repository {}: HTTP Status 403 Forbidden - Access denied for rule 'Access control for Container registry repository not configured'", codeRepo.getRepourl());
                } else {
                    log.error("[GitLabScanner] API request failed for repository {}: HTTP Status {} - {} for rule 'Access control for Container registry repository not configured'",
                            codeRepo.getRepourl(), e.getRawStatusCode(), e.getResponseBodyAsString());
                }
                return;
            } catch (Exception e) {
                log.error("[GitLabScanner] Unexpected error during API request for repository {}: {} for rule 'Access control for Container registry repository not configured'",
                        codeRepo.getRepourl(), e.getMessage(), e);
                return;
            }

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode containerRegistryRules = objectMapper.readTree(response);

            ArrayList<String> containerRegistryRulesArray = new ArrayList<>();
            for (JsonNode containerRegistryRule : containerRegistryRules) {
                containerRegistryRulesArray.add(containerRegistryRule.get("repository_path_pattern").asText());
            }

            URI registryUri = new URI("https://" + domain + "/api/v4/projects/" + projectPath + "/registry/repositories");

            String registryContent;
            try {
                registryContent = webClient.get()
                        .uri(registryUri)
                        .header("PRIVATE-TOKEN", token)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();
            } catch (WebClientResponseException e) {
                if (e.getStatusCode().value() == 403) {
                    log.warn("[GitLabScanner] API request failed for repository {}: HTTP Status 403 Forbidden - Access denied for rule 'Access control for Container registry repository not configured'", codeRepo.getRepourl());
                } else {
                    log.error("[GitLabScanner] API request failed for repository {}: HTTP Status {} - {} for rule 'Access control for Container registry repository not configured'",
                            codeRepo.getRepourl(), e.getRawStatusCode(), e.getResponseBodyAsString());
                }
                return;
            } catch (Exception e) {
                log.error("[GitLabScanner] Unexpected error during API request for repository {}: {} for rule 'Access control for Container registry repository not configured'",
                        codeRepo.getRepourl(), e.getMessage(), e);
                return;
            }

            JsonNode registries = objectMapper.readTree(registryContent);

            ArrayList<String> registryArray = new ArrayList<>();
            for (JsonNode registry : registries) {
                registryArray.add(registry.get("path").asText());
            }

            JsonNode rule = findRule("Access control for Container registry repository not configured");

            for (String registry: registryArray) {
                Boolean regexMatch = false;
                for (String containerRegistryRule : containerRegistryRulesArray) {
                    String ruleRegex = containerRegistryRule.replace("*", ".*");
                    if (registry.matches(ruleRegex)) {
                        regexMatch = true;
                        break;
                    }
                }
                if (!regexMatch) {
                    Finding finding = createFindingService.mapGitLabScannerReportToFindings(codeRepo, codeRepo.getDefaultBranch(), rule.get("name").asText(), rule.get("severity").asText(), null, rule.get("location").asText() + " (" + registry + ")", rule.get("description").asText(), rule.get("recommendation").asText());
                    log.info("[GitLabScanner] Detected configuration \"{}\" in repository {}", rule.get("name").asText(), codeRepo.getRepourl());
                    createFindingService.saveFinding(finding, codeRepo.getDefaultBranch(), codeRepo, Finding.Source.GITLAB_SCANNER);
                } else {
                    updateFindingService.verifyGitLabFinding(rule.get("name").asText(), codeRepo, codeRepo.getDefaultBranch(), rule.get("location").asText() + " (" + registry + ")");
                }
            }
        } catch (Exception e) {
            log.error("[GitLabScanner] Unexpected error for repository {}: {}", codeRepo.getRepourl(), e.getMessage(), e);
        }
    }

    public void checkProjectVisibility(CodeRepo codeRepo) {
        String token = codeRepo.getAccessToken();
        String repo = getRepositoryName(codeRepo);
        String domain = getGitLabDomain(codeRepo);

        try {
            String projectPath = URLEncoder.encode(repo.toString(), StandardCharsets.UTF_8.toString());
            URI uri = new URI("https://" + domain + "/api/v4/projects/" + projectPath);
            String response;
            try {
                response = webClient.get()
                        .uri(uri)
                        .header("PRIVATE-TOKEN", token)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();
            } catch (WebClientResponseException e) {
                if (e.getStatusCode().value() == 403) {
                    log.warn("[GitLabScannerService] API request failed for repository {}: HTTP Status 403 Forbidden - Access denied for rule 'Project is not private'", codeRepo.getRepourl());
                } else {
                    log.error("[GitLabScannerService] API request failed for repository {}: HTTP Status {} - {} for rule 'Project is not private'",
                            codeRepo.getRepourl(), e.getRawStatusCode(), e.getResponseBodyAsString());
                }
                return;
            } catch (Exception e) {
                log.error("[GitLabScannerService] Unexpected error during API request for repository {}: {} for rule 'Project is not private'",
                        codeRepo.getRepourl(), e.getMessage(), e);
                return;
            }

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode settings = objectMapper.readTree(response);
            JsonNode rule = findRule("Project is not private");

            if (!settings.get("visibility").asText().equals("private")) {
                Finding finding = createFindingService.mapGitLabScannerReportToFindings(codeRepo, codeRepo.getDefaultBranch(), rule.get("name").asText(), rule.get("severity").asText(), null, rule.get("location").asText(), rule.get("description").asText(), rule.get("recommendation").asText());
                log.info("[GitLabScanner] Detected configuration \"{}\" in repository {}", rule.get("name").asText(), codeRepo.getRepourl());
                createFindingService.saveFinding(finding, codeRepo.getDefaultBranch(), codeRepo, Finding.Source.GITLAB_SCANNER);
            } else {
                updateFindingService.verifyGitLabFinding(rule.get("name").asText(), codeRepo, codeRepo.getDefaultBranch(), rule.get("location").asText());

            }
        } catch (Exception e) {
            log.error("[GitLabScanner] Unexpected error for repository {}: {}", codeRepo.getRepourl(), e.getMessage(), e);
        }
    }
}

