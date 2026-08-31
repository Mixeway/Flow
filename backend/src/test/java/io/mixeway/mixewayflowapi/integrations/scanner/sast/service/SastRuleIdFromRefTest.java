package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class SastRuleIdFromRefTest {

    @Test
    void extractsBearerRuleIdFromDocumentationUrlStoredAsRecommendation() {
        assertEquals("javascript_lang_xss",
                SASTService.ruleIdFromRef(
                        "https://docs.bearer.com/reference/rules/javascript_lang_xss"));
        assertEquals("javascript_express_cross_site_scripting",
                SASTService.ruleIdFromRef(
                        "https://docs.bearer.com/reference/rules/javascript_express_cross_site_scripting#description"));
    }

    @Test
    void blankOrNonRuleUrlIsNull() {
        assertNull(SASTService.ruleIdFromRef(null));
        assertNull(SASTService.ruleIdFromRef(""));
        assertNull(SASTService.ruleIdFromRef("https://cwe.mitre.org/data/definitions/79.html"));
    }
}
