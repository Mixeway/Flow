package io.mixeway.mixewayflowapi.integrations.llm.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.mixeway.mixewayflowapi.db.entity.Settings;
import io.mixeway.mixewayflowapi.domain.settings.FindSettingsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import jakarta.annotation.PostConstruct;

import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

@Service
@Log4j2
@RequiredArgsConstructor
public class LlmApiClient {

    private static final int DEFAULT_MAX_TOKENS = 16000;
    private static final int TIMEOUT_SECONDS = 240;
    private static final Duration RETRY_WINDOW = Duration.ofMinutes(5);
    private static final Duration NON_200_RETRY_INTERVAL = Duration.ofSeconds(5);
    private static final AtomicLong CALL_SEQ = new AtomicLong();

    private final FindSettingsService findSettingsService;
    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Completion budget sent as {@code max_tokens}. Reasoning models (Ornith/vLLM)
     * share this budget with thinking tokens, so 4000 is too small.
     * Override with env {@code LLM_MAX_TOKENS}.
     */
    @Value("${llm.max-tokens:16000}")
    private int maxTokens;

    @PostConstruct
    void logTokenBudget() {
        maxTokens = sanitizeMaxTokens(maxTokens);
        log.info("[LlmApiClient] Using max_tokens={} (override with LLM_MAX_TOKENS)", maxTokens);
    }

    public boolean isEnabled() {
        Settings s = findSettingsService.get();
        return s != null
                && s.isEnableLlmEvaluation()
                && s.getLlmApiUrl() != null && !s.getLlmApiUrl().isBlank()
                && s.getLlmApiKey() != null && !s.getLlmApiKey().isBlank()
                && s.getLlmModel() != null && !s.getLlmModel().isBlank();
    }

    /**
     * Single-shot completion from a system + user prompt (no conversation state).
     */
    public LlmResponse chatCompletion(String systemPrompt, String userPrompt) {
        List<Map<String, Object>> messages = List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", userPrompt)
        );
        return chatCompletion(messages, false);
    }

    /**
     * Completion over a full message list, used to drive multi-turn (ReAct-style)
     * conversations where the caller owns the loop. Works with any OpenAI-compatible
     * chat model — no native function-calling support is required.
     *
     * @param messages       the full conversation so far (system, user, assistant, …)
     * @param forceJsonObject appends a strict JSON-output instruction to the prompt
     *                        to push the model toward valid JSON output.
     */
    public LlmResponse chatCompletion(List<Map<String, Object>> messages, boolean forceJsonObject) {
        if (!isEnabled()) {
            return LlmResponse.empty();
        }
        if (messages == null || messages.isEmpty()) {
            return LlmResponse.empty();
        }

        Settings settings = findSettingsService.get();
        String url = settings.getLlmApiUrl().replaceAll("/+$", "");
        String model = settings.getLlmModel();
        List<Map<String, Object>> jsonFallbackMessages = forceJsonObject
                ? withPromptSchemaFallback(messages)
                : messages;
        return doPost(url, settings, model, jsonFallbackMessages);
    }

    private LlmResponse doPost(String url, Settings settings, String model,
                               List<Map<String, Object>> messages) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("messages", messages);
        requestBody.put("temperature", 0.0);
        requestBody.put("max_tokens", maxTokens);

        long callId = CALL_SEQ.incrementAndGet();
        int promptChars = totalPromptChars(messages);
        log.info("[LlmApiClient] req#{} POST {} model={} messages={} prompt_chars={} max_tokens={}",
                callId, url, model, messages.size(), promptChars, maxTokens);

        long deadline = System.currentTimeMillis() + RETRY_WINDOW.toMillis();
        int attempt = 0;
        while (System.currentTimeMillis() <= deadline) {
            attempt++;
            long startedAt = System.currentTimeMillis();
            try {
                String responseJson = webClient.post()
                        .uri(url)
                        .header("Authorization", "Bearer " + settings.getLlmApiKey())
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(requestBody)
                        .retrieve()
                        .bodyToMono(String.class)
                        .timeout(Duration.ofSeconds(TIMEOUT_SECONDS))
                        .block();
                long elapsedMs = System.currentTimeMillis() - startedAt;

                if (responseJson == null) {
                    log.warn("[LlmApiClient] req#{} attempt={} elapsedMs={} HTTP 200 with null body",
                            callId, attempt, elapsedMs);
                    if (System.currentTimeMillis() > deadline) {
                        log.warn("[LlmApiClient] Empty response from LLM API after retries.");
                        return LlmResponse.empty();
                    }
                    log.warn("[LlmApiClient] Empty response from LLM API (attempt {}), retrying.", attempt);
                    sleepBeforeRetry();
                    continue;
                }

                JsonNode root = objectMapper.readTree(responseJson);
                JsonNode choices = root.path("choices");
                JsonNode message = choices.isArray() && !choices.isEmpty() ? choices.get(0).path("message") : null;
                JsonNode contentNode = message == null ? null : message.get("content");
                String content = contentNode == null || contentNode.isNull() || contentNode.isMissingNode()
                        ? ""
                        : contentNode.asText("");
                log.info("[LlmApiClient] req#{} attempt={} elapsedMs={} raw_len={} finish_reason={} usage={} content_len={} content_blank={} reasoning_len={}",
                        callId, attempt, elapsedMs, responseJson.length(), finishReason(root), usageSummary(root),
                        content.length(), content.isBlank(),
                        extraFieldLen(message, "reasoning_content", "reasoning"));

                if (choices.isArray() && !choices.isEmpty()) {
                    int promptTokens = root.path("usage").path("prompt_tokens").asInt(0);
                    int completionTokens = root.path("usage").path("completion_tokens").asInt(0);
                    if (content.isBlank()) {
                        log.warn("[LlmApiClient] req#{} HTTP 200 but empty message.content (finish_reason={}, usage={}, content_node={})",
                                callId, finishReason(root), usageSummary(root), contentNodeType(contentNode));
                    }
                    return new LlmResponse(content.trim(), promptTokens, completionTokens);
                }

                log.warn("[LlmApiClient] req#{} no choices in LLM response (attempt {})", callId, attempt);
                if (System.currentTimeMillis() > deadline) {
                    log.warn("[LlmApiClient] No choices in LLM response after retries");
                    return LlmResponse.empty();
                }
                sleepBeforeRetry();
                continue;

            } catch (WebClientResponseException e) {
                long elapsedMs = System.currentTimeMillis() - startedAt;
                int status = e.getStatusCode().value();
                log.warn("[LlmApiClient] req#{} attempt={} elapsedMs={} HTTP {}",
                        callId, attempt, elapsedMs, status);

                if (!shouldRetryStatus(status)) {
                    log.warn("[LlmApiClient] Non-retryable HTTP {} from LLM API", status);
                    return LlmResponse.empty();
                }

                if (System.currentTimeMillis() > deadline) {
                    log.warn("[LlmApiClient] LLM API returned HTTP {} after retries", status);
                    return LlmResponse.empty();
                }
                log.warn("[LlmApiClient] LLM API returned HTTP {} (attempt {}), retrying", status, attempt);
                sleepBeforeRetry();
            } catch (Exception e) {
                long elapsedMs = System.currentTimeMillis() - startedAt;
                log.warn("[LlmApiClient] req#{} attempt={} elapsedMs={} call failed: {}: {}",
                        callId, attempt, elapsedMs, e.getClass().getSimpleName(), e.getMessage());
                if (System.currentTimeMillis() > deadline) {
                    return LlmResponse.empty();
                }
                sleepBeforeRetry();
            }
        }
        return LlmResponse.empty();
    }

    private static int sanitizeMaxTokens(int configured) {
        if (configured < 256) {
            return DEFAULT_MAX_TOKENS;
        }
        return configured;
    }

    private int totalPromptChars(List<Map<String, Object>> messages) {
        int total = 0;
        if (messages == null) {
            return 0;
        }
        for (Map<String, Object> message : messages) {
            Object content = message == null ? null : message.get("content");
            if (content != null) {
                total += content.toString().length();
            }
        }
        return total;
    }

    private static String finishReason(JsonNode root) {
        if (root == null) {
            return "missing";
        }
        JsonNode choiceReason = root.path("choices").path(0).path("finish_reason");
        if (choiceReason.isTextual() && !choiceReason.asText("").isBlank()) {
            return choiceReason.asText();
        }
        JsonNode rootReason = root.path("finish_reason");
        if (rootReason.isTextual() && !rootReason.asText("").isBlank()) {
            return rootReason.asText();
        }
        return "missing";
    }

    private static String usageSummary(JsonNode root) {
        if (root == null) {
            return "{prompt_tokens=0, completion_tokens=0, total_tokens=0}";
        }
        JsonNode usage = root.path("usage");
        return "{prompt_tokens=" + usage.path("prompt_tokens").asInt(0)
                + ", completion_tokens=" + usage.path("completion_tokens").asInt(0)
                + ", total_tokens=" + usage.path("total_tokens").asInt(0) + "}";
    }

    private static String contentNodeType(JsonNode content) {
        if (content == null || content.isMissingNode()) {
            return "missing";
        }
        if (content.isNull()) {
            return "null";
        }
        if (content.isTextual()) {
            return "text";
        }
        if (content.isArray()) {
            return "array";
        }
        if (content.isObject()) {
            return "object";
        }
        return content.getNodeType().name().toLowerCase();
    }

    private static int extraFieldLen(JsonNode message, String... names) {
        if (message == null || !message.isObject()) {
            return 0;
        }
        for (String name : names) {
            JsonNode node = message.get(name);
            if (node != null && node.isTextual()) {
                return node.asText("").length();
            }
        }
        return 0;
    }

    private boolean shouldRetryStatus(int status) {
        return status == 408 || status == 429 || status >= 500;
    }

    private List<Map<String, Object>> withPromptSchemaFallback(List<Map<String, Object>> messages) {
        List<Map<String, Object>> augmentedMessages = new ArrayList<>(messages);
        augmentedMessages.add(Map.of(
                "role", "user",
                "content", buildPromptSchemaFallbackInstruction()
        ));
        return augmentedMessages;
    }

    private String buildPromptSchemaFallbackInstruction() {
        return "RESPONSE FORMAT REQUIREMENT (prompt-level fallback):\n"
                + "Return ONLY one valid JSON object. No markdown, no prose.\n"
                + "Allowed `action` values: `search_repo`, `read_file`, `final`.\n"
                + "If action is `search_repo`, required keys: action, pattern, path_glob.\n"
                + "If action is `read_file`, required keys: action, path, start_line, end_line.\n"
                + "If action is `final`, required keys: action, execution_context, input_source, verdict, "
                + "confidence, reasoning, recommendation, remediation_code, false_positive_evidence.\n"
                + "Use exactly these enums:\n"
                + "- execution_context: web_server | web_client | cli_developer_tool | test | library | unknown\n"
                + "- input_source: http_request | database | file_untrusted | dom_content | url_fragment | cli_argument_developer | "
                + "internal_call | config_file | environment_variable | unknown\n"
                + "- verdict: TRUE_POSITIVE | FALSE_POSITIVE | UNCERTAIN\n"
                + "confidence must be a number in range [0.0, 1.0].\n"
                + "Do not add any extra top-level fields.";
    }

    private void sleepBeforeRetry() {
        try {
            Thread.sleep(NON_200_RETRY_INTERVAL.toMillis());
        } catch (InterruptedException interruptedException) {
            Thread.currentThread().interrupt();
        }
    }

    public record LlmResponse(String content, int promptTokens, int completionTokens) {
        public boolean isEmpty() {
            return content == null || content.isBlank();
        }

        static LlmResponse empty() {
            return new LlmResponse("", 0, 0);
        }
    }
}
