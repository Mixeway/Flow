package io.mixeway.mixewayflowapi.domain.team;

import io.mixeway.mixewayflowapi.api.cloudsubscription.service.CloudSubscriptionService;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.repository.TeamRepository;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.exceptions.TeamHasResourcesException;
import io.mixeway.mixewayflowapi.utils.PermissionFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
public class DeleteTeamService {
    private final TeamRepository teamRepository;
    private final PermissionFactory permissionFactory;
    private final FindTeamService findTeamService;
    private final CloudSubscriptionService cloudSubscriptionService;
    private final FindCodeRepoService codeRepositoryService;

    /**
     * Delete a team if user is authorized and team doesn't have associated resources
     *
     * @param teamId ID of the team to delete
     * @param principal User attempting to delete the team
     */
    @Transactional
    public void deleteTeam(Long teamId, Principal principal) {
        // Find the team
        Optional<Team> teamOptional = findTeamService.findById(teamId);
        if (teamOptional.isEmpty()) {
            log.error("[Team] Team with ID {} not found", teamId);
            throw new IllegalArgumentException("Team not found");
        }

        Team team = teamOptional.get();

        // Check if user is authorized to delete the team
        permissionFactory.canUserManageTeam(team, principal);

        // Check if the team has any cloud subscriptions
        if (!cloudSubscriptionService.getByTeam(teamId,principal).isEmpty()) {
            log.warn("[Team] Cannot delete team with ID {} because it has cloud subscriptions", teamId);
            throw new TeamHasResourcesException("Cannot delete team with cloud subscriptions");
        }

        // Check if the team has any code repositories
        if (!codeRepositoryService.getByTeam(teamId, principal).isEmpty()) {
            log.warn("[Team] Cannot delete team with ID {} because it has code repositories", teamId);
            throw new TeamHasResourcesException("Cannot delete team with code repositories");
        }

        try {
            // First remove all user-team associations from the join table
            log.info("[Team] Removing user associations for team with ID {} by user {}", teamId, principal.getName());
            teamRepository.removeAllUserAssociations(teamId);

            // Then delete the team
            log.info("[Team] Deleting team with ID {} by user {}", teamId, principal.getName());
            teamRepository.delete(team);
        } catch (Exception e) {
            log.error("[Team] Failed to delete team with ID {}: {}", teamId, e.getMessage());
            throw new RuntimeException("Failed to delete team: " + e.getMessage(), e);
        }
    }
}
