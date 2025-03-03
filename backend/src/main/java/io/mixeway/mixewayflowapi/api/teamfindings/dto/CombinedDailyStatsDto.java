package io.mixeway.mixewayflowapi.api.teamfindings.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CombinedDailyStatsDto {
    private List<DailyCodeReposStatsDto> codeReposStats;
    private List<DailyCloudSubscriptionsStatsDto> cloudSubscriptionsStats;

    public CombinedDailyStatsDto(List<DailyCodeReposStatsDto> codeReposStats, List<DailyCloudSubscriptionsStatsDto> cloudSubscriptionsStats) {
        this.codeReposStats = codeReposStats;
        this.cloudSubscriptionsStats = cloudSubscriptionsStats;
    }
}