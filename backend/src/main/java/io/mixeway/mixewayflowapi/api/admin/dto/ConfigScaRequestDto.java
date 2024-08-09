package io.mixeway.mixewayflowapi.api.admin.dto;

import lombok.Data;

@Data
public class ConfigScaRequestDto {
    boolean scaTypeEmbedded;
    boolean scaTypeExternal;
    String scaApiUrl;
    String scaApiKey;
}
