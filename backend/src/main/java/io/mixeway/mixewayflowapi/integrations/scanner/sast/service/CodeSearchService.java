package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.PathMatcher;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;
import java.util.stream.Stream;

/**
 * Language-agnostic, read-only repository search used by the agentic SAST verifier.
 * <p>
 * The LLM can call {@link #searchRepo} to locate where a flagged value originates
 * (definitions, assignments, call sites) and {@link #readFile} to inspect the
 * surrounding code. All access is confined to the scanned repository directory and
 * every result is size-capped to protect the token budget.
 */
@Component
@Log4j2
public class CodeSearchService {

    private static final int MAX_MATCHES = 40;
    private static final int MAX_MATCHES_PER_FILE = 6;
    private static final int MAX_FILES_TO_SCAN = 5000;
    private static final long MAX_FILE_BYTES = 1024L * 1024L;
    private static final int MAX_READ_LINES = 120;
    private static final int MAX_LINE_LENGTH = 400;

    private static final Set<String> SKIP_DIRS = Set.of(
            ".git", ".hg", ".svn", "node_modules", "dist", "build", "out",
            ".venv", "venv", "env", "__pycache__", "target", ".idea", ".gradle",
            "coverage", ".tox", "site-packages", "vendor", ".next", ".cache");

    private static final Set<String> SOURCE_EXT = Set.of(
            "py", "java", "js", "jsx", "ts", "tsx", "mjs", "cjs", "rb", "go", "php",
            "cs", "rs", "swift", "kt", "kts", "scala", "groovy", "c", "cc", "cpp",
            "cxx", "h", "hh", "hpp", "m", "mm", "vue", "svelte", "html", "erb",
            "ejs", "tpl", "twig", "pl", "pm", "sh", "bash");

    /**
     * Search source files under {@code repoDir} for a regex (or literal fallback) pattern.
     *
     * @param pathGlob optional filename glob filter (e.g. {@code *.py}); may be null/blank
     * @return formatted {@code path:line: content} matches, or a short status message
     */
    public String searchRepo(String repoDir, String pattern, String pathGlob) {
        if (repoDir == null || repoDir.isBlank()) {
            return "Repository directory is not available.";
        }
        if (pattern == null || pattern.isBlank()) {
            return "No results (empty search pattern).";
        }

        Path base;
        try {
            base = Path.of(repoDir).toRealPath();
        } catch (IOException e) {
            return "Repository directory is not accessible.";
        }

        Pattern regex;
        try {
            regex = Pattern.compile(pattern);
        } catch (PatternSyntaxException e) {
            regex = Pattern.compile(Pattern.quote(pattern));
        }

        PathMatcher globMatcher = null;
        if (pathGlob != null && !pathGlob.isBlank()) {
            try {
                globMatcher = FileSystems.getDefault().getPathMatcher("glob:" + pathGlob.trim());
            } catch (Exception ignored) {
                // Invalid glob: ignore the filter rather than failing the search.
            }
        }

        record MatchEntry(String relPath, int lineNo, String lineText) {}
        List<MatchEntry> matches = new java.util.ArrayList<>();
        int scannedFiles = 0;
        try (Stream<Path> walk = Files.walk(base)) {
            Iterator<Path> it = walk.iterator();
            while (it.hasNext() && matches.size() < MAX_MATCHES && scannedFiles < MAX_FILES_TO_SCAN) {
                Path p = it.next();
                if (Files.isDirectory(p)) continue;
                if (isSkipped(base, p)) continue;
                if (!isSource(p)) continue;
                Path relPath = base.relativize(p);
                if (globMatcher != null
                        && !globMatcher.matches(relPath)
                        && !globMatcher.matches(relPath.getFileName())) continue;
                try {
                    if (Files.size(p) > MAX_FILE_BYTES) continue;
                } catch (IOException e) {
                    continue;
                }
                scannedFiles++;

                List<String> lines;
                try {
                    lines = Files.readAllLines(p, StandardCharsets.UTF_8);
                } catch (IOException e) {
                    continue;
                }

                String rel = relPath.toString().replace('\\', '/');
                int perFile = 0;
                for (int i = 0; i < lines.size() && matches.size() < MAX_MATCHES && perFile < MAX_MATCHES_PER_FILE; i++) {
                    if (regex.matcher(lines.get(i)).find()) {
                        matches.add(new MatchEntry(rel, i + 1, clip(lines.get(i).trim())));
                        perFile++;
                    }
                }
            }
        } catch (IOException e) {
            return "Search failed: " + e.getMessage();
        } catch (Exception e) {
            // Defensive: never let a tool call bubble an exception into the LLM loop.
            log.warn("[CodeSearchService] searchRepo failed for pattern '{}': {}", pattern, e.getMessage());
            return "Search failed unexpectedly.";
        }

        if (matches.isEmpty()) {
            return "No matches found for pattern: " + pattern;
        }

        matches.sort(java.util.Comparator
                .comparingInt((MatchEntry entry) -> pathRank(entry.relPath()))
                .thenComparing(MatchEntry::relPath)
                .thenComparingInt(MatchEntry::lineNo));

        StringBuilder sb = new StringBuilder();
        for (MatchEntry entry : matches) {
            sb.append(entry.relPath()).append(':').append(entry.lineNo()).append(": ")
                    .append(entry.lineText()).append('\n');
        }

        return "Matches (" + matches.size() + (matches.size() >= MAX_MATCHES ? "+, truncated" : "") + "):\n" + sb;
    }

    /**
     * Read a slice of a repository file. Path is confined to {@code repoDir}; the
     * returned span is capped at {@link #MAX_READ_LINES} lines.
     */
    public String readFile(String repoDir, String relPath, int startLine, int endLine) {
        if (repoDir == null || repoDir.isBlank()) {
            return "Repository directory is not available.";
        }
        if (relPath == null || relPath.isBlank()) {
            return "Invalid file path.";
        }

        Path base;
        Path target;
        try {
            base = Path.of(repoDir).toRealPath();
            target = base.resolve(relPath.trim()).normalize();
            if (!target.startsWith(base)) {
                return "Access denied: path is outside the repository.";
            }
        } catch (IOException e) {
            return "Path is not accessible.";
        }

        if (!Files.exists(target) || Files.isDirectory(target)) {
            return "File not found: " + relPath;
        }

        List<String> lines;
        try {
            lines = Files.readAllLines(target, StandardCharsets.UTF_8);
        } catch (IOException e) {
            return "Cannot read file: " + relPath;
        }

        if (lines.isEmpty()) {
            return relPath + " is empty.";
        }

        int start = startLine <= 0 ? 1 : startLine;
        if (start > lines.size()) {
            return "Start line " + start + " is beyond end of file (" + lines.size() + " lines).";
        }
        int end = endLine <= 0 ? lines.size() : endLine;
        if (end - start + 1 > MAX_READ_LINES) {
            end = start + MAX_READ_LINES - 1;
        }
        end = Math.min(end, lines.size());

        StringBuilder sb = new StringBuilder();
        sb.append(relPath.replace('\\', '/'))
                .append(" (lines ").append(start).append('-').append(end).append("):\n");
        for (int i = start; i <= end; i++) {
            sb.append(i).append("| ").append(clip(lines.get(i - 1))).append('\n');
        }
        return sb.toString();
    }

    private boolean isSkipped(Path base, Path file) {
        Path rel = base.relativize(file);
        for (Path part : rel) {
            if (SKIP_DIRS.contains(part.toString())) {
                return true;
            }
        }
        return false;
    }

    private boolean isSource(Path p) {
        String name = p.getFileName().toString();
        int dot = name.lastIndexOf('.');
        if (dot < 0 || dot == name.length() - 1) {
            return false;
        }
        return SOURCE_EXT.contains(name.substring(dot + 1).toLowerCase(Locale.ROOT));
    }

    private String clip(String line) {
        if (line.length() <= MAX_LINE_LENGTH) {
            return line;
        }
        return line.substring(0, MAX_LINE_LENGTH) + " …(truncated)";
    }

    private int pathRank(String relPath) {
        String lower = relPath.toLowerCase(Locale.ROOT);
        // Prefer production sources over tests/docs for call-site and definition discovery.
        if (lower.contains("/src/main/") || lower.contains("\\src\\main\\")) {
            return 0;
        }
        if (lower.startsWith("src/") || lower.contains("/src/")
                || lower.startsWith("app/") || lower.contains("/app/")
                || lower.startsWith("lib/") || lower.contains("/lib/")) {
            return 1;
        }
        if (lower.contains("/controller/") || lower.contains("/service/")
                || lower.contains("/repository/") || lower.contains("/api/")) {
            return 2;
        }
        if (lower.contains("/test/") || lower.contains("/tests/")
                || lower.contains("/src/test/") || lower.contains("/spec/")
                || lower.contains("/docs/") || lower.contains("/examples/")
                || lower.endsWith("test.java") || lower.endsWith("tests.java")
                || lower.endsWith("_test.go") || lower.endsWith(".spec.ts")
                || lower.endsWith(".spec.js")) {
            return 4;
        }
        return 3;
    }
}
