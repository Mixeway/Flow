package io.mixeway.mixewayflowapi.domain.jira;

import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.entity.JiraConfiguration;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.repository.FindingRepository;
import io.mixeway.mixewayflowapi.db.repository.JiraConfigurationRepository;
import io.mixeway.mixewayflowapi.integrations.jira.apiclient.JiraApiClientService;
import io.mixeway.mixewayflowapi.integrations.jira.apiclient.JiraGroupTicketText;
import io.mixeway.mixewayflowapi.integrations.jira.apiclient.JiraGroupTicketText.ClosedFinding;
import io.mixeway.mixewayflowapi.integrations.jira.apiclient.JiraTicketCloser;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Brings a JIRA ticket in line with the findings it covers after some of them were suppressed or
 * disappeared. A ticket for a single finding is closed. A ticket covering several findings gets the
 * closed ones struck through and a comment, and is closed only when none of its findings is left open.
 */
@Service
@RequiredArgsConstructor
@Log4j2
public class JiraTicketClosureService {

    /** A finding that was just suppressed or stopped being detected. */
    public record FindingClosure(long findingId, JiraTicketCloser.Reason reason, Finding.SuppressedReason suppressedReason) {
    }

    private static final int LOCK_STRIPES = 64;

    private final FindingRepository findingRepository;
    private final JiraConfigurationRepository jiraConfigurationRepository;
    private final JiraApiClientService jiraApiClientService;

    /** Two updates of one ticket must not interleave: both would see it complete and close it twice. */
    private final Object[] ticketLocks = newLocks();

    @Async
    @Transactional(readOnly = true)
    public void process(String ticketKey, List<FindingClosure> closures) {
        synchronized (ticketLocks[Math.floorMod(ticketKey.hashCode(), LOCK_STRIPES)]) {
            try {
                update(ticketKey, closures);
            } catch (Exception e) {
                log.error("[JIRA Lifecycle] Error updating ticket {} after its findings were closed: {}", ticketKey, e.getMessage());
            }
        }
    }

    private void update(String ticketKey, List<FindingClosure> closures) {
        List<Finding> covered = findingRepository.findByJiraTicketKey(ticketKey);
        if (covered.isEmpty() || closures.isEmpty()) {
            return;
        }
        Optional<JiraConfiguration> configOpt = covered.stream()
                .map(JiraTicketClosureService::resolveTeam)
                .filter(Objects::nonNull)
                .findFirst()
                .flatMap(jiraConfigurationRepository::findByTeam);
        if (configOpt.isEmpty()) {
            log.warn("[JIRA Lifecycle] No JIRA config found for the team of ticket {}", ticketKey);
            return;
        }
        JiraConfiguration config = configOpt.get();
        List<Finding> open = covered.stream().filter(JiraTicketClosureService::isOpen).toList();

        if (covered.size() == 1) {
            if (open.isEmpty()) {
                FindingClosure closure = closures.get(closures.size() - 1);
                closeTicket(config, ticketKey, singleFindingReason(closure), closure.reason());
            }
            return;
        }

        Map<Long, Finding> byId = covered.stream().collect(Collectors.toMap(Finding::getId, Function.identity()));
        List<ClosedFinding> justClosed = closures.stream()
                .map(closure -> byId.get(closure.findingId()))
                .filter(finding -> finding != null && !isOpen(finding))
                .distinct()
                .map(JiraTicketClosureService::describe)
                .toList();
        List<ClosedFinding> allClosed = covered.stream()
                .filter(finding -> !isOpen(finding))
                .map(JiraTicketClosureService::describe)
                .toList();

        // Before any transition: workflows often make a closed ticket read-only.
        jiraApiClientService.strikeClosedFindingsInDescription(config, ticketKey, allClosed);

        if (!open.isEmpty()) {
            if (!justClosed.isEmpty()) {
                jiraApiClientService.addTicketComment(config, ticketKey,
                        JiraGroupTicketText.progressComment(justClosed, open.size(), covered.size()));
                log.info("[JIRA Lifecycle] Ticket {} stays open: {} of {} findings still active", ticketKey, open.size(), covered.size());
            }
            return;
        }
        boolean allRemoved = covered.stream().allMatch(finding -> finding.getStatus() == Finding.Status.REMOVED);
        closeTicket(config, ticketKey,
                JiraGroupTicketText.allClosedReason(justClosed, covered.size()),
                allRemoved ? JiraTicketCloser.Reason.REMOVED : JiraTicketCloser.Reason.SUPPRESSED);
    }

    private void closeTicket(JiraConfiguration config, String ticketKey, String reasonText, JiraTicketCloser.Reason reason) {
        if (jiraApiClientService.closeTicket(config, ticketKey, reasonText, reason)) {
            jiraApiClientService.closeParentIfAllSubtasksClosed(config, ticketKey, reason);
        }
    }

    private static String singleFindingReason(FindingClosure closure) {
        return closure.reason() == JiraTicketCloser.Reason.SUPPRESSED
                ? "Finding suppressed. Reason: " + closure.suppressedReason()
                : "Finding no longer detected (marked as REMOVED).";
    }

    private static ClosedFinding describe(Finding finding) {
        String branch = finding.getCodeRepoBranch() != null ? finding.getCodeRepoBranch().getName() : null;
        String outcome = "no longer detected";
        if (finding.getStatus() == Finding.Status.SUPRESSED) {
            outcome = finding.getSuppressedReason() == null ? "suppressed" : "suppressed: " + switch (finding.getSuppressedReason()) {
                case WONT_FIX -> "won't fix";
                default -> finding.getSuppressedReason().name().toLowerCase(Locale.ROOT).replace('_', ' ');
            };
        }
        return new ClosedFinding(finding.getLocation(), branch, outcome);
    }

    private static boolean isOpen(Finding finding) {
        return finding.getStatus() == Finding.Status.NEW || finding.getStatus() == Finding.Status.EXISTING;
    }

    private static Team resolveTeam(Finding finding) {
        if (finding.getCodeRepo() != null) {
            return finding.getCodeRepo().getTeam();
        }
        if (finding.getCloudSubscription() != null) {
            return finding.getCloudSubscription().getTeam();
        }
        return null;
    }

    private static Object[] newLocks() {
        Object[] locks = new Object[LOCK_STRIPES];
        for (int i = 0; i < locks.length; i++) {
            locks[i] = new Object();
        }
        return locks;
    }
}
