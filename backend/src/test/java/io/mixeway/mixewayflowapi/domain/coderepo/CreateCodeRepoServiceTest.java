package io.mixeway.mixewayflowapi.domain.coderepo;

import ch.qos.logback.core.spi.ScanException;
import io.mixeway.mixewayflowapi.api.coderepo.dto.CreateCodeRepoRequestDto;
import io.mixeway.mixewayflowapi.config.TestConfig;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.repository.TeamRepository;
import io.mixeway.mixewayflowapi.domain.team.CreateTeamService;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import io.mixeway.mixewayflowapi.exceptions.TeamNotFoundException;
import io.mixeway.mixewayflowapi.integrations.repo.dto.ImportCodeRepoResponseDto;
import io.mixeway.mixewayflowapi.integrations.repo.service.GetCodeRepoInfoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.security.Principal;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
@ActiveProfiles("ut")
@Import(TestConfig.class)
@Transactional // Ensures that database changes are rolled back after each test
class CreateCodeRepoServiceTest {

    @Autowired
    private CreateCodeRepoService createCodeRepoService;

    @Autowired
    private FindTeamService findTeamService;

    @Autowired
    private FindCodeRepoService findCodeRepoService;

    @MockBean
    private GetCodeRepoInfoService getCodeRepoInfoService;

    @Autowired
    private CreateTeamService createTeamService;

    @Autowired
    private TeamRepository teamRepository;

    @Mock
    private Principal principal;

    private Team team;
    private CreateCodeRepoRequestDto dto;

    @BeforeEach
    void setUp() throws IOException, InterruptedException {
        // Mock external services
        ImportCodeRepoResponseDto importCodeRepoResponseDto = new ImportCodeRepoResponseDto();
        importCodeRepoResponseDto.setId(1);
        importCodeRepoResponseDto.setDescription("desc");
        importCodeRepoResponseDto.setWebUrl("https://example.com/repo");
        importCodeRepoResponseDto.setDefaultBranch("main");
        importCodeRepoResponseDto.setPathWithNamespace("pathwithnamespace");

        when(getCodeRepoInfoService.getRepoResponse(any(CreateCodeRepoRequestDto.class), any(CodeRepo.RepoType.class)))
                .thenReturn(importCodeRepoResponseDto);
        when(getCodeRepoInfoService.getRepoLanguages(any(CodeRepo.class))).thenReturn(new HashMap<>());

        Mockito.when(principal.getName()).thenReturn("admin");

        // Clean up any existing team with the same name to ensure test isolation
        //teamRepository.deleteAll();

        // Create Team for testing
        createTeamService.createTeam("createCodeRepoTest", "createCodeRepoTest", new ArrayList<>(), principal);

        team = findTeamService.findAll().stream()
                .filter(t -> t.getName().equals("createCodeRepoTest"))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Team not found in setup"));

        // Prepare DTO based on parameters
        String name = "test-repo";
        String repoUrl = "https://createCodeRepo.com";
        String accessToken = "token123";
        Long remoteId = 1L;

        dto = CreateCodeRepoRequestDto.of(name, repoUrl, accessToken, remoteId, team.getId());
    }

    /**
     * Test that a team is successfully created and can be retrieved.
     */
    @Test
    void testTeamCreation() {
        List<Team> teams = findTeamService.findAll().stream()
                .filter(t -> t.getName().equals("createCodeRepoTest"))
                .toList();

        assertFalse(teams.isEmpty(), "Team list should not be empty");
        assertEquals(1, teams.size(), "There should be exactly one team with the given name");
        assertEquals("createCodeRepoTest", teams.get(0).getName(), "Team name should match");
    }

    /**
     * Test that createCodeRepo successfully creates a code repository.
     */
    @Test
    void testCreateCodeRepo() throws IOException, InterruptedException, ScanException {
        createCodeRepoService.createCodeRepo(dto, CodeRepo.RepoType.GITLAB);

        Optional<CodeRepo> codeRepo = findCodeRepoService.findCodeRepoByUrl("https://example.com/repo");
        assertTrue(codeRepo.isPresent(), "Code repository should be present after creation");
        assertEquals("https://example.com/repo", codeRepo.get().getRepourl(), "Repository URL should match");
    }

    /**
     * Test that the code repository is retrievable after creation.
     */
    @Test
    void testFindCreatedCodeRepo() throws IOException, InterruptedException, ScanException {
        createCodeRepoService.createCodeRepo(dto, CodeRepo.RepoType.GITLAB);

        Optional<CodeRepo> codeRepo = findCodeRepoService.findCodeRepoByUrl("https://example.com/repo");
        assertTrue(codeRepo.isPresent(), "Code repository should be found by URL");
    }

    /**
     * Test that createCodeRepo throws an exception when provided with invalid parameters.
     */
    @Test
    void testCreateCodeRepoWithInvalidParameters() throws IOException, InterruptedException {
        // Prepare DTO with invalid parameters

        assertThrows(IllegalArgumentException.class, () -> {
            CreateCodeRepoRequestDto invalidDto = CreateCodeRepoRequestDto.of(null, null, null, null, null);
        });
    }

    /**
     * Test that the getCodeRepoInfoService methods are called as expected during code repository creation.
     */
    @Test
    void testGetCodeRepoInfoServiceCalled() throws IOException, InterruptedException, ScanException {
        createCodeRepoService.createCodeRepo(dto, CodeRepo.RepoType.GITLAB);

        Mockito.verify(getCodeRepoInfoService, Mockito.times(1))
                .getRepoResponse(any(CreateCodeRepoRequestDto.class), any(CodeRepo.RepoType.class));
        Mockito.verify(getCodeRepoInfoService, Mockito.times(1))
                .getRepoLanguages(any(CodeRepo.class));
    }

    /**
     * Test that creating a code repository with an existing URL does not duplicate entries.
     */
    @Test
    void testCreateCodeRepoWithExistingUrl() throws IOException, InterruptedException, ScanException {
        // First creation
        createCodeRepoService.createCodeRepo(dto, CodeRepo.RepoType.GITLAB);
        // Attempt to create the same repository again
        assertThrows(TeamNotFoundException.class, () -> {
            createCodeRepoService.createCodeRepo(dto, CodeRepo.RepoType.GITLAB);
        });

    }
}