package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class SinkArgumentParserUnwrapTest {

    private final SinkArgumentParser parser = new SinkArgumentParser();

    @Test
    void unwrapsXssInnerHtmlThroughMethodCall() {
        String extract = "document.body.innerHTML= editArea.get_translation(document.body.innerHTML, \"template\");";
        SinkArgumentParser.SinkAnalysis analysis = parser.analyze(extract);
        assertEquals("document.body.innerHTML", analysis.primaryCandidate());
    }

    @Test
    void unwrapsXssInnerHtmlThroughI18nHelper() {
        String extract = "el.innerHTML = i18n.t(el.innerHTML);";
        SinkArgumentParser.SinkAnalysis analysis = parser.analyze(extract);
        assertEquals("el.innerHTML", analysis.primaryCandidate());
    }

    @Test
    void keepsSimpleXssIdentifier() {
        String extract = "button.innerHTML = originalHtml;";
        SinkArgumentParser.SinkAnalysis analysis = parser.analyze(extract);
        assertEquals("originalHtml", analysis.primaryCandidate());
    }

    @Test
    void unwrapsSqlExecuteThroughBuilder() {
        String extract = "cursor.execute(build(q));";
        SinkArgumentParser.SinkAnalysis analysis = parser.analyze(extract);
        assertEquals("q", analysis.primaryCandidate());
    }

    @Test
    void unwrapsNestedMarkSafeTranslate() {
        String extract = "mark_safe(translate(body))";
        SinkArgumentParser.SinkAnalysis analysis = parser.analyze(extract);
        assertEquals("body", analysis.primaryCandidate());
    }

    @Test
    void unwrapsPickleLoadsThroughDecrypt() {
        String extract = "pickle.loads(decrypt(data))";
        SinkArgumentParser.SinkAnalysis analysis = parser.analyze(extract);
        assertEquals("data", analysis.primaryCandidate());
    }

    @Test
    void keepsEmptyMethodCallAsCandidateForTrustBoundary() {
        String extract = "request.setAttribute(HTTP_ATTRIBUTE_CONFIG_ID, filterConfig.getId());";
        SinkArgumentParser.SinkAnalysis analysis = parser.analyze(extract);
        assertEquals("filterConfig.getId", analysis.primaryCandidate());
    }

    @Test
    void literalInnerHtmlRemainsImmediatelySafeWhenEntireExtractIsLiteral() {
        String extract = "\"safe\"";
        SinkArgumentParser.SinkAnalysis analysis = parser.analyze(extract);
        assertNotNull(analysis);
        assertFalse(analysis.immediatelyUntrusted());
    }
}
