package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import com.fasterxml.jackson.databind.JsonNode;

import java.util.Locale;
import java.util.Optional;

/**
 * The single fact a FALSE_POSITIVE rests on, declared by the model as {@code analysis.safety_basis}.
 * Lets the control soundness gate tell "safe regardless of any custom helper" apart from
 * "safe because of a custom helper" without matching phrases in free-text reasoning.
 */
enum SafetyBasis {
    PARAMETERIZED,
    LITERAL_OR_CONSTANT,
    NUMERIC_COERCION,
    TRUSTED_SOURCE,
    NOT_REACHABLE,
    CUSTOM_CONTROL,
    NONE;

    static final String PROMPT_VALUES = "parameterized|literal_or_constant|numeric_coercion|trusted_source|"
            + "not_reachable|custom_control|none";

    /** Safety that does not depend on any custom control on the path. */
    boolean independentOfCustomControls() {
        return this == PARAMETERIZED || this == LITERAL_OR_CONSTANT || this == NUMERIC_COERCION
                || this == TRUSTED_SOURCE || this == NOT_REACHABLE;
    }

    /** Empty for blank, unknown, or {@code none}: those carry no claim the gate can rely on. */
    static Optional<SafetyBasis> parse(String raw) {
        if (raw == null || raw.isBlank()) {
            return Optional.empty();
        }
        String normalized = raw.trim().toUpperCase(Locale.ROOT).replace('-', '_').replace(' ', '_');
        try {
            SafetyBasis basis = SafetyBasis.valueOf(normalized);
            return basis == NONE ? Optional.empty() : Optional.of(basis);
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
    }

    /** Reads {@code analysis.safety_basis}, or a top-level {@code safety_basis} (peer review format). */
    static String fromResponse(JsonNode node) {
        if (node == null || !node.isObject()) {
            return null;
        }
        JsonNode analysis = node.get("analysis");
        JsonNode value = analysis != null && analysis.isObject() ? analysis.get("safety_basis") : null;
        if (value == null || !value.isTextual()) {
            value = node.get("safety_basis");
        }
        if (value == null || !value.isTextual() || value.asText().isBlank()) {
            return null;
        }
        return value.asText().trim();
    }
}
