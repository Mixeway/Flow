package io.mixeway.mixewayflowapi.domain.cloudsubscription;

import io.mixeway.mixewayflowapi.api.cloudsubscription.dto.GetCloudSubscriptionsResponseDto;
import io.mixeway.mixewayflowapi.db.entity.CloudSubscription;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import io.mixeway.mixewayflowapi.db.repository.CloudSubscriptionRepository;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import io.mixeway.mixewayflowapi.domain.user.FindUserService;
import io.mixeway.mixewayflowapi.exceptions.TeamNotFoundException;
import io.mixeway.mixewayflowapi.utils.PermissionFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
public class FindCloudSubscriptionService {
    private final CloudSubscriptionRepository cloudSubscriptionRepository;
    private final FindTeamService findTeamService;
    private final PermissionFactory permissionFactory;
    private final FindUserService findUserService;

    public List<CloudSubscription> getByTeam(Long teamId, Principal principal) {
        Team team = findTeamService.findById(teamId)
                .orElseThrow(() -> new TeamNotFoundException("Team not found"));

        permissionFactory.canUserManageTeam(team, principal);

        return cloudSubscriptionRepository.findByTeam(team);
    }

    public List<GetCloudSubscriptionsResponseDto> getCloudSubscriptionResponseDtos(Principal principal) {
        UserInfo userInfo = findUserService.findUser(principal.getName());
        List<Team> userTeams = userInfo.getHighestRole().equals("ADMIN")
                ? findTeamService.findAll()
                : new ArrayList<>(userInfo.getTeams());

        return cloudSubscriptionRepository.findCloudSubscriptionDtosByTeamIn(userTeams);
    }

    public CloudSubscription findById(Long id, Principal principal) {
        UserInfo userInfo = findUserService.findUser(principal.getName());
        List<Team> userTeams;
        if (userInfo.getHighestRole().equals("ADMIN")){
            userTeams = findTeamService.findAll();
        } else {
            userTeams = userInfo.getTeams().stream().toList();
        }
        Optional<CloudSubscription> cloudSubscription = cloudSubscriptionRepository.findByIdAndTeamIn(id, userTeams);
        return cloudSubscription.orElseThrow();
    }

    public Iterable<CloudSubscription> findAll(){
        return cloudSubscriptionRepository.findAll();
    }

    public List<CloudSubscription> findByTeam(Team team){
        return cloudSubscriptionRepository.findByTeam(team);
    }

    public Optional<CloudSubscription> findById(long id) {
        return cloudSubscriptionRepository.findById(id);
    }
}
