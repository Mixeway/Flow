package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ControlSoundnessGateTest {

    @Test
    void unsoundCustomValidatorTurnsFalsePositiveIntoTruePositive() {
        ControlAuditReport report = report(soundness(
                ControlSoundness.Classification.CUSTOM_APPLICATION,
                ControlSoundness.Verdict.UNSOUND,
                List.of("QUOTE_BLACKLIST"),
                true,
                true));

        Optional<ControlSoundnessGate.Decision> decision = ControlSoundnessGate.decide(
                report, "FALSE_POSITIVE", "FALSE_POSITIVE because validateSql sanitizes quotes.");

        assertTrue(decision.isPresent());
        assertEquals("TRUE_POSITIVE", decision.get().verdict());
        assertTrue(decision.get().explanation().contains("UNSOUND"));
        assertFalse(decision.get().explanation().contains("QUOTE_BLACKLIST"));
        assertFalse(decision.get().explanation().contains("DENYLIST_AS_ALLOWLIST"));
        assertFalse(decision.get().explanation().contains("MIXED_FRAGMENT"));
    }

    @Test
    void missingBodyTurnsFalsePositiveIntoUncertain() {
        ControlAuditReport report = report(soundness(
                ControlSoundness.Classification.CUSTOM_APPLICATION,
                ControlSoundness.Verdict.BODY_UNAVAILABLE,
                List.of(),
                false,
                true));

        Optional<ControlSoundnessGate.Decision> decision = ControlSoundnessGate.decide(
                report, "FALSE_POSITIVE", "Safe because InputFilter.clean() is applied.");

        assertTrue(decision.isPresent());
        assertEquals("UNCERTAIN", decision.get().verdict());
    }

    @Test
    void failedAuditDoesNotOverrideHighConfidenceFalsePositive() {
        SecurityControl control = new SecurityControl(
                SecurityControl.Kind.REJECTOR, SecurityControl.Origin.CUSTOM_APPLICATION,
                "validateArchiveName", "validateArchiveName(name)", "allowlist",
                "validateArchiveName", "validators.js", 155, 200, true, "PATH_TRAVERSAL");
        ControlSoundness result = ControlSoundness.inconclusive(control,
                "Audit LLM returned an empty response after the analyzer already inspected the helper.");
        ControlAuditReport report = new ControlAuditReport(true, List.of(control), List.of(result), 1);

        Optional<ControlSoundnessGate.Decision> decision = ControlSoundnessGate.decide(
                report, "FALSE_POSITIVE",
                "FALSE_POSITIVE because validateArchiveName allowlists ARCHIVE_NAME before path join.");

        assertTrue(decision.isEmpty());
    }

    @Test
    void soundControlDoesNotOverrideFalsePositive() {
        ControlAuditReport report = report(soundness(
                ControlSoundness.Classification.FRAMEWORK_NATIVE,
                ControlSoundness.Verdict.SOUND,
                List.of(),
                true,
                true));

        Optional<ControlSoundnessGate.Decision> decision = ControlSoundnessGate.decide(
                report, "FALSE_POSITIVE", "PreparedStatement binds the value after validateSql.");

        assertTrue(decision.isEmpty());
    }

    @Test
    void mixedSoundAllowlistAndUnsoundDenylistTurnsFalsePositiveIntoTruePositive() {
        ControlSoundness soundColumns = soundness(
                ControlSoundness.Classification.CUSTOM_APPLICATION,
                ControlSoundness.Verdict.SOUND,
                List.of(),
                true,
                true,
                "resolve_report_column");
        ControlSoundness unsoundComputed = soundness(
                ControlSoundness.Classification.CUSTOM_APPLICATION,
                ControlSoundness.Verdict.UNSOUND,
                List.of("DENYLIST_AS_ALLOWLIST", "MIXED_FRAGMENT"),
                true,
                true,
                "assert_computed_expression");

        Optional<ControlSoundnessGate.Decision> decision = ControlSoundnessGate.decide(
                report(soundColumns, unsoundComputed),
                "FALSE_POSITIVE",
                "FALSE_POSITIVE because resolve_report_column is a closed allowlist and computed expressions are regex-validated.");

        assertTrue(decision.isPresent());
        assertEquals("TRUE_POSITIVE", decision.get().verdict());
        assertTrue(decision.get().explanation().contains("assert_computed_expression"));
        assertTrue(decision.get().explanation().contains("UNSOUND"));
    }

    @Test
    void parameterizationDoesNotSkipGateWhenComputedExpressionRemains() {
        ControlAuditReport report = report(soundness(
                ControlSoundness.Classification.CUSTOM_APPLICATION,
                ControlSoundness.Verdict.UNSOUND,
                List.of("DENYLIST_AS_ALLOWLIST"),
                true,
                true,
                "assert_computed_expression"));

        Optional<ControlSoundnessGate.Decision> decision = ControlSoundnessGate.decide(
                report, "FALSE_POSITIVE",
                "Filters use bound parameters. Computed expressions are regex-validated before concat.");

        assertTrue(decision.isPresent());
        assertEquals("TRUE_POSITIVE", decision.get().verdict());
    }

    @Test
    void helixOpsSqlReasoningLooksLikeControlBasedFalsePositiveAndNotIndependentSafety() {
        String reasoning = "every fragment is neutralized. resolve_report_column uses a closed allowlist. "
                + "filter values go through quote_sql_literal. computed expressions/aliases are regex-validated.";
        assertTrue(ControlSoundnessGate.looksLikeControlBasedFalsePositive(reasoning, null));
        assertFalse(ControlSoundnessGate.hasIndependentSafetyEvidence(reasoning));
        assertTrue(ControlSoundnessGate.mentionsLeakySqlFragmentControl(reasoning.toLowerCase()));
    }

    @Test
    void independentParameterizationEvidenceSkipsGate() {
        ControlAuditReport report = report(soundness(
                ControlSoundness.Classification.CUSTOM_APPLICATION,
                ControlSoundness.Verdict.UNSOUND,
                List.of("QUOTE_BLACKLIST"),
                true,
                true));

        Optional<ControlSoundnessGate.Decision> decision = ControlSoundnessGate.decide(
                report, "FALSE_POSITIVE",
                "The query uses a PreparedStatement with bound parameters. validateSql is extra.");

        assertTrue(decision.isEmpty());
    }

    @Test
    void doesNotChangeTruePositive() {
        ControlAuditReport report = report(soundness(
                ControlSoundness.Classification.CUSTOM_APPLICATION,
                ControlSoundness.Verdict.UNSOUND,
                List.of("QUOTE_BLACKLIST"),
                true,
                true));

        assertTrue(ControlSoundnessGate.decide(report, "TRUE_POSITIVE",
                "validateSql only strips quotes").isEmpty());
    }

    @Test
    void wrongCweHelperIsNotANeutralizer() {
        ControlAuditReport report = report(soundness(
                ControlSoundness.Classification.CUSTOM_APPLICATION,
                ControlSoundness.Verdict.WRONG_CWE,
                List.of(),
                false,
                true));

        Optional<ControlSoundnessGate.Decision> decision = ControlSoundnessGate.decide(
                report, "FALSE_POSITIVE", "clean() sanitizes the query before execute.");

        assertTrue(decision.isPresent());
        assertEquals("TRUE_POSITIVE", decision.get().verdict());
    }

    @Test
    void frameworkNativeApisAreOutOfScopeForTheGate() {
        ControlAuditReport report = report(soundness(
                ControlSoundness.Classification.FRAMEWORK_NATIVE,
                ControlSoundness.Verdict.UNSOUND,
                List.of(),
                true,
                true,
                "PreparedStatement"));

        Optional<ControlSoundnessGate.Decision> decision = ControlSoundnessGate.decide(
                report, "FALSE_POSITIVE", "FALSE_POSITIVE because PreparedStatement sanitizes the query.");

        assertTrue(decision.isEmpty());
    }

    @Test
    void controlKeywordDetectionDoesNotRequireValidatorInTheName() {
        assertTrue(ControlSoundnessGate.looksLikeControlBasedFalsePositive(
                "toSafe() rewrites the query before execute",
                report(soundness(
                        ControlSoundness.Classification.CUSTOM_APPLICATION,
                        ControlSoundness.Verdict.UNSOUND,
                        List.of("QUOTE_BLACKLIST"),
                        true,
                        true,
                        "toSafe"))));
        assertFalse(ControlSoundnessGate.hasIndependentSafetyEvidence(
                "toSafe() rewrites the query before execute"));
    }

    private static ControlAuditReport report(ControlSoundness... results) {
        List<SecurityControl> candidates = new java.util.ArrayList<>();
        for (ControlSoundness result : results) {
            if (result.control() != null) {
                candidates.add(result.control());
            }
        }
        return new ControlAuditReport(true, candidates, List.of(results), 1);
    }

    private static ControlSoundness soundness(ControlSoundness.Classification classification,
                                              ControlSoundness.Verdict verdict,
                                              List<String> bypass,
                                              boolean applies,
                                              boolean onSink) {
        return soundness(classification, verdict, bypass, applies, onSink, "validateSql");
    }

    private static ControlSoundness soundness(ControlSoundness.Classification classification,
                                              ControlSoundness.Verdict verdict,
                                              List<String> bypass,
                                              boolean applies,
                                              boolean onSink,
                                              String identifier) {
        SecurityControl control = new SecurityControl(
                SecurityControl.Kind.TRANSFORMER,
                SecurityControl.Origin.CUSTOM_APPLICATION,
                identifier,
                identifier + "(query)",
                "rejects quotes",
                identifier,
                "Sql.java",
                10,
                20,
                onSink,
                "SQL_INJECTION");
        return new ControlSoundness(control, classification, verdict, bypass, "quote blacklist",
                0.8d, "return !q.contains(\"'\")", "body only blacklists quotes", applies, onSink);
    }
}
