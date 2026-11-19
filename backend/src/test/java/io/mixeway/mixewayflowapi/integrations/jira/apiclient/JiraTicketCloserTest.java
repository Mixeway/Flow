package io.mixeway.mixewayflowapi.integrations.jira.apiclient;

import io.mixeway.mixewayflowapi.integrations.jira.apiclient.JiraTicketCloser.AllowedValue;
import io.mixeway.mixewayflowapi.integrations.jira.apiclient.JiraTicketCloser.Outcome;
import io.mixeway.mixewayflowapi.integrations.jira.apiclient.JiraTicketCloser.Reason;
import io.mixeway.mixewayflowapi.integrations.jira.apiclient.JiraTicketCloser.Status;
import io.mixeway.mixewayflowapi.integrations.jira.apiclient.JiraTicketCloser.Transition;
import io.mixeway.mixewayflowapi.integrations.jira.apiclient.JiraTicketCloser.TransitionField;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Walks made-up JIRA workflows: the closer only ever sees the transitions leaving the current status,
 * exactly as the JIRA API exposes them.
 */
class JiraTicketCloserTest {

    private static final Status OPEN = new Status("1", "Open", "new");
    private static final Status TRIAGE = new Status("2", "Triage", "indeterminate");
    private static final Status IN_PROGRESS = new Status("3", "In Progress", "indeterminate");
    private static final Status ACCEPTED_RISK = new Status("4", "Accepted Risk", "indeterminate");
    private static final Status RESOLVED = new Status("5", "Resolved", "done");
    private static final Status CLOSED = new Status("6", "Closed", "done");
    private static final Status DUPLICATE = new Status("7", "Duplicate", "done");

    @Test
    void walksAMultiStepWorkflowToTheClosedStatus() {
        Workflow workflow = new Workflow(OPEN)
                .from(OPEN, to(TRIAGE))
                .from(TRIAGE, to(ACCEPTED_RISK))
                .from(ACCEPTED_RISK, to(CLOSED));

        Outcome outcome = JiraTicketCloser.close(workflow, "SEC-1", Reason.SUPPRESSED);

        assertTrue(outcome.closed());
        assertEquals(List.of("Open", "Triage", "Accepted Risk", "Closed"), outcome.path());
    }

    @Test
    void suppressedFindingTakesTheAcceptedRiskBranch() {
        Workflow workflow = new Workflow(OPEN)
                .from(OPEN, to(TRIAGE))
                .from(TRIAGE, to(IN_PROGRESS), to(ACCEPTED_RISK))
                .from(IN_PROGRESS, to(RESOLVED))
                .from(ACCEPTED_RISK, to(CLOSED));

        Outcome outcome = JiraTicketCloser.close(workflow, "SEC-1", Reason.SUPPRESSED);

        assertEquals(List.of("Open", "Triage", "Accepted Risk", "Closed"), outcome.path());
    }

    @Test
    void closedStatusIsTakenAsSoonAsItIsReachable() {
        Workflow workflow = new Workflow(TRIAGE)
                .from(TRIAGE, to(ACCEPTED_RISK), to(RESOLVED))
                .from(ACCEPTED_RISK, to(CLOSED));

        Outcome outcome = JiraTicketCloser.close(workflow, "SEC-1", Reason.REMOVED);

        assertEquals(List.of("Triage", "Resolved"), outcome.path());
    }

    @Test
    void duplicateIsNotUsedToCloseATicketWhenAnotherRouteExists() {
        Workflow workflow = new Workflow(OPEN)
                .from(OPEN, to(DUPLICATE), to(TRIAGE))
                .from(TRIAGE, to(CLOSED));

        Outcome outcome = JiraTicketCloser.close(workflow, "SEC-1", Reason.REMOVED);

        assertEquals(List.of("Open", "Triage", "Closed"), outcome.path());
    }

    @Test
    void neverGoesBackToAStatusAlreadyVisited() {
        Workflow workflow = new Workflow(OPEN)
                .from(OPEN, to(TRIAGE))
                .from(TRIAGE, new Transition("back", "Back to Open", OPEN, List.of()), to(IN_PROGRESS))
                .from(IN_PROGRESS, new Transition("back2", "Back to Triage", TRIAGE, List.of()), to(CLOSED));

        Outcome outcome = JiraTicketCloser.close(workflow, "SEC-1", Reason.REMOVED);

        assertEquals(List.of("Open", "Triage", "In Progress", "Closed"), outcome.path());
    }

    @Test
    void ticketAlreadyClosedIsLeftAlone() {
        Workflow workflow = new Workflow(CLOSED).from(CLOSED, to(OPEN));

        Outcome outcome = JiraTicketCloser.close(workflow, "SEC-1", Reason.REMOVED);

        assertTrue(outcome.closed());
        assertTrue(outcome.alreadyClosed());
        assertTrue(workflow.performed.isEmpty());
    }

    @Test
    void deadEndIsReportedWithThePathTaken() {
        Workflow workflow = new Workflow(OPEN).from(OPEN, to(TRIAGE));

        Outcome outcome = JiraTicketCloser.close(workflow, "SEC-1", Reason.SUPPRESSED);

        assertFalse(outcome.closed());
        assertEquals(List.of("Open", "Triage"), outcome.path());
        assertTrue(outcome.obstacle().contains("no transition leads onward"));
    }

    @Test
    void transitionNeedingAFieldFlowCannotFillStopsTheWalk() {
        TransitionField rootCause = new TransitionField("customfield_10100", "Root cause", true, false, List.of());
        Workflow workflow = new Workflow(OPEN)
                .from(OPEN, new Transition("t", "Close", CLOSED, List.of(rootCause)));

        Outcome outcome = JiraTicketCloser.close(workflow, "SEC-1", Reason.REMOVED);

        assertFalse(outcome.closed());
        assertTrue(workflow.performed.isEmpty());
        assertTrue(outcome.obstacle().contains("Root cause"));
    }

    @Test
    void resolutionAskedForByTheTransitionMatchesTheReason() {
        TransitionField resolution = new TransitionField("resolution", "Resolution", true, false,
                List.of(new AllowedValue("10", "Duplicate"), new AllowedValue("11", "Fixed"), new AllowedValue("12", "Won't Do")));

        Workflow removed = new Workflow(OPEN).from(OPEN, new Transition("t", "Close", CLOSED, List.of(resolution)));
        JiraTicketCloser.close(removed, "SEC-1", Reason.REMOVED);
        assertEquals(Map.of("resolution", Map.of("id", "11")), removed.performed.get(0));

        Workflow suppressed = new Workflow(OPEN).from(OPEN, new Transition("t", "Close", CLOSED, List.of(resolution)));
        JiraTicketCloser.close(suppressed, "SEC-1", Reason.SUPPRESSED);
        assertEquals(Map.of("resolution", Map.of("id", "12")), suppressed.performed.get(0));
    }

    @Test
    void transitionRejectedByJiraIsReported() {
        Workflow workflow = new Workflow(OPEN).from(OPEN, to(TRIAGE));
        workflow.rejectWith = "400 BAD_REQUEST - condition failed";

        Outcome outcome = JiraTicketCloser.close(workflow, "SEC-1", Reason.REMOVED);

        assertFalse(outcome.closed());
        assertEquals(List.of("Open"), outcome.path());
        assertTrue(outcome.obstacle().contains("condition failed"));
    }

    @Test
    void commentSaysWhatBecameOfTheTicket() {
        String closed = JiraTicketCloser.comment("Finding suppressed. Reason: ACCEPTED",
                new Outcome(true, false, List.of("Open", "Triage", "Closed"), null));
        assertTrue(closed.startsWith("Finding suppressed. Reason: ACCEPTED"));
        assertTrue(closed.contains("Open → Triage → Closed"));

        String stuck = JiraTicketCloser.comment("Finding no longer detected (marked as REMOVED).",
                new Outcome(false, false, List.of("Open", "Triage"), "no transition leads onward from this status"));
        assertTrue(stuck.contains("could not close this ticket automatically"));
        assertTrue(stuck.contains("\"Triage\""));
        assertTrue(stuck.contains("Please close the ticket manually"));

        String alreadyClosed = JiraTicketCloser.comment("Finding no longer detected (marked as REMOVED).",
                new Outcome(true, true, List.of("Closed"), null));
        assertTrue(alreadyClosed.contains("already in a closed status (Closed)"));
    }

    private static Transition to(Status target) {
        return new Transition("to-" + target.id(), "Move to " + target.name(), target, List.of());
    }

    /** A workflow held in memory, standing in for JIRA. */
    private static final class Workflow implements JiraTicketCloser.Gateway {
        private final Map<String, List<Transition>> transitionsByStatus = new HashMap<>();
        private final List<Map<String, Object>> performed = new ArrayList<>();
        private Status current;
        private String rejectWith;

        private Workflow(Status start) {
            this.current = start;
        }

        private Workflow from(Status status, Transition... transitions) {
            transitionsByStatus.put(status.id(), List.of(transitions));
            return this;
        }

        @Override
        public Status currentStatus(String ticketKey) {
            return current;
        }

        @Override
        public List<Transition> availableTransitions(String ticketKey) {
            return transitionsByStatus.getOrDefault(current.id(), List.of());
        }

        @Override
        public void transition(String ticketKey, Transition transition, Map<String, Object> fields) {
            if (rejectWith != null) {
                throw new IllegalStateException(rejectWith);
            }
            performed.add(fields);
            current = transition.to();
        }
    }
}
