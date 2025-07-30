package io.mixeway.mixewayflowapi.api.coderepo.service;

import io.mixeway.mixewayflowapi.api.coderepo.dto.GetCodeReposResponseDto;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.coderepo.UpdateCodeRepoService;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import io.mixeway.mixewayflowapi.exceptions.CodeRepoNotFoundException;
import io.mixeway.mixewayflowapi.exceptions.TeamNotFoundException;
import io.mixeway.mixewayflowapi.scanmanager.service.ScanManagerService;
import io.mixeway.mixewayflowapi.utils.PermissionFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class CodeRepoApiService {
    private final FindCodeRepoService findCodeRepoService;
    private final ScanManagerService scanManagerService;
    private final PermissionFactory permissionFactory;
    private final FindTeamService findTeamService;
    private final UpdateCodeRepoService updateCodeRepoService;

    public List<GetCodeReposResponseDto> getRepos(Principal principal) {
        return findCodeRepoService.getCodeReposResponseDtos(principal);
    }

    public CodeRepo getRepo(Long id, Principal principal) {
        return findCodeRepoService.findById(id, principal);
    }

    public List<GetCodeReposResponseDto> getReposByTeam(Long teamId, Principal principal) {
        Team team = findTeamService.findById(teamId)
                .orElseThrow(() -> new TeamNotFoundException("Team not found"));

        // Verify user has permission to access team
        permissionFactory.canUserAccessTeam(team, principal);

        List<CodeRepo> repos = findCodeRepoService.findByTeam(team);
        return repos.stream()
                .map(repo -> new GetCodeReposResponseDto(repo))
                .collect(Collectors.toList());
    }


    public void runScan(Long id, Principal principal) {
        CodeRepo repo = findCodeRepoService.findById(id, principal);
        if (repo != null){
            scanManagerService.scanRepository(repo, repo.getDefaultBranch(),null, null);
        }
    }
    public void changeTeam(Long codeRepoId, Long newTeamId, Principal principal) {
        // Find the code repo
        CodeRepo codeRepo = findCodeRepoService.findById(codeRepoId)
                .orElseThrow(() -> new CodeRepoNotFoundException("Code repository not found"));

        // Verify user has permission to manage current team
        permissionFactory.canUserManageTeam(codeRepo.getTeam(), principal);

        // Find the new team
        Team newTeam = findTeamService.findById(newTeamId)
                .orElseThrow(() -> new TeamNotFoundException("New team not found"));

        // Verify user has permission to manage new team
        permissionFactory.canUserManageTeam(newTeam, principal);

        // Check if the teams are different
        if (codeRepo.getTeam().getId() == newTeamId) {
            throw new IllegalArgumentException("New team is the same as current team");
        }

        // Change the team
        updateCodeRepoService.changeTeam(codeRepo, newTeam);
    }

    public void bulkChangeTeam(List<Long> repositoryIds, Long newTeamId, Principal principal) {
        // For bulk actions by an admin, we trust the role.
        // Finer-grained checks could be added here if needed.

        // Find the new team
        Team newTeam = findTeamService.findById(newTeamId)
                .orElseThrow(() -> new TeamNotFoundException("New team not found"));

        // Call the bulk update service
        updateCodeRepoService.bulkChangeTeam(repositoryIds, newTeam);
    }
}
