package io.mixeway.mixewayflowapi.api.teamfindings.controller;

import io.mixeway.mixewayflowapi.api.teamfindings.dto.CombinedDailyStatsDto;
import io.mixeway.mixewayflowapi.api.teamfindings.dto.DailyCodeReposStatsDto;
import io.mixeway.mixewayflowapi.api.teamfindings.dto.TeamVulnStatsResponseDto;
import io.mixeway.mixewayflowapi.api.teamfindings.service.TeamStatisticService;
import lombok.extern.log4j.Log4j2;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@Validated
@RequiredArgsConstructor
@Log4j2
public class TeamStatisticController {
    private final TeamStatisticService teamStatisticService;

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping(value= "/api/v1/teamfindings/{id}/finding_stats")
    public ResponseEntity<CombinedDailyStatsDto> getTeamFindingStats(@PathVariable("id") Long id, Principal principal){
        try {
            CombinedDailyStatsDto stats = teamStatisticService.getTeamFindingStats(id, principal);
            return ResponseEntity.ok(stats);
        } catch (Exception e){
            log.error("Error fetching cloud finding stats", e);
            return new ResponseEntity<>( HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping(value= "/api/v1/teamfindings/{id}/source_stats")
    public TeamVulnStatsResponseDto getTeamVulnSourceStats(@PathVariable("id") Long id, Principal principal){
        try {
            return teamStatisticService.getFindingSourceStatsForTeam(id, principal);
        } catch (Exception e){
            return new ResponseEntity<TeamVulnStatsResponseDto>( HttpStatus.BAD_REQUEST).getBody();
        }
    }
}
