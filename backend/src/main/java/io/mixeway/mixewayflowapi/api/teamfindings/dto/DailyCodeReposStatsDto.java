package io.mixeway.mixewayflowapi.api.teamfindings.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class DailyCodeReposStatsDto {
    private LocalDate date;
    private int sastCritical, sastHigh, sastMedium, sastRest;
    private int scaCritical, scaHigh, scaMedium, scaRest;
    private int iacCritical, iacHigh, iacMedium, iacRest;
    private int secretsCritical, secretsHigh, secretsMedium, secretsRest;
    private int openedFindings, removedFindings, reviewedFindings;
    private double averageFixTime;

    public DailyCodeReposStatsDto(LocalDate date, int sastCritical, int sastHigh, int sastMedium, int sastRest,
                         int scaCritical, int scaHigh, int scaMedium, int scaRest,
                         int iacCritical, int iacHigh, int iacMedium, int iacRest,
                         int secretsCritical, int secretsHigh, int secretsMedium, int secretsRest,
                         int openedFindings, int removedFindings, int reviewedFindings,
                         double averageFixTime) {
        this.date = date;
        this.sastCritical = sastCritical;
        this.sastHigh = sastHigh;
        this.sastMedium = sastMedium;
        this.sastRest = sastRest;
        this.scaCritical = scaCritical;
        this.scaHigh = scaHigh;
        this.scaMedium = scaMedium;
        this.scaRest = scaRest;
        this.iacCritical = iacCritical;
        this.iacHigh = iacHigh;
        this.iacMedium = iacMedium;
        this.iacRest = iacRest;
        this.secretsCritical = secretsCritical;
        this.secretsHigh = secretsHigh;
        this.secretsMedium = secretsMedium;
        this.secretsRest = secretsRest;
        this.openedFindings = openedFindings;
        this.removedFindings = removedFindings;
        this.reviewedFindings = reviewedFindings;
        this.averageFixTime = averageFixTime;
    }
}
