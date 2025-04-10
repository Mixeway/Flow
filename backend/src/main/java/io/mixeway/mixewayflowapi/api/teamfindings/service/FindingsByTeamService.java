package io.mixeway.mixewayflowapi.api.teamfindings.service;

import io.mixeway.mixewayflowapi.api.coderepo.dto.CommentDto;
import io.mixeway.mixewayflowapi.api.coderepo.dto.GetFindingResponseDto;
import io.mixeway.mixewayflowapi.api.coderepo.dto.VulnsResponseDto;
import io.mixeway.mixewayflowapi.api.team.dto.TeamDto;
import io.mixeway.mixewayflowapi.api.teamfindings.dto.TeamFindingsAndVulnsResponseDto;
import io.mixeway.mixewayflowapi.api.teamfindings.dto.TeamVulnsResponseDto;
import io.mixeway.mixewayflowapi.api.coderepo.mapper.FindingMapper;
import io.mixeway.mixewayflowapi.api.teamfindings.mapper.TeamFindingAndVulnsMapper;
import io.mixeway.mixewayflowapi.api.teamfindings.mapper.TeamFindingMapper;
import io.mixeway.mixewayflowapi.db.entity.*;
import io.mixeway.mixewayflowapi.db.repository.UserRepository;
import io.mixeway.mixewayflowapi.domain.cloudsubscription.FindCloudSubscriptionService;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.finding.FindFindingService;
import io.mixeway.mixewayflowapi.domain.finding.UpdateFindingService;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import io.mixeway.mixewayflowapi.utils.StatusDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Log4j2
@RequiredArgsConstructor
public class FindingsByTeamService {

    private final FindCodeRepoService findCodeRepoService;
    private final FindCloudSubscriptionService findCloudSubscriptionService;
    private final FindTeamService findTeamService;
    private final FindFindingService findFindingService;
    private final UpdateFindingService updateFindingService;
    private final UserRepository userRepository;

    public List<TeamVulnsResponseDto> getCloudAndRepoFindings(Long teamId, Principal principal) {
        Team team = findTeamService.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found with ID: " + teamId));

        List<CodeRepo> codeRepos = findCodeRepoService.findByTeam(team);
        List<Finding> codeReposFindings = codeRepos.stream()
                .flatMap(codeRepo -> findFindingService.getCodeRepoFindings(codeRepo, null).stream())
                .collect(Collectors.toList());

        List<CloudSubscription> cloudSubscriptions = findCloudSubscriptionService.getByTeam(teamId, principal);
        List<Finding> cloudSubscriptionsFindings = cloudSubscriptions.stream()
                .flatMap(cloudSubscription -> findFindingService.getCloudSubscriptionFindings(cloudSubscription).stream())
                .collect(Collectors.toList());

        List<Finding> findingsByTeam = Stream.concat(codeReposFindings.stream(), cloudSubscriptionsFindings.stream())
                .collect(Collectors.toList());

        return TeamFindingMapper.mapToDtoList(findingsByTeam);
    }

    public GetFindingResponseDto getCloudAndRepoFinding(Long teamId, Long findingId, Principal principal) {
        Team team = findTeamService.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found with ID: " + teamId));

        List<CloudSubscription> cloudSubscriptions = findCloudSubscriptionService.getByTeam(teamId, principal);
        List<CodeRepo> codeRepos = findCodeRepoService.findByTeam(team);

        Finding finding = findFindingService.findById(findingId)
                .orElseThrow(() -> new IllegalArgumentException("Finding not found with ID: " + findingId));

        if (cloudSubscriptions.contains(finding.getCloudSubscription()) || codeRepos.contains(finding.getCodeRepo())) {
            GetFindingResponseDto getFindingResponseDto = new GetFindingResponseDto();
            VulnsResponseDto vulnsResponseDto = FindingMapper.mapToDto(finding);
            getFindingResponseDto.setVulnsResponseDto(vulnsResponseDto);
            getFindingResponseDto.setDescription(finding.getVulnerability().getDescription());
            getFindingResponseDto.setRecommendation(finding.getVulnerability().getRecommendation());
            getFindingResponseDto.setRefs(finding.getVulnerability().getRef());
            getFindingResponseDto.setExplanation(finding.getExplanation());
            getFindingResponseDto.setComments(finding.getComments().stream()
                    .map(comment -> new CommentDto(comment.getCreatedDate(), comment.getUser().getUsername(), comment.getMessage()))
                    .toList());
            return getFindingResponseDto;
        } else {
            throw new IllegalArgumentException("Finding does not belong to the specified team or resources.");
        }
    }

    public boolean isValidApiKey(String apiKey) {
        Optional<UserInfo> userOptional = userRepository.findByApiKey(apiKey);

        if (userOptional.isPresent()) {
            boolean isAdmin = "ADMIN".equals(userOptional.get().getHighestRole());
            log.info("[Team Service] User's {} API key validation succeeded", userOptional.get().getUsername());
            return isAdmin;
        } else {
            return false;
        }
    }

    public List<TeamFindingsAndVulnsResponseDto> getCloudAndRepoFindingsAndVulns(String remoteIdentifier, Principal principal) {
        List<Team> teams = findTeamService.findByRemoteId(remoteIdentifier);

        if (teams.isEmpty()) {
            throw new IllegalArgumentException("Team not found with remote ID: " + remoteIdentifier);
        }


        return teams.stream().flatMap(team -> {
            List<CodeRepo> codeRepos = findCodeRepoService.findByTeam(team);
            List<Finding> codeReposFindings = codeRepos.stream()
                    .flatMap(codeRepo -> findFindingService.getCodeRepoFindings(codeRepo, null).stream())
                    .collect(Collectors.toList());

            List<CloudSubscription> cloudSubscriptions = findCloudSubscriptionService.getByTeam(team.getId(), principal);
            List<Finding> cloudSubscriptionsFindings = cloudSubscriptions.stream()
                    .flatMap(cloudSubscription -> findFindingService.getCloudSubscriptionFindings(cloudSubscription).stream())
                    .collect(Collectors.toList());

            List<Finding> findingsByTeam = Stream.concat(codeReposFindings.stream(), cloudSubscriptionsFindings.stream())
                    .collect(Collectors.toList());

            return TeamFindingAndVulnsMapper.mapToDtoList(remoteIdentifier, findingsByTeam).stream();
        }).collect(Collectors.toList());
    }


    public StatusDTO supressTeamFindingBulk(Long id, List<Long> findingIds, Principal principal) {
        Optional<Team> teamOptional = findTeamService.findById(id);
        if (teamOptional.isPresent()) {
            Team team = teamOptional.get();
            List<CodeRepo> codeRepos = findCodeRepoService.findByTeam(team);
            for (Long findingId : findingIds) {
                Optional<Finding> finding = findFindingService.findById(findingId);
                if (finding.isPresent() && codeRepos.contains(finding.get().getCodeRepo())) {
                    updateFindingService.suppressFinding(finding.get(), Finding.SuppressedReason.FALSE_POSITIVE.toString());
                }
            }
            return new StatusDTO("OK");
        }
        return new StatusDTO("Team not found");
    }

    public StatusDTO supressTeamFinding(Long id, Long findingId, String reason, Principal principal) {
        Optional<Team> teamOptional = findTeamService.findById(id);
        if (teamOptional.isPresent()) {
            Team team = teamOptional.get();
            List<CodeRepo> codeRepos = findCodeRepoService.findByTeam(team);
            Optional<Finding> finding = findFindingService.findById(findingId);
            if (finding.isPresent() && codeRepos.contains(finding.get().getCodeRepo())) {
                updateFindingService.suppressFinding(finding.get(), reason);
            }

            return new StatusDTO("OK");
        }
        return new StatusDTO("Team not found");
    }

    public StatusDTO reactivateTeamFinding(Long id, Long findingId, Principal principal) {
        Optional<Team> teamOptional = findTeamService.findById(id);
        if (teamOptional.isPresent()) {
            Team team = teamOptional.get();
            List<CodeRepo> codeRepos = findCodeRepoService.findByTeam(team);
            Optional<Finding> finding = findFindingService.findById(findingId);
            if (finding.isPresent() && codeRepos.contains(finding.get().getCodeRepo())) {
                updateFindingService.reactivate(finding.get());
            }

            return new StatusDTO("OK");
        }
        return new StatusDTO("Team not found");
    }
}
