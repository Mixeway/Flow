package io.mixeway.mixewayflowapi.api.webhook.controller;

import ch.qos.logback.core.spi.ScanException;
import io.mixeway.mixewayflowapi.api.webhook.dto.GLMergeEventDTO;
import io.mixeway.mixewayflowapi.api.webhook.dto.GLPushEventDTO;
import io.mixeway.mixewayflowapi.api.webhook.service.GitLabWebhookService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@Validated
@Log4j2
public class GitlabWebhookController {
    private final GitLabWebhookService gitLabWebhookService;

    @PostMapping("/api/v1/webhook/gitlab/push")
    public ResponseEntity<?> pushEvent( @RequestBody GLPushEventDTO gLPushEventDTO) throws ScanException, IOException, InterruptedException {
        log.info("[Gitlab Push] Push event for {} - {}", gLPushEventDTO.getProject().getId(), gLPushEventDTO.getRef().replace("refs/heads/",""));
        gitLabWebhookService.processPush(gLPushEventDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/api/v1/webhook/gitlab/merge")
    public ResponseEntity<?> mergeEvent( @RequestBody GLMergeEventDTO gLMergeEventDTO) throws ScanException, IOException, InterruptedException {
        log.info("[Gitlab Merge] Merge event for {}", gLMergeEventDTO.getProject());
        gitLabWebhookService.processMerge(gLMergeEventDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
