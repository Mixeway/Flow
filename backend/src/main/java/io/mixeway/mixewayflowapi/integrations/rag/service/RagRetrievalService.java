package io.mixeway.mixewayflowapi.integrations.rag.service;

import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.entity.RagCodeChunk;
import io.mixeway.mixewayflowapi.db.entity.Settings;
import io.mixeway.mixewayflowapi.db.repository.RagCodeChunkRepository;
import io.mixeway.mixewayflowapi.integrations.ollama.service.OllamaClient;
import io.mixeway.mixewayflowapi.integrations.rag.util.EmbeddingFloatCodec;
import io.mixeway.mixewayflowapi.integrations.rag.util.FindingLocationParser;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class RagRetrievalService {

    private static final int TOP_SIMILAR = 4;
    private static final int TOTAL_CONTEXT = 5;

    private final RagCodeChunkRepository ragCodeChunkRepository;
    private final OllamaClient ollamaClient;

    @Value("${ollama.embedding.model:nomic-embed-text}")
    private String ollamaEmbeddingModel;

    public List<RetrievedChunk> retrieveTopChunksForFinding(Finding finding, Settings settings) {
        List<RagCodeChunk> all = ragCodeChunkRepository.findByCodeRepo_Id(finding.getCodeRepo().getId());
        List<RetrievedChunk> result = new ArrayList<>();

        Optional<FindingLocationParser.LocationRef> loc = FindingLocationParser.parse(finding.getLocation());
        RagCodeChunk exactChunk = null;
        if (loc.isPresent()) {
            String fp = loc.get().filePath();
            int line = loc.get().lineNumber();
            for (RagCodeChunk c : all) {
                if (fp.equals(c.getFilePath()) && c.getStartLine() <= line && c.getEndLine() >= line) {
                    exactChunk = c;
                    break;
                }
            }
        }
        if (exactChunk != null) {
            result.add(toChunk(exactChunk));
        } else if (loc.isPresent() && finding.getExplanation() != null) {
            // fallback: synthetic chunk from scanner explanation
            result.add(new RetrievedChunk(
                    -1,
                    loc.get().filePath(),
                    loc.get().lineNumber(),
                    loc.get().lineNumber(),
                    "text",
                    finding.getExplanation()));
        }

        String query = buildQueryText(finding);
        String embedModel = ollamaEmbeddingModel != null && !ollamaEmbeddingModel.isBlank()
                ? ollamaEmbeddingModel
                : "nomic-embed-text";
        Optional<float[]> queryEmb = ollamaClient.embed(
                settings.getOllamaBaseUrl(),
                embedModel,
                query,
                settings.getOllamaTimeoutSeconds());

        if (queryEmb.isEmpty()) {
            return result.stream().limit(TOTAL_CONTEXT).collect(Collectors.toList());
        }

        float[] q = queryEmb.get();
        List<ScoredChunk> scored = new ArrayList<>();
        for (RagCodeChunk c : all) {
            if (c.getEmbedding() == null || c.getEmbeddingDim() == null) {
                continue;
            }
            if (exactChunk != null && c.getId() != null && c.getId().equals(exactChunk.getId())) {
                continue;
            }
            float[] emb = EmbeddingFloatCodec.fromBytes(c.getEmbedding(), c.getEmbeddingDim());
            double sim = EmbeddingFloatCodec.cosineSimilarity(q, emb);
            scored.add(new ScoredChunk(c, sim));
        }
        scored.sort(Comparator.comparingDouble(ScoredChunk::score).reversed());
        for (int i = 0; i < Math.min(TOP_SIMILAR, scored.size()); i++) {
            result.add(toChunk(scored.get(i).chunk()));
        }

        return result.stream().limit(TOTAL_CONTEXT).collect(Collectors.toList());
    }

    private static String buildQueryText(Finding finding) {
        StringBuilder sb = new StringBuilder();
        sb.append(finding.getVulnerability().getName()).append(' ');
        if (finding.getVulnerability().getDescription() != null) {
            sb.append(finding.getVulnerability().getDescription()).append(' ');
        }
        sb.append(finding.getLocation()).append(' ');
        if (finding.getExplanation() != null) {
            sb.append(finding.getExplanation());
        }
        return sb.toString();
    }

    private static RetrievedChunk toChunk(RagCodeChunk c) {
        return new RetrievedChunk(
                c.getId() != null ? c.getId() : 0L,
                c.getFilePath(),
                c.getStartLine(),
                c.getEndLine(),
                c.getLanguage(),
                c.getChunkText());
    }

    private record ScoredChunk(RagCodeChunk chunk, double score) {}
}
