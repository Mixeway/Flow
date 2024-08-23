package io.mixeway.mixewayflowapi.domain.coderepobranch;

import io.mixeway.mixewayflowapi.config.TestConfig;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@RunWith(SpringRunner.class)
@ActiveProfiles("ut")
@Import(TestConfig.class)
class FindCodeRepoBranchServiceTest {
    @Autowired
    FindCodeRepoBranchService findCodeRepoBranchService;

    @Test
    void findById_ok() {
        Optional<CodeRepoBranch> codeRepoBranch =findCodeRepoBranchService.findById(1L);
        assertTrue(codeRepoBranch.isPresent());
    }
    @Test
    void findById_nok() {
        Optional<CodeRepoBranch> codeRepoBranch =findCodeRepoBranchService.findById(1000L);
        assertFalse(codeRepoBranch.isPresent());
    }
}