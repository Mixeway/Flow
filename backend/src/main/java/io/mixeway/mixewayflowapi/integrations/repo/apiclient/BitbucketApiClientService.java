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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Log4j2
@RequiredArgsConstructor
public class BitbucketApiClientService {
    private final WebClient webClient;

    /**
     * Fetches all accessible repositories from Bitbucket Cloud using paginated API.
     * Bitbucket API v2.0 uses /2.0/repositories with role=member.
     * @param repoUrl The base API URL for Bitbucket (e.g., https://api.bitbucket.org).
     * @param accessToken The access token (App Password, OAuth token, or Repository/Workspace Access Token).
     * @return A Flux emitting all found repositories across all pages.
     */
    public Flux<ImportCodeRepoBitbucketResponseDto> fetchAllRepositories(String repoUrl, String accessToken) {
        String initialUri = UriComponentsBuilder.fromHttpUrl(repoUrl)
                .path("/2.0/repositories")
                .queryParam("role", "member")
                .queryParam("pagelen", 100)
                .toUriString();

        return fetchBitbucketPage(initialUri, accessToken);
    }

    private Flux<ImportCodeRepoBitbucketResponseDto> fetchBitbucketPage(String uri, String accessToken) {
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
                        currentPage = Flux.fromIterable(values)
                                .map(this::mapToDto);
                    }

                    if (nextUrl != null && !nextUrl.isEmpty()) {
                        return Flux.concat(currentPage, fetchBitbucketPage(nextUrl, accessToken));
                    }
                    return currentPage;
                })
                .doOnError(error -> log.error("Error fetching Bitbucket repositories from URI {}: {}", uri, error.getMessage()));
    }

    @SuppressWarnings("unchecked")
    private ImportCodeRepoBitbucketResponseDto mapToDto(Map<String, Object> repoMap) {
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

    public Mono<ImportCodeRepoBitbucketResponseDto> getProjectInfo(String fullName, String repoUrl, String accessToken) {
        String[] parts = fullName.split("/", 2);
        if (parts.length < 2) {
            return Mono.error(new IllegalArgumentException("Invalid Bitbucket repository path: " + fullName));
        }

        String apiUrl = UriComponentsBuilder.fromHttpUrl(repoUrl)
                .pathSegment("2.0", "repositories", parts[0], parts[1])
                .toUriString();

        return webClient.get()
                .uri(apiUrl)
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .onStatus(status -> !status.is2xxSuccessful(), response ->
                        Mono.error(new RuntimeException("Failed to fetch Bitbucket repository info")))
                .bodyToMono(ImportCodeRepoBitbucketResponseDto.class)
                .doOnError(throwable -> log.error("Error fetching Bitbucket repository info: {}", throwable.getMessage()));
    }

    /**
     * Bitbucket doesn't provide a separate languages endpoint like GitHub/GitLab/Gitea.
     * The primary language is available in the repository metadata.
     * We return a map with just that language at 100%.
     */
    public Mono<HashMap<String, Integer>> getProjectLanguages(String fullName, String repoUrl, String accessToken) {
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

    private String normalizeToApiUrl(String url) {
        if (url != null && url.contains("bitbucket.org") && !url.contains("api.bitbucket.org")) {
            return url.replace("bitbucket.org", "api.bitbucket.org");
        }
        return url;
    }

    public Mono<String> commentPullRequest(CodeRepo codeRepo, Long prId, String comment) {
        String apiUrl = String.format("https://api.bitbucket.org/2.0/repositories/%s/pullrequests/%d/comments",
                codeRepo.getName(), prId);

        Map<String, Object> body = new HashMap<>();
        Map<String, String> content = new HashMap<>();
        content.put("raw", comment);
        body.put("content", content);

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
