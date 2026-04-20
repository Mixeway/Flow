package io.mixeway.mixewayflowapi.integrations.ollama.service;

import io.mixeway.mixewayflowapi.integrations.ollama.dto.FpVerdictDto;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class OllamaResponseParserTest {

    private final OllamaResponseParser parser = new OllamaResponseParser();

    @Test
    void parsesPlainJson() {
        Optional<FpVerdictDto> v = parser.parseVerdictJson(
                "{\"verdict\":\"REAL_ISSUE\",\"confidence\":\"HIGH\",\"reasoning\":\"x\"}");
        assertTrue(v.isPresent());
        assertEquals("REAL_ISSUE", v.get().getVerdict());
        assertEquals("HIGH", v.get().getConfidence());
    }

    @Test
    void parsesJsonWithSurroundingText() {
        Optional<FpVerdictDto> v = parser.parseVerdictJson(
                "Here is the result:\n{\"verdict\":\"FALSE_POSITIVE\",\"confidence\":\"MEDIUM\",\"reasoning\":\"ok\"}\nthanks");
        assertTrue(v.isPresent());
        assertEquals("FALSE_POSITIVE", v.get().getVerdict());
    }

    @Test
    void emptyReturnsEmpty() {
        assertTrue(parser.parseVerdictJson("").isEmpty());
        assertTrue(parser.parseVerdictJson("   ").isEmpty());
    }
}
