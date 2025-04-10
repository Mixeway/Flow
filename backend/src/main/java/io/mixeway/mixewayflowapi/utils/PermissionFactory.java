package io.mixeway.mixewayflowapi.utils;

import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import io.mixeway.mixewayflowapi.db.entity.UserRole;
import io.mixeway.mixewayflowapi.db.repository.TeamRepository;
import io.mixeway.mixewayflowapi.domain.roles.FindRoleService;
import io.mixeway.mixewayflowapi.domain.user.FindUserService;
import io.mixeway.mixewayflowapi.exceptions.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.data.domain.Page;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class PermissionFactory {
    private final FindUserService findUserService;
    private final FindRoleService findRoleService;
    private final TeamRepository teamRepository;

    public List<Team> findTeams(Principal principal){
        UserInfo userInfo = findUserService.findUser(principal.getName());
        UserRole userRole = findRoleService.findUserRole("USER");
        UserRole adminRole = findRoleService.findUserRole("ADMIN");
        UserRole teamManagerRole = findRoleService.findUserRole("TEAM_MANAGER");
        if (userInfo.getRoles().contains(adminRole)){
            return teamRepository.findAll();
        } else {
            return userInfo.getTeams().stream().toList();
        }
    }

    public Page<Team> findTeams(Principal principal, Pageable pageable) {
        UserInfo userInfo = findUserService.findUser(principal.getName());
        if (userInfo.getHighestRole().equals("ADMIN")) {
            return teamRepository.findAllWithPagination(pageable);
        }
        else throw new UnauthorizedException();
    }

    public Optional<Team> findById(Long teamId, Principal principal) {
        UserInfo userInfo = findUserService.findUser(principal.getName());
        Optional<Team> teamOptional = teamRepository.findById(teamId);

        if (teamOptional.isPresent() && (userInfo.getRoles().contains(findRoleService.findUserRole("ADMIN"))
                || userInfo.getTeams().contains(teamOptional.get()))) {
            return teamOptional;
        }
        return Optional.empty();
    }


    public void canUserManageTeam(Team team, Principal principal) {
        UserInfo userInfo = findUserService.findUser(principal.getName());
        if (!userInfo.getHighestRole().equals(Role.ADMIN) && !userInfo.getTeams().contains(team)) {
            throw new UnauthorizedException();
        }
    }
    public void canUserAccessTeam(Team team, Principal principal) {
        UserInfo userInfo = findUserService.findUser(principal.getName());
        UserRole adminRole = findRoleService.findUserRole("ADMIN");

        // Check if the user is an admin or belongs to the team
        if (!userInfo.getRoles().contains(adminRole) && !userInfo.getTeams().contains(team)) {
            throw new UnauthorizedException();
        }
    }


}
