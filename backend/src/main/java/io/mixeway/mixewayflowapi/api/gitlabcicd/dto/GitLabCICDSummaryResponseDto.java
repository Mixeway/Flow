package io.mixeway.mixewayflowapi.api.gitlabcicd.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GitLabCICDSummaryResponseDto {
    int totalNumberOfFindings;

    int sastCritical;
    int sastHigh;
    int sastMedium;
    int sastInfoLow;

    int scaCritical;
    int scaHigh;
    int scaMedium;
    int scaInfoLow;

    int iacCritical;
    int iacHigh;
    int iacMedium;
    int iacInfoLow;

    int secretsCritical;
    int secretsHigh;
    int secretsMedium;
    int secretsInfoLow;

    int gitlabCritical;
    int gitlabHigh;
    int gitlabMedium;
    int gitlabInfoLow;

    String linkToScanDetails;

    List<GitLabCICDDetailsResponseDto> urgentFindingsDetails;
    List<GitLabCICDDetailsResponseDto> notableFindingsDetails;
}
