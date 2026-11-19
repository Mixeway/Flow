package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class SastDeveloperFacingReasoningTest {

    @Test
    void promptRuleRequiresPlainLanguageAndInternalScratchFields() {
        String rule = SastDeveloperFacingReasoning.PROMPT_RULE;
        assertTrue(rule.contains("analysis") || rule.contains("review_notes"), rule);
        assertTrue(rule.contains("http_request") && rule.contains("never"), rule);
        assertTrue(rule.toLowerCase().contains("ordinary words")
                || rule.toLowerCase().contains("web request"), rule);
    }

    @Test
    void sanitizeDoesNotRewriteContent() {
        String raw = "Execution context is web_server with input_source http_request. "
                + "The query is built with userName.";
        assertEquals(raw, SastDeveloperFacingReasoning.sanitize(raw));
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
    void escapesBareHtmlTagsSoTheMarkdownViewerCannotSwallowTheRest() {
        String raw = "The escaping happens before the span tags are inserted, so any <script> or other "
                + "markup in the JSON data is neutralized. The output is rendered via dangerouslySetInnerHTML.";

        String shown = SastDeveloperFacingReasoning.forDisplay(raw);

        assertTrue(shown.contains("`<script>`"), shown);
        assertTrue(shown.contains("neutralized"), shown);
        assertTrue(shown.contains("dangerouslySetInnerHTML"), shown);
    }

    @Test
    void escapesClosingHtmlTagsToo() {
        String raw = "wrapInLink builds </script><img src=x onerror=alert(1)> from untrusted linkData.url.";

        String shown = SastDeveloperFacingReasoning.forDisplay(raw);

        assertTrue(shown.contains("`</script>`"), shown);
        assertTrue(shown.contains("`<img src=x onerror=alert(1)>`")
                || shown.contains("`<img src=x onerror=alert(1)"), shown);
        assertTrue(shown.contains("linkData.url"), shown);
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
