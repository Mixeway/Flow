package io.mixeway.mixewayflowapi.domain.finding;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.entity.Vulnerability;
import io.mixeway.mixewayflowapi.db.projection.SuppressedFindingProjection;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoRepository;
import io.mixeway.mixewayflowapi.db.repository.FindingRepository;
import io.mixeway.mixewayflowapi.domain.coderepo.UpdateCodeRepoService;
import io.mixeway.mixewayflowapi.domain.component.GetOrCreateComponentService;
import io.mixeway.mixewayflowapi.domain.jira.JiraTicketLifecycleService;
import io.mixeway.mixewayflowapi.domain.suppressrule.CheckSuppressRuleService;
import io.mixeway.mixewayflowapi.domain.vulnerability.GetOrCreateVulnerabilityService;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * A finding reviewed and suppressed on a feature branch has to stay suppressed on the branch it is
 * merged into. Runs without a database: the repository is mocked.
 */
class SuppressionAcrossBranchesTest {

    private static final String SNIPPET = "Code where problem is found: query(\"select \" + input)";

    private FindingRepository findingRepository;
    private JiraTicketLifecycleService jiraTicketLifecycleService;
    private CreateFindingService createFindingService;
    private UpdateFindingService updateFindingService;

    private CodeRepo repo;
    private CodeRepoBranch main;
    private CodeRepoBranch feature;
    private Vulnerability vulnerability;

    @BeforeEach
    void setUp() {
        findingRepository = mock(FindingRepository.class);
        jiraTicketLifecycleService = mock(JiraTicketLifecycleService.class);
        when(findingRepository.saveAndFlush(any(Finding.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(findingRepository.save(any(Finding.class))).thenAnswer(invocation -> invocation.getArgument(0));

        createFindingService = new CreateFindingService(
                findingRepository,
                mock(GetOrCreateVulnerabilityService.class),
                mock(CheckSuppressRuleService.class),
                mock(GetOrCreateComponentService.class),
                mock(UpdateCodeRepoService.class),
                mock(CodeRepoRepository.class),
                jiraTicketLifecycleService,
                mock(ApplicationEventPublisher.class));
        updateFindingService = new UpdateFindingService(findingRepository, mock(EntityManager.class),
                jiraTicketLifecycleService, mock(ApplicationEventPublisher.class));

        repo = mock(CodeRepo.class);
        when(repo.getName()).thenReturn("repo");
        when(repo.getRepourl()).thenReturn("https://git.example.test/repo");
        main = mock(CodeRepoBranch.class);
        feature = mock(CodeRepoBranch.class);
        vulnerability = mock(Vulnerability.class);
        when(vulnerability.getId()).thenReturn(7L);
        when(vulnerability.getName()).thenReturn("SQL injection");
    }

    @Test
    void findingNewOnMainInheritsSuppressionFromFeatureBranch() {
        LocalDate until = LocalDate.now().plusDays(30);
        suppressedInRepo(suppression("lib:1.0", Finding.SuppressedReason.ACCEPTED, until));
        Finding onMain = finding(main, "lib:1.0", "CVE description", Finding.Source.SCA);

        scan(main, Finding.Source.SCA, List.of(), onMain);

        assertEquals(Finding.Status.SUPRESSED, onMain.getStatus());
        assertEquals(Finding.SuppressedReason.ACCEPTED, onMain.getSuppressedReason());
        assertEquals(until, onMain.getSuppressedUntil());
    }

    @Test
    void findingAlreadyKnownOnMainInheritsSuppressionFromFeatureBranch() {
        suppressedInRepo(suppression("lib:1.0", Finding.SuppressedReason.FALSE_POSITIVE, null));
        Finding knownOnMain = finding(main, "lib:1.0", "CVE description", Finding.Source.SCA);
        knownOnMain.updateStatus(Finding.Status.EXISTING, null);

        scan(main, Finding.Source.SCA, List.of(knownOnMain), finding(main, "lib:1.0", "CVE description", Finding.Source.SCA));

        assertEquals(Finding.Status.SUPRESSED, knownOnMain.getStatus());
        assertEquals(Finding.SuppressedReason.FALSE_POSITIVE, knownOnMain.getSuppressedReason());
        verify(jiraTicketLifecycleService).onFindingSuppressed(knownOnMain);
    }

    @Test
    void findingWithoutSuppressionElsewhereStaysActive() {
        suppressedInRepo(suppression("other-lib:2.0", Finding.SuppressedReason.ACCEPTED, null));
        Finding fresh = finding(main, "lib:1.0", "CVE description", Finding.Source.SCA);
        Finding known = finding(main, "lib:3.0", "CVE description", Finding.Source.SCA);
        known.updateStatus(Finding.Status.EXISTING, null);

        scan(main, Finding.Source.SCA, List.of(known), fresh, finding(main, "lib:3.0", "CVE description", Finding.Source.SCA));

        assertEquals(Finding.Status.NEW, fresh.getStatus());
        assertEquals(Finding.Status.EXISTING, known.getStatus());
        assertNull(known.getSuppressedReason());
        verify(jiraTicketLifecycleService, never()).onFindingSuppressed(any());
    }

    @Test
    void expiredSuppressionIsNotInherited() {
        suppressedInRepo(suppression("lib:1.0", Finding.SuppressedReason.ACCEPTED, LocalDate.now()));
        Finding onMain = finding(main, "lib:1.0", "CVE description", Finding.Source.SCA);

        scan(main, Finding.Source.SCA, List.of(), onMain);

        assertEquals(Finding.Status.NEW, onMain.getStatus());
    }

    @Test
    void sastFindingMovedToAnotherLineByTheMergeInheritsSuppression() {
        suppressedInRepo();
        Finding reviewedOnFeature = finding(feature, "src/Dao.java:10", SNIPPET, Finding.Source.SAST);
        reviewedOnFeature.suppress(Finding.SuppressedReason.FALSE_POSITIVE.name());
        when(findingRepository.findSuppressedWithSameExplanation(repo, vulnerability, Finding.Source.SAST, SNIPPET))
                .thenReturn(List.of(reviewedOnFeature));
        Finding onMain = finding(main, "src/Dao.java:14", SNIPPET, Finding.Source.SAST);

        scan(main, Finding.Source.SAST, List.of(), onMain);

        assertEquals(Finding.Status.SUPRESSED, onMain.getStatus());
        assertEquals(Finding.SuppressedReason.FALSE_POSITIVE, onMain.getSuppressedReason());
    }

    @Test
    void sameCodeInAnotherFileDoesNotInheritSuppression() {
        suppressedInRepo();
        Finding reviewedOnFeature = finding(feature, "src/Dao.java:10", SNIPPET, Finding.Source.SAST);
        reviewedOnFeature.suppress(Finding.SuppressedReason.FALSE_POSITIVE.name());
        when(findingRepository.findSuppressedWithSameExplanation(repo, vulnerability, Finding.Source.SAST, SNIPPET))
                .thenReturn(List.of(reviewedOnFeature));
        Finding onMain = finding(main, "src/OtherDao.java:10", SNIPPET, Finding.Source.SAST);

        scan(main, Finding.Source.SAST, List.of(), onMain);

        assertEquals(Finding.Status.NEW, onMain.getStatus());
    }

    @Test
    void sameCodeReportedTwiceInTheFileIsAmbiguousAndStaysActive() {
        suppressedInRepo();
        Finding reviewedOnFeature = finding(feature, "src/Dao.java:10", SNIPPET, Finding.Source.SAST);
        reviewedOnFeature.suppress(Finding.SuppressedReason.FALSE_POSITIVE.name());
        when(findingRepository.findSuppressedWithSameExplanation(repo, vulnerability, Finding.Source.SAST, SNIPPET))
                .thenReturn(List.of(reviewedOnFeature));
        Finding first = finding(main, "src/Dao.java:14", SNIPPET, Finding.Source.SAST);
        Finding second = finding(main, "src/Dao.java:40", SNIPPET, Finding.Source.SAST);

        scan(main, Finding.Source.SAST, List.of(), first, second);

        assertEquals(Finding.Status.NEW, first.getStatus());
        assertEquals(Finding.Status.NEW, second.getStatus());
    }

    @Test
    void scaFindingForAnotherPackageVersionDoesNotInheritSuppression() {
        suppressedInRepo(suppression("lib:1.0", Finding.SuppressedReason.ACCEPTED, null));
        Finding suppressedOldVersion = finding(feature, "lib:1.0", "CVE description", Finding.Source.SCA);
        suppressedOldVersion.suppress(Finding.SuppressedReason.ACCEPTED.name());
        when(findingRepository.findSuppressedWithSameExplanation(any(), any(), any(), any()))
                .thenReturn(List.of(suppressedOldVersion));
        Finding newVersion = finding(main, "lib:1.1", "CVE description", Finding.Source.SCA);

        scan(main, Finding.Source.SCA, List.of(), newVersion);

        assertEquals(Finding.Status.NEW, newVersion.getStatus());
    }

    @Test
    void reactivatingAFindingReactivatesItOnEveryBranch() {
        Finding onMain = withId(finding(main, "lib:1.0", "CVE description", Finding.Source.SCA), 1L);
        Finding onFeature = withId(finding(feature, "lib:1.0", "CVE description", Finding.Source.SCA), 2L);
        Finding removedOnOtherBranch = withId(finding(feature, "lib:1.0", "CVE description", Finding.Source.SCA), 3L);
        onMain.suppress(Finding.SuppressedReason.ACCEPTED.name());
        onFeature.suppress(Finding.SuppressedReason.ACCEPTED.name());
        removedOnOtherBranch.updateStatus(Finding.Status.REMOVED, null);
        when(findingRepository.findAllByCodeRepoAndVulnerabilityAndLocation(repo, vulnerability, "lib:1.0"))
                .thenReturn(List.of(onMain, onFeature, removedOnOtherBranch));

        updateFindingService.reactivateAcrossBranches(onMain);

        assertEquals(Finding.Status.EXISTING, onMain.getStatus());
        assertEquals(Finding.Status.EXISTING, onFeature.getStatus());
        assertNull(onFeature.getSuppressedReason());
        assertEquals(Finding.Status.REMOVED, removedOnOtherBranch.getStatus());
    }

    private void scan(CodeRepoBranch branch, Finding.Source source, List<Finding> knownOnBranch, Finding... scanned) {
        when(findingRepository.findBySourceAndCodeRepoBranchAndCodeRepo(source, branch, repo))
                .thenReturn(new ArrayList<>(knownOnBranch));
        createFindingService.saveFindings(new ArrayList<>(List.of(scanned)), branch, repo, source, null);
    }

    private void suppressedInRepo(SuppressedFindingProjection... suppressions) {
        when(findingRepository.findSuppressedInRepo(repo)).thenReturn(List.of(suppressions));
    }

    private SuppressedFindingProjection suppression(String location, Finding.SuppressedReason reason, LocalDate until) {
        SuppressedFindingProjection suppression = mock(SuppressedFindingProjection.class);
        when(suppression.getVulnerabilityId()).thenReturn(7L);
        when(suppression.getLocation()).thenReturn(location);
        when(suppression.getSuppressedReason()).thenReturn(reason);
        when(suppression.getSuppressedUntil()).thenReturn(until);
        return suppression;
    }

    private Finding finding(CodeRepoBranch branch, String location, String explanation, Finding.Source source) {
        return new Finding(vulnerability, null, branch, repo, null, explanation, location, Finding.Severity.HIGH, source);
    }

    private static Finding withId(Finding finding, long id) {
        ReflectionTestUtils.setField(finding, "id", id);
        return finding;
    }
}
