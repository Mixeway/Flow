package io.mixeway.mixewayflowapi.api.admin.controller;

import io.mixeway.mixewayflowapi.api.admin.dto.AdditionalScannerConfigDto;
import io.mixeway.mixewayflowapi.api.admin.dto.ConfigScaRequestDto;
import io.mixeway.mixewayflowapi.api.admin.dto.ConfigSmtpRequestDto;
import io.mixeway.mixewayflowapi.api.admin.dto.ConfigWizRequestDto;
import io.mixeway.mixewayflowapi.api.admin.service.AdminApiService;
import io.mixeway.mixewayflowapi.api.coderepo.dto.CreateCodeRepoRequestDto;
import io.mixeway.mixewayflowapi.db.entity.Settings;
import io.mixeway.mixewayflowapi.utils.StatusDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
@Validated
@Log4j2
public class AdminController {
    private final AdminApiService adminApiService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping(value= "/api/v1/admin/settings/scaconfig")
    public ResponseEntity<StatusDTO> changeSCAConfig(@Valid @RequestBody ConfigScaRequestDto configScaRequestDto){
        try {
            adminApiService.scaConfig(configScaRequestDto);
            return new ResponseEntity<>(new StatusDTO("ok"), HttpStatus.OK);
        } catch (Exception e){
            log.error("[AdminSettings] Error changing SCA config {}",e.getLocalizedMessage());
            return new ResponseEntity<>(new StatusDTO("Not ok"), HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping(value= "/api/v1/admin/settings/smtpconfig")
    public ResponseEntity<StatusDTO> changeSmtpConfig(@Valid @RequestBody ConfigSmtpRequestDto configSmtpRequestDto){
        try {
            adminApiService.smtpConfig(configSmtpRequestDto);
            return new ResponseEntity<>(new StatusDTO("ok"), HttpStatus.OK);
        } catch (Exception e){
            log.error("[AdminSettings] Error changing SMTP config {}",e.getLocalizedMessage());
            return new ResponseEntity<>(new StatusDTO("Not ok"), HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping(value= "/api/v1/admin/settings")
    public ResponseEntity<Settings> getSettings(){
        try {
            return new ResponseEntity<>(adminApiService.get(), HttpStatus.OK);
        } catch (Exception e){
            log.error("[AdminSettings] Error Getting Settings {}",e.getLocalizedMessage());
            return new ResponseEntity<>( HttpStatus.BAD_REQUEST);
        }
    }
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping(value = "/api/v1/admin/settings/wizconfig")
    public ResponseEntity<StatusDTO> changeWizConfig(@Valid @RequestBody ConfigWizRequestDto configWizRequestDto) {
        try {
            adminApiService.wizConfig(configWizRequestDto);
            return new ResponseEntity<>(new StatusDTO("ok"), HttpStatus.OK);
        } catch (Exception e) {
            log.error("[AdminSettings] Error changing Wiz config {}", e.getLocalizedMessage());
            return new ResponseEntity<>(new StatusDTO("Not ok"), HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('TEAM_MANAGER')")
    @GetMapping(value = "/api/v1/admin/settings/additionalscannerconfig")
    public ResponseEntity<AdditionalScannerConfigDto> getAdditionalScannerConfig() {
        try {
            return new ResponseEntity<>(adminApiService.getAdditionalScannerConfig(), HttpStatus.OK);
        } catch (Exception e) {
            log.error("[AdminSettings] Error getting additional scanner configuration {}", e.getLocalizedMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
