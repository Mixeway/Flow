package io.mixeway.mixewayflowapi.api.webhook.service;

import ch.qos.logback.core.spi.ScanException;
import io.mixeway.mixewayflowapi.api.webhook.dto.GHMergeEventDTO;
import io.mixeway.mixewayflowapi.api.webhook.dto.GHPushEventDTO;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.coderepobranch.GetOrCreateCodeRepoBranchService;
import io.mixeway.mixewayflowapi.integrations.repo.service.GitCommentService;
import io.mixeway.mixewayflowapi.scanmanager.service.ScanManagerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Log4j2
public class GitHubWebhookService {
    private final ScanManagerService scanManagerService;
    private final FindCodeRepoService findCodeRepoService;
    private final GetOrCreateCodeRepoBranchService getOrCreateCodeRepoBranchService;
    private final GitCommentService gitCommentService;

    public void processPush(GHPushEventDTO ghPushEventDTO) throws ScanException, IOException, InterruptedException {
        if (ghPushEventDTO != null) {
            log.info("[GitHub Push] Push event for {} - {}",
                    ghPushEventDTO.getRepository().getId(),
                    ghPushEventDTO.getRef().replace("refs/heads/",""));

            CodeRepo codeRepo = findCodeRepoService.findByRemoteId(ghPushEventDTO.getRepository().getId());
            CodeRepoBranch codeRepoBranch = getOrCreateCodeRepoBranchService.getOrCreateCodeRepoBranch(
                    ghPushEventDTO.getRef().replace("refs/heads/",""),
                    codeRepo
            );
            scanManagerService.scanRepository(codeRepo, codeRepoBranch, ghPushEventDTO.getAfter(), null);
        }
    }

    public void processMerge(GHMergeEventDTO ghMergeEventDTO) throws ScanException, IOException, InterruptedException {
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(ghMergeEventDTO.getRepository().getId());
        CodeRepoBranch codeRepoBranch = getOrCreateCodeRepoBranchService.getOrCreateCodeRepoBranch(ghMergeEventDTO.getPullRequest().getHead().getRef(), codeRepo);
        if (ghMergeEventDTO.getPullRequest().getState().equals("open")) {
            log.info("[GitHub Webhook] Received open Pull Request event, proceeding with scan..");
            scanManagerService.scanRepository(codeRepo, codeRepoBranch, ghMergeEventDTO.getPullRequest().getHead().getSha(),
                    ghMergeEventDTO.getPullRequest().getNumber());
        }
    }

    public void processMergeFullReport(GHMergeEventDTO ghMergeEventDTO) throws ScanException, IOException, InterruptedException {
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(ghMergeEventDTO.getRepository().getId());
        CodeRepoBranch codeRepoBranch = getOrCreateCodeRepoBranchService.getOrCreateCodeRepoBranch(
                ghMergeEventDTO.getPullRequest().getHead().getRef(), codeRepo);

        if (ghMergeEventDTO.getPullRequest().getState().equals("open")) {
            log.info("[GitHub Webhook] Received open Pull Request full-report event, proceeding with sync scan..");
            scanManagerService.scanRepositorySync(
                    codeRepo,
                    codeRepoBranch,
                    ghMergeEventDTO.getPullRequest().getHead().getSha(),
                    null
            );
            gitCommentService.processMergeCriticalComment(
                    codeRepo,
                    codeRepoBranch,
                    ghMergeEventDTO.getPullRequest().getNumber()
            );
        }
    }
}
