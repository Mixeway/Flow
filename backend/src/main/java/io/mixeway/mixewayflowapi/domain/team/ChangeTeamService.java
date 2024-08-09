package io.mixeway.mixewayflowapi.domain.team;

import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import io.mixeway.mixewayflowapi.db.repository.TeamRepository;
import io.mixeway.mixewayflowapi.db.repository.UserRepository;
import io.mixeway.mixewayflowapi.utils.PermissionFactory;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
public class ChangeTeamService {
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final PermissionFactory permissionFactory;

    @Transactional
    public void modifyTeamAccess(long teamId, List<Long> usernames, Principal principal) {
        Optional<Team> optionalTeam = teamRepository.findById(teamId);
        if (optionalTeam.isPresent()) {
            permissionFactory.canUserManageTeam(optionalTeam.get(), principal);

            Team team = optionalTeam.get();
            for (Long username : usernames) {
                Optional<UserInfo> optionalUser = userRepository.findById(username);
                if (optionalUser.isPresent()) {
                    if (!optionalUser.get().getTeams().contains(team)) {
                        optionalUser.get().getTeams().add(team);
                        userRepository.save(optionalUser.get());
                        log.info("[Team] User {}, adds {} to the team {}", principal.getName(), optionalUser.get().getUsername(), team.getName());
                    }
                }
            }
        }
    }
}
