package io.mixeway.mixewayflowapi.integrations.rag.util;

import java.util.Optional;

public final class FindingLocationParser {

    private FindingLocationParser() {}

    /**
     * Parses locations like "src/App.java:42" (last colon separates line number).
     */
    public static Optional<LocationRef> parse(String location) {
        if (location == null || location.isBlank()) {
            return Optional.empty();
        }
        int idx = location.lastIndexOf(':');
        if (idx <= 0 || idx >= location.length() - 1) {
            return Optional.empty();
        }
        String linePart = location.substring(idx + 1).trim();
        try {
            int line = Integer.parseInt(linePart);
            if (line < 1) {
                return Optional.empty();
            }
            String file = location.substring(0, idx).trim();
            if (file.isEmpty()) {
                return Optional.empty();
            }
            return Optional.of(new LocationRef(file, line));
        } catch (NumberFormatException e) {
            return Optional.empty();
        }
    }

    public record LocationRef(String filePath, int lineNumber) {}
}
