package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import io.mixeway.mixewayflowapi.integrations.llm.service.LlmApiClient;
import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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
    void discoveryAndAuditLoopRequestJsonMode() {
        LlmApiClient llm = mock(LlmApiClient.class);
        when(llm.chatCompletion(anyList(), anyBoolean())).thenReturn(
                new LlmApiClient.LlmResponse("""
                        {"controls":[{"kind":"REJECTOR","origin":"CUSTOM_APPLICATION","identifier":"check_ids",
                        "evidence":"check_ids(ids)","callee_hint":"check_ids","path_hint":"app/guards.py"}]}
                        """, 0, 0),
                new LlmApiClient.LlmResponse("""
                        {"action":"final","results":[{"identifier":"check_ids","verdict":"SOUND",
                        "classification":"CUSTOM_APPLICATION","confidence":0.9,"reasoning":"Rejects non-digits."}]}
                        """, 0, 0));
        Item item = new Item();
        item.setAiVerdict("FALSE_POSITIVE");

        ControlAuditReport report = new CustomControlSoundnessService(llm, null)
                .evaluate(item, "/tmp/repo", null, sqlMetadata(), List.of(), "item", null);

        assertTrue(report.applicable());
        verify(llm, times(2)).chatCompletion(anyList(), eq(true));
        verify(llm, never()).chatCompletion(anyList(), eq(false));
        verify(llm, never()).chatCompletion(anyString(), anyString());
    }

    @Test
    void needlesDropArgumentsQualifiersAndBuiltins() {
        Set<String> needles = CustomControlSoundnessService.needles(List.of(
                control(SecurityControl.Kind.TYPE_COERCION, "int()", "", "int(entity_id)", ""),
                control(SecurityControl.Kind.REJECTOR, "Guard.check(q)", "UserRepo::assertIds", "", "")));

        assertEquals(Set.of("check", "assertIds"), needles);
    }

    @Test
    void observationKeepsHelperDefinitionFarFromTheTop() {
        String observation = readFileObservation();

        String block = service.toolResultsBlock(
                List.of(Map.of("role", "user", "content", observation)),
                List.of(control(SecurityControl.Kind.REJECTOR, "get_subordinates_by_entity_ids", "", "", "")));

        assertTrue(block.contains("TOOL RESULT (read_file)"), block);
        assertTrue(block.contains("def get_subordinates_by_entity_ids(entity_ids):"), block);
        assertTrue(block.contains("int(entity_id) for entity_id in entity_ids"), block);
        assertFalse(block.contains("import module_3"), block);
    }

    @Test
    void observationWithoutCandidatesKeepsTheHead() {
        String block = service.toolResultsBlock(
                List.of(Map.of("role", "user", "content", readFileObservation())), List.of());

        assertTrue(block.contains("import module_3"), block);
        assertFalse(block.contains("def get_subordinates_by_entity_ids"), block);
    }

    @Test
    void typeCoercionGatePassesOnTheCoercedExpression() {
        SecurityControl coercion = control(SecurityControl.Kind.TYPE_COERCION, "int()", "",
                "int( entity_id )", "app/user_api_repository.py");

        assertTrue(service.calleeBodyAlreadyInContext(List.of(coercion),
                contextWithBody("query = f\"SELECT * FROM t WHERE id = {int(entity_id)}\""), List.of(), null));
    }

    @Test
    void coercionAuditShowsTheSinkCalleeBodyTheAnalyzerRead() {
        SecurityControl coercion = control(SecurityControl.Kind.TYPE_COERCION, "int()", "",
                "int(entity_id) for entity_id in entity_ids", "");
        List<Map<String, Object>> analyzer = List.of(Map.of("role", "user", "content", sqlBuilderObservation()));
        String flagged = "rows = self.db.execute(get_subordinates_by_entity_ids(entity_ids))";

        assertEquals(Set.of("get_subordinates_by_entity_ids"),
                CustomControlSoundnessService.sinkCallees(flagged, analyzer));
        String block = service.toolResultsBlock(analyzer, List.of(coercion),
                CustomControlSoundnessService.sinkCallees(flagged, analyzer));
        assertTrue(block.contains("def get_subordinates_by_entity_ids(entity_ids):"), block);
        assertTrue(block.contains("','.join([str(uid) for uid in ids])"), block);
        assertFalse(block.contains("import module_3"), block);
        assertTrue(service.calleeBodyAlreadyInContext(List.of(coercion), contextWithBody(""), analyzer, flagged));
    }

    @Test
    void coercionAuditWithoutTheSinkCalleeBodyIsNotSingleShot() {
        SecurityControl coercion = control(SecurityControl.Kind.TYPE_COERCION, "int()", "", "int(raw_id)", "");
        String observation = sqlBuilderObservation();
        String flagged = "rows = self.db.execute(get_subordinates_by_entity_ids(entity_ids))";
        CodeContextExtractor.CodeContext caller = contextWithBody(
                "entity_ids = [int(raw_id) for raw_id in request_ids]\n" + flagged);
        CustomControlSoundnessService headOnly = new CustomControlSoundnessService(null, null) {
            @Override
            String toolResultsBlock(List<Map<String, Object>> analyzerMessages, List<SecurityControl> candidates,
                                    Set<String> sinkCallees) {
                return observation.substring(0, 1200);
            }
        };

        assertFalse(headOnly.calleeBodyAlreadyInContext(List.of(coercion), caller,
                List.of(Map.of("role", "user", "content", observation)), flagged));
        assertTrue(headOnly.calleeBodyAlreadyInContext(List.of(coercion), caller, List.of(), flagged));
    }

    @Test
    void sinkCalleesIgnoreLibraryCallsWithoutARepositoryBody() {
        List<Map<String, Object>> analyzer = List.of(Map.of("role", "user", "content", sqlBuilderObservation()));

        assertTrue(CustomControlSoundnessService.sinkCallees(
                "cursor.execute(query, params)", analyzer).isEmpty());
        assertTrue(CustomControlSoundnessService.sinkCallees(
                "rows = self.db.execute(get_subordinates_by_entity_ids(entity_ids))", List.of()).isEmpty());
    }

    @Test
    void callerFileNameIsNotAHelperBody() {
        SecurityControl helper = control(SecurityControl.Kind.REJECTOR, "get_subordinates_by_entity_ids",
                "get_subordinates_by_entity_ids", "", "app/user_api_repository.py");
        CodeContextExtractor.CodeContext context = contextWithBody(
                "# app/user_api_repository.py\nids = get_subordinates_by_entity_ids(entity_ids)");

        assertFalse(service.calleeBodyAlreadyInContext(List.of(helper), context, List.of(), null));
        assertTrue(service.calleeBodyAlreadyInContext(List.of(helper), context,
                List.of(Map.of("role", "user", "content", readFileObservation())), null));
    }

    @Test
    void gateRequiresEveryCandidateBody() {
        SecurityControl visible = control(SecurityControl.Kind.REJECTOR, "get_subordinates_by_entity_ids", "", "", "");
        SecurityControl missing = control(SecurityControl.Kind.TRANSFORMER, "quote_identifier", "", "", "");

        assertFalse(service.calleeBodyAlreadyInContext(List.of(visible, missing), contextWithBody(""),
                List.of(Map.of("role", "user", "content", readFileObservation())), null));
    }

    private static String sqlBuilderObservation() {
        StringBuilder sb = new StringBuilder("TOOL RESULT (read_file):\n");
        for (int i = 1; i <= 120; i++) {
            sb.append(i).append("| import module_").append(i).append('\n');
        }
        sb.append("121| def get_subordinates_by_entity_ids(entity_ids):\n");
        sb.append("122|     ids = [int(entity_id) for entity_id in entity_ids]\n");
        sb.append("123|     return f\"SELECT * FROM {SisConnector.SIS_OWNER}.T WHERE ID IN ({','.join([str(uid) for uid in ids])})\"\n");
        return sb.toString();
    }

    private static String readFileObservation() {
        StringBuilder sb = new StringBuilder("TOOL RESULT (read_file):\n");
        for (int i = 1; i <= 150; i++) {
            sb.append(i).append("| import module_").append(i).append('\n');
        }
        sb.append("151| def get_subordinates_by_entity_ids(entity_ids):\n");
        sb.append("152|     ids = [int(entity_id) for entity_id in entity_ids]\n");
        sb.append("153|     return ids\n");
        return sb.toString();
    }

    private static SecurityControl control(SecurityControl.Kind kind, String identifier, String calleeHint,
                                           String evidence, String pathHint) {
        return new SecurityControl(kind, SecurityControl.Origin.CUSTOM_APPLICATION, identifier, evidence, "",
                calleeHint, pathHint, 0, 0, true, "SQL_INJECTION");
    }

    private static CodeContextExtractor.CodeContext contextWithBody(String functionBody) {
        return new CodeContextExtractor.CodeContext(functionBody, "", "", "", List.of(), "", "", "", "", "",
                "python", CodeContextExtractor.EvidenceCategory.AMBIGUOUS, List.of());
    }

    private static SastRuleMetadata sqlMetadata() {
        return new SastRuleMetadata(
                "python_lang_sql_injection", List.of("89"), VulnerabilityFamily.SQL_INJECTION,
                PromptProfile.INJECTION, PolicyProfile.STRICT_SOURCE_TO_SINK, true, false, false);
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
