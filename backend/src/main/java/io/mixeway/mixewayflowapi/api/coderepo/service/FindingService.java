package io.mixeway.mixewayflowapi.api.coderepo.service;

import io.mixeway.mixewayflowapi.api.coderepo.dto.CommentDto;
import io.mixeway.mixewayflowapi.api.coderepo.dto.GetFindingResponseDto;
import io.mixeway.mixewayflowapi.api.coderepo.dto.VulnsResponseDto;
import io.mixeway.mixewayflowapi.api.coderepo.mapper.FindingMapper;
import io.mixeway.mixewayflowapi.db.entity.*;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.coderepobranch.FindCodeRepoBranchService;
import io.mixeway.mixewayflowapi.domain.finding.FindFindingService;
import io.mixeway.mixewayflowapi.domain.finding.UpdateFindingService;
import io.mixeway.mixewayflowapi.utils.StatusDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class FindingService {
    private final FindCodeRepoService findCodeRepoService;
    private final FindFindingService findFindingService;
    private final UpdateFindingService updateFindingService;
    private final FindCodeRepoBranchService findCodeRepoBranchService;

    public List<VulnsResponseDto> getRepoDefaultBranchFindings(Long id, Principal principal) {
        CodeRepo codeRepo = findCodeRepoService.findById(id, principal);
        List<Finding> findings = findFindingService.getCodeRepoFindings(codeRepo, null);
        return mapFindingsToDtoWithUrgency(findings);
    }

    public GetFindingResponseDto getFinding(Long id, Long findingId, Principal principal) {
        CodeRepo codeRepo = findCodeRepoService.findById(id, principal);
        Optional<Finding> findingOptional = findFindingService.findById(findingId);
        if (findingOptional.isPresent() && findingOptional.get().getCodeRepo().equals(codeRepo)) {
            Finding finding = findingOptional.get();
            GetFindingResponseDto getFindingResponseDto = new GetFindingResponseDto();
            VulnsResponseDto vulnsResponseDto = FindingMapper.mapToDto(finding);

            // Set urgency for the single finding
            vulnsResponseDto.setUrgency(calculateUrgency(finding));

            getFindingResponseDto.setVulnsResponseDto(vulnsResponseDto);
            getFindingResponseDto.setDescription(finding.getVulnerability().getDescription());
            getFindingResponseDto.setRecommendation(finding.getVulnerability().getRecommendation());
            getFindingResponseDto.setRefs(finding.getVulnerability().getRef());
            getFindingResponseDto.setExplanation(finding.getExplanation());
            getFindingResponseDto.setComments(finding.getComments().stream()
                    .map(comment -> new CommentDto(comment.getCreatedDate(), comment.getUser().getUsername(), comment.getMessage()))
                    .toList());
            return getFindingResponseDto;
        } else {
            return null;
        }
    }

    @Transactional
    public StatusDTO supressFinding(Long id, Long findingId, String reason, Principal principal) {
        CodeRepo codeRepo = findCodeRepoService.findById(id, principal);
        Optional<Finding> finding = findFindingService.findById(findingId);
        if (finding.isPresent() && finding.get().getCodeRepo().equals(codeRepo)) {
            updateFindingService.suppressFindingAcrossBranches(finding.get(), reason);
            return new StatusDTO("OK");
        } else {
            return null;
        }
    }

    public StatusDTO reactivate(Long id, Long findingId, Principal principal) {
        CodeRepo codeRepo = findCodeRepoService.findById(id, principal);
        Optional<Finding> finding = findFindingService.findById(findingId);
        if (finding.isPresent() && finding.get().getCodeRepo().equals(codeRepo)) {
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
            return mapFindingsToDtoWithUrgency(findings);
        } else {
            return null;
        }
    }

    public StatusDTO supressFindingBulk(Long id, List<Long> findingIds, Principal principal) {
        CodeRepo codeRepo = findCodeRepoService.findById(id, principal);
        for (Long findingId : findingIds) {
            Optional<Finding> finding = findFindingService.findById(findingId);
            if (finding.isPresent() && finding.get().getCodeRepo().equals(codeRepo)) {
                updateFindingService.suppressFinding(finding.get(), Finding.SuppressedReason.FALSE_POSITIVE.toString());
            }
        }
        return new StatusDTO("OK");
    }

    private List<VulnsResponseDto> mapFindingsToDtoWithUrgency(List<Finding> findings) {
        return findings.stream()
                .map(finding -> {
                    VulnsResponseDto dto = FindingMapper.mapToDto(finding);
                    dto.setUrgency(calculateUrgency(finding));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    /**
     * Checks if the finding's associated code repository handles Personally Identifiable Information (PII).
     *
     * @param finding The finding to check.
     * @return True if PII is present, false otherwise.
     */
    private boolean hasPiiData(Finding finding) {
        if (finding.getCodeRepo() == null || finding.getCodeRepo().getAppDataTypes() == null) {
            return false;
        }
        // Stream through each AppDataType associated with the CodeRepo
        return finding.getCodeRepo().getAppDataTypes().stream()
                // For each AppDataType, check if its list of category groups contains "PII"
                .anyMatch(adt -> adt.getCategoryGroups() != null &&
                        adt.getCategoryGroups().stream()
                                .anyMatch("PII"::equalsIgnoreCase));
    }

    /**
     * Calculates the urgency of a finding based on a complex set of rules
     * matching the provided SQL VIEW logic.
     *
     * @param finding The Finding entity to analyze.
     * @return A string representing the urgency ("urgent", "notable", or null).
     */
    public String calculateUrgency(Finding finding) {
        Vulnerability vulnerability = finding.getVulnerability();
        if (vulnerability == null) {
            return null; // Cannot determine urgency without vulnerability details
        }

        double epss = (vulnerability.getEpss() != null) ? vulnerability.getEpss().doubleValue() : 0.0;
        boolean exploitExists = vulnerability.getExploitExists() != null ? vulnerability.getExploitExists() : false;
        boolean piiPresent = hasPiiData(finding);
        String source = finding.getSource().toString();
        String severity = finding.getSeverity().toString();

        // Urgent conditions
        boolean b = "IAC".equalsIgnoreCase(source) || "SAST".equalsIgnoreCase(source) || "SECRETS".equalsIgnoreCase(source);
        boolean isCriticalInternalFinding = "CRITICAL".equalsIgnoreCase(severity) &&
                b;

        if (epss > 0.5 ||
                (epss > 0.2 && epss < 0.5 && piiPresent) ||
                (epss > 0.1 && exploitExists) ||
                isCriticalInternalFinding) {
            return "urgent";
        }

        // Notable conditions
        boolean isHighInternalFinding = "HIGH".equalsIgnoreCase(severity) &&
                b;

        if (((epss > 0.1 && epss < 0.5) && !piiPresent && !exploitExists) ||
                (epss < 0.1 && exploitExists) ||
                isHighInternalFinding) {
            return "notable";
        }

        return null; // Default: no specific urgency
    }
}