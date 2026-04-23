package io.mixeway.mixewayflowapi.api.webhook.controller;

import ch.qos.logback.core.spi.ScanException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.mixeway.mixewayflowapi.api.webhook.dto.GHMergeEventDTO;
import io.mixeway.mixewayflowapi.api.webhook.dto.GHPushEventDTO;
import io.mixeway.mixewayflowapi.api.webhook.service.GitHubWebhookService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@Validated
@Log4j2
public class GitHubWebhookController {

    private final GitHubWebhookService gitHubWebhookService;
    private final ObjectMapper objectMapper;

    @PostMapping(value = "/api/v1/webhook/github/push", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<?> pushEventGH(@RequestParam("payload") String payload)
            throws ScanException, IOException, InterruptedException {

        GHPushEventDTO ghPushEventDTO = objectMapper.readValue(payload, GHPushEventDTO.class);
        gitHubWebhookService.processPush(ghPushEventDTO);
        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/api/v1/webhook/github/merge", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<?> mergeEventGH(@RequestParam("payload") String payload)
            throws ScanException, IOException, InterruptedException {

        GHMergeEventDTO ghMergeEventDTO = objectMapper.readValue(payload, GHMergeEventDTO.class);
        log.info("[GitHub Merge] Merge event for {}", ghMergeEventDTO.getRepository().getId());
        gitHubWebhookService.processMerge(ghMergeEventDTO);
        return ResponseEntity.ok().build();
    }
}
