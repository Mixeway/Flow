package io.mixeway.mixewayflowapi.integrations.llm.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.net.httpserver.HttpServer;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.entity.Settings;
import io.mixeway.mixewayflowapi.domain.settings.FindSettingsService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.CopyOnWriteArrayList;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class LlmApiClientTruncationTest {

    private static final ObjectMapper MAPPER = new ObjectMapper();
    private static final String TRUNCATED_THINKING =
            "Let me check {\"action\":\"read_file\",\"path\":\"a.py\"} first. ".repeat(500);

    private HttpServer server;
    private final List<String> requestBodies = new CopyOnWriteArrayList<>();
    private final Queue<String> responses = new ConcurrentLinkedQueue<>();

    @BeforeEach
    void startServer() throws IOException {
        server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        server.createContext("/", exchange -> {
            requestBodies.add(new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8));
            String body = responses.poll();
            byte[] bytes = (body == null ? "{}" : body).getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, bytes.length);
            try (OutputStream out = exchange.getResponseBody()) {
                out.write(bytes);
            }
        });
        server.start();
    }

    @AfterEach
    void stopServer() {
        server.stop(0);
    }

    @Test
    void truncatedThinkingIsRetriedWithReducedReasoning() throws Exception {
        responses.add(completion("", TRUNCATED_THINKING, "length"));
        responses.add(completion("{\"action\":\"final\",\"verdict\":\"FALSE_POSITIVE\"}", "", "stop"));

        LlmApiClient.LlmResponse response = client("low", false).chatCompletion(userMessage(), true);

        assertEquals(2, requestBodies.size());
        assertFalse(MAPPER.readTree(requestBodies.get(0)).has("reasoning_effort"));
        assertEquals("low", MAPPER.readTree(requestBodies.get(1)).path("reasoning_effort").asText());
        assertTrue(response.content().contains("FALSE_POSITIVE"));
    }

    @Test
    void secondTruncationReturnsEmptyInsteadOfThinking() {
        responses.add(completion("", TRUNCATED_THINKING, "length"));
        responses.add(completion("", TRUNCATED_THINKING, "length"));

        LlmApiClient.LlmResponse response = client("low", false).chatCompletion(userMessage(), true);

        assertEquals(2, requestBodies.size());
        assertTrue(response.isEmpty());
    }

    @Test
    void noReducedReasoningSettingMeansNoIdenticalRetry() {
        responses.add(completion("", TRUNCATED_THINKING, "length"));

        client(null, false).chatCompletion(userMessage(), true);

        assertEquals(1, requestBodies.size());
    }

    @Test
    void disableThinkingCountsAsReducedReasoning() throws Exception {
        responses.add(completion("", TRUNCATED_THINKING, "length"));
        responses.add(completion("{\"action\":\"final\"}", "", "stop"));

        client(null, true).chatCompletion(userMessage(), true);

        assertEquals(2, requestBodies.size());
        assertFalse(MAPPER.readTree(requestBodies.get(1))
                .path("chat_template_kwargs").path("enable_thinking").asBoolean(true));
    }

    @Test
    void answerInReasoningFieldIsStillAcceptedWhenNotTruncated() {
        responses.add(completion("", "{\"action\":\"final\",\"verdict\":\"TRUE_POSITIVE\"}", "stop"));

        LlmApiClient.LlmResponse response = client("low", false).chatCompletion(userMessage(), true);

        assertEquals(1, requestBodies.size());
        assertTrue(response.content().contains("TRUE_POSITIVE"));
    }

    @Test
    void truncationIsJudgedOnRawContent() {
        assertTrue(LlmApiClient.truncatedBeforeAnswer("length", ""));
        assertTrue(LlmApiClient.truncatedBeforeAnswer("length", null));
        assertFalse(LlmApiClient.truncatedBeforeAnswer("length", "{\"action\":\"final\"}"));
        assertFalse(LlmApiClient.truncatedBeforeAnswer("stop", ""));
        assertFalse(LlmApiClient.canReduceReasoning(null, false));
        assertFalse(LlmApiClient.canReduceReasoning(" ", false));
        assertTrue(LlmApiClient.canReduceReasoning("low", false));
        assertTrue(LlmApiClient.canReduceReasoning(null, true));
    }

    private LlmApiClient client(String reasoningEffort, boolean disableThinking) {
        Settings settings = mock(Settings.class);
        when(settings.isSourceLlmConfigured(Finding.Source.SAST)).thenReturn(true);
        when(settings.sourceLlmApiUrl(Finding.Source.SAST))
                .thenReturn("http://127.0.0.1:" + server.getAddress().getPort() + "/v1/chat/completions");
        when(settings.sourceLlmApiKey(Finding.Source.SAST)).thenReturn("key");
        when(settings.sourceLlmModel(Finding.Source.SAST)).thenReturn("model");
        when(settings.sourceLlmContextWindow(Finding.Source.SAST)).thenReturn(16000);
        when(settings.sourceLlmReasoningEffort(Finding.Source.SAST)).thenReturn(reasoningEffort);
        when(settings.sourceLlmDisableThinking(Finding.Source.SAST)).thenReturn(disableThinking);
        FindSettingsService findSettingsService = mock(FindSettingsService.class);
        when(findSettingsService.get()).thenReturn(settings);
        return new LlmApiClient(findSettingsService, WebClient.create());
    }

    private static List<Map<String, Object>> userMessage() {
        return List.of(Map.of("role", "user", "content", "Return the final JSON."));
    }

    private static String completion(String content, String reasoning, String finishReason) {
        try {
            return MAPPER.writeValueAsString(Map.of(
                    "choices", List.of(Map.of(
                            "message", Map.of("role", "assistant", "content", content, "reasoning_content", reasoning),
                            "finish_reason", finishReason)),
                    "usage", Map.of("prompt_tokens", 10, "completion_tokens", 20, "total_tokens", 30)));
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }
}
