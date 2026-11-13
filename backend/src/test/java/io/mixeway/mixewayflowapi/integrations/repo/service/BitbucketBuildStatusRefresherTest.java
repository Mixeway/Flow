package io.mixeway.mixewayflowapi.integrations.repo.service;

import io.mixeway.mixewayflowapi.domain.finding.FindingsReviewedEvent;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.mockito.Mockito.after;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.timeout;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * A review in Flow refreshes the build status of the reviewed branch - once, however many findings
 * the review touched.
 */
class BitbucketBuildStatusRefresherTest {

    private BitbucketScanReportService reportService;
    private BitbucketBuildStatusRefresher refresher;

    @BeforeEach
    void setUp() {
        reportService = mock(BitbucketScanReportService.class);
        refresher = new BitbucketBuildStatusRefresher(reportService, 100);
    }

    @AfterEach
    void tearDown() {
        refresher.shutdown();
    }

    @Test
    void severalFindingsReviewedAtOnceRefreshTheBranchOnce() {
        for (int i = 0; i < 5; i++) {
            refresher.onFindingsReviewed(new FindingsReviewedEvent(5L, 9L));
        }

        verify(reportService, after(600).times(1)).refreshBuildStatus(5L, 9L);
    }

    @Test
    void eachReviewedBranchIsRefreshed() {
        refresher.onFindingsReviewed(new FindingsReviewedEvent(5L, 9L));
        refresher.onFindingsReviewed(new FindingsReviewedEvent(5L, 11L));

        verify(reportService, timeout(2000)).refreshBuildStatus(5L, 9L);
        verify(reportService, timeout(2000)).refreshBuildStatus(5L, 11L);
    }

    @Test
    void reviewAfterARefreshRefreshesAgainEvenIfTheFirstOneFailed() {
        when(reportService.refreshBuildStatus(5L, 9L)).thenThrow(new IllegalStateException("Bitbucket is down"))
                .thenReturn(true);

        refresher.onFindingsReviewed(new FindingsReviewedEvent(5L, 9L));
        verify(reportService, timeout(2000).times(1)).refreshBuildStatus(5L, 9L);

        refresher.onFindingsReviewed(new FindingsReviewedEvent(5L, 9L));
        verify(reportService, timeout(2000).times(2)).refreshBuildStatus(5L, 9L);
    }
}
