package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import java.util.Locale;
import java.util.Optional;
import java.util.regex.Pattern;

/**
 * Detects proven neutralization / non-injection for ReDoS / dynamic-regex findings
 * (CWE-1333 / CWE-1287 / CWE-625): metacharacter escaping, literal quoting, or
 * RegExp rebuild from an existing pattern's {@code .source}.
 */
final class RegexEscapeEvidence {

    /** Cross-language literal-quoting / metacharacter-escape helpers. */
    private static final Pattern ESCAPE_API_PATTERN = Pattern.compile(
            // Java
            "\\bPattern\\.quote\\s*\\("
                    + "|\\bPattern\\.LITERAL\\b"
                    // Python
                    + "|\\bre\\.escape\\s*\\("
                    + "|\\bregex\\.escape\\s*\\("
                    // JS / TS / lodash
                    + "|\\bescapeRegExp\\s*\\("
                    + "|\\bescapeRegex\\s*\\("
                    + "|\\b_\\.escapeRegExp\\s*\\("
                    + "|\\blodash\\.escapeRegExp\\s*\\("
                    // PHP
                    + "|\\bpreg_quote\\s*\\("
                    // .NET
                    + "|\\bRegex\\.Escape\\s*\\("
                    // Ruby
                    + "|\\bRegexp\\.escape\\s*\\("
                    + "|\\bRegexp\\.quote\\s*\\("
                    // Go
                    + "|\\bregexp\\.QuoteMeta\\s*\\("
                    // Perl
                    + "|\\bquotemeta\\s*\\(",
            Pattern.CASE_INSENSITIVE);

    /**
     * JS/CodeMirror-style: replace a metacharacter class, typically with {@code $&} / {@code \\$&},
     * then feed the result into a regex sink.
     */
    private static final Pattern METACHAR_REPLACE_PATTERN = Pattern.compile(
            "\\.replace\\s*\\(\\s*/[^/\\n]*[\\\\*+?|(){}\\[\\]\\^$][^/\\n]*/[gimsuy]*\\s*,",
            Pattern.CASE_INSENSITIVE);

    /**
     * Rebuild of an existing RegExp from {@code .source} (optionally with new flags).
     * Does not introduce new pattern syntax — assess the original construction site instead.
     * Example: {@code new RegExp(query.source, query.ignoreCase ? "gi" : "g")}
     */
    private static final Pattern REGEXP_SOURCE_REBUILD_PATTERN = Pattern.compile(
            "\\b(?:new\\s+)?RegExp\\s*\\(\\s*[A-Za-z_$][\\w$]*\\.source\\b",
            Pattern.CASE_INSENSITIVE);

    /** Cross-language regex construction / match sinks. */
    private static final Pattern REGEX_SINK_PATTERN = Pattern.compile(
            // JS / TS
            "\\bnew\\s+RegExp\\s*\\(|\\bRegExp\\s*\\("
                    // Java
                    + "|\\bPattern\\.compile\\s*\\("
                    // Python
                    + "|\\bre\\.compile\\s*\\(|\\bre\\.(?:match|search|fullmatch|findall|finditer|sub|split)\\s*\\("
                    // .NET
                    + "|\\bnew\\s+Regex\\s*\\(|\\bRegex\\.(?:IsMatch|Match|Matches|Replace|Split)\\s*\\("
                    // PHP
                    + "|\\bpreg_(?:match|match_all|replace|filter|grep|split)\\s*\\("
                    // Ruby
                    + "|\\bRegexp\\.(?:new|compile)\\s*\\("
                    // Go
                    + "|\\bregexp\\.(?:Compile|MustCompile|MatchString|Match)\\s*\\(",
            Pattern.CASE_INSENSITIVE);

    private RegexEscapeEvidence() {
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
        if (ESCAPE_API_PATTERN.matcher(combined).find()) {
            return true;
        }
        if (REGEXP_SOURCE_REBUILD_PATTERN.matcher(combined).find()) {
            return true;
        }
        String lower = combined.toLowerCase(Locale.ROOT);
        boolean hasSink = REGEX_SINK_PATTERN.matcher(combined).find();
        boolean hasMetacharReplace = METACHAR_REPLACE_PATTERN.matcher(combined).find()
                || combined.contains("$&");
        if (hasSink && hasMetacharReplace) {
            return true;
        }
        // Reviewer phrasing that specifically describes regex neutralization (not HTML escaping).
        return lower.contains("escapes special characters")
                || lower.contains("escape special characters")
                || lower.contains("escaping special characters")
                || lower.contains("escapes regex")
                || lower.contains("escape regex")
                || lower.contains("escaping regex")
                || lower.contains("regex escaping")
                || lower.contains("regexp escaping")
                || lower.contains("metacharacter")
                || lower.contains("meta-character")
                || lower.contains("safe regex construction")
                || lower.contains("literal regex")
                || lower.contains("literal pattern")
                || lower.contains("escaping mitigates")
                || (lower.contains("rebuild") && lower.contains(".source"))
                || lower.contains("query.source")
                || lower.contains("existing regexp")
                || lower.contains("already a regexp");
    }
}
