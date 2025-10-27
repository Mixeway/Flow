package io.mixeway.mixewayflowapi.api.coderepo.controller;

import io.mixeway.mixewayflowapi.api.coderepo.dto.GetFindingResponseDto;
import io.mixeway.mixewayflowapi.api.coderepo.dto.VulnsResponseDto;
import io.mixeway.mixewayflowapi.api.coderepo.service.FindingService;
import io.mixeway.mixewayflowapi.api.coderepo.dto.CreateCommentRequestDto;
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
public class FindingController {
    private final FindingService findingService;
    private final CreateCommentService createCommentService;

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping(value= "/api/v1/coderepo/{id}/findings")
    public ResponseEntity<List<VulnsResponseDto>> getRepoDefaultBranchFindings(@PathVariable("id") Long id, Principal principal){
        try {
            return new ResponseEntity<>(findingService.getRepoDefaultBranchFindings(id,principal), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>( HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping(value= "/api/v1/coderepo/{id}/findings/branch/{branchid}")
    public ResponseEntity<List<VulnsResponseDto>> getRepoDefaultBranchFindings(@PathVariable("id") Long id, @PathVariable("branchid") Long branchid, Principal principal){
        try {
            return new ResponseEntity<>(findingService.getRepoBranchFindings(id,branchid,principal), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>( HttpStatus.BAD_REQUEST);
        }
    }


    @PreAuthorize("hasAuthority('USER')")
    @GetMapping(value= "/api/v1/coderepo/{id}/finding/{finding}")
    public ResponseEntity<GetFindingResponseDto> getFinding(@PathVariable("id") Long id,@PathVariable("finding") Long findingId, Principal principal){
        try {
            return new ResponseEntity<>(findingService.getFinding(id,findingId,principal), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>( HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping(value= "/api/v1/coderepo/{id}/supress/{finding}/reason/{reason}")
    public ResponseEntity<StatusDTO> supressFinding(@PathVariable("id") Long id, @PathVariable("finding") Long findingId, @PathVariable("reason") String reason, Principal principal){
        try {
            return new ResponseEntity<>(findingService.supressFinding(id,findingId,reason,principal), HttpStatus.OK);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>( HttpStatus.BAD_REQUEST);
        }
    }
    @PreAuthorize("hasAuthority('USER')")
    @PostMapping(value= "/api/v1/coderepo/{id}/supress")
    public ResponseEntity<StatusDTO> supressFindingList(@PathVariable("id") Long id, @RequestBody List<Long> findingIds, Principal principal){
        try {
            return new ResponseEntity<>(findingService.supressFindingBulk(id,findingIds,principal), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>( HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping(value= "/api/v1/coderepo/{id}/reactivate/{finding}")
    public ResponseEntity<StatusDTO> reactivateFinding(@PathVariable("id") Long id, @PathVariable("finding") Long findingId, Principal principal){
        try {
            return new ResponseEntity<>(findingService.reactivate(id,findingId,principal), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>( HttpStatus.BAD_REQUEST);
        }
    }
    /**
     * Adds a new comment to a finding
     * Authorization is checked at the service level to ensure user has access to the finding
     */
    @PreAuthorize("hasAuthority('USER')")
    @PostMapping("/api/v1/coderepo/{repoId}/finding/{findingId}/comment")
    public ResponseEntity<StatusDTO> createComment(
            @PathVariable("repoId") Long repoId,
            @PathVariable("findingId") Long findingId,
            @Valid @RequestBody CreateCommentRequestDto request,
            Principal principal) {
        try {
            createCommentService.createComment(repoId, findingId, request.getMessage(), principal);
            return new ResponseEntity<>(new StatusDTO("ok"), HttpStatus.OK);
        } catch (Exception e) {
            log.error("[Comment] Error creating comment for finding {} in repo {} by user {}",
                    findingId, repoId, principal.getName(), e);
            return new ResponseEntity<>(new StatusDTO("Not ok"), HttpStatus.BAD_REQUEST);
        }
    }
}
