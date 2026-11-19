package io.mixeway.mixewayflowapi.api.cicd.controller;


import io.mixeway.mixewayflowapi.api.cicd.dto.CicdScanRequestDto;
import io.mixeway.mixewayflowapi.api.cicd.dto.CodeRepoDto;
import io.mixeway.mixewayflowapi.api.cicd.dto.ValidateStatusDto;
import io.mixeway.mixewayflowapi.api.cicd.service.CICDService;
import io.mixeway.mixewayflowapi.utils.StatusDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
@Validated
@Log4j2
public class CICDController {
    private final CICDService cicdService;


    @PreAuthorize("hasAuthority('USER')")
    @PostMapping(value= "/api/v1/cicd/check")
    public ResponseEntity<ValidateStatusDto> validateCICDJob(@Valid @RequestBody CodeRepoDto codeRepoDto){
        try {

            return cicdService.validateCodeRepo(codeRepoDto);
        } catch (Exception e){
            log.error("[CICDController] Error checking status {}",e.getLocalizedMessage());
            return new ResponseEntity<>( HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Starts a scan of the commit a pipeline is building and answers at once: 202 with status
     * {@code started} or {@code queued}, 429 with {@code throttled} when the repository was scanned
     * a moment ago.
     */
    @PreAuthorize("hasAuthority('USER')")
    @PostMapping(value = "/api/v1/cicd/scan")
    public ResponseEntity<StatusDTO> startScan(@RequestBody CicdScanRequestDto request, Principal principal) {
        try {
            return cicdService.startScan(request, principal);
        } catch (Exception e) {
            log.error("[CICDController] Error starting scan for {}: {}", request.getRepoUrl(), e.getMessage(), e);
            return new ResponseEntity<>(new StatusDTO("Not ok"), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Takes the SBOM (CycloneDX JSON) a pipeline built and scans the dependencies from it. By default
     * the request is held until the result is there and answers 200 with the scan summary; with
     * {@code wait=false}, or when the result takes too long, it answers 202.
     */
    @PreAuthorize("hasAuthority('USER')")
    @PostMapping(value = "/api/v1/cicd/sbom", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadSbom(
            @RequestPart("file") MultipartFile file,
            @RequestParam("repoUrl") String repoUrl,
            @RequestParam("branch") String branch,
            @RequestParam(value = "commitId", required = false) String commitId,
            @RequestParam(value = "pullRequestId", required = false) Long pullRequestId,
            @RequestParam(value = "domain", required = false) String domain,
            @RequestParam(value = "wait", defaultValue = "true") boolean wait,
            Principal principal) {
        try {
            return cicdService.uploadSbom(repoUrl, branch, commitId, pullRequestId, domain, wait, file, principal);
        } catch (Exception e) {
            log.error("[CICDController] SBOM upload failed for {}: {}", repoUrl, e.getMessage(), e);
            return new ResponseEntity<>(new StatusDTO("Not ok"), HttpStatus.BAD_REQUEST);
        }
    }
}
