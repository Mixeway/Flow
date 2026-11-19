package io.mixeway.mixewayflowapi.integrations.llm.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import lombok.extern.log4j.Log4j2;
import org.apache.logging.log4j.LogManager;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Persists every LLM request/response for one finding analysis into a single JSON file.
 * Files go under {@code <directory>/<repository>/} (never {@code java.io.tmpdir}).
 * Recording runs only while logger {@code io.mixeway.mixewayflowapi} is at DEBUG,
 * which is what {@code LOGGING_LEVEL_IO_MIXEWAY_MIXEWAYFLOWAPI=DEBUG} turns on.
 */
@Log4j2
public final class LlmConversationRecorder {

    static final String APP_LOGGER = "io.mixeway.mixewayflowapi";

    private static final DateTimeFormatter FILE_TS =
            DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss-SSS").withZone(ZoneOffset.UTC);
    private static final ObjectMapper MAPPER = new ObjectMapper()
            .enable(SerializationFeature.INDENT_OUTPUT);
    private static final ThreadLocal<Session> ACTIVE = new ThreadLocal<>();

    private static volatile Path directory = defaultDirectory();

    private LlmConversationRecorder() {
    }

    static Path defaultDirectory() {
        return Path.of(System.getProperty("user.dir", ".")).resolve("llm-conversations").toAbsolutePath().normalize();
    }

    public static void configure(Path directory) {
        if (directory != null) {
            LlmConversationRecorder.directory = directory.toAbsolutePath().normalize();
        }
        log.info("[LlmConversation] LLM conversations go under {}/<repository> when logger {} is DEBUG",
                LlmConversationRecorder.directory, APP_LOGGER);
    }

    public static Path directory() {
        return directory;
    }

    public static boolean isEnabled() {
        return LogManager.getLogger(APP_LOGGER).isDebugEnabled();
    }

    /**
     * Opens a conversation for the current thread under a folder named after the repository.
     * Later {@link #record} calls append turns; {@link #finish} writes the full conversation
     * to one JSON file. Does nothing unless application debug logging is on.
     */
    public static void begin(String repositoryName, String itemRef, String ruleId, String title,
                              String filename, Integer lineNumber) {
        if (!isEnabled()) {
            return;
        }
        Session previous = ACTIVE.get();
        if (previous != null) {
            log.warn("[LlmConversation] Replacing unfinished conversation for {}", previous.itemRef);
            previous.write(null, null);
            ACTIVE.remove();
        }
        String folder = sanitize(repositoryName == null || repositoryName.isBlank() ? "unknown-repo" : repositoryName);
        Path repoDirectory = directory.resolve(folder);
        try {
            Files.createDirectories(repoDirectory);
        } catch (Exception e) {
            log.warn("[LlmConversation] Cannot create {}: {}", repoDirectory, e.getMessage());
            return;
        }
        ACTIVE.set(new Session(folder, itemRef, ruleId, title, filename, lineNumber, repoDirectory));
    }

    /** Appends one LLM HTTP exchange to the active conversation and rewrites the JSON file. */
    public static void record(List<Map<String, Object>> requestMessages, String model, long elapsedMs,
                              int attempt, String status, String responseContent) {
        Session session = ACTIVE.get();
        if (session == null || !isEnabled()) {
            return;
        }
        session.addTurn(requestMessages, model, elapsedMs, attempt, status, responseContent);
        session.write(null, null);
    }

    /**
     * Finalizes the conversation: stamps the verdict, writes the JSON file once more, and clears
     * the thread-local. Safe to call when nothing was begun.
     */
    public static Path finish(String verdict, Double confidence) {
        Session session = ACTIVE.get();
        if (session == null) {
            return null;
        }
        try {
            return session.write(verdict, confidence);
        } finally {
            ACTIVE.remove();
        }
    }

    private static final class Session {
        private final String repository;
        private final String itemRef;
        private final String ruleId;
        private final String title;
        private final String filename;
        private final Integer lineNumber;
        private final Instant startedAt = Instant.now();
        private final List<Map<String, Object>> turns = new ArrayList<>();
        private final AtomicInteger seq = new AtomicInteger();
        private final Path file;

        private Session(String repository, String itemRef, String ruleId, String title, String filename,
                        Integer lineNumber, Path directory) {
            this.repository = repository;
            this.itemRef = itemRef == null ? "" : itemRef;
            this.ruleId = ruleId == null ? "" : ruleId;
            this.title = title == null ? "" : title;
            this.filename = filename == null ? "" : filename;
            this.lineNumber = lineNumber;
            String stamp = FILE_TS.format(startedAt);
            String base = sanitize(shortName(filename)) + "_" + (lineNumber == null ? "0" : lineNumber)
                    + "_" + sanitize(ruleId.isBlank() ? "rule" : ruleId);
            this.file = directory.resolve(stamp + "_" + base + ".json");
        }

        private void addTurn(List<Map<String, Object>> requestMessages, String model, long elapsedMs,
                             int attempt, String status, String responseContent) {
            Map<String, Object> turn = new LinkedHashMap<>();
            turn.put("seq", seq.incrementAndGet());
            turn.put("timestamp", Instant.now().toString());
            turn.put("model", model == null ? "" : model);
            turn.put("elapsedMs", elapsedMs);
            turn.put("attempt", attempt);
            turn.put("status", status == null ? "" : status);
            turn.put("request", copyMessages(requestMessages));
            turn.put("response", responseContent == null ? "" : responseContent);
            turns.add(turn);
        }

        private Path write(String verdict, Double confidence) {
            Map<String, Object> root = new LinkedHashMap<>();
            root.put("startedAt", startedAt.toString());
            root.put("finishedAt", Instant.now().toString());
            root.put("repository", repository);
            root.put("itemRef", itemRef);
            root.put("ruleId", ruleId);
            root.put("title", title);
            root.put("filename", filename);
            root.put("lineNumber", lineNumber);
            if (verdict != null) {
                root.put("verdict", verdict);
            }
            if (confidence != null) {
                root.put("confidence", confidence);
            }
            root.put("turnCount", turns.size());
            root.put("turns", turns);
            Path tmp = file.resolveSibling(file.getFileName().toString() + ".tmp");
            try {
                MAPPER.writeValue(tmp.toFile(), root);
                Files.move(tmp, file, StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.ATOMIC_MOVE);
                log.debug("[LlmConversation] Wrote {} ({} turns)", file, turns.size());
                return file;
            } catch (Exception atomicFailed) {
                try {
                    Files.move(tmp, file, StandardCopyOption.REPLACE_EXISTING);
                    log.debug("[LlmConversation] Wrote {} ({} turns, non-atomic)", file, turns.size());
                    return file;
                } catch (Exception e) {
                    log.warn("[LlmConversation] Failed to write {}: {}", file, e.getMessage());
                    try {
                        Files.deleteIfExists(tmp);
                    } catch (Exception ignored) {
                        // best-effort cleanup
                    }
                    return null;
                }
            }
        }
    }

    private static List<Map<String, Object>> copyMessages(List<Map<String, Object>> messages) {
        if (messages == null || messages.isEmpty()) {
            return List.of();
        }
        List<Map<String, Object>> copy = new ArrayList<>(messages.size());
        for (Map<String, Object> message : messages) {
            if (message == null) {
                continue;
            }
            Map<String, Object> entry = new LinkedHashMap<>();
            Object role = message.get("role");
            Object content = message.get("content");
            entry.put("role", role == null ? "" : role.toString());
            entry.put("content", content == null ? "" : content.toString());
            copy.add(entry);
        }
        return copy;
    }

    private static String shortName(String filename) {
        if (filename == null || filename.isBlank()) {
            return "finding";
        }
        String normalized = filename.replace('\\', '/');
        int slash = normalized.lastIndexOf('/');
        return slash >= 0 ? normalized.substring(slash + 1) : normalized;
    }

    static String sanitize(String value) {
        if (value == null || value.isBlank()) {
            return "x";
        }
        String cleaned = value.replaceAll("[^A-Za-z0-9._-]+", "_");
        if (cleaned.length() > 80) {
            cleaned = cleaned.substring(0, 80);
        }
        return cleaned.isBlank() ? "x" : cleaned.toLowerCase(Locale.ROOT);
    }
}
