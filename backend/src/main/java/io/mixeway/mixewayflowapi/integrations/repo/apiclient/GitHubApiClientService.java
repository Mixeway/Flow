package io.mixeway.mixewayflowapi.integrations.repo.apiclient;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.integrations.repo.dto.CommentMessage;
import io.mixeway.mixewayflowapi.integrations.repo.dto.ImportCodeRepoGitHubResponseDto;
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
public class GitHubApiClientService {
    private final WebClient webClient;

    public Mono<ImportCodeRepoGitHubResponseDto> getProjectInfo(String name, String repoUrl, String accessToken) {
        String apiUrl = String.format("%s/repos/%s", repoUrl, name);

        return webClient.get()
                .uri(apiUrl)
                .header("Authorization",  "token " + accessToken)
                .retrieve()
                .onStatus(status -> !status.is2xxSuccessful(), response -> Mono.error(new RuntimeException("Failed to fetch project info")))
                .bodyToMono(ImportCodeRepoGitHubResponseDto.class)
                .doOnError(throwable -> System.err.println("Error fetching project info: " + throwable.getMessage()));
    }

    public Mono<HashMap<String, Integer>> getProjectLanguages(String name, String repoUrl, String accessToken) {
        String apiUrl = String.format("%s/repos/%s/languages", repoUrl.replace("https://github.com","https://api.github.com"), name);

        return webClient.get()
                .uri(apiUrl)
                .header("Authorization", "token " + accessToken)
                .retrieve()
                .onStatus(status -> !status.is2xxSuccessful(), response -> Mono.error(new RuntimeException("Failed to fetch project info")))
                .bodyToMono(new ParameterizedTypeReference<HashMap<String, Double>>() {})
                .map(this::calculateLanguagePercentages)
                .doOnError(throwable -> System.err.println("Error fetching project info: " + throwable.getMessage()));
    }

    private HashMap<String, Integer> calculateLanguagePercentages(HashMap<String, Double> languageData) {
        double totalLines = languageData.values().stream().mapToDouble(Double::doubleValue).sum();

        HashMap<String, Integer> languagePercentages = new HashMap<>();
        for (Map.Entry<String, Double> entry : languageData.entrySet()) {
            double percentage = (entry.getValue() / totalLines) * 100;
            languagePercentages.put(entry.getKey(), (int) Math.floor(percentage));
        }

        return languagePercentages;
    }

    public Mono<String> commentMergeRequest(CodeRepo codeRepo, Long iid, String comment) throws MalformedURLException {
        // Construct the URL for the API endpoint
        URL repoUrlHost = new URL(codeRepo.getRepourl());
        String apiUrl = String.format("https://api.github.com/repos/%s/issues/%d/comments",
                codeRepo.getName(), iid);

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
                    log.warn("Failed to post comment on merge request. Status: {}", response.statusCode());
                    return Mono.error(new RuntimeException("Failed to post comment on merge request"));
                })
                .bodyToMono(String.class)  // We're not interested in the body, but we need to return a Mono<String>
                .doOnSuccess(response -> log.info("Comment posted successfully on merge request: " + iid))
                .doOnError(throwable -> log.warn("Error posting comment: " + throwable.getMessage()));
    }

}
