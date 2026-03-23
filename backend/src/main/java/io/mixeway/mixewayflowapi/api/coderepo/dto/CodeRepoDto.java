package io.mixeway.mixewayflowapi.api.coderepo.dto;

import io.mixeway.mixewayflowapi.api.dtos.AppDataTypeDto;
import io.mixeway.mixewayflowapi.api.dtos.BranchDto;
import io.mixeway.mixewayflowapi.api.dtos.ScanInfoDto;
import io.mixeway.mixewayflowapi.api.team.dto.TeamDto;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
public class CodeRepoDto {

    private Long id;
    private String name;
    private String repourl;
    private Integer remoteId;
    private TeamDto team;
    private BranchDto defaultBranch;
    private List<BranchDto> branches;
    private LocalDateTime insertedDate;
    private Map<String, Integer> languages;
    private String sastScan;
    private String scaScan;
    private String iacScan;
    private String secretsScan;
    private String gitlabScan;
    private String dastScan;
    private String exploitabilityScan;
    private List<AppDataTypeDto> appDataTypes;
    private List<ScanInfoDto> scanInfos;
    private String scaUUID;
    private String type;
    private Boolean scanNotRunning;
    private String gitHostUrl;
    private Boolean scanRunning;
}
