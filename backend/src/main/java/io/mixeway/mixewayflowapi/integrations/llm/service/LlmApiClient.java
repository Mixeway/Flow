package io.mixeway.mixewayflowapi.integrations.llm.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.mixeway.mixewayflowapi.db.entity.Settings;
import io.mixeway.mixewayflowapi.domain.settings.FindSettingsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Log4j2
@RequiredArgsConstructor
public class LlmApiClient {

    private static final int MAX_COMPLETION_TOKENS = 4000;
    private static final int TIMEOUT_SECONDS = 240;
    private static final Duration RETRY_WINDOW = Duration.ofMinutes(5);
    private static final Duration NON_200_RETRY_INTERVAL = Duration.ofSeconds(5);

    private final FindSettingsService findSettingsService;
    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

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
        requestBody.put("max_tokens", MAX_COMPLETION_TOKENS);

        long deadline = System.currentTimeMillis() + RETRY_WINDOW.toMillis();
        int attempt = 0;
        while (System.currentTimeMillis() <= deadline) {
            attempt++;
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

                if (responseJson == null) {
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
                if (choices.isArray() && !choices.isEmpty()) {
                    String content = choices.get(0).path("message").path("content").asText("");
                    int promptTokens = root.path("usage").path("prompt_tokens").asInt(0);
                    int completionTokens = root.path("usage").path("completion_tokens").asInt(0);
                    return new LlmResponse(content.trim(), promptTokens, completionTokens);
                }

                if (System.currentTimeMillis() > deadline) {
                    log.warn("[LlmApiClient] No choices in LLM response after retries");
                    return LlmResponse.empty();
                }
                log.warn("[LlmApiClient] No choices in LLM response (attempt {}), retrying.", attempt);
                sleepBeforeRetry();
                continue;

            } catch (WebClientResponseException e) {
                int status = e.getStatusCode().value();
                String body = e.getResponseBodyAsString();

                if (!shouldRetryStatus(status)) {
                    log.warn("[LlmApiClient] Non-retryable HTTP {} from LLM API: {}", status, truncate(body, 500));
                    return LlmResponse.empty();
                }

                if (System.currentTimeMillis() > deadline) {
                    log.warn("[LlmApiClient] LLM API returned HTTP {} after retries: {}", status, truncate(body, 500));
                    return LlmResponse.empty();
                }
                log.warn("[LlmApiClient] LLM API returned HTTP {} (attempt {}), retrying: {}",
                        status, attempt, truncate(body, 500));
                sleepBeforeRetry();
            } catch (Exception e) {
                log.warn("[LlmApiClient] LLM API call failed (attempt {}): {}", attempt, e.getMessage());
                if (System.currentTimeMillis() > deadline) {
                    return LlmResponse.empty();
                }
                sleepBeforeRetry();
            }
        }
        return LlmResponse.empty();
    }

    private String truncate(String value, int maxLength) {
        if (value == null || value.length() <= maxLength) {
            return value;
        }
        return value.substring(0, maxLength) + "...";
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
