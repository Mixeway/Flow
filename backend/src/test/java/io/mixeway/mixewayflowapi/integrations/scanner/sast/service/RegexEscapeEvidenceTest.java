package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class RegexEscapeEvidenceTest {

    @Test
    void detectsCodeMirrorParseQueryEscape() {
        String code = "query = new RegExp(query.replace(/[\\-\\[\\]\\/\\{\\}\\(\\)\\*\\+\\?\\.\\\\\\^\\$\\|]/g, \"\\\\$&\"), "
                + "caseInsensitive ? \"gi\" : \"g\");";
        assertTrue(RegexEscapeEvidence.present(code));
    }

    @Test
    void detectsJavaPatternQuote() {
        assertTrue(RegexEscapeEvidence.present("Pattern.compile(Pattern.quote(userInput));"));
    }

    @Test
    void detectsJavaPatternLiteralFlag() {
        assertTrue(RegexEscapeEvidence.present("Pattern.compile(userInput, Pattern.LITERAL);"));
    }

    @Test
    void detectsPythonReEscape() {
        assertTrue(RegexEscapeEvidence.present("pattern = re.compile(re.escape(user_query))"));
    }

    @Test
    void detectsPhpPregQuote() {
        assertTrue(RegexEscapeEvidence.present("$re = '/' . preg_quote($query, '/') . '/i'; preg_match($re, $haystack);"));
    }

    @Test
    void detectsGoQuoteMeta() {
        assertTrue(RegexEscapeEvidence.present("re := regexp.MustCompile(regexp.QuoteMeta(query))"));
    }

    @Test
    void detectsRubyRegexpEscape() {
        assertTrue(RegexEscapeEvidence.present("re = Regexp.new(Regexp.escape(query))"));
    }

    @Test
    void detectsDotNetRegexEscape() {
        assertTrue(RegexEscapeEvidence.present("var re = new Regex(Regex.Escape(query));"));
    }

    @Test
    void detectsEscapeRegExpHelper() {
        assertTrue(RegexEscapeEvidence.present("const re = new RegExp(escapeRegExp(query), 'g');"));
    }

    @Test
    void detectsReviewerEscapePhrasing() {
        assertTrue(RegexEscapeEvidence.present(
                "new RegExp(query)",
                "parseQuery escapes special characters before constructing the RegExp. This escaping mitigates ReDoS."));
    }

    @Test
    void detectsRegExpSourceRebuild() {
        assertTrue(RegexEscapeEvidence.present(
                "query = new RegExp(query.source, query.ignoreCase ? \"gi\" : \"g\");"));
    }

    @Test
    void rawUserInputToRegExpIsNotEvidence() {
        assertFalse(RegexEscapeEvidence.present("const re = new RegExp(userQuery, 'i');"));
    }

    @Test
    void rawPhpPregMatchIsNotEvidence() {
        assertFalse(RegexEscapeEvidence.present("preg_match('/' . $query . '/', $haystack);"));
    }
}
