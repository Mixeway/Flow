package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import java.util.List;

public record SastRuleMetadata(
        String ruleId,
        List<String> cweIds,
        VulnerabilityFamily family,
        PromptProfile promptProfile,
        PolicyProfile policyProfile,
        boolean requiresTaint,
        boolean requiresExecutionContext,
        boolean requiresDataSensitivity
) {
    public static SastRuleMetadata general(String ruleId, List<String> cweIds) {
        return new SastRuleMetadata(
                ruleId,
                cweIds == null ? List.of() : List.copyOf(cweIds),
                VulnerabilityFamily.GENERAL,
                PromptProfile.GENERAL,
                PolicyProfile.GENERAL_REVIEW,
                true,
                false,
                false);
    }
}
