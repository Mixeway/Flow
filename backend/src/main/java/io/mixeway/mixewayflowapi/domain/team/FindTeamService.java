package io.mixeway.mixewayflowapi.domain.team;

import io.mixeway.mixewayflowapi.api.team.dto.SimpleUserDto;
import io.mixeway.mixewayflowapi.api.team.dto.TeamDto;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import io.mixeway.mixewayflowapi.db.repository.TeamRepository;
import io.mixeway.mixewayflowapi.db.repository.UserRepository;
import io.mixeway.mixewayflowapi.utils.PermissionFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class FindTeamService {
    private final UserRepository userRepository;
    private final PermissionFactory permissionFactory;
    private final TeamRepository teamRepository;



    public List<TeamDto> findAllTeams(Principal principal){
        List<TeamDto> teamDtos = new ArrayList<>();
        for (Team team : permissionFactory.findTeams(principal)){
            List<SimpleUserDto> simpleUserDtos = new ArrayList<>();
            for (UserInfo userInfo : userRepository.getUsersByTeamId(team.getId())){
                simpleUserDtos.add(SimpleUserDto.builder()
                                .id(userInfo.getId())
                                .username(userInfo.getUsername())
                        .build());
            }
            teamDtos.add(TeamDto.builder()
                    .name(team.getName())
                    .id(team.getId())
                    .remoteIdentifier(team.getRemoteIdentifier())
                    .users(simpleUserDtos)
                    .build());
        }
        return  teamDtos;
    }

    public Optional<Team> findById(Long id) {
        return teamRepository.findById(id);
    }
    public List<Team> findAll(){
        return teamRepository.findAll();
    }

    public List<Team> findByRemoteId(String remoteId) {
        return teamRepository.findByRemoteIdentifier(remoteId);
    }
}
