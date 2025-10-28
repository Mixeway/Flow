package io.mixeway.mixewayflowapi.domain.finding;

import io.mixeway.mixewayflowapi.config.TestConfig;
import io.mixeway.mixewayflowapi.db.entity.*;
import io.mixeway.mixewayflowapi.db.repository.FindingRepository;
import io.mixeway.mixewayflowapi.db.repository.VulnerabilityRepository;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.coderepobranch.GetOrCreateCodeRepoBranchService;
import org.junit.jupiter.api.Assumptions;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@RunWith(SpringRunner.class)
@ActiveProfiles("ut")
@Import(TestConfig.class)
@Transactional
class UpdateFindingServiceTest {

    @Autowired
    FindFindingService findFindingService;
    @Autowired
    VulnerabilityRepository vulnerabilityRepository;
    @Autowired
    FindCodeRepoService findCodeRepoService;
    @Autowired
    UpdateFindingService updateFindingService;
    @Autowired
    FindingRepository findingRepository;
    @Autowired
    GetOrCreateCodeRepoBranchService getOrCreateCodeRepoBranchService;

    @Test
    void suppressFinding_ok() {
        Finding finding = findFindingService.findById(1L).get();
        updateFindingService.suppressFinding(finding, "ACCEPTED");
        finding = findFindingService.findById(1L).get();
        assertEquals(Finding.Status.SUPRESSED, finding.getStatus());
        assertEquals(Finding.SuppressedReason.ACCEPTED, finding.getSuppressedReason());
    }
    @Test
    void suppressFinding_nok() {
        Finding finding = findFindingService.findById(1L).get();
        // not suppressed, bad reason
        updateFindingService.suppressFinding(finding, "test");
        finding = findFindingService.findById(1L).get();
        assertEquals(Finding.Status.NEW, finding.getStatus());
        assertNull(finding.getSuppressedReason());
    }

    @Test
    void reactivate() {
        Finding finding = findFindingService.findById(2L).get();
        updateFindingService.suppressFinding(finding, "ACCEPTED");
        finding = findFindingService.findById(2L).get();
        assertEquals(Finding.Status.SUPRESSED, finding.getStatus());
        assertEquals(Finding.SuppressedReason.ACCEPTED, finding.getSuppressedReason());

        updateFindingService.reactivate(finding);
        finding = findFindingService.findById(2L).get();
        assertEquals(Finding.Status.EXISTING, finding.getStatus());
    }


    @Test
    void suppressFindingAcrossBranches_ok() {
        // --- 0) Use an existing finding only to obtain valid repo + some related refs ---
        Finding seedFromDb = findFindingService.findById(1L)
                .orElseThrow(() -> new AssertionError("Seed finding 1L not found in test data"));

        CodeRepo repo              = seedFromDb.getCodeRepo();
        Vulnerability vulnMatch    = seedFromDb.getVulnerability();
        Component component        = seedFromDb.getComponent();          // can be null (DB allows)
        CloudSubscription cloud    = seedFromDb.getCloudSubscription();  // can be null (DB allows)

        // We’ll use these two locations: one that should be fanned-out, one as control
        String locMatch   = "src/main/app/ServiceA.java:123";
        String locControl = "src/main/app/ServiceB.java:77";

        // --- 1) Create a few branches in the SAME repo (via service, as requested) ---
        CodeRepoBranch branchBase = seedFromDb.getCodeRepoBranch(); // existing branch is fine
        CodeRepoBranch branchOne  = getOrCreateCodeRepoBranchService.getOrCreateCodeRepoBranch("feature/suppress-fanout-1",repo );
        CodeRepoBranch branchTwo  = getOrCreateCodeRepoBranchService.getOrCreateCodeRepoBranch("feature/suppress-fanout-2", repo);

        // If the repo has no base branch (can be null in test data), fallback to a created one
        if (branchBase == null) {
            branchBase = branchOne;
        }

        // --- 2) Seed MANY findings in this repo, some matching the fan-out key and some not ---

        // 2a) MATCHING set: same (repo, vulnMatch, locMatch) spread across branches
        Finding mA = new Finding(vulnMatch, component, branchBase, repo, cloud,
                "fixture-match-A", locMatch, Finding.Severity.HIGH, Finding.Source.IAC);
        Finding mB = new Finding(vulnMatch, component, branchOne,  repo, cloud,
                "fixture-match-B", locMatch, Finding.Severity.MEDIUM, Finding.Source.SAST);
        Finding mC = new Finding(vulnMatch, component, branchTwo,  repo, cloud,
                "fixture-match-C", locMatch, Finding.Severity.LOW, Finding.Source.SCA);

        // 2b) CONTROLs that must NOT be suppressed
        //   - same repo + vuln, DIFFERENT location
        Finding cDifferentLocation = new Finding(vulnMatch, component, branchOne, repo, cloud,
                "fixture-control-diffLoc", locControl, Finding.Severity.HIGH, Finding.Source.IAC);

        //   - same repo + location, DIFFERENT vulnerability
        Vulnerability vulnControl = vulnerabilityRepository.findAll().stream()
                .filter(v -> v.getId() != (vulnMatch.getId()))
                .findFirst()
                .orElse(null);
        Finding cDifferentVuln = null;
        if (vulnControl != null) {
            cDifferentVuln = new Finding(vulnControl, component, branchTwo, repo, cloud,
                    "fixture-control-diffVuln", locMatch, Finding.Severity.HIGH, Finding.Source.IAC);
        }

        // Persist everything
        mA = findingRepository.save(mA);
        mB = findingRepository.save(mB);
        mC = findingRepository.save(mC);
        cDifferentLocation = findingRepository.save(cDifferentLocation);
        if (cDifferentVuln != null) {
            cDifferentVuln = findingRepository.save(cDifferentVuln);
        }

        // Preconditions: none of the seeded findings is suppressed yet
        for (Finding f : List.of(mA, mB, mC, cDifferentLocation)) {
            Finding r = findFindingService.findById(f.getId()).orElseThrow();
            assertNotEquals(Finding.Status.SUPRESSED, r.getStatus(), "Precondition violated for id=" + r.getId());
            assertNull(r.getSuppressedReason(), "Precondition violated (reason) for id=" + r.getId());
        }
        if (cDifferentVuln != null) {
            Finding r = findFindingService.findById(cDifferentVuln.getId()).orElseThrow();
            assertNotEquals(Finding.Status.SUPRESSED, r.getStatus());
            assertNull(r.getSuppressedReason());
        }

        // --- 3) SUPPRESS one of the matching findings (this should fan-out by (repo, vuln, location)) ---
        updateFindingService.suppressFindingAcrossBranches(mA,
                mA.getCodeRepo().getId(),
                mA.getLocation(),
                mA.getVulnerability().getId(),
                "ACCEPTED");

        // --- 4) VERIFY: all matching rows (mA, mB, mC) are suppressed with ACCEPTED ---
        for (Finding f : List.of(mA, mB, mC)) {
            Finding r = findFindingService.findById(f.getId()).orElseThrow();
            assertEquals(Finding.Status.SUPRESSED, r.getStatus(), "Expected suppressed for id=" + r.getId());
            assertEquals(Finding.SuppressedReason.ACCEPTED, r.getSuppressedReason(), "Expected ACCEPTED for id=" + r.getId());
        }

        // Sanity: the seedFromDb row (if it happens to share the same key) might also be affected — OPTIONAL check
        if (repo.equals(seedFromDb.getCodeRepo())
                && vulnMatch.equals(seedFromDb.getVulnerability())
                && locMatch.equals(seedFromDb.getLocation())) {
            Finding rSeed = findFindingService.findById(seedFromDb.getId()).orElseThrow();
            assertEquals(Finding.Status.SUPRESSED, rSeed.getStatus());
            assertEquals(Finding.SuppressedReason.ACCEPTED, rSeed.getSuppressedReason());
        }

        // --- 5) VERIFY: controls were NOT suppressed ---
        {
            Finding r = findFindingService.findById(cDifferentLocation.getId()).orElseThrow();
            assertNotEquals(Finding.Status.SUPRESSED, r.getStatus(), "Different location must NOT be suppressed");
            assertNull(r.getSuppressedReason(), "Different location must NOT set suppressedReason");
        }
        if (cDifferentVuln != null) {
            Finding r = findFindingService.findById(cDifferentVuln.getId()).orElseThrow();
            assertNotEquals(Finding.Status.SUPRESSED, r.getStatus(), "Different vulnerability must NOT be suppressed");
            assertNull(r.getSuppressedReason(), "Different vulnerability must NOT set suppressedReason");
        }
    }

    /**
     * Verifies that an invalid reason does NOT suppress siblings.
     * (Adjust if your service throws on bad reason.)
     */
    @Test
    void suppressFindingAcrossBranches_nok_invalidReason() {
        Finding seed = findFindingService.findById(1L)
                .orElseThrow(() -> new AssertionError("Seed finding 1L not found in test data"));

        List<Finding> siblingsBefore = findingRepository
                .findAllByCodeRepoAndVulnerabilityAndLocation(
                        seed.getCodeRepo(),
                        seed.getVulnerability(),
                        seed.getLocation());

        // Call with an invalid reason; service should refuse to suppress
        assertThrows(IllegalArgumentException.class, () ->
                updateFindingService.suppressFindingAcrossBranches(seed,
                        seed.getCodeRepo().getId(),
                        seed.getLocation(),
                        seed.getVulnerability().getId(),
                        "not-a-valid-reason")
        );

        // Verify no sibling changed state
        for (Finding before : siblingsBefore) {
            Finding reloaded = findFindingService.findById(before.getId())
                    .orElseThrow(() -> new AssertionError("Reload failed for id=" + before.getId()));
            assertEquals(before.getStatus(), reloaded.getStatus(),
                    "Status changed despite invalid reason (id=" + reloaded.getId() + ")");
            assertEquals(before.getSuppressedReason(), reloaded.getSuppressedReason(),
                    "Reason changed despite invalid reason (id=" + reloaded.getId() + ")");
        }
    }
}