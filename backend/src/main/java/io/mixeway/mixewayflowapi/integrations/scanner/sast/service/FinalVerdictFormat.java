package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import com.fasterxml.jackson.databind.JsonNode;

import java.util.Iterator;
import java.util.Map;

/**
 * Field order of the final verdict object. Evidence fields come before {@code verdict} so a model
 * without native thinking writes its analysis before it commits to a verdict.
 */
final class FinalVerdictFormat {

    /** Internal checklist; logged, never shown to developers. */
    static final String ANALYSIS_SHAPE = "\"analysis\": {"
            + "\"source\": \"who supplies the deciding value and whether an attacker controls it\", "
            + "\"sink\": \"the dangerous call with path:line\", "
            + "\"neutralizer_on_path\": \"none, or the function and whether THIS path calls it\", "
            + "\"deciding_fact\": \"the single fact that decides the verdict\"}";

    static final String EVIDENCE_THEN_VERDICT_FIELDS = "analysis, reasoning, false_positive_evidence, "
            + "verdict, confidence, recommendation, remediation_code";

    static final String STAGE_TWO_FIELDS = "execution_context, input_source, " + EVIDENCE_THEN_VERDICT_FIELDS;

    static final String ORDER_RULE = "Write the fields in this order: " + STAGE_TWO_FIELDS + ". "
            + "Fill `analysis` first and derive `verdict` from it. `analysis` is internal and is not shown to developers.";

    private static final int MAX_LOGGED_CHARS = 600;

    private FinalVerdictFormat() {
    }

    /** One-line rendering of {@code analysis} and {@code trace_effect} for logs; empty when absent. */
    static String summary(JsonNode node) {
        if (node == null || !node.isObject()) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        JsonNode traceEffect = node.get("trace_effect");
        if (traceEffect != null && traceEffect.isTextual() && !traceEffect.asText().isBlank()) {
            sb.append("trace_effect=").append(traceEffect.asText().trim());
        }
        JsonNode analysis = node.get("analysis");
        if (analysis != null && analysis.isObject()) {
            Iterator<Map.Entry<String, JsonNode>> fields = analysis.fields();
            while (fields.hasNext()) {
                Map.Entry<String, JsonNode> field = fields.next();
                String value = field.getValue().isValueNode() ? field.getValue().asText("") : field.getValue().toString();
                if (value.isBlank()) {
                    continue;
                }
                if (!sb.isEmpty()) {
                    sb.append("; ");
                }
                sb.append(field.getKey()).append('=').append(value.trim());
            }
        } else if (analysis != null && analysis.isTextual() && !analysis.asText().isBlank()) {
            if (!sb.isEmpty()) {
                sb.append("; ");
            }
            sb.append("analysis=").append(analysis.asText().trim());
        }
        String text = sb.toString().replace('\n', ' ');
        return text.length() > MAX_LOGGED_CHARS ? text.substring(0, MAX_LOGGED_CHARS) + "…" : text;
    }
}
