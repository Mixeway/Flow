package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import com.fasterxml.jackson.core.json.JsonReadFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.json.JsonMapper;

import java.util.Locale;
import java.util.regex.Pattern;

/**
 * Pulls a verdict object out of the shapes local models actually return:
 * markdown fences, thinking tags, trailing commas, a missing {@code action},
 * and confidence written as a string.
 */
final class SastReactResponseParser {

    private static final Pattern THINKING = Pattern.compile(
            "(?is)<\\s*(think|thinking|redacted_reasoning)\\b[^>]*>.*?</\\s*\\1\\s*>");

    private static final com.fasterxml.jackson.databind.ObjectMapper MAPPER = JsonMapper.builder()
            .enable(JsonReadFeature.ALLOW_BACKSLASH_ESCAPING_ANY_CHARACTER)
            .enable(JsonReadFeature.ALLOW_TRAILING_COMMA)
            .enable(JsonReadFeature.ALLOW_UNESCAPED_CONTROL_CHARS)
            .build();

    enum StageOneFailure {
        MISSING_ACTION,
        MISSING_VERDICT,
        MISSING_CONFIDENCE
    }

    record StageOneView(String verdict, double confidence, String reasoning, StageOneFailure failure) {
        private static StageOneView failed(StageOneFailure failure) {
            return new StageOneView(null, 0.0d, null, failure);
        }
    }

    private SastReactResponseParser() {
    }

    static JsonNode tryParse(String content) {
        try {
            return MAPPER.readTree(extractJson(content));
        } catch (Exception e) {
            return null;
        }
    }

    static String extractJson(String content) {
        if (content == null || content.isBlank()) {
            return "{}";
        }
        String text = THINKING.matcher(content).replaceAll(" ");
        text = text.replace("```json", " ").replace("```JSON", " ").replace("```", " ").trim();
        String object = lastRelevantObject(text);
        return object == null ? text : object;
    }

    static StageOneView stageOne(JsonNode node) {
        if (node == null || !node.isObject()) {
            return StageOneView.failed(StageOneFailure.MISSING_VERDICT);
        }
        String action = text(node, "action");
        String verdict = canonicalVerdict(text(node, "verdict"));
        boolean explicitNonFinal = !action.isBlank() && !"final".equalsIgnoreCase(action);
        if (!isValidVerdict(verdict)) {
            return StageOneView.failed(explicitNonFinal
                    ? StageOneFailure.MISSING_ACTION
                    : StageOneFailure.MISSING_VERDICT);
        }
        Double confidence = readConfidence(node);
        if (confidence == null) {
            return StageOneView.failed(StageOneFailure.MISSING_CONFIDENCE);
        }
        String reasoning = firstText(node, "reasoning", "explanation", "analysis", "rationale", "thought");
        if (reasoning.isBlank()) {
            reasoning = "The review reached a verdict, but the model did not include an explanation.";
        }
        return new StageOneView(verdict, confidence, reasoning, null);
    }

    private static String lastRelevantObject(String text) {
        String last = null;
        String lastVerdict = null;
        int depth = 0;
        boolean inString = false;
        boolean escape = false;
        int start = -1;
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (inString) {
                if (escape) {
                    escape = false;
                } else if (c == '\\') {
                    escape = true;
                } else if (c == '"') {
                    inString = false;
                }
                continue;
            }
            if (c == '"') {
                inString = true;
                continue;
            }
            if (c == '{') {
                if (depth == 0) {
                    start = i;
                }
                depth++;
            } else if (c == '}' && depth > 0) {
                depth--;
                if (depth == 0 && start >= 0) {
                    String object = text.substring(start, i + 1);
                    last = object;
                    if (object.contains("\"verdict\"") || object.contains("\"action\"")) {
                        lastVerdict = object;
                    }
                    start = -1;
                }
            }
        }
        return lastVerdict != null ? lastVerdict : last;
    }

    private static String canonicalVerdict(String raw) {
        if (raw == null || raw.isBlank()) {
            return "";
        }
        String normalized = raw.trim().toUpperCase(Locale.ROOT)
                .replace('-', ' ')
                .replace('_', ' ')
                .replaceAll("[^A-Z ]", "")
                .trim()
                .replaceAll("\\s+", "_");
        return switch (normalized) {
            case "TRUE_POSITIVE", "TRUEPOSITIVE", "TP" -> "TRUE_POSITIVE";
            case "FALSE_POSITIVE", "FALSEPOSITIVE", "FP" -> "FALSE_POSITIVE";
            case "UNCERTAIN", "UNKNOWN", "INCONCLUSIVE" -> "UNCERTAIN";
            default -> normalized;
        };
    }

    private static boolean isValidVerdict(String verdict) {
        return "TRUE_POSITIVE".equals(verdict) || "FALSE_POSITIVE".equals(verdict) || "UNCERTAIN".equals(verdict);
    }

    private static Double readConfidence(JsonNode node) {
        JsonNode confidence = node.get("confidence");
        if (confidence == null || confidence.isNull()) {
            return null;
        }
        if (confidence.isNumber()) {
            return scaleConfidence(confidence.asDouble());
        }
        if (!confidence.isTextual()) {
            return null;
        }
        String raw = confidence.asText("").trim().replace("%", "").trim();
        if (raw.indexOf(',') >= 0 && raw.indexOf('.') < 0) {
            raw = raw.replace(',', '.');
        }
        try {
            return scaleConfidence(Double.parseDouble(raw));
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private static Double scaleConfidence(double value) {
        if (Double.isNaN(value) || Double.isInfinite(value)) {
            return null;
        }
        if (value > 1.0d && value <= 100.0d) {
            value = value / 100.0d;
        }
        if (value < 0.0d || value > 1.0d) {
            return null;
        }
        return value;
    }

    private static String firstText(JsonNode node, String... fields) {
        for (String field : fields) {
            String value = text(node, field);
            if (!value.isBlank()) {
                return value;
            }
        }
        return "";
    }

    private static String text(JsonNode node, String field) {
        JsonNode value = node.get(field);
        if (value == null || value.isNull()) {
            return "";
        }
        return value.asText("").trim();
    }
}
