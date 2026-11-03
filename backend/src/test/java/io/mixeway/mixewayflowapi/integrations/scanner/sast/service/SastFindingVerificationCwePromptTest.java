package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class SastFindingVerificationCwePromptTest {

    private final SastFindingVerificationService service = new SastFindingVerificationService(
            null, null, null, null, null, new SastCwePromptGuidanceService(), null);

    @Test
    void pathTraversalOverlayOmitsUnrelatedCweExceptions() {
        String overlay = overlayFor("javascript_lang_path_traversal", "22", VulnerabilityFamily.PATH_TRAVERSAL,
                PromptProfile.PATH_TRAVERSAL, PolicyProfile.PATH_CANONICALIZATION);

        assertFalse(overlay.contains("setattr"), overlay);
        assertFalse(overlay.contains("CMS HTML"), overlay);
        assertFalse(overlay.contains("RISKY SCHEME"), overlay);
        assertFalse(overlay.contains("HMAC-SHA1"), overlay);
        assertFalse(overlay.contains("http.createServer"), overlay);
        assertTrue(overlay.isBlank(), overlay);
    }

    @Test
    void sqlOverlayHasRiskySchemeButNotCmsOrSetattr() {
        String overlay = overlayFor("javascript_lang_sql_injection", "89", VulnerabilityFamily.SQL_INJECTION,
                PromptProfile.INJECTION, PolicyProfile.STRICT_SOURCE_TO_SINK);

        assertTrue(overlay.contains("RISKY SCHEME"), overlay);
        assertTrue(overlay.contains("knex"), overlay);
        assertFalse(overlay.contains("CMS HTML"), overlay);
        assertFalse(overlay.contains("setattr"), overlay);
        assertFalse(overlay.contains("HMAC-SHA1"), overlay);
    }

    @Test
    void xssOverlayHasCmsHtmlButNotSqlOrSetattr() {
        String overlay = overlayFor("javascript_lang_xss_innerhtml", "79", VulnerabilityFamily.XSS,
                PromptProfile.XSS, PolicyProfile.XSS_CONTEXTUAL_ESCAPING);

        assertTrue(overlay.contains("CMS HTML"), overlay);
        assertFalse(overlay.contains("RISKY SCHEME"), overlay);
        assertFalse(overlay.contains("setattr"), overlay);
        assertFalse(overlay.contains("http.createServer"), overlay);
    }

    @Test
    void codeInjectionOverlayHasNameSlotButNotSql() {
        Item item = new Item();
        item.setId("python_lang_code_injection");
        item.setTitle("Code injection via setattr");
        item.setCweIds(List.of("94"));
        item.setCodeExtract("setattr(obj, name, value)");
        SastRuleMetadata metadata = new SastRuleMetadata(
                "python_lang_code_injection",
                List.of("94"),
                VulnerabilityFamily.GENERAL,
                PromptProfile.INJECTION,
                PolicyProfile.STRICT_SOURCE_TO_SINK,
                true,
                false,
                false);

        StringBuilder sb = new StringBuilder();
        service.appendCweSystemOverlay(sb, metadata, item);
        String overlay = sb.toString();

        assertTrue(overlay.contains("NAME slot"), overlay);
        assertFalse(overlay.contains("RISKY SCHEME"), overlay);
        assertFalse(overlay.contains("CMS HTML"), overlay);
    }

    @Test
    void nodeCleartextOverlayMentionsCreateServer() {
        String overlay = overlayFor("javascript_lang_http_insecure", "319",
                VulnerabilityFamily.CLEAR_TEXT_TRANSMISSION,
                PromptProfile.MISCONFIGURATION, PolicyProfile.TRANSPORT_SECURITY);

        assertTrue(overlay.contains("http.createServer"), overlay);
        assertFalse(overlay.contains("RISKY SCHEME"), overlay);
        assertFalse(overlay.contains("setattr"), overlay);
    }

    @Test
    void sqlGuidanceRejectsDenylistAsCompleteAllowlist() {
        SastRuleMetadata metadata = new SastRuleMetadata(
                "python_lang_sql_injection", List.of("89"), VulnerabilityFamily.SQL_INJECTION,
                PromptProfile.INJECTION, PolicyProfile.STRICT_SOURCE_TO_SINK, true, false, false);
        String guidance = new SastCwePromptGuidanceService().buildGuidance(metadata, "python");

        assertTrue(guidance.contains("denylist"), guidance);
        assertTrue(guidance.contains("computed"), guidance);
        assertTrue(guidance.contains("NOT an allowlist"), guidance);
    }

    @Test
    void sqlGuidanceStatesOneDecisionOrderWithNumericBeforeRiskyScheme() {
        String guidance = new SastCwePromptGuidanceService().buildGuidance(sqlMetadata("python_lang_sql_injection"), "python");

        int parameterized = guidance.indexOf("1. Parameterized");
        int numeric = guidance.indexOf("2. Numeric");
        int risky = guidance.indexOf("4. Trusted string operands (RISKY SCHEME)");
        int otherwise = guidance.indexOf("5. Otherwise");
        assertTrue(parameterized >= 0 && parameterized < numeric && numeric < risky && risky < otherwise, guidance);
        assertTrue(guidance.contains("The FIRST step that matches decides the verdict"), guidance);
        assertFalse(guidance.contains("TRUE_POSITIVE is mandatory"), guidance);
        assertEquals(1, occurrences(guidance, "RISKY SCHEME"), guidance);
    }

    @Test
    void evidenceNotesNoLongerCarryAConflictingSqlRuleSet() {
        Item item = new Item();
        item.setId("python_lang_sql_injection");
        item.setTitle("SQL injection");
        item.setFilename("app/user_api_sql.py");
        item.setCodeExtract("cursor.execute(query)");
        CodeContextExtractor.CodeContext context = new CodeContextExtractor.CodeContext(
                "query = f\"SELECT * FROM t WHERE id = {int(entity_id)}\"\ncursor.execute(query)", "", "", "",
                List.of(), "", "", "", "", "", "python", CodeContextExtractor.EvidenceCategory.AMBIGUOUS, List.of());

        List<String> notes = new SourceToSinkEvidenceBuilder()
                .build(item, context, sqlMetadata("python_lang_sql_injection")).policyNotes();
        String joined = String.join("\n", notes);

        assertFalse(joined.contains("CRITICAL RULE"), joined);
        assertFalse(joined.contains("Prefer UNCERTAIN when the SQL argument origin"), joined);
        assertTrue(joined.contains(SqlInjectionDecisionOrder.SUMMARY), joined);
    }

    @Test
    void sqlStageInstructionsReferenceTheSameOrder() {
        String overlay = overlayFor("python_lang_sql_injection", "89", VulnerabilityFamily.SQL_INJECTION,
                PromptProfile.INJECTION, PolicyProfile.STRICT_SOURCE_TO_SINK);

        assertTrue(overlay.contains(SqlInjectionDecisionOrder.SUMMARY), overlay);
        assertFalse(overlay.contains("do not downgrade to UNCERTAIN or FALSE_POSITIVE merely"), overlay);
    }

    private static SastRuleMetadata sqlMetadata(String ruleId) {
        return new SastRuleMetadata(ruleId, List.of("89"), VulnerabilityFamily.SQL_INJECTION,
                PromptProfile.INJECTION, PolicyProfile.STRICT_SOURCE_TO_SINK, true, false, false);
    }

    private static int occurrences(String text, String needle) {
        int count = 0;
        for (int i = text.indexOf(needle); i >= 0; i = text.indexOf(needle, i + needle.length())) {
            count++;
        }
        return count;
    }

    private String overlayFor(String ruleId, String cwe, VulnerabilityFamily family,
                              PromptProfile profile, PolicyProfile policy) {
        Item item = new Item();
        item.setId(ruleId);
        item.setCweIds(List.of(cwe));
        item.setFilename("app.js");
        SastRuleMetadata metadata = new SastRuleMetadata(
                ruleId, List.of(cwe), family, profile, policy, true, false, false);
        StringBuilder sb = new StringBuilder();
        service.appendCweSystemOverlay(sb, metadata, item);
        return sb.toString();
    }
}
