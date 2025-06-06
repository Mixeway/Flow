package io.mixeway.mixewayflowapi.domain.coderepofindingstats;

import io.mixeway.mixewayflowapi.api.coderepo.dto.AggregatedRepoStatsDTO;
import io.mixeway.mixewayflowapi.config.TestConfig;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoFindingStats;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.security.Principal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@RunWith(SpringRunner.class)
@ActiveProfiles("ut")
@Import(TestConfig.class)
class FindCodeRepoFindingStatsServiceTest {
    @Autowired
    FindCodeRepoFindingStatsService findCodeRepoFindingStatsService;
    @Autowired
    FindCodeRepoService findCodeRepoService;
    @Autowired
    CreateCodeRepoFindingStatsService createCodeRepoFindingStatsService;
    @Mock
    Principal principal;

    @Test
    void getStatsForRepo() {
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(14493750L);
        List<CodeRepoFindingStats> codeRepoFindingStatsList = findCodeRepoFindingStatsService.getStatsForRepo(codeRepo);
        assertFalse(codeRepoFindingStatsList.isEmpty());
    }

    @Test
    void getAggregatedStatsForLastSevenDays() {
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(14493750L);
        Mockito.when(principal.getName()).thenReturn("admin");

        createCodeRepoFindingStatsService.create(
                new CodeRepoFindingStats(
                        codeRepo,1,2,3,4,1,
                        2,3,4,5,1,2,
                        3,4,1,2,3,
                        4,1,2,3,
                        4,1,2,3));
        AggregatedRepoStatsDTO aggregatedRepoStatsDTO = findCodeRepoFindingStatsService.getAggregatedStatsForLastSevenDays(principal);
        assertFalse(aggregatedRepoStatsDTO.getActiveFindings().isEmpty());
        assertFalse(aggregatedRepoStatsDTO.getRemovedFindingsList().isEmpty());
        assertFalse(aggregatedRepoStatsDTO.getReviewedFindingsList().isEmpty());
        assertFalse(aggregatedRepoStatsDTO.getAverageFixTimeList().isEmpty());
    }
}