package io.mixeway.mixewayflowapi.api.stats;

import io.mixeway.mixewayflowapi.api.stats.dto.TopRepoFindingsDto;
import io.mixeway.mixewayflowapi.api.stats.dto.TopVulnerabilityDto;
import io.mixeway.mixewayflowapi.config.TestConfig;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.repository.FindingRepository;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@RunWith(SpringRunner.class)
@ActiveProfiles("ut")
@Import(TestConfig.class)
class StatsControllerTopReposAndVulnsTest {

    @Autowired
    FindingRepository findingRepository;

    @Autowired
    FindCodeRepoService findCodeRepoService;

    @Test
    void findTopReposDetailed_returnsResults() {
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(14493750L);
        assertNotNull(codeRepo, "Test fixture repo should exist");

        List<Object[]> rows = findingRepository.findTopReposDetailed(
                Collections.singletonList(codeRepo.getId()), 20);
        assertNotNull(rows);

        if (!rows.isEmpty()) {
            Object[] first = rows.get(0);
            assertEquals(12, first.length, "Expected 12 columns in result row");

            TopRepoFindingsDto dto = mapToRepoDto(first);
            assertEquals(codeRepo.getId(), dto.getRepoId());
            assertNotNull(dto.getRepoName());
            assertNotNull(dto.getTeamName());
            assertTrue(dto.getTotal() > 0, "Should have at least one finding");
            assertTrue(dto.getTotal() >= dto.getUrgent() + dto.getNotable(),
                    "Total should be >= urgent + notable");
        }
    }

    @Test
    void findTopReposDetailed_emptyRepoIds_returnsEmpty() {
        List<Object[]> rows = findingRepository.findTopReposDetailed(
                Collections.singletonList(-1L), 20);
        assertNotNull(rows);
        assertTrue(rows.isEmpty());
    }

    @Test
    void findTopReposDetailed_respectsLimit() {
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(14493750L);
        List<Object[]> rows = findingRepository.findTopReposDetailed(
                Collections.singletonList(codeRepo.getId()), 1);
        assertTrue(rows.size() <= 1, "Limit of 1 should return at most 1 result");
    }

    @Test
    void findTopReposDetailed_scannerCountsAreConsistent() {
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(14493750L);
        List<Object[]> rows = findingRepository.findTopReposDetailed(
                Collections.singletonList(codeRepo.getId()), 20);

        for (Object[] row : rows) {
            TopRepoFindingsDto dto = mapToRepoDto(row);
            long scannerSum = dto.getSast() + dto.getSca() + dto.getIac()
                    + dto.getSecrets() + dto.getDast() + dto.getGitlab();
            assertEquals(dto.getTotal(), scannerSum,
                    "Sum of all scanner counts should equal total for repo " + dto.getRepoName());
        }
    }

    @Test
    void findTopVulnerabilitiesBySource_returnsValidStructure() {
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(14493750L);
        assertNotNull(codeRepo, "Test fixture repo should exist");
        List<Long> ids = Collections.singletonList(codeRepo.getId());

        String[] sources = {"SAST", "SCA", "IAC", "SECRETS", "DAST", "GITLAB_SCANNER"};
        for (String source : sources) {
            List<Object[]> rows = findingRepository.findTopVulnerabilitiesBySource(ids, source, 20);
            assertNotNull(rows, "Result for source " + source + " should not be null");
            for (Object[] row : rows) {
                assertEquals(4, row.length, "Expected 4 columns for source " + source);
                TopVulnerabilityDto dto = mapToVulnDto(row);
                assertNotNull(dto.getVulnName());
                assertTrue(dto.getCount() > 0);
            }
        }
    }

    @Test
    void findTopVulnerabilitiesBySource_emptyRepoIds_returnsEmpty() {
        List<Object[]> rows = findingRepository.findTopVulnerabilitiesBySource(
                Collections.singletonList(-1L), "SAST", 20);
        assertNotNull(rows);
        assertTrue(rows.isEmpty());
    }

    @Test
    void findTopVulnerabilitiesBySource_respectsLimit() {
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(14493750L);
        List<Long> ids = Collections.singletonList(codeRepo.getId());
        List<Object[]> rows = findingRepository.findTopVulnerabilitiesBySource(ids, "SAST", 1);
        assertTrue(rows.size() <= 1, "Limit of 1 should return at most 1 result");
    }

    private TopRepoFindingsDto mapToRepoDto(Object[] r) {
        return new TopRepoFindingsDto(
                ((Number) r[0]).longValue(), (String) r[1], (String) r[2],
                ((Number) r[3]).longValue(), ((Number) r[4]).longValue(),
                ((Number) r[5]).longValue(), ((Number) r[6]).longValue(),
                ((Number) r[7]).longValue(), ((Number) r[8]).longValue(),
                ((Number) r[9]).longValue(), ((Number) r[10]).longValue(),
                ((Number) r[11]).longValue()
        );
    }

    private TopVulnerabilityDto mapToVulnDto(Object[] r) {
        return new TopVulnerabilityDto(
                ((Number) r[0]).longValue(), (String) r[1], (String) r[2],
                ((Number) r[3]).longValue()
        );
    }
}
