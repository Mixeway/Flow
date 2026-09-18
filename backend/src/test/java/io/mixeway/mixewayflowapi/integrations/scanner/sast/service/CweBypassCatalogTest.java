package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CweBypassCatalogTest {

    @Test
    void appliesToClassicInjectionFamilies() {
        assertTrue(CweBypassCatalog.appliesTo(meta(VulnerabilityFamily.SQL_INJECTION, true)));
        assertTrue(CweBypassCatalog.appliesTo(meta(VulnerabilityFamily.COMMAND_INJECTION, true)));
        assertTrue(CweBypassCatalog.appliesTo(meta(VulnerabilityFamily.XSS, true)));
        assertTrue(CweBypassCatalog.appliesTo(meta(VulnerabilityFamily.PATH_TRAVERSAL, true)));
        assertTrue(CweBypassCatalog.appliesTo(meta(VulnerabilityFamily.SSRF, true)));
    }

    @Test
    void skipsMisconfigurationAndNonTaint() {
        assertFalse(CweBypassCatalog.appliesTo(meta(VulnerabilityFamily.WEAK_HASH, false)));
        assertFalse(CweBypassCatalog.appliesTo(meta(VulnerabilityFamily.COOKIE_SECURITY, false)));
        assertFalse(CweBypassCatalog.appliesTo(meta(VulnerabilityFamily.SQL_INJECTION, false)));
        assertFalse(CweBypassCatalog.appliesTo(null));
    }

    @Test
    void sqlCatalogRejectsQuoteBlacklistAndRequiresParameterization() {
        String block = CweBypassCatalog.familyBlock(VulnerabilityFamily.SQL_INJECTION);
        assertTrue(block.contains("QUOTE_BLACKLIST"), block);
        assertTrue(block.contains("bound parameters"), block);
        assertTrue(block.contains("denylist"), block);
        assertTrue(block.contains("MIXED_FRAGMENT"), block);
        assertTrue(block.contains("sibling computed"), block);
    }

    @Test
    void xssCatalogTreatsUnescapeAfterFilterAsUnsound() {
        String block = CweBypassCatalog.familyBlock(VulnerabilityFamily.XSS);
        assertTrue(block.contains("UNESCAPE_AFTER_FILTER"), block);
        assertTrue(block.toLowerCase().contains("unescape"), block);
    }

    private static SastRuleMetadata meta(VulnerabilityFamily family, boolean requiresTaint) {
        return new SastRuleMetadata("rule", List.of(), family, PromptProfile.INJECTION,
                PolicyProfile.STRICT_SOURCE_TO_SINK, requiresTaint, false, false);
    }
}
