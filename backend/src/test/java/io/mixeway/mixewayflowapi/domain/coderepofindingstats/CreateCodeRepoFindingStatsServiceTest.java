package io.mixeway.mixewayflowapi.domain.coderepofindingstats;

import io.mixeway.mixewayflowapi.config.TestConfig;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoFindingStats;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoFindingStatsRepository;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.testcontainers.shaded.org.checkerframework.checker.units.qual.A;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@RunWith(SpringRunner.class)
@ActiveProfiles("ut")
@Import(TestConfig.class)
class CreateCodeRepoFindingStatsServiceTest {
    @Autowired
    CreateCodeRepoFindingStatsService createCodeRepoFindingStatsService;
    @Autowired
    FindCodeRepoFindingStatsService findCodeRepoFindingStatsService;
    @Autowired
    FindCodeRepoService findCodeRepoService;
    @Autowired
    CodeRepoFindingStatsRepository codeRepoFindingStatsRepository;

    @Test
    void create() {
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(14493750L);
        List<CodeRepoFindingStats> codeRepoFindingStats = codeRepoFindingStatsRepository.findByCodeRepo(codeRepo);
        int before = codeRepoFindingStats.size();

        createCodeRepoFindingStatsService.create(
                new CodeRepoFindingStats(
                        codeRepo,1,2,3,4,1,
                        2,3,4,5,1,2,
                        3,4,1,2,3,
                        4,1,2,3,
                        4,1,2,3));
        codeRepoFindingStats = codeRepoFindingStatsRepository.findByCodeRepo(codeRepo);
        int after = codeRepoFindingStats.size();
        System.out.println("old " + before);
        System.out.println("new " + after);
        assertTrue(after > before);
    }
}