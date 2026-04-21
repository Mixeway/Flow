package io.mixeway.mixewayflowapi.integrations.ollama.util;

import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class SecretExplanationParserTest {

    @Test
    void parsesGitleaksStyleFingerprint() {
        String ex = """
                Found Secret in file backend/src/main/resources/application-ut.properties. Full fingerprint: \
                883baf0db57b7ce655e99de4a8624a8281d51925:backend/src/main/resources/application-ut.properties:generic-api-key:28\
                """;
        Optional<SecretExplanationParser.ParsedSecretExplanation> p = SecretExplanationParser.parse(ex);
        assertTrue(p.isPresent());
        assertEquals("883baf0db57b7ce655e99de4a8624a8281d51925", p.get().commitSha());
        assertEquals("backend/src/main/resources/application-ut.properties", p.get().filePath());
        assertEquals("generic-api-key", p.get().detectorType());
        assertEquals(28, p.get().lineNumber());
    }
}
