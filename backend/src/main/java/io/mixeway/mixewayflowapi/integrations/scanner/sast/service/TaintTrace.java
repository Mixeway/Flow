package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import java.util.List;

public record TaintTrace(
        boolean required,
        String source,
        String sink,
        List<String> steps,
        List<String> sanitizers,
        List<String> gaps,
        double confidence
) {
    public static TaintTrace notRequired(String reason) {
        return new TaintTrace(false, reason, "", List.of(), List.of(), List.of(), 1.0d);
    }

    public static TaintTrace unknown(String sink) {
        return new TaintTrace(true, "unknown", sink == null ? "unknown" : sink,
                List.of(), List.of(), List.of("source-to-sink path not proven by structured evidence"), 0.25d);
    }

    public String toPromptBlock() {
        StringBuilder sb = new StringBuilder();
        sb.append("- Required: ").append(required).append('\n');
        sb.append("- Source: ").append(source == null || source.isBlank() ? "unknown" : source).append('\n');
        sb.append("- Sink: ").append(sink == null || sink.isBlank() ? "unknown" : sink).append('\n');
        appendList(sb, "Steps", steps);
        appendList(sb, "Sanitizers", sanitizers);
        appendList(sb, "Gaps", gaps);
        sb.append("- Confidence: ").append(String.format(java.util.Locale.ROOT, "%.2f", confidence)).append('\n');
        return sb.toString();
    }

    private void appendList(StringBuilder sb, String label, List<String> values) {
        if (values == null || values.isEmpty()) {
            sb.append("- ").append(label).append(": none\n");
            return;
        }
        sb.append("- ").append(label).append(":\n");
        for (String value : values) {
            sb.append("  - ").append(value).append('\n');
        }
    }
}
