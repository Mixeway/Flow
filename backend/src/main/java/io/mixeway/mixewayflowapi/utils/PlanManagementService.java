package io.mixeway.mixewayflowapi.utils;

import io.mixeway.mixewayflowapi.db.entity.Organization;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoRepository;
import io.mixeway.mixewayflowapi.db.repository.TeamRepository;
import io.mixeway.mixewayflowapi.exceptions.QuotaExceededException;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class PlanManagementService {
    // Plan configuration with repositories, teams, and users limits
    private static final Map<Organization.PlanType, PlanLimits> PLAN_LIMITS = Map.of(
            Organization.PlanType.FREE, new PlanLimits(5, 1, 1),
            Organization.PlanType.SMALL_COMPANY, new PlanLimits(20, 5, 10),
            Organization.PlanType.ENTERPRISE, new PlanLimits(9999, 9999, 9999)
    );

    private final CodeRepoRepository codeRepoRepository;
    private final TeamRepository teamRepository;

    public void validateRepositoryAddition(Long teamId, Organization organization) {
        PlanLimits limits = PLAN_LIMITS.get(organization.getPlanType());
        long repoCount = codeRepoRepository.countByTeam(teamRepository.findById(teamId).get());

        if (repoCount >= limits.getMaxRepositories()) {
            throw new QuotaExceededException(
                    "Repository limit reached. Please upgrade your plan to add more repositories.");
        }
    }

    // Other validation methods for teams, users, etc.
}

@Data
@AllArgsConstructor
class PlanLimits {
    private int maxRepositories;
    private int maxTeams;
    private int maxUsers;
}
