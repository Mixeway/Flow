package io.mixeway.mixewayflowapi.api.dtos;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ScanInfoDto {
    private Long id;
    private BranchDto codeRepoBranch;
    private String commitId;
    private LocalDateTime insertedDate;
    private String scaScanStatus;
    private String sastScanStatus;
    private String iacScanStatus;
    private String secretsScanStatus;
    private String gitlabScanStatus;
    private Integer scaHigh;
    private Integer scaCritical;
    private Integer sastHigh;
    private Integer sastCritical;
    private Integer iacHigh;
    private Integer iacCritical;
    private Integer secretsHigh;
    private Integer secretsCritical;
    private Integer gitlabCritical;
    private Integer gitlabHigh;
    private Integer dastCritical;
    private Integer dastHigh;
}
