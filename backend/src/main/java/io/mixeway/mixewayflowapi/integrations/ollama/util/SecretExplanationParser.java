package io.mixeway.mixewayflowapi.integrations.ollama.util;

import java.util.Arrays;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Parses common secret-scanner explanation text (e.g. Gitleaks-style) to extract
 * commit hash, file path, detector type, and line number from the fingerprint line.
 */
public final class SecretExplanationParser {

    private static final Pattern FOUND_FILE = Pattern.compile(
            "Found Secret in file\\s+([^\\n]+)", Pattern.CASE_INSENSITIVE);

    private SecretExplanationParser() {}

    public record ParsedSecretExplanation(
            String foundInFileLine,
            String commitSha,
            String filePath,
            String detectorType,
            int lineNumber
    ) {}

    public static Optional<ParsedSecretExplanation> parse(String explanation) {
        if (explanation == null || explanation.isBlank()) {
            return Optional.empty();
        }
        String foundFile = null;
        Matcher fm = FOUND_FILE.matcher(explanation);
        if (fm.find()) {
            foundFile = fm.group(1).trim();
        }

        String fpLine = extractFingerprintLine(explanation);
        if (fpLine == null) {
            if (foundFile != null) {
                return Optional.of(new ParsedSecretExplanation(foundFile, null, null, null, 0));
            }
            return Optional.empty();
        }

        // Format: <commitSha>:<filePath>:<detectorType>:<line> — path may contain ':'
        String[] parts = fpLine.split(":");
        if (parts.length < 4) {
            return Optional.empty();
        }
        try {
            int line = Integer.parseInt(parts[parts.length - 1].trim());
            String detectorType = parts[parts.length - 2].trim();
            String commitSha = parts[0].trim();
            String filePath = String.join(":", Arrays.copyOfRange(parts, 1, parts.length - 2)).trim();
            String foundLine = foundFile != null ? foundFile : filePath;
            return Optional.of(new ParsedSecretExplanation(foundLine, commitSha, filePath, detectorType, line));
        } catch (NumberFormatException e) {
            return Optional.empty();
        }
    }

    private static String extractFingerprintLine(String explanation) {
        int idx = explanation.indexOf("Full fingerprint:");
        if (idx < 0) {
            return null;
        }
        String rest = explanation.substring(idx + "Full fingerprint:".length()).trim();
        int nl = rest.indexOf('\n');
        if (nl > 0) {
            rest = rest.substring(0, nl).trim();
        }
        return rest.isEmpty() ? null : rest;
    }
}
