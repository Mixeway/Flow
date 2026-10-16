package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import java.util.List;

/**
 * Result of inspecting one {@link SecurityControl} body against the finding's CWE.
 */
public record ControlSoundness(
        SecurityControl control,
        Classification classification,
        Verdict verdict,
        List<String> bypassClasses,
        String residualPayloadSketch,
        double confidence,
        String citedBody,
        String reasoning,
        boolean appliesToThisCwe,
        boolean onSinkVariable
) {
    public enum Classification {
        FRAMEWORK_NATIVE,
        CONFIGURED_LIBRARY,
        CUSTOM_APPLICATION,
        UNKNOWN
    }

    public enum Verdict {
        SOUND,
        UNSOUND,
        INCOMPLETE,
        MISAPPLIED,
        WRONG_CWE,
        BODY_UNAVAILABLE,
        /** LLM/tool loop failed; not the same as a missing callee body. Must not override the analyzer. */
        AUDIT_INCONCLUSIVE
    }

    public boolean soundForThisFinding() {
        return verdict == Verdict.SOUND && appliesToThisCwe && onSinkVariable;
    }

    public boolean isCustom() {
        return classification != Classification.FRAMEWORK_NATIVE;
    }

    public boolean blocksFalsePositive() {
        return switch (verdict) {
            case UNSOUND, INCOMPLETE, MISAPPLIED, WRONG_CWE, BODY_UNAVAILABLE -> true;
            case SOUND, AUDIT_INCONCLUSIVE -> false;
        };
    }

    public static ControlSoundness unavailable(SecurityControl control, String reason) {
        return new ControlSoundness(
                control,
                Classification.UNKNOWN,
                Verdict.BODY_UNAVAILABLE,
                List.of(),
                "",
                0.40d,
                "",
                reason == null ? "" : reason,
                false,
                control != null && control.onSinkVariable());
    }

    public static ControlSoundness inconclusive(SecurityControl control, String reason) {
        return new ControlSoundness(
                control,
                Classification.UNKNOWN,
                Verdict.AUDIT_INCONCLUSIVE,
                List.of(),
                "",
                0.0d,
                "",
                reason == null ? "" : reason,
                false,
                control != null && control.onSinkVariable());
    }
}
