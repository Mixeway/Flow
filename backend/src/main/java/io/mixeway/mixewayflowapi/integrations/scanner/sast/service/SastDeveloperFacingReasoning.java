package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * Keeps user-visible reasoning/explanation focused on the code finding, not the internal
 * scoring taxonomy used in LLM prompts (evidence categories, confidence bands, enum labels).
 *
 * <p>Only labeled scoring phrases are rewritten. Bare tokens such as {@code http_request}
 * or {@code config_file} are left untouched so real code identifiers are not mangled.
 */
final class SastDeveloperFacingReasoning {

    static final String PROMPT_RULE =
            "User-visible `reasoning`/`explanation` is for a developer reading the finding: describe the code path "
                    + "and why it is or is not exploitable. Do not mention internal review machinery — evidence categories, "
                    + "confidence bands (VERY_HIGH/HIGH/MEDIUM), prompt/policy profiles, enum labels "
                    + "(execution_context, input_source, http_request, cli_developer_tool, PROVEN_SOURCE_*), "
                    + "origin-tag, RISKY SCHEME, or numeric scoring rules such as 0.50-0.60 / mid confidence.";

    private static final Pattern EXECUTION_AND_SOURCE = Pattern.compile(
            "(?i)execution context is\\s+([a-z_]+)\\s+with input_source\\s+([a-z_]+)");
    private static final Pattern INPUT_SOURCE_LABEL = Pattern.compile(
            "(?i)\\binput_source\\s*(?:is|=|:)\\s*([a-z_]+)");
    private static final Pattern EXECUTION_CONTEXT_LABEL = Pattern.compile(
            "(?i)\\bexecution_context\\s*(?:is|=|:)\\s*([a-z_]+)");
    private static final Pattern EVIDENCE_CATEGORY = Pattern.compile(
            "(?i)evidence category(?: is|:)?\\s+[A-Z_]+(?:\\s*[—\\-:]\\s*)?");
    private static final Pattern CONFIDENCE_BAND = Pattern.compile(
            "(?i)\\b(?:VERY_HIGH|VERY_LOW)\\b|\\bconfidence band\\b|\\bstandardized band\\b");
    private static final Pattern MID_CONFIDENCE = Pattern.compile(
            "(?i)(?:,?\\s*)?(?:with\\s+)?mid(?:-)?confidence(?:\\s*\\(~?0\\.55\\))?|(?:confidence\\s+)?0\\.50\\s*-\\s*0\\.60(?:\\s*\\(~?0\\.55\\))?");
    private static final Pattern ORIGIN_TAG = Pattern.compile(
            "(?i)origin-tag:\\s*all-callsites-pass-literal-arg\\s*=\\s*true");
    private static final Pattern MULTI_SPACE = Pattern.compile(" {2,}");

    private static final Map<String, String> SOURCE_LABELS = Map.ofEntries(
            Map.entry("http_request", "an HTTP request"),
            Map.entry("database", "the database"),
            Map.entry("file_untrusted", "an untrusted file"),
            Map.entry("multipart_parser_temp_path", "a multipart parser temporary path"),
            Map.entry("gui_input", "a desktop UI field"),
            Map.entry("dom_content", "DOM content"),
            Map.entry("url_fragment", "the page URL"),
            Map.entry("cli_argument_developer", "a developer CLI argument"),
            Map.entry("internal_call", "internal application code"),
            Map.entry("config_file", "application configuration"),
            Map.entry("environment_variable", "an environment variable"),
            Map.entry("unknown", "an unknown origin")
    );

    private static final Map<String, String> CONTEXT_LABELS = Map.ofEntries(
            Map.entry("web_server", "a web server"),
            Map.entry("web_client", "browser/client-side code"),
            Map.entry("desktop_gui", "a desktop application"),
            Map.entry("cli_developer_tool", "a developer command-line tool"),
            Map.entry("test", "test code"),
            Map.entry("library", "a library"),
            Map.entry("unknown", "an unspecified context")
    );

    private SastDeveloperFacingReasoning() {
    }

    static String sanitize(String reasoning) {
        if (reasoning == null || reasoning.isBlank()) {
            return reasoning;
        }
        String text = reasoning;
        text = EXECUTION_AND_SOURCE.matcher(text).replaceAll(match ->
                "This code runs as " + contextLabel(match.group(1))
                        + " and the value comes from " + sourceLabel(match.group(2)));
        text = INPUT_SOURCE_LABEL.matcher(text).replaceAll(match ->
                "the value comes from " + sourceLabel(match.group(1)));
        text = EXECUTION_CONTEXT_LABEL.matcher(text).replaceAll(match ->
                "this code runs as " + contextLabel(match.group(1)));
        text = ORIGIN_TAG.matcher(text).replaceAll("all discovered call sites pass string literals or named constants");
        text = EVIDENCE_CATEGORY.matcher(text).replaceAll("");
        text = CONFIDENCE_BAND.matcher(text).replaceAll("");
        text = MID_CONFIDENCE.matcher(text).replaceAll("");

        for (Map.Entry<String, String> replacement : scoringPhraseReplacements().entrySet()) {
            text = replaceLiteral(text, replacement.getKey(), replacement.getValue());
        }
        text = MULTI_SPACE.matcher(text).replaceAll(" ");
        text = text.replace(" .", ".").replace(" ,", ",").replace(" ;", ";");
        return text.trim();
    }

    /**
     * Scoring jargon only — never code-like tokens such as {@code http_request} or {@code config_file}.
     */
    private static Map<String, String> scoringPhraseReplacements() {
        Map<String, String> phrases = new LinkedHashMap<>();
        phrases.put("RISKY SCHEME: ", "");
        phrases.put("RISKY SCHEME", "string-built SQL");
        phrases.put("PROVEN_SOURCE_UNTRUSTED", "untrusted source");
        phrases.put("PROVEN_SOURCE_TRUSTED", "trusted source");
        phrases.put("PROVEN_SOURCE_DOM", "DOM content");
        phrases.put("Deterministic FALSE_POSITIVE.", "");
        phrases.put("Deterministic FALSE_POSITIVE", "");
        phrases.put("origin-tag", "call-site evidence");
        phrases.put("Prompt profile:", "");
        phrases.put("Policy profile:", "");
        return phrases;
    }

    private static String replaceLiteral(String text, String from, String to) {
        text = text.replace(from, to);
        if (!from.equals(from.toLowerCase(Locale.ROOT))) {
            text = text.replace(from.toLowerCase(Locale.ROOT), to);
        }
        return text;
    }

    private static String sourceLabel(String raw) {
        if (raw == null) {
            return "an unknown origin";
        }
        return SOURCE_LABELS.getOrDefault(raw.toLowerCase(Locale.ROOT), raw.replace('_', ' '));
    }

    private static String contextLabel(String raw) {
        if (raw == null) {
            return "an unspecified context";
        }
        return CONTEXT_LABELS.getOrDefault(raw.toLowerCase(Locale.ROOT), raw.replace('_', ' '));
    }
}
