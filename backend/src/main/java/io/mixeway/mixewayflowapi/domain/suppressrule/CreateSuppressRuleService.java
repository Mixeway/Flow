package io.mixeway.mixewayflowapi.domain.suppressrule;

import io.mixeway.mixewayflowapi.api.threatintel.dto.SuppressRuleDTO;
import io.mixeway.mixewayflowapi.db.entity.*;
import io.mixeway.mixewayflowapi.db.repository.SuppressRuleRepository;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.finding.FindFindingService;
import io.mixeway.mixewayflowapi.domain.finding.UpdateFindingService;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import io.mixeway.mixewayflowapi.domain.user.FindUserService;
import io.mixeway.mixewayflowapi.domain.vulnerability.FindVulnerabilityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
@Log4j2
public class CreateSuppressRuleService {
    private final SuppressRuleRepository suppressRuleRepository;
    private final FindUserService findUserService;
    private final FindVulnerabilityService findVulnerabilityService;
    private final FindCodeRepoService findCodeRepoService;
    private final FindTeamService findTeamService;
    private final FindFindingService findFindingService;
    private final UpdateFindingService updateFindingService;

    public SuppressRule createRule(SuppressRuleDTO suppressRuleDTO, Principal principal) {
        // Retrieve necessary entities
        UserInfo owner = findUserService.findUser(principal.getName());
        Vulnerability vulnerability = findVulnerabilityService.getByName(suppressRuleDTO.getVulnerabilityId())
                .orElseThrow(() -> new IllegalArgumentException("[SuppressRule] Invalid vulnerability ID " + suppressRuleDTO.getVulnerabilityId()));
        CodeRepo codeRepo = null;
        Team team = null;

        // Scope-specific checks
        switch (SuppressRule.Scope.valueOf(suppressRuleDTO.getScope())) {
            case PROJECT:
                if (suppressRuleDTO.getCodeRepoId() == null) {
                    throw new IllegalArgumentException("[SuppressRule] CodeRepo ID must be provided for PROJECT scope.");
                }
                codeRepo = findCodeRepoService.findById(suppressRuleDTO.getCodeRepoId())
                        .orElseThrow(() -> new IllegalArgumentException("[SuppressRule] Invalid CodeRepo ID"));
                break;
            case TEAM:
                if (suppressRuleDTO.getTeamId() == null) {
                    throw new IllegalArgumentException("[SuppressRule] Team ID must be provided for TEAM scope.");
                }
                team = findTeamService.findById(suppressRuleDTO.getTeamId())
                        .orElseThrow(() -> new IllegalArgumentException("[SuppressRule] Invalid Team ID"));
                break;
            case GLOBAL:
                // No additional checks needed for GLOBAL scope
                break;
        }

        // Check for existing rule
        Optional<SuppressRule> existingRule = suppressRuleRepository.findByScopeAndVulnerabilityAndTeamAndCodeRepo(
                SuppressRule.Scope.valueOf(suppressRuleDTO.getScope()),
                vulnerability,
                team != null ? team.getId() : null,
                codeRepo != null ? codeRepo.getId() : null
        );
        if (existingRule.isPresent()) {
            throw new IllegalArgumentException("SuppressRule already exists for the given parameters.");
        }
        // Create new SuppressRule
        SuppressRule suppressRule = new SuppressRule(
                owner,
                SuppressRule.Scope.valueOf(suppressRuleDTO.getScope()),
                vulnerability,
                team,
                codeRepo
        );
        suppressRule = suppressRuleRepository.save(suppressRule);
        this.applySuppressRule(suppressRule);
        return suppressRule;
    }

    private void applySuppressRule(SuppressRule suppressRule) {
        List<Finding> findingsToSuppress = new ArrayList<>();
        switch (suppressRule.getScope()) {
            case GLOBAL:
                findingsToSuppress = findFindingService.findByVulnerability(suppressRule.getVulnerability());
                break;
            case TEAM:
                findingsToSuppress = findFindingService.findByVulnerabilityAndTeam(suppressRule.getTeam(), suppressRule.getVulnerability());
                break;
            case PROJECT:
                findingsToSuppress = findFindingService.findbyVulnerabilityAndCodeRepo(suppressRule.getCodeRepo(), suppressRule.getVulnerability());
                break;
        }
        for (Finding finding : findingsToSuppress) {
            updateFindingService.suppressFinding(finding, Finding.SuppressedReason.WONT_FIX.toString());
            log.info("[SuppressRule] Suppressed finding {} in project {}", finding.getVulnerability().getName(), finding.getCodeRepo().getName());
        }
    }
}
