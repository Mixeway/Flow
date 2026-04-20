package io.mixeway.mixewayflowapi.integrations.rag.service;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.RagCodeChunk;
import io.mixeway.mixewayflowapi.db.entity.Settings;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoRepository;
import io.mixeway.mixewayflowapi.db.repository.RagCodeChunkRepository;
import io.mixeway.mixewayflowapi.domain.settings.FindSettingsService;
import io.mixeway.mixewayflowapi.integrations.ollama.service.OllamaClient;
import io.mixeway.mixewayflowapi.integrations.rag.chunker.CodeChunk;
import io.mixeway.mixewayflowapi.integrations.rag.chunker.CodeChunker;
import io.mixeway.mixewayflowapi.integrations.rag.util.EmbeddingFloatCodec;
import io.mixeway.mixewayflowapi.integrations.rag.util.RepoPathFilters;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Log4j2
public class RagIndexerService {

    private static final int MAX_FILES = 8000;

    private final RagCodeChunkRepository ragCodeChunkRepository;
    private final CodeRepoRepository codeRepoRepository;
    private final CodeChunker codeChunker;
    private final OllamaClient ollamaClient;
    private final FindSettingsService findSettingsService;

    @Value("${ollama.embedding.model:nomic-embed-text}")
    private String ollamaEmbeddingModel;

    public void indexRepositoryIfEnabled(String repoDir, CodeRepo codeRepo, String commitId) {
        Settings settings = findSettingsService.get();
        if (settings == null || !settings.isOllamaEnabled()) {
            return;
        }
        if (settings.getOllamaBaseUrl() == null || settings.getOllamaBaseUrl().isBlank()) {
            return;
        }
        CodeRepo managed = codeRepoRepository.findById(codeRepo.getId()).orElse(null);
        if (managed == null) {
            return;
        }
        String embedModel = ollamaEmbeddingModel != null && !ollamaEmbeddingModel.isBlank()
                ? ollamaEmbeddingModel
                : "nomic-embed-text";

        managed.updateRagIndexState("INDEXING", commitId);
        codeRepoRepository.save(managed);

        ragCodeChunkRepository.deleteByCodeRepo(managed);

        Path root = Path.of(repoDir);
        int saved = 0;
        try {
            List<Path> files = collectFiles(root);
            for (Path file : files) {
                for (CodeChunk chunk : codeChunker.chunkFile(root, file)) {
                    byte[] embeddingBytes = null;
                    Integer dim = null;
                    Optional<float[]> emb = ollamaClient.embed(
                            settings.getOllamaBaseUrl(),
                            embedModel,
                            chunk.content(),
                            settings.getOllamaTimeoutSeconds());
                    if (emb.isPresent()) {
                        embeddingBytes = EmbeddingFloatCodec.toBytes(emb.get());
                        dim = emb.get().length;
                    }
                    String hash = md5Hex(chunk.content());
                    RagCodeChunk entity = new RagCodeChunk(
                            managed,
                            commitId,
                            chunk.filePath(),
                            chunk.startLine(),
                            chunk.endLine(),
                            chunk.language(),
                            chunk.content(),
                            embeddingBytes,
                            dim,
                            hash);
                    ragCodeChunkRepository.save(entity);
                    saved++;
                }
            }
            managed.updateRagIndexState("READY", commitId);
            codeRepoRepository.save(managed);
            log.info("[RAG] Stored {} chunks for repo {}", saved, managed.getName());
        } catch (Exception e) {
            log.error("[RAG] Indexing failed for {}: {}", managed.getName(), e.getMessage(), e);
            managed.updateRagIndexState("FAILED", null);
            codeRepoRepository.save(managed);
        }
    }

    private List<Path> collectFiles(Path root) throws IOException {
        List<Path> out = new ArrayList<>();
        try (Stream<Path> stream = Files.walk(root)) {
            stream.filter(Files::isRegularFile).forEach(p -> {
                if (out.size() >= MAX_FILES) {
                    return;
                }
                Path rel = root.relativize(p).normalize();
                if (RepoPathFilters.shouldSkipPath(rel)) {
                    return;
                }
                if (RepoPathFilters.isProbablyBinaryExtension(p.getFileName().toString())) {
                    return;
                }
                try {
                    if (Files.size(p) > 512 * 1024) {
                        return;
                    }
                } catch (IOException ignored) {
                    return;
                }
                out.add(p);
            });
        }
        return out;
    }

    private static String md5Hex(String text) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] d = md.digest(text.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : d) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            return "";
        }
    }
}
