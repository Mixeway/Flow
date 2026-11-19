package io.mixeway.mixewayflowapi.integrations.repo.apiclient;

/**
 * GitLab API call failed. {@code status == 429} carries the server {@code Retry-After} in seconds.
 */
public final class GitLabApiException extends RuntimeException {

    private final int status;
    private final long retryAfterSeconds;

    GitLabApiException(int status, long retryAfterSeconds) {
        super(status == 429
                ? "GitLab rate limited, retry after " + retryAfterSeconds + "s"
                : "GitLab API HTTP " + status);
        this.status = status;
        this.retryAfterSeconds = retryAfterSeconds;
    }

    public int status() {
        return status;
    }

    public long retryAfterSeconds() {
        return retryAfterSeconds;
    }

    public boolean isRateLimited() {
        return status == 429;
    }

    /**
     * The project list endpoint is missing or the token cannot call it.
     * Callers should fall back to one request per repository.
     */
    public boolean isListUnavailable() {
        return status == 400 || status == 401 || status == 403 || status == 404;
    }
}
