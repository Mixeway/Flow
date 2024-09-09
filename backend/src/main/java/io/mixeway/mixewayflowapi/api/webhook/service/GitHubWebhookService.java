package io.mixeway.mixewayflowapi.api.webhook.service;

import ch.qos.logback.core.spi.ScanException;
import io.mixeway.mixewayflowapi.api.webhook.dto.GHMergeEventDTO;
import io.mixeway.mixewayflowapi.api.webhook.dto.GHPushEventDTO;
import io.mixeway.mixewayflowapi.api.webhook.dto.GLMergeEventDTO;
import io.mixeway.mixewayflowapi.api.webhook.dto.GLPushEventDTO;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.coderepobranch.GetOrCreateCodeRepoBranchService;
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

    public void processPush(List<GHPushEventDTO> ghPushEventDTOs) throws ScanException, IOException, InterruptedException {
        GHPushEventDTO ghPushEventDTO;
        if (ghPushEventDTOs != null && !ghPushEventDTOs.isEmpty()){
            ghPushEventDTO = ghPushEventDTOs.get(0);
            log.info("[GitHub Push] Push event for {} - {}", ghPushEventDTO.getRepository().getId(), ghPushEventDTO.getRef().replace("refs/heads/",""));
            CodeRepo codeRepo = findCodeRepoService.findByRemoteId(ghPushEventDTO.getRepository().getId());
            CodeRepoBranch codeRepoBranch = getOrCreateCodeRepoBranchService.getOrCreateCodeRepoBranch(ghPushEventDTO.getRef().replace("refs/heads/",""), codeRepo);
            scanManagerService.scanRepository(codeRepo,codeRepoBranch, ghPushEventDTO.getAfter(),null);

        }
    }

    public void processMerge(GHMergeEventDTO ghMergeEventDTO) throws ScanException, IOException, InterruptedException {
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(ghMergeEventDTO.getRepository().getId());
        CodeRepoBranch codeRepoBranch = getOrCreateCodeRepoBranchService.getOrCreateCodeRepoBranch(ghMergeEventDTO.getPullRequest().getHead().getRef(), codeRepo);
        if (ghMergeEventDTO.getPullRequest().getState().equals("open")) {
            log.info("[GitHub Webhook] Received open Pull Request event, proceeding with scan..");
            scanManagerService.scanRepository(codeRepo, codeRepoBranch, ghMergeEventDTO.getPullRequest().getHead().getSha(),
                    ghMergeEventDTO.getPullRequest().getId());
        }
    }
}
