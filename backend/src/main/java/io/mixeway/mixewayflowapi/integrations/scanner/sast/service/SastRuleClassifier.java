package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Locale;

@Component
@RequiredArgsConstructor
public class SastRuleClassifier {

    private final SastRuleRegistry ruleRegistry;

    public SastRuleMetadata classify(Item item) {
        String ruleId = item == null ? "" : item.getId();
        List<String> cweIds = item == null || item.getCweIds() == null ? List.of() : List.copyOf(item.getCweIds());

        return ruleRegistry.findByRuleId(ruleId)
                .map(definition -> fromRegistry(ruleId, cweIds, definition))
                .orElseGet(() -> ruleRegistry.findFamilyByCwe(cweIds)
                        .map(family -> fromFamily(ruleId, cweIds, family))
                        .orElseGet(() -> fromHeuristics(item, ruleId, cweIds)));
    }

    private SastRuleMetadata fromRegistry(String ruleId, List<String> cweIds,
                                          SastRuleRegistry.RuleDefinition definition) {
        VulnerabilityFamily family = definition.family() == null ? VulnerabilityFamily.GENERAL : definition.family();
        List<String> resolvedCwe = cweIds.isEmpty() && definition.cwe() != null ? definition.cwe() : cweIds;
        return new SastRuleMetadata(
                ruleId,
                resolvedCwe,
                family,
                definition.promptProfile() == null ? promptFor(family) : definition.promptProfile(),
                definition.policyProfile() == null ? policyFor(family) : definition.policyProfile(),
                definition.requiresTaint() == null ? requiresTaint(family) : definition.requiresTaint(),
                definition.requiresExecutionContext() == null ? requiresExecutionContext(family) : definition.requiresExecutionContext(),
                definition.requiresDataSensitivity() == null ? requiresDataSensitivity(family) : definition.requiresDataSensitivity());
    }

    private SastRuleMetadata fromFamily(String ruleId, List<String> cweIds, VulnerabilityFamily family) {
        return new SastRuleMetadata(ruleId, cweIds, family, promptFor(family), policyFor(family),
                requiresTaint(family), requiresExecutionContext(family), requiresDataSensitivity(family));
    }

    private SastRuleMetadata fromHeuristics(Item item, String ruleId, List<String> cweIds) {
        String title = item == null || item.getTitle() == null ? "" : item.getTitle();
        String combined = (ruleId + " " + title).toLowerCase(Locale.ROOT);

        VulnerabilityFamily family;
        if (combined.contains("sql")) {
            family = VulnerabilityFamily.SQL_INJECTION;
        } else if (combined.contains("command") || combined.contains("subprocess") || combined.contains("os_command")) {
            family = VulnerabilityFamily.COMMAND_INJECTION;
        } else if (combined.contains("path traversal") || combined.contains("directory traversal")
                || combined.contains("file path") || combined.contains("filename")) {
            family = VulnerabilityFamily.PATH_TRAVERSAL;
        } else if (combined.contains("xss") || combined.contains("cross-site")
                || combined.contains("innerhtml") || combined.contains("html injection")) {
            family = VulnerabilityFamily.XSS;
        } else if (combined.contains("cbc") || combined.contains("ecb") || combined.contains("weak encryption")
                || combined.contains("weak crypto") || combined.contains("cipher")) {
            family = VulnerabilityFamily.WEAK_CRYPTO;
        } else if (combined.contains("weak hash") || combined.contains("md5") || combined.contains("sha-1")
                || combined.contains("sha1")) {
            family = VulnerabilityFamily.WEAK_HASH;
        } else if (combined.contains("hardcoded") || combined.contains("hard-coded")
                || combined.contains("secret") || combined.contains("api key") || combined.contains("private key")) {
            family = VulnerabilityFamily.HARDCODED_SECRET;
        } else if (combined.contains("cookie") || combined.contains("httponly") || combined.contains("same-site")
                || combined.contains("samesite")) {
            family = VulnerabilityFamily.COOKIE_SECURITY;
        } else if (combined.contains("csrf") || combined.contains("cross-site request forgery")) {
            family = VulnerabilityFamily.CSRF;
        } else if (combined.contains("deserialization") || combined.contains("deserialize")) {
            family = VulnerabilityFamily.DESERIALIZATION;
        } else if (combined.contains("xxe") || combined.contains("xml external entity")) {
            family = VulnerabilityFamily.XXE;
        } else if (combined.contains("clear text") || combined.contains("cleartext")
                || combined.contains("http url") || combined.contains("tls")) {
            family = VulnerabilityFamily.CLEAR_TEXT_TRANSMISSION;
        } else if (combined.contains("permission") || combined.contains("world readable")
                || combined.contains("world writable")) {
            family = VulnerabilityFamily.PERMISSIONS;
        } else if (combined.contains("regex") || combined.contains("redos")) {
            family = VulnerabilityFamily.REGEX_DOS;
        } else if (combined.contains("logger") || combined.contains("log message")) {
            family = VulnerabilityFamily.LOGGER_LEAK;
        } else if (combined.contains("observable timing") || combined.contains("timing discrepancy")
                || combined.contains("timing side") || combined.contains("observable_timing")) {
            family = VulnerabilityFamily.TIMING_SIDE_CHANNEL;
        } else if (combined.contains("exception")) {
            family = VulnerabilityFamily.EXCEPTION_LEAK;
        } else if (combined.contains("redirect")) {
            family = VulnerabilityFamily.OPEN_REDIRECT;
        } else if (combined.contains("trust boundary") || combined.contains("setattribute")
                || combined.contains("session key") || combined.contains("external config")) {
            family = VulnerabilityFamily.TRUST_BOUNDARY;
        } else if (combined.contains("random")) {
            family = VulnerabilityFamily.INSUFFICIENT_RANDOM;
        } else {
            family = VulnerabilityFamily.GENERAL;
        }

        return fromFamily(ruleId, cweIds, family);
    }

    private PromptProfile promptFor(VulnerabilityFamily family) {
        return switch (family) {
            case SQL_INJECTION, COMMAND_INJECTION, SSRF, TRUST_BOUNDARY -> PromptProfile.INJECTION;
            case WEAK_CRYPTO, WEAK_HASH, INSUFFICIENT_RANDOM -> PromptProfile.WEAK_CRYPTO;
            case LOGGER_LEAK, EXCEPTION_LEAK, AUTH_ENUMERATION -> PromptProfile.LOGGING_LEAK;
            case TIMING_SIDE_CHANNEL -> PromptProfile.TIMING;
            case HARDCODED_SECRET -> PromptProfile.SECRET_EXPOSURE;
            case COOKIE_SECURITY -> PromptProfile.COOKIE_SECURITY;
            case INSECURE_CONFIG, CLEAR_TEXT_TRANSMISSION, PERMISSIONS,
                 VULNERABLE_DEPENDENCY -> PromptProfile.MISCONFIGURATION;
            case CSRF, ACCESS_CONTROL, REGEX_DOS -> PromptProfile.CONFIGURATION;
            case DESERIALIZATION, XXE -> PromptProfile.DESERIALIZATION;
            case XSS -> PromptProfile.XSS;
            case PATH_TRAVERSAL -> PromptProfile.PATH_TRAVERSAL;
            case OPEN_REDIRECT -> PromptProfile.OPEN_REDIRECT;
            default -> PromptProfile.GENERAL;
        };
    }

    private PolicyProfile policyFor(VulnerabilityFamily family) {
        return switch (family) {
            case WEAK_CRYPTO, WEAK_HASH, INSUFFICIENT_RANDOM -> PolicyProfile.WEAK_CRYPTO_STRICT;
            case LOGGER_LEAK, EXCEPTION_LEAK, AUTH_ENUMERATION -> PolicyProfile.LOGGING_CONTENT_AND_AUDIENCE;
            case TIMING_SIDE_CHANNEL -> PolicyProfile.TIMING_SIDE_CHANNEL;
            case HARDCODED_SECRET -> PolicyProfile.SECRET_HANDLING;
            case COOKIE_SECURITY -> PolicyProfile.COOKIE_SECURITY;
            case INSECURE_CONFIG, CSRF, PERMISSIONS, REGEX_DOS, VULNERABLE_DEPENDENCY -> PolicyProfile.CONFIGURATION_REVIEW;
            case ACCESS_CONTROL -> PolicyProfile.ACCESS_CONTROL_REVIEW;
            case CLEAR_TEXT_TRANSMISSION -> PolicyProfile.TRANSPORT_SECURITY;
            case DESERIALIZATION, XXE -> PolicyProfile.DESERIALIZATION_REVIEW;
            case XSS -> PolicyProfile.XSS_CONTEXTUAL_ESCAPING;
            case PATH_TRAVERSAL -> PolicyProfile.PATH_CANONICALIZATION;
            case SQL_INJECTION, COMMAND_INJECTION, SSRF, OPEN_REDIRECT, TRUST_BOUNDARY
                    -> PolicyProfile.STRICT_SOURCE_TO_SINK;
            default -> PolicyProfile.GENERAL_REVIEW;
        };
    }

    private boolean requiresTaint(VulnerabilityFamily family) {
        return switch (family) {
            case WEAK_CRYPTO, WEAK_HASH, INSUFFICIENT_RANDOM, LOGGER_LEAK, EXCEPTION_LEAK, AUTH_ENUMERATION,
                 TIMING_SIDE_CHANNEL, HARDCODED_SECRET, COOKIE_SECURITY, CSRF, INSECURE_CONFIG,
                 CLEAR_TEXT_TRANSMISSION, PERMISSIONS, VULNERABLE_DEPENDENCY -> false;
            default -> true;
        };
    }

    private boolean requiresExecutionContext(VulnerabilityFamily family) {
        return switch (family) {
            case LOGGER_LEAK, EXCEPTION_LEAK, AUTH_ENUMERATION, TIMING_SIDE_CHANNEL,
                 COOKIE_SECURITY, CLEAR_TEXT_TRANSMISSION -> true;
            default -> false;
        };
    }

    private boolean requiresDataSensitivity(VulnerabilityFamily family) {
        return switch (family) {
            // Cookie flag findings are configuration issues: missing HttpOnly/Secure/SameSite is enough.
            // Do not require proving cookie sensitivity before TRUE_POSITIVE.
            case LOGGER_LEAK, EXCEPTION_LEAK, AUTH_ENUMERATION, TIMING_SIDE_CHANNEL,
                 HARDCODED_SECRET -> true;
            default -> false;
        };
    }
}
