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
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Log4j2
public class UpdateFindingService {
    private final FindingRepository findingRepository;
    private final EntityManager entityManager;
    private final JiraTicketLifecycleService jiraTicketLifecycleService;
    private final ApplicationEventPublisher eventPublisher;


    public void suppressFinding(Finding finding, String reason) {
        suppressFinding(finding, reason, null);
    }

    public void suppressFinding(Finding finding, String reason, LocalDate suppressedUntil) {
        finding.suppress(reason, suppressedUntil);
        findingRepository.save(finding);
        jiraTicketLifecycleService.onFindingSuppressed(finding);
        announceReview(finding);
        log.info("[UpdateFinding] Suppressed finding {} in {} reason {} until {}", finding.getVulnerability().getName(), finding.getCodeRepo().getRepourl(), reason, suppressedUntil != null ? suppressedUntil : "indefinitely");
    }

    @Transactional
    public void suppressFindingAcrossBranches(Finding finding, Long codeRepoId, String location, Long vulnId, String reason) {
        suppressFindingAcrossBranches(finding, codeRepoId, location, vulnId, reason, null);
    }

    @Transactional
    public void suppressFindingAcrossBranches(Finding finding, Long codeRepoId, String location, Long vulnId, String reason, LocalDate suppressedUntil) {
        Finding.SuppressedReason parsedReason = parseReason(reason);

        // Capture findings with linked JIRA tickets BEFORE the bulk update so we can close
        // their tickets afterwards (the bulk JPQL update bypasses entity lifecycle hooks).
        List<Finding> findingsWithJiraTickets = findingRepository
                .findToSuppressWithJiraTicket(codeRepoId, vulnId, location);
        // Likewise the branches whose open findings are about to be suppressed.
        List<Long> reviewedBranchIds = findingRepository.findBranchIdsWithOpenFinding(codeRepoId, vulnId, location);

        int affected = findingRepository.bulkSuppressInRepoForSameVulnAndLocation(
                codeRepoId, vulnId, location, parsedReason, suppressedUntil
        );

        log.info("[UpdateFinding] Suppressed {} finding(s) across repository {} at {}",
                affected, finding.getCodeRepo().getName(), location);
        for (Long branchId : reviewedBranchIds) {
            eventPublisher.publishEvent(new FindingsReviewedEvent(codeRepoId, branchId));
        }

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
        announceReview(finding);
        log.info("[UpdateFinding] Re-activated finding status {} in {} reason", finding.getVulnerability().getName(), finding.getCodeRepo().getRepourl());

    }

    /**
     * Re-activates the finding together with the same vulnerability at the same location on the other
     * branches of the repository. A suppression applies to the whole repository, so one left behind on
     * another branch would be inherited again by the next scan.
     */
    @Transactional
    public void reactivateAcrossBranches(Finding finding) {
        reactivate(finding);
        if (finding.getCodeRepo() == null || finding.getVulnerability() == null) {
            return;
        }
        int reactivated = 0;
        for (Finding sibling : findingRepository.findAllByCodeRepoAndVulnerabilityAndLocation(
                finding.getCodeRepo(), finding.getVulnerability(), finding.getLocation())) {
            if (sibling.getId() != finding.getId() && sibling.getStatus() == Finding.Status.SUPRESSED) {
                sibling.updateStatus(Finding.Status.EXISTING, null);
                findingRepository.save(sibling);
                announceReview(sibling);
                reactivated++;
            }
        }
        if (reactivated > 0) {
            log.info("[UpdateFinding] Re-activated {} more finding(s) across repository {} at {}",
                    reactivated, finding.getCodeRepo().getName(), finding.getLocation());
        }
    }

    /** Lets whoever reported on the finding's branch (e.g. a build status) know that it changed. */
    private void announceReview(Finding finding) {
        if (finding.getCodeRepo() == null || finding.getCodeRepoBranch() == null) {
            return;
        }
        eventPublisher.publishEvent(
                new FindingsReviewedEvent(finding.getCodeRepo().getId(), finding.getCodeRepoBranch().getId()));
    }
}
