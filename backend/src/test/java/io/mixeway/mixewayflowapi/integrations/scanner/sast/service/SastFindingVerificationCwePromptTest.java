package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class SastFindingVerificationCwePromptTest {

    private final SastFindingVerificationService service = new SastFindingVerificationService(
            null, null, null, null, null, new SastCwePromptGuidanceService());

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
