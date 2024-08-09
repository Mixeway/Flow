package io.mixeway.mixewayflowapi.api.admin.dto;

import lombok.Data;

@Data
public class ConfigSmtpRequestDto {
    boolean enabled;
    String hostname;
    int port;
    String username;
    String password;
    boolean tls;
    boolean startls;
}
