package io.mixeway.mixewayflowapi.integrations.repo.apiclient;

import io.mixeway.mixewayflowapi.integrations.repo.dto.ImportCodeRepoGitHubResponseDto;
import io.mixeway.mixewayflowapi.integrations.repo.dto.ImportCodeRepoResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

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

}
