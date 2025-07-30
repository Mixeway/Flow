package io.mixeway.mixewayflowapi.integrations.repo.apiclient;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.integrations.repo.dto.CommentMessage;
import io.mixeway.mixewayflowapi.integrations.repo.dto.ImportCodeRepoResponseDto;
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
public class GitLabApiClientService {
    private final WebClient webClient;
    private static final String PROJECTS_API_PATH = "/api/v4/projects";

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
                .queryParam("membership", "true")
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


    public Mono<ImportCodeRepoResponseDto> getProjectInfo(Long id, String repoUrl, String accessToken) {
        String apiUrl = String.format("%s/api/v4/projects/%d", repoUrl, id);

        return webClient.get()
                .uri(apiUrl)
                .header("PRIVATE-TOKEN",  accessToken)
                .retrieve()
                .onStatus(status -> !status.is2xxSuccessful(), response -> Mono.error(new RuntimeException("Failed to fetch project info")))
                .bodyToMono(ImportCodeRepoResponseDto.class)
                .doOnError(throwable -> System.err.println("Error fetching project info: " + throwable.getMessage()));
    }

    public Mono<HashMap<String, Integer>> getProjectLanguages(int id, String repoUrl, String accessToken) {
        String apiUrl = String.format("%s/api/v4/projects/%d/languages", repoUrl, id);

        return webClient.get()
                .uri(apiUrl)
                .header("PRIVATE-TOKEN",  accessToken)
                .retrieve()
                .onStatus(status -> !status.is2xxSuccessful(), response -> Mono.error(new RuntimeException("Failed to fetch project info")))
                .bodyToMono(new ParameterizedTypeReference<HashMap<String, Double>>() {})
                .map(this::convertToIntegerMap)
                .doOnError(throwable -> System.err.println("Error fetching project info: " + throwable.getMessage()));
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
