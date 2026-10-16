package io.mixeway.mixewayflowapi.integrations.llm.service;

import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class LlmApiClientSchemaTest {

    @Test
    void forcedFinalTurnDoesNotReopenToolCalls() {
        List<Map<String, Object>> messages = List.of(
                Map.of("role", "user", "content",
                        "Stop investigating and respond NOW with the final JSON object. Do not request any tool."));

        assertTrue(LlmApiClient.requestsFinalOnly(messages));
        String instruction = LlmApiClient.schemaFallbackInstruction(true);
        assertFalse(instruction.contains("search_repo"));
        assertTrue(instruction.contains("\"action\":\"final\""));
    }

    @Test
    void investigationTurnStillAllowsTools() {
        List<Map<String, Object>> messages = List.of(
                Map.of("role", "user", "content", "TOOL RESULT (search_repo):\nno matches"));

        assertFalse(LlmApiClient.requestsFinalOnly(messages));
        assertTrue(LlmApiClient.schemaFallbackInstruction(false).contains("search_repo"));
    }

    @Test
    void jsonRepairTurnUsesFinalOnlySchema() {
        List<Map<String, Object>> messages = List.of(
                Map.of("role", "user", "content",
                        "Your previous response was not valid JSON. Return exactly one valid JSON object now. "
                                + "Do not request any tool. No markdown, no explanation, no code fences."));

        assertTrue(LlmApiClient.requestsFinalOnly(messages));
    }

    @Test
    void proseWithQuotedCodeIsRetried() {
        String prose = "Let me analyze this finding carefully.\n```java\nif (uri != null) { response.addHeader(\"Location\", uri); }\n```\n"
                + "So the uri comes directly from request.getRequestURI()";

        assertTrue(LlmApiClient.shouldRetryProseOnly(true, false, prose));
        assertFalse(LlmApiClient.shouldRetryProseOnly(true, true, prose));
        assertFalse(LlmApiClient.shouldRetryProseOnly(false, false, prose));
    }

    @Test
    void responseWithVerdictObjectIsNotRetried() {
        String content = "Analysis first.\n```json\n{\"action\":\"final\",\"verdict\":\"TRUE_POSITIVE\",\"confidence\":0.8,}\n```";

        assertFalse(LlmApiClient.shouldRetryProseOnly(true, false, content));
    }
}
