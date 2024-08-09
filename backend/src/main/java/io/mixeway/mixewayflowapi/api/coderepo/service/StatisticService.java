package io.mixeway.mixewayflowapi.api.coderepo.service;

import io.mixeway.mixewayflowapi.api.coderepo.dto.AggregatedRepoStatsDTO;
import io.mixeway.mixewayflowapi.api.coderepo.dto.VulnStatsResponseDto;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoFindingStats;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.coderepofindingstats.FindCodeRepoFindingStatsService;
import io.mixeway.mixewayflowapi.domain.finding.FindFindingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StatisticService {
    private final FindCodeRepoService findCodeRepoService;
    private final FindFindingService findFindingService;
    private final FindCodeRepoFindingStatsService findCodeRepoFindingStatsService;

    public ResponseEntity<VulnStatsResponseDto> getFindingStatsForRepo(Long id, Principal principal){
        CodeRepo codeRepo = findCodeRepoService.findById(id, principal);
        if (codeRepo!=null){
            return new ResponseEntity<>(findFindingService.countFindingStatsForRepo(codeRepo), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<List<CodeRepoFindingStats>> getFindingStats(Long id, Principal principal) {
        CodeRepo codeRepo = findCodeRepoService.findById(id, principal);
        if (codeRepo!=null){
            return new ResponseEntity<>(findCodeRepoFindingStatsService.getStatsForRepo(codeRepo), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public AggregatedRepoStatsDTO getAggregatedStats(Principal principal) {
        return findCodeRepoFindingStatsService.getAggregatedStatsForLastSevenDays(principal);
    }
}
