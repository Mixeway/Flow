package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

/**
 * Hard policy: a custom control must not produce FALSE_POSITIVE unless every custom
 * control on the sink path is SOUND for this CWE. A SOUND identifier allowlist next
 * to an UNSOUND denylist/expression fragment still leaves the finding exploitable.
 * Independent safety (parameterization of the whole query, literals, numeric types)
 * is left alone — mixed bound-values-plus-concatenated-expression is not independent.
 */
public final class ControlSoundnessGate {

    static final double UNSOUND_TRUE_POSITIVE_CONFIDENCE = 0.70d;
    static final double BODY_UNAVAILABLE_CONFIDENCE = 0.50d;

    private ControlSoundnessGate() {
    }

    public record Decision(String verdict, double minConfidence, String explanation) {
    }

    public static Optional<Decision> decide(ControlAuditReport report, String currentVerdict, String reasoning) {
        if (report == null || !report.applicable() || report.results() == null || report.results().isEmpty()) {
            return Optional.empty();
        }
        if (!"FALSE_POSITIVE".equals(currentVerdict)) {
            return Optional.empty();
        }
        if (hasIndependentSafetyEvidence(reasoning)) {
            return Optional.empty();
        }
        if (!looksLikeControlBasedFalsePositive(reasoning, report)) {
            return Optional.empty();
        }

        List<ControlSoundness> relevant = relevantResults(report);
        if (relevant.isEmpty()) {
            return Optional.empty();
        }

        List<ControlSoundness> unsound = new ArrayList<>();
        List<ControlSoundness> missingBody = new ArrayList<>();
        for (ControlSoundness result : relevant) {
            if (!result.isCustom()) {
                continue;
            }
            switch (result.verdict()) {
                case UNSOUND, INCOMPLETE, MISAPPLIED, WRONG_CWE -> unsound.add(result);
                case BODY_UNAVAILABLE -> missingBody.add(result);
                case SOUND -> {
                    // SOUND but not soundForThisFinding (wrong variable / wrong CWE) — treat as non-neutralizer
                    if (!result.appliesToThisCwe() || !result.onSinkVariable()) {
                        unsound.add(result);
                    }
                }
                case AUDIT_INCONCLUSIVE -> {
                    // Empty/failed LLM audit is not evidence that the helper is missing or leaky.
                }
            }
        }

        if (!unsound.isEmpty()) {
            return Optional.of(new Decision(
                    "TRUE_POSITIVE",
                    UNSOUND_TRUE_POSITIVE_CONFIDENCE,
                    explanation(unsound, "is not a complete protection for this vulnerability")));
        }
        if (!missingBody.isEmpty()) {
            return Optional.of(new Decision(
                    "UNCERTAIN",
                    BODY_UNAVAILABLE_CONFIDENCE,
                    explanation(missingBody,
                            "body was not available, so the helper name cannot prove the finding is safe")));
        }
        return Optional.empty();
    }

    static boolean looksLikeControlBasedFalsePositive(String reasoning, ControlAuditReport report) {
        String combined = reasoning == null ? "" : reasoning.toLowerCase(Locale.ROOT);
        if (combined.isBlank() && report != null && report.candidates() != null) {
            return !report.candidates().isEmpty();
        }
        if (combined.contains("sanitiz")
                || combined.contains("validat")
                || combined.contains("neutraliz")
                || combined.contains("allowlist")
                || combined.contains("whitelist")
                || combined.contains("escap")
                || combined.contains("encode")
                || combined.contains("clean(")
                || combined.contains("filter(")
                || combined.contains("guard")
                || combined.contains("blocklist")
                || combined.contains("blacklist")
                || combined.contains("denylist")
                || combined.contains("computed expression")
                || combined.contains("regex-validat")) {
            return true;
        }
        if (report == null || report.results() == null) {
            return false;
        }
        for (ControlSoundness result : report.results()) {
            if (result.control() == null) {
                continue;
            }
            String label = result.control().label().toLowerCase(Locale.ROOT);
            if (!label.isBlank() && combined.contains(label.toLowerCase(Locale.ROOT))) {
                return true;
            }
        }
        return false;
    }

    static boolean hasIndependentSafetyEvidence(String reasoning) {
        if (reasoning == null || reasoning.isBlank()) {
            return false;
        }
        String lower = reasoning.toLowerCase(Locale.ROOT);
        if (mentionsLeakySqlFragmentControl(lower)) {
            // Bound parameters / quoting on some fragments do not cover a sibling
            // computed expression or keyword denylist concatenated into the same sink.
            return false;
        }
        return lower.contains("parameteriz")
                || lower.contains("preparedstatement")
                || lower.contains("bound parameter")
                || lower.contains("parseint")
                || lower.contains("integer.parse")
                || lower.contains("numeric type")
                || lower.contains("auto-escap")
                || lower.contains("autoescap")
                || lower.contains("literal sql")
                || lower.contains("string literal")
                || lower.contains("processbuilder")
                || lower.contains("argument array");
    }

    /**
     * True when the text describes an incomplete SQL fragment control: keyword
     * denylist, regex-validated expressions, or quote-then-concat. An identifier
     * allowlist mentioned next to these is not a complete query-level neutralizer.
     */
    static boolean mentionsLeakySqlFragmentControl(String lower) {
        if (lower == null || lower.isBlank()) {
            return false;
        }
        return lower.contains("denylist")
                || lower.contains("deny-list")
                || lower.contains("deny list")
                || lower.contains("blacklist")
                || lower.contains("blocklist")
                || lower.contains("regex-validat")
                || lower.contains("regex validated")
                || lower.contains("computed expression")
                || lower.contains("computed expr")
                || lower.contains("quote_sql")
                || lower.contains("quote-doubl")
                || lower.contains("doubled quote")
                || (lower.contains("replace(") && lower.contains("''"))
                || lower.contains("negative lookahead")
                || lower.contains("disallowed syntax");
    }

    private static List<ControlSoundness> relevantResults(ControlAuditReport report) {
        List<ControlSoundness> onPath = new ArrayList<>();
        for (ControlSoundness result : report.results()) {
            if (result == null || !result.isCustom()) {
                continue;
            }
            if (result.onSinkVariable()
                    || result.control() == null
                    || result.control().onSinkVariable()) {
                onPath.add(result);
            }
        }
        return onPath;
    }

    private static String explanation(List<ControlSoundness> results, String tail) {
        StringBuilder sb = new StringBuilder();
        sb.append("Custom control soundness audit: ");
        for (int i = 0; i < results.size(); i++) {
            ControlSoundness result = results.get(i);
            String name = result.control() == null ? "control" : result.control().label();
            if (i > 0) {
                sb.append("; ");
            }
            sb.append(name).append(" is ").append(result.verdict());
        }
        sb.append(" and ").append(tail).append('.');
        return sb.toString();
    }
}
