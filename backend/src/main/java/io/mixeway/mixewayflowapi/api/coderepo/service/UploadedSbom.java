package io.mixeway.mixewayflowapi.api.coderepo.service;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Comparator;

/**
 * An SBOM uploaded to Flow - from the UI or from a pipeline - on its way to the SCA scan.
 */
public final class UploadedSbom {

    public static final long MAX_BYTES = 50L * 1024 * 1024;

    private UploadedSbom() {
    }

    /**
     * Stores the upload as {@code sbom.json} in a new work directory, which is where the SCA scan
     * looks for it.
     *
     * @return the work directory; whoever takes it over removes it
     * @throws IllegalArgumentException when the file is missing, too large or not JSON
     */
    public static Path store(MultipartFile file, ObjectMapper objectMapper) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("SBOM file is required.");
        }
        if (file.getSize() > MAX_BYTES) {
            throw new IllegalArgumentException("SBOM file exceeds maximum allowed size (50 MB).");
        }

        Path workDir = Files.createTempDirectory("flow-sbom-upload-");
        Path target = workDir.resolve("sbom.json");
        try {
            try (var in = file.getInputStream()) {
                Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
            }
            objectMapper.readTree(target.toFile());
            return workDir;
        } catch (JacksonException e) {
            deleteQuietly(workDir);
            throw new IllegalArgumentException("Invalid JSON SBOM: " + e.getMessage(), e);
        } catch (IOException | RuntimeException e) {
            deleteQuietly(workDir);
            throw e;
        }
    }

    /** Removes a work directory that no scan took over. */
    public static void deleteQuietly(Path workDir) {
        try {
            if (Files.isDirectory(workDir)) {
                try (var walk = Files.walk(workDir)) {
                    walk.sorted(Comparator.reverseOrder()).forEach(p -> {
                        try {
                            Files.deleteIfExists(p);
                        } catch (IOException ignored) {
                            // best effort
                        }
                    });
                }
            }
        } catch (IOException ignored) {
            // best effort
        }
    }
}
