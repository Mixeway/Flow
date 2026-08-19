package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@Order(20)
public class LoggingEvidenceBuilder implements SastEvidenceBuilder {

    private static final Pattern BROWSER_LOGGER = Pattern.compile("\\bconsole\\.(log|error|warn|info|debug)\\s*\\(",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern SERVER_LOGGER = Pattern.compile("\\b(Logger|log|logger)\\s*\\.\\s*(info|warn|error|debug|trace)\\s*\\(",
            Pattern.CASE_INSENSITIVE);
    /** Hard secrets — never treat as same-user-only validation feedback. */
    private static final Pattern HARD_SECRET_TERMS = Pattern.compile(
            "\\b(password|passwd|pwd|secret|token|api[_-]?key|authorization|cookie|session|credential|"
                    + "ssn|credit[_-]?card|private[_-]?key|connection[_-]?string)\\b",
            Pattern.CASE_INSENSITIVE);
    /** PII that may appear in same-user validation echoes (phone/email). */
    private static final Pattern PII_TERMS = Pattern.compile(
            "\\b(email|phone|telephone)\\b",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern SENSITIVE_TERMS = Pattern.compile(
            "\\b(password|passwd|pwd|secret|token|api[_-]?key|authorization|cookie|session|credential|ssn|"
                    + "email|phone|telephone|credit[_-]?card|private[_-]?key)\\b",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern STACKTRACE_TERMS = Pattern.compile(
            "printStackTrace|stack\\s*trace|getStackTrace\\s*\\(",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern GENERIC_VALIDATION_EXCEPTION = Pattern.compile(
            "\\b(ValidationError|ValueError|Invalid(?:Value|Argument|Input)Exception|GraphQLError)\\b",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern NON_SENSITIVE_VALIDATION_CONTEXT = Pattern.compile(
            "\\b(currency|enum|field|form|errors?\\.as_data|cleaned_input|OrderDirection|"
                    + "validation\\s+error|invalid\\s+value)\\b",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern IDENTIFIER = Pattern.compile("\\b[A-Za-z_][A-Za-z0-9_]*\\b");

    @Override
    public boolean supports(SastRuleMetadata metadata) {
        return metadata != null && (metadata.family() == VulnerabilityFamily.LOGGER_LEAK
                || metadata.family() == VulnerabilityFamily.EXCEPTION_LEAK
                || metadata.family() == VulnerabilityFamily.AUTH_ENUMERATION);
    }

    @Override
    public FindingEvidence build(Item item, CodeContextExtractor.CodeContext context, SastRuleMetadata metadata) {
        String combined = combinedText(item, context);
        // Sensitivity from code/snippets only — Bearer rule descriptions often contain email/password examples.
        String codeForSensitivity = codeText(item, context);
        ExecutionContext executionContext = detectExecutionContext(item, context, combined);
        String dataSensitivity = detectDataSensitivity(codeForSensitivity);
        String audience = detectAudience(executionContext, combined);
        String loggerKind = detectLoggerKind(combined);
        String loggedValue = detectLoggedValue(item);

        boolean sameUserValidation = looksLikeSameUserValidationFeedback(codeForSensitivity);
        boolean genericValidation = GENERIC_VALIDATION_EXCEPTION.matcher(codeForSensitivity).find()
                && (NON_SENSITIVE_VALIDATION_CONTEXT.matcher(codeForSensitivity).find()
                || LoggingEvidenceBuilder.looksLikeGenericValidationException(codeForSensitivity))
                && !HARD_SECRET_TERMS.matcher(codeForSensitivity).find();

        List<String> notes = new ArrayList<>();
        notes.add("Information leakage requires both sensitive content and exposure to an audience that should not receive it.");
        if (executionContext == ExecutionContext.WEB_CLIENT) {
            notes.add("Browser console output is local to the current user's developer tools; do not treat it as server logs.");
        }
        if (executionContext == ExecutionContext.SERVER_SIDE) {
            notes.add("Server logs, telemetry, files, and HTTP responses can expose sensitive data beyond the current user.");
        }
        if ("no_obvious_secret".equals(dataSensitivity)) {
            notes.add("If no credential, token, PII, stack trace, or internal detail is present, prefer FALSE_POSITIVE "
                    + "over UNCERTAIN — generic ValidationError/enum/form messages without secrets are FALSE_POSITIVE.");
        }
        if (genericValidation) {
            notes.add("Generic validation/enum/form exception without password/token/api_key → FALSE_POSITIVE.");
        }
        if (sameUserValidation) {
            notes.add("ValidationError/GraphQL field error echoing the requester's own input (including phone/email) "
                    + "back to that same client is same-user validation feedback → FALSE_POSITIVE. "
                    + "Keep TRUE_POSITIVE only for hard secrets (password/token/api_key) or third-party exposure.");
            audience = "same_request_user";
        }

        String key = consistencyKey(metadata, item, executionContext, loggerKind, loggedValue);
        return new FindingEvidence(
                true,
                metadata,
                executionContext,
                "Logging/information exposure finding classified by execution context, content sensitivity, and audience.",
                FindingEvidence.attributes(
                        "data_sensitivity", dataSensitivity,
                        "audience", audience,
                        "logger_kind", loggerKind,
                        "logged_value_hint", loggedValue,
                        "generic_validation_exception", Boolean.toString(genericValidation),
                        "same_user_validation_feedback", Boolean.toString(sameUserValidation)),
                TaintTrace.notRequired("logging leaks require content and audience analysis more than full source-to-sink taint"),
                notes,
                key);
    }

    private ExecutionContext detectExecutionContext(Item item, CodeContextExtractor.CodeContext context, String combined) {
        String filename = item == null ? "" : java.util.Optional.ofNullable(item.getFilename())
                .orElse(java.util.Optional.ofNullable(item.getFullFilename()).orElse(""));
        String lowerPath = filename.replace('\\', '/').toLowerCase(Locale.ROOT);
        String language = context == null || context.language() == null ? "" : context.language();

        if (lowerPath.contains("/test/") || lowerPath.contains("/tests/") || lowerPath.contains("/spec/")) {
            return ExecutionContext.TEST_CODE;
        }
        if (BROWSER_LOGGER.matcher(combined).find()
                || lowerPath.contains("frontend/")
                || lowerPath.contains("/src/app/")
                || "javascript".equals(language)
                || "typescript".equals(language)) {
            return ExecutionContext.WEB_CLIENT;
        }
        if (SERVER_LOGGER.matcher(combined).find()
                || lowerPath.contains("backend/")
                || lowerPath.contains("/controller/")
                || lowerPath.contains("/service/")
                || "java".equals(language)) {
            return ExecutionContext.SERVER_SIDE;
        }
        if (combined.contains("System.out") || combined.contains("System.err")) {
            return ExecutionContext.CLI;
        }
        return ExecutionContext.UNKNOWN;
    }

    private String detectDataSensitivity(String combined) {
        if (SENSITIVE_TERMS.matcher(combined).find()) {
            return "secret_or_pii_candidate";
        }
        if (STACKTRACE_TERMS.matcher(combined).find()) {
            return "stacktrace_or_internal_detail";
        }
        // ValidationError / form errors without secret vocabulary are not sensitive disclosure.
        if (GENERIC_VALIDATION_EXCEPTION.matcher(combined).find()
                && NON_SENSITIVE_VALIDATION_CONTEXT.matcher(combined).find()) {
            return "no_obvious_secret";
        }
        return "no_obvious_secret";
    }

    /**
     * True when the shown exception/log content has no credential/PII markers (shared with verifier FP guards).
     */
    static boolean hasNoObviousSecretContent(String text) {
        if (text == null || text.isBlank()) {
            return true;
        }
        return !SENSITIVE_TERMS.matcher(text).find();
    }

    static boolean looksLikeGenericValidationException(String text) {
        if (text == null || text.isBlank()) {
            return false;
        }
        return GENERIC_VALIDATION_EXCEPTION.matcher(text).find()
                && hasNoObviousSecretContent(text);
    }

    /**
     * Validation/API field errors that echo request fields back to the same client are not third-party leaks.
     * Hard secrets (password/token/api_key) still count as sensitive even in ValidationError.
     */
    static boolean looksLikeSameUserValidationFeedback(String text) {
        if (text == null || text.isBlank()) {
            return false;
        }
        if (!GENERIC_VALIDATION_EXCEPTION.matcher(text).find()) {
            return false;
        }
        if (HARD_SECRET_TERMS.matcher(text).find()) {
            return false;
        }
        // Phone/email (or no PII) inside ValidationError / GraphQLError → same-user feedback.
        return PII_TERMS.matcher(text).find()
                || NON_SENSITIVE_VALIDATION_CONTEXT.matcher(text).find()
                || hasNoObviousSecretContent(text);
    }

    private String detectAudience(ExecutionContext executionContext, String combined) {
        if (executionContext == ExecutionContext.WEB_CLIENT) {
            return "current_browser_user";
        }
        if (combined.toLowerCase(Locale.ROOT).contains("response") || combined.toLowerCase(Locale.ROOT).contains("json")) {
            return "http_response_candidate";
        }
        if (executionContext == ExecutionContext.SERVER_SIDE) {
            return "server_logs_or_shared_observability";
        }
        return "unknown";
    }

    private String detectLoggerKind(String combined) {
        if (BROWSER_LOGGER.matcher(combined).find()) {
            return "browser_console";
        }
        if (SERVER_LOGGER.matcher(combined).find()) {
            return "server_logger";
        }
        if (combined.contains("System.out") || combined.contains("System.err")) {
            return "stdout_stderr";
        }
        return "unknown";
    }

    private String detectLoggedValue(Item item) {
        if (item == null || item.getCodeExtract() == null) {
            return "unknown";
        }
        String extract = item.getCodeExtract();
        MatcherState state = new MatcherState();
        Matcher matcher = IDENTIFIER.matcher(extract);
        while (matcher.find()) {
            String token = matcher.group();
            String lower = token.toLowerCase(Locale.ROOT);
            if (lower.length() < 2 || isLoggingNoise(lower)) {
                continue;
            }
            if (state.first == null) {
                state.first = token;
            }
            if (lower.contains("user") || lower.contains("name") || lower.contains("token")
                    || lower.contains("header") || lower.contains("message") || lower.contains("error")) {
                return token;
            }
        }
        return state.first == null ? "unknown" : state.first;
    }

    private boolean isLoggingNoise(String lower) {
        return lower.equals("logger") || lower.equals("log") || lower.equals("info")
                || lower.equals("warn") || lower.equals("error") || lower.equals("debug")
                || lower.equals("trace") || lower.equals("string") || lower.equals("system")
                || lower.equals("out") || lower.equals("err") || lower.equals("printstacktrace");
    }

    private String consistencyKey(SastRuleMetadata metadata, Item item, ExecutionContext executionContext,
                                  String loggerKind, String loggedValue) {
        String file = item == null ? "" : java.util.Optional.ofNullable(item.getFilename())
                .orElse(java.util.Optional.ofNullable(item.getFullFilename()).orElse(""));
        String rule = metadata.ruleId() == null ? metadata.family().name() : metadata.ruleId();
        return String.join("|", rule, file, executionContext.name(), loggerKind, loggedValue);
    }

    private static class MatcherState {
        private String first;
    }

    private String combinedText(Item item, CodeContextExtractor.CodeContext context) {
        return String.join("\n",
                item == null || item.getTitle() == null ? "" : item.getTitle(),
                item == null || item.getDescription() == null ? "" : item.getDescription(),
                codeText(item, context));
    }

    private String codeText(Item item, CodeContextExtractor.CodeContext context) {
        return String.join("\n",
                item == null || item.getCodeExtract() == null ? "" : item.getCodeExtract(),
                context == null || context.functionBody() == null ? "" : context.functionBody(),
                context == null || context.localSnippet() == null ? "" : context.localSnippet());
    }

}
