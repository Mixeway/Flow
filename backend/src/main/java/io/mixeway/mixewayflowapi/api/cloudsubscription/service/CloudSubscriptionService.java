package io.mixeway.mixewayflowapi.api.cloudsubscription.service;

import io.mixeway.mixewayflowapi.api.cloudsubscription.dto.GetCloudSubscriptionsResponseDto;
import io.mixeway.mixewayflowapi.db.entity.CloudSubscription;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.domain.cloudsubscription.CreateCloudSubscriptionService;
import io.mixeway.mixewayflowapi.domain.cloudsubscription.DeleteCloudSubscriptionService;
import io.mixeway.mixewayflowapi.domain.cloudsubscription.FindCloudSubscriptionService;
import io.mixeway.mixewayflowapi.domain.cloudsubscription.UpdateCloudSubscriptionService;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import io.mixeway.mixewayflowapi.exceptions.CloudSubscriptionNotFoundException;
import io.mixeway.mixewayflowapi.exceptions.TeamNotFoundException;
import io.mixeway.mixewayflowapi.scanmanager.service.ScanManagerService;
import io.mixeway.mixewayflowapi.utils.PermissionFactory;
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
    private final ScanManagerService scanManagerService;
    private final PermissionFactory permissionFactory;
    private final FindTeamService findTeamService;

    public CloudSubscription create(String name, Long teamId, Principal principal, String externalProjectName) {
        return createCloudSubscriptionService.create(name, teamId, principal, externalProjectName);
    }

    public CloudSubscription update(Long id, String newName, Long teamId, Principal principal, String externalProjectName) {
        return updateCloudSubscriptionService.update(id, newName, teamId, principal, externalProjectName);
    }

    public void delete(Long id, Long teamId, Principal principal) {
        deleteCloudSubscriptionService.delete(id, teamId, principal);
    }

    public List<CloudSubscription> getByTeam(Long teamId, Principal principal) {
        return findCloudSubscriptionService.getByTeam(teamId, principal);
    }

    public CloudSubscription getById(Long id, Principal principal) {
        return findCloudSubscriptionService.findById(id, principal);
    }

    public List<GetCloudSubscriptionsResponseDto> getCloudSubscriptions(Principal principal) {
        return findCloudSubscriptionService.getCloudSubscriptionResponseDtos(principal);
    }

    public void runScan(Long id, Principal principal) {
        CloudSubscription cloudSubscription = findCloudSubscriptionService.findById(id, principal);
        if (cloudSubscription != null){
            scanManagerService.runCloudScan(cloudSubscription);
        }
    }

    public void changeTeam(Long id, Long newTeamId, Principal principal) {
        CloudSubscription cloudSubscription = findCloudSubscriptionService.findById(id)
                .orElseThrow(() -> new CloudSubscriptionNotFoundException("Cloud subscription not found"));

        permissionFactory.canUserManageTeam(cloudSubscription.getTeam(), principal);

        Team newTeam = findTeamService.findById(newTeamId)
                .orElseThrow(() -> new TeamNotFoundException("New team not found"));

        permissionFactory.canUserManageTeam(newTeam, principal);

        if (cloudSubscription.getTeam().getId() == newTeamId) {
            throw new IllegalArgumentException("New team is the same as current team");
        }

        updateCloudSubscriptionService.changeTeam(cloudSubscription, newTeam);
    }
}
