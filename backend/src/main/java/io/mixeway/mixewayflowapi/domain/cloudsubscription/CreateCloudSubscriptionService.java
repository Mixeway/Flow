package io.mixeway.mixewayflowapi.domain.cloudsubscription;


import io.mixeway.mixewayflowapi.db.entity.CloudSubscription;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.repository.CloudSubscriptionRepository;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
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
public class CreateCloudSubscriptionService {
    private final CloudSubscriptionRepository cloudSubscriptionRepository;
    private final FindTeamService findTeamService;
    private final PermissionFactory permissionFactory;



    @Transactional
    public CloudSubscription create(String name, Long teamId, Principal principal) {
        Team team = findTeamService.findById(teamId)
                .orElseThrow(() -> {
                    log.warn("Attempted to create cloud subscription for non-existent team id: {}", teamId);
                    return new TeamNotFoundException("Team not found");
                });

        permissionFactory.canUserManageTeam(team, principal);

        if (cloudSubscriptionRepository.existsByNameAndTeam(name, team)) {
            log.warn("Attempted to create duplicate cloud subscription: {} for team: {}", name, team.getName());
            throw new DuplicateCloudSubscriptionException("Cloud subscription with name " + name + " already exists for team");
        }

        CloudSubscription subscription = new CloudSubscription(name, team);
        CloudSubscription saved = cloudSubscriptionRepository.save(subscription);
        log.info("Created new cloud subscription: {} for team: {}", name, team.getName());
        return saved;
    }
}