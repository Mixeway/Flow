package io.mixeway.mixewayflowapi.api.user.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QuotaLimitsDto {
    private int maxTeams;
    private int maxReposPerTeam;
    private int maxUsersPerTeam;
    private int maxTotalRepos; // Calculated as maxTeams * maxReposPerTeam
}