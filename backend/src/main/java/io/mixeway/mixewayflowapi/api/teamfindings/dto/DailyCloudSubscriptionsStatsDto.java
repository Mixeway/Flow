package io.mixeway.mixewayflowapi.api.teamfindings.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class DailyCloudSubscriptionsStatsDto {
    private LocalDate date;
    private int criticalFindings, highFindings;
    private int openedFindings, removedFindings;
    private double averageFixTime;

    public DailyCloudSubscriptionsStatsDto(LocalDate date, int criticalFindings, int highFindings,
                                           int openedFindings, int removedFindings, double averageFixTime) {
        this.date = date;
        this.criticalFindings = criticalFindings;
        this.highFindings = highFindings;
        this.openedFindings = openedFindings;
        this.removedFindings = removedFindings;
        this.averageFixTime = averageFixTime;
    }
}
