package io.mixeway.mixewayflowapi.api.user.dto;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QuotaUsageDto {
    private int teamsCount;
    private int totalReposCount;
    private int usersCount;
    private double teamUsagePercentage;
    private double repoUsagePercentage;
}
