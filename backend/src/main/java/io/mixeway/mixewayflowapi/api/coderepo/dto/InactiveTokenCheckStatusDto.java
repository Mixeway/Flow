package io.mixeway.mixewayflowapi.api.coderepo.dto;

import java.time.Instant;

/**
 * State of the background inactive access token check. {@code report} is set only when {@code state} is DONE.
 */
public record InactiveTokenCheckStatusDto(
        State state,
        String requestedBy,
        Instant startedAt,
        Instant finishedAt,
        int checkedRepositories,
        int totalRepositories,
        InactiveTokenReportDto report
) {
    public enum State {
        IDLE, RUNNING, DONE, FAILED
    }

    public static InactiveTokenCheckStatusDto idle() {
        return new InactiveTokenCheckStatusDto(State.IDLE, null, null, null, 0, 0, null);
    }

    public InactiveTokenCheckStatusDto withProgress(int checked, int total) {
        return new InactiveTokenCheckStatusDto(state, requestedBy, startedAt, finishedAt, checked, total, report);
    }
}
