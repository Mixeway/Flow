package io.mixeway.mixewayflowapi.api.cloudsubscription.service;

import io.mixeway.mixewayflowapi.db.entity.CloudSubscription;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.domain.cloudsubscription.CreateCloudSubscriptionService;
import io.mixeway.mixewayflowapi.domain.cloudsubscription.DeleteCloudSubscriptionService;
import io.mixeway.mixewayflowapi.domain.cloudsubscription.FindCloudSubscriptionService;
import io.mixeway.mixewayflowapi.domain.cloudsubscription.UpdateCloudSubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CloudSubscriptionService {
    private final CreateCloudSubscriptionService createCloudSubscriptionService;
    private final UpdateCloudSubscriptionService updateCloudSubscriptionService;
    private final DeleteCloudSubscriptionService deleteCloudSubscriptionService;
    private final FindCloudSubscriptionService findCloudSubscriptionService;

    public CloudSubscription create(String name, Long teamId, Principal principal) {
        return createCloudSubscriptionService.create(name, teamId, principal);
    }

    public CloudSubscription update(Long id, String newName, Long teamId, Principal principal) {
        return updateCloudSubscriptionService.update(id, newName, teamId, principal);
    }

    public void delete(Long id, Long teamId, Principal principal) {
        deleteCloudSubscriptionService.delete(id, teamId, principal);
    }

    public List<CloudSubscription> getByTeam(Long teamId, Principal principal) {
        return findCloudSubscriptionService.getByTeam(teamId, principal);
    }
}
