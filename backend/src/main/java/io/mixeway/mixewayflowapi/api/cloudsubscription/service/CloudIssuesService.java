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
public class CloudIssuesService {

    private final FindCloudSubscriptionService findCloudSubscriptionService;
    private final FindFindingService findFindingService;
    private final UpdateFindingService updateFindingService;

    public List<VulnsResponseDto> getCloudSubscriptionIssues(Long id, Principal principal) {
        CloudSubscription cloudSubscription = findCloudSubscriptionService.findById(id, principal);
        List<Finding> issues = findFindingService.getCloudSubscriptionFindings(cloudSubscription, Finding.Source.valueOf("CLOUD_ISSUE"));
        return FindingMapper.mapToDtoList(issues);
    }

    public GetFindingResponseDto getIssue(Long id, Long findingId, Principal principal) {
        CloudSubscription cloudSubscription = findCloudSubscriptionService.findById(id, principal);
        Optional<Finding> issue = findFindingService.findById(findingId);
        if (issue.isPresent() && issue.get().getCloudSubscription().equals(cloudSubscription)){
            GetFindingResponseDto getFindingResponseDto = new GetFindingResponseDto();
            VulnsResponseDto vulnsResponseDto = FindingMapper.mapToDto(issue.get());
            getFindingResponseDto.setVulnsResponseDto(vulnsResponseDto);
            getFindingResponseDto.setDescription(issue.get().getVulnerability().getDescription());
            getFindingResponseDto.setRecommendation(issue.get().getVulnerability().getRecommendation());
            getFindingResponseDto.setRefs(issue.get().getVulnerability().getRef());
            getFindingResponseDto.setExplanation(issue.get().getExplanation());
            getFindingResponseDto.setComments(issue.get().getComments().stream()
                    .map(comment -> new CommentDto(comment.getCreatedDate(), comment.getUser().getUsername(), comment.getMessage()))
                    .toList());
            return getFindingResponseDto;
        } else {
            return null;
        }
    }
}

