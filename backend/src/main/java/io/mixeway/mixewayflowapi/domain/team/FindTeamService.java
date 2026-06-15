package io.mixeway.mixewayflowapi.domain.team;

import io.mixeway.mixewayflowapi.api.team.dto.SimpleUserDto;
import io.mixeway.mixewayflowapi.api.team.dto.TeamDto;
import io.mixeway.mixewayflowapi.api.team.dto.TeamIdDto;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import io.mixeway.mixewayflowapi.db.repository.TeamRepository;
import io.mixeway.mixewayflowapi.db.repository.UserRepository;
import io.mixeway.mixewayflowapi.utils.PermissionFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
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

    public Page<TeamDto> findAllTeams(Principal principal, Pageable pageable) {
        List<Team> allTeams = permissionFactory.findTeams(principal);

        int pageSize = pageable.getPageSize();
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageSize, allTeams.size());

        if (start >= allTeams.size()) {
            return new PageImpl<>(Collections.emptyList(), pageable, allTeams.size());
        }

        List<TeamDto> pagedDtos = new ArrayList<>();
        for (Team team : allTeams.subList(start, end)) {
            List<SimpleUserDto> simpleUserDtos = new ArrayList<>();
            for (UserInfo userInfo : userRepository.getUsersByTeamId(team.getId())) {
                simpleUserDtos.add(SimpleUserDto.builder()
                        .id(userInfo.getId())
                        .username(userInfo.getUsername())
                        .build());
            }
            pagedDtos.add(TeamDto.builder()
                    .name(team.getName())
                    .id(team.getId())
                    .remoteIdentifier(team.getRemoteIdentifier())
                    .users(simpleUserDtos)
                    .build());
        }

        return new PageImpl<>(pagedDtos, pageable, allTeams.size());
    }

    public Page<TeamIdDto> findAllTeamsIds(Principal principal, Pageable pageable) {
        Page<Team> teams = permissionFactory.findTeams(principal, pageable);

        return teams.map(team -> TeamIdDto.builder()
                .remoteIdentifier(team.getRemoteIdentifier())
                .build());
    }

    public TeamDto findTeamById(Long teamId, Principal principal) {
        Optional<Team> teamOptional = permissionFactory.findById(teamId, principal);
        if (teamOptional.isEmpty()) {
            return null;
        }

        Team team = teamOptional.get();
        List<SimpleUserDto> simpleUserDtos = new ArrayList<>();
        for (UserInfo userInfo : userRepository.getUsersByTeamId(team.getId())) {
            simpleUserDtos.add(SimpleUserDto.builder()
                    .id(userInfo.getId())
                    .username(userInfo.getUsername())
                    .build());
        }

        return TeamDto.builder()
                .name(team.getName())
                .id(team.getId())
                .remoteIdentifier(team.getRemoteIdentifier())
                .users(simpleUserDtos)
                .build();
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
    // Add this method to your FindTeamService class
    public List<Team> findByOrganizationId(Long organizationId) {
        return teamRepository.findByOrganizationId(organizationId);
    }

    public Optional<Team> findByRepoUrl(String repoUrl) {
        return teamRepository.findByRepoUrl(repoUrl);
    }
}
