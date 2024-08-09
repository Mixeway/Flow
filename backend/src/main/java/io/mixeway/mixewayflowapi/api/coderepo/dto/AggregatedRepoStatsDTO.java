package io.mixeway.mixewayflowapi.api.coderepo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

import java.util.List;

@Data
public class AggregatedRepoStatsDTO {

    private final List<DailyFindings> activeFindings;
    private final List<DailyFindings> removedFindingsList;
    private final List<DailyFindings> reviewedFindingsList;
    private final List<DailyFindings> averageFixTimeList;

    @Getter
    @AllArgsConstructor
    public static class DailyFindings {
        private final String date;
        private final int findings;
    }
}