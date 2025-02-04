package io.mixeway.mixewayflowapi.domain.cloudsubscription;


import io.mixeway.mixewayflowapi.db.entity.CloudSubscription;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.repository.CloudSubscriptionRepository;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import io.mixeway.mixewayflowapi.exceptions.TeamNotFoundException;
import io.mixeway.mixewayflowapi.utils.PermissionFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Log4j2
public class FindCloudSubscriptionService {
    private final CloudSubscriptionRepository cloudSubscriptionRepository;
    private final FindTeamService findTeamService;
    private final PermissionFactory permissionFactory;

    public List<CloudSubscription> getByTeam(Long teamId, Principal principal) {
        Team team = findTeamService.findById(teamId)
                .orElseThrow(() -> {
                    log.warn("Attempted to get cloud subscriptions for non-existent team id: {}", teamId);
                    return new TeamNotFoundException("Team not found");
                });

        permissionFactory.canUserManageTeam(team, principal);

        List<CloudSubscription> subscriptions = cloudSubscriptionRepository.findByTeam(team);
        log.debug("Retrieved {} cloud subscriptions for team: {}", subscriptions.size(), team.getName());
        return subscriptions;
    }
}