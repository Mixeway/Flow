package io.mixeway.mixewayflowapi.api.coderepo.mapper;

import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.api.coderepo.dto.VulnsResponseDto;

import java.util.List;
import java.util.stream.Collectors;

public class FindingMapper {

    public static VulnsResponseDto mapToDto(Finding finding) {
        VulnsResponseDto dto = new VulnsResponseDto();
        dto.setId(finding.getId());
        dto.setName(finding.getVulnerability().getName());
        dto.setLocation(finding.getLocation());
        dto.setSource(finding.getSource().name());
        dto.setSeverity(finding.getSeverity().name());
        dto.setStatus(finding.getStatus().name());
        dto.setInserted(finding.getInsertedDate().toString());
        dto.setLastSeen(finding.getUpdatedDate().toString());
        dto.setJiraTicketKey(finding.getJiraTicketKey());
        return dto;
    }

    public static List<VulnsResponseDto> mapToDtoList(List<Finding> findings) {
        return findings.stream()
                .map(FindingMapper::mapToDto)
                .collect(Collectors.toList());
    }
}
