package io.mixeway.mixewayflowapi.api.webhook.controller;

import ch.qos.logback.core.spi.ScanException;
import io.mixeway.mixewayflowapi.api.webhook.dto.GHMergeEventDTO;
import io.mixeway.mixewayflowapi.api.webhook.dto.GHPushEventDTO;
import io.mixeway.mixewayflowapi.api.webhook.dto.GLMergeEventDTO;
import io.mixeway.mixewayflowapi.api.webhook.dto.GLPushEventDTO;
import io.mixeway.mixewayflowapi.api.webhook.service.GitHubWebhookService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Validated
@Log4j2
public class GitHubWebhookController {
    private final GitHubWebhookService gitHubWebhookService;

    @PostMapping("/api/v1/webhook/github/push")
    public ResponseEntity<?> pushEventGH(@RequestBody List<GHPushEventDTO> ghPushEventDTOS) throws ScanException, IOException, InterruptedException {
        gitHubWebhookService.processPush(ghPushEventDTOS);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/api/v1/webhook/github/merge")
    public ResponseEntity<?> mergeEventGH( @RequestBody GHMergeEventDTO ghMergeEventDTO) throws ScanException, IOException, InterruptedException {
        log.info("[GitHub Merge] Merge event for {}", ghMergeEventDTO.getRepository().getId());
        gitHubWebhookService.processMerge(ghMergeEventDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
