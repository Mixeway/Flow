package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

/**
 * A semantically identified security control on a source-to-sink path.
 * Identity comes from behaviour and position, not from the identifier spelling.
 */
public record SecurityControl(
        Kind kind,
        Origin origin,
        String identifier,
        String evidence,
        String rationale,
        String calleeHint,
        String pathHint,
        int startLine,
        int endLine,
        boolean onSinkVariable,
        String claimedCweIntent
) {
    public enum Kind {
        REJECTOR,
        TRANSFORMER,
        ALLOWLIST,
        ENCODER,
        TYPE_COERCION,
        INLINE_GUARD,
        UNKNOWN
    }

    /**
     * Who wrote the control. This module only audits application-authored code
     * and library calls with application-specific options — not stock framework APIs.
     */
    public enum Origin {
        CUSTOM_APPLICATION,
        CONFIGURED_LIBRARY,
        FRAMEWORK_NATIVE
    }

    public boolean isCustom() {
        return origin == Origin.CUSTOM_APPLICATION || origin == Origin.CONFIGURED_LIBRARY;
    }

    public String label() {
        if (identifier != null && !identifier.isBlank()) {
            return identifier.trim();
        }
        if (calleeHint != null && !calleeHint.isBlank()) {
            return calleeHint.trim();
        }
        return "anonymous-control";
    }
}
