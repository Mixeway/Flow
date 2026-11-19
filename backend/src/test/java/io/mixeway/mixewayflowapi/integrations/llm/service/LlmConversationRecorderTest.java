package io.mixeway.mixewayflowapi.integrations.llm.service;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.slf4j.LoggerFactory;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class LlmConversationRecorderTest {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    @TempDir
    Path tempDir;

    private Logger appLogger;

    @BeforeEach
    void enableDebugAndPointAtTemp() {
        appLogger = (Logger) LoggerFactory.getLogger(LlmConversationRecorder.APP_LOGGER);
        appLogger.setLevel(Level.DEBUG);
        LlmConversationRecorder.configure(tempDir);
    }

    @AfterEach
    void clearThreadLocal() {
        LlmConversationRecorder.finish(null, null);
        appLogger.setLevel(null);
        LlmConversationRecorder.configure(LlmConversationRecorder.defaultDirectory());
    }

    @Test
    void entireConversationLandsInOneFileUnderTheRepositoryFolder() throws Exception {
        LlmConversationRecorder.begin("Group/Flow API", "item 'XSS' [a.js:10, rule=xss]", "xss", "XSS", "src/a.js", 10);
        LlmConversationRecorder.record(
                List.of(Map.of("role", "system", "content", "sys"), Map.of("role", "user", "content", "look")),
                "model-a", 12L, 1, "ok", "{\"action\":\"read_file\"}");
        LlmConversationRecorder.record(
                List.of(Map.of("role", "user", "content", "TOOL RESULT")),
                "model-a", 8L, 1, "ok", "{\"action\":\"final\",\"verdict\":\"FALSE_POSITIVE\"}");

        Path file = LlmConversationRecorder.finish("FALSE_POSITIVE", 0.9d);

        assertNotNull(file);
        assertTrue(Files.exists(file));
        assertEquals(tempDir.resolve("group_flow_api"), file.getParent());
        JsonNode root = MAPPER.readTree(file.toFile());
        assertEquals("group_flow_api", root.path("repository").asText());
        assertEquals("FALSE_POSITIVE", root.path("verdict").asText());
        assertEquals(2, root.path("turnCount").asInt());
        assertEquals(2, root.path("turns").size());
        assertEquals("sys", root.path("turns").get(0).path("request").get(0).path("content").asText());
        assertTrue(root.path("turns").get(1).path("response").asText().contains("FALSE_POSITIVE"));
    }

    @Test
    void recordWithoutBeginIsNoOp() {
        LlmConversationRecorder.record(List.of(Map.of("role", "user", "content", "x")), "m", 1L, 1, "ok", "y");
        assertNull(LlmConversationRecorder.finish("TRUE_POSITIVE", 1.0d));
    }

    @Test
    void infoLevelWritesNothing() throws Exception {
        appLogger.setLevel(Level.INFO);
        LlmConversationRecorder.begin("acme", "item", "xss", "XSS", "src/a.js", 10);
        LlmConversationRecorder.record(List.of(Map.of("role", "user", "content", "x")), "m", 1L, 1, "ok", "y");
        assertNull(LlmConversationRecorder.finish("FALSE_POSITIVE", 0.5d));
        assertFalse(Files.exists(tempDir.resolve("acme")));
    }
}
