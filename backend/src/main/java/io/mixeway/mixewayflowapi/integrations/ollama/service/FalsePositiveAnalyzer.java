package io.mixeway.mixewayflowapi.integrations.ollama.service;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.entity.Settings;
import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoRepository;
import io.mixeway.mixewayflowapi.db.repository.FindingRepository;
import io.mixeway.mixewayflowapi.db.repository.UserRepository;
import io.mixeway.mixewayflowapi.domain.comment.CreateCommentService;
import io.mixeway.mixewayflowapi.domain.finding.UpdateFindingService;
import io.mixeway.mixewayflowapi.domain.settings.FindSettingsService;
import io.mixeway.mixewayflowapi.integrations.ollama.dto.FpVerdictDto;
import io.mixeway.mixewayflowapi.integrations.rag.service.RagRetrievalService;
import io.mixeway.mixewayflowapi.integrations.rag.service.RetrievedChunk;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
public class FalsePositiveAnalyzer {

    private static final String SYSTEM_USER = "flowai";

    private final FindSettingsService findSettingsService;
    private final FindingRepository findingRepository;
    private final CodeRepoRepository codeRepoRepository;
    private final UserRepository userRepository;
    private final UpdateFindingService updateFindingService;
    private final CreateCommentService createCommentService;
    private final RagRetrievalService ragRetrievalService;
    private final OllamaClient ollamaClient;
    private final FalsePositivePromptBuilder promptBuilder;
    private final OllamaResponseParser responseParser;

    @Transactional
    public AiFpScanResult analyzeAfterScan(CodeRepo codeRepo, CodeRepoBranch branch, String commitId) {
        Settings s = findSettingsService.get();
        if (s == null || !s.isOllamaEnabled() || !s.isOllamaFpAnalysisEnabled()) {
            return AiFpScanResult.disabled();
        }
        if (s.getOllamaModel() == null || s.getOllamaModel().isBlank()) {
            log.debug("[AiFp] Skipping: ollama_model is empty");
            return AiFpScanResult.disabled();
        }

        CodeRepo managed = codeRepoRepository.findById(codeRepo.getId()).orElse(null);
        if (managed == null) {
            return AiFpScanResult.disabled();
        }

        List<Finding> candidates = findingRepository.findForAiFalsePositiveAnalysis(
                managed,
                branch,
                List.of(Finding.Source.SAST, Finding.Source.IAC),
                List.of(Finding.Status.NEW, Finding.Status.EXISTING));

        UserInfo aiUser = userRepository.findByUsername(SYSTEM_USER);
        if (aiUser == null) {
            log.error("[AiFp] System user '{}' not found — cannot attach AI comments", SYSTEM_USER);
        }

        int batchSize = Math.max(1, s.getOllamaFpBatchSize());
        int analyzed = 0;
        int suppressed = 0;

        for (int i = 0; i < candidates.size(); i += batchSize) {
            int end = Math.min(i + batchSize, candidates.size());
            for (int j = i; j < end; j++) {
                Finding f = candidates.get(j);
                try {
                    boolean wasSuppressed = analyzeOne(f, s, aiUser);
                    analyzed++;
                    if (wasSuppressed) {
                        suppressed++;
                    }
                } catch (Exception ex) {
                    log.warn("[AiFp] Finding id={}: {}", f.getId(), ex.getMessage(), ex);
                }
            }
        }

        managed.updateAiFpScanSummary(analyzed, suppressed);
        codeRepoRepository.save(managed);
        if (analyzed > 0) {
            log.info("[AiFp] Scan summary: analyzed={}, suppressed as false positive={}", analyzed, suppressed);
        }
        return new AiFpScanResult(analyzed, suppressed);
    }

    private boolean analyzeOne(Finding finding, Settings s, UserInfo aiUser) {
        List<RetrievedChunk> chunks = ragRetrievalService.retrieveTopChunksForFinding(finding, s);
        String scannerLabel = finding.getSource() == Finding.Source.SAST ? "SAST" : "IAC";
        String prompt = promptBuilder.build(finding, chunks, scannerLabel);

        Optional<String> resp = ollamaClient.generate(
                s.getOllamaBaseUrl(),
                s.getOllamaModel(),
                prompt,
                true,
                s.getOllamaTimeoutSeconds());

        if (resp.isEmpty()) {
            log.warn("[AiFp] Empty response for finding {}", finding.getId());
            finding.markAiReviewedRealIssue(s.getOllamaModel(), "LOW");
            findingRepository.save(finding);
            return false;
        }

        Optional<FpVerdictDto> verdictOpt = responseParser.parseVerdictJson(resp.get());
        if (verdictOpt.isEmpty()) {
            log.warn("[AiFp] Unparseable AI response for finding {}, treating as REAL_ISSUE/LOW", finding.getId());
            finding.markAiReviewedRealIssue(s.getOllamaModel(), "LOW");
            findingRepository.save(finding);
            return false;
        }

        FpVerdictDto v = verdictOpt.get();
        String vStr = v.getVerdict() != null ? v.getVerdict().trim() : "";
        String conf = v.getConfidence() != null ? v.getConfidence().trim() : "LOW";
        String reasoning = v.getReasoning() != null ? v.getReasoning() : "";

        if ("FALSE_POSITIVE".equalsIgnoreCase(vStr)) {
            finding.markAiFalsePositive(s.getOllamaModel(), conf);
            updateFindingService.suppressFinding(finding, Finding.SuppressedReason.FALSE_POSITIVE.name());
            if (aiUser != null) {
                String msg = "[AI Analysis] " + reasoning + " (confidence: " + conf + ", model: " + s.getOllamaModel() + ")";
                createCommentService.createSystemComment(finding, aiUser, msg);
            }
            return true;
        }

        finding.markAiReviewedRealIssue(s.getOllamaModel(), conf);
        findingRepository.save(finding);
        return false;
    }
}
