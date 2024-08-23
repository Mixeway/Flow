package io.mixeway.mixewayflowapi.domain.finding;


import io.mixeway.mixewayflowapi.api.coderepo.dto.VulnStatsResponseDto;
import io.mixeway.mixewayflowapi.config.TestConfig;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.entity.Vulnerability;
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

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
@RunWith(SpringRunner.class)
@ActiveProfiles("ut")
@Import(TestConfig.class)
class FindFindingServiceTest {

    @Autowired
    FindFindingService findFindingService;
    @Autowired
    VulnerabilityRepository vulnerabilityRepository;
    @Autowired
    FindCodeRepoService findCodeRepoService;

    @Test
    void countFindingStatsForRepo() {
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(14493750L);

        VulnStatsResponseDto vulnStatsResponseDto = findFindingService.countFindingStatsForRepo(codeRepo);

        assertTrue((vulnStatsResponseDto.getIac() + vulnStatsResponseDto.getSecrets() + vulnStatsResponseDto.getSast() )> 0 );
    }

    @Test
    void getCodeRepoFindings() {
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(14493750L);
        List<Finding> findings = findFindingService.getCodeRepoFindings(codeRepo,codeRepo.getDefaultBranch());
        assertTrue( findings.size()> 0);
    }

    @Test
    void findById_ok() {
        Optional<Finding> finding = findFindingService.findById(1L);
        assertTrue(finding.isPresent());
    }

    @Test
    void findById_nok(){
        Optional<Finding> finding = findFindingService.findById(100000L);
        assertFalse(finding.isPresent());
    }

    @Test
    void findByVulnerability_ok() {
        List<Finding> findingList = findFindingService.findByVulnerability(vulnerabilityRepository.findById(1L).get());
        assertTrue(findingList.size() > 0);
    }
    @Test
    void findByVulnerability_nok() {
        List<Finding> findingList = findFindingService.findByVulnerability(null);
        assertFalse(findingList.size() > 0);
    }
}