package io.mixeway.mixewayflowapi.integrations.jira.apiclient;

import java.util.Collection;
import java.util.List;

/**
 * Wording for a JIRA ticket that covers several findings: such a ticket stays open until every one of
 * them is suppressed or gone, and in the meantime shows which ones no longer need attention.
 */
public final class JiraGroupTicketText {

    /**
     * A finding covered by the ticket that no longer needs attention.
     *
     * @param branch  branch name as shown in the ticket, null when the finding has none
     * @param outcome what happened to it, for example "no longer detected"
     */
    public record ClosedFinding(String location, String branch, String outcome) {
    }

    private JiraGroupTicketText() {
    }

    /**
     * Strikes through the rows of the closed findings in the locations table of a ticket description.
     * A row is recognised by its {@code {{location}}} cell, so a description that was rewritten by hand
     * is simply left as it is. Rows already struck through are not touched again.
     */
    public static String strikeClosedFindings(String description, Collection<ClosedFinding> closed) {
        if (description == null || closed.isEmpty()) {
            return description;
        }
        String[] lines = description.split("\n", -1);
        for (int i = 0; i < lines.length; i++) {
            String line = lines[i];
            if (!line.startsWith("|") || line.startsWith("||")) {
                continue;
            }
            for (ClosedFinding finding : closed) {
                String struck = strike(line, finding);
                if (struck != null) {
                    lines[i] = struck;
                    break;
                }
            }
        }
        return String.join("\n", lines);
    }

    private static String strike(String row, ClosedFinding finding) {
        String cell = "|{{" + finding.location() + "}}|";
        int at = row.indexOf(cell);
        if (at < 0) {
            return null;
        }
        String afterCell = row.substring(at + cell.length());
        // The grouped table ends with a branch column; the same location on another branch is another finding.
        String branchColumn = afterCell.strip();
        if (!branchColumn.isEmpty() && !branchColumn.equals(displayBranch(finding) + "|")) {
            return null;
        }
        return row.substring(0, at) + "|-{{" + finding.location() + "}}- (" + finding.outcome() + ")|" + afterCell;
    }

    /** Comment for a ticket that stays open because some of its findings are still active. */
    public static String progressComment(List<ClosedFinding> justClosed, int stillOpen, int total) {
        return closedList(justClosed)
                + "\nStill open: " + stillOpen + " of " + total + " findings covered by this ticket. "
                + "Flow will close the ticket once all of them are suppressed or no longer detected.";
    }

    /** Opening of the comment left when the last finding of the ticket is closed. */
    public static String allClosedReason(List<ClosedFinding> justClosed, int total) {
        return closedList(justClosed)
                + "\nAll " + total + " findings covered by this ticket are now suppressed or no longer detected.";
    }

    private static String closedList(List<ClosedFinding> justClosed) {
        if (justClosed.isEmpty()) {
            return "";
        }
        StringBuilder text = new StringBuilder(justClosed.size() == 1
                ? "A finding covered by this ticket no longer needs attention:\n"
                : justClosed.size() + " findings covered by this ticket no longer need attention:\n");
        for (ClosedFinding finding : justClosed) {
            text.append("* {{").append(finding.location()).append("}}");
            if (finding.branch() != null) {
                text.append(" (branch ").append(finding.branch()).append(")");
            }
            text.append(" - ").append(finding.outcome()).append("\n");
        }
        return text.toString();
    }

    private static String displayBranch(ClosedFinding finding) {
        return finding.branch() != null ? finding.branch() : "-";
    }
}
