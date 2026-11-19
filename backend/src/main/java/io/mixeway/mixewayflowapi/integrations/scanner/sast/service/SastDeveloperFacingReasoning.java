package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Formats user-visible reasoning for display. Content policy (no scanner jargon, plain-language
 * origin/context) is enforced by the prompt contract {@link #PROMPT_RULE} and by splitting
 * internal scratch fields ({@code analysis} / {@code review_notes}) from developer prose
 * ({@code reasoning} / {@code explanation}) — not by post-hoc label maps.
 */
public final class SastDeveloperFacingReasoning {

    /**
     * Audience split for the model. Do not maintain a dictionary of enum→phrase rewrites here;
     * teach plain language in the prompt instead.
     */
    static final String PROMPT_RULE =
            "Split your writing by audience. "
                    + "Put every scanner/heuristic/scoring thought (categories, call-site tags, confidence, "
                    + "checklist/guidance references, upgrade/downgrade talk, review constraints, and the raw "
                    + "enum tokens for execution_context / input_source) only in the internal field "
                    + "(`analysis` or `review_notes`). "
                    + "User-visible `reasoning`/`explanation` is a note for a developer who never saw this "
                    + "scanner: trace the concrete code path as fully as the shown code allows. "
                    + "Name the exact identifiers at each hop — the variable, parameter, prop, field, or property "
                    + "that carries the value (e.g. `config.loaderUrl`), the function/component that holds it "
                    + "(e.g. `GenesysWidget`), and the exact sink call and its argument (e.g. "
                    + "`dangerouslySetInnerHTML` `__html`). "
                    + "Walk it as source → each intermediate assignment/transform → sink, and for every hop that "
                    + "the shown code does not prove, say plainly what is missing (e.g. no caller passes the "
                    + "`config` prop, so the value written into the `<script>` body is unknown) and how that "
                    + "missing fact changes whether it is exploitable. "
                    + "If you mention where the code runs or where the value comes from, use ordinary "
                    + "words (e.g. web request, browser, desktop UI, developer CLI, configuration, environment "
                    + "variable) — never snake_case labels such as http_request or cli_developer_tool. "
                    + "Do not refer to instructions, guidance, checklists, tags, or scoring. "
                    + "Wrap code identifiers, calls, property paths, and short literals in single backticks.";

    private static final Pattern CODE_SPAN = Pattern.compile(
            "(?<![\\w`])(?:"
                    + "</?[A-Za-z][\\w:-]*(?:\\s[^<>\\n`]{0,80})?/?>"
                    + "|[A-Za-z_][\\w]*(?:\\.[A-Za-z_][\\w]*)+(?:\\[[^\\]\\n`]+\\])?(?:\\([^)\\n`]{0,120}\\))?"
                    + "|[A-Za-z_][\\w]*\\[[^\\]\\n`]+\\]"
                    + "|[A-Za-z_][\\w]*\\([^)\\n`]{0,120}\\)"
                    + "|[A-Za-z][a-z0-9]*(?:[A-Z][a-z0-9]*)+"
                    + "|[A-Za-z][\\w]*_[A-Za-z0-9_]+"
                    + "|v-html"
                    + "|'(?:[^'\\n]){1,40}'"
                    + "|\"(?:[^\"\\n]){1,60}\""
                    + ")(?![\\w`])");

    private SastDeveloperFacingReasoning() {
    }

    /** Identity for callers that still invoke sanitize; content cleanup is prompt-driven. */
    static String sanitize(String reasoning) {
        return reasoning == null ? null : reasoning.trim();
    }

    /**
     * Markdown the finding panel can render: code tokens in backticks and light paragraph breaks.
     */
    public static String forDisplay(String reasoning) {
        String text = sanitize(reasoning);
        if (text == null || text.isBlank()) {
            return text;
        }
        return highlightCode(paragraphs(text));
    }

    public static String recommendationForDisplay(String verdict, String recommendation) {
        if (!"TRUE_POSITIVE".equals(verdict) || recommendation == null || recommendation.isBlank()) {
            return null;
        }
        return highlightCode(recommendation.trim());
    }

    private static String paragraphs(String text) {
        if (text.indexOf('\n') >= 0) {
            return text;
        }
        String[] sentences = text.split("(?<=[.!?])\\s+(?=[A-Z\"'`])");
        if (sentences.length < 3) {
            return text;
        }
        StringBuilder out = new StringBuilder();
        for (int i = 0; i < sentences.length; i++) {
            if (i > 0) {
                out.append(i % 2 == 0 ? "\n\n" : " ");
            }
            out.append(sentences[i].trim());
        }
        return out.toString();
    }

    private static boolean isPlainAcronym(String token) {
        return token != null
                && token.length() <= 6
                && token.equals(token.toUpperCase(java.util.Locale.ROOT))
                && token.indexOf('_') < 0
                && token.indexOf('.') < 0
                && token.indexOf('(') < 0
                && token.indexOf('\'') < 0
                && token.indexOf('"') < 0;
    }

    private static String highlightCode(String text) {
        StringBuilder out = new StringBuilder();
        int i = 0;
        while (i < text.length()) {
            if (text.startsWith("```", i)) {
                int end = text.indexOf("```", i + 3);
                if (end < 0) {
                    out.append(text.substring(i));
                    break;
                }
                out.append(text, i, end + 3);
                i = end + 3;
                continue;
            }
            if (text.charAt(i) == '`') {
                int end = text.indexOf('`', i + 1);
                if (end < 0) {
                    out.append(text.substring(i));
                    break;
                }
                out.append(text, i, end + 1);
                i = end + 1;
                continue;
            }
            Matcher match = CODE_SPAN.matcher(text);
            match.region(i, text.length());
            if (match.lookingAt() && !isPlainAcronym(match.group())) {
                out.append('`').append(match.group()).append('`');
                i = match.end();
                continue;
            }
            out.append(text.charAt(i));
            i++;
        }
        return out.toString();
    }
}
