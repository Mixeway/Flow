package io.mixeway.mixewayflowapi.integrations.rag.util;

import java.nio.file.Path;
import java.util.Locale;

public final class RepoPathFilters {

    private RepoPathFilters() {}

    public static boolean shouldSkipPath(Path relativeRepoPath) {
        String p = relativeRepoPath.toString().replace('\\', '/').toLowerCase(Locale.ROOT);
        if (p.isEmpty() || p.equals(".git") || p.startsWith(".git/")) {
            return true;
        }
        if (p.contains("/node_modules/") || p.startsWith("node_modules/")) {
            return true;
        }
        if (p.contains("/vendor/") || p.startsWith("vendor/")) {
            return true;
        }
        if (p.contains("/.git/")) {
            return true;
        }
        return false;
    }

    public static boolean isProbablyBinaryExtension(String filename) {
        String lower = filename.toLowerCase(Locale.ROOT);
        return lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg")
                || lower.endsWith(".gif") || lower.endsWith(".ico") || lower.endsWith(".webp")
                || lower.endsWith(".pdf") || lower.endsWith(".zip") || lower.endsWith(".jar")
                || lower.endsWith(".war") || lower.endsWith(".class") || lower.endsWith(".exe")
                || lower.endsWith(".dll") || lower.endsWith(".so") || lower.endsWith(".dylib")
                || lower.endsWith(".woff") || lower.endsWith(".woff2") || lower.endsWith(".ttf")
                || lower.endsWith(".eot") || lower.endsWith(".mp4") || lower.endsWith(".mp3")
                || lower.endsWith(".gz") || lower.endsWith(".tgz") || lower.endsWith(".7z")
                || lower.endsWith(".rar");
    }
}
