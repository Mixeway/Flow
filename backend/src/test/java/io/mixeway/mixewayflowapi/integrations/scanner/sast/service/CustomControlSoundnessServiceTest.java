package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CustomControlSoundnessServiceTest {

    private final CustomControlSoundnessService service = new CustomControlSoundnessService(null, null);

    @Test
    void discoveryParsesSemanticControlsWithoutRequiringValidatorName() {
        String json = """
                {
                  "controls": [
                    {
                      "kind": "TRANSFORMER",
                      "identifier": "toSafe",
                      "evidence": "db.exec(toSafe(query))",
                      "rationale": "rewrites the sink argument before execute",
                      "callee_hint": "toSafe",
                      "path_hint": "src/Sql.java",
                      "start_line": 12,
                      "end_line": 24,
                      "on_sink_variable": true,
                      "claimed_cwe_intent": "SQL_INJECTION"
                    }
                  ]
                }
                """;

        List<SecurityControl> controls = service.parseDiscovery(json);
        assertEquals(1, controls.size());
        assertEquals("toSafe", controls.get(0).label());
        assertEquals(SecurityControl.Kind.TRANSFORMER, controls.get(0).kind());
        assertTrue(controls.get(0).onSinkVariable());
        assertTrue(controls.get(0).isCustom());
    }

    @Test
    void discoveryDropsFrameworkNativeApis() {
        String json = """
                {
                  "controls": [
                    {
                      "kind": "ENCODER",
                      "origin": "FRAMEWORK_NATIVE",
                      "identifier": "PreparedStatement",
                      "evidence": "ps.setString(1, q)",
                      "rationale": "bound parameter",
                      "callee_hint": "setString",
                      "path_hint": "",
                      "on_sink_variable": true,
                      "claimed_cwe_intent": "SQL_INJECTION"
                    },
                    {
                      "kind": "TRANSFORMER",
                      "origin": "CUSTOM_APPLICATION",
                      "identifier": "toSafe",
                      "evidence": "toSafe(q)",
                      "rationale": "app helper",
                      "callee_hint": "toSafe",
                      "path_hint": "Sql.java",
                      "on_sink_variable": true,
                      "claimed_cwe_intent": "SQL_INJECTION"
                    }
                  ]
                }
                """;
        List<SecurityControl> controls = service.parseDiscovery(json);
        assertEquals(1, controls.size());
        assertEquals("toSafe", controls.get(0).label());
    }

    @Test
    void discoveryAcceptsMarkdownFencesAndEmptyList() {
        assertTrue(service.parseDiscovery("```json\n{\"controls\":[]}\n```").isEmpty());
        assertTrue(service.parseDiscovery("not json").isEmpty());
    }

    @Test
    void auditParsesUnsoundCustomBody() {
        SecurityControl candidate = new SecurityControl(
                SecurityControl.Kind.REJECTOR, SecurityControl.Origin.CUSTOM_APPLICATION,
                "isOk", "if (!isOk(q))", "rejects quotes",
                "isOk", "Guard.java", 4, 10, true, "SQL_INJECTION");
        String json = """
                {
                  "action": "final",
                  "results": [
                    {
                      "identifier": "isOk",
                      "classification": "CUSTOM_APPLICATION",
                      "verdict": "UNSOUND",
                      "bypass_classes": ["QUOTE_BLACKLIST", "COMMENT_BYPASS"],
                      "residual_payload_sketch": "comment or encoding still injects SQL",
                      "confidence": 0.86,
                      "cited_body": "return !q.contains(\\"'\\");",
                      "applies_to_this_cwe": true,
                      "on_sink_variable": true,
                      "reasoning": "Only blacklists single quotes."
                    }
                  ]
                }
                """;

        List<ControlSoundness> results = service.parseAuditFinal(json, List.of(candidate));
        assertEquals(1, results.size());
        assertEquals(ControlSoundness.Verdict.UNSOUND, results.get(0).verdict());
        assertEquals(ControlSoundness.Classification.CUSTOM_APPLICATION, results.get(0).classification());
        assertEquals(List.of("QUOTE_BLACKLIST", "COMMENT_BYPASS"), results.get(0).bypassClasses());
        assertTrue(results.get(0).blocksFalsePositive());
    }

    @Test
    void inconclusiveAuditDoesNotBlockFalsePositive() {
        SecurityControl candidate = new SecurityControl(
                SecurityControl.Kind.REJECTOR, SecurityControl.Origin.CUSTOM_APPLICATION,
                "validateArchiveName", "validateArchiveName(name)", "allowlist",
                "validateArchiveName", "validators.js", 155, 200, true, "PATH_TRAVERSAL");
        ControlSoundness result = ControlSoundness.inconclusive(candidate, "empty LLM");
        assertFalse(result.blocksFalsePositive());
        assertEquals(ControlSoundness.Verdict.AUDIT_INCONCLUSIVE, result.verdict());
    }

    @Test
    void skippedWhenAnalyzerAlreadyTruePositive() {
        Item item = new Item();
        item.setAiVerdict("TRUE_POSITIVE");
        SastRuleMetadata metadata = new SastRuleMetadata(
                "java_lang_sql_injection", List.of("89"), VulnerabilityFamily.SQL_INJECTION,
                PromptProfile.INJECTION, PolicyProfile.STRICT_SOURCE_TO_SINK, true, false, false);

        ControlAuditReport report = service.evaluate(item, "/tmp/repo", null, metadata, List.of(), "item", null);
        assertFalse(report.applicable());
        assertEquals(0, report.llmRequests());
    }

    @Test
    void skippedForWeakHash() {
        Item item = new Item();
        item.setAiVerdict("FALSE_POSITIVE");
        SastRuleMetadata metadata = new SastRuleMetadata(
                "java_lang_weak_hash", List.of("328"), VulnerabilityFamily.WEAK_HASH,
                PromptProfile.WEAK_CRYPTO, PolicyProfile.WEAK_CRYPTO_STRICT, false, false, false);

        ControlAuditReport report = service.evaluate(item, "/tmp/repo", null, metadata, List.of(), "item", null);
        assertFalse(report.applicable());
    }
}
