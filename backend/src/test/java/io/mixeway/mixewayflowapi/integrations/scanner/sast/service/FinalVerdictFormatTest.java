package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class FinalVerdictFormatTest {

    private static final String ANALYSIS_FIRST = """
            {"action":"final",
             "analysis":{"source":"request.args['id'] in views.py:41","sink":"cursor.execute(query) in db.py:88",
                         "neutralizer_on_path":"none; validate_id() is not called here",
                         "deciding_fact":"untrusted id is concatenated into SQL"},
             "reasoning":"The id parameter flows into cursor.execute via string concatenation.",
             "verdict":"TRUE_POSITIVE","confidence":0.85}
            """;

    @Test
    void analysisFirstAnswerStillParses() {
        JsonNode node = SastReactResponseParser.tryParse(ANALYSIS_FIRST);
        SastReactResponseParser.StageOneView view = SastReactResponseParser.stageOne(node);
        assertNull(view.failure());
        assertEquals("TRUE_POSITIVE", view.verdict());
        assertEquals(0.85d, view.confidence(), 1e-9);
        assertEquals("The id parameter flows into cursor.execute via string concatenation.", view.reasoning());
    }

    @Test
    void summaryFlattensAnalysisAndTraceEffect() {
        JsonNode node = SastReactResponseParser.tryParse("""
                {"action":"final","trace_effect":"NAME is the literal email; nothing decisive changed",
                 "analysis":{"source":"literal \\"email\\"","sink":"setattr in views.py:12",
                             "neutralizer_on_path":"","deciding_fact":"attacker cannot choose the attribute"},
                 "verdict":"FALSE_POSITIVE","confidence":0.8,"reasoning":"Fixed attribute name."}
                """);
        String summary = FinalVerdictFormat.summary(node);
        assertTrue(summary.startsWith("trace_effect=NAME is the literal email"));
        assertTrue(summary.contains("sink=setattr in views.py:12"));
        assertTrue(summary.contains("deciding_fact=attacker cannot choose the attribute"));
        assertFalse(summary.contains("neutralizer_on_path"));
    }

    @Test
    void summaryIsEmptyWithoutAnalysis() {
        JsonNode node = SastReactResponseParser.tryParse(
                "{\"action\":\"final\",\"verdict\":\"UNCERTAIN\",\"confidence\":0.5,\"reasoning\":\"x\"}");
        assertEquals("", FinalVerdictFormat.summary(node));
        assertEquals("", FinalVerdictFormat.summary(null));
    }

    @Test
    void evidenceFieldsComeBeforeTheVerdict() {
        String order = FinalVerdictFormat.STAGE_TWO_FIELDS;
        assertTrue(order.indexOf("analysis") < order.indexOf("verdict"));
        assertTrue(order.indexOf("reasoning") < order.indexOf("verdict"));
        assertTrue(order.indexOf("false_positive_evidence") < order.indexOf("verdict"));
        assertTrue(order.indexOf("verdict") < order.indexOf("remediation_code"));
    }
}
