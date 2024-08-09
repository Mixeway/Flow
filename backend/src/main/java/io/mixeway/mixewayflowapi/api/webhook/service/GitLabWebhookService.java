package io.mixeway.mixewayflowapi.api.webhook.service;

import ch.qos.logback.core.spi.ScanException;
import io.mixeway.mixewayflowapi.api.webhook.dto.MergeEventDTO;
import io.mixeway.mixewayflowapi.api.webhook.dto.PushEventDTO;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.coderepobranch.GetOrCreateCodeRepoBranchService;
import io.mixeway.mixewayflowapi.scanmanager.service.ScanManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class GitLabWebhookService {
    private final ScanManagerService scanManagerService;
    private final FindCodeRepoService findCodeRepoService;
    private final GetOrCreateCodeRepoBranchService getOrCreateCodeRepoBranchService;

    public void processPush(PushEventDTO pushEventDTO) throws ScanException, IOException, InterruptedException {
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(pushEventDTO.getProject().getId());
        CodeRepoBranch codeRepoBranch = getOrCreateCodeRepoBranchService.getOrCreateCodeRepoBranch(pushEventDTO.getRef().replace("refs/heads/",""), codeRepo);
        scanManagerService.scanRepository(codeRepo,codeRepoBranch, pushEventDTO.getAfter());
    }

    public void processMerge(MergeEventDTO mergeEventDTO) throws ScanException, IOException, InterruptedException {
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(mergeEventDTO.getProject().getId());
        CodeRepoBranch codeRepoBranch = getOrCreateCodeRepoBranchService.getOrCreateCodeRepoBranch(mergeEventDTO.getObjectAttributes().getSourceBranch(), codeRepo);
        scanManagerService.scanRepository(codeRepo,codeRepoBranch, mergeEventDTO.getObjectAttributes().getLastCommitDTO().getId());
        // TODO Comment merge request
    }
}
