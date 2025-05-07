package io.mixeway.mixewayflowapi.api.user.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AppModeInfoDto {
    private String mode; // "STANDALONE" or "SAAS"
    private UserQuotaInfoDto quotaInfo; // null if in STANDALONE mode
}