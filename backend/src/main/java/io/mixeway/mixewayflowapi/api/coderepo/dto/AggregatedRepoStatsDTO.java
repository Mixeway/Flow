package io.mixeway.mixewayflowapi.api.coderepo.dto;

import lombok.Data;

import java.util.List;

@Data
public class AggregatedRepoStatsDTO {

    private final List<DailyFindings> activeFindings;
    private final List<DailyFindings> removedFindingsList;
    private final List<DailyFindings> reviewedFindingsList;
    private final List<DailyFindings> averageFixTimeList;

}