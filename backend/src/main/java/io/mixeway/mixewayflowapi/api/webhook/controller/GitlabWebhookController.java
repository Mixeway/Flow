package io.mixeway.mixewayflowapi.api.webhook.controller;

import ch.qos.logback.core.spi.ScanException;
import io.mixeway.mixewayflowapi.api.webhook.dto.MergeEventDTO;
import io.mixeway.mixewayflowapi.api.webhook.dto.PushEventDTO;
import io.mixeway.mixewayflowapi.api.webhook.service.GitLabWebhookService;
import io.mixeway.mixewayflowapi.scanmanager.service.ScanManagerService;
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
    public ResponseEntity<?> pushEvent( @RequestBody PushEventDTO pushEventDTO) throws ScanException, IOException, InterruptedException {
        log.info("[Gitlab Push] Push event for {} - {}", pushEventDTO.getProject().getId(), pushEventDTO.getRef().replace("refs/heads/",""));
        gitLabWebhookService.processPush(pushEventDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/api/v1/webhook/gitlab/merge")
    public ResponseEntity<?> mergeEvent( @RequestBody MergeEventDTO mergeEventDTO) throws ScanException, IOException, InterruptedException {
        log.info("[Gitlab Merge] Merge event for {}", mergeEventDTO.getProject());
        gitLabWebhookService.processMerge(mergeEventDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
