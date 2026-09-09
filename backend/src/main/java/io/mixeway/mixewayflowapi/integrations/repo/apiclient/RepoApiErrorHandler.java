package io.mixeway.mixewayflowapi.integrations.repo.apiclient;

import lombok.extern.log4j.Log4j2;
import org.springframework.web.reactive.function.client.ClientResponse;
import reactor.core.publisher.Mono;

@Log4j2
final class RepoApiErrorHandler {

    private static final int MAX_BODY_LENGTH = 300;

    private RepoApiErrorHandler() {
    }

    static Mono<Throwable> failedToFetch(String provider, String what, String apiUrl, ClientResponse response) {
        int status = response.statusCode().value();
        String hint = hintFor(status);
        return response.bodyToMono(String.class)
                .defaultIfEmpty("")
                .flatMap(body -> {
                    String message = String.format(
                            "Failed to fetch %s: HTTP %d from %s [%s]. Response: %s",
                            what, status, apiUrl, hint, sanitizeBody(body));
                    log.warn("[{}] {}", provider, message);
                    return Mono.error(new RuntimeException(message));
                });
    }

    private static String hintFor(int status) {
        return switch (status) {
            case 401 -> "token invalid or expired";
            case 403 -> "forbidden (insufficient scope, IP allowlist, or SSO)";
            case 404 -> "not found or token has no access; API does not distinguish these";
            case 429 -> "rate limited";
            default -> "unexpected status";
        };
    }

    private static String sanitizeBody(String body) {
        if (body == null || body.isBlank()) {
            return "<empty>";
        }
        String trimmed = body.replaceAll("\\s+", " ").trim();
        trimmed = trimmed.replaceAll("(?i)(glpat-|ghp_|gho_|ghu_|ghs_|github_pat_|bbp_)[A-Za-z0-9_\\-]+", "***");
        if (trimmed.length() > MAX_BODY_LENGTH) {
            return trimmed.substring(0, MAX_BODY_LENGTH) + "...";
        }
        return trimmed;
    }
}
