package io.mixeway.mixewayflowapi.api.user.service;

import io.mixeway.mixewayflowapi.api.user.dto.*;
import io.mixeway.mixewayflowapi.api.user.dto.AppModeInfoDto;
import io.mixeway.mixewayflowapi.config.AppConfigService;
import io.mixeway.mixewayflowapi.db.entity.Organization;
import io.mixeway.mixewayflowapi.db.entity.PlanLimits;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import io.mixeway.mixewayflowapi.db.repository.PlanLimitsRepository;
import io.mixeway.mixewayflowapi.domain.organization.OrganizationService;
import io.mixeway.mixewayflowapi.domain.user.FindUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
public class AppModeInfoService {
    private final AppConfigService appConfigService;
    private final FindUserService findUserService;
    private final OrganizationService organizationService;
    private final PlanLimitsRepository planLimitsRepository;

    public AppModeInfoDto getAppModeInfo(Principal principal) {
        AppConfigService.RunMode runMode = appConfigService.getRunMode();

        AppModeInfoDto.AppModeInfoDtoBuilder builder = AppModeInfoDto.builder()
                .mode(runMode.name());

        // If in SaaS mode, add quota information
        if (runMode == AppConfigService.RunMode.SAAS) {
            UserQuotaInfoDto quotaInfo = getUserQuotaInfo(principal);
            builder.quotaInfo(quotaInfo);
        }

        return builder.build();
    }

    private UserQuotaInfoDto getUserQuotaInfo(Principal principal) {
        // Get user
        UserInfo user = findUserService.findUser(principal.getName());

        // Get user's primary organization (first one for simplicity)
        Optional<Organization> orgOpt = organizationService.getDefaultOrganization(user.getId());

        if (orgOpt.isEmpty()) {
            log.warn("User {} has no organization in SaaS mode", user.getUsername());
            return null;
        }

        Organization organization = orgOpt.get();
        String planType = organization.getPlanType().name();

        // Get plan limits
        Optional<PlanLimits> planLimitsOpt = planLimitsRepository.findByPlanType(planType);

        if (planLimitsOpt.isEmpty()) {
            log.warn("No plan limits found for plan type {}", planType);
            return null;
        }

        PlanLimits planLimits = planLimitsOpt.get();

        // Calculate usage
        int teamsCount = organization.getTeams().size();
        int totalReposCount = organizationService.countRepositoriesByOrganizationId(organization.getId());
        int usersCount = organization.getUsers().size();

        // Calculate max values
        int maxTeams = planLimits.getMaxTeams();
        int maxReposPerTeam = planLimits.getMaxReposPerTeam();
        int maxTotalRepos = maxTeams * maxReposPerTeam;

        // Calculate percentages
        double teamUsagePercentage = maxTeams > 0 ? (double) teamsCount / maxTeams * 100 : 0;
        double repoUsagePercentage = maxTotalRepos > 0 ? (double) totalReposCount / maxTotalRepos * 100 : 0;

        return UserQuotaInfoDto.builder()
                .planType(planType)
                .organizationName(organization.getName())
                .organizationId(organization.getId())
                .limits(QuotaLimitsDto.builder()
                        .maxTeams(maxTeams)
                        .maxReposPerTeam(maxReposPerTeam)
                        .maxUsersPerTeam(planLimits.getMaxUsersPerTeam())
                        .maxTotalRepos(maxTotalRepos)
                        .build())
                .usage(QuotaUsageDto.builder()
                        .teamsCount(teamsCount)
                        .totalReposCount(totalReposCount)
                        .usersCount(usersCount)
                        .teamUsagePercentage(teamUsagePercentage)
                        .repoUsagePercentage(repoUsagePercentage)
                        .build())
                .build();
    }
}
