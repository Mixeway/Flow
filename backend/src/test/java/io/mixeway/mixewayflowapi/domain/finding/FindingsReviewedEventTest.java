package io.mixeway.mixewayflowapi.domain.finding;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.entity.Vulnerability;
import io.mixeway.mixewayflowapi.db.repository.FindingRepository;
import io.mixeway.mixewayflowapi.domain.jira.JiraTicketLifecycleService;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Suppressing or re-activating findings is announced for every branch it changes, so that what was
 * reported about those branches (the Bitbucket build status) can follow.
 */
class FindingsReviewedEventTest {

    private static final long REPO_ID = 5L;
    private static final long MAIN_ID = 9L;
    private static final long FEATURE_ID = 11L;
    private static final long VULNERABILITY_ID = 7L;
    private static final String LOCATION = "src/Dao.java:10";

    private FindingRepository findingRepository;
    private ApplicationEventPublisher eventPublisher;
    private UpdateFindingService updateFindingService;

    private CodeRepo repo;
    private CodeRepoBranch main;
    private CodeRepoBranch feature;
    private Vulnerability vulnerability;

    @BeforeEach
    void setUp() {
        findingRepository = mock(FindingRepository.class);
        eventPublisher = mock(ApplicationEventPublisher.class);
        updateFindingService = new UpdateFindingService(findingRepository, mock(EntityManager.class),
                mock(JiraTicketLifecycleService.class), eventPublisher);

        repo = mock(CodeRepo.class);
        when(repo.getId()).thenReturn(REPO_ID);
        when(repo.getName()).thenReturn("repo");
        main = mock(CodeRepoBranch.class);
        when(main.getId()).thenReturn(MAIN_ID);
        feature = mock(CodeRepoBranch.class);
        when(feature.getId()).thenReturn(FEATURE_ID);
        vulnerability = mock(Vulnerability.class);
        when(vulnerability.getId()).thenReturn(VULNERABILITY_ID);
    }

    @Test
    void suppressingAcrossBranchesAnnouncesEveryBranchWhereTheFindingWasOpen() {
        when(findingRepository.findBranchIdsWithOpenFinding(REPO_ID, VULNERABILITY_ID, LOCATION))
                .thenReturn(List.of(MAIN_ID, FEATURE_ID));

        updateFindingService.suppressFindingAcrossBranches(finding(1L, feature), REPO_ID, LOCATION,
                VULNERABILITY_ID, Finding.SuppressedReason.FALSE_POSITIVE.name());

        verify(eventPublisher).publishEvent(new FindingsReviewedEvent(REPO_ID, MAIN_ID));
        verify(eventPublisher).publishEvent(new FindingsReviewedEvent(REPO_ID, FEATURE_ID));
    }

    @Test
    void suppressingWhatIsAlreadySuppressedEverywhereAnnouncesNothing() {
        when(findingRepository.findBranchIdsWithOpenFinding(REPO_ID, VULNERABILITY_ID, LOCATION))
                .thenReturn(List.of());

        updateFindingService.suppressFindingAcrossBranches(finding(1L, feature), REPO_ID, LOCATION,
                VULNERABILITY_ID, Finding.SuppressedReason.FALSE_POSITIVE.name());

        verify(eventPublisher, never()).publishEvent(any(Object.class));
    }

    @Test
    void reactivatingAcrossBranchesAnnouncesEveryBranchThatGotTheFindingBack() {
        Finding onFeature = finding(1L, feature);
        onFeature.suppress(Finding.SuppressedReason.ACCEPTED.name());
        Finding onMain = finding(2L, main);
        onMain.suppress(Finding.SuppressedReason.ACCEPTED.name());
        when(findingRepository.findAllByCodeRepoAndVulnerabilityAndLocation(repo, vulnerability, LOCATION))
                .thenReturn(List.of(onFeature, onMain));

        updateFindingService.reactivateAcrossBranches(onFeature);

        verify(eventPublisher).publishEvent(new FindingsReviewedEvent(REPO_ID, FEATURE_ID));
        verify(eventPublisher).publishEvent(new FindingsReviewedEvent(REPO_ID, MAIN_ID));
    }

    @Test
    void suppressingASingleFindingAnnouncesItsBranch() {
        updateFindingService.suppressFinding(finding(1L, main), Finding.SuppressedReason.WONT_FIX.name());

        verify(eventPublisher).publishEvent(new FindingsReviewedEvent(REPO_ID, MAIN_ID));
    }

    private Finding finding(long id, CodeRepoBranch branch) {
        Finding finding = new Finding(vulnerability, null, branch, repo, null, "explanation", LOCATION,
                Finding.Severity.HIGH, Finding.Source.SAST);
        ReflectionTestUtils.setField(finding, "id", id);
        return finding;
    }
}
