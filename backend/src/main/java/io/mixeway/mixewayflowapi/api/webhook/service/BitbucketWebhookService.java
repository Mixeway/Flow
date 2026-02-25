package io.mixeway.mixewayflowapi.api.webhook.service;

import io.mixeway.mixewayflowapi.api.webhook.dto.BBPullRequestEventDTO;
import io.mixeway.mixewayflowapi.api.webhook.dto.BBPushEventDTO;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.coderepobranch.GetOrCreateCodeRepoBranchService;
import io.mixeway.mixewayflowapi.scanmanager.service.ScanManagerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Log4j2
public class BitbucketWebhookService {
    private final ScanManagerService scanManagerService;
    private final FindCodeRepoService findCodeRepoService;
    private final GetOrCreateCodeRepoBranchService getOrCreateCodeRepoBranchService;

    public void processPush(BBPushEventDTO pushEvent) {
        try {
            if (pushEvent.getPush() == null || pushEvent.getPush().getChanges() == null || pushEvent.getPush().getChanges().isEmpty()) {
                log.warn("[Bitbucket Push] No changes found in push event");
                return;
            }

            int remoteId = Math.abs(pushEvent.getRepository().getUuid().hashCode());
            CodeRepo codeRepo = findCodeRepoService.findByRemoteId((long) remoteId);

            BBPushEventDTO.ChangeDTO change = pushEvent.getPush().getChanges().get(0);
            if (change.getNewRef() == null) {
                log.warn("[Bitbucket Push] Branch deletion event, skipping");
                return;
            }

            String branchName = change.getNewRef().getName();
            String commitHash = change.getNewRef().getTarget() != null ? change.getNewRef().getTarget().getHash() : null;

            log.info("[Bitbucket Push] Push event for {} - {}", pushEvent.getRepository().getFullName(), branchName);
            CodeRepoBranch codeRepoBranch = getOrCreateCodeRepoBranchService.getOrCreateCodeRepoBranch(branchName, codeRepo);
            scanManagerService.scanRepository(codeRepo, codeRepoBranch, commitHash, null);
        } catch (Exception e) {
            log.error("[Bitbucket Push] Error processing push webhook for {}, probably repo needs to be onboarded first.",
                    pushEvent.getRepository() != null ? pushEvent.getRepository().getFullName() : "unknown");
        }
    }

    public void processPullRequest(BBPullRequestEventDTO prEvent) {
        try {
            int remoteId = Math.abs(prEvent.getRepository().getUuid().hashCode());
            CodeRepo codeRepo = findCodeRepoService.findByRemoteId((long) remoteId);

            String state = prEvent.getPullrequest().getState();
            if ("OPEN".equalsIgnoreCase(state)) {
                String sourceBranch = prEvent.getPullrequest().getSource().getBranch().getName();
                String commitHash = prEvent.getPullrequest().getSource().getCommit().getHash();
                Long prId = prEvent.getPullrequest().getId();

                log.info("[Bitbucket Webhook] Received open Pull Request event for {}, proceeding with scan..",
                        prEvent.getRepository().getFullName());
                CodeRepoBranch codeRepoBranch = getOrCreateCodeRepoBranchService.getOrCreateCodeRepoBranch(sourceBranch, codeRepo);
                scanManagerService.scanRepository(codeRepo, codeRepoBranch, commitHash, prId);
            }
        } catch (Exception e) {
            log.error("[Bitbucket PR] Error processing pull request webhook for {}, probably repo needs to be onboarded first.",
                    prEvent.getRepository() != null ? prEvent.getRepository().getFullName() : "unknown");
        }
    }
}
