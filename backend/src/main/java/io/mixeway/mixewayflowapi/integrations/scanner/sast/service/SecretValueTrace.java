package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

public record SecretValueTrace(
        String variableName,
        String literalKind,
        String valueRole,
        String declarationEvidence,
        String usageEvidence,
        boolean likelyRealSecret
) {
    public static SecretValueTrace unknown() {
        return new SecretValueTrace("unknown", "unknown", "unknown", "", "", false);
    }
}
