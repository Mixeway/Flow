package io.mixeway.mixewayflowapi.api.teamfindings.mapper;

import io.mixeway.mixewayflowapi.api.teamfindings.dto.TeamVulnsResponseDto;
import io.mixeway.mixewayflowapi.db.entity.Finding;

import java.util.List;
import java.util.stream.Collectors;

public class TeamFindingMapper {
    public static List<TeamVulnsResponseDto> mapToDtoList(List<Finding> findings) {
        return findings.stream().map(finding -> {
            TeamVulnsResponseDto dto = new TeamVulnsResponseDto();
            dto.setId(finding.getId());
            dto.setName(finding.getVulnerability().getName());
            dto.setLocation(finding.getLocation());
            dto.setSource(finding.getSource().name());
            dto.setSeverity(finding.getSeverity().name());
            dto.setStatus(finding.getStatus().name());
            dto.setInserted(finding.getInsertedDate().toString());
            dto.setLastSeen(finding.getUpdatedDate().toString());

            if (finding.getCodeRepo() != null) {
                dto.setComponentName(finding.getCodeRepo().getName());
            } else if (finding.getCloudSubscription() != null) {
                dto.setComponentName(finding.getCloudSubscription().getExternal_project_name());
            }

            dto.setJiraTicketKey(finding.getJiraTicketKey());

            return dto;
        }).collect(Collectors.toList());
    }

}
