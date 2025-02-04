package io.mixeway.mixewayflowapi.domain.cloudsubscription;

import io.mixeway.mixewayflowapi.db.entity.CloudSubscription;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.repository.CloudSubscriptionRepository;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import io.mixeway.mixewayflowapi.exceptions.CloudSubscriptionNotFoundException;
import io.mixeway.mixewayflowapi.exceptions.DuplicateCloudSubscriptionException;
import io.mixeway.mixewayflowapi.exceptions.TeamNotFoundException;
import io.mixeway.mixewayflowapi.utils.PermissionFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;

@Service
@RequiredArgsConstructor
@Log4j2
public class UpdateCloudSubscriptionService {
    private final CloudSubscriptionRepository cloudSubscriptionRepository;
    private final FindTeamService findTeamService;
    private final PermissionFactory permissionFactory;

    @Transactional
    public CloudSubscription update(Long id, String newName, Long teamId, Principal principal) {
        Team team = findTeamService.findById(teamId)
                .orElseThrow(() -> {
                    log.warn("Attempted to update cloud subscription for non-existent team id: {}", teamId);
                    return new TeamNotFoundException("Team not found");
                });

        permissionFactory.canUserManageTeam(team, principal);

        CloudSubscription subscription = cloudSubscriptionRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Attempted to update non-existent cloud subscription with id: {}", id);
                    return new CloudSubscriptionNotFoundException("Cloud subscription not found");
                });

        if (!subscription.getTeam().equals(team)) {
            log.warn("Attempted to update subscription from different team. Subscription id: {}, Team: {}", id, team.getName());
            throw new IllegalArgumentException("Cannot modify subscription from different team");
        }

        if (!subscription.getName().equals(newName) &&
                cloudSubscriptionRepository.existsByNameAndTeam(newName, team)) {
            log.warn("Attempted to update to existing name: {} for team: {}", newName, team.getName());
            throw new DuplicateCloudSubscriptionException("Cloud subscription with name " + newName + " already exists for team");
        }

        subscription.updateName(newName);
        CloudSubscription updated = cloudSubscriptionRepository.save(subscription);
        log.info("Updated cloud subscription id: {} to name: {} for team: {}", id, newName, team.getName());
        return updated;
    }
}
