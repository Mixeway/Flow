package io.mixeway.mixewayflowapi.api.teamfindings.service;

import io.mixeway.mixewayflowapi.api.coderepo.dto.CommentDto;
import io.mixeway.mixewayflowapi.api.coderepo.dto.GetFindingResponseDto;
import io.mixeway.mixewayflowapi.api.coderepo.dto.VulnsResponseDto;
import io.mixeway.mixewayflowapi.api.coderepo.service.FindingService;
import io.mixeway.mixewayflowapi.api.team.dto.TeamDto;
import io.mixeway.mixewayflowapi.api.teamfindings.dto.TeamFindingsAndVulnsResponseDto;
import io.mixeway.mixewayflowapi.api.teamfindings.dto.TeamVulnsResponseDto;
import io.mixeway.mixewayflowapi.api.coderepo.mapper.FindingMapper;
import io.mixeway.mixewayflowapi.api.teamfindings.mapper.TeamFindingAndVulnsMapper;
import io.mixeway.mixewayflowapi.api.teamfindings.mapper.TeamFindingMapper;
import io.mixeway.mixewayflowapi.db.entity.*;
import io.mixeway.mixewayflowapi.db.repository.FindingRepository;
import io.mixeway.mixewayflowapi.db.repository.UserRepository;
import io.mixeway.mixewayflowapi.domain.cloudsubscription.FindCloudSubscriptionService;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.finding.FindFindingService;
import io.mixeway.mixewayflowapi.domain.finding.UpdateFindingService;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import io.mixeway.mixewayflowapi.utils.StatusDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;
import java.util.Map;
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
    private final FindingRepository findingRepository;
    private final FindingService findingService;



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

        // Map to DTOs and enrich with urgency when DTO supports it
        List<TeamVulnsResponseDto> dtos = TeamFindingMapper.mapToDtoList(findingsByTeam);
        try {
            for (int i = 0; i < dtos.size(); i++) {
                TeamVulnsResponseDto dto = dtos.get(i);
                Finding f = findingsByTeam.get(i);
                // If DTO has setUrgency(String), populate it; otherwise ignore gracefully
                try {
                    TeamVulnsResponseDto.class.getMethod("setUrgency", String.class)
                            .invoke(dto, findingService.calculateUrgency(f));
                } catch (NoSuchMethodException ignore) {
                    // older DTO without urgency support – skip
                }
                // Populate repoUrl from finding.codeRepo.repourl when available
                try {
                    String repoUrl = null;
                    CodeRepo codeRepo = f.getCodeRepo();
                    if (codeRepo != null && codeRepo.getRepourl() != null) {
                        repoUrl = codeRepo.getRepourl();
                    }
                    TeamVulnsResponseDto.class.getMethod("setRepoUrl", String.class)
                            .invoke(dto, repoUrl);
                } catch (NoSuchMethodException ignore) {
                    // Older DTO without repoUrl support – skip
                }
            }
        } catch (Exception e) {
            log.warn("Unable to enrich TeamVulnsResponseDto with urgency: {}", e.getMessage());
        }
        return dtos;
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
            // Enrich single finding response with urgency if DTO supports it
            try {
                VulnsResponseDto.class.getMethod("setUrgency", String.class)
                        .invoke(vulnsResponseDto, findingService.calculateUrgency(finding));
            } catch (NoSuchMethodException ignore) {
                // DTO without urgency – skip
            } catch (Exception e) {
                log.warn("Unable to enrich VulnsResponseDto with urgency: {}", e.getMessage());
            }
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

    public Page<TeamFindingsAndVulnsResponseDto> getCloudAndRepoFindingsAndVulns(String remoteIdentifier, Principal principal, Pageable pageable, Map<String, String> filters) {
        List<Team> teams = findTeamService.findByRemoteId(remoteIdentifier);

        if (teams.isEmpty()) {
            throw new IllegalArgumentException("Team not found with remote ID: " + remoteIdentifier);
        }

        List<CodeRepo> codeRepos = teams.stream()
                .flatMap(team -> findCodeRepoService.findByTeam(team).stream())
                .collect(Collectors.toList());

        List<CloudSubscription> cloudSubscriptions = teams.stream()
                .flatMap(team -> findCloudSubscriptionService.getByTeam(team.getId(), principal).stream())
                .collect(Collectors.toList());

        String severity = filters.getOrDefault("severity", null);
        String source = filters.getOrDefault("source", null);
        String status = filters.getOrDefault("status", null);
        String epssString = filters.getOrDefault("epss", null);
        BigDecimal epss = (epssString != null) ? new BigDecimal(epssString) : null;
        String kevStr = filters.getOrDefault("kev", null);
        Boolean kev = null;
        if ("t".equalsIgnoreCase(kevStr) || "true".equalsIgnoreCase(kevStr)) kev = true;
        else if ("f".equalsIgnoreCase(kevStr) || "false".equalsIgnoreCase(kevStr)) kev = false;
        String urgencyFilter = filters.getOrDefault("urgency", null); // expected values: "urgent" | "notable"

        Page<Finding> codeRepoFindingsPage = findingRepository.findByCodeReposPageable(codeRepos, pageable, severity, source, status, epss, kev);
        Page<Finding> cloudSubscriptionFindingsPage = findingRepository.findByCloudSubscriptionsPageable(cloudSubscriptions, pageable, severity, source, status, epss, kev);

        List<Finding> combinedFindings = Stream.concat(
                codeRepoFindingsPage.getContent().stream(),
                cloudSubscriptionFindingsPage.getContent().stream()
        ).collect(Collectors.toList());

        if (urgencyFilter != null && !urgencyFilter.isBlank()) {
            String uf = urgencyFilter.trim().toLowerCase();
            combinedFindings = combinedFindings.stream()
                    .filter(f -> {
                        String u = Optional.ofNullable(findingService.calculateUrgency(f)).orElse("").toLowerCase();
                        return uf.equals(u);
                    })
                    .collect(Collectors.toList());
        }

        List<TeamFindingsAndVulnsResponseDto> dtos = TeamFindingAndVulnsMapper.mapToDtoList(remoteIdentifier, combinedFindings);

        try {
            for (int i = 0; i < dtos.size(); i++) {
                TeamFindingsAndVulnsResponseDto dto = dtos.get(i);
                Finding f = combinedFindings.get(i);
                try {
                    TeamFindingsAndVulnsResponseDto.class.getMethod("setUrgency", String.class)
                            .invoke(dto, findingService.calculateUrgency(f));
                } catch (NoSuchMethodException ignore) {
                    // DTO without urgency – skip
                }
            }
        } catch (Exception e) {
            log.warn("Unable to enrich TeamFindingsAndVulnsResponseDto with urgency: {}", e.getMessage());
        }

        return new PageImpl<>(dtos, pageable, codeRepoFindingsPage.getTotalElements() + cloudSubscriptionFindingsPage.getTotalElements());
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
                updateFindingService.suppressFindingAcrossBranches(finding.get(), reason);
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
