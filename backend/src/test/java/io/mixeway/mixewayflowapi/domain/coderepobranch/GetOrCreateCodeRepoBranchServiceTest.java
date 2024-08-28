package io.mixeway.mixewayflowapi.domain.coderepobranch;

import io.mixeway.mixewayflowapi.config.TestConfig;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.testcontainers.shaded.org.apache.commons.lang3.StringUtils;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@RunWith(SpringRunner.class)
@ActiveProfiles("ut")
@Import(TestConfig.class)
class GetOrCreateCodeRepoBranchServiceTest {

    @Autowired
    GetOrCreateCodeRepoBranchService getOrCreateCodeRepoBranchService;
    @Autowired
    FindCodeRepoService findCodeRepoService;

    @Test
    void getOrCreateCodeRepoBranch_get_ok() {
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(14493750L);
        CodeRepoBranch codeRepoBranch = getOrCreateCodeRepoBranchService.getOrCreateCodeRepoBranch(codeRepo.getDefaultBranch().getName(), codeRepo);
        assertNotNull(codeRepoBranch);
    }
    @Test
    void getOrCreateCodeRepoBranch_create_ok() {
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(14493750L);
        CodeRepoBranch codeRepoBranch = getOrCreateCodeRepoBranchService.getOrCreateCodeRepoBranch("new_branch", codeRepo);
        assertNotNull(codeRepoBranch);
    }
    @Test
    void getOrCreateCodeRepoBranch_create_nok() {
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(14493750L);

        assertThrows(Exception.class, () -> {
            getOrCreateCodeRepoBranchService.getOrCreateCodeRepoBranch(StringUtils.repeat('x', 250), codeRepo);
        });
    }
}