package io.mixeway.mixewayflowapi.api.webhook.service;

import ch.qos.logback.core.spi.ScanException;
import io.mixeway.mixewayflowapi.api.webhook.dto.GLMergeEventDTO;
import io.mixeway.mixewayflowapi.api.webhook.dto.GLPushEventDTO;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.coderepobranch.GetOrCreateCodeRepoBranchService;
import io.mixeway.mixewayflowapi.scanmanager.service.ScanManagerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
@Log4j2
public class GitLabWebhookService {
    private final ScanManagerService scanManagerService;
    private final FindCodeRepoService findCodeRepoService;
    private final GetOrCreateCodeRepoBranchService getOrCreateCodeRepoBranchService;

    public void processPush(GLPushEventDTO gLPushEventDTO) throws ScanException, IOException, InterruptedException {
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(gLPushEventDTO.getProject().getId());
        CodeRepoBranch codeRepoBranch = getOrCreateCodeRepoBranchService.getOrCreateCodeRepoBranch(gLPushEventDTO.getRef().replace("refs/heads/",""), codeRepo);
        scanManagerService.scanRepository(codeRepo,codeRepoBranch, gLPushEventDTO.getAfter(), null);
    }

    public void processMerge(GLMergeEventDTO gLMergeEventDTO) throws ScanException, IOException, InterruptedException {
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(gLMergeEventDTO.getProject().getId());
        CodeRepoBranch codeRepoBranch = getOrCreateCodeRepoBranchService.getOrCreateCodeRepoBranch(gLMergeEventDTO.getObjectAttributes().getSourceBranch(), codeRepo);
        if (gLMergeEventDTO.getObjectAttributes().getState().equals("opened")) {
            log.info("[GitLab Webhook] Received open Merge Request event, proceeding with scan..");
            scanManagerService.scanRepository(codeRepo, codeRepoBranch, gLMergeEventDTO.getObjectAttributes().getLastCommitDTO().getId(),
                    gLMergeEventDTO.getObjectAttributes().getIid());
        }
    }
}
