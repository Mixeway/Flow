package io.mixeway.mixewayflowapi.api.threatintel.service;

import io.mixeway.mixewayflowapi.api.threatintel.dto.ItemListResponse;
import io.mixeway.mixewayflowapi.api.threatintel.dto.RemovedVulnerabilityDTO;
import io.mixeway.mixewayflowapi.api.threatintel.dto.ReviewedVulnerabilityDTO;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.finding.FindFindingService;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.security.Principal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ThreatIntelService {
    private final FindFindingService findFindingService;
    private final FindTeamService findTeamService;
    private final FindCodeRepoService findCodeRepoService;

    public ResponseEntity<ItemListResponse> getThreats(Principal principal) {
        ItemListResponse itemListResponse = findFindingService.getThreatIntelFindings(principal);
        itemListResponse.setNumberOfTeams(findTeamService.findAllTeams(principal).size());
        itemListResponse.setNumberOfAllProjects(findCodeRepoService.findCodeRepoForUser(principal).size());
        itemListResponse.setOpenedVulnerabilities(findFindingService.countOpenedVulnerabilities(principal));
        return new ResponseEntity<>(itemListResponse,HttpStatus.OK);
    }

    public ResponseEntity<List<RemovedVulnerabilityDTO>> getRemovedThreats(Principal principal) {
        return new ResponseEntity<>(findFindingService.getTopRemovedVulns(principal),HttpStatus.OK);
    }

    public ResponseEntity<List<ReviewedVulnerabilityDTO>> getSupressedThreats(Principal principal) {
        return new ResponseEntity<>(findFindingService.getTopReviewedVulns(principal),HttpStatus.OK);
    }
}
