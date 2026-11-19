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
            + "\"deciding_fact\": \"the single fact that decides the verdict\", "
            + "\"safety_basis\": \"" + SafetyBasis.PROMPT_VALUES + " — for FALSE_POSITIVE, what safety rests on: "
            + "framework_escape when template/framework auto-escaping (th:text, c:out, {{ x }}, Razor @, html/template) "
            + "protects the sink; custom_control when it depends on an application-authored "
            + "validator/sanitizer/allowlist/guard; none for TRUE_POSITIVE/UNCERTAIN\"}";

    static final String REASONING_SHAPE =
            "\"reasoning\": \"3-6 sentences for a developer who never saw this scanner: trace the code path "
                    + "(source → transforms → sink) as fully as the shown code allows and why it is or is not "
                    + "exploitable. Name the exact identifier at every hop — the variable/parameter/prop/field/"
                    + "property that carries the value (e.g. `config.loaderUrl`), the function or component that "
                    + "holds it (e.g. `GenesysWidget`), and the exact sink call with its argument (e.g. "
                    + "`dangerouslySetInnerHTML` `__html`), with file:line where shown. "
                    + "For any hop the shown code does not prove, state it plainly: name the prop/field with no "
                    + "writer or caller, the value that would therefore reach the sink, and how confirming its "
                    + "origin as trusted or untrusted would change the verdict. "
                    + "Describe runtime/origin in ordinary words if needed; never snake_case enums "
                    + "(http_request, cli_developer_tool, …). "
                    + "Put heuristics, categories, tags, confidence, guidance/checklist talk, and enum tokens "
                    + "only in `analysis`\"";

    /**
     * Shared instruction for the {@code reasoning} field in inline Stage-2 prompts that do not embed
     * {@link #REASONING_SHAPE}. Keeps the "name every hop, flag unproven hops" contract in one place.
     */
    static final String REASONING_DETAIL_RULE =
            "In `reasoning`, name the exact identifier at every hop (the variable/parameter/prop/field/"
                    + "property carrying the value, the function/component holding it, and the sink call with its "
                    + "argument, with file:line where shown); for any hop the shown code does not prove, name the "
                    + "prop/field that has no writer or caller, the value that would reach the sink, and how "
                    + "confirming its origin as trusted or untrusted would change the verdict.";

    static final String EVIDENCE_THEN_VERDICT_FIELDS = "analysis, reasoning, false_positive_evidence, "
            + "verdict, confidence";

    static final String STAGE_TWO_FIELDS = "execution_context, input_source, " + EVIDENCE_THEN_VERDICT_FIELDS;

    static final String ORDER_RULE = "Write the fields in this order: " + STAGE_TWO_FIELDS + ". "
            + "Fill `analysis` first (internal scratchpad — heuristics, categories, call-site notes, scoring) "
            + "and derive `verdict` from it. "
            + "`reasoning` is the only prose shown to developers: code facts only, no scanner jargon. "
            + "`analysis` is never shown to developers.";

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
