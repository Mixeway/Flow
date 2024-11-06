package io.mixeway.mixewayflowapi.api.coderepo.dto;

import java.time.LocalDate;

public interface DailyFindingsProjection {
    LocalDate getDate();
    int getFindings();
}