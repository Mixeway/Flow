package io.mixeway.mixewayflowapi.api.coderepo.service;

import io.mixeway.mixewayflowapi.api.coderepo.dto.CommentDto;
import io.mixeway.mixewayflowapi.api.coderepo.dto.GetFindingResponseDto;
import io.mixeway.mixewayflowapi.api.coderepo.dto.VulnsResponseDto;
import io.mixeway.mixewayflowapi.api.coderepo.mapper.FindingMapper;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.coderepobranch.FindCodeRepoBranchService;
import io.mixeway.mixewayflowapi.domain.finding.FindFindingService;
import io.mixeway.mixewayflowapi.domain.finding.UpdateFindingService;
import io.mixeway.mixewayflowapi.utils.StatusDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Service
@Log4j2
@RequiredArgsConstructor
public class FindingService {
    private final FindCodeRepoService findCodeRepoService;
    private final FindFindingService findFindingService;
    private final UpdateFindingService updateFindingService;
    private final FindCodeRepoBranchService findCodeRepoBranchService;

    public List<VulnsResponseDto> getRepoDefaultBranchFindings(Long id,Principal principal) {
        CodeRepo codeRepo = findCodeRepoService.findById(id, principal);
        List<Finding> findings =  findFindingService.getCodeRepoFindings(codeRepo, null);
        return FindingMapper.mapToDtoList(findings);
    }

    public GetFindingResponseDto getFinding(Long id, Long findingId, Principal principal) {
        CodeRepo codeRepo = findCodeRepoService.findById(id, principal);
        Optional<Finding> finding = findFindingService.findById(findingId);
        if (finding.isPresent() && finding.get().getCodeRepo().equals(codeRepo)){
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

    public StatusDTO supressFinding(Long id, Long findingId, String reason, Principal principal) {
        CodeRepo codeRepo = findCodeRepoService.findById(id, principal);
        Optional<Finding> finding = findFindingService.findById(findingId);
        if (finding.isPresent() && finding.get().getCodeRepo().equals(codeRepo)){
            updateFindingService.suppressFinding(finding.get(), reason);
            return new StatusDTO("OK");
        } else {
            return null;
        }
    }

    public StatusDTO reactivate(Long id, Long findingId, Principal principal) {
        CodeRepo codeRepo = findCodeRepoService.findById(id, principal);
        Optional<Finding> finding = findFindingService.findById(findingId);
        if (finding.isPresent() && finding.get().getCodeRepo().equals(codeRepo)){
            updateFindingService.reactivate(finding.get());
            return new StatusDTO("OK");
        } else {
            return null;
        }
    }

    public List<VulnsResponseDto> getRepoBranchFindings(Long id, Long branchid, Principal principal) {
        CodeRepo codeRepo = findCodeRepoService.findById(id, principal);
        Optional<CodeRepoBranch> codeRepoBranch = findCodeRepoBranchService.findById(branchid);
        if (codeRepoBranch.isPresent() && codeRepo.getBranches().contains(codeRepoBranch.get())) {
            List<Finding> findings = findFindingService.getCodeRepoFindings(codeRepo, codeRepoBranch.get());
            return FindingMapper.mapToDtoList(findings);
        } else {
            return null;
        }
    }

    public StatusDTO supressFindingBulk(Long id, List<Long> findingIds, Principal principal) {
        CodeRepo codeRepo = findCodeRepoService.findById(id, principal);
        for (Long findingId: findingIds) {
            Optional<Finding> finding = findFindingService.findById(findingId);
            if (finding.isPresent() && finding.get().getCodeRepo().equals(codeRepo)) {
                updateFindingService.suppressFinding(finding.get(), Finding.SuppressedReason.FALSE_POSITIVE.toString());
            }
        }
        return new StatusDTO("OK");
    }
}
