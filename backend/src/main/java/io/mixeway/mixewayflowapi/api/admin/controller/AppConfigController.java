// AppConfigController.java
package io.mixeway.mixewayflowapi.api.admin.controller;

import io.mixeway.mixewayflowapi.api.admin.dto.RunModeRequestDto;
import io.mixeway.mixewayflowapi.config.AppConfigService;
import io.mixeway.mixewayflowapi.utils.StatusDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/config")
@RequiredArgsConstructor
@Log4j2
public class AppConfigController {
    private final AppConfigService appConfigService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/runmode")
    public ResponseEntity<String> getRunMode() {
        return ResponseEntity.ok(appConfigService.getRunMode().name());
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/runmode")
    public ResponseEntity<StatusDTO> setRunMode(@Valid @RequestBody RunModeRequestDto requestDto) {
        try {
            AppConfigService.RunMode mode = AppConfigService.RunMode.valueOf(requestDto.getMode());
            appConfigService.setRunMode(mode);
            return ResponseEntity.ok(new StatusDTO("Run mode updated successfully"));
        } catch (IllegalArgumentException e) {
            log.error("[AppConfigController] Invalid run mode: {}", requestDto.getMode());
            return ResponseEntity.badRequest().body(new StatusDTO("Invalid run mode"));
        } catch (Exception e) {
            log.error("[AppConfigController] Error updating run mode: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new StatusDTO("Error updating run mode"));
        }
    }
}