package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Component
@Order(40)
public class CookieSecurityEvidenceBuilder implements SastEvidenceBuilder {

    @Override
    public boolean supports(SastRuleMetadata metadata) {
        return metadata != null && metadata.family() == VulnerabilityFamily.COOKIE_SECURITY;
    }

    @Override
    public FindingEvidence build(Item item, CodeContextExtractor.CodeContext context, SastRuleMetadata metadata) {
        String combined = combinedText(item, context);
        String missingFlag = detectMissingFlag(combined);
        ExecutionContext executionContext = detectExecutionContext(item, context);

        List<String> notes = new ArrayList<>();
        notes.add("Cookie security findings are configuration/misconfiguration issues; do not require attacker-controlled source taint.");
        notes.add("TRUE_POSITIVE is mandatory when Secure, HttpOnly, or SameSite is missing/false on a cookie set in non-test code. Cookie sensitivity is NOT required.");
        notes.add("FALSE_POSITIVE only when existing code proves the flag is enabled in the language/framework idiom "
                + "(setHttpOnly/setSecure, httpOnly:/secure:, HttpOnly:/Secure:, httponly=/secure=, SameSite), "
                + "a framework guarantee that sets the flag, or a test-only path.");

        return new FindingEvidence(
                true,
                metadata,
                executionContext,
                "Cookie security finding classified by missing flag and execution context.",
                FindingEvidence.attributes(
                        "missing_or_weak_flag", missingFlag,
                        "cookie_sensitivity_hint", sensitivityHint(combined)),
                TaintTrace.notRequired("cookie flag findings are security configuration issues and do not require source-to-sink taint"),
                notes,
                String.join("|", metadata.family().name(), missingFlag, normalizedCode(item)));
    }

    private String detectMissingFlag(String combined) {
        String lower = combined.toLowerCase(Locale.ROOT);
        if (lower.contains("httponly")) return "httponly";
        if (lower.contains("secure")) return "secure";
        if (lower.contains("samesite") || lower.contains("same-site")) return "samesite";
        return "unknown";
    }

    private String sensitivityHint(String combined) {
        String lower = combined.toLowerCase(Locale.ROOT);
        if (lower.contains("session") || lower.contains("auth") || lower.contains("token")
                || lower.contains("jwt") || lower.contains("csrf")) {
            return "session_or_auth_cookie";
        }
        return "unknown";
    }

    private ExecutionContext detectExecutionContext(Item item, CodeContextExtractor.CodeContext context) {
        String filename = item == null ? "" : java.util.Optional.ofNullable(item.getFilename())
                .orElse(java.util.Optional.ofNullable(item.getFullFilename()).orElse(""));
        String lowerPath = filename.replace('\\', '/').toLowerCase(Locale.ROOT);
        if (lowerPath.contains("/test/") || lowerPath.contains("/tests/") || lowerPath.contains("/spec/")
                || lowerPath.contains("/__tests__/") || lowerPath.endsWith("_test.go")
                || lowerPath.contains("src/test/") || lowerPath.contains("/test_")) {
            return ExecutionContext.TEST_CODE;
        }
        String language = context == null ? "" : Optional.ofNullable(context.language()).orElse("");
        if (lowerPath.contains("backend/")
                || "java".equals(language) || "kotlin".equals(language) || "python".equals(language)
                || "go".equals(language) || "php".equals(language) || "ruby".equals(language)
                || "csharp".equals(language) || "rust".equals(language)) {
            return ExecutionContext.SERVER_SIDE;
        }
        if (lowerPath.contains("frontend/") || "javascript".equals(language) || "typescript".equals(language)) {
            // Cookie-setting in Express/Next server handlers is still server-side; path/backend cues win above.
            // Pure browser cookie writes remain web_client.
            if (lowerPath.contains("/server/") || lowerPath.contains("/api/") || lowerPath.contains("express")
                    || lowerPath.contains("next/") || lowerPath.contains("/pages/api/")) {
                return ExecutionContext.SERVER_SIDE;
            }
            return ExecutionContext.WEB_CLIENT;
        }
        return ExecutionContext.UNKNOWN;
    }

    private String combinedText(Item item, CodeContextExtractor.CodeContext context) {
        return String.join("\n",
                item == null || item.getTitle() == null ? "" : item.getTitle(),
                item == null || item.getDescription() == null ? "" : item.getDescription(),
                item == null || item.getCodeExtract() == null ? "" : item.getCodeExtract(),
                context == null || context.functionBody() == null ? "" : context.functionBody(),
                context == null || context.localSnippet() == null ? "" : context.localSnippet());
    }

    private String normalizedCode(Item item) {
        if (item == null || item.getCodeExtract() == null) {
            return "";
        }
        return item.getCodeExtract().replaceAll("\\s+", " ").trim().toLowerCase(Locale.ROOT);
    }
}
