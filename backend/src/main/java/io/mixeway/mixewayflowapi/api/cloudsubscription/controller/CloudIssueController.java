package io.mixeway.mixewayflowapi.api.cloudsubscription.controller;

import io.mixeway.mixewayflowapi.api.cloudsubscription.service.CloudIssuesService;
import io.mixeway.mixewayflowapi.api.coderepo.dto.CreateCommentRequestDto;
import io.mixeway.mixewayflowapi.api.coderepo.dto.GetFindingResponseDto;
import io.mixeway.mixewayflowapi.api.coderepo.dto.VulnsResponseDto;
import io.mixeway.mixewayflowapi.domain.comment.CreateCommentService;
import io.mixeway.mixewayflowapi.utils.StatusDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@Validated
@RequiredArgsConstructor
@Log4j2
public class CloudIssueController {
    private final CloudIssuesService cloudIssueService;
    private final CreateCommentService createCommentService;

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping(value = "/api/v1/cloudsubscription/{id}/issues")
    public ResponseEntity<List<VulnsResponseDto>> getCloudSubscriptionIssues(@PathVariable("id") Long id, Principal principal) {
        try {
            return new ResponseEntity<>(cloudIssueService.getCloudSubscriptionIssues(id, principal), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }


    @PreAuthorize("hasAuthority('USER')")
    @GetMapping(value= "/api/v1/cloudsubscription/{id}/issue/{issueId}")
    public ResponseEntity<GetFindingResponseDto> getIssue(@PathVariable("id") Long id,@PathVariable("issueId") Long issueId, Principal principal){
        try {
            return new ResponseEntity<>(cloudIssueService.getIssue(id,issueId,principal), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>( HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('USER')")
    @PostMapping("/api/v1/cloudsubscription/{id}/issue/{issueId}/comment")
    public ResponseEntity<StatusDTO> createComment(
            @PathVariable("id") Long id,
            @PathVariable("issueId") Long issueId,
            @Valid @RequestBody CreateCommentRequestDto request,
            Principal principal) {
        try {
            createCommentService.createCloudComment(id, issueId, request.getMessage(), principal);
            return new ResponseEntity<>(new StatusDTO("ok"), HttpStatus.OK);
        } catch (Exception e) {
            log.error("[Comment] Error creating comment for finding {} in cloud subscription {} by user {}",
                    issueId, id, principal.getName(), e);
            return new ResponseEntity<>(new StatusDTO("Not ok"), HttpStatus.BAD_REQUEST);
        }
    }
}
