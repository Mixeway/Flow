package io.mixeway.mixewayflowapi.utils;

import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import io.mixeway.mixewayflowapi.db.entity.UserRole;
import io.mixeway.mixewayflowapi.db.repository.TeamRepository;
import io.mixeway.mixewayflowapi.domain.roles.FindRoleService;
import io.mixeway.mixewayflowapi.domain.user.FindUserService;
import io.mixeway.mixewayflowapi.exceptions.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.security.Principal;
import java.util.List;

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

    public void canUserManageTeam(Team team, Principal principal) {
        if (!findUserService.findUser(principal.getName()).getTeams().contains(team)) {
            throw new UnauthorizedException();
        }
    }
}
