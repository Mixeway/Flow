package io.mixeway.mixewayflowapi.domain.team;

import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import io.mixeway.mixewayflowapi.db.repository.TeamRepository;
import io.mixeway.mixewayflowapi.db.repository.UserRepository;
import io.mixeway.mixewayflowapi.exceptions.TeamAlreadyExistsException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CreateTeamService {
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;

    @Transactional
    public Team createTeam(String name, String remoteIdentifier, List<Long> usernames, Principal principal) {
        UserInfo userInfo = userRepository.findByUsername(principal.getName());
        if (usernames == null){
            usernames = new ArrayList<>();
        }
        usernames.add(userInfo.getId());
        if (teamRepository.findByName(name).isPresent()){
            throw new TeamAlreadyExistsException();
        }

        Team team = new Team(name, remoteIdentifier);
        team = teamRepository.save(team);

        for (Long username : usernames) {
            Optional<UserInfo> optionalUser = userRepository.findById(username);
            if (optionalUser.isPresent()) {
                optionalUser.get().getTeams().add(team);
                userRepository.save(optionalUser.get());
            }
        }

        return team;
    }
}
