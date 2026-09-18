package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import java.util.List;

/**
 * Aggregate of semantic control discovery plus per-control soundness for one finding.
 */
public record ControlAuditReport(
        boolean applicable,
        List<SecurityControl> candidates,
        List<ControlSoundness> results,
        int llmRequests
) {
    public static ControlAuditReport skipped() {
        return new ControlAuditReport(false, List.of(), List.of(), 0);
    }

    public static ControlAuditReport noneFound(int llmRequests) {
        return new ControlAuditReport(true, List.of(), List.of(), Math.max(0, llmRequests));
    }

    public boolean hasCandidates() {
        return candidates != null && !candidates.isEmpty();
    }

    public String toPromptSection() {
        if (!applicable) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        sb.append("## Custom control soundness audit\n");
        sb.append("This audit covers CUSTOM application validators/sanitizers (code in this repo, or library ");
        sb.append("calls with application-specific options). Framework-native APIs (PreparedStatement, ");
        sb.append("DOMPurify defaults, auto-escape, ProcessBuilder) are out of scope.\n");
        sb.append("A helper named validate/sanitize/clean/escape is never by itself FALSE_POSITIVE evidence.\n");
        if (!hasCandidates()) {
            sb.append("No custom security control was identified on the source-to-sink path.\n\n");
            return sb.toString();
        }
        sb.append("- Candidates: ").append(candidates.size()).append('\n');
        if (results == null || results.isEmpty()) {
            sb.append("Soundness was not evaluated (empty audit).\n\n");
            return sb.toString();
        }
        for (ControlSoundness result : results) {
            String name = result.control() == null ? "unknown" : result.control().label();
            sb.append("- ").append(name)
                    .append(": ").append(result.classification())
                    .append(" / ").append(result.verdict());
            if (result.bypassClasses() != null && !result.bypassClasses().isEmpty()) {
                sb.append(" bypass=").append(result.bypassClasses());
            }
            sb.append('\n');
            if (result.reasoning() != null && !result.reasoning().isBlank()) {
                sb.append("  ").append(result.reasoning().trim()).append('\n');
            }
            if (result.residualPayloadSketch() != null && !result.residualPayloadSketch().isBlank()) {
                sb.append("  Residual class: ").append(result.residualPayloadSketch().trim()).append('\n');
            }
        }
        sb.append("Policy: SOUND + on the sink variable + applies to this CWE may support FALSE_POSITIVE. ");
        sb.append("UNSOUND / INCOMPLETE / MISAPPLIED / WRONG_CWE => TRUE_POSITIVE (the control is not a neutralizer). ");
        sb.append("BODY_UNAVAILABLE => UNCERTAIN, never high-confidence FALSE_POSITIVE from the helper name. ");
        sb.append("AUDIT_INCONCLUSIVE means the extra audit call failed — do not change the analyzer verdict for that reason.\n\n");
        return sb.toString();
    }
}
