package io.mixeway.mixewayflowapi.api.coderepo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RunOrchScanReportDto {

    String repoUrl;
    String branch;
    String linkToScanDetails;

    List<RunOrchScanDetailsDto> findings;
}
