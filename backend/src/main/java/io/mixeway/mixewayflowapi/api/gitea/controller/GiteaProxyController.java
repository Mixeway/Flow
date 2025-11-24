package io.mixeway.mixewayflowapi.api.gitea.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Log4j2
public class GiteaProxyController {
    private final WebClient webClient;

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping("/api/v1/gitea/proxy/repos")
    public ResponseEntity<List<Object>> proxyGiteaRepos(
            @RequestHeader(value = "X-Gitea-Token", required = false) String giteaToken,
            @RequestParam(value = "giteaUrl", required = true) String giteaUrl,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "limit", defaultValue = "50") int limit) {
        
        try {
            final String normalizedGiteaUrl = giteaUrl.endsWith("/") ? giteaUrl.substring(0, giteaUrl.length() - 1) : giteaUrl;
            final String fullUrl = String.format("%s/api/v1/user/repos?page=%d&limit=%d", 
                    normalizedGiteaUrl, page, limit);

            log.debug("Proxying Gitea repos request to: {}", fullUrl);

            WebClient.RequestHeadersSpec<?> requestSpec = webClient.get()
                    .uri(fullUrl);

            if (giteaToken != null && !giteaToken.isEmpty()) {
                requestSpec = requestSpec.header("Authorization", "token " + giteaToken);
            }

            ResponseEntity<List<Object>> response = requestSpec
                    .retrieve()
                    .toEntityList(Object.class)
                    .doOnError(error -> log.error("Error proxying Gitea repos request to {}: {}", fullUrl, error.getMessage()))
                    .onErrorResume(error -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()))
                    .block();

            if (response == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }

            // Copy headers except Transfer-Encoding
            HttpHeaders headers = new HttpHeaders();
            response.getHeaders().forEach((key, values) -> {
                if (!HttpHeaders.TRANSFER_ENCODING.equalsIgnoreCase(key)) {
                    headers.put(key, values);
                }
            });

            return new ResponseEntity<>(response.getBody(), headers, response.getStatusCode());

        } catch (Exception e) {
            log.error("Error proxying Gitea repos request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping("/api/v1/gitea/proxy/repo")
    public ResponseEntity<Object> proxyGiteaRepo(
            @RequestHeader(value = "X-Gitea-Token", required = false) String giteaToken,
            @RequestParam(value = "giteaUrl", required = true) String giteaUrl,
            @RequestParam(value = "owner", required = true) String owner,
            @RequestParam(value = "repo", required = true) String repo) {
        
        try {
            final String normalizedGiteaUrl = giteaUrl.endsWith("/") ? giteaUrl.substring(0, giteaUrl.length() - 1) : giteaUrl;
            final String fullUrl = String.format("%s/api/v1/repos/%s/%s", 
                    normalizedGiteaUrl, owner, repo);

            log.debug("Proxying Gitea repo request to: {}", fullUrl);

            WebClient.RequestHeadersSpec<?> requestSpec = webClient.get()
                    .uri(fullUrl);

            if (giteaToken != null && !giteaToken.isEmpty()) {
                requestSpec = requestSpec.header("Authorization", "token " + giteaToken);
            }

            ResponseEntity<Object> response = requestSpec
                    .retrieve()
                    .toEntity(Object.class)
                    .doOnError(error -> log.error("Error proxying Gitea repo request to {}: {}", fullUrl, error.getMessage()))
                    .onErrorResume(error -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error.getMessage())))
                    .block();

            if (response == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }

            // Copy headers except Transfer-Encoding
            HttpHeaders headers = new HttpHeaders();
            response.getHeaders().forEach((key, values) -> {
                if (!HttpHeaders.TRANSFER_ENCODING.equalsIgnoreCase(key)) {
                    headers.put(key, values);
                }
            });

            return new ResponseEntity<>(response.getBody(), headers, response.getStatusCode());

        } catch (Exception e) {
            log.error("Error proxying Gitea repo request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

