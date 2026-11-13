package io.mixeway.mixewayflowapi.integrations.repo.service;

import io.mixeway.mixewayflowapi.domain.finding.FindingsReviewedEvent;
import jakarta.annotation.PreDestroy;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Keeps the Bitbucket build status of a branch in step with the review of its findings: once findings
 * are suppressed or re-activated in Flow, the status of the last scanned commit is posted again, so a
 * failed build turns green (or a green one fails) without anyone pushing a commit to trigger a scan.
 *
 * <p>A review usually touches several findings in a row, so the refresh waits a moment and then runs
 * once per branch.</p>
 */
@Component
@Log4j2
public class BitbucketBuildStatusRefresher {

    private record BranchKey(long codeRepoId, long branchId) {
    }

    private final BitbucketScanReportService bitbucketScanReportService;
    private final long delayMillis;
    private final Set<BranchKey> pending = ConcurrentHashMap.newKeySet();
    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor(runnable -> {
        Thread thread = new Thread(runnable, "bitbucket-build-status-refresh");
        thread.setDaemon(true);
        return thread;
    });

    @Autowired
    public BitbucketBuildStatusRefresher(BitbucketScanReportService bitbucketScanReportService,
                                         @Value("${bitbucket.build-status-refresh-delay-ms:3000}") long delayMillis) {
        this.bitbucketScanReportService = bitbucketScanReportService;
        this.delayMillis = delayMillis;
    }

    /**
     * Runs once the review is committed (or straight away when it was made outside a transaction), so
     * that the refresh reads the findings as reviewed.
     */
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void onFindingsReviewed(FindingsReviewedEvent event) {
        BranchKey key = new BranchKey(event.codeRepoId(), event.codeRepoBranchId());
        if (!pending.add(key)) {
            // A refresh of this branch is already on its way and will see this change as well.
            return;
        }
        try {
            scheduler.schedule(() -> refresh(key), delayMillis, TimeUnit.MILLISECONDS);
        } catch (RuntimeException e) {
            pending.remove(key);
            log.warn("[Bitbucket Status Refresh] Could not schedule a refresh for repo {}: {}",
                    key.codeRepoId(), e.getMessage());
        }
    }

    private void refresh(BranchKey key) {
        // Cleared first: a review arriving while the status is being posted schedules another refresh.
        pending.remove(key);
        try {
            bitbucketScanReportService.refreshBuildStatus(key.codeRepoId(), key.branchId());
        } catch (Exception e) {
            log.error("[Bitbucket Status Refresh] Failed to refresh the build status of repo {} branch {}: {}",
                    key.codeRepoId(), key.branchId(), e.getMessage(), e);
        }
    }

    @PreDestroy
    void shutdown() {
        scheduler.shutdownNow();
    }
}
