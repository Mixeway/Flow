package io.mixeway.mixewayflowapi.api.coderepo.controller;


import io.mixeway.mixewayflowapi.api.coderepo.dto.AggregatedRepoStatsDTO;
import io.mixeway.mixewayflowapi.api.coderepo.dto.GetCodeReposResponseDto;
import io.mixeway.mixewayflowapi.api.coderepo.dto.VulnStatsResponseDto;
import io.mixeway.mixewayflowapi.api.coderepo.service.StatisticService;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoFindingStats;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
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
public class StatisticController {
    private final StatisticService statisticService;


    @PreAuthorize("hasAuthority('USER')")
    @GetMapping(value= "/api/v1/coderepo/{id}/source_stats")
    public ResponseEntity<VulnStatsResponseDto> getVulnSourceStats(@PathVariable("id") Long id, Principal principal){
        try {
            return statisticService.getFindingStatsForRepo(id, principal);
        } catch (Exception e){
            return new ResponseEntity<>( HttpStatus.BAD_REQUEST);
        }
    }
    @PreAuthorize("hasAuthority('USER')")
    @GetMapping(value= "/api/v1/coderepo/{id}/finding_stats")
    public ResponseEntity<List<CodeRepoFindingStats>> getFindingStats(@PathVariable("id") Long id, Principal principal){
        try {
            return statisticService.getFindingStats(id, principal);
        } catch (Exception e){
            return new ResponseEntity<>( HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping(value= "/api/v1/widget_stats")
    public ResponseEntity<AggregatedRepoStatsDTO> getDashboardStats(Principal principal){
        try {
            return new ResponseEntity<>(statisticService.getAggregatedStats(principal), HttpStatus.OK);
        } catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>( HttpStatus.BAD_REQUEST);
        }
    }
}
