//package io.mixeway.mixewayflowapi.domain.coderepo;
//
//import ch.qos.logback.core.spi.ScanException;
//import io.mixeway.mixewayflowapi.api.coderepo.dto.CreateCodeRepoRequestDto;
//import io.mixeway.mixewayflowapi.config.AppConfigService;
//import io.mixeway.mixewayflowapi.config.TestConfig;
//import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
//import io.mixeway.mixewayflowapi.db.entity.Organization;
//import io.mixeway.mixewayflowapi.db.entity.Team;
//import io.mixeway.mixewayflowapi.db.repository.CodeRepoRepository;
//import io.mixeway.mixewayflowapi.db.repository.OrganizationRepository;
//import io.mixeway.mixewayflowapi.db.repository.TeamRepository;
//import io.mixeway.mixewayflowapi.domain.organization.OrganizationService;
//import io.mixeway.mixewayflowapi.domain.team.CreateTeamService;
//import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
//import io.mixeway.mixewayflowapi.exceptions.TeamNotFoundException;
//import io.mixeway.mixewayflowapi.integrations.repo.dto.ImportCodeRepoResponseDto;
//import io.mixeway.mixewayflowapi.integrations.repo.service.GetCodeRepoInfoService;
//import org.junit.jupiter.api.AfterEach;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.Mock;
//import org.mockito.Mockito;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.context.annotation.Import;
//import org.springframework.test.context.ActiveProfiles;
//import org.springframework.transaction.annotation.Transactional;
//import reactor.core.publisher.Mono;
//import reactor.test.StepVerifier;
//// ADDED IMPORT FOR REACTIVE TESTING
//
//import java.io.IOException;
//import java.net.MalformedURLException;
//import java.security.Principal;
//import java.util.*;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.Mockito.times;
//import static org.mockito.Mockito.when;
//
//@SpringBootTest
//@ActiveProfiles("ut")
//@Import(TestConfig.class)
//@Transactional
//class CreateCodeRepoServiceTest {
//
//    @Autowired
//    private CreateCodeRepoService createCodeRepoService;
//
//    @Autowired
//    private FindTeamService findTeamService;
//
//    @Autowired
//    private FindCodeRepoService findCodeRepoService;
//
//    @MockBean
//    private GetCodeRepoInfoService getCodeRepoInfoService;
//
//    @Autowired
//    private CreateTeamService createTeamService;
//
//    @Autowired
//    private TeamRepository teamRepository;
//
//    @Autowired
//    private CodeRepoRepository codeRepoRepository;
//
//    @Autowired
//    private AppConfigService appConfigService;
//
//    @Autowired
//    private OrganizationService organizationService;
//
//    @Autowired
//    private OrganizationRepository organizationRepository;
//
//    @Mock
//    private Principal principal;
//
//    private Team team;
//    private Organization testOrganization;
//    private CreateCodeRepoRequestDto dto;
//    private AppConfigService.RunMode originalRunMode;
//
//    @BeforeEach
//    void setUp() throws MalformedURLException {
//        originalRunMode = appConfigService.getRunMode();
//        appConfigService.setRunMode(AppConfigService.RunMode.STANDALONE);
//
//        ImportCodeRepoResponseDto importCodeRepoResponseDto = new ImportCodeRepoResponseDto();
//        importCodeRepoResponseDto.setId(1);
//        importCodeRepoResponseDto.setDescription("desc");
//        importCodeRepoResponseDto.setWebUrl("https://example.com/repo");
//        importCodeRepoResponseDto.setDefaultBranch("main");
//        importCodeRepoResponseDto.setPathWithNamespace("pathwithnamespace");
//
//        when(getCodeRepoInfoService.getRepoResponse(any(CreateCodeRepoRequestDto.class), any(CodeRepo.RepoType.class)))
//                .thenReturn(Mono.just(importCodeRepoResponseDto));
//        when(getCodeRepoInfoService.getRepoLanguages(any(CodeRepo.class))).thenReturn(Mono.just(new HashMap<>()));
//
//        Mockito.when(principal.getName()).thenReturn("admin");
//
//        createTeamService.createTeam("createCodeRepoTest", "createCodeRepoTest", new ArrayList<>(), principal);
//
//        team = findTeamService.findAll().stream()
//                .filter(t -> t.getName().equals("createCodeRepoTest"))
//                .findFirst()
//                .orElseThrow(() -> new RuntimeException("Team not found in setup"));
//
//        String name = "test-repo";
//        String repoUrl = "https://createCodeRepo.com";
//        String accessToken = "token123";
//        Long remoteId = 1L;
//
//        dto = CreateCodeRepoRequestDto.of(name, repoUrl, accessToken, remoteId, team.getId());
//    }
//
//    @AfterEach
//    void tearDown() {
//        appConfigService.setRunMode(originalRunMode);
//        // Note: Your manual cleanup is correct and necessary because the service's
//        // async operation runs in a different thread and thus a different transaction
//        // than the one managed by @Transactional on the test method.
//        codeRepoRepository.deleteAll();
//        teamRepository.deleteAll();
//    }
//
//    @Test
//    void testTeamCreation() {
//        List<Team> teams = findTeamService.findAll().stream()
//                .filter(t -> t.getName().equals("createCodeRepoTest"))
//                .toList();
//        assertFalse(teams.isEmpty(), "Team list should not be empty");
//        assertEquals(1, teams.size(), "There should be exactly one team with the given name");
//        assertEquals("createCodeRepoTest", teams.get(0).getName(), "Team name should match");
//    }
//
//    @Test
//    void testCreateCodeRepo() {
//        // FIX: Use StepVerifier to correctly wait for the async operation to complete
//        StepVerifier.create(createCodeRepoService.createCodeRepo(dto, CodeRepo.RepoType.GITLAB))
//                .verifyComplete();
//
//        // Now, this assertion will run AFTER the repository is saved
//        Optional<CodeRepo> codeRepo = findCodeRepoService.findCodeRepoByUrl("https://example.com/repo");
//        assertTrue(codeRepo.isPresent(), "Code repository should be present after creation");
//        assertEquals("https://example.com/repo", codeRepo.get().getRepourl(), "Repository URL should match");
//    }
//
//    @Test
//    void testFindCreatedCodeRepo() {
//        // FIX: Use StepVerifier
//        StepVerifier.create(createCodeRepoService.createCodeRepo(dto, CodeRepo.RepoType.GITLAB))
//                .verifyComplete();
//
//        Optional<CodeRepo> codeRepo = findCodeRepoService.findCodeRepoByUrl("https://example.com/repo");
//        assertTrue(codeRepo.isPresent(), "Code repository should be found by URL");
//    }
//
//    @Test
//    void testCreateCodeRepoWithNonExistentTeam() {
//        CreateCodeRepoRequestDto invalidDto = CreateCodeRepoRequestDto.of("test", "http://test.com", "token", 123L, 9999L);
//
//        // FIX: Use StepVerifier to assert that the Mono completes with an error
//        StepVerifier.create(createCodeRepoService.createCodeRepo(invalidDto, CodeRepo.RepoType.GITLAB))
//                .expectError(TeamNotFoundException.class)
//                .verify();
//    }
//
//    @Test
//    void testGetCodeRepoInfoServiceCalled() throws MalformedURLException {
//        // FIX: Use StepVerifier
//        StepVerifier.create(createCodeRepoService.createCodeRepo(dto, CodeRepo.RepoType.GITLAB))
//                .verifyComplete();
//
//        Mockito.verify(getCodeRepoInfoService, times(1))
//                .getRepoResponse(any(CreateCodeRepoRequestDto.class), any(CodeRepo.RepoType.class));
//        Mockito.verify(getCodeRepoInfoService, times(1))
//                .getRepoLanguages(any(CodeRepo.class));
//    }
//
//    @Test
//    void testCreateCodeRepoWithExistingUrl() {
//        // First call should succeed
//        StepVerifier.create(createCodeRepoService.createCodeRepo(dto, CodeRepo.RepoType.GITLAB))
//                .verifyComplete();
//
//        // The service logic throws TeamNotFoundException if the repo exists or team is not found.
//        // Let's verify that behavior for the second call.
//        StepVerifier.create(createCodeRepoService.createCodeRepo(dto, CodeRepo.RepoType.GITLAB))
//                .expectError(TeamNotFoundException.class)
//                .verify();
//    }
//}