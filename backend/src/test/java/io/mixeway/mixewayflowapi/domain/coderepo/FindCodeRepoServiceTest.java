package io.mixeway.mixewayflowapi.domain.coderepo;

import io.mixeway.mixewayflowapi.config.TestConfig;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import org.junit.jupiter.api.BeforeEach;
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

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@RunWith(SpringRunner.class)
@ActiveProfiles("ut")
@Import(TestConfig.class)
class FindCodeRepoServiceTest {

    @Autowired
    private FindCodeRepoService findCodeRepoService;

    @Mock
    private Principal principal;

    @BeforeEach
    void setUp() {
        // Common setup can be placed here if needed
    }

    /**
     * Test that findCodeRepoByUrl returns a non-empty Optional when the repository exists.
     */
    @Test
    void testFindCodeRepoByUrl_RepoExists() {
        Mockito.when(principal.getName()).thenReturn("admin");
        Optional<CodeRepo> codeRepo = findCodeRepoService.findCodeRepoByUrl("https://gitlab.com/mixingsecurity/dbmixer");
        assertTrue(codeRepo.isPresent(), "Code repository should be present for the given URL");
    }

    /**
     * Test that findCodeRepoByUrl returns an empty Optional when the repository does not exist.
     */
    @Test
    void testFindCodeRepoByUrl_RepoDoesNotExist() {
        Mockito.when(principal.getName()).thenReturn("admin");
        Optional<CodeRepo> codeRepo = findCodeRepoService.findCodeRepoByUrl("https://gitlab.com/mixingsecurity/dbmixer_TEST");
        assertFalse(codeRepo.isPresent(), "Code repository should not be present for the given URL");
    }

    /**
     * Test that findCodeRepoForUser returns repositories for 'admin' user.
     */
    @Test
    void testFindCodeRepoForUser_Admin() {
        Mockito.when(principal.getName()).thenReturn("admin");
        List<CodeRepo> codeRepos = findCodeRepoService.findCodeRepoForUser(principal);
        assertTrue(codeRepos.size() >= 6, "Admin should have at least 6 code repositories");
    }

    /**
     * Test that findCodeRepoForUser returns repositories for 'manager' user.
     */
    @Test
    void testFindCodeRepoForUser_Manager() {
        Mockito.when(principal.getName()).thenReturn("manager");
        List<CodeRepo> codeRepos = findCodeRepoService.findCodeRepoForUser(principal);
        assertTrue(codeRepos.size() >= 3, "Manager should have at least 3 code repositories");
    }

    /**
     * Test that findById returns the code repository for a valid ID and 'admin' user.
     */
    @Test
    void testFindById_Admin_ValidId() {
        Mockito.when(principal.getName()).thenReturn("admin");
        CodeRepo codeRepo = findCodeRepoService.findById(1L, principal);
        assertNotNull(codeRepo, "Code repository should be found for admin with ID 1");
    }

    /**
     * Test that findById throws an exception for an invalid ID and 'admin' user.
     */
    @Test
    void testFindById_Admin_InvalidId() {
        Mockito.when(principal.getName()).thenReturn("admin");
        assertThrows(Exception.class, () -> {
            findCodeRepoService.findById(999L, principal);
        }, "Expected exception when admin tries to find code repo with invalid ID");
    }

    /**
     * Test that findById returns the code repository for a valid ID and 'manager' user.
     */
    @Test
    void testFindById_Manager_ValidId() {
        Mockito.when(principal.getName()).thenReturn("manager");
        CodeRepo codeRepo = findCodeRepoService.findById(5L, principal);
        assertNotNull(codeRepo, "Code repository should be found for manager with ID 5");
    }

    /**
     * Test that findById throws an exception for an invalid ID and 'manager' user.
     */
    @Test
    void testFindById_Manager_InvalidId() {
        Mockito.when(principal.getName()).thenReturn("manager");
        assertThrows(Exception.class, () -> {
            findCodeRepoService.findById(2L, principal);
        }, "Expected exception when manager tries to find code repo not accessible to them");
    }

    /**
     * Test that findAll returns all code repositories.
     */
    @Test
    void testFindAll() {
        Iterable<CodeRepo> codeRepos = findCodeRepoService.findAll();
        long size = codeRepos.spliterator().getExactSizeIfKnown();
        assertTrue(size >= 5, "There should be at least 5 code repositories");
    }

    /**
     * Test that findByRemoteId returns the code repository when the remote ID exists.
     */
    @Test
    void testFindByRemoteId_Exists() {
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(14493750L);
        assertNotNull(codeRepo, "Code repository should be found for remote ID 14493750");
    }

    /**
     * Test that findByRemoteId throws an exception when the remote ID does not exist.
     */
    @Test
    void testFindByRemoteId_DoesNotExist() {
        assertThrows(Exception.class, () -> {
            findCodeRepoService.findByRemoteId(123L);
        }, "Expected exception when code repository with remote ID 123 does not exist");
    }
}