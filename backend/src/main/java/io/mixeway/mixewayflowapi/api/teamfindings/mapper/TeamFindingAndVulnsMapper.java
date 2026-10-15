package io.mixeway.mixewayflowapi.api.teamfindings.mapper;

import io.mixeway.mixewayflowapi.api.teamfindings.dto.TeamFindingsAndVulnsResponseDto;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.integrations.scanner.sast.service.SastDeveloperFacingReasoning;

import java.util.List;
import java.util.stream.Collectors;

public class TeamFindingAndVulnsMapper {
    public static List<TeamFindingsAndVulnsResponseDto> mapToDtoList(String remoteId, List<Finding> findings) {
        return findings.stream().map(finding -> {
            TeamFindingsAndVulnsResponseDto dto = new TeamFindingsAndVulnsResponseDto();
            dto.setId(finding.getId());
            dto.setName(finding.getVulnerability().getName());
            dto.setLocation(finding.getLocation());
            dto.setSource(finding.getSource().name());
            dto.setSeverity(finding.getSeverity().name());
            dto.setStatus(finding.getStatus().name());
            dto.setInserted(finding.getInsertedDate().toString());
            dto.setLastSeen(finding.getUpdatedDate().toString());
            dto.setRemoteId(remoteId);
            dto.setDescription(finding.getVulnerability().getDescription());
            dto.setExplanation(finding.getExplanation());
            dto.setRecommendation(finding.getVulnerability().getRecommendation());
            String grade = finding.getAiVerificationGrade() == null ? null : finding.getAiVerificationGrade().name();
            dto.setAiVerificationReasoning(SastDeveloperFacingReasoning.forDisplay(finding.getAiVerificationReasoning()));
            dto.setAiVerificationRecommendation(SastDeveloperFacingReasoning.recommendationForDisplay(
                    grade, finding.getAiVerificationRecommendation()));
            dto.setEpss(finding.getVulnerability().getEpss());


            if (finding.getCodeRepo() != null) {
                dto.setComponentName(finding.getCodeRepo().getName());
            } else if (finding.getCloudSubscription() != null) {
                dto.setComponentName(finding.getCloudSubscription().getExternal_project_name());
            }



            return dto;
        }).collect(Collectors.toList());
    }
}
