package io.mixeway.mixewayflowapi.api.cloudsubscription.service;

import io.mixeway.mixewayflowapi.api.coderepo.dto.CommentDto;
import io.mixeway.mixewayflowapi.api.coderepo.dto.GetFindingResponseDto;
import io.mixeway.mixewayflowapi.api.coderepo.dto.VulnsResponseDto;
import io.mixeway.mixewayflowapi.api.coderepo.mapper.FindingMapper;
import io.mixeway.mixewayflowapi.db.entity.CloudSubscription;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.domain.cloudsubscription.FindCloudSubscriptionService;
import io.mixeway.mixewayflowapi.domain.finding.FindFindingService;
import io.mixeway.mixewayflowapi.domain.finding.UpdateFindingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Service
@Log4j2
@RequiredArgsConstructor
public class CloudFindingService {

    private final FindCloudSubscriptionService findCloudSubscriptionService;
    private final FindFindingService findFindingService;
    private final UpdateFindingService updateFindingService;

    public List<VulnsResponseDto> getCloudSubscriptionFindings(Long id, Principal principal) {
        CloudSubscription cloudSubscription = findCloudSubscriptionService.findById(id, principal);
        List<Finding> findings = findFindingService.getCloudSubscriptionFindings(cloudSubscription);
        return FindingMapper.mapToDtoList(findings);
    }

    public GetFindingResponseDto getFinding(Long id, Long findingId, Principal principal) {
        CloudSubscription cloudSubscription = findCloudSubscriptionService.findById(id, principal);
        Optional<Finding> finding = findFindingService.findById(findingId);
        if (finding.isPresent() && finding.get().getCloudSubscription().equals(cloudSubscription)){
            GetFindingResponseDto getFindingResponseDto = new GetFindingResponseDto();
            VulnsResponseDto vulnsResponseDto = FindingMapper.mapToDto(finding.get());
            getFindingResponseDto.setVulnsResponseDto(vulnsResponseDto);
            getFindingResponseDto.setDescription(finding.get().getVulnerability().getDescription());
            getFindingResponseDto.setRecommendation(finding.get().getVulnerability().getRecommendation());
            getFindingResponseDto.setRefs(finding.get().getVulnerability().getRef());
            getFindingResponseDto.setExplanation(finding.get().getExplanation());
            getFindingResponseDto.setComments(finding.get().getComments().stream()
                    .map(comment -> new CommentDto(comment.getCreatedDate(), comment.getUser().getUsername(), comment.getMessage()))
                    .toList());
            return getFindingResponseDto;
        } else {
            return null;
        }
    }
}

