package io.mixeway.mixewayflowapi.integrations.scanner.sca.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class SbomSanitizerTest {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final SbomSanitizer sanitizer = new SbomSanitizer(objectMapper);

    @TempDir
    Path tempDir;

    @Test
    void removesUnversionedComponentsAndTheirDependencyReferences() throws IOException {
        File sbom = writeSbom("""
                {
                  "bomFormat": "CycloneDX",
                  "specVersion": "1.5",
                  "metadata": {"component": {"bom-ref": "pkg:maven/bgs/wdg-core@1.1.0-SNAPSHOT?type=jar"}},
                  "components": [
                    {"bom-ref": "pkg:maven/org.postgresql/postgresql@42.7.4?type=jar", "name": "postgresql",
                     "version": "42.7.4", "purl": "pkg:maven/org.postgresql/postgresql@42.7.4?type=jar"},
                    {"bom-ref": "pkg:maven/org.springframework.boot/spring-boot-starter-web?type=jar",
                     "name": "spring-boot-starter-web",
                     "purl": "pkg:maven/org.springframework.boot/spring-boot-starter-web?type=jar"},
                    {"bom-ref": "pkg:maven/bgs.common/pubsub-receiver@$%7Bbgs.pubsub.version%7D?type=jar",
                     "name": "pubsub-receiver", "version": "${bgs.pubsub.version}",
                     "purl": "pkg:maven/bgs.common/pubsub-receiver@$%7Bbgs.pubsub.version%7D?type=jar"}
                  ],
                  "dependencies": [
                    {"ref": "pkg:maven/bgs/wdg-core@1.1.0-SNAPSHOT?type=jar", "dependsOn": [
                      "pkg:maven/org.postgresql/postgresql@42.7.4?type=jar",
                      "pkg:maven/org.springframework.boot/spring-boot-starter-web?type=jar",
                      "pkg:maven/bgs.common/pubsub-receiver@$%7Bbgs.pubsub.version%7D?type=jar"
                    ]},
                    {"ref": "pkg:maven/org.springframework.boot/spring-boot-starter-web?type=jar", "dependsOn": []}
                  ]
                }
                """);

        List<String> removed = sanitizer.removeUnversionedComponents(sbom);

        assertEquals(2, removed.size());
        JsonNode result = objectMapper.readTree(sbom);
        assertEquals(1, result.get("components").size());
        assertEquals("postgresql", result.get("components").get(0).get("name").asText());
        assertEquals(1, result.get("dependencies").size());
        assertEquals(List.of("pkg:maven/org.postgresql/postgresql@42.7.4?type=jar"),
                textValues(result.get("dependencies").get(0).get("dependsOn")));
        assertEquals("pkg:maven/bgs/wdg-core@1.1.0-SNAPSHOT?type=jar",
                result.get("metadata").get("component").get("bom-ref").asText());
    }

    @Test
    void removesUnversionedNestedComponents() throws IOException {
        File sbom = writeSbom("""
                {
                  "components": [
                    {"name": "outer", "version": "1.0", "purl": "pkg:maven/a/outer@1.0", "components": [
                      {"name": "inner", "purl": "pkg:maven/a/inner"}
                    ]}
                  ]
                }
                """);

        List<String> removed = sanitizer.removeUnversionedComponents(sbom);

        assertEquals(List.of("pkg:maven/a/inner"), removed);
        assertEquals(0, objectMapper.readTree(sbom).get("components").get(0).get("components").size());
    }

    @Test
    void leavesFullyVersionedSbomUntouched() throws IOException {
        String content = """
                {"components": [{"name": "postgresql", "version": "42.7.4",
                  "purl": "pkg:maven/org.postgresql/postgresql@42.7.4?type=jar"}]}
                """;
        File sbom = writeSbom(content);

        List<String> removed = sanitizer.removeUnversionedComponents(sbom);

        assertTrue(removed.isEmpty());
        assertEquals(content, Files.readString(sbom.toPath()));
    }

    private File writeSbom(String content) throws IOException {
        Path file = tempDir.resolve("sbom.json");
        Files.writeString(file, content);
        return file.toFile();
    }

    private static List<String> textValues(JsonNode array) {
        List<String> values = new ArrayList<>();
        array.forEach(n -> values.add(n.asText()));
        return values;
    }
}
