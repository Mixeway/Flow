package io.mixeway.mixewayflowapi.integrations.llm.service;

import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;

class LlmApiClientSchemaTest {

    @Test
    void forcedFinalTurnDoesNotReopenToolCalls() {
        List<Map<String, Object>> messages = List.of(
                Map.of("role", "user", "content",
                        "Stop investigating and respond NOW with the final JSON object. Do not request any tool."));

        assertTrue(LlmApiClient.requestsFinalOnly(messages));
        String reminder = LlmApiClient.jsonOnlyReminder(true);
        assertTrue(reminder.contains("Do not request any tool."));
        assertFalse(reminder.contains("search_repo"));
    }

    @Test
    void investigationTurnStillAllowsTools() {
        List<Map<String, Object>> messages = List.of(
                Map.of("role", "user", "content", "TOOL RESULT (search_repo):\nno matches"));

        assertFalse(LlmApiClient.requestsFinalOnly(messages));
        assertFalse(LlmApiClient.jsonOnlyReminder(false).contains("Do not request any tool"));
    }

    @Test
    void reminderIsSentOnlyAfterTheServerRejectedJsonMode() {
        List<Map<String, Object>> messages = List.of(Map.of("role", "user", "content", "Return the hunt JSON."));

        assertSame(messages, LlmApiClient.messagesForCall(messages, true, false));
        assertSame(messages, LlmApiClient.messagesForCall(messages, false, true));

        List<Map<String, Object>> withReminder = LlmApiClient.messagesForCall(messages, true, true);
        assertEquals(2, withReminder.size());
        assertEquals("user", withReminder.get(1).get("role"));
        assertTrue(withReminder.get(1).get("content").toString().startsWith("RESPONSE FORMAT REQUIREMENT"));
    }

    @Test
    void reminderDoesNotImposeAVerdictShape() {
        for (boolean finalOnly : new boolean[]{true, false}) {
            String reminder = LlmApiClient.jsonOnlyReminder(finalOnly);
            assertFalse(reminder.contains("verdict"));
            assertFalse(reminder.contains("execution_context"));
            assertFalse(reminder.contains("input_source"));
            assertTrue(reminder.contains("the instructions above specify"));
        }
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
