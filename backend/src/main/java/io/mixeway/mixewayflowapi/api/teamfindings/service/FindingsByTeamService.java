package io.mixeway.mixewayflowapi.api.teamfindings.service;

import io.mixeway.mixewayflowapi.api.coderepo.dto.CommentDto;
import io.mixeway.mixewayflowapi.api.coderepo.dto.GetFindingResponseDto;
import io.mixeway.mixewayflowapi.api.coderepo.dto.VulnsResponseDto;
import io.mixeway.mixewayflowapi.api.teamfindings.dto.TeamVulnsResponseDto;
import io.mixeway.mixewayflowapi.api.coderepo.mapper.FindingMapper;
import io.mixeway.mixewayflowapi.api.teamfindings.mapper.TeamFindingMapper;
import io.mixeway.mixewayflowapi.db.entity.CloudSubscription;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.domain.cloudsubscription.FindCloudSubscriptionService;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.finding.FindFindingService;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
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

    public List<TeamVulnsResponseDto> getCloudAndRepoFindings(Long teamId, Principal principal){
        Team team = findTeamService.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found with ID: " + teamId));

        List<CodeRepo> codeRepos = findCodeRepoService.findByTeam(team);
        List<Finding> codeReposFindings = codeRepos.stream()
                .flatMap(codeRepo -> findFindingService.getCodeRepoFindings(codeRepo, null).stream())
                .collect(Collectors.toList());

        List <CloudSubscription> cloudSubscriptions = findCloudSubscriptionService.getByTeam(teamId, principal);
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


}
