package io.mixeway.mixewayflowapi.api.cicd.controller;


import io.mixeway.mixewayflowapi.api.cicd.dto.CodeRepoDto;
import io.mixeway.mixewayflowapi.api.cicd.dto.ValidateStatusDto;
import io.mixeway.mixewayflowapi.api.cicd.service.CICDService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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
}
