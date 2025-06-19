package io.mixeway.mixewayflowapi.domain.finding;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.repository.FindingRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Log4j2
public class UpdateFindingService {
    private final FindingRepository findingRepository;

    public void suppressFinding(Finding finding, String reason) {
        finding.suppress(reason);
        findingRepository.save(finding);
        log.info("[UpdateFinding] Suppressed finding {} in {} reason {}", finding.getVulnerability().getName(), finding.getCodeRepo().getRepourl(), reason);
    }

    public void reactivate(Finding finding) {
        finding.updateStatus(Finding.Status.EXISTING, null);
        findingRepository.save(finding);
        log.info("[UpdateFinding] Re-activated finding status {} in {} reason", finding.getVulnerability().getName(), finding.getCodeRepo().getRepourl());

    }

    @Transactional
    public void verifyGitLabFinding(String rule, CodeRepo codeRepo, CodeRepoBranch codeRepoBranch, String location) {
        List<Finding> findings = findingRepository.findByCodeRepoAndVulnerabilityNameAndBranchAndLocation(codeRepo, rule, codeRepoBranch, location);
        if (findings.isEmpty()) {
            log.info("[UpdateFinding] No findings found for rule: {} for {}", rule, location);
            return;
        }
        Finding finding = findings.get(0);
        if (finding.getStatus() == Finding.Status.EXISTING || finding.getStatus() == Finding.Status.NEW) {
            finding.updateStatus(Finding.Status.REMOVED, null);
            findingRepository.save(finding);
        }

    }
}
