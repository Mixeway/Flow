package io.mixeway.mixewayflowapi.domain.organization;

import io.mixeway.mixewayflowapi.db.entity.*;
import io.mixeway.mixewayflowapi.db.repository.*;
import io.mixeway.mixewayflowapi.exceptions.QuotaExceededException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Log4j2
public class OrganizationService {
    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;
    private final PlanLimitsRepository planLimitsRepository;
    private final TeamRepository teamRepository;
    private final UserRoleRepository roleRepository;
    private final CodeRepoRepository codeRepoRepository;

    @Transactional
    public Organization createOrganization(String name, Organization.PlanType planType) {
        Organization organization = new Organization(name, planType);
        return organizationRepository.save(organization);
    }

    @Transactional
    public void addUserToOrganization(Long organizationId, Long userId) {
        Optional<Organization> orgOpt = organizationRepository.findById(organizationId);
        Optional<UserInfo> userOpt = userRepository.findById(userId);

        if (orgOpt.isPresent() && userOpt.isPresent()) {
            Organization organization = orgOpt.get();
            UserInfo user = userOpt.get();

            // Check if the relationship already exists by querying the database
            if (organizationRepository.existsRelationship(organizationId, userId)) {
                log.info("User {} is already in organization {}", user.getUsername(), organization.getName());
                return;
            }

            // Create the relationship using a SQL query approach that avoids Hibernate's collection management
            organizationRepository.createRelationship(organizationId, userId);

            log.info("Added user {} to organization {}", user.getUsername(), organization.getName());
        }
    }

    @Transactional
    public void changePlan(Long organizationId, Organization.PlanType newPlanType) {
        Optional<Organization> orgOpt = organizationRepository.findById(organizationId);

        if (orgOpt.isPresent()) {
            Organization organization = orgOpt.get();
            organization.updatePlanType(newPlanType);
            organizationRepository.save(organization);

            log.info("Changed plan for organization {} to {}", organization.getName(), newPlanType);
        }
    }

    public List<Organization> getUserOrganizations(Long userId) {
        return organizationRepository.findByUserId(userId);
    }

    public boolean canCreateTeam(Long organizationId) {
        Optional<Organization> orgOpt = organizationRepository.findById(organizationId);

        if (orgOpt.isPresent()) {
            Organization organization = orgOpt.get();

            // Get plan limits
            Optional<PlanLimits> planLimitsOpt = planLimitsRepository.findByPlanType(organization.getPlanType().name());

            if (planLimitsOpt.isPresent()) {
                PlanLimits planLimits = planLimitsOpt.get();

                // Count existing teams
                long teamCount = teamRepository.countByOrganizationId(organizationId);

                return teamCount < planLimits.getMaxTeams();
            }
        }

        return false;
    }

    public boolean canAddRepositoryToTeam(Long teamId) {
        Optional<Team> teamOpt = teamRepository.findById(teamId);

        if (teamOpt.isPresent()) {
            Team team = teamOpt.get();
            Organization organization = team.getOrganization();

            if (organization != null) {
                // Get plan limits
                Optional<PlanLimits> planLimitsOpt = planLimitsRepository.findByPlanType(organization.getPlanType().name());

                if (planLimitsOpt.isPresent()) {
                    PlanLimits planLimits = planLimitsOpt.get();

                    // Count existing repositories
                    long repoCount = teamRepository.countRepositoriesByTeamId(teamId);

                    return repoCount < planLimits.getMaxReposPerTeam();
                }
            }
        }

        return false;
    }

    @Transactional
    public void validateTeamCreation(Long organizationId) throws QuotaExceededException {
        if (!canCreateTeam(organizationId)) {
            Optional<Organization> orgOpt = organizationRepository.findById(organizationId);

            if (orgOpt.isPresent()) {
                Organization organization = orgOpt.get();
                Optional<PlanLimits> planLimitsOpt = planLimitsRepository.findByPlanType(organization.getPlanType().name());

                if (planLimitsOpt.isPresent()) {
                    PlanLimits planLimits = planLimitsOpt.get();
                    throw new QuotaExceededException("Cannot create more teams. Maximum allowed for " +
                            organization.getPlanType() + " plan is " + planLimits.getMaxTeams());
                }
            }

            throw new QuotaExceededException("Cannot create more teams. Plan limit exceeded.");
        }
    }

    @Transactional
    public void validateRepositoryAddition(Long teamId) throws QuotaExceededException {
        if (!canAddRepositoryToTeam(teamId)) {
            Optional<Team> teamOpt = teamRepository.findById(teamId);

            if (teamOpt.isPresent()) {
                Team team = teamOpt.get();
                Organization organization = team.getOrganization();

                if (organization != null) {
                    Optional<PlanLimits> planLimitsOpt = planLimitsRepository.findByPlanType(organization.getPlanType().name());

                    if (planLimitsOpt.isPresent()) {
                        PlanLimits planLimits = planLimitsOpt.get();
                        throw new QuotaExceededException("Cannot add more repositories to team. Maximum allowed for " +
                                organization.getPlanType() + " plan is " + planLimits.getMaxReposPerTeam() + " per team");
                    }
                }
            }

            throw new QuotaExceededException("Cannot add more repositories to team. Plan limit exceeded.");
        }
    }

    public Optional<Organization> getDefaultOrganization(Long userId) {
        List<Organization> userOrgs = getUserOrganizations(userId);

        if (!userOrgs.isEmpty()) {
            // Return the first organization (we can add logic later to mark one as default if needed)
            return Optional.of(userOrgs.get(0));
        }

        return Optional.empty();
    }
// OrganizationService.java
// Add these new methods to your existing OrganizationService class

    /**
     * Finds all organizations
     */
    public List<Organization> findAll() {
        return organizationRepository.findAll();
    }

    public Optional<Organization> findById(Long organizationId) {
        return organizationRepository.findById(organizationId);
    }
    /**
     * Updates an organization
     */
    @Transactional
    public void updateOrganization(Organization organization) {
        organizationRepository.save(organization);
    }

    /**
     * Updates the admin user for an organization
     */
    @Transactional
    public void updateOrganizationAdmin(Long organizationId, Long adminUserId) {
        Optional<Organization> orgOpt = organizationRepository.findById(organizationId);
        Optional<UserInfo> userOpt = userRepository.findById(adminUserId);

        if (orgOpt.isPresent() && userOpt.isPresent()) {
            Organization organization = orgOpt.get();
            UserInfo user = userOpt.get();

            // Ensure user is in the organization
            if (!organization.getUsers().contains(user)) {
                organization.addUser(user);
                user.assignToOrganization(organization);
                organizationRepository.save(organization);
                userRepository.save(user);
            }

            // Ensure user has team manager role
            if (!user.getRoles().stream().anyMatch(role -> "TEAM_MANAGER".equals(role.getName()) || "ADMIN".equals(role.getName()))) {
                Optional<UserRole> teamManagerRole = roleRepository.findByName("TEAM_MANAGER");
                if (teamManagerRole.isPresent()) {
                    Set<UserRole> roles = new HashSet<>(user.getRoles());
                    roles.add(teamManagerRole.get());
                    user.assignRoles(roles);
                    userRepository.save(user);
                }
            }
        }
    }

    /**
     * Checks if an organization has any resources (teams, repositories)
     */
    public boolean hasResources(Long organizationId) {
        // Check if organization has teams
        List<Team> teams = teamRepository.findByOrganizationId(organizationId);
        if (!teams.isEmpty()) {
            // Check if any team has repositories
            for (Team team : teams) {
                if (!codeRepoRepository.findByTeam(team).isEmpty()) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Deletes an organization
     */
    @Transactional
    public void deleteOrganization(Long organizationId) {
        Optional<Organization> orgOpt = organizationRepository.findById(organizationId);

        if (orgOpt.isPresent()) {
            Organization organization = orgOpt.get();

            // Remove user associations
            Set<UserInfo> users = new HashSet<>(organization.getUsers());
            for (UserInfo user : users) {
                user.getOrganizations().remove(organization);
                userRepository.save(user);
            }
            organization.getUsers().clear();

            // Remove team associations
            List<Team> teams = teamRepository.findByOrganizationId(organizationId);
            for (Team team : teams) {
                team.clearOrganization();
                teamRepository.save(team);
            }

            // Delete organization
            organizationRepository.delete(organization);
        }
    }

    /**
     * Counts repositories by organization ID
     */
    public int countRepositoriesByOrganizationId(Long organizationId) {
        List<Team> teams = teamRepository.findByOrganizationId(organizationId);
        int count = 0;

        for (Team team : teams) {
            count += codeRepoRepository.countByTeam(team);
        }

        return count;
    }

    /**
     * Counts repositories by team ID
     */
    public int countRepositoriesByTeamId(Long teamId) {
        Optional<Team> teamOpt = teamRepository.findById(teamId);

        if (teamOpt.isPresent()) {
            return codeRepoRepository.countByTeam(teamOpt.get());
        }

        return 0;
    }

    public int countUsersByTeamId(long id) {
        return userRepository.countUsersByTeamId(id);
    }
}