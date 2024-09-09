package io.mixeway.mixewayflowapi.integrations.repo.apiclient;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.integrations.repo.dto.CommentMessage;
import io.mixeway.mixewayflowapi.integrations.repo.dto.ImportCodeRepoResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class GitLabApiClientService {
    private final WebClient webClient;

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
