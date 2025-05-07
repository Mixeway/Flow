package io.mixeway.mixewayflowapi.api.user.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class UserQuotaInfoDto {
    private String planType; // "FREE", "SMALL_COMPANY", or "ENTERPRISE"
    private String organizationName;
    private Long organizationId;
    private QuotaLimitsDto limits;
    private QuotaUsageDto usage;
}