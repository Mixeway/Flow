package io.mixeway.mixewayflowapi.domain.coderepo;

import io.mixeway.mixewayflowapi.config.TestConfig;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
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
import java.util.Optional;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@RunWith(SpringRunner.class)
@ActiveProfiles("ut")
@Import(TestConfig.class)
class FindCodeRepoServiceTest {
    @Autowired
    FindCodeRepoService findCodeRepoService;
    @Mock
    Principal principal;

    @Test
    void findCodeRepoByUrl() {
        // OK
        Mockito.when(principal.getName()).thenReturn("admin");
        Optional<CodeRepo> codeRepo  = findCodeRepoService.findCodeRepoByUrl("https://gitlab.com/mixingsecurity/dbmixer");
        assertTrue(codeRepo.isPresent());
        //NOK
        codeRepo  = findCodeRepoService.findCodeRepoByUrl("https://gitlab.com/mixingsecurity/dbmixer_TEST");
        assertFalse(codeRepo.isPresent());
    }

    @Test
    void findCodeRepoForUser() {
        Mockito.when(principal.getName()).thenReturn("admin");
        List<CodeRepo> codeRepos = findCodeRepoService.findCodeRepoForUser(principal);
        assertTrue(codeRepos.size() >= 6);

        Mockito.when(principal.getName()).thenReturn("manager");
        codeRepos = findCodeRepoService.findCodeRepoForUser(principal);
        assertTrue(codeRepos.size() >= 3);
    }

    @Test
    void findById() {
        Mockito.when(principal.getName()).thenReturn("admin");
        CodeRepo codeRepo  = findCodeRepoService.findById(1L, principal);
        assertNotNull(codeRepo);
        assertThrows(Exception.class, () -> {
            findCodeRepoService.findById(999L, principal);
        });

        Mockito.when(principal.getName()).thenReturn("manager");
        codeRepo  = findCodeRepoService.findById(5L, principal);
        assertNotNull(codeRepo);
        assertThrows(Exception.class, () -> {
            findCodeRepoService.findById(2L, principal);
        });


    }

    @Test
    void findAll() {
        Iterable<CodeRepo> codeRepos = findCodeRepoService.findAll();
        assertTrue(codeRepos.spliterator().getExactSizeIfKnown() >= 5);
    }

    @Test
    void findByRemoteId() {
        CodeRepo codeRepo  = findCodeRepoService.findByRemoteId(14493750L);
        assertNotNull(codeRepo);
        assertThrows(Exception.class, () -> {
            findCodeRepoService.findByRemoteId(123L);
        });


    }

}