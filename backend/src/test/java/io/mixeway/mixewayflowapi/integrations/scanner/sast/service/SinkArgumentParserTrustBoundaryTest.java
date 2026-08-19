package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class SinkArgumentParserTrustBoundaryTest {

    private final SinkArgumentParser parser = new SinkArgumentParser();

    @Test
    void extractsSetAttributeValueNotKey() {
        String extract = "request.setAttribute(HTTP_ATTRIBUTE_CONFIG_ID, filterConfig.getId());";
        SinkArgumentParser.SinkAnalysis analysis = parser.analyze(extract);
        assertNotNull(analysis.primaryCandidate());
        assertEquals("filterConfig.getId", analysis.primaryCandidate());
    }

    @Test
    void extractsSessionSetAttributeValue() {
        String extract = "httpServletRequest.getSession().setAttribute(\"uid\", userName);";
        SinkArgumentParser.SinkAnalysis analysis = parser.analyze(extract);
        assertEquals("userName", analysis.primaryCandidate());
    }

    @Test
    void trustBoundaryFamilyRequiresTaintSupport() {
        SourceToSinkEvidenceBuilder builder = new SourceToSinkEvidenceBuilder();
        assertTrue(builder.supports(new SastRuleMetadata(
                "java_lang_trust_boundary_violation",
                java.util.List.of("501"),
                VulnerabilityFamily.TRUST_BOUNDARY,
                PromptProfile.INJECTION,
                PolicyProfile.STRICT_SOURCE_TO_SINK,
                true,
                false,
                false)));
    }
}
