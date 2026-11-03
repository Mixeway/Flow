package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CodeContextExtractorPythonFunctionTest {

    private static final String REPOSITORY = """
            class UserApiRepository:
                @staticmethod
                def get_subordinates(entity_id):
                    connection = get_connection()
                    cursor = connection.cursor()
                    query = f"SELECT * FROM users WHERE entity_id = {int(entity_id)}"
                    cursor.execute(query)
                    return cursor.fetchall()

                @staticmethod
                @cached
                def other_method():
                    return None
            """;

    private final CodeContextExtractor extractor = new CodeContextExtractor(new SinkArgumentParser());

    @TempDir
    Path repo;

    @Test
    void decoratedFunctionBodyIncludesTheBody() throws Exception {
        String body = functionBodyAt("cursor.execute(query)");

        assertTrue(body.contains("@staticmethod"), body);
        assertTrue(body.contains("def get_subordinates(entity_id):"), body);
        assertTrue(body.contains("cursor.execute(query)"), body);
        assertTrue(body.contains("return cursor.fetchall()"), body);
        assertFalse(body.contains("def other_method"), body);
        assertFalse(body.contains("@cached"), body);
    }

    @Test
    void stackedDecoratorsStillYieldTheBody() throws Exception {
        String body = functionBodyAt("return None");

        assertTrue(body.contains("@cached"), body);
        assertTrue(body.contains("def other_method():"), body);
        assertTrue(body.contains("return None"), body);
        assertFalse(body.contains("cursor.execute"), body);
    }

    private String functionBodyAt(String marker) throws Exception {
        Path file = repo.resolve("app/user_api_repository.py");
        Files.createDirectories(file.getParent());
        Files.writeString(file, REPOSITORY, StandardCharsets.UTF_8);

        Item item = new Item();
        item.setFullFilename("app/user_api_repository.py");
        item.setFilename("user_api_repository.py");
        item.setLineNumber(lineOf(marker));
        item.setCodeExtract(marker);

        return extractor.extractLocal(repo.toString(), item).functionBody();
    }

    private static int lineOf(String marker) {
        String[] lines = REPOSITORY.split("\n");
        for (int i = 0; i < lines.length; i++) {
            if (lines[i].contains(marker)) {
                return i + 1;
            }
        }
        throw new IllegalArgumentException(marker);
    }
}
