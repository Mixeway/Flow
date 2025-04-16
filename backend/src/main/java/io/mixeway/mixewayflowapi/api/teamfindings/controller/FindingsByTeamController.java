package io.mixeway.mixewayflowapi.api.teamfindings.controller;

import io.mixeway.mixewayflowapi.api.coderepo.dto.GetFindingResponseDto;
import io.mixeway.mixewayflowapi.api.team.dto.TeamIdDto;
import io.mixeway.mixewayflowapi.api.teamfindings.dto.TeamFindingsAndVulnsResponseDto;
import io.mixeway.mixewayflowapi.api.teamfindings.dto.TeamVulnsResponseDto;
import io.mixeway.mixewayflowapi.api.teamfindings.service.FindingsByTeamService;
import io.mixeway.mixewayflowapi.utils.StatusDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import java.util.Map;

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

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping(value = "/api/v1/teamfindings/{remoteIdentifier}")
    public ResponseEntity<Page<TeamFindingsAndVulnsResponseDto>> getTeamFindings(@RequestHeader("X-API-KEY") String apiKey, @PathVariable("remoteIdentifier") String remoteIdentifier, @RequestParam Map<String, String> filters, Principal principal, Pageable pageable) {
        try {
            if (!findingsByTeamService.isValidApiKey(apiKey)) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
            return new ResponseEntity<>(findingsByTeamService.getCloudAndRepoFindingsAndVulns(remoteIdentifier, principal, pageable, filters), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
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

    @PreAuthorize("hasAuthority('USER')")
    @PostMapping(value= "/api/v1/teamfindings/{id}/supress")
    public ResponseEntity<StatusDTO> supressTeamFindingList(@PathVariable("id") Long id, @RequestBody List<Long> findingIds, Principal principal){
        try {
            return new ResponseEntity<>(findingsByTeamService.supressTeamFindingBulk(id,findingIds,principal), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>( HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping(value= "/api/v1/teamfindings/{id}/supress/{finding}/reason/{reason}")
    public ResponseEntity<StatusDTO> supressTeamFinding(@PathVariable("id") Long id, @PathVariable("finding") Long findingId, @PathVariable("reason") String reason, Principal principal){
        try {
            return new ResponseEntity<>(findingsByTeamService.supressTeamFinding(id,findingId,reason,principal), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>( HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping(value= "/api/v1/teamfindings/{id}/reactivate/{finding}")
    public ResponseEntity<StatusDTO> reactivateTeamFinding(@PathVariable("id") Long id, @PathVariable("finding") Long findingId, Principal principal){
        try {
            return new ResponseEntity<>(findingsByTeamService.reactivateTeamFinding(id,findingId,principal), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>( HttpStatus.BAD_REQUEST);
        }
    }
}
