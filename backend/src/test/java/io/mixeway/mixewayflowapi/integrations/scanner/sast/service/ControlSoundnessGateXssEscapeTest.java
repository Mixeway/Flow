package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertTrue;

class ControlSoundnessGateXssEscapeTest {

    @Test
    void frameworkTemplateEscapingSkipsGateDespiteUnsoundCustomHelper() {
        ControlAuditReport report = report(soundness(
                ControlSoundness.Classification.CUSTOM_APPLICATION,
                ControlSoundness.Verdict.UNSOUND,
                List.of("TAG_BLACKLIST"),
                true,
                true,
                "escapeSomething"));

        String reasoning = "FALSE_POSITIVE because Thymeleaf th:text auto-escapes articleForm.title in the JSP/Thymeleaf view.";
        Optional<ControlSoundnessGate.Decision> decision =
                ControlSoundnessGate.decide(report, "FALSE_POSITIVE", reasoning);

        assertTrue(decision.isEmpty(), "framework escaping must be independent of custom helpers");
        assertTrue(ControlSoundnessGate.hasFrameworkEscapingEvidence(reasoning));
        assertTrue(ControlSoundnessGate.hasIndependentSafetyEvidence(reasoning));
    }

    @Test
    void declaredFrameworkEscapeSkipsGate() {
        ControlAuditReport report = report(soundness(
                ControlSoundness.Classification.CUSTOM_APPLICATION,
                ControlSoundness.Verdict.UNSOUND,
                List.of("TAG_BLACKLIST"),
                true,
                true,
                "escapeSomething"));

        Optional<ControlSoundnessGate.Decision> decision =
                ControlSoundnessGate.decide(report, "FALSE_POSITIVE",
                        "Safe because of template escaping.", "framework_escape");

        assertTrue(decision.isEmpty());
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
                                              boolean onSink,
                                              String identifier) {
        SecurityControl control = new SecurityControl(
                SecurityControl.Kind.TRANSFORMER,
                SecurityControl.Origin.CUSTOM_APPLICATION,
                identifier,
                identifier + "(html)",
                "escapes html",
                identifier,
                "Helpers.java",
                10,
                20,
                onSink,
                "XSS");
        return new ControlSoundness(control, classification, verdict, bypass, "tag strip",
                0.8d, "return stripTags(x)", "body only strips tags", applies, onSink);
    }
}
