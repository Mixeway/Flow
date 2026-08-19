package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public record FindingEvidence(
        boolean available,
        SastRuleMetadata metadata,
        ExecutionContext executionContext,
        String evidenceSummary,
        Map<String, String> attributes,
        TaintTrace taintTrace,
        List<String> policyNotes,
        String consistencyKey
) {
    public static FindingEvidence unavailable() {
        return new FindingEvidence(false, null, ExecutionContext.UNKNOWN, "", Map.of(),
                TaintTrace.unknown("unknown"), List.of(), "");
    }

    public String toPromptSection() {
        if (!available || metadata == null) {
            return "";
        }

        StringBuilder sb = new StringBuilder();
        sb.append("## Structured vulnerability evidence\n");
        sb.append("This section is generated deterministically before the LLM review. ");
        sb.append("Use it as evidence guidance, but still verify it against the code snippets and tool results.\n");
        sb.append("- Family: ").append(metadata.family()).append('\n');
        sb.append("- CWE: ").append(metadata.cweIds() == null || metadata.cweIds().isEmpty()
                ? "unknown" : "CWE-" + String.join(", CWE-", metadata.cweIds())).append('\n');
        sb.append("- Prompt profile: ").append(metadata.promptProfile()).append('\n');
        sb.append("- Policy profile: ").append(metadata.policyProfile()).append('\n');
        sb.append("- Requires taint: ").append(metadata.requiresTaint()).append('\n');
        sb.append("- Execution context: ").append(executionContext).append('\n');
        if (evidenceSummary != null && !evidenceSummary.isBlank()) {
            sb.append("- Evidence summary: ").append(evidenceSummary).append('\n');
        }
        if (attributes != null && !attributes.isEmpty()) {
            sb.append("- Attributes:\n");
            for (Map.Entry<String, String> entry : attributes.entrySet()) {
                sb.append("  - ").append(entry.getKey()).append(": ").append(entry.getValue()).append('\n');
            }
        }
        if (policyNotes != null && !policyNotes.isEmpty()) {
            sb.append("- Policy notes:\n");
            for (String note : policyNotes) {
                sb.append("  - ").append(note).append('\n');
            }
        }
        if (taintTrace != null) {
            sb.append("Taint trace:\n");
            sb.append(taintTrace.toPromptBlock());
        }
        sb.append('\n');
        return sb.toString();
    }

    public static Map<String, String> attributes(Object... keyValues) {
        Map<String, String> result = new LinkedHashMap<>();
        for (int i = 0; i + 1 < keyValues.length; i += 2) {
            Object key = keyValues[i];
            Object value = keyValues[i + 1];
            if (key != null && value != null && !value.toString().isBlank()) {
                result.put(key.toString(), value.toString());
            }
        }
        return result;
    }
}
