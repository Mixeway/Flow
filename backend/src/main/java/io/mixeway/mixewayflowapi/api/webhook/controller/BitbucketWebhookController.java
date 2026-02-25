package io.mixeway.mixewayflowapi.api.webhook.controller;

import io.mixeway.mixewayflowapi.api.webhook.dto.BBPullRequestEventDTO;
import io.mixeway.mixewayflowapi.api.webhook.dto.BBPushEventDTO;
import io.mixeway.mixewayflowapi.api.webhook.service.BitbucketWebhookService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Validated
@Log4j2
public class BitbucketWebhookController {
    private final BitbucketWebhookService bitbucketWebhookService;

    @PostMapping("/api/v1/webhook/bitbucket/push")
    public ResponseEntity<?> pushEvent(@RequestBody BBPushEventDTO bbPushEventDTO) {
        log.info("[Bitbucket Push] Push event for {}", bbPushEventDTO.getRepository().getFullName());
        bitbucketWebhookService.processPush(bbPushEventDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/api/v1/webhook/bitbucket/pull-request")
    public ResponseEntity<?> pullRequestEvent(@RequestBody BBPullRequestEventDTO bbPullRequestEventDTO) {
        log.info("[Bitbucket PR] Pull request event for {}", bbPullRequestEventDTO.getRepository().getFullName());
        bitbucketWebhookService.processPullRequest(bbPullRequestEventDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
