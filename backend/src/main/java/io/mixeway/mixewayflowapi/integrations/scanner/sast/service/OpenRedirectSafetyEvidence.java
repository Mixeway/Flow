package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import java.util.Locale;
import java.util.Optional;
import java.util.regex.Pattern;

/**
 * Detects proven same-origin / relative-only redirect construction for open-redirect
 * findings (CWE-601). Mutating only {@code searchParams} on a URL built from the current
 * page location cannot change the redirect host.
 */
final class OpenRedirectSafetyEvidence {

    /** {@code new URL(window.location.href)} / {@code new URL(location.href)} / {@code new URL(location)}. */
    private static final Pattern SAME_ORIGIN_URL_BASE = Pattern.compile(
            "\\bnew\\s+URL\\s*\\(\\s*(?:window\\.)?location(?:\\.href)?\\s*\\)",
            Pattern.CASE_INSENSITIVE);

    private static final Pattern SEARCH_PARAMS_MUTATION = Pattern.compile(
            "\\bsearchParams\\s*\\.\\s*(?:set|delete|append|toString)\\s*\\(",
            Pattern.CASE_INSENSITIVE);

    /** Client or server redirect sinks. */
    private static final Pattern REDIRECT_SINK = Pattern.compile(
            "(?:window\\.)?location(?:\\.href)?\\s*="
                    + "|\\blocation\\s*\\.\\s*(?:assign|replace)\\s*\\("
                    + "|\\bsendRedirect\\s*\\("
                    + "|\\bres\\.redirect\\s*\\("
                    + "|\\bresponse\\.redirect\\s*\\("
                    + "|\\bredirect_to\\b"
                    + "|\\breturn\\s+redirect\\s*\\(",
            Pattern.CASE_INSENSITIVE);

    /**
     * Mutations that can change the redirect host/scheme. Presence of these alongside a
     * same-origin base means the host is no longer guaranteed.
     */
    private static final Pattern HOST_MUTATION = Pattern.compile(
            "\\.(?:host|hostname|origin|protocol|href)\\s*=",
            Pattern.CASE_INSENSITIVE);

    /** Relative-only redirect to a string literal path/fragment. */
    private static final Pattern RELATIVE_LITERAL_REDIRECT = Pattern.compile(
            "(?:window\\.)?location(?:\\.href)?\\s*=\\s*['\"](?:/|\\./|\\.\\./|#)[^'\"]*['\"]"
                    + "|\\blocation\\s*\\.\\s*(?:assign|replace)\\s*\\(\\s*['\"](?:/|\\./|\\.\\./|#)[^'\"]*['\"]",
            Pattern.CASE_INSENSITIVE);

    private OpenRedirectSafetyEvidence() {
    }

    static boolean present(String codeExtract, String... texts) {
        StringBuilder sb = new StringBuilder();
        sb.append(Optional.ofNullable(codeExtract).orElse(""));
        if (texts != null) {
            for (String text : texts) {
                if (text != null && !text.isBlank()) {
                    sb.append('\n').append(text);
                }
            }
        }
        String combined = sb.toString();
        if (combined.isBlank()) {
            return false;
        }

        if (RELATIVE_LITERAL_REDIRECT.matcher(combined).find()) {
            return true;
        }

        boolean sameOriginBase = SAME_ORIGIN_URL_BASE.matcher(combined).find();
        boolean searchParamsOnly = SEARCH_PARAMS_MUTATION.matcher(combined).find();
        boolean hasSink = REDIRECT_SINK.matcher(combined).find();
        boolean hostMutated = hasHostMutation(combined);

        if (sameOriginBase && searchParamsOnly && hasSink && !hostMutated) {
            return true;
        }

        // Truncated code extract may show only the sink; accept explicit reviewer proof.
        String lower = combined.toLowerCase(Locale.ROOT);
        return reviewerSameOriginProof(lower);
    }

    private static boolean hasHostMutation(String combined) {
        // Ignore location.href assignments — those are the redirect sink, not URL host mutation.
        String withoutLocationHrefAssign = combined.replaceAll(
                "(?i)(?:window\\.)?location\\.href\\s*=", "location_href_sink=");
        return HOST_MUTATION.matcher(withoutLocationHrefAssign).find();
    }

    private static boolean reviewerSameOriginProof(String lower) {
        boolean sameOriginClaim = lower.contains("same-origin")
                || lower.contains("same origin")
                || lower.contains("current page url")
                || lower.contains("current url")
                || lower.contains("window.location.href")
                || lower.contains("derived from the current");
        boolean searchParamsClaim = lower.contains("searchparams")
                || lower.contains("search parameters")
                || lower.contains("query parameters")
                || lower.contains("query params")
                || lower.contains("search params");
        boolean noExternalHost = lower.contains("not being redirected to an external")
                || lower.contains("not redirected to an external")
                || lower.contains("does not constitute an open redirect")
                || lower.contains("not an open redirect")
                || lower.contains("external host")
                || lower.contains("cannot change the host")
                || lower.contains("host remains")
                || lower.contains("relative-only")
                || lower.contains("relative only")
                || lower.contains("relative redirect");
        return sameOriginClaim && (searchParamsClaim || noExternalHost);
    }
}
