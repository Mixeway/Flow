// OrganizationApiService.java
package io.mixeway.mixewayflowapi.api.organization.service;

import io.mixeway.mixewayflowapi.api.organization.dto.*;
import io.mixeway.mixewayflowapi.db.entity.Organization;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import io.mixeway.mixewayflowapi.db.repository.OrganizationRepository;
import io.mixeway.mixewayflowapi.domain.organization.OrganizationService;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import io.mixeway.mixewayflowapi.domain.user.FindUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class OrganizationApiService {
    private final OrganizationService organizationService;
    private final FindTeamService findTeamService;
    private final FindUserService findUserService;
    private final OrganizationRepository organizationRepository;

    public List<OrganizationDto> getAllOrganizations() {
        return organizationService.findAll().stream()
                .map(this::mapToOrganizationDto)
                .collect(Collectors.toList());
    }

    public OrganizationDto getOrganization(Long id) {
        Organization organization = organizationService.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Organization not found"));

        return mapToOrganizationDto(organization);
    }

    public void createOrganization(OrganizationCreateRequestDto requestDto) {
        try {
            // Check if user exists
            UserInfo adminUser = findUserService.findById(requestDto.getAdminUserId())
                    .orElseThrow(() -> new IllegalArgumentException("Admin user not found"));

            // Create organization
            Organization.PlanType planType = Organization.PlanType.valueOf(requestDto.getPlanType());
            Organization organization = organizationService.createOrganization(requestDto.getName(), planType);
            organization = organizationRepository.save(organization);

            // Set active status
            organization.setActive(requestDto.isActive());
            organizationRepository.save(organization);

            // Add admin user in a separate transaction
            organizationService.addUserToOrganization(organization.getId(), adminUser.getId());

            log.info("[OrganizationApiService] Created organization {} with plan {}", organization.getName(), planType);
        } catch (Exception e) {
            log.error("[OrganizationApiService] Error creating organization: {}", e.getMessage(), e);
            throw e;
        }
    }

    public void updateOrganization(OrganizationUpdateRequestDto requestDto) {
        // Check if organization exists
        Organization organization = organizationService.findById(requestDto.getId())
                .orElseThrow(() -> new IllegalArgumentException("Organization not found"));

        // Check if user exists
        UserInfo adminUser = findUserService.findById(requestDto.getAdminUserId())
                .orElseThrow(() -> new IllegalArgumentException("Admin user not found"));

        // Update organization
        organization.updatePlanType(Organization.PlanType.valueOf(requestDto.getPlanType()));
        organization.setActive(requestDto.isActive());

        // Update in repository
        organizationService.updateOrganization(organization);

        // Update admin user
        organizationService.updateOrganizationAdmin(organization.getId(), adminUser.getId());

        log.info("[OrganizationApiService] Updated organization {} with plan {}", organization.getName(), requestDto.getPlanType());
    }

    public void deleteOrganization(Long id) {
        // Check if organization exists
        Organization organization = organizationService.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Organization not found"));

        // Check if organization has resources
        if (organizationService.hasResources(id)) {
            throw new IllegalStateException("Cannot delete organization with existing resources");
        }

        // Delete organization
        organizationService.deleteOrganization(id);

        log.info("[OrganizationApiService] Deleted organization {}", organization.getName());
    }

    public List<TeamDto> getOrganizationTeams(Long id) {
        // Check if organization exists
        Organization organization = organizationService.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Organization not found"));

        // Get teams
        List<Team> teams = findTeamService.findByOrganizationId(id);

        // Map to DTOs
        return teams.stream()
                .map(team -> {
                    int repoCount = organizationService.countRepositoriesByTeamId(team.getId());
                    int userCount = organizationService.countUsersByTeamId(team.getId());

                    return TeamDto.builder()
                            .id(team.getId())
                            .name(team.getName())
                            .repoCount(repoCount)
                            .userCount(userCount)
                            .build();
                })
                .collect(Collectors.toList());
    }

    public List<UserDto> getOrganizationUsers(Long id) {
        // Check if organization exists
        Organization organization = organizationService.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Organization not found"));

        // Get users
        Set<UserInfo> users = organization.getUsers();

        // Map to DTOs
        return users.stream()
                .map(user -> UserDto.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .highestRole(user.getHighestRole())
                        .build())
                .collect(Collectors.toList());
    }

    public UserDto getOrganizationAdmin(Long id) {
        // Check if organization exists
        Organization organization = organizationService.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Organization not found"));

        // Find admin user (or any user with team manager role)
        Optional<UserInfo> adminUser = organization.getUsers().stream()
                .filter(user -> "ADMIN".equals(user.getHighestRole()) || "TEAM_MANAGER".equals(user.getHighestRole()))
                .findFirst();

        if (adminUser.isPresent()) {
            UserInfo user = adminUser.get();
            return UserDto.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .highestRole(user.getHighestRole())
                    .build();
        }

        return null;
    }

    private OrganizationDto mapToOrganizationDto(Organization organization) {
        int teamCount = organization.getTeams().size();
        int repoCount = organizationService.countRepositoriesByOrganizationId(organization.getId());
        int userCount = organization.getUsers().size();

        return OrganizationDto.builder()
                .id(organization.getId())
                .name(organization.getName())
                .planType(organization.getPlanType().name())
                .createdDate(organization.getCreatedDate())
                .active(organization.isActive())
                .teamCount(teamCount)
                .repoCount(repoCount)
                .userCount(userCount)
                .build();
    }
}