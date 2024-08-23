package io.mixeway.mixewayflowapi.domain.finding;

import io.mixeway.mixewayflowapi.config.TestConfig;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.repository.VulnerabilityRepository;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.testcontainers.shaded.org.apache.commons.lang3.StringUtils;
import org.testcontainers.shaded.org.checkerframework.checker.units.qual.A;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@RunWith(SpringRunner.class)
@ActiveProfiles("ut")
@Import(TestConfig.class)
class UpdateFindingServiceTest {

    @Autowired
    FindFindingService findFindingService;
    @Autowired
    VulnerabilityRepository vulnerabilityRepository;
    @Autowired
    FindCodeRepoService findCodeRepoService;
    @Autowired
    UpdateFindingService updateFindingService;

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
}