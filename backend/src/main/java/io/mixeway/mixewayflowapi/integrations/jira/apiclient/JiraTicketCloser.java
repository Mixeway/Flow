package io.mixeway.mixewayflowapi.integrations.jira.apiclient;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

/**
 * Closes a JIRA ticket by walking its workflow, one transition at a time, until a status of the
 * "done" category is reached. Workflows differ per project (for example
 * {@code Open -> Triage -> Accepted Risk -> Closed}) and JIRA only reveals the transitions leaving the
 * current status, so the path is discovered while walking it.
 *
 * <p>The class decides which transition to take; talking to JIRA is left to the {@link Gateway}.</p>
 */
public final class JiraTicketCloser {

    /** Why the ticket is being closed. Steers the choice between alternative transitions and resolutions. */
    public enum Reason {
        SUPPRESSED(
                List.of("accept", "risk", "won't", "wont", "false positive", "not a bug", "reject", "declin", "invalid"),
                List.of("close", "done", "resolv"),
                List.of("won't", "wont", "not a bug", "declin", "reject", "invalid", "accept")),
        REMOVED(
                List.of("fix", "resolv", "done", "close", "complet"),
                List.of("verif", "review"),
                List.of("fix", "done", "resolv", "complet"));

        private final List<String> preferred;
        private final List<String> acceptable;
        private final List<String> resolutions;

        Reason(List<String> preferred, List<String> acceptable, List<String> resolutions) {
            this.preferred = preferred;
            this.acceptable = acceptable;
            this.resolutions = resolutions;
        }
    }

    /** Statuses that end a ticket in a way that would misdescribe it, or park it instead of closing it. */
    private static final List<String> UNWANTED = List.of("duplicate", "reopen", "re-open", "block", "hold", "wait");
    private static final String DONE = "done";
    private static final String IN_PROGRESS = "indeterminate";
    private static final String RESOLUTION = "resolution";
    static final int MAX_TRANSITIONS = 10;

    record Status(String id, String name, String category) {
        boolean isClosed() {
            return DONE.equalsIgnoreCase(category);
        }
    }

    record AllowedValue(String id, String name) {
    }

    /** A field shown on a transition screen. */
    record TransitionField(String key, String name, boolean required, boolean hasDefaultValue, List<AllowedValue> allowedValues) {
    }

    record Transition(String id, String name, Status to, List<TransitionField> fields) {
    }

    /**
     * @param path     names of the statuses the ticket went through, starting with the one it was found in
     * @param obstacle why the walk stopped before a closed status; null when the ticket is closed
     */
    record Outcome(boolean closed, boolean alreadyClosed, List<String> path, String obstacle) {
        String finalStatus() {
            return path.get(path.size() - 1);
        }
    }

    interface Gateway {
        Status currentStatus(String ticketKey);

        /** Transitions available from the ticket's current status, in the order JIRA lists them. */
        List<Transition> availableTransitions(String ticketKey);

        void transition(String ticketKey, Transition transition, Map<String, Object> fields);
    }

    private JiraTicketCloser() {
    }

    static Outcome close(Gateway jira, String ticketKey, Reason reason) {
        Status current = jira.currentStatus(ticketKey);
        List<String> path = new ArrayList<>(List.of(current.name()));
        if (current.isClosed()) {
            return new Outcome(true, true, path, null);
        }

        Set<String> visited = new HashSet<>();
        for (int step = 0; step < MAX_TRANSITIONS; step++) {
            visited.add(current.id());
            Optional<Transition> next = chooseNext(jira.availableTransitions(ticketKey), visited, reason);
            if (next.isEmpty()) {
                return stopped(path, "no transition leads onward from this status "
                        + "(the workflow ends here, or the JIRA account used by Flow is not allowed to move the ticket)");
            }
            Transition transition = next.get();
            List<String> unfillable = unfillableFields(transition);
            if (!unfillable.isEmpty()) {
                return stopped(path, "transition \"" + transition.name() + "\" requires field(s) Flow cannot fill: "
                        + String.join(", ", unfillable));
            }
            try {
                jira.transition(ticketKey, transition, fieldsFor(transition, reason));
            } catch (RuntimeException e) {
                return stopped(path, "JIRA rejected transition \"" + transition.name() + "\": " + e.getMessage());
            }
            current = transition.to();
            path.add(current.name());
            if (current.isClosed()) {
                return new Outcome(true, false, path, null);
            }
        }
        return stopped(path, "no closed status was reached after " + MAX_TRANSITIONS + " transitions");
    }

    private static Outcome stopped(List<String> path, String obstacle) {
        return new Outcome(false, false, path, obstacle);
    }

    /**
     * Picks the transition to take: never back to a status already visited, preferably one Flow can
     * complete, straight to a closed status when there is one, otherwise the one that best fits the
     * reason, and with nothing else to tell them apart the first one JIRA lists.
     */
    static Optional<Transition> chooseNext(List<Transition> available, Set<String> visited, Reason reason) {
        return available.stream()
                .filter(transition -> transition.to() != null && !visited.contains(transition.to().id()))
                .min(Comparator
                        .comparing((Transition transition) -> !unfillableFields(transition).isEmpty())
                        .thenComparing(transition -> fit(transition, reason) < 0)
                        .thenComparing(transition -> !transition.to().isClosed())
                        .thenComparing(transition -> -fit(transition, reason))
                        .thenComparing(transition -> !IN_PROGRESS.equalsIgnoreCase(transition.to().category())));
    }

    /** How well a transition suits the reason, judged by the names of the transition and its target status. */
    private static int fit(Transition transition, Reason reason) {
        String names = (transition.name() + " " + transition.to().name()).toLowerCase(Locale.ROOT);
        if (containsAny(names, UNWANTED)) {
            return -1;
        }
        if (containsAny(names, reason.preferred)) {
            return 2;
        }
        return containsAny(names, reason.acceptable) ? 1 : 0;
    }

    private static List<String> unfillableFields(Transition transition) {
        return transition.fields().stream()
                .filter(field -> field.required() && !field.hasDefaultValue())
                .filter(field -> !RESOLUTION.equals(field.key()) || field.allowedValues().isEmpty())
                .map(field -> field.name() != null ? field.name() : field.key())
                .toList();
    }

    /** The only field Flow fills on its own is the resolution, when the transition screen asks for it. */
    static Map<String, Object> fieldsFor(Transition transition, Reason reason) {
        Optional<TransitionField> resolution = transition.fields().stream()
                .filter(field -> RESOLUTION.equals(field.key()) && !field.allowedValues().isEmpty())
                .findFirst();
        if (resolution.isEmpty()) {
            return Map.of();
        }
        List<AllowedValue> allowed = resolution.get().allowedValues();
        for (String keyword : reason.resolutions) {
            for (AllowedValue value : allowed) {
                if (value.name() != null && value.name().toLowerCase(Locale.ROOT).contains(keyword)) {
                    return Map.of(RESOLUTION, Map.of("id", value.id()));
                }
            }
        }
        if (resolution.get().required() && !resolution.get().hasDefaultValue()) {
            return Map.of(RESOLUTION, Map.of("id", allowed.get(0).id()));
        }
        return Map.of();
    }

    private static boolean containsAny(String text, List<String> keywords) {
        return keywords.stream().anyMatch(text::contains);
    }

    /** The comment left on the ticket: why Flow acted, and what became of the ticket. */
    static String comment(String reasonText, Outcome outcome) {
        String path = String.join(" → ", outcome.path());
        if (outcome.alreadyClosed()) {
            return reasonText + "\n\nThe ticket was already in a closed status (" + outcome.finalStatus()
                    + "), so Flow left it unchanged.";
        }
        if (outcome.closed()) {
            return reasonText + "\n\nFlow closed this ticket automatically. Workflow path: " + path + ".";
        }
        return reasonText + "\n\nFlow could not close this ticket automatically. It is now in status \""
                + outcome.finalStatus() + "\"" + (outcome.path().size() > 1 ? " (workflow path: " + path + ")" : "")
                + ". Reason: " + outcome.obstacle() + ". Please close the ticket manually.";
    }
}
