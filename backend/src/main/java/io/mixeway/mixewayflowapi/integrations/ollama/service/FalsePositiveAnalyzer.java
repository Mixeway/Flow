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
import io.mixeway.mixewayflowapi.integrations.ollama.dto.SecretAnalysisDto;
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
            log.info("[AiFp] Skipped for {} / {}: Ollama disabled or AI false-positive analysis off in settings",
                    codeRepo.getRepourl(), branch.getName());
            return AiFpScanResult.disabled();
        }
        if (s.getOllamaModel() == null || s.getOllamaModel().isBlank()) {
            log.info("[AiFp] Skipped for {} / {}: ollama model is not configured",
                    codeRepo.getRepourl(), branch.getName());
            return AiFpScanResult.disabled();
        }

        CodeRepo managed = codeRepoRepository.findById(codeRepo.getId()).orElse(null);
        if (managed == null) {
            log.warn("[AiFp] Skipped: code repo id={} not found", codeRepo.getId());
            return AiFpScanResult.disabled();
        }

        List<Finding> candidates = findingRepository.findForAiFalsePositiveAnalysis(
                managed,
                branch,
                List.of(Finding.Source.SAST, Finding.Source.IAC, Finding.Source.SECRETS),
                List.of(Finding.Status.NEW, Finding.Status.EXISTING));

        log.info("[AiFp] Phase started after all scanners finished — repo {} branch {} — {} finding(s) queued for AI (SAST/IaC/Secrets, NEW/EXISTING, not yet analyzed)",
                codeRepo.getRepourl(), branch.getName(), candidates.size());

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
        log.info("[AiFp] Finished — repo {} branch {} — analyzed={}, suppressed as false positive={}",
                codeRepo.getRepourl(), branch.getName(), analyzed, suppressed);
        return new AiFpScanResult(analyzed, suppressed);
    }

    private boolean analyzeOne(Finding finding, Settings s, UserInfo aiUser) {
        List<RetrievedChunk> chunks = ragRetrievalService.retrieveTopChunksForFinding(finding, s);
        String prompt = promptBuilder.build(finding, chunks, finding.getSource());

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
            // SAST: automatyczne wyciszenie tylko przy wysokiej pewności — unikamy masowego FP przy MEDIUM/LOW
            if (finding.getSource() == Finding.Source.SAST && !isHighConfidence(conf)) {
                log.info("[AiFp] SAST finding id={}: verdict=FALSE_POSITIVE confidence={} — not auto-suppressing (SAST requires HIGH confidence to suppress)",
                        finding.getId(), conf);
                finding.markAiSastFpNotAutoSuppressed(s.getOllamaModel(), conf);
                findingRepository.save(finding);
                if (aiUser != null) {
                    String msg = buildAiCommentSastFpNotSuppressed(v, s, finding, reasoning);
                    createCommentService.createSystemComment(finding, aiUser, msg);
                }
                return false;
            }
            finding.markAiFalsePositive(s.getOllamaModel(), conf);
            updateFindingService.suppressFinding(finding, Finding.SuppressedReason.FALSE_POSITIVE.name());
            if (aiUser != null) {
                String msg = buildAiComment(v, s, finding, true, reasoning);
                createCommentService.createSystemComment(finding, aiUser, msg);
            }
            return true;
        }

        finding.markAiReviewedRealIssue(s.getOllamaModel(), conf);
        maybeAppendSecretEnrichment(finding, v);
        findingRepository.save(finding);

        if (aiUser != null && !reasoning.isBlank()) {
            String msg = buildAiComment(v, s, finding, false, reasoning);
            createCommentService.createSystemComment(finding, aiUser, msg);
        }
        return false;
    }

    private static void maybeAppendSecretEnrichment(Finding finding, FpVerdictDto v) {
        if (finding.getSource() != Finding.Source.SECRETS) {
            return;
        }
        SecretAnalysisDto sa = v.getSecretAnalysis();
        if (sa == null) {
            return;
        }
        StringBuilder append = new StringBuilder();
        if (sa.getEnrichmentForTicket() != null && !sa.getEnrichmentForTicket().isBlank()) {
            append.append(sa.getEnrichmentForTicket().trim());
        }
        if (sa.getMaskedPreview() != null && !sa.getMaskedPreview().isBlank()) {
            if (append.length() > 0) {
                append.append('\n');
            }
            append.append("Masked preview: ").append(sa.getMaskedPreview().trim());
        }
        if (sa.getLikelyService() != null && !sa.getLikelyService().isBlank()) {
            if (append.length() > 0) {
                append.append('\n');
            }
            append.append("Likely use / service: ").append(sa.getLikelyService().trim());
        }
        if (sa.getCredentialCategory() != null && !sa.getCredentialCategory().isBlank()) {
            if (append.length() > 0) {
                append.append('\n');
            }
            append.append("Category: ").append(sa.getCredentialCategory().trim());
        }
        if (append.isEmpty()) {
            return;
        }
        String base = finding.getExplanation() != null ? finding.getExplanation() : "";
        String block = "\n\n--- AI assessment (not for exfiltration; verify in repo) ---\n" + append + "\n";
        finding.setExplanation(base + block);
    }

    private static boolean isHighConfidence(String conf) {
        return conf != null && "HIGH".equalsIgnoreCase(conf.trim());
    }

    private static String buildAiCommentSastFpNotSuppressed(
            FpVerdictDto v,
            Settings s,
            Finding finding,
            String reasoning) {
        StringBuilder sb = new StringBuilder();
        sb.append("[AI analysis — SAST]\n\n");
        sb.append("## Decision\n");
        sb.append("Model zwróciło **FALSE_POSITIVE**, ale **nie wyciszono automatycznie**: dla SAST automatyczne wyciszenie ");
        sb.append("jest dozwolone tylko przy **confidence: HIGH**, żeby nie ukrywać realnych problemów przy średniej/niskiej pewności.\n\n");
        sb.append("## Rationale (model)\n");
        sb.append(reasoning != null ? reasoning.trim() : "").append("\n\n");
        sb.append("## Szczegóły\n");
        sb.append("- Zgłoszona pewność: **").append(v.getConfidence() != null ? v.getConfidence() : "UNKNOWN").append("**\n");
        sb.append("- Model: `").append(s.getOllamaModel()).append("`\n");
        sb.append("- Status: przejrzyj ręcznie; przy potwierdzeniu FP możesz wyciszyć z poziomu UI.\n");
        return sb.toString();
    }

    private static String buildAiComment(
            FpVerdictDto v,
            Settings s,
            Finding finding,
            boolean suppressed,
            String reasoning) {
        StringBuilder sb = new StringBuilder();
        sb.append("[AI analysis — ").append(finding.getSource().name()).append("]\n\n");
        sb.append("## Decision\n");
        if (suppressed) {
            sb.append("Classified as **false positive**; finding suppressed.\n\n");
        } else {
            sb.append("Classified as **real issue** (not auto-suppressed).\n\n");
        }
        sb.append("## Rationale\n");
        sb.append(reasoning.trim()).append("\n\n");
        sb.append("## Assessment details\n");
        sb.append("- Confidence: **").append(v.getConfidence() != null ? v.getConfidence() : "UNKNOWN").append("**\n");
        sb.append("- Model: `").append(s.getOllamaModel()).append("`\n");
        if (finding.getSource() == Finding.Source.SECRETS && v.getSecretAnalysis() != null) {
            SecretAnalysisDto sa = v.getSecretAnalysis();
            if (sa.getCredentialCategory() != null && !sa.getCredentialCategory().isBlank()) {
                sb.append("- Credential category: ").append(sa.getCredentialCategory()).append('\n');
            }
        }
        return sb.toString();
    }
}
