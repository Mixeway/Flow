package io.mixeway.mixewayflowapi.domain.jira;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.entity.JiraConfiguration;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.entity.Vulnerability;
import io.mixeway.mixewayflowapi.db.repository.FindingRepository;
import io.mixeway.mixewayflowapi.db.repository.JiraConfigurationRepository;
import io.mixeway.mixewayflowapi.domain.jira.JiraTicketClosureService.FindingClosure;
import io.mixeway.mixewayflowapi.integrations.jira.apiclient.JiraApiClientService;
import io.mixeway.mixewayflowapi.integrations.jira.apiclient.JiraGroupTicketText;
import io.mixeway.mixewayflowapi.integrations.jira.apiclient.JiraGroupTicketText.ClosedFinding;
import io.mixeway.mixewayflowapi.integrations.jira.apiclient.JiraTicketCloser;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

/**
 * A ticket covering several findings stays open until all of them are suppressed or gone; each
 * finding closed on the way is commented on and struck through in the ticket.
 */
class GroupTicketClosureTest {

    private static final String TICKET = "SEC-7";

    private FindingRepository findingRepository;
    private JiraApiClientService jira;
    private JiraTicketClosureService closureService;
    private JiraConfiguration config;

    private CodeRepo repo;
    private CodeRepoBranch main;
    private Vulnerability vulnerability;

    @BeforeEach
    void setUp() {
        findingRepository = mock(FindingRepository.class);
        jira = mock(JiraApiClientService.class);
        JiraConfigurationRepository configRepository = mock(JiraConfigurationRepository.class);
        closureService = new JiraTicketClosureService(findingRepository, configRepository, jira);

        Team team = mock(Team.class);
        config = mock(JiraConfiguration.class);
        when(configRepository.findByTeam(team)).thenReturn(Optional.of(config));
        repo = mock(CodeRepo.class);
        when(repo.getTeam()).thenReturn(team);
        main = mock(CodeRepoBranch.class);
        when(main.getName()).thenReturn("main");
        vulnerability = mock(Vulnerability.class);
    }

    @AfterEach
    void clearTransactionState() {
        if (TransactionSynchronizationManager.isSynchronizationActive()) {
            TransactionSynchronizationManager.clearSynchronization();
        }
    }

    @Test
    void groupTicketStaysOpenWhileAFindingIsStillActive() {
        Finding removed = finding(1L, "src/Dao.java:10");
        removed.updateStatus(Finding.Status.REMOVED, null);
        Finding active = finding(2L, "src/Dao.java:22");
        active.updateStatus(Finding.Status.EXISTING, null);
        coveredByTicket(removed, active);

        closureService.process(TICKET, List.of(new FindingClosure(1L, JiraTicketCloser.Reason.REMOVED, null)));

        verify(jira, never()).closeTicket(any(), anyString(), anyString(), any());
        verify(jira).strikeClosedFindingsInDescription(config, TICKET,
                List.of(new ClosedFinding("src/Dao.java:10", "main", "no longer detected")));
        ArgumentCaptor<String> comment = ArgumentCaptor.forClass(String.class);
        verify(jira).addTicketComment(eq(config), eq(TICKET), comment.capture());
        assertTrue(comment.getValue().contains("{{src/Dao.java:10}} (branch main) - no longer detected"));
        assertTrue(comment.getValue().contains("Still open: 1 of 2"));
    }

    @Test
    void groupTicketIsClosedOnceEveryFindingIsSuppressedOrGone() {
        Finding removed = finding(1L, "src/Dao.java:10");
        removed.updateStatus(Finding.Status.REMOVED, null);
        Finding suppressed = finding(2L, "src/Dao.java:22");
        suppressed.suppress(Finding.SuppressedReason.FALSE_POSITIVE.name());
        coveredByTicket(removed, suppressed);
        when(jira.closeTicket(any(), anyString(), anyString(), any())).thenReturn(true);

        closureService.process(TICKET, List.of(
                new FindingClosure(2L, JiraTicketCloser.Reason.SUPPRESSED, Finding.SuppressedReason.FALSE_POSITIVE)));

        ArgumentCaptor<String> reasonText = ArgumentCaptor.forClass(String.class);
        // One finding was accepted rather than fixed, so the ticket is not closed as "fixed".
        verify(jira).closeTicket(eq(config), eq(TICKET), reasonText.capture(), eq(JiraTicketCloser.Reason.SUPPRESSED));
        assertTrue(reasonText.getValue().contains("{{src/Dao.java:22}} (branch main) - suppressed: false positive"));
        assertTrue(reasonText.getValue().contains("All 2 findings covered by this ticket"));
        verify(jira).strikeClosedFindingsInDescription(eq(config), eq(TICKET), anyList());
        verify(jira).closeParentIfAllSubtasksClosed(config, TICKET, JiraTicketCloser.Reason.SUPPRESSED);
    }

    @Test
    void ticketForASingleFindingIsClosedStraightAway() {
        Finding removed = finding(1L, "lib:1.0");
        removed.updateStatus(Finding.Status.REMOVED, null);
        coveredByTicket(removed);

        closureService.process(TICKET, List.of(new FindingClosure(1L, JiraTicketCloser.Reason.REMOVED, null)));

        verify(jira).closeTicket(config, TICKET, "Finding no longer detected (marked as REMOVED).", JiraTicketCloser.Reason.REMOVED);
        verify(jira, never()).strikeClosedFindingsInDescription(any(), anyString(), anyList());
    }

    @Test
    void findingsClosedInOneTransactionUpdateTheirTicketOnceAfterCommit() {
        JiraTicketClosureService asyncClosureService = mock(JiraTicketClosureService.class);
        JiraTicketLifecycleService lifecycle = new JiraTicketLifecycleService(
                mock(JiraConfigurationRepository.class), jira, findingRepository, asyncClosureService);
        Finding first = withTicket(finding(1L, "src/Dao.java:10"));
        Finding second = withTicket(finding(2L, "src/Dao.java:22"));

        TransactionSynchronizationManager.initSynchronization();
        lifecycle.onFindingRemoved(first);
        lifecycle.onFindingRemoved(second);
        verifyNoInteractions(asyncClosureService);

        List<TransactionSynchronization> synchronizations = TransactionSynchronizationManager.getSynchronizations();
        assertEquals(1, synchronizations.size());
        synchronizations.get(0).afterCommit();
        synchronizations.get(0).afterCompletion(TransactionSynchronization.STATUS_COMMITTED);

        verify(asyncClosureService).process(TICKET, List.of(
                new FindingClosure(1L, JiraTicketCloser.Reason.REMOVED, null),
                new FindingClosure(2L, JiraTicketCloser.Reason.REMOVED, null)));
        assertFalse(TransactionSynchronizationManager.hasResource(lifecycle));
    }

    @Test
    void closedFindingsAreStruckThroughInTheDescription() {
        String description = String.join("\n",
                "h3. Affected Locations",
                "||#||Severity||Source||Location||Branch||",
                "|1|(!) HIGH|SAST|{{src/Dao.java:10}}|main|",
                "|2|(!) HIGH|SAST|{{src/Dao.java:22}}|main|",
                "|3|(!) HIGH|SAST|{{src/Dao.java:10}}|feature/x|",
                "",
                "----");
        List<ClosedFinding> closed = List.of(new ClosedFinding("src/Dao.java:10", "main", "no longer detected"));

        String updated = JiraGroupTicketText.strikeClosedFindings(description, closed);

        assertEquals(String.join("\n",
                "h3. Affected Locations",
                "||#||Severity||Source||Location||Branch||",
                "|1|(!) HIGH|SAST|-{{src/Dao.java:10}}- (no longer detected)|main|",
                "|2|(!) HIGH|SAST|{{src/Dao.java:22}}|main|",
                "|3|(!) HIGH|SAST|{{src/Dao.java:10}}|feature/x|",
                "",
                "----"), updated);
        assertEquals(updated, JiraGroupTicketText.strikeClosedFindings(updated, closed), "a struck row is not struck again");
    }

    @Test
    void subtaskDescriptionWithoutBranchColumnIsStruckThroughToo() {
        String description = "||#||Severity||Location||\r\n|1|(!) HIGH|{{src/Dao.java:10}}|\r\n|2|(!) HIGH|{{src/Dao.java:22}}|\r\n";

        String updated = JiraGroupTicketText.strikeClosedFindings(description,
                List.of(new ClosedFinding("src/Dao.java:22", "main", "suppressed: accepted")));

        assertEquals("||#||Severity||Location||\r\n|1|(!) HIGH|{{src/Dao.java:10}}|\r\n"
                + "|2|(!) HIGH|-{{src/Dao.java:22}}- (suppressed: accepted)|\r\n", updated);
    }

    private void coveredByTicket(Finding... findings) {
        when(findingRepository.findByJiraTicketKey(TICKET)).thenReturn(List.of(findings));
    }

    private Finding finding(long id, String location) {
        Finding finding = new Finding(vulnerability, null, main, repo, null, "explanation", location,
                Finding.Severity.HIGH, Finding.Source.SAST);
        ReflectionTestUtils.setField(finding, "id", id);
        return finding;
    }

    private static Finding withTicket(Finding finding) {
        finding.setJiraTicketKey(TICKET);
        return finding;
    }
}
