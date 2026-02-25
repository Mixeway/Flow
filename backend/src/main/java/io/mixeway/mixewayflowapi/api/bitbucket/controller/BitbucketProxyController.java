package io.mixeway.mixewayflowapi.api.bitbucket.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Log4j2
public class BitbucketProxyController {
    private final WebClient webClient;

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping("/api/v1/bitbucket/proxy/repos")
    public ResponseEntity<List<Object>> proxyBitbucketRepos(
            @RequestHeader(value = "X-Bitbucket-Token", required = false) String bitbucketToken,
            @RequestParam(value = "bitbucketUrl", required = true) String bitbucketUrl,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "pagelen", defaultValue = "100") int pagelen) {

        try {
            final String normalizedUrl = bitbucketUrl.endsWith("/") ? bitbucketUrl.substring(0, bitbucketUrl.length() - 1) : bitbucketUrl;
            final String fullUrl = String.format("%s/2.0/repositories?role=member&page=%d&pagelen=%d",
                    normalizedUrl, page, pagelen);

            log.info("Proxying Bitbucket repos request to: {}", fullUrl);

            WebClient.RequestHeadersSpec<?> requestSpec = webClient.get()
                    .uri(fullUrl);

            if (bitbucketToken != null && !bitbucketToken.isEmpty()) {
                requestSpec = requestSpec.header("Authorization", "Bearer " + bitbucketToken);
            }

            Map<String, Object> body = requestSpec
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                    .doOnError(error -> log.error("Error proxying Bitbucket repos request to {}: {}", fullUrl, error.getMessage()))
                    .onErrorResume(error -> Mono.just(Collections.emptyMap()))
                    .block();

            if (body != null && body.containsKey("values")) {
                @SuppressWarnings("unchecked")
                List<Object> values = (List<Object>) body.get("values");
                return ResponseEntity.ok(values != null ? values : Collections.emptyList());
            }
            return ResponseEntity.ok(Collections.emptyList());
        } catch (Exception e) {
            log.error("Error proxying Bitbucket repos request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping("/api/v1/bitbucket/proxy/repo")
    public ResponseEntity<Object> proxyBitbucketRepo(
            @RequestHeader(value = "X-Bitbucket-Token", required = false) String bitbucketToken,
            @RequestParam(value = "bitbucketUrl", required = true) String bitbucketUrl,
            @RequestParam(value = "workspace", required = true) String workspace,
            @RequestParam(value = "repo", required = true) String repo) {

        try {
            final String normalizedUrl = bitbucketUrl.endsWith("/") ? bitbucketUrl.substring(0, bitbucketUrl.length() - 1) : bitbucketUrl;
            final String fullUrl = String.format("%s/2.0/repositories/%s/%s",
                    normalizedUrl, workspace, repo);

            log.info("Proxying Bitbucket repo request to: {}", fullUrl);

            WebClient.RequestHeadersSpec<?> requestSpec = webClient.get()
                    .uri(fullUrl);

            if (bitbucketToken != null && !bitbucketToken.isEmpty()) {
                requestSpec = requestSpec.header("Authorization", "Bearer " + bitbucketToken);
            }

            Map<String, Object> body = requestSpec
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                    .timeout(Duration.ofSeconds(15))
                    .doOnNext(b -> log.info("Bitbucket single repo response keys: {}", b.keySet()))
                    .doOnError(error -> log.error("Error proxying Bitbucket repo request to {}: {}", fullUrl, error.getMessage()))
                    .onErrorResume(error -> Mono.just(Collections.emptyMap()))
                    .block();

            return ResponseEntity.ok(body != null ? body : Collections.emptyMap());
        } catch (Exception e) {
            log.error("Error proxying Bitbucket repo request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
