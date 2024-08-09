package io.mixeway.mixewayflowapi.integrations.repo.apiclient;

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
}
