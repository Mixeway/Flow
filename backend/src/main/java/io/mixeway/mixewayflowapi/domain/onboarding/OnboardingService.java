package io.mixeway.mixewayflowapi.domain.onboarding;

import io.mixeway.mixewayflowapi.db.entity.Organization;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import io.mixeway.mixewayflowapi.db.entity.UserRole;
import io.mixeway.mixewayflowapi.db.repository.TeamRepository;
import io.mixeway.mixewayflowapi.db.repository.UserRepository;
import io.mixeway.mixewayflowapi.domain.organization.OrganizationService;
import io.mixeway.mixewayflowapi.domain.roles.FindRoleService;
import io.mixeway.mixewayflowapi.exceptions.TeamAlreadyExistsException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Log4j2
public class OnboardingService {
    private final OrganizationService organizationService;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final FindRoleService findRoleService;

    @Transactional
    public void onboardFreePlanUser(UserInfo user) {
        log.info("[Onboarding] Starting free plan onboarding for user {}", user.getUsername());

        // Create a new organization with FREE plan
        Organization organization = organizationService.createOrganization(
                user.getUsername() + "-org", Organization.PlanType.FREE);

        // Add user to the organization
        organization.addUser(user);
        user.assignToOrganization(organization);

        // Create a default team for the user
        try {
            Team team = new Team(user.getUsername() + "'s Team", null, organization);
            team = teamRepository.save(team);

            // Assign user to the team
            user.assignToTeam(team);
            userRepository.save(user);

            log.info("[Onboarding] Completed free plan onboarding for user {}", user.getUsername());
        } catch (Exception e) {
            log.error("[Onboarding] Failed to create default team for user {}: {}", user.getUsername(), e.getMessage());
            throw e;
        }
    }

    @Transactional
    public void onboardEnterpriseOrSmallCompanyUser(String username, Organization.PlanType planType, String organizationName) {
        log.info("[Onboarding] Starting {} plan onboarding for user {}", planType, username);

        UserInfo userOpt = userRepository.findByUsername(username);

        if (userOpt!=null) {

            // Create a new organization with the specified plan
            Organization organization = organizationService.createOrganization(organizationName, planType);

            // Add user to the organization
            organization.addUser(userOpt);
            userOpt.assignToOrganization(organization);

            // Assign TEAM_MANAGER role to the user if they don't already have it
            UserRole teamManagerRole = findRoleService.findUserRole("TEAM_MANAGER");
            if (!userOpt.getRoles().contains(teamManagerRole)) {
                Set<UserRole> roles = new HashSet<>(userOpt.getRoles());
                roles.add(teamManagerRole);
                userOpt.assignRoles(roles);
            }

            // Create a default team for the user
            try {
                Team team = new Team("Default Team", null, organization);
                team = teamRepository.save(team);

                // Assign user to the team
                userOpt.assignToTeam(team);
                userRepository.save(userOpt);

                log.info("[Onboarding] Completed {} plan onboarding for user {}", planType, username);
            } catch (Exception e) {
                log.error("[Onboarding] Failed to create default team for user {}: {}", username, e.getMessage());
                throw e;
            }
        } else {
            log.error("[Onboarding] User {} not found for onboarding", username);
            throw new IllegalArgumentException("User not found");
        }
    }
}