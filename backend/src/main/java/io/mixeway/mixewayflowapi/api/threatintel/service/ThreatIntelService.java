package io.mixeway.mixewayflowapi.api.threatintel.service;

import io.mixeway.mixewayflowapi.api.threatintel.dto.ItemListResponse;
import io.mixeway.mixewayflowapi.api.threatintel.dto.RemovedVulnerabilityDTO;
import io.mixeway.mixewayflowapi.api.threatintel.dto.ReviewedVulnerabilityDTO;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import io.mixeway.mixewayflowapi.db.repository.UserRepository;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.finding.FindFindingService;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import io.mixeway.mixewayflowapi.domain.vulnerability.FindVulnerabilityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Log4j2
@Service
@RequiredArgsConstructor
public class ThreatIntelService {
    private final FindFindingService findFindingService;
    private final FindTeamService findTeamService;
    private final FindCodeRepoService findCodeRepoService;
    private final UserRepository userRepository;

    public ResponseEntity<ItemListResponse> getThreats(Principal principal) {
        ItemListResponse itemListResponse = findFindingService.getThreatIntelFindings(principal);
        itemListResponse.setNumberOfTeams(findTeamService.findAllTeams(principal).size());
        itemListResponse.setNumberOfAllProjects(findCodeRepoService.findCodeRepoForUser(principal).size());
        itemListResponse.setNumberOfUniqueProjects(findCodeRepoService.findCodeRepoForUser(principal).size());
        itemListResponse.setOpenedVulnerabilities(findFindingService.countOpenedVulnerabilities(principal));
        return new ResponseEntity<>(itemListResponse,HttpStatus.OK);
    }

    public ResponseEntity<List<RemovedVulnerabilityDTO>> getRemovedThreats(Principal principal) {
        return new ResponseEntity<>(findFindingService.getTopRemovedVulns(principal),HttpStatus.OK);
    }

    public ResponseEntity<List<ReviewedVulnerabilityDTO>> getSupressedThreats(Principal principal) {
        return new ResponseEntity<>(findFindingService.getTopReviewedVulns(principal),HttpStatus.OK);
    }

    public ResponseEntity<ItemListResponse> getThreatsForTeam(Principal principal, String remoteId) {
        ItemListResponse itemListResponse = findFindingService.getThreatIntelFindingsForTeam(principal,remoteId);
        List<Team> team = findTeamService.findByRemoteId(remoteId);
        List<CodeRepo> codeRepos = findCodeRepoService.findbyTeamIn(team);
        itemListResponse.setNumberOfTeams(team.size());
        itemListResponse.setNumberOfAllProjects(codeRepos.size());
        itemListResponse.setOpenedVulnerabilities(findFindingService.countOpenedVulnerabilitiesForRepos(codeRepos));
        return new ResponseEntity<>(itemListResponse,HttpStatus.OK);
    }

    public boolean isValidApiKey(String apiKey, String remoteId) {
        Optional<UserInfo> userOptional = userRepository.findByApiKey(apiKey);
        List<Team> codeRepoTeams = findTeamService.findByRemoteId(remoteId);

        if (userOptional.isEmpty() || codeRepoTeams.isEmpty()) {
            return false;
        }

        UserInfo user = userOptional.get();

        if ("ADMIN".equals(user.getHighestRole())) {
            log.info("[Team Service] User's {} API key validation succeeded", user.getUsername());
            return true;
        }

        for (Team team : codeRepoTeams) {
            List<UserInfo> teamUsers = userRepository.getUsersByTeamId(team.getId());
            if (teamUsers.contains(user)) {
                log.info("[Team Service] User's {} API key validation succeeded", user.getUsername());
                return true;
            }
        }

        log.info("[Team Service] User's {} API key validation failed", user.getUsername());
        return false;
    }

}
