package io.mixeway.mixewayflowapi.utils;

import io.mixeway.mixewayflowapi.config.AppConfigService;
import io.mixeway.mixewayflowapi.db.entity.*;
import io.mixeway.mixewayflowapi.db.repository.TeamRepository;
import io.mixeway.mixewayflowapi.domain.organization.OrganizationService;
import io.mixeway.mixewayflowapi.domain.roles.FindRoleService;
import io.mixeway.mixewayflowapi.domain.user.FindUserService;
import io.mixeway.mixewayflowapi.exceptions.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.data.domain.Page;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class PermissionFactory {
    private final FindUserService findUserService;
    private final FindRoleService findRoleService;
    private final TeamRepository teamRepository;
    private final AppConfigService appConfigService;
    private final OrganizationService organizationService;


    public List<Team> findTeams(Principal principal) {
        UserInfo userInfo = findUserService.findUser(principal.getName());
        UserRole adminRole = findRoleService.findUserRole("ADMIN");

        // In SaaS mode, admins only see teams from their organizations
        if (appConfigService.isSaasMode()) {
            if (userInfo.getRoles().contains(adminRole)) {
                // Get all organizations for this admin
                List<Organization> userOrgs = organizationService.getUserOrganizations(userInfo.getId());

                if (!userOrgs.isEmpty()) {
                    List<Team> orgTeams = new ArrayList<>();

                    for (Organization org : userOrgs) {
                        orgTeams.addAll(teamRepository.findByOrganizationId(org.getId()));
                    }

                    return orgTeams;
                } else {
                    // No organizations, no teams
                    return List.of();
                }
            } else {
                // Regular users only see teams they belong to
                return userInfo.getTeams().stream().toList();
            }
        } else {
            // STANDALONE mode - existing logic
            if (userInfo.getRoles().contains(adminRole)) {
                return teamRepository.findAll();
            } else {
                return userInfo.getTeams().stream().toList();
            }
        }
    }

    public Page<Team> findTeams(Principal principal, Pageable pageable) {
        UserInfo userInfo = findUserService.findUser(principal.getName());
        if (userInfo.getHighestRole().equals("ADMIN")) {
            return teamRepository.findAllPageable(pageable);
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
        UserRole adminRole = findRoleService.findUserRole("ADMIN");

        // In SaaS mode, check organization boundaries
        if (appConfigService.isSaasMode()) {
            if (!userInfo.getRoles().contains(adminRole) ||
                    (team.getOrganization() != null &&
                            !userInfo.getOrganizations().contains(team.getOrganization()))) {
                throw new UnauthorizedException();
            }
        } else {
            // STANDALONE mode - existing logic
            if (!userInfo.getRoles().contains(adminRole) && !userInfo.getTeams().contains(team)) {
                throw new UnauthorizedException();
            }
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

    public void validateOrganizationAccess(Organization organization, Principal principal) {
        UserInfo user = findUserService.findUser(principal.getName());
        boolean isAdmin = "ADMIN".equals(user.getHighestRole());
        boolean isMemberOfOrg = user.getOrganizations().contains(organization);

        if (!isAdmin && !isMemberOfOrg) {
            throw new UnauthorizedException();
        }
    }

    public void validateResourceAccess(Object resource, Principal principal) {
        UserInfo user = findUserService.findUser(principal.getName());

        if (resource instanceof CodeRepo) {
            CodeRepo repo = (CodeRepo) resource;
            Team team = repo.getTeam();
            Organization org = team.getOrganization();

            boolean isAdmin = "ADMIN".equals(user.getHighestRole());
            boolean isTeamMember = user.getTeams().contains(team);
            boolean isOrgMember = user.getOrganizations().contains(org);

            if (!isAdmin && !isTeamMember && !isOrgMember) {
                throw new UnauthorizedException();
            }
        }

        // Similar validation for other resource types
    }

}
