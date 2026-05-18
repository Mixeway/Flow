package io.mixeway.mixewayflowapi.integrations.jira.apiclient;

import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.entity.JiraConfiguration;
import io.mixeway.mixewayflowapi.db.entity.Vulnerability;
import io.mixeway.mixewayflowapi.db.repository.FindingRepository;
import io.mixeway.mixewayflowapi.integrations.jira.dto.JiraIssueResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;
import java.util.stream.Collectors;
import java.net.URLEncoder;

@Service
@RequiredArgsConstructor
@Log4j2
public class JiraApiClientService {
    private final WebClient webClient;
    private final FindingRepository findingRepository;

    private static final int MAX_TICKETS_PER_BATCH = 30;

    /**
     * Creates a single JIRA ticket for one finding.
     */
    @Transactional
    public String createTicketForFinding(JiraConfiguration config, Finding finding) {
        Finding managed = findingRepository.findById(finding.getId()).orElse(finding);
        String summary = buildSummary(managed);
        String description = buildDescription(managed);
        String priority = mapSeverityToJiraPriority(managed.getSeverity().name());

        String ticketKey = createJiraIssue(config, summary, description, priority);
        if (ticketKey != null) {
            managed.setJiraTicketKey(ticketKey);
            findingRepository.save(managed);
            log.info("[JIRA] Created ticket {} for finding {} in {}", ticketKey, managed.getId(),
                    managed.getCodeRepo() != null ? managed.getCodeRepo().getName() : "cloud");
        }
        return ticketKey;
    }

    /**
     * Creates grouped JIRA tickets for multiple findings.
     * Groups by vulnerability name + source + repo + filename.
     * When subtask mode is enabled, creates a parent task per vulnerability name
     * and subtasks per file grouping under that parent.
     * Returns the number of tickets actually created.
     */
    @Transactional
    public int createTicketsGrouped(JiraConfiguration config, List<Finding> findings) {
        List<Long> ids = findings.stream().map(Finding::getId).collect(Collectors.toList());
        List<Finding> managed = findingRepository.findAllById(ids);
        if (config.isSubtaskEnabled()) {
            return createTicketsWithSubtasks(config, managed);
        }
        return createTicketsFlat(config, managed);
    }

    private int createTicketsFlat(JiraConfiguration config, List<Finding> findings) {
        Map<String, List<Finding>> grouped = groupFindings(findings);

        int ticketCount = 0;
        for (Map.Entry<String, List<Finding>> entry : grouped.entrySet()) {
            if (ticketCount >= MAX_TICKETS_PER_BATCH) {
                log.warn("[JIRA] Reached max ticket limit ({}) for batch operation", MAX_TICKETS_PER_BATCH);
                break;
            }

            List<Finding> groupFindings = entry.getValue();
            String summary = buildGroupSummary(groupFindings);
            String description = buildGroupDescription(groupFindings);
            String highestSeverity = getHighestSeverity(groupFindings);
            String priority = mapSeverityToJiraPriority(highestSeverity);

            String ticketKey = createJiraIssue(config, summary, description, priority);
            if (ticketKey != null) {
                for (Finding f : groupFindings) {
                    f.setJiraTicketKey(ticketKey);
                    findingRepository.save(f);
                }
                ticketCount++;
                log.info("[JIRA] Created grouped ticket {} for {} findings ({})", ticketKey, groupFindings.size(), entry.getKey());
            }
        }
        return ticketCount;
    }

    private int createTicketsWithSubtasks(JiraConfiguration config, List<Finding> findings) {
        String subtaskTypeName = detectSubtaskTypeName(config);
        int ticketCount = 0;

        // Group by vulnerability name + source + repo (parent level)
        Map<String, List<Finding>> parentGrouped = findings.stream()
                .collect(Collectors.groupingBy(f -> {
                    String vulnName = f.getVulnerability() != null ? f.getVulnerability().getName() : "unknown";
                    String source = f.getSource() != null ? f.getSource().name() : "unknown";
                    String repo = f.getCodeRepo() != null ? f.getCodeRepo().getName() : "cloud";
                    return vulnName + "|" + source + "|" + repo;
                }));

        for (Map.Entry<String, List<Finding>> parentEntry : parentGrouped.entrySet()) {
            if (ticketCount >= MAX_TICKETS_PER_BATCH) break;

            List<Finding> parentFindings = parentEntry.getValue();
            Finding first = parentFindings.get(0);
            String vulnName = first.getVulnerability() != null ? first.getVulnerability().getName() : "Security Findings";
            String repo = first.getCodeRepo() != null ? first.getCodeRepo().getName() : "Cloud";
            String severity = getHighestSeverity(parentFindings);
            String source = first.getSource() != null ? first.getSource().name() : "";

            String parentSummary = String.format("[%s][%s] %s (%d findings) - %s",
                    severity, source, vulnName, parentFindings.size(), repo);
            String parentDescription = buildGroupDescription(parentFindings);
            String priority = mapSeverityToJiraPriority(severity);

            String parentKey = createJiraIssue(config, parentSummary, parentDescription, priority);
            if (parentKey == null) continue;
            ticketCount++;
            log.info("[JIRA] Created parent task {} for vulnerability '{}' with {} findings", parentKey, vulnName, parentFindings.size());

            // Now group by filename within this vulnerability and create subtasks
            Map<String, List<Finding>> fileGrouped = parentFindings.stream()
                    .collect(Collectors.groupingBy(f -> extractFilename(f.getLocation())));

            for (Map.Entry<String, List<Finding>> fileEntry : fileGrouped.entrySet()) {
                if (ticketCount >= MAX_TICKETS_PER_BATCH) break;

                String filename = fileEntry.getKey();
                List<Finding> fileFindings = fileEntry.getValue();
                String fileSeverity = getHighestSeverity(fileFindings);

                String lines = fileFindings.stream()
                        .map(f -> {
                            String loc = f.getLocation();
                            if (loc != null) {
                                int lastColon = loc.lastIndexOf(':');
                                if (lastColon > 0 && loc.substring(lastColon + 1).matches("\\d+")) {
                                    return ":" + loc.substring(lastColon + 1);
                                }
                            }
                            return "";
                        })
                        .filter(s -> !s.isEmpty())
                        .collect(Collectors.joining(", "));

                String subtaskSummary = String.format("[%s] %s - %s %s",
                        fileSeverity, vulnName, filename, lines.isEmpty() ? "" : "(" + lines + ")");

                StringBuilder subtaskDesc = new StringBuilder();
                subtaskDesc.append("h3. Findings in {{").append(filename).append("}}\n\n");
                subtaskDesc.append("||#||Severity||Location||\n");
                int idx = 1;
                for (Finding f : fileFindings) {
                    subtaskDesc.append("|").append(idx++).append("|")
                            .append(severityIcon(f.getSeverity().name())).append(" ").append(f.getSeverity())
                            .append("|{{").append(f.getLocation()).append("}}|\n");
                }
                subtaskDesc.append("\n_Part of parent task ").append(parentKey).append("_\n");

                String subtaskKey = createJiraIssue(config, subtaskSummary, subtaskDesc.toString(),
                        mapSeverityToJiraPriority(fileSeverity), subtaskTypeName, parentKey);

                if (subtaskKey != null) {
                    for (Finding f : fileFindings) {
                        f.setJiraTicketKey(subtaskKey);
                        findingRepository.save(f);
                    }
                    ticketCount++;
                    log.info("[JIRA] Created subtask {} under {} for file '{}' ({} findings)",
                            subtaskKey, parentKey, filename, fileFindings.size());
                }
            }
        }
        return ticketCount;
    }

    /**
     * Closes a JIRA ticket by transitioning it to Done/Closed and adding a comment.
     */
    public void closeTicket(JiraConfiguration config, String ticketKey, String comment) {
        try {
            addComment(config, ticketKey, comment);
            String transitionId = findCloseTransitionId(config, ticketKey);
            if (transitionId != null) {
                transitionIssue(config, ticketKey, transitionId);
                log.info("[JIRA] Closed ticket {} with comment", ticketKey);
            } else {
                log.warn("[JIRA] Could not find close/done transition for ticket {}", ticketKey);
            }
        } catch (Exception e) {
            log.error("[JIRA] Error closing ticket {}: {}", ticketKey, e.getMessage());
        }
    }

    /**
     * Tests connectivity to JIRA with the given configuration.
     * Tries v3 API first (Atlassian Cloud), falls back to v2.
     */
    public boolean testConnection(JiraConfiguration config) {
        boolean isCloud = config.getJiraUrl() != null && config.getJiraUrl().contains(".atlassian.net");
        String firstApi = isCloud ? "/rest/api/3/myself" : "/rest/api/2/myself";
        String fallbackApi = isCloud ? "/rest/api/2/myself" : "/rest/api/3/myself";

        try {
            String response = webClient.get()
                    .uri(config.getJiraUrl() + firstApi)
                    .headers(h -> buildAuthHeaders(h, config))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
            log.info("[JIRA] Connection test successful ({}): {}", firstApi, response != null ? response.substring(0, Math.min(response.length(), 100)) : "null");
            return true;
        } catch (Exception e) {
            log.warn("[JIRA] {} connection test failed, trying fallback: {} ({})", firstApi, e.getMessage(), e.getClass().getSimpleName());
        }
        try {
            webClient.get()
                    .uri(config.getJiraUrl() + fallbackApi)
                    .headers(h -> buildAuthHeaders(h, config))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
            log.info("[JIRA] Connection test successful ({})", fallbackApi);
            return true;
        } catch (Exception e) {
            log.error("[JIRA] Connection test failed ({}): {} ({})", fallbackApi, e.getMessage(), e.getClass().getSimpleName());
            return false;
        }
    }

    /**
     * Fetches accessible JIRA projects for given credentials.
     * For on-prem (PAT or non-cloud URL), tries v2 first.
     * For cloud, tries v3 first, then falls back to v2.
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, String>> fetchProjects(String jiraUrl, String jiraUsername, String jiraToken, String authType) {
        String normalizedUrl = jiraUrl.endsWith("/") ? jiraUrl.substring(0, jiraUrl.length() - 1) : jiraUrl;
        boolean isCloud = normalizedUrl.contains(".atlassian.net");

        if (!isCloud || "PAT".equalsIgnoreCase(authType)) {
            List<Map<String, String>> projects = fetchProjectsV2(normalizedUrl, jiraUsername, jiraToken, authType);
            if (!projects.isEmpty()) return projects;
            log.info("[JIRA] v2 returned no results, trying v3 endpoint");
            return fetchProjectsV3(normalizedUrl, jiraUsername, jiraToken, authType);
        }

        List<Map<String, String>> projects = fetchProjectsV3(normalizedUrl, jiraUsername, jiraToken, authType);
        if (!projects.isEmpty()) return projects;

        log.info("[JIRA] v3 search returned no results, falling back to v2 endpoint");
        return fetchProjectsV2(normalizedUrl, jiraUsername, jiraToken, authType);
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, String>> fetchProjectsV3(String baseUrl, String jiraUsername, String jiraToken, String authType) {
        try {
            String raw = webClient.get()
                    .uri(baseUrl + "/rest/api/3/project/search?maxResults=100")
                    .headers(h -> buildTempAuthHeaders(h, jiraUsername, jiraToken, authType))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            log.info("[JIRA] v3 project/search raw response: {}", raw);

            if (raw != null) {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                Map<String, Object> parsed = mapper.readValue(raw, Map.class);

                List<Map<String, Object>> values = (List<Map<String, Object>>) parsed.get("values");
                if (values != null && !values.isEmpty()) {
                    log.info("[JIRA] Found {} projects via v3 API", values.size());
                    return values.stream()
                            .map(p -> Map.of(
                                    "key", String.valueOf(p.get("key")),
                                    "name", String.valueOf(p.get("name"))))
                            .collect(Collectors.toList());
                }
                log.info("[JIRA] v3 parsed keys: {}, total: {}", parsed.keySet(), parsed.get("total"));
            }
        } catch (Exception e) {
            log.warn("[JIRA] v3 project/search failed: {} ({})", e.getMessage(), e.getClass().getSimpleName());
        }
        return List.of();
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, String>> fetchProjectsV2(String baseUrl, String jiraUsername, String jiraToken, String authType) {
        try {
            String raw = webClient.get()
                    .uri(baseUrl + "/rest/api/2/project")
                    .headers(h -> buildTempAuthHeaders(h, jiraUsername, jiraToken, authType))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (raw != null) {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                List<Map<String, Object>> projects = mapper.readValue(raw,
                        mapper.getTypeFactory().constructCollectionType(List.class, Map.class));

                if (projects != null && !projects.isEmpty()) {
                    log.info("[JIRA] Found {} projects via v2 API", projects.size());
                    return projects.stream()
                            .map(p -> Map.of(
                                    "key", String.valueOf(p.get("key")),
                                    "name", String.valueOf(p.get("name"))))
                            .collect(Collectors.toList());
                }
            }
        } catch (Exception e) {
            log.error("[JIRA] v2 project fetch failed: {} ({})", e.getMessage(), e.getClass().getSimpleName());
        }
        return List.of();
    }

    private void buildTempAuthHeaders(HttpHeaders headers, String jiraUsername, String jiraToken, String authType) {
        headers.set("Accept", "application/json");
        if ("PAT".equalsIgnoreCase(authType)) {
            headers.setBearerAuth(jiraToken);
        } else if (jiraUsername != null && !jiraUsername.isBlank()) {
            headers.setBasicAuth(jiraUsername, jiraToken);
        } else {
            headers.setBearerAuth(jiraToken);
        }
    }

    /**
     * Fetches available issue types for the configured JIRA project.
     * Uses createmeta endpoint which returns types valid for issue creation.
     */
    @SuppressWarnings("unchecked")
    public List<String> fetchIssueTypes(String jiraUrl, String jiraUsername, String jiraToken, String projectKey, String authType) {
        String normalizedUrl = jiraUrl.endsWith("/") ? jiraUrl.substring(0, jiraUrl.length() - 1) : jiraUrl;

        List<String> types = fetchIssueTypesViaCreatemeta(normalizedUrl, jiraUsername, jiraToken, projectKey, authType);
        if (!types.isEmpty()) return types;

        types = fetchIssueTypesViaProject(normalizedUrl, jiraUsername, jiraToken, projectKey, authType);
        if (!types.isEmpty()) return types;

        return fetchIssueTypesGlobal(normalizedUrl, jiraUsername, jiraToken, authType);
    }

    @SuppressWarnings("unchecked")
    private List<String> fetchIssueTypesViaCreatemeta(String baseUrl, String jiraUsername, String jiraToken, String projectKey, String authType) {
        try {
            String raw = webClient.get()
                    .uri(baseUrl + "/rest/api/2/issue/createmeta?projectKeys=" + projectKey + "&expand=projects.issuetypes")
                    .headers(h -> buildTempAuthHeaders(h, jiraUsername, jiraToken, authType))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            log.info("[JIRA] createmeta response length: {}", raw != null ? raw.length() : 0);

            if (raw != null) {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                Map<String, Object> parsed = mapper.readValue(raw, Map.class);
                List<Map<String, Object>> projects = (List<Map<String, Object>>) parsed.get("projects");
                if (projects != null && !projects.isEmpty()) {
                    List<Map<String, Object>> issueTypes = (List<Map<String, Object>>) projects.get(0).get("issuetypes");
                    if (issueTypes != null) {
                        List<String> result = issueTypes.stream()
                                .filter(it -> !Boolean.TRUE.equals(it.get("subtask")))
                                .map(it -> (String) it.get("name"))
                                .filter(Objects::nonNull)
                                .collect(Collectors.toList());
                        log.info("[JIRA] Found {} issue types via createmeta for project {}", result.size(), projectKey);
                        return result;
                    }
                }
            }
        } catch (Exception e) {
            log.warn("[JIRA] createmeta failed for {}: {} ({})", projectKey, e.getMessage(), e.getClass().getSimpleName());
        }
        return List.of();
    }

    @SuppressWarnings("unchecked")
    private List<String> fetchIssueTypesViaProject(String baseUrl, String jiraUsername, String jiraToken, String projectKey, String authType) {
        try {
            String raw = webClient.get()
                    .uri(baseUrl + "/rest/api/2/project/" + projectKey)
                    .headers(h -> buildTempAuthHeaders(h, jiraUsername, jiraToken, authType))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (raw != null) {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                Map<String, Object> parsed = mapper.readValue(raw, Map.class);
                List<Map<String, Object>> issueTypes = (List<Map<String, Object>>) parsed.get("issueTypes");
                if (issueTypes != null) {
                    return issueTypes.stream()
                            .filter(it -> !Boolean.TRUE.equals(it.get("subtask")))
                            .map(it -> (String) it.get("name"))
                            .filter(Objects::nonNull)
                            .collect(Collectors.toList());
                }
            }
        } catch (Exception e) {
            log.warn("[JIRA] project endpoint failed for {}: {} ({})", projectKey, e.getMessage(), e.getClass().getSimpleName());
        }
        return List.of();
    }

    @SuppressWarnings("unchecked")
    private List<String> fetchIssueTypesGlobal(String baseUrl, String jiraUsername, String jiraToken, String authType) {
        try {
            String raw = webClient.get()
                    .uri(baseUrl + "/rest/api/2/issuetype")
                    .headers(h -> buildTempAuthHeaders(h, jiraUsername, jiraToken, authType))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (raw != null) {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                List<Map<String, Object>> types = mapper.readValue(raw,
                        mapper.getTypeFactory().constructCollectionType(List.class, Map.class));
                List<String> result = types.stream()
                        .filter(it -> !Boolean.TRUE.equals(it.get("subtask")))
                        .map(it -> (String) it.get("name"))
                        .filter(Objects::nonNull)
                        .distinct()
                        .collect(Collectors.toList());
                log.info("[JIRA] Found {} issue types via global issuetype endpoint", result.size());
                return result;
            }
        } catch (Exception e) {
            log.warn("[JIRA] global issuetype fetch failed: {} ({})", e.getMessage(), e.getClass().getSimpleName());
        }
        return List.of();
    }

    private String createJiraIssue(JiraConfiguration config, String summary, String description, String priority) {
        return createJiraIssue(config, summary, description, priority, config.getJiraIssueType(), null);
    }

    private String createJiraIssue(JiraConfiguration config, String summary, String description,
                                    String priority, String issueType, String parentKey) {
        try {
            Map<String, Object> fields = new LinkedHashMap<>();
            fields.put("project", Map.of("key", config.getJiraProjectKey()));
            fields.put("summary", truncate(summary, 255));
            fields.put("description", truncate(description, 32000));
            fields.put("issuetype", Map.of("name", issueType));

            if (parentKey != null && !parentKey.isBlank()) {
                fields.put("parent", Map.of("key", parentKey));
            }

            if (config.getJiraLabels() != null && !config.getJiraLabels().isBlank()) {
                List<String> labels = Arrays.stream(config.getJiraLabels().split(","))
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .collect(Collectors.toList());
                if (!labels.isEmpty()) {
                    fields.put("labels", labels);
                }
            }

            if (parentKey == null && config.getJiraEpicKey() != null && !config.getJiraEpicKey().isBlank()) {
                String epicLinkField = detectEpicLinkField(config);
                if (epicLinkField != null) {
                    fields.put(epicLinkField, config.getJiraEpicKey());
                }
            }

            Map<String, Object> body = Map.of("fields", fields);

            log.info("[JIRA] Creating issue in project {} with type '{}', summary: '{}'",
                    config.getJiraProjectKey(), config.getJiraIssueType(), truncate(summary, 80));

            String responseRaw = webClient.post()
                    .uri(config.getJiraUrl() + "/rest/api/2/issue")
                    .headers(h -> buildAuthHeaders(h, config))
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .exchangeToMono(clientResponse -> {
                        if (clientResponse.statusCode().isError()) {
                            return clientResponse.bodyToMono(String.class)
                                    .defaultIfEmpty("(empty body)")
                                    .flatMap(errorBody -> {
                                        log.error("[JIRA] Error {} creating issue. Response: {}",
                                                clientResponse.statusCode(), errorBody);
                                        return reactor.core.publisher.Mono.error(
                                                new RuntimeException(clientResponse.statusCode() + " - " + errorBody));
                                    });
                        }
                        return clientResponse.bodyToMono(String.class);
                    })
                    .block();

            if (responseRaw != null) {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                JiraIssueResponse response = mapper.readValue(responseRaw, JiraIssueResponse.class);
                return response.getKey();
            }
            return null;
        } catch (Exception e) {
            log.error("[JIRA] Error creating issue: {}", e.getMessage());
            return null;
        }
    }

    private void addComment(JiraConfiguration config, String ticketKey, String comment) {
        Map<String, String> body = Map.of("body", comment);
        webClient.post()
                .uri(config.getJiraUrl() + "/rest/api/2/issue/" + ticketKey + "/comment")
                .headers(h -> buildAuthHeaders(h, config))
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    @SuppressWarnings("unchecked")
    private String findCloseTransitionId(JiraConfiguration config, String ticketKey) {
        try {
            Map<String, Object> response = webClient.get()
                    .uri(config.getJiraUrl() + "/rest/api/2/issue/" + ticketKey + "/transitions")
                    .headers(h -> buildAuthHeaders(h, config))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response != null && response.containsKey("transitions")) {
                List<Map<String, Object>> transitions = (List<Map<String, Object>>) response.get("transitions");
                for (Map<String, Object> transition : transitions) {
                    String name = (String) transition.get("name");
                    if (name != null && (name.equalsIgnoreCase("Done") || name.equalsIgnoreCase("Close")
                            || name.equalsIgnoreCase("Closed") || name.equalsIgnoreCase("Resolve"))) {
                        return (String) transition.get("id");
                    }
                }
                if (!transitions.isEmpty()) {
                    return (String) transitions.get(transitions.size() - 1).get("id");
                }
            }
        } catch (Exception e) {
            log.error("[JIRA] Error finding transitions for {}: {}", ticketKey, e.getMessage());
        }
        return null;
    }

    private void transitionIssue(JiraConfiguration config, String ticketKey, String transitionId) {
        Map<String, Object> body = Map.of("transition", Map.of("id", transitionId));
        webClient.post()
                .uri(config.getJiraUrl() + "/rest/api/2/issue/" + ticketKey + "/transitions")
                .headers(h -> buildAuthHeaders(h, config))
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    private void buildAuthHeaders(HttpHeaders headers, JiraConfiguration config) {
        headers.set("Accept", "application/json");
        if ("PAT".equalsIgnoreCase(config.getAuthType())) {
            headers.setBearerAuth(config.getJiraToken());
        } else if (config.getJiraUsername() != null && !config.getJiraUsername().isBlank()) {
            headers.setBasicAuth(config.getJiraUsername(), config.getJiraToken());
        } else {
            boolean isAtlassianCloud = config.getJiraUrl() != null
                    && config.getJiraUrl().contains(".atlassian.net");
            if (isAtlassianCloud) {
                log.warn("[JIRA] Atlassian Cloud requires Basic Auth (email + API token). "
                        + "Username is empty – authentication will likely fail.");
            }
            headers.setBearerAuth(config.getJiraToken());
        }
    }

    /**
     * Groups findings by vulnerability + source + repo + filename.
     * The filename is extracted from the location field (everything before the last ':line').
     */
    Map<String, List<Finding>> groupFindings(List<Finding> findings) {
        return findings.stream().collect(Collectors.groupingBy(f -> {
            String vulnName = f.getVulnerability() != null ? f.getVulnerability().getName() : "unknown";
            String source = f.getSource() != null ? f.getSource().name() : "unknown";
            String repo = f.getCodeRepo() != null ? f.getCodeRepo().getName() : "cloud";
            String filename = extractFilename(f.getLocation());
            return vulnName + "|" + source + "|" + repo + "|" + filename;
        }));
    }

    private String extractFilename(String location) {
        if (location == null || location.isBlank()) return "unknown";
        int lastColon = location.lastIndexOf(':');
        if (lastColon > 0) {
            String afterColon = location.substring(lastColon + 1);
            if (afterColon.matches("\\d+")) {
                return location.substring(0, lastColon);
            }
        }
        return location;
    }

    private String buildSummary(Finding finding) {
        String vulnName = finding.getVulnerability() != null ? finding.getVulnerability().getName() : "Security Finding";
        String repo = finding.getCodeRepo() != null ? finding.getCodeRepo().getName() : "Cloud";
        String source = finding.getSource() != null ? finding.getSource().name() : "";
        return String.format("[%s][%s] %s - %s", finding.getSeverity(), source, vulnName, repo);
    }

    private String buildDescription(Finding finding) {
        StringBuilder sb = new StringBuilder();

        // Header with severity icon
        sb.append("h2. ");
        sb.append(severityIcon(finding.getSeverity().name()));
        sb.append(" Security Finding\n\n");

        // Overview table
        sb.append("||Property||Details||\n");
        sb.append("|*Severity*|").append(severityIcon(finding.getSeverity().name())).append(" ").append(finding.getSeverity()).append("|\n");
        sb.append("|*Source*|").append(finding.getSource()).append("|\n");
        sb.append("|*Location*|{{").append(finding.getLocation()).append("}}|\n");
        if (finding.getCodeRepo() != null) {
            sb.append("|*Repository*|").append(finding.getCodeRepo().getName()).append("|\n");
        }
        if (finding.getCodeRepoBranch() != null) {
            sb.append("|*Branch*|").append(finding.getCodeRepoBranch().getName()).append("|\n");
        }
        if (finding.getComponent() != null) {
            sb.append("|*Component*|{{").append(finding.getComponent().getName());
            if (finding.getComponent().getVersion() != null) {
                sb.append(":").append(finding.getComponent().getVersion());
            }
            sb.append("}}|\n");
        }

        // Vulnerability details
        if (finding.getVulnerability() != null) {
            Vulnerability vuln = finding.getVulnerability();
            sb.append("|*Vulnerability*|").append(vuln.getName()).append("|\n");
            if (vuln.getRef() != null && !vuln.getRef().isBlank()) {
                sb.append("|*Reference*|[").append(vuln.getRef()).append("]|\n");
            }
            if (vuln.getEpss() != null) {
                sb.append("|*EPSS Score*|").append(String.format("%.2f%%", vuln.getEpss().doubleValue() * 100)).append("|\n");
            }
            if (vuln.getExploitExists() != null && vuln.getExploitExists()) {
                sb.append("|*Known Exploit*|{color:red}*YES*{color}|\n");
            }

            if (vuln.getDescription() != null && !vuln.getDescription().isBlank()) {
                sb.append("\nh3. Description\n");
                sb.append(truncate(vuln.getDescription(), 4000)).append("\n");
            }

            if (vuln.getRecommendation() != null && !vuln.getRecommendation().isBlank()) {
                sb.append("\nh3. ").append((char) 9989).append(" Recommendation\n");
                sb.append(vuln.getRecommendation()).append("\n");
            }
        }

        // Explanation / context
        if (finding.getExplanation() != null && !finding.getExplanation().isBlank()) {
            sb.append("\nh3. Context\n");
            sb.append("{noformat}").append(truncate(finding.getExplanation(), 3000)).append("{noformat}\n");
        }

        sb.append("\n----\n_Ticket created automatically by Flow_\n");
        return sb.toString();
    }

    private String buildGroupSummary(List<Finding> findings) {
        Finding first = findings.get(0);
        String vulnName = first.getVulnerability() != null ? first.getVulnerability().getName() : "Security Findings";
        String repo = first.getCodeRepo() != null ? first.getCodeRepo().getName() : "Cloud";
        String severity = getHighestSeverity(findings);
        String source = first.getSource() != null ? first.getSource().name() : "";
        String filename = extractFilename(first.getLocation());
        if (findings.size() == 1) {
            return String.format("[%s][%s] %s - %s (%s)", severity, source, vulnName, repo, filename);
        }
        return String.format("[%s][%s] %s (%d occurrences) - %s (%s)", severity, source, vulnName, findings.size(), repo, filename);
    }

    private String buildGroupDescription(List<Finding> findings) {
        Finding first = findings.get(0);
        StringBuilder sb = new StringBuilder();
        String severity = getHighestSeverity(findings);

        // Header
        sb.append("h2. ");
        sb.append(severityIcon(severity));
        sb.append(" Grouped Security Findings (").append(findings.size()).append(" occurrences)\n\n");

        // Summary table
        sb.append("||Property||Details||\n");
        sb.append("|*Highest Severity*|").append(severityIcon(severity)).append(" ").append(severity).append("|\n");
        sb.append("|*Source*|").append(first.getSource()).append("|\n");
        if (first.getCodeRepo() != null) {
            sb.append("|*Repository*|").append(first.getCodeRepo().getName()).append("|\n");
        }
        String filename = extractFilename(first.getLocation());
        sb.append("|*File*|{{").append(filename).append("}}|\n");
        sb.append("|*Total Occurrences*|").append(findings.size()).append("|\n");

        // Vulnerability info
        if (first.getVulnerability() != null) {
            Vulnerability vuln = first.getVulnerability();
            sb.append("|*Vulnerability*|").append(vuln.getName()).append("|\n");
            if (vuln.getRef() != null && !vuln.getRef().isBlank()) {
                sb.append("|*Reference*|[").append(vuln.getRef()).append("]|\n");
            }
            if (vuln.getEpss() != null) {
                sb.append("|*EPSS Score*|").append(String.format("%.2f%%", vuln.getEpss().doubleValue() * 100)).append("|\n");
            }
            if (vuln.getExploitExists() != null && vuln.getExploitExists()) {
                sb.append("|*Known Exploit*|{color:red}*YES*{color}|\n");
            }

            if (vuln.getDescription() != null && !vuln.getDescription().isBlank()) {
                sb.append("\nh3. Description\n");
                sb.append(truncate(vuln.getDescription(), 4000)).append("\n");
            }
        }

        // Affected locations table
        sb.append("\nh3. Affected Locations\n");
        sb.append("||#||Severity||Source||Location||Branch||\n");
        int idx = 1;
        for (Finding f : findings) {
            String branch = f.getCodeRepoBranch() != null ? f.getCodeRepoBranch().getName() : "-";
            sb.append("|").append(idx++).append("|")
              .append(severityIcon(f.getSeverity().name())).append(" ").append(f.getSeverity())
              .append("|").append(f.getSource())
              .append("|{{").append(f.getLocation()).append("}}")
              .append("|").append(branch).append("|\n");
            if (idx > 50) {
                sb.append("|...|...and ").append(findings.size() - 50).append(" more|||||\n");
                break;
            }
        }

        // Recommendation
        if (first.getVulnerability() != null && first.getVulnerability().getRecommendation() != null
                && !first.getVulnerability().getRecommendation().isBlank()) {
            sb.append("\nh3. ").append((char) 9989).append(" Recommendation\n");
            sb.append(first.getVulnerability().getRecommendation()).append("\n");
        }

        sb.append("\n----\n_Ticket created automatically by Flow_\n");
        return sb.toString();
    }

    private String getHighestSeverity(List<Finding> findings) {
        return findings.stream()
                .map(f -> f.getSeverity().name())
                .min(Comparator.comparingInt(this::severityOrder))
                .orElse("MEDIUM");
    }

    private int severityOrder(String severity) {
        return switch (severity.toUpperCase()) {
            case "CRITICAL" -> 0;
            case "HIGH" -> 1;
            case "MEDIUM" -> 2;
            case "LOW" -> 3;
            case "INFO" -> 4;
            default -> 5;
        };
    }

    private String mapSeverityToJiraPriority(String severity) {
        return switch (severity.toUpperCase()) {
            case "CRITICAL" -> "Highest";
            case "HIGH" -> "High";
            case "MEDIUM" -> "Medium";
            case "LOW" -> "Low";
            case "INFO" -> "Lowest";
            default -> "Medium";
        };
    }

    private String severityIcon(String severity) {
        if (severity == null) return "(!)";
        return switch (severity.toUpperCase()) {
            case "CRITICAL" -> "(x)";
            case "HIGH" -> "(!)";
            case "MEDIUM" -> "(i)";
            case "LOW" -> "(?)";
            case "INFO" -> "(/)";
            default -> "(!)";
        };
    }

    /**
     * Detects the correct custom field ID for Epic Link.
     * Cloud uses "Epic Link" (customfield_10014 typically), Server uses customfield_10008 etc.
     * Falls back to "parent" field for next-gen projects.
     */
    @SuppressWarnings("unchecked")
    private String detectEpicLinkField(JiraConfiguration config) {
        try {
            String raw = webClient.get()
                    .uri(config.getJiraUrl() + "/rest/api/2/field")
                    .headers(h -> buildAuthHeaders(h, config))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (raw != null) {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                List<Map<String, Object>> fields = mapper.readValue(raw,
                        mapper.getTypeFactory().constructCollectionType(List.class, Map.class));
                for (Map<String, Object> field : fields) {
                    String name = (String) field.get("name");
                    if ("Epic Link".equalsIgnoreCase(name) || "Epic".equalsIgnoreCase(name)) {
                        String id = (String) field.get("id");
                        log.info("[JIRA] Detected epic link field: {} ({})", name, id);
                        return id;
                    }
                }
            }
        } catch (Exception e) {
            log.warn("[JIRA] Could not detect Epic Link field: {}", e.getMessage());
        }
        return "customfield_10014";
    }

    /**
     * Fetches epics from the configured JIRA project.
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, String>> fetchEpics(String jiraUrl, String jiraUsername, String jiraToken,
                                                 String projectKey, String authType) {
        String normalizedUrl = jiraUrl.endsWith("/") ? jiraUrl.substring(0, jiraUrl.length() - 1) : jiraUrl;
        String jql = "project=" + projectKey + " AND issuetype=Epic AND resolution=Unresolved ORDER BY created DESC";

        try {
            String raw = webClient.get()
                    .uri(normalizedUrl + "/rest/api/2/search?jql=" + URLEncoder.encode(jql, java.nio.charset.StandardCharsets.UTF_8) + "&maxResults=100&fields=summary,key")
                    .headers(h -> buildTempAuthHeaders(h, jiraUsername, jiraToken, authType))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (raw != null) {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                Map<String, Object> parsed = mapper.readValue(raw, Map.class);
                List<Map<String, Object>> issues = (List<Map<String, Object>>) parsed.get("issues");
                if (issues != null) {
                    return issues.stream().map(issue -> {
                        String key = (String) issue.get("key");
                        Map<String, Object> issueFields = (Map<String, Object>) issue.get("fields");
                        String summary = issueFields != null ? (String) issueFields.get("summary") : "";
                        return Map.of("key", key, "name", summary != null ? summary : "");
                    }).collect(Collectors.toList());
                }
            }
        } catch (Exception e) {
            log.warn("[JIRA] Error fetching epics for project {}: {}", projectKey, e.getMessage());
        }
        return List.of();
    }

    /**
     * Detects the subtask issue type name for the project.
     */
    @SuppressWarnings("unchecked")
    private String detectSubtaskTypeName(JiraConfiguration config) {
        try {
            String raw = webClient.get()
                    .uri(config.getJiraUrl() + "/rest/api/2/project/" + config.getJiraProjectKey())
                    .headers(h -> buildAuthHeaders(h, config))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (raw != null) {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                Map<String, Object> parsed = mapper.readValue(raw, Map.class);
                List<Map<String, Object>> issueTypes = (List<Map<String, Object>>) parsed.get("issueTypes");
                if (issueTypes != null) {
                    for (Map<String, Object> it : issueTypes) {
                        if (Boolean.TRUE.equals(it.get("subtask"))) {
                            return (String) it.get("name");
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.warn("[JIRA] Could not detect subtask type: {}", e.getMessage());
        }
        return "Sub-task";
    }

    private String truncate(String s, int max) {
        if (s == null) return "";
        return s.length() > max ? s.substring(0, max - 3) + "..." : s;
    }
}
