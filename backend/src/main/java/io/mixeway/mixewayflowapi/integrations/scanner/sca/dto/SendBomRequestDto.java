package io.mixeway.mixewayflowapi.integrations.scanner.sca.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SendBomRequestDto {
    String project;
    String bom;
}
