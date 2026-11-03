package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

class SastConversationHistoryTest {

    @Test
    void onlyTheStageTwoAnswerIsAppended() {
        List<Map<String, Object>> messages = new ArrayList<>();
        messages.add(Map.of("role", "user", "content", "TOOL RESULT (read_file):\n1| x = 1"));

        SastFindingVerificationService.rememberFinalAnswer(messages, "{\"action\":\"final\",\"verdict\":\"FALSE_POSITIVE\"}");

        assertEquals(2, messages.size());
        assertEquals("assistant", messages.get(1).get("role"));
    }

    @Test
    void blankAnswerIsNotAppended() {
        List<Map<String, Object>> messages = new ArrayList<>();

        SastFindingVerificationService.rememberFinalAnswer(messages, " ");
        SastFindingVerificationService.rememberFinalAnswer(messages, null);
        SastFindingVerificationService.rememberFinalAnswer(null, "{}");

        assertEquals(0, messages.size());
    }
}
