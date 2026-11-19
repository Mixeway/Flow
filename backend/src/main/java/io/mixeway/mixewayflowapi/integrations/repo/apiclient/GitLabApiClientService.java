package io.mixeway.mixewayflowapi.integrations.repo.apiclient;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.integrations.repo.dto.CommentMessage;
import io.mixeway.mixewayflowapi.integrations.repo.dto.ImportCodeRepoResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.net.MalformedURLException;
import java.net.URI;
import java.net.URL;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class GitLabApiClientService {
    private final WebClient webClient;
    private static final String PROJECTS_API_PATH = "/api/v4/projects";
    private static final int PROJECT_PAGE_SIZE = 100;
    private static final int MAX_PROJECT_PAGES = 2_000;
    private static final Duration PROJECT_PAGE_TIMEOUT = Duration.ofSeconds(120);
    private static final Pattern NEXT_LINK = Pattern.compile("<([^>]+)>;\\s*rel=\"next\"");

    /**
     * Fetches all accessible projects from GitLab using Flux.expand for robust pagination.
     * @param repoUrl The base URL of the GitLab instance (e.g., https://gitlab.com).
     * @param accessToken The personal access token.
     * @return A Flux emitting all found projects across all pages.
     */
    public Flux<ImportCodeRepoResponseDto> fetchAllProjects(String repoUrl, String accessToken) {
        // Build the initial URI for the first page of results.
        String initialUri = UriComponentsBuilder.fromHttpUrl(repoUrl)
                .path(PROJECTS_API_PATH)
                .queryParam("per_page", 100)
                .toUriString();

        // Use Flux.expand to recursively fetch pages until there are no more.
        return fetchGitLabPage(initialUri, accessToken)
                .expand(response -> {
                    // Get the 'X-Next-Page' header from the response.
                    String nextPage = response.getHeaders().getFirst("X-Next-Page");
                    // If the header exists and is not empty, fetch the next page.
                    if (nextPage != null && !nextPage.isEmpty()) {
                        String nextUri = UriComponentsBuilder.fromUriString(initialUri)
                                .replaceQueryParam("page", nextPage)
                                .toUriString();
                        return fetchGitLabPage(nextUri, accessToken);
                    }
                    // If there's no next page, return an empty Mono to terminate the expansion.
                    return Mono.empty();
                })
                // Extract the body (the list of projects) from each response.
                .flatMap(response -> Flux.fromIterable(response.getBody()))
                .doOnError(error -> log.error("Failed to fetch all GitLab projects.", error));
    }


    /**
     * Helper method to fetch a single page of projects.
     * @return A Mono emitting the ResponseEntity which includes headers and the body.
     */
    private Mono<ResponseEntity<List<ImportCodeRepoResponseDto>>> fetchGitLabPage(String uri, String accessToken) {
        return webClient.get()
                .uri(uri)
                .header("PRIVATE-TOKEN", accessToken)
                .retrieve()
                .toEntityList(ImportCodeRepoResponseDto.class)
                .doOnError(error -> log.error("Error fetching GitLab projects page from URI {}: {}", uri, error.getMessage()));
    }

    /**
     * Loads every project visible to {@code accessToken} with keyset pagination (100 per request).
     * Ten thousand repositories cost about a hundred calls instead of one call each.
     * Active and archived projects are both collected. {@code beforeEachRequest} runs before every page
     * so the caller can keep the call rate under GitLab.com limits.
     */
    public Map<Integer, ImportCodeRepoResponseDto> listProjectsForMetadata(String repoUrl, String accessToken,
                                                                            Runnable beforeEachRequest) {
        Map<Integer, ImportCodeRepoResponseDto> projects = new HashMap<>();
        int pages = collectProjectPages(repoUrl, accessToken, false, projects, beforeEachRequest);
        try {
            pages += collectProjectPages(repoUrl, accessToken, true, projects, beforeEachRequest);
        } catch (GitLabApiException exception) {
            if (exception.status() != 400) {
                throw exception;
            }
            log.warn("GitLab archived project list returned HTTP 400 for {}. Continuing with active projects.", repoUrl);
        }
        log.info("Listed {} GitLab projects from {} in {} pages", projects.size(), repoUrl, pages);
        return projects;
    }

    private int collectProjectPages(String repoUrl, String accessToken, boolean archived,
                                    Map<Integer, ImportCodeRepoResponseDto> projects, Runnable beforeEachRequest) {
        String pageUrl = UriComponentsBuilder.fromHttpUrl(trimTrailingSlash(repoUrl))
                .path(PROJECTS_API_PATH)
                .queryParam("pagination", "keyset")
                .queryParam("per_page", PROJECT_PAGE_SIZE)
                .queryParam("order_by", "id")
                .queryParam("sort", "asc")
                .queryParam("archived", archived)
                .toUriString();
        int pages = 0;
        while (pageUrl != null) {
            if (pages >= MAX_PROJECT_PAGES) {
                throw new GitLabApiException(0, 0);
            }
            beforeEachRequest.run();
            ProjectPage page = fetchProjectPageWithRetry(pageUrl, accessToken);
            pages++;
            if (page.projects() != null) {
                for (ImportCodeRepoResponseDto project : page.projects()) {
                    projects.put(project.getId(), project);
                }
            }
            String nextUrl = page.nextUrl();
            if (nextUrl == null || nextUrl.equals(pageUrl)) {
                break;
            }
            pageUrl = nextUrl;
        }
        return pages;
    }

    private ProjectPage fetchProjectPageWithRetry(String pageUrl, String accessToken) {
        while (true) {
            try {
                return fetchProjectPage(pageUrl, accessToken);
            } catch (GitLabApiException exception) {
                if (!exception.isRateLimited()) {
                    throw exception;
                }
                log.warn("GitLab project list rate limited. Waiting {}s, then continuing the same sync.",
                        exception.retryAfterSeconds());
                sleepBeforeRetry(exception.retryAfterSeconds());
            }
        }
    }

    private ProjectPage fetchProjectPage(String pageUrl, String accessToken) {
        ResponseEntity<List<ImportCodeRepoResponseDto>> response = webClient.get()
                .uri(URI.create(pageUrl))
                .header("PRIVATE-TOKEN", accessToken)
                .retrieve()
                .onStatus(status -> !status.is2xxSuccessful(), clientResponse -> {
                    int status = clientResponse.statusCode().value();
                    long retryAfter = status == 429
                            ? retryAfterSeconds(clientResponse.headers().asHttpHeaders().getFirst(HttpHeaders.RETRY_AFTER))
                            : 0;
                    return clientResponse.bodyToMono(String.class)
                            .defaultIfEmpty("")
                            .then(Mono.error(new GitLabApiException(status, retryAfter)));
                })
                .toEntityList(ImportCodeRepoResponseDto.class)
                .block(PROJECT_PAGE_TIMEOUT);
        if (response == null) {
            return new ProjectPage(List.of(), null);
        }
        List<ImportCodeRepoResponseDto> body = response.getBody() == null
                ? List.of()
                : new ArrayList<>(response.getBody());
        return new ProjectPage(body, nextPageUrl(response.getHeaders().getFirst(HttpHeaders.LINK)));
    }

    static String nextPageUrl(String linkHeader) {
        if (linkHeader == null || linkHeader.isBlank()) {
            return null;
        }
        Matcher matcher = NEXT_LINK.matcher(linkHeader);
        if (!matcher.find()) {
            return null;
        }
        return matcher.group(1);
    }

    static long retryAfterSeconds(String header) {
        if (header == null || header.isBlank()) {
            return 60;
        }
        try {
            long seconds = Long.parseLong(header.trim());
            if (seconds < 1) {
                return 1;
            }
            return Math.min(seconds, 3600);
        } catch (NumberFormatException ignored) {
            return 60;
        }
    }

    private static void sleepBeforeRetry(long seconds) {
        try {
            Thread.sleep(seconds * 1000L);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("interrupted", exception);
        }
    }

    private static String trimTrailingSlash(String url) {
        String trimmed = url == null ? "" : url.trim();
        while (trimmed.endsWith("/")) {
            trimmed = trimmed.substring(0, trimmed.length() - 1);
        }
        return trimmed;
    }

    private record ProjectPage(List<ImportCodeRepoResponseDto> projects, String nextUrl) {}


    public Mono<ImportCodeRepoResponseDto> getProjectInfo(Long id, String repoUrl, String accessToken) {
        String apiUrl = String.format("%s/api/v4/projects/%d", repoUrl, id);

        return webClient.get()
                .uri(apiUrl)
                .header("PRIVATE-TOKEN",  accessToken)
                .retrieve()
                .onStatus(status -> !status.is2xxSuccessful(),
                        response -> RepoApiErrorHandler.failedToFetch("GitLab", "project info", apiUrl, response))
                .bodyToMono(ImportCodeRepoResponseDto.class);
    }

    public Mono<HashMap<String, Integer>> getProjectLanguages(int id, String repoUrl, String accessToken) {
        String apiUrl = String.format("%s/api/v4/projects/%d/languages", repoUrl, id);

        return webClient.get()
                .uri(apiUrl)
                .header("PRIVATE-TOKEN",  accessToken)
                .retrieve()
                .onStatus(status -> !status.is2xxSuccessful(),
                        response -> RepoApiErrorHandler.failedToFetch("GitLab", "project languages", apiUrl, response))
                .bodyToMono(new ParameterizedTypeReference<HashMap<String, Double>>() {})
                .map(this::convertToIntegerMap);
    }

    private HashMap<String, Integer> convertToIntegerMap(HashMap<String, Double> doubleMap) {
        return doubleMap.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> (int) Math.floor(entry.getValue()), // round down
                        (e1, e2) -> e1,
                        HashMap::new
                ));
    }

    public Mono<String> commentMergeRequest(CodeRepo codeRepo, Long iid, String comment) throws MalformedURLException {
        // Construct the URL for the API endpoint
        URL repoUrlHost = new URL(codeRepo.getRepourl());
        String apiUrl = String.format("%s://%s/api/v4/projects/%d/merge_requests/%d/notes",
                repoUrlHost.getProtocol(), repoUrlHost.getHost(), codeRepo.getRemoteId(), iid);

        // Create a new CommentMessage object and set the comment body
        CommentMessage commentMessage = new CommentMessage();
        commentMessage.setBody(comment);

        // Use the WebClient to send the POST request
        return webClient.post()
                .uri(apiUrl)
                .header("PRIVATE-TOKEN", codeRepo.getAccessToken())  // Assuming the access token is in CodeRepo object
                .bodyValue(commentMessage)
                .retrieve()
                .onStatus(status -> !status.is2xxSuccessful(), response -> {
                    // Log a warning if the response status is not 2xx
                    log.warn("Failed to post comment on merge request. Status: {}", response.statusCode());
                    return Mono.error(new RuntimeException("Failed to post comment on merge request"));
                })
                .bodyToMono(String.class)  // We're not interested in the body, but we need to return a Mono<String>
                .doOnSuccess(response -> log.info("Comment posted successfully on merge request: " + iid))
                .doOnError(throwable -> log.warn("Error posting comment: " + throwable.getMessage()));
    }

}
