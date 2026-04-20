package io.mixeway.mixewayflowapi.integrations.rag.chunker;

import io.mixeway.mixewayflowapi.integrations.rag.util.RepoPathFilters;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Component
@Log4j2
public class CodeChunker {

    private static final int TARGET_LINES = 45;
    private static final int OVERLAP = 10;
    private static final int MAX_FILE_BYTES = 512 * 1024;

    public List<CodeChunk> chunkFile(Path repoRoot, Path file) {
        List<CodeChunk> out = new ArrayList<>();
        Path rel = repoRoot.relativize(file).normalize();
        if (RepoPathFilters.shouldSkipPath(rel)) {
            return out;
        }
        String name = file.getFileName().toString();
        if (RepoPathFilters.isProbablyBinaryExtension(name)) {
            return out;
        }
        try {
            long size = Files.size(file);
            if (size > MAX_FILE_BYTES) {
                return out;
            }
            List<String> lines = Files.readAllLines(file, StandardCharsets.UTF_8);
            if (lines.isEmpty()) {
                return out;
            }
            String lang = guessLanguage(name);
            int i = 0;
            while (i < lines.size()) {
                int start = i;
                int end = Math.min(lines.size(), i + TARGET_LINES) - 1;
                String chunkText = joinLines(lines, start, end);
                out.add(new CodeChunk(rel.toString().replace('\\', '/'), start + 1, end + 1, lang, chunkText));
                if (end >= lines.size() - 1) {
                    break;
                }
                i = Math.max(end + 1 - OVERLAP, start + 1);
            }
        } catch (IOException e) {
            log.debug("[CodeChunker] Skip file {}: {}", file, e.getMessage());
        }
        return out;
    }

    private static String joinLines(List<String> lines, int startInclusive, int endInclusive) {
        StringBuilder sb = new StringBuilder();
        for (int i = startInclusive; i <= endInclusive; i++) {
            sb.append(lines.get(i)).append('\n');
        }
        return sb.toString();
    }

    private static String guessLanguage(String filename) {
        String lower = filename.toLowerCase(Locale.ROOT);
        if (lower.endsWith(".java")) {
            return "java";
        }
        if (lower.endsWith(".ts") || lower.endsWith(".tsx")) {
            return "typescript";
        }
        if (lower.endsWith(".js") || lower.endsWith(".jsx")) {
            return "javascript";
        }
        if (lower.endsWith(".py")) {
            return "python";
        }
        if (lower.endsWith(".go")) {
            return "go";
        }
        if (lower.endsWith(".tf") || lower.endsWith(".tfvars")) {
            return "terraform";
        }
        if (lower.endsWith(".yaml") || lower.endsWith(".yml")) {
            return "yaml";
        }
        if (lower.endsWith(".json")) {
            return "json";
        }
        if (lower.endsWith(".html") || lower.endsWith(".htm")) {
            return "html";
        }
        if (lower.endsWith(".css") || lower.endsWith(".scss")) {
            return "css";
        }
        return "text";
    }
}
