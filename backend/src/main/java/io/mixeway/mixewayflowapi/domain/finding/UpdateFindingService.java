package io.mixeway.mixewayflowapi.domain.finding;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.repository.FindingRepository;
import io.mixeway.mixewayflowapi.domain.jira.JiraTicketLifecycleService;
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
    private final JiraTicketLifecycleService jiraTicketLifecycleService;


    public void suppressFinding(Finding finding, String reason) {
        finding.suppress(reason);
        findingRepository.save(finding);
        jiraTicketLifecycleService.onFindingSuppressed(finding);
        log.info("[UpdateFinding] Suppressed finding {} in {} reason {}", finding.getVulnerability().getName(), finding.getCodeRepo().getRepourl(), reason);
    }

    @Transactional
    public void suppressFindingAcrossBranches(Finding finding, Long codeRepoId, String location, Long vulnId, String reason) {
        Finding.SuppressedReason parsedReason = parseReason(reason);

        // Capture findings with linked JIRA tickets BEFORE the bulk update so we can close
        // their tickets afterwards (the bulk JPQL update bypasses entity lifecycle hooks).
        List<Finding> findingsWithJiraTickets = findingRepository
                .findToSuppressWithJiraTicket(codeRepoId, vulnId, location);

        int affected = findingRepository.bulkSuppressInRepoForSameVulnAndLocation(
                codeRepoId, vulnId, location, parsedReason
        );

        log.info("[UpdateFinding] Suppressed {} finding(s) across repository {} at {}",
                affected, finding.getCodeRepo().getName(), location);

        for (Finding f : findingsWithJiraTickets) {
            // Reflect the new state on the detached entity so the JIRA comment carries the reason.
            f.suppress(reason);
            jiraTicketLifecycleService.onFindingSuppressed(f);
            log.info("[UpdateFinding] Triggered JIRA ticket close for finding {} (ticket {})",
                    f.getId(), f.getJiraTicketKey());
        }
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
