package io.mixeway.mixewayflowapi.api.threatintel.controller;

import io.mixeway.mixewayflowapi.api.threatintel.dto.ItemListResponse;
import io.mixeway.mixewayflowapi.api.threatintel.dto.RemovedVulnerabilityDTO;
import io.mixeway.mixewayflowapi.api.threatintel.dto.ReviewedVulnerabilityDTO;
import io.mixeway.mixewayflowapi.api.threatintel.service.ThreatIntelService;
import io.mixeway.mixewayflowapi.db.projection.Item;
import io.mixeway.mixewayflowapi.db.projection.ItemProjection;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Log4j2
@Validated
public class ThreatIntelController {

    private final ThreatIntelService threatIntelService;

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping(value= "/api/v1/threat-intel/findings")
    public ResponseEntity<ItemListResponse> getThreats(Principal principal){
        return threatIntelService.getThreats(principal);
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping(value= "/api/v1/threat-intel/removed")
    public ResponseEntity<List<RemovedVulnerabilityDTO>> getRemovedThreats(Principal principal){
        return threatIntelService.getRemovedThreats(principal);
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping(value= "/api/v1/threat-intel/supressed")
    public ResponseEntity<List<ReviewedVulnerabilityDTO>> getSupressedThreats(Principal principal){
        return threatIntelService.getSupressedThreats(principal);
    }
}
