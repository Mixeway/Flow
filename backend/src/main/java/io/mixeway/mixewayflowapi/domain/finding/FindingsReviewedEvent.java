package io.mixeway.mixewayflowapi.domain.finding;

/**
 * Findings of a branch were suppressed or re-activated outside of a scan, so whatever was reported
 * about the branch from its last scan (such as a build status) no longer matches its findings.
 */
public record FindingsReviewedEvent(long codeRepoId, long codeRepoBranchId) {
}
