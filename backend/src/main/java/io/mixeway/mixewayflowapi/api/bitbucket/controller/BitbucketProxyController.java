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
import java.util.*;

@RestController
@RequiredArgsConstructor
@Log4j2
public class BitbucketProxyController {
    private final WebClient webClient;

    // -------------------------------------------------------------------------
    // List repositories
    // -------------------------------------------------------------------------

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping("/api/v1/bitbucket/proxy/repos")
    public ResponseEntity<List<Object>> proxyBitbucketRepos(
            @RequestHeader(value = "X-Bitbucket-Token", required = false) String bitbucketToken,
            @RequestParam(value = "bitbucketUrl") String bitbucketUrl,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "pagelen", defaultValue = "100") int pagelen) {

        try {
            final String normalizedUrl = stripTrailingSlash(bitbucketUrl);
            final String fullUrl;

            if (isOnPremise(normalizedUrl)) {
                // Bitbucket Server / Data Center REST API 1.0
                int start = (page - 1) * pagelen;
                fullUrl = normalizedUrl + "/rest/api/1.0/repos?limit=" + pagelen + "&start=" + start;
            } else {
                // Bitbucket Cloud API v2.0
                fullUrl = String.format("%s/2.0/repositories?role=member&page=%d&pagelen=%d",
                        normalizedUrl, page, pagelen);
            }

            log.info("Proxying Bitbucket repos request to: {}", fullUrl);

            Map<String, Object> body = doGet(fullUrl, bitbucketToken);

            if (body != null && body.containsKey("values")) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> rawValues = (List<Map<String, Object>>) body.get("values");
                if (rawValues == null) {
                    return ResponseEntity.ok(Collections.emptyList());
                }
                List<Object> normalized = isOnPremise(normalizedUrl)
                        ? normalizeServerRepoList(rawValues)
                        : new ArrayList<>(rawValues);
                return ResponseEntity.ok(normalized);
            }
            return ResponseEntity.ok(Collections.emptyList());
        } catch (Exception e) {
            log.error("Error proxying Bitbucket repos request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // -------------------------------------------------------------------------
    // Single repository
    // -------------------------------------------------------------------------

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping("/api/v1/bitbucket/proxy/repo")
    public ResponseEntity<Object> proxyBitbucketRepo(
            @RequestHeader(value = "X-Bitbucket-Token", required = false) String bitbucketToken,
            @RequestParam(value = "bitbucketUrl") String bitbucketUrl,
            @RequestParam(value = "workspace") String workspace,
            @RequestParam(value = "repo") String repo) {

        try {
            final String normalizedUrl = stripTrailingSlash(bitbucketUrl);
            final String fullUrl;

            if (isOnPremise(normalizedUrl)) {
                // workspace maps to project key, repo maps to repository slug
                fullUrl = normalizedUrl + "/rest/api/1.0/projects/" + workspace + "/repos/" + repo;
            } else {
                fullUrl = String.format("%s/2.0/repositories/%s/%s", normalizedUrl, workspace, repo);
            }

            log.info("Proxying Bitbucket repo request to: {}", fullUrl);

            Map<String, Object> body = doGet(fullUrl, bitbucketToken, Duration.ofSeconds(15));

            if (body == null || body.isEmpty()) {
                return ResponseEntity.ok(Collections.emptyMap());
            }

            Map<String, Object> result = isOnPremise(normalizedUrl)
                    ? normalizeServerRepo(body)
                    : body;
            log.info("Bitbucket single repo response keys: {}", result.keySet());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error proxying Bitbucket repo request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // -------------------------------------------------------------------------
    // Normalization helpers — convert Server API 1.0 shape to Cloud API v2.0 shape
    // so the frontend works with both flavours without modification.
    // -------------------------------------------------------------------------

    private List<Object> normalizeServerRepoList(List<Map<String, Object>> rawValues) {
        List<Object> result = new ArrayList<>();
        for (Map<String, Object> raw : rawValues) {
            result.add(normalizeServerRepo(raw));
        }
        return result;
    }

    /**
     * Converts a Bitbucket Server repo object to the subset of fields the frontend
     * reads from a Bitbucket Cloud repo object:
     * <ul>
     *   <li>{@code uuid} — string representation of the integer id</li>
     *   <li>{@code name} — repository slug</li>
     *   <li>{@code full_name} — {@code {PROJECT_KEY}/{slug}}</li>
     *   <li>{@code links.html.href} — HTTPS clone URL (used as repourl in the DB)</li>
     * </ul>
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> normalizeServerRepo(Map<String, Object> raw) {
        Map<String, Object> normalized = new HashMap<>();

        Object idObj = raw.get("id");
        normalized.put("uuid", idObj != null ? String.valueOf(idObj) : "");
        normalized.put("name", raw.get("slug"));

        Map<String, Object> project = (Map<String, Object>) raw.get("project");
        String projectKey = project != null ? (String) project.get("key") : "";
        normalized.put("full_name", projectKey + "/" + raw.get("slug"));

        String cloneUrl = extractHttpsCloneUrl(raw);
        Map<String, Object> linksHtml = new HashMap<>();
        linksHtml.put("href", cloneUrl != null ? cloneUrl : "");
        Map<String, Object> links = new HashMap<>();
        links.put("html", linksHtml);
        normalized.put("links", links);

        return normalized;
    }

    @SuppressWarnings("unchecked")
    private String extractHttpsCloneUrl(Map<String, Object> repoMap) {
        Map<String, Object> links = (Map<String, Object>) repoMap.get("links");
        if (links == null) return null;
        List<Map<String, Object>> cloneLinks = (List<Map<String, Object>>) links.get("clone");
        if (cloneLinks == null) return null;
        for (Map<String, Object> link : cloneLinks) {
            String name = (String) link.get("name");
            if ("http".equals(name) || "https".equals(name)) {
                return (String) link.get("href");
            }
        }
        return null;
    }

    // -------------------------------------------------------------------------
    // Low-level helpers
    // -------------------------------------------------------------------------

    private boolean isOnPremise(String url) {
        return url != null && !url.contains("bitbucket.org");
    }

    private String stripTrailingSlash(String url) {
        return url.endsWith("/") ? url.substring(0, url.length() - 1) : url;
    }

    private Map<String, Object> doGet(String url, String token) {
        return doGet(url, token, null);
    }

    private Map<String, Object> doGet(String url, String token, Duration timeout) {
        WebClient.RequestHeadersSpec<?> requestSpec = webClient.get().uri(url);
        if (token != null && !token.isEmpty()) {
            requestSpec = requestSpec.header("Authorization", "Bearer " + token);
        }
        Mono<Map<String, Object>> mono = requestSpec
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .doOnError(error -> log.error("Bitbucket proxy request failed for {}: {}", url, error.getMessage()))
                .onErrorResume(error -> Mono.just(Collections.emptyMap()));
        if (timeout != null) {
            mono = mono.timeout(timeout);
        }
        return mono.block();
    }
}
