package io.mixeway.mixewayflowapi.domain.jira;

import java.util.List;

/**
 * Event published after new findings are persisted (transaction committed).
 * Used to trigger automatic JIRA ticket creation.
 */
public class NewFindingsEvent {
    private final List<Long> findingIds;

    public NewFindingsEvent(List<Long> findingIds) {
        this.findingIds = findingIds;
    }

    public List<Long> getFindingIds() {
        return findingIds;
    }
}


