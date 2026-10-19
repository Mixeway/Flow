package io.mixeway.mixewayflowapi.integrations.llm.service;

import com.fasterxml.jackson.core.json.JsonReadFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import io.mixeway.mixewayflowapi.db.entity.Finding;
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
import java.util.EnumSet;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
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
    private static final ObjectMapper LENIENT_MAPPER = JsonMapper.builder()
            .enable(JsonReadFeature.ALLOW_BACKSLASH_ESCAPING_ANY_CHARACTER)
            .enable(JsonReadFeature.ALLOW_TRAILING_COMMA)
            .enable(JsonReadFeature.ALLOW_UNESCAPED_CONTROL_CHARS)
            .build();

    private final FindSettingsService findSettingsService;
    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();
    /** Set after a server rejects {@code response_format=json_object}, so later calls stay on the prompt fallback. */
    private volatile boolean jsonObjectFormatRejected;

    /** SAST callers keep using the no-arg check; it reads the SAST LLM section. */
    public boolean isEnabled() {
        return isEnabled(Finding.Source.SAST);
    }

    public boolean isEnabled(Finding.Source source) {
        return resolve(source) != null;
    }

    /**
     * Single-shot completion from a system + user prompt (no conversation state).
     * Uses the SAST LLM section.
     */
    public LlmResponse chatCompletion(String systemPrompt, String userPrompt) {
        return chatCompletion(systemPrompt, userPrompt, Finding.Source.SAST);
    }

    public LlmResponse chatCompletion(String systemPrompt, String userPrompt, Finding.Source source) {
        List<Map<String, Object>> messages = List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", userPrompt)
        );
        return chatCompletion(messages, false, source);
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
        return chatCompletion(messages, forceJsonObject, Finding.Source.SAST);
    }

    public LlmResponse chatCompletion(List<Map<String, Object>> messages, boolean forceJsonObject, Finding.Source source) {
        LlmCredentials credentials = resolve(source);
        if (credentials == null) {
            return LlmResponse.empty();
        }
        if (messages == null || messages.isEmpty()) {
            return LlmResponse.empty();
        }

        String url = credentials.url.replaceAll("/+$", "");
        boolean finalOnly = forceJsonObject && requestsFinalOnly(messages);
        List<Map<String, Object>> jsonFallbackMessages = forceJsonObject
                ? withPromptSchemaFallback(messages, finalOnly)
                : messages;
        return doPost(url, credentials, jsonFallbackMessages, false, forceJsonObject);
    }

    private LlmCredentials resolve(Finding.Source source) {
        if (source == null) {
            return null;
        }
        Settings settings = findSettingsService.get();
        if (settings == null) {
            return null;
        }
        if (!settings.isSourceLlmConfigured(source)) {
            return null;
        }
        return new LlmCredentials(
                source,
                settings.sourceLlmApiUrl(source),
                settings.sourceLlmApiKey(source),
                settings.sourceLlmModel(source),
                sanitizeMaxTokens(settings.sourceLlmContextWindow(source))
        );
    }

    public int scanConcurrency(Finding.Source source) {
        Settings settings = findSettingsService.get();
        if (settings == null || source == null) {
            return 2;
        }
        int configured = settings.sourceLlmScanConcurrency(source);
        return configured < 1 ? 2 : configured;
    }

    public Set<Finding.Severity> analysisSeverities(Finding.Source source) {
        Settings settings = findSettingsService.get();
        if (settings == null || source == null) {
            return EnumSet.of(Finding.Severity.CRITICAL, Finding.Severity.HIGH);
        }
        return settings.sourceLlmSeverities(source);
    }

    private LlmResponse doPost(String url, LlmCredentials credentials,
                               List<Map<String, Object>> messages, boolean reducedReasoning,
                               boolean requestJsonObject) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", credentials.model);
        int maxTokensForCall = credentials.contextWindow;
        requestBody.put("messages", messages);
        requestBody.put("temperature", 0.0);
        requestBody.put("max_tokens", maxTokensForCall);
        boolean sendJsonObject = requestJsonObject && !jsonObjectFormatRejected;
        if (sendJsonObject) {
            requestBody.put("response_format", Map.of("type", "json_object"));
        }
        if (reducedReasoning) {
            // OpenAI-style servers read reasoning_effort; Qwen-family chat templates (vLLM/SGLang) read enable_thinking.
            requestBody.put("reasoning_effort", "low");
            requestBody.put("chat_template_kwargs", Map.of("enable_thinking", false));
        }

        long callId = CALL_SEQ.incrementAndGet();
        int promptChars = totalPromptChars(messages);
        log.debug("[LlmApiClient] req#{} source={} POST {} model={} messages={} prompt_chars={} max_tokens={} reduced_reasoning={}",
                callId, credentials.source, url, credentials.model, messages.size(), promptChars, maxTokensForCall,
                reducedReasoning);

        long deadline = System.currentTimeMillis() + RETRY_WINDOW.toMillis();
        int attempt = 0;
        while (System.currentTimeMillis() <= deadline) {
            attempt++;
            long startedAt = System.currentTimeMillis();
            try {
                String responseJson = webClient.post()
                        .uri(url)
                        .header("Authorization", "Bearer " + credentials.apiKey)
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
                String content = messageText(contentNode);
                String reasoningText = extraFieldText(message, "reasoning_content", "reasoning");
                if (!containsJsonObject(content) && containsJsonObject(reasoningText)) {
                    content = reasoningText;
                } else if (content.isBlank() && !reasoningText.isBlank()) {
                    content = reasoningText;
                }
                log.debug("[LlmApiClient] req#{} attempt={} elapsedMs={} raw_len={} finish_reason={} usage={} content_len={} content_blank={} reasoning_len={}",
                        callId, attempt, elapsedMs, responseJson.length(), finishReason(root), usageSummary(root),
                        content.length(), content.isBlank(),
                        extraFieldLen(message, "reasoning_content", "reasoning"));

                if (choices.isArray() && !choices.isEmpty()) {
                    int promptTokens = root.path("usage").path("prompt_tokens").asInt(0);
                    int completionTokens = root.path("usage").path("completion_tokens").asInt(0);
                    if (content.isBlank()) {
                        String reason = finishReason(root);
                        log.warn("[LlmApiClient] req#{} HTTP 200 but empty message.content (finish_reason={}, usage={}, content_node={}, reasoning_len={})",
                                callId, reason, usageSummary(root), contentNodeType(contentNode),
                                extraFieldLen(message, "reasoning_content", "reasoning"));
                        if ("length".equals(reason) && !reducedReasoning) {
                            log.warn("[LlmApiClient] req#{} output budget exhausted before content; retrying with reduced reasoning",
                                    callId);
                            return doPost(url, credentials, messages, true, requestJsonObject);
                        }
                    }
                    if (shouldRetryProseOnly(requestJsonObject, reducedReasoning, content)) {
                        log.warn("[LlmApiClient] req#{} JSON requested but content has no JSON object (finish_reason={}, content_len={}); "
                                        + "retrying with reduced reasoning",
                                callId, finishReason(root), content.length());
                        LlmResponse retried = doPost(url, credentials, messages, true, requestJsonObject);
                        if (!retried.isEmpty()) {
                            return retried;
                        }
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

                if (status == 400 && sendJsonObject && responseFormatRejected(e)) {
                    jsonObjectFormatRejected = true;
                    log.warn("[LlmApiClient] req#{} server rejected response_format=json_object; retrying with prompt-only JSON",
                            callId);
                    return doPost(url, credentials, messages, reducedReasoning, false);
                }

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
        return extraFieldText(message, names).length();
    }

    private static String extraFieldText(JsonNode message, String... names) {
        if (message == null || !message.isObject()) {
            return "";
        }
        for (String name : names) {
            JsonNode node = message.get(name);
            if (node != null && node.isTextual() && !node.asText("").isBlank()) {
                return node.asText("");
            }
        }
        return "";
    }

    private static String messageText(JsonNode content) {
        if (content == null || content.isNull() || content.isMissingNode()) {
            return "";
        }
        if (content.isTextual()) {
            return content.asText("");
        }
        if (content.isArray()) {
            StringBuilder text = new StringBuilder();
            for (JsonNode part : content) {
                String piece = "";
                if (part.isTextual()) {
                    piece = part.asText("");
                } else if (part.isObject() && part.path("text").isTextual()) {
                    piece = part.path("text").asText("");
                }
                if (!piece.isBlank()) {
                    if (!text.isEmpty()) {
                        text.append('\n');
                    }
                    text.append(piece);
                }
            }
            return text.toString();
        }
        return content.asText("");
    }

    /**
     * Thinking models sometimes write their whole analysis into {@code content} and never emit
     * the object; with thinking disabled they usually answer with the JSON directly.
     */
    static boolean shouldRetryProseOnly(boolean requestJsonObject, boolean reducedReasoning, String content) {
        return requestJsonObject && !reducedReasoning && content != null && !content.isBlank()
                && !containsParsableJsonObject(content);
    }

    private static boolean containsParsableJsonObject(String value) {
        int attempts = 0;
        for (int i = value.indexOf('{'); i >= 0 && attempts < 64; i = value.indexOf('{', i + 1), attempts++) {
            try {
                JsonNode node = LENIENT_MAPPER.readTree(value.substring(i));
                if (node != null && node.isObject()) {
                    return true;
                }
            } catch (Exception ignored) {
                // Not an object starting here; try the next brace.
            }
        }
        return false;
    }

    private static boolean containsJsonObject(String value) {
        if (value == null) {
            return false;
        }
        int open = value.indexOf('{');
        return open >= 0 && value.indexOf('}', open + 1) > open;
    }

    private static boolean responseFormatRejected(WebClientResponseException exception) {
        String body = exception.getResponseBodyAsString();
        if (body == null || body.isBlank()) {
            return false;
        }
        String lower = body.toLowerCase(Locale.ROOT);
        return lower.contains("response_format") || lower.contains("json_object") || lower.contains("json_schema");
    }

    private boolean shouldRetryStatus(int status) {
        return status == 408 || status == 429 || status >= 500;
    }

    private List<Map<String, Object>> withPromptSchemaFallback(List<Map<String, Object>> messages, boolean finalOnly) {
        List<Map<String, Object>> augmentedMessages = new ArrayList<>(messages);
        augmentedMessages.add(Map.of(
                "role", "user",
                "content", schemaFallbackInstruction(finalOnly)
        ));
        return augmentedMessages;
    }

    /**
     * The forced-final turn already told the model to stop calling tools. The generic schema
     * lists {@code search_repo} and {@code read_file} as allowed, and because it is appended
     * last the model treats that as permission to investigate again.
     */
    static boolean requestsFinalOnly(List<Map<String, Object>> messages) {
        String last = lastUserContent(messages).toLowerCase(Locale.ROOT);
        return last.contains("do not request any tool")
                || last.contains("do not request a tool")
                || last.contains("stop investigating")
                || last.contains("stop searching");
    }

    static String schemaFallbackInstruction(boolean finalOnly) {
        if (finalOnly) {
            return "RESPONSE FORMAT REQUIREMENT:\n"
                    + "Return ONLY one valid JSON object. No markdown, no prose, no tool request.\n"
                    + "Required shape: {\"action\":\"final\",\"verdict\":\"TRUE_POSITIVE|FALSE_POSITIVE|UNCERTAIN\","
                    + "\"confidence\":0.0-1.0,\"reasoning\":\"3-6 sentences\"}.\n"
                    + "verdict must be exactly TRUE_POSITIVE, FALSE_POSITIVE, or UNCERTAIN.\n"
                    + "confidence must be a JSON number from 0.0 to 1.0.\n"
                    + "Do not request any tool.";
        }
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

    private static String lastUserContent(List<Map<String, Object>> messages) {
        if (messages == null) {
            return "";
        }
        for (int i = messages.size() - 1; i >= 0; i--) {
            Map<String, Object> message = messages.get(i);
            if (message != null && "user".equals(message.get("role"))) {
                Object content = message.get("content");
                return content == null ? "" : content.toString();
            }
        }
        return "";
    }

    private void sleepBeforeRetry() {
        try {
            Thread.sleep(NON_200_RETRY_INTERVAL.toMillis());
        } catch (InterruptedException interruptedException) {
            Thread.currentThread().interrupt();
        }
    }

    private record LlmCredentials(Finding.Source source, String url, String apiKey, String model, int contextWindow) {
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
