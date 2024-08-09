package io.mixeway.mixewayflowapi.domain.finding;

import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.repository.FindingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

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
}
