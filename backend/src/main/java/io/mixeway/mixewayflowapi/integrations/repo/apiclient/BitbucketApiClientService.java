package io.mixeway.mixewayflowapi.integrations.repo.apiclient;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.integrations.repo.dto.ImportCodeRepoBitbucketResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.net.MalformedURLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Log4j2
@RequiredArgsConstructor
public class BitbucketApiClientService {
    private final WebClient webClient;

    public static final String FLOW_SECURITY_BUILD_KEY = "io.mixeway.flow.security";

    /**
     * Returns true when {@code url} points to a self-hosted Bitbucket Server / Data Center
     * instance rather than the Bitbucket Cloud SaaS offering.
     */
    private boolean isOnPremise(String url) {
        return url != null && !url.contains("bitbucket.org");
    }

    /**
     * Posts a commit build status (Bitbucket Cloud: REST 2.0; Server/Data Center: build-status REST).
     * {@code state} must match the provider API (e.g. SUCCESSFUL, FAILED, INPROGRESS, STOPPED on Cloud).
     */
    public Mono<Void> postCommitBuildStatus(CodeRepo codeRepo, String commitHash, String state, String description, String reportUrl) {
        if (commitHash == null || commitHash.isBlank()) {
            return Mono.empty();
        }
        String hostUrl;
        try {
            hostUrl = codeRepo.getGitHostUrl();
        } catch (MalformedURLException e) {
            return Mono.error(new IllegalStateException("Invalid repository URL", e));
        }
        if (isOnPremise(hostUrl)) {
            return postServerCommitBuildStatus(hostUrl.replaceAll("/$", ""), codeRepo.getAccessToken(), commitHash, state, description, reportUrl);
        }
        String[] nameParts = codeRepo.getName().split("/", 2);
        if (nameParts.length < 2) {
            return Mono.error(new IllegalArgumentException("Invalid Bitbucket repository path: " + codeRepo.getName()));
        }
        String apiRoot = normalizeToApiUrl(hostUrl).replaceAll("/$", "");
        String repoPath = UriComponentsBuilder.fromHttpUrl(apiRoot)
                .pathSegment("2.0", "repositories", nameParts[0], nameParts[1], "commit", commitHash, "statuses", "build")
                .build()
                .toUriString();

        Map<String, Object> body = new HashMap<>();
        body.put("state", state);
        body.put("key", FLOW_SECURITY_BUILD_KEY);
        body.put("name", "Flow Security");
        body.put("description", description != null ? description : "");
        if (reportUrl != null && !reportUrl.isBlank()) {
            body.put("url", reportUrl);
        }

        return webClient.post()
                .uri(repoPath)
                .header("Authorization", "Bearer " + codeRepo.getAccessToken())
                .bodyValue(body)
                .retrieve()
                .onStatus(status -> !status.is2xxSuccessful(), response -> {
                    log.warn("Failed to post Bitbucket Cloud commit status. Status: {}", response.statusCode());
                    return Mono.error(new RuntimeException("Failed to post Bitbucket commit status"));
                })
                .toBodilessEntity()
                .doOnSuccess(r -> log.info("Posted Flow Security commit status on Bitbucket Cloud for commit {}", commitHash))
                .doOnError(e -> log.warn("Error posting Bitbucket Cloud commit status: {}", e.getMessage()))
                .then();
    }

    private Mono<Void> postServerCommitBuildStatus(String baseUrl, String accessToken, String commitHash, String state, String description, String reportUrl) {
        String url = baseUrl + "/rest/build-status/1.0/commits/" + commitHash;

        Map<String, Object> body = new HashMap<>();
        body.put("key", FLOW_SECURITY_BUILD_KEY);
        body.put("state", state);
        body.put("name", "Flow Security");
        body.put("description", description != null ? description : "");
        if (reportUrl != null && !reportUrl.isBlank()) {
            body.put("url", reportUrl);
        }

        return webClient.post()
                .uri(url)
                .header("Authorization", "Bearer " + accessToken)
                .bodyValue(body)
                .retrieve()
                .onStatus(status -> !status.is2xxSuccessful(), response -> {
                    log.warn("Failed to post Bitbucket Server commit status. Status: {}", response.statusCode());
                    return Mono.error(new RuntimeException("Failed to post Bitbucket Server commit status"));
                })
                .toBodilessEntity()
                .doOnSuccess(r -> log.info("Posted Flow Security commit status on Bitbucket Server for commit {}", commitHash))
                .doOnError(e -> log.warn("Error posting Bitbucket Server commit status: {}", e.getMessage()))
                .then();
    }

    // -------------------------------------------------------------------------
    // Fetch all repositories
    // -------------------------------------------------------------------------

    /**
     * Fetches all accessible repositories.
     * <ul>
     *   <li>Cloud (bitbucket.org): API v2.0, paginated via {@code next} URL.</li>
     *   <li>Server / DC: REST API 1.0, paginated via {@code isLastPage} / {@code nextPageStart}.</li>
     * </ul>
     */
    public Flux<ImportCodeRepoBitbucketResponseDto> fetchAllRepositories(String repoUrl, String accessToken) {
        if (isOnPremise(repoUrl)) {
            String initialUri = repoUrl.replaceAll("/$", "") + "/rest/api/1.0/repos?limit=100&start=0";
            return fetchBitbucketServerPage(initialUri, repoUrl, accessToken);
        }
        String initialUri = UriComponentsBuilder.fromHttpUrl(normalizeToApiUrl(repoUrl))
                .path("/2.0/repositories")
                .queryParam("role", "member")
                .queryParam("pagelen", 100)
                .toUriString();
        return fetchBitbucketCloudPage(initialUri, accessToken);
    }

    // --- Cloud pagination ---

    private Flux<ImportCodeRepoBitbucketResponseDto> fetchBitbucketCloudPage(String uri, String accessToken) {
        return webClient.get()
                .uri(uri)
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .flatMapMany(response -> {
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> values = (List<Map<String, Object>>) response.get("values");
                    String nextUrl = (String) response.get("next");

                    Flux<ImportCodeRepoBitbucketResponseDto> currentPage = Flux.empty();
                    if (values != null) {
                        currentPage = Flux.fromIterable(values).map(this::mapCloudRepoToDto);
                    }
                    if (nextUrl != null && !nextUrl.isEmpty()) {
                        return Flux.concat(currentPage, fetchBitbucketCloudPage(nextUrl, accessToken));
                    }
                    return currentPage;
                })
                .doOnError(error -> log.error("Error fetching Bitbucket Cloud repos from {}: {}", uri, error.getMessage()));
    }

    // --- Server / DC pagination ---

    private Flux<ImportCodeRepoBitbucketResponseDto> fetchBitbucketServerPage(String uri, String baseUrl, String accessToken) {
        return webClient.get()
                .uri(uri)
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .flatMapMany(response -> {
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> values = (List<Map<String, Object>>) response.get("values");
                    Boolean isLastPage = (Boolean) response.get("isLastPage");
                    Object nextPageStartObj = response.get("nextPageStart");

                    Flux<ImportCodeRepoBitbucketResponseDto> currentPage = Flux.empty();
                    if (values != null) {
                        currentPage = Flux.fromIterable(values).map(r -> mapServerRepoToDto(r, null));
                    }
                    if (Boolean.FALSE.equals(isLastPage) && nextPageStartObj != null) {
                        String nextUri = baseUrl.replaceAll("/$", "") + "/rest/api/1.0/repos?limit=100&start=" + nextPageStartObj;
                        return Flux.concat(currentPage, fetchBitbucketServerPage(nextUri, baseUrl, accessToken));
                    }
                    return currentPage;
                })
                .doOnError(error -> log.error("Error fetching Bitbucket Server repos from {}: {}", uri, error.getMessage()));
    }

    // -------------------------------------------------------------------------
    // Map raw API responses to DTO
    // -------------------------------------------------------------------------

    @SuppressWarnings("unchecked")
    private ImportCodeRepoBitbucketResponseDto mapCloudRepoToDto(Map<String, Object> repoMap) {
        ImportCodeRepoBitbucketResponseDto dto = new ImportCodeRepoBitbucketResponseDto();
        dto.setUuid((String) repoMap.get("uuid"));
        dto.setDescription((String) repoMap.get("description"));
        dto.setLanguage((String) repoMap.get("language"));
        dto.setFullName((String) repoMap.get("full_name"));
        dto.setName((String) repoMap.get("name"));
        dto.setSlug((String) repoMap.get("slug"));

        Map<String, Object> links = (Map<String, Object>) repoMap.get("links");
        if (links != null) {
            Map<String, Object> html = (Map<String, Object>) links.get("html");
            if (html != null) {
                ImportCodeRepoBitbucketResponseDto.LinksDto linksDto = new ImportCodeRepoBitbucketResponseDto.LinksDto();
                ImportCodeRepoBitbucketResponseDto.HrefDto hrefDto = new ImportCodeRepoBitbucketResponseDto.HrefDto();
                hrefDto.setHref((String) html.get("href"));
                linksDto.setHtml(hrefDto);
                dto.setLinks(linksDto);
            }
        }

        Map<String, Object> mainbranch = (Map<String, Object>) repoMap.get("mainbranch");
        if (mainbranch != null) {
            ImportCodeRepoBitbucketResponseDto.MainbranchDto mainbranchDto = new ImportCodeRepoBitbucketResponseDto.MainbranchDto();
            mainbranchDto.setName((String) mainbranch.get("name"));
            mainbranchDto.setType((String) mainbranch.get("type"));
            dto.setMainbranch(mainbranchDto);
        }
        return dto;
    }

    /**
     * Maps a Bitbucket Server REST API 1.0 repository object.
     * The HTTPS clone URL is stored as the "web URL" so that it can be used for git
     * operations and for deduplication (stored as {@code CodeRepo.repourl}).
     *
     * @param repoMap       raw JSON map from the Server API
     * @param defaultBranch pre-resolved default branch name, or {@code null} to use "master"
     */
    @SuppressWarnings("unchecked")
    private ImportCodeRepoBitbucketResponseDto mapServerRepoToDto(Map<String, Object> repoMap, String defaultBranch) {
        ImportCodeRepoBitbucketResponseDto dto = new ImportCodeRepoBitbucketResponseDto();

        Object idObj = repoMap.get("id");
        dto.setUuid(idObj != null ? String.valueOf(idObj) : null);
        dto.setDescription((String) repoMap.get("description"));
        dto.setName((String) repoMap.get("slug"));
        dto.setSlug((String) repoMap.get("slug"));

        Map<String, Object> project = (Map<String, Object>) repoMap.get("project");
        String projectKey = project != null ? (String) project.get("key") : "";
        dto.setFullName(projectKey + "/" + repoMap.get("slug"));

        // Find HTTPS clone URL from links.clone[]
        String cloneUrl = extractHttpsCloneUrl(repoMap);
        if (cloneUrl != null) {
            ImportCodeRepoBitbucketResponseDto.LinksDto linksDto = new ImportCodeRepoBitbucketResponseDto.LinksDto();
            ImportCodeRepoBitbucketResponseDto.HrefDto hrefDto = new ImportCodeRepoBitbucketResponseDto.HrefDto();
            hrefDto.setHref(cloneUrl);
            linksDto.setHtml(hrefDto);
            dto.setLinks(linksDto);
        }

        if (defaultBranch != null) {
            ImportCodeRepoBitbucketResponseDto.MainbranchDto mainbranchDto = new ImportCodeRepoBitbucketResponseDto.MainbranchDto();
            mainbranchDto.setName(defaultBranch);
            mainbranchDto.setType("branch");
            dto.setMainbranch(mainbranchDto);
        }
        return dto;
    }

    @SuppressWarnings("unchecked")
    private String extractHttpsCloneUrl(Map<String, Object> repoMap) {
        Map<String, Object> links = (Map<String, Object>) repoMap.get("links");
        if (links == null) return null;
        List<Map<String, Object>> cloneLinks = (List<Map<String, Object>>) links.get("clone");
        if (cloneLinks == null) return null;
        for (Map<String, Object> link : cloneLinks) {
            String name = (String) link.get("name");
            if ("http".equals(name) || "https".equals(name)) {
                return (String) link.get("href");
            }
        }
        return null;
    }

    // -------------------------------------------------------------------------
    // Get single project info
    // -------------------------------------------------------------------------

    public Mono<ImportCodeRepoBitbucketResponseDto> getProjectInfo(String fullName, String repoUrl, String accessToken) {
        String[] parts = fullName.split("/", 2);
        if (parts.length < 2) {
            return Mono.error(new IllegalArgumentException("Invalid Bitbucket repository path: " + fullName));
        }

        if (isOnPremise(repoUrl)) {
            return getServerProjectInfo(repoUrl, parts[0], parts[1], accessToken);
        }

        String apiUrl = UriComponentsBuilder.fromHttpUrl(normalizeToApiUrl(repoUrl))
                .pathSegment("2.0", "repositories", parts[0], parts[1])
                .toUriString();

        return webClient.get()
                .uri(apiUrl)
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .onStatus(status -> !status.is2xxSuccessful(), response ->
                        Mono.error(new RuntimeException("Failed to fetch Bitbucket repository info")))
                .bodyToMono(ImportCodeRepoBitbucketResponseDto.class)
                .doOnError(throwable -> log.error("Error fetching Bitbucket Cloud repository info: {}", throwable.getMessage()));
    }

    private Mono<ImportCodeRepoBitbucketResponseDto> getServerProjectInfo(String baseUrl, String projectKey, String slug, String accessToken) {
        String normalized = baseUrl.replaceAll("/$", "");
        String projectInfoUrl = normalized + "/rest/api/1.0/projects/" + projectKey + "/repos/" + slug;
        String defaultBranchUrl = projectInfoUrl + "/branches/default";

        Mono<Map<String, Object>> repoMono = webClient.get()
                .uri(projectInfoUrl)
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .onStatus(status -> !status.is2xxSuccessful(), response ->
                        Mono.error(new RuntimeException("Failed to fetch Bitbucket Server repository info from " + projectInfoUrl)))
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .doOnError(e -> log.error("Error fetching Bitbucket Server repo info: {}", e.getMessage()));

        Mono<String> defaultBranchMono = webClient.get()
                .uri(defaultBranchUrl)
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .map(b -> (String) b.getOrDefault("displayId", "master"))
                .onErrorReturn("master");

        return Mono.zip(repoMono, defaultBranchMono)
                .map(tuple -> mapServerRepoToDto(tuple.getT1(), tuple.getT2()));
    }

    // -------------------------------------------------------------------------
    // Languages
    // -------------------------------------------------------------------------

    /**
     * Bitbucket Cloud exposes a primary language field on the repo.
     * Bitbucket Server has no equivalent — return an empty map in that case.
     */
    public Mono<HashMap<String, Integer>> getProjectLanguages(String fullName, String repoUrl, String accessToken) {
        if (isOnPremise(repoUrl)) {
            return Mono.just(new HashMap<>());
        }
        String apiUrl = normalizeToApiUrl(repoUrl);
        return getProjectInfo(fullName, apiUrl, accessToken)
                .map(dto -> {
                    HashMap<String, Integer> languages = new HashMap<>();
                    if (dto.getLanguage() != null && !dto.getLanguage().isEmpty()) {
                        languages.put(dto.getLanguage(), 100);
                    }
                    return languages;
                })
                .doOnError(throwable -> log.error("Error fetching Bitbucket repository languages: {}", throwable.getMessage()));
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private String normalizeToApiUrl(String url) {
        if (url != null && url.contains("bitbucket.org") && !url.contains("api.bitbucket.org")) {
            return url.replace("bitbucket.org", "api.bitbucket.org");
        }
        return url;
    }

    // -------------------------------------------------------------------------
    // Pull request comments (Cloud + Server)
    // -------------------------------------------------------------------------

    public Mono<String> commentPullRequest(CodeRepo codeRepo, Long prId, String comment) {
        String hostUrl;
        try {
            hostUrl = codeRepo.getGitHostUrl();
        } catch (MalformedURLException e) {
            return Mono.error(new IllegalStateException("Invalid repository URL", e));
        }

        boolean onPremise = isOnPremise(hostUrl);
        String apiUrl;
        if (onPremise) {
            String[] parts = codeRepo.getName().split("/", 2);
            if (parts.length < 2) {
                return Mono.error(new IllegalArgumentException("Invalid Bitbucket repository path: " + codeRepo.getName()));
            }
            apiUrl = hostUrl.replaceAll("/$", "")
                    + "/rest/api/1.0/projects/" + parts[0] + "/repos/" + parts[1]
                    + "/pull-requests/" + prId + "/comments";
        } else {
            String[] cloudParts = codeRepo.getName().split("/", 2);
            if (cloudParts.length < 2) {
                return Mono.error(new IllegalArgumentException("Invalid Bitbucket repository path: " + codeRepo.getName()));
            }
            String apiRoot = normalizeToApiUrl(hostUrl).replaceAll("/$", "");
            apiUrl = UriComponentsBuilder.fromHttpUrl(apiRoot)
                    .pathSegment("2.0", "repositories", cloudParts[0], cloudParts[1], "pullrequests", String.valueOf(prId), "comments")
                    .build()
                    .toUriString();
        }

        Map<String, Object> body = new HashMap<>();
        if (onPremise) {
            body.put("text", comment);
        } else {
            Map<String, String> content = new HashMap<>();
            content.put("raw", comment);
            body.put("content", content);
        }

        return webClient.post()
                .uri(apiUrl)
                .header("Authorization", "Bearer " + codeRepo.getAccessToken())
                .bodyValue(body)
                .retrieve()
                .onStatus(status -> !status.is2xxSuccessful(), response -> {
                    log.warn("Failed to post comment on Bitbucket pull request. Status: {}", response.statusCode());
                    return Mono.error(new RuntimeException("Failed to post comment on Bitbucket pull request"));
                })
                .bodyToMono(String.class)
                .doOnSuccess(response -> log.info("Comment posted successfully on Bitbucket pull request: {}", prId))
                .doOnError(throwable -> log.warn("Error posting Bitbucket comment: {}", throwable.getMessage()));
    }
}
