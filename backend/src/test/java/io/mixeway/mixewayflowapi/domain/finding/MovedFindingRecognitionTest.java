package io.mixeway.mixewayflowapi.domain.finding;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.entity.Vulnerability;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoRepository;
import io.mixeway.mixewayflowapi.db.repository.FindingRepository;
import io.mixeway.mixewayflowapi.domain.coderepo.UpdateCodeRepoService;
import io.mixeway.mixewayflowapi.domain.component.GetOrCreateComponentService;
import io.mixeway.mixewayflowapi.domain.jira.JiraTicketLifecycleService;
import io.mixeway.mixewayflowapi.domain.suppressrule.CheckSuppressRuleService;
import io.mixeway.mixewayflowapi.domain.vulnerability.GetOrCreateVulnerabilityService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Editing a file moves the findings below the edit to other lines. They have to stay the findings they
 * were - suppressed, commented, ticketed - instead of coming back as new ones.
 */
class MovedFindingRecognitionTest {

    private static final String QUERY = "Code where problem is found: query(\"select \" + input)";
    private static final String EXEC = "Code where problem is found: Runtime.getRuntime().exec(command)";

    private FindingRepository findingRepository;
    private JiraTicketLifecycleService jiraTicketLifecycleService;
    private CreateFindingService createFindingService;

    private CodeRepo repo;
    private CodeRepoBranch main;
    private Vulnerability vulnerability;
    private long nextId = 1;

    @BeforeEach
    void setUp() {
        findingRepository = mock(FindingRepository.class);
        jiraTicketLifecycleService = mock(JiraTicketLifecycleService.class);
        when(findingRepository.saveAndFlush(any(Finding.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(findingRepository.findSuppressedInRepo(any())).thenReturn(List.of());

        createFindingService = new CreateFindingService(
                findingRepository,
                mock(GetOrCreateVulnerabilityService.class),
                mock(CheckSuppressRuleService.class),
                mock(GetOrCreateComponentService.class),
                mock(UpdateCodeRepoService.class),
                mock(CodeRepoRepository.class),
                jiraTicketLifecycleService,
                mock(ApplicationEventPublisher.class));

        repo = mock(CodeRepo.class);
        when(repo.getName()).thenReturn("repo");
        main = mock(CodeRepoBranch.class);
        vulnerability = mock(Vulnerability.class);
        when(vulnerability.getId()).thenReturn(7L);
    }

    @Test
    void suppressedFindingStaysSuppressedWhenItsLineChanges() {
        Finding suppressed = known("src/Dao.java:10", QUERY);
        suppressed.suppress(Finding.SuppressedReason.ACCEPTED.name());
        Finding scanned = sast("src/Dao.java:14", QUERY);

        scan(Finding.Source.SAST, List.of(suppressed), scanned);

        assertEquals("src/Dao.java:14", suppressed.getLocation());
        assertEquals(Finding.Status.SUPRESSED, suppressed.getStatus());
        assertEquals(Finding.SuppressedReason.ACCEPTED, suppressed.getSuppressedReason());
        assertNotNull(suppressed.getFingerprint());
        verify(findingRepository, never()).saveAndFlush(scanned);
    }

    @Test
    void activeFindingKeepsItsTicketWhenItsLineChanges() {
        Finding active = known("src/Dao.java:10", QUERY);
        active.updateStatus(Finding.Status.EXISTING, null);
        active.setJiraTicketKey("SEC-1");
        Finding scanned = sast("src/Dao.java:3", QUERY);

        scan(Finding.Source.SAST, List.of(active), scanned);

        assertEquals("src/Dao.java:3", active.getLocation());
        assertEquals(Finding.Status.EXISTING, active.getStatus());
        assertEquals("SEC-1", active.getJiraTicketKey());
        verify(jiraTicketLifecycleService, never()).onFindingRemoved(any());
        verify(findingRepository, never()).saveAndFlush(scanned);
    }

    @Test
    void reindentedCodeIsStillTheSameFinding() {
        Finding suppressed = known("src/Dao.java:10", QUERY);
        suppressed.suppress(Finding.SuppressedReason.ACCEPTED.name());
        Finding scanned = sast("src/Dao.java:11", "Code where problem is found:     query(\"select \"   +   input)");

        scan(Finding.Source.SAST, List.of(suppressed), scanned);

        assertEquals("src/Dao.java:11", suppressed.getLocation());
        assertEquals(Finding.Status.SUPRESSED, suppressed.getStatus());
    }

    @Test
    void changedCodeIsANewFinding() {
        Finding suppressed = known("src/Dao.java:10", QUERY);
        suppressed.suppress(Finding.SuppressedReason.ACCEPTED.name());
        Finding scanned = sast("src/Dao.java:14", EXEC);

        scan(Finding.Source.SAST, List.of(suppressed), scanned);

        assertEquals("src/Dao.java:10", suppressed.getLocation());
        assertEquals(Finding.Status.NEW, scanned.getStatus());
        verify(findingRepository).saveAndFlush(scanned);
    }

    @Test
    void sameCodeInAnotherFileIsANewFinding() {
        Finding suppressed = known("src/Dao.java:10", QUERY);
        suppressed.suppress(Finding.SuppressedReason.ACCEPTED.name());
        Finding scanned = sast("src/OtherDao.java:10", QUERY);

        scan(Finding.Source.SAST, List.of(suppressed), scanned);

        assertEquals("src/Dao.java:10", suppressed.getLocation());
        assertEquals(Finding.Status.NEW, scanned.getStatus());
    }

    @Test
    void identicalCodeFlaggedTwiceIsNotGuessedAt() {
        Finding suppressed = known("src/Dao.java:10", QUERY);
        suppressed.suppress(Finding.SuppressedReason.ACCEPTED.name());
        Finding active = known("src/Dao.java:20", QUERY);
        active.updateStatus(Finding.Status.EXISTING, null);
        Finding first = sast("src/Dao.java:13", QUERY);
        Finding second = sast("src/Dao.java:23", QUERY);

        scan(Finding.Source.SAST, List.of(suppressed, active), first, second);

        assertEquals(Finding.Status.NEW, first.getStatus());
        assertEquals(Finding.Status.NEW, second.getStatus());
        assertEquals("src/Dao.java:10", suppressed.getLocation());
        assertEquals(Finding.Status.REMOVED, active.getStatus());
    }

    @Test
    void ofTwoIdenticalFindingsTheOneThatStayedIsNotMistakenForTheOneThatMoved() {
        Finding suppressed = known("src/Dao.java:10", QUERY);
        suppressed.suppress(Finding.SuppressedReason.ACCEPTED.name());
        Finding active = known("src/Dao.java:20", QUERY);
        active.updateStatus(Finding.Status.EXISTING, null);

        scan(Finding.Source.SAST, List.of(suppressed, active), sast("src/Dao.java:10", QUERY), sast("src/Dao.java:26", QUERY));

        assertEquals("src/Dao.java:10", suppressed.getLocation());
        assertEquals(Finding.Status.SUPRESSED, suppressed.getStatus());
        assertEquals("src/Dao.java:26", active.getLocation());
        assertEquals(Finding.Status.EXISTING, active.getStatus());
    }

    @Test
    void rowLeftBehindByAnEarlierRemovalDoesNotHideTheFindingThatMoved() {
        Finding leftover = known("src/Dao.java:4", QUERY);
        leftover.updateStatus(Finding.Status.REMOVED, null);
        Finding suppressed = known("src/Dao.java:10", QUERY);
        suppressed.suppress(Finding.SuppressedReason.ACCEPTED.name());

        scan(Finding.Source.SAST, List.of(leftover, suppressed), sast("src/Dao.java:14", QUERY));

        assertEquals("src/Dao.java:14", suppressed.getLocation());
        assertEquals(Finding.Status.SUPRESSED, suppressed.getStatus());
        assertEquals(Finding.Status.REMOVED, leftover.getStatus());
    }

    @Test
    void suppressedSecretStaysSuppressedWhenItsLineChanges() {
        String fingerprint = FindingFingerprint.ofSecret("config/app.yml", "generic-api-key", "s3cr3t-value");
        Finding suppressed = known(Finding.Source.SECRETS, "config/app.yml:8", "Found Secret in file config/app.yml. Full fingerprint: abc:config/app.yml:generic-api-key:8");
        suppressed.identifyBy(fingerprint);
        suppressed.suppress(Finding.SuppressedReason.FALSE_POSITIVE.name());
        Finding scanned = finding(Finding.Source.SECRETS, "config/app.yml:12", "Found Secret in file config/app.yml. Full fingerprint: def:config/app.yml:generic-api-key:12");
        scanned.identifyBy(fingerprint);

        scan(Finding.Source.SECRETS, List.of(suppressed), scanned);

        assertEquals("config/app.yml:12", suppressed.getLocation());
        assertEquals(Finding.Status.SUPRESSED, suppressed.getStatus());
        assertEquals(scanned.getExplanation(), suppressed.getExplanation());
    }

    @Test
    void secretSavedBeforeFingerprintsExistedIsRecognisedOnlyAtItsOldLine() {
        Finding legacy = known(Finding.Source.SECRETS, "config/app.yml:8", "Found Secret in file config/app.yml. Full fingerprint: abc:config/app.yml:generic-api-key:8");
        legacy.suppress(Finding.SuppressedReason.FALSE_POSITIVE.name());
        Finding scanned = finding(Finding.Source.SECRETS, "config/app.yml:12", "Found Secret in file config/app.yml. Full fingerprint: def:config/app.yml:generic-api-key:12");
        scanned.identifyBy(FindingFingerprint.ofSecret("config/app.yml", "generic-api-key", "s3cr3t-value"));

        scan(Finding.Source.SECRETS, List.of(legacy), scanned);

        assertEquals("config/app.yml:8", legacy.getLocation());
        assertEquals(Finding.Status.NEW, scanned.getStatus());
    }

    @Test
    void fingerprintIgnoresLineAndWhitespaceButNotFileOrContent() {
        String fingerprint = FindingFingerprint.ofCode("src/Dao.java:10", QUERY);

        assertEquals(fingerprint, FindingFingerprint.ofCode("src/Dao.java:99", "  " + QUERY.replace(" ", "\t ") + "\n"));
        assertNotEquals(fingerprint, FindingFingerprint.ofCode("src/OtherDao.java:10", QUERY));
        assertNotEquals(fingerprint, FindingFingerprint.ofCode("src/Dao.java:10", EXEC));
        assertNull(FindingFingerprint.ofCode("lib:1.0.2", QUERY), "a location that is not file:line cannot be followed");
        assertNull(FindingFingerprint.of(finding(Finding.Source.SCA, "lib:1.0", "CVE description")));
    }

    private void scan(Finding.Source source, List<Finding> knownOnBranch, Finding... scanned) {
        when(findingRepository.findBySourceAndCodeRepoBranchAndCodeRepo(source, main, repo))
                .thenReturn(new ArrayList<>(knownOnBranch));
        createFindingService.saveFindings(new ArrayList<>(List.of(scanned)), main, repo, source, null);
    }

    /** A finding as saved before fingerprints were stored: it has an id and no fingerprint. */
    private Finding known(String location, String explanation) {
        return known(Finding.Source.SAST, location, explanation);
    }

    private Finding known(Finding.Source source, String location, String explanation) {
        Finding finding = finding(source, location, explanation);
        ReflectionTestUtils.setField(finding, "id", nextId++);
        return finding;
    }

    private Finding sast(String location, String explanation) {
        return finding(Finding.Source.SAST, location, explanation);
    }

    private Finding finding(Finding.Source source, String location, String explanation) {
        return new Finding(vulnerability, null, main, repo, null, explanation, location, Finding.Severity.HIGH, source);
    }
}
