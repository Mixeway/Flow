package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class SastDeveloperFacingReasoningTest {

    @Test
    void stripsScoringTaxonomyAndKeepsCodeFacts() {
        String raw = "Evidence category is PROVEN_SOURCE_UNTRUSTED — HTTP source is visible. "
                + "Execution context is web_server with input_source http_request. "
                + "RISKY SCHEME: SQL is concatenated from literals. TRUE_POSITIVE with mid confidence (~0.55). "
                + "origin-tag: all-callsites-pass-literal-arg=true. "
                + "The query is built with userName + \"' AND 1=1\".";

        String cleaned = SastDeveloperFacingReasoning.sanitize(raw);

        assertFalse(cleaned.contains("PROVEN_SOURCE_UNTRUSTED"), cleaned);
        assertFalse(cleaned.contains("execution_context"), cleaned);
        assertFalse(cleaned.contains("input_source"), cleaned);
        assertFalse(cleaned.contains("http_request"), cleaned);
        assertFalse(cleaned.contains("RISKY SCHEME"), cleaned);
        assertFalse(cleaned.contains("mid confidence"), cleaned);
        assertFalse(cleaned.contains("0.55"), cleaned);
        assertFalse(cleaned.contains("origin-tag"), cleaned);
        assertTrue(cleaned.contains("web server") || cleaned.contains("HTTP"), cleaned);
        assertTrue(cleaned.contains("userName"), cleaned);
    }

    @Test
    void mapsTrustedCliContextToPlainLanguage() {
        String cleaned = SastDeveloperFacingReasoning.sanitize(
                "Execution context is cli_developer_tool with input_source internal_call; untrusted input is not proven.");

        assertFalse(cleaned.contains("cli_developer_tool"), cleaned);
        assertFalse(cleaned.contains("internal_call"), cleaned);
        assertTrue(cleaned.toLowerCase().contains("developer command-line")
                || cleaned.toLowerCase().contains("internal application"), cleaned);
    }

    @Test
    void doesNotRewriteCodeIdentifiers() {
        String raw = "The handler reads config_file and copies http_request into dest. "
                + "internal_call() builds the path from file.filepath.";

        String cleaned = SastDeveloperFacingReasoning.sanitize(raw);

        assertTrue(cleaned.contains("config_file"), cleaned);
        assertTrue(cleaned.contains("http_request"), cleaned);
        assertTrue(cleaned.contains("internal_call()"), cleaned);
        assertTrue(cleaned.contains("file.filepath"), cleaned);
    }

    @Test
    void dropsConsistencyWarningFromTheExplanation() {
        String raw = "wrapInLink sets href to linkData.url from the image dialog, and link.js is not called. "
                + "Consistency warning: a structurally similar finding was previously classified as FALSE_POSITIVE. "
                + "Re-check whether the same source/sink/primitive case is being judged differently.";

        String cleaned = SastDeveloperFacingReasoning.sanitize(raw);

        assertFalse(cleaned.contains("Consistency warning"), cleaned);
        assertFalse(cleaned.contains("FALSE_POSITIVE"), cleaned);
        assertTrue(cleaned.contains("linkData.url"), cleaned);
    }

    @Test
    void displayWrapsCodeTokensAndBreaksTheParagraph() {
        String raw = "The flagged sink is doc.createElement('p'/'div', attribsAndStyles), which is a DOM element-creation API, "
                + "not an HTML-string insertion sink (innerHTML / insertAdjacentHTML / dangerouslySetInnerHTML / v-html). "
                + "The tag name is a hardcoded literal chosen by a ternary on editor.activeEnterMode ('p' or 'div'), "
                + "and the second argument is a plain properties object. "
                + "The class value comes from alignClasses[1], sourced from editor.config.image2_alignClasses, "
                + "and the style branch is the fixed string 'center'. "
                + "No HTML string is constructed or parsed anywhere in this path.";

        String shown = SastDeveloperFacingReasoning.forDisplay(raw);

        assertTrue(shown.contains("`doc.createElement('p'/'div', attribsAndStyles)`"), shown);
        assertTrue(shown.contains("`innerHTML`"), shown);
        assertTrue(shown.contains("`insertAdjacentHTML`"), shown);
        assertTrue(shown.contains("`dangerouslySetInnerHTML`"), shown);
        assertTrue(shown.contains("`v-html`"), shown);
        assertTrue(shown.contains("`editor.activeEnterMode`"), shown);
        assertTrue(shown.contains("`alignClasses[1]`"), shown);
        assertTrue(shown.contains("`editor.config.image2_alignClasses`"), shown);
        assertTrue(shown.contains("`center`") || shown.contains("`'center'`"), shown);
        assertTrue(shown.contains("\n\n"), shown);
        assertFalse(shown.contains("`DOM`"), shown);
        assertFalse(shown.contains("`HTML`"), shown);
        assertFalse(shown.contains("``"), shown);
    }

    @Test
    void displayDoesNotDoubleWrapExistingCode() {
        String shown = SastDeveloperFacingReasoning.forDisplay(
                "The value reaches `innerHTML` from editor.config.image2_alignClasses.");

        assertTrue(shown.contains("`innerHTML`"), shown);
        assertTrue(shown.contains("`editor.config.image2_alignClasses`"), shown);
        assertFalse(shown.contains("``innerHTML``"), shown);
    }

    @Test
    void recommendationIsKeptOnlyForTruePositive() {
        assertNull(SastDeveloperFacingReasoning.recommendationForDisplay("FALSE_POSITIVE", "No change."));
        assertNull(SastDeveloperFacingReasoning.recommendationForDisplay("UNCERTAIN", "Check the source."));
        assertNull(SastDeveloperFacingReasoning.recommendationForDisplay("TRUE_POSITIVE", null));
        assertTrue(SastDeveloperFacingReasoning.recommendationForDisplay("TRUE_POSITIVE", "Use a placeholder for userName.")
                .contains("`userName`"));
    }
}
