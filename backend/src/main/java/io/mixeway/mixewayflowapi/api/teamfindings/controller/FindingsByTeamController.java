package io.mixeway.mixewayflowapi.api.teamfindings.controller;

import io.mixeway.mixewayflowapi.api.coderepo.dto.GetFindingResponseDto;
import io.mixeway.mixewayflowapi.api.teamfindings.dto.TeamVulnsResponseDto;
import io.mixeway.mixewayflowapi.api.teamfindings.service.FindingsByTeamService;
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
public class FindingsByTeamController {
    private final FindingsByTeamService findingsByTeamService;

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping(value = "/api/v1/teamfindings/{id}/findings")
    public ResponseEntity<List<TeamVulnsResponseDto>> getFindingsByTeamService(@PathVariable("id") Long id, Principal principal) {
        try {
            return new ResponseEntity<>(findingsByTeamService.getCloudAndRepoFindings(id, principal), HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error fetching findings for team: {}", id);
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping(value= "/api/v1/teamfindings/{id}/finding/{findingId}")
    public ResponseEntity<GetFindingResponseDto> getFindingByTeamService(@PathVariable("id") Long id, @PathVariable("findingId") Long findingId, Principal principal){
        try {
            return new ResponseEntity<>(findingsByTeamService.getCloudAndRepoFinding(id, findingId, principal), HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error fetching finding: {}. Exception: {}", findingId, e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

    }
}
