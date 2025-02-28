package io.mixeway.mixewayflowapi.api.teamfindings.service;

import io.mixeway.mixewayflowapi.db.entity.*;
import io.mixeway.mixewayflowapi.domain.cloudsubscription.FindCloudSubscriptionService;
import io.mixeway.mixewayflowapi.domain.cloudsubscriptionfindingstats.FindCloudSubscriptionFindingStatsService;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.coderepofindingstats.FindCodeRepoFindingStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class TeamStatisticService {

    private final FindCodeRepoService findCodeRepoService;
    private final FindCodeRepoFindingStatsService findCodeRepoFindingStatsService;
    private final FindCloudSubscriptionService findCloudSubscriptionService;
    private final FindCloudSubscriptionFindingStatsService findCloudSubscriptionFindingStatsService;

    @Autowired
    public TeamStatisticService(FindCloudSubscriptionService findCloudSubscriptionService, FindCloudSubscriptionFindingStatsService findCloudSubscriptionFindingStatsService, FindCodeRepoService findCodeRepoService, FindCodeRepoFindingStatsService findCodeRepoFindingStatsService) {
        this.findCodeRepoService = findCodeRepoService;
        this.findCodeRepoFindingStatsService = findCodeRepoFindingStatsService;
        this.findCloudSubscriptionService = findCloudSubscriptionService;
        this.findCloudSubscriptionFindingStatsService = findCloudSubscriptionFindingStatsService;
    }
    public List<Object> getTeamFindingStats(Long id, Principal principal) {
        // Fetch all CloudSubscriptions and CodeRepos for the team
        List<CloudSubscription> cloudSubscriptions = findCloudSubscriptionService.getByTeam(id, principal);
        List<CodeRepo> codeRepos = findCodeRepoService.getByTeam(id, principal);

        // Fetch stats for each CloudSubscription
        List<CloudSubscriptionFindingStats> cloudStats = cloudSubscriptions.stream()
                .flatMap(subscription -> findCloudSubscriptionFindingStatsService.getStatsForCloudSubscription(subscription).stream())
                .collect(Collectors.toList());

        // Fetch stats for each CodeRepo
        List<CodeRepoFindingStats> codeRepoStats = codeRepos.stream()
                .flatMap(repo -> findCodeRepoFindingStatsService.getStatsForRepo(repo).stream())
                .collect(Collectors.toList());

        // Combine both stats into a single list
        List<Object> combinedStats = new ArrayList<>();
        combinedStats.addAll(cloudStats);
        combinedStats.addAll(codeRepoStats);

        return combinedStats;
    }
}
