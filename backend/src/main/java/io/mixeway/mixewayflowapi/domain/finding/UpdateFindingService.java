package io.mixeway.mixewayflowapi.domain.finding;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.repository.FindingRepository;
import jakarta.persistence.EntityManager;
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
    private final EntityManager entityManager;


    public void suppressFinding(Finding finding, String reason) {
        finding.suppress(reason);
        findingRepository.save(finding);
        log.info("[UpdateFinding] Suppressed finding {} in {} reason {}", finding.getVulnerability().getName(), finding.getCodeRepo().getRepourl(), reason);
    }

    @Transactional
    public void suppressFindingAcrossBranches(Finding finding, String reason) {
        Finding managed = entityManager.merge(finding);
        finding = managed;
        CodeRepo repo = managed.getCodeRepo();
        var vuln = managed.getVulnerability();
        String location = managed.getLocation();

        // Update everything in one go (includes the current finding)
        int affected = findingRepository.bulkSuppressInRepoForSameVulnAndLocation(
                repo.getId(), vuln.getId(), location, parseReason(reason)
        );

        log.info("[UpdateFinding] Suppressed {} finding(s) across repository {} for vuln {} at {}",
                affected, repo.getName(), vuln.getName(), location);
    }
    private Finding.SuppressedReason parseReason(String text) {
        if (text == null) throw new IllegalArgumentException("Suppressed reason is required");
        // normalize (e.g., "accepted", "ACCEPTED", "Accepted")
        String norm = text.trim().toUpperCase();
        try {
            return Finding.SuppressedReason.valueOf(norm);
        } catch (IllegalArgumentException ex) {
            // If you want friendlier aliases, map them here before throwing.
            throw new IllegalArgumentException("Unknown suppressed reason: " + text);
        }
    }

    public void reactivate(Finding finding) {
        finding.updateStatus(Finding.Status.EXISTING, null);
        findingRepository.save(finding);
        log.info("[UpdateFinding] Re-activated finding status {} in {} reason", finding.getVulnerability().getName(), finding.getCodeRepo().getRepourl());

    }
}
