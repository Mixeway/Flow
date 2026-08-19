package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

class TimingEvidenceBuilderTest {

    private final TimingEvidenceBuilder builder = new TimingEvidenceBuilder();

    @Test
    void showTokenBooleanConfigIsNonSecurity() {
        assertEquals("non_security", builder.detectComparisonKind(
                "var re = state.showToken === true ? /[\\w$]/ : state.showToken;"));
    }

    @Test
    void ruleDescriptionSecretBoilerplateDoesNotForceSecuritySensitive() {
        Item item = new Item();
        item.setTitle("Observable timing discrepancy");
        item.setDescription("Comparing secrets or tokens with == can leak information through timing.");
        item.setCodeExtract("var re = state.showToken === true ? /[\\w$]/ : state.showToken;");
        item.setFilename("codemirror/addon/search/match-highlighter.js");

        FindingEvidence evidence = builder.build(item, null, timingMetadata());

        assertEquals("non_security", evidence.attributes().get("comparison_kind"));
        assertFalse(Boolean.parseBoolean(evidence.attributes().get("constant_time_api")));
    }

    @Test
    void passwordEqualsWithoutConstantTimeIsSecuritySensitive() {
        assertEquals("security_sensitive", builder.detectComparisonKind(
                "if (password.equals(userInput)) { grantAccess(); }"));
    }

    @Test
    void hmacTimingSafeEqualIsSecuritySensitiveWithConstantTimeApi() {
        Item item = new Item();
        item.setDescription("Observable timing when comparing secrets");
        item.setCodeExtract("const ok = crypto.timingSafeEqual(hmac, expectedHmac);");
        item.setFilename("auth.js");

        FindingEvidence evidence = builder.build(item, null, timingMetadata());

        assertEquals("security_sensitive", evidence.attributes().get("comparison_kind"));
        assertEquals("true", evidence.attributes().get("constant_time_api"));
    }

    @Test
    void locationHashCompareIsNonSecurity() {
        assertEquals("non_security", builder.detectComparisonKind(
                "if (location.hash === '#dashboard') { show(); }"));
    }

    @Test
    void tokenPresenceTypeofAndLengthIsNonSecurity() {
        assertEquals("non_security", builder.detectComparisonKind(
                "if (typeof cesiumAccessToken === \"string\" && cesiumAccessToken.length > 0) {"));
    }

    @Test
    void tokenEqualsExpectedRemainsSecuritySensitive() {
        assertEquals("security_sensitive", builder.detectComparisonKind(
                "if (cesiumAccessToken === expectedToken) { configure(); }"));
    }

    @Test
    void presenceCheckAloneIsNonSecurityEvenWithSecretName() {
        Item item = new Item();
        item.setCodeExtract("if (typeof cesiumAccessToken === \"string\" && cesiumAccessToken.length > 0) {");
        item.setFilename("geoserver/.../cesium.js");
        FindingEvidence evidence = builder.build(item, null, timingMetadata());
        assertEquals("non_security", evidence.attributes().get("comparison_kind"));
    }

    @Test
    void cssTokenizerTypeEqualsHashLiteralIsNonSecurity() {
        assertEquals("non_security", builder.detectComparisonKind(
                "} else if (type == \"hash\") {"));
    }

    @Test
    void passwordEqualsStringLiteralRemainsSecuritySensitive() {
        assertEquals("security_sensitive", builder.detectComparisonKind(
                "if (password.equals(\"admin\")) { grantAccess(); }"));
    }

    private static SastRuleMetadata timingMetadata() {
        return new SastRuleMetadata(
                "javascript_lang_observable_timing",
                List.of("208"),
                VulnerabilityFamily.TIMING_SIDE_CHANNEL,
                PromptProfile.TIMING,
                PolicyProfile.TIMING_SIDE_CHANNEL,
                false,
                true,
                true);
    }
}
