package io.mixeway.mixewayflowapi.integrations.repo.apiclient;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.integrations.repo.dto.CommentMessage;
import io.mixeway.mixewayflowapi.integrations.repo.dto.ImportCodeRepoGiteaResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class GiteaApiClientService {
    private final WebClient webClient;

    /**
     * Fetches all accessible repositories from Gitea using Flux.expand for robust pagination.
     * Gitea API uses /api/v1/user/repos for authenticated user repositories.
     * @param repoUrl The base URL of the Gitea instance (e.g., https://gitea.example.com).
     * @param accessToken The personal access token.
     * @return A Flux emitting all found repositories across all pages.
     */
    public Flux<ImportCodeRepoGiteaResponseDto> fetchAllRepositories(String repoUrl, String accessToken) {
        // Build the initial URI for the first page of results.
        String initialUri = UriComponentsBuilder.fromHttpUrl(repoUrl)
                .path("/api/v1/user/repos")
                .queryParam("limit", 50)
                .queryParam("page", 1)
                .toUriString();

        // Use Flux.expand to recursively fetch pages until there are no more.
        return fetchGiteaPage(initialUri, accessToken)
                .expand(response -> {
                    // Gitea returns pagination info in Link header (similar to GitHub)
                    List<ImportCodeRepoGiteaResponseDto> repos = response.getBody();
                    if (repos != null && !repos.isEmpty()) {
                        // Extract page number from current URI and increment
                        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromUriString(initialUri);
                        String currentPageStr = uriBuilder.build().getQueryParams().getFirst("page");
                        int currentPage = currentPageStr != null ? Integer.parseInt(currentPageStr) : 1;
                        
                        // Check if there are more pages (if we got a full page, there might be more)
                        if (repos.size() == 50) {
                            String nextUri = UriComponentsBuilder.fromUriString(initialUri)
                                    .replaceQueryParam("page", currentPage + 1)
                                    .toUriString();
                            return fetchGiteaPage(nextUri, accessToken);
                        }
                    }
                    // If there's no next page, return an empty Mono to terminate the expansion.
                    return Mono.empty();
                })
                // Extract the body (the list of repositories) from each response.
                .flatMap(response -> Flux.fromIterable(response.getBody()))
                .doOnError(error -> log.error("Failed to fetch all Gitea repositories.", error));
    }

    /**
     * Helper method to fetch a single page of repositories.
     * @return A Mono emitting the ResponseEntity which includes headers and the body.
     */
    private Mono<ResponseEntity<List<ImportCodeRepoGiteaResponseDto>>> fetchGiteaPage(String uri, String accessToken) {
        return webClient.get()
                .uri(uri)
                .header("Authorization", "token " + accessToken)
                .retrieve()
                .toEntityList(ImportCodeRepoGiteaResponseDto.class)
                .doOnError(error -> log.error("Error fetching Gitea repositories page from URI {}: {}", uri, error.getMessage()));
    }

    public Mono<ImportCodeRepoGiteaResponseDto> getProjectInfo(String ownerRepoPath, String repoUrl, String accessToken) {
        // Gitea API uses owner/repo path format, not ID
        // Split by / and use path segments to properly encode each part
        String[] parts = ownerRepoPath.split("/", 2);
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(repoUrl)
                .pathSegment("api", "v1", "repos");
        
        if (parts.length == 2) {
            // Add owner and repo as separate path segments
            uriBuilder.pathSegment(parts[0], parts[1]);
        } else {
            // Fallback if path doesn't contain /
            uriBuilder.pathSegment(ownerRepoPath);
        }
        
        String apiUrl = uriBuilder.toUriString();

        return webClient.get()
                .uri(apiUrl)
                .header("Authorization", "token " + accessToken)
                .retrieve()
                .onStatus(status -> !status.is2xxSuccessful(), response -> Mono.error(new RuntimeException("Failed to fetch repository info")))
                .bodyToMono(ImportCodeRepoGiteaResponseDto.class)
                .doOnError(throwable -> System.err.println("Error fetching repository info: " + throwable.getMessage()));
    }

    public Mono<HashMap<String, Integer>> getProjectLanguages(String ownerRepoPath, String repoUrl, String accessToken) {
        // Gitea API uses owner/repo path format, not ID
        // Split by / and use path segments to properly encode each part
        String[] parts = ownerRepoPath.split("/", 2);
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(repoUrl)
                .pathSegment("api", "v1", "repos");
        
        if (parts.length == 2) {
            // Add owner and repo as separate path segments
            uriBuilder.pathSegment(parts[0], parts[1], "languages");
        } else {
            // Fallback if path doesn't contain /
            uriBuilder.pathSegment(ownerRepoPath, "languages");
        }
        
        String apiUrl = uriBuilder.toUriString();

        return webClient.get()
                .uri(apiUrl)
                .header("Authorization", "token " + accessToken)
                .retrieve()
                .onStatus(status -> !status.is2xxSuccessful(), response -> Mono.error(new RuntimeException("Failed to fetch repository languages")))
                .bodyToMono(new ParameterizedTypeReference<HashMap<String, Double>>() {})
                .map(this::convertToIntegerMap)
                .doOnError(throwable -> System.err.println("Error fetching repository languages: " + throwable.getMessage()));
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
        String apiUrl = String.format("%s://%s/api/v1/repos/%s/pulls/%d/comments",
                repoUrlHost.getProtocol(), repoUrlHost.getHost(), codeRepo.getName(), iid);

        // Create a new CommentMessage object and set the comment body
        CommentMessage commentMessage = new CommentMessage();
        commentMessage.setBody(comment);

        // Use the WebClient to send the POST request
        return webClient.post()
                .uri(apiUrl)
                .header("Authorization", "token " + codeRepo.getAccessToken())
                .bodyValue(commentMessage)
                .retrieve()
                .onStatus(status -> !status.is2xxSuccessful(), response -> {
                    // Log a warning if the response status is not 2xx
                    log.warn("Failed to post comment on pull request. Status: {}", response.statusCode());
                    return Mono.error(new RuntimeException("Failed to post comment on pull request"));
                })
                .bodyToMono(String.class)  // We're not interested in the body, but we need to return a Mono<String>
                .doOnSuccess(response -> log.info("Comment posted successfully on pull request: " + iid))
                .doOnError(throwable -> log.warn("Error posting comment: " + throwable.getMessage()));
    }
}

