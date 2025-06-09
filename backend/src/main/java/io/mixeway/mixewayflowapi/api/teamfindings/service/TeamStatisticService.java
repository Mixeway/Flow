package io.mixeway.mixewayflowapi.api.teamfindings.service;

import io.mixeway.mixewayflowapi.api.teamfindings.dto.CombinedDailyStatsDto;
import io.mixeway.mixewayflowapi.api.teamfindings.dto.DailyCloudSubscriptionsStatsDto;
import io.mixeway.mixewayflowapi.api.teamfindings.dto.DailyCodeReposStatsDto;
import io.mixeway.mixewayflowapi.api.teamfindings.dto.TeamVulnStatsResponseDto;
import io.mixeway.mixewayflowapi.db.entity.*;
import io.mixeway.mixewayflowapi.db.repository.CloudSubscriptionFindingStatsRepository;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoFindingStatsRepository;
import io.mixeway.mixewayflowapi.domain.cloudsubscription.FindCloudSubscriptionService;
import io.mixeway.mixewayflowapi.domain.cloudsubscriptionfindingstats.FindCloudSubscriptionFindingStatsService;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.coderepofindingstats.FindCodeRepoFindingStatsService;
import io.mixeway.mixewayflowapi.domain.finding.FindFindingService;
import io.mixeway.mixewayflowapi.integrations.repo.apiclient.GitLabApiClientService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Log4j2
@Service
@RequiredArgsConstructor
public class TeamStatisticService {

    private final FindCodeRepoService findCodeRepoService;
    private final FindCodeRepoFindingStatsService findCodeRepoFindingStatsService;
    private final FindCloudSubscriptionService findCloudSubscriptionService;
    private final FindCloudSubscriptionFindingStatsService findCloudSubscriptionFindingStatsService;
    private final FindFindingService findFindingService;
    private final CodeRepoFindingStatsRepository codeRepoFindingStatsRepository;
    private final CloudSubscriptionFindingStatsRepository cloudSubscriptionFindingStatsRepository;
    private GitLabApiClientService gitLabApiClientService;

    @Autowired
    public TeamStatisticService(FindCloudSubscriptionService findCloudSubscriptionService, FindCloudSubscriptionFindingStatsService findCloudSubscriptionFindingStatsService, FindCodeRepoService findCodeRepoService, FindCodeRepoFindingStatsService findCodeRepoFindingStatsService, FindFindingService findFindingService, CodeRepoFindingStatsRepository codeRepoFindingStatsRepository, CloudSubscriptionFindingStatsRepository cloudSubscriptionFindingStatsRepository, GitLabApiClientService gitLabApiClientService) {
        this.findCodeRepoService = findCodeRepoService;
        this.findCodeRepoFindingStatsService = findCodeRepoFindingStatsService;
        this.findCloudSubscriptionService = findCloudSubscriptionService;
        this.findCloudSubscriptionFindingStatsService = findCloudSubscriptionFindingStatsService;
        this.findFindingService = findFindingService;
        this.codeRepoFindingStatsRepository = codeRepoFindingStatsRepository;
        this.cloudSubscriptionFindingStatsRepository = cloudSubscriptionFindingStatsRepository;
        this.gitLabApiClientService = gitLabApiClientService;
    }

    public CombinedDailyStatsDto getTeamFindingStats(Long id, Principal principal) {
        List<CodeRepo> codeRepos = findCodeRepoService.getByTeam(id, principal);
        List<CloudSubscription> cloudSubscriptions = findCloudSubscriptionService.getByTeam(id, principal);

        List<CodeRepoFindingStats> codeReposStats = new ArrayList<>();
        for (CodeRepo codeRepo : codeRepos) {
            codeReposStats.addAll(codeRepoFindingStatsRepository.findTop14ByCodeRepoOrderByDateInsertedDesc(codeRepo));
        }

        List<CloudSubscriptionFindingStats> cloudSubscriptionsStats = new ArrayList<>();
        for (CloudSubscription cloudSubscription : cloudSubscriptions) {
            cloudSubscriptionsStats.addAll(cloudSubscriptionFindingStatsRepository.findTop14ByCloudSubscriptionOrderByDateInsertedDesc(cloudSubscription));
        }

        List<DailyCodeReposStatsDto> aggregatedDailyCodeReposStats = aggregateDailyCodeReposStats(codeReposStats);
        List<DailyCloudSubscriptionsStatsDto> aggregatedDailyCloudSubscriptionsStats = aggregateDailyCloudSubscriptionsStats(cloudSubscriptionsStats);

        return new CombinedDailyStatsDto(aggregatedDailyCodeReposStats, aggregatedDailyCloudSubscriptionsStats);
    }

    public List<DailyCodeReposStatsDto> aggregateDailyCodeReposStats(List<CodeRepoFindingStats> stats) {
        return stats.stream()
                .collect(Collectors.groupingBy(
                        stat -> stat.getDateInserted().toLocalDate(), // Group by date
                        Collectors.toList()
                ))
                .entrySet()
                .stream()
                .map(entry -> {
                    LocalDate date = entry.getKey();
                    List<CodeRepoFindingStats> dailyStats = entry.getValue();

                    // Aggregate sums for all attributes
                    int sastCritical = dailyStats.stream().mapToInt(CodeRepoFindingStats::getSastCritical).sum();
                    int sastHigh = dailyStats.stream().mapToInt(CodeRepoFindingStats::getSastHigh).sum();
                    int sastMedium = dailyStats.stream().mapToInt(CodeRepoFindingStats::getSastMedium).sum();
                    int sastRest = dailyStats.stream().mapToInt(CodeRepoFindingStats::getSastRest).sum();
                    int scaCritical = dailyStats.stream().mapToInt(CodeRepoFindingStats::getScaCritical).sum();
                    int scaHigh = dailyStats.stream().mapToInt(CodeRepoFindingStats::getScaHigh).sum();
                    int scaMedium = dailyStats.stream().mapToInt(CodeRepoFindingStats::getScaMedium).sum();
                    int scaRest = dailyStats.stream().mapToInt(CodeRepoFindingStats::getScaRest).sum();
                    int iacCritical = dailyStats.stream().mapToInt(CodeRepoFindingStats::getIacCritical).sum();
                    int iacHigh = dailyStats.stream().mapToInt(CodeRepoFindingStats::getIacHigh).sum();
                    int iacMedium = dailyStats.stream().mapToInt(CodeRepoFindingStats::getIacMedium).sum();
                    int iacRest = dailyStats.stream().mapToInt(CodeRepoFindingStats::getIacRest).sum();
                    int secretsCritical = dailyStats.stream().mapToInt(CodeRepoFindingStats::getSecretsCritical).sum();
                    int secretsHigh = dailyStats.stream().mapToInt(CodeRepoFindingStats::getSecretsHigh).sum();
                    int secretsMedium = dailyStats.stream().mapToInt(CodeRepoFindingStats::getSecretsMedium).sum();
                    int secretsRest = dailyStats.stream().mapToInt(CodeRepoFindingStats::getSecretsRest).sum();
                    int gitlabCritical = dailyStats.stream().mapToInt(CodeRepoFindingStats::getGitlabCritical).sum();
                    int gitlabHigh = dailyStats.stream().mapToInt(CodeRepoFindingStats::getGitlabHigh).sum();
                    int gitlabMedium = dailyStats.stream().mapToInt(CodeRepoFindingStats::getGitlabMedium).sum();
                    int gitlabRest = dailyStats.stream().mapToInt(CodeRepoFindingStats::getGitlabRest).sum();
                    int openedFindings = dailyStats.stream().mapToInt(CodeRepoFindingStats::getOpenedFindings).sum();
                    int removedFindings = dailyStats.stream().mapToInt(CodeRepoFindingStats::getRemovedFindings).sum();
                    int reviewedFindings = dailyStats.stream().mapToInt(CodeRepoFindingStats::getReviewedFindings).sum();

                    // Calculate averageFixTime
                    double averageFixTime = dailyStats.stream()
                            .mapToDouble(CodeRepoFindingStats::getAverageFixTime)
                            .average()
                            .orElse(0);

                    // Create a new aggregated object
                    return new DailyCodeReposStatsDto(
                            date,
                            sastCritical, sastHigh, sastMedium, sastRest,
                            scaCritical, scaHigh, scaMedium, scaRest,
                            iacCritical, iacHigh, iacMedium, iacRest,
                            secretsCritical, secretsHigh, secretsMedium, secretsRest,
                            gitlabCritical, gitlabHigh, gitlabMedium, gitlabRest,
                            openedFindings, removedFindings, reviewedFindings,
                            averageFixTime
                    );
                })
                .collect(Collectors.toList());
    }

    public List<DailyCloudSubscriptionsStatsDto> aggregateDailyCloudSubscriptionsStats(List<CloudSubscriptionFindingStats> stats) {
        return stats.stream()
                .collect(Collectors.groupingBy(
                        stat -> stat.getDateInserted().toLocalDate(), // Group by date
                        Collectors.toList()
                ))
                .entrySet()
                .stream()
                .map(entry -> {
                    LocalDate date = entry.getKey();
                    List<CloudSubscriptionFindingStats> dailyStats = entry.getValue();

                    // Aggregate sums for all attributes
                    int criticalFindings = dailyStats.stream().mapToInt(CloudSubscriptionFindingStats::getCriticalFindings).sum();
                    int highFindings = dailyStats.stream().mapToInt(CloudSubscriptionFindingStats::getHighFindings).sum();
                    int openedFindings = dailyStats.stream().mapToInt(CloudSubscriptionFindingStats::getOpenedFindings).sum();
                    int removedFindings = dailyStats.stream().mapToInt(CloudSubscriptionFindingStats::getRemovedFindings).sum();

                    // Calculate averageFixTime
                    double averageFixTime = dailyStats.stream()
                            .mapToDouble(CloudSubscriptionFindingStats::getAverageFixTime)
                            .average()
                            .orElse(0);

                    // Create a new aggregated object
                    return new DailyCloudSubscriptionsStatsDto(
                            date, criticalFindings, highFindings,
                            openedFindings, removedFindings, averageFixTime
                    );
                })
                .collect(Collectors.toList());
    }

    public TeamVulnStatsResponseDto getFindingSourceStatsForTeam(Long id, Principal principal) {
        List<CodeRepo> codeRepos = findCodeRepoService.getByTeam(id, principal);

        List<CloudSubscription> cloudSubscriptions = findCloudSubscriptionService.getByTeam(id, principal);

        List<Long> codeRepoIds = codeRepos.stream().map(CodeRepo::getId).toList();
        List<Long> cloudSubscriptionIds = cloudSubscriptions.stream().map(CloudSubscription::getId).toList();

        return  findFindingService.countFindingStatsForTeam(codeRepoIds, cloudSubscriptionIds);
    }
}
