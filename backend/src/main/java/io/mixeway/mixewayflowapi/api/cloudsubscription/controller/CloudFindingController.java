package io.mixeway.mixewayflowapi.api.cloudsubscription.controller;

import io.mixeway.mixewayflowapi.api.cloudsubscription.service.CloudFindingService;
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
public class CloudFindingController {
    private final CloudFindingService cloudFindingService;
    private final CreateCommentService createCommentService;

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping(value = "/api/v1/cloudsubscription/{id}/findings")
    public ResponseEntity<List<VulnsResponseDto>> getCloudSubscriptionFindings(@PathVariable("id") Long id, Principal principal) {
        try {
            return new ResponseEntity<>(cloudFindingService.getCloudSubscriptionFindings(id, principal), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }


    @PreAuthorize("hasAuthority('USER')")
    @GetMapping(value= "/api/v1/cloudsubscription/{id}/finding/{findingId}")
    public ResponseEntity<GetFindingResponseDto> getFinding(@PathVariable("id") Long id,@PathVariable("findingId") Long findingId, Principal principal){
        try {
            return new ResponseEntity<>(cloudFindingService.getFinding(id,findingId,principal), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>( HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('USER')")
    @PostMapping("/api/v1/cloudsubscription/{id}/finding/{findingId}/comment")
    public ResponseEntity<StatusDTO> createComment(
            @PathVariable("id") Long id,
            @PathVariable("findingId") Long findingId,
            @Valid @RequestBody CreateCommentRequestDto request,
            Principal principal) {
        try {
            createCommentService.createCloudComment(id, findingId, request.getMessage(), principal);
            return new ResponseEntity<>(new StatusDTO("ok"), HttpStatus.OK);
        } catch (Exception e) {
            log.error("[Comment] Error creating comment for finding {} in repo {} by user {}",
                    findingId, id, principal.getName(), e);
            return new ResponseEntity<>(new StatusDTO("Not ok"), HttpStatus.BAD_REQUEST);
        }
    }
}
