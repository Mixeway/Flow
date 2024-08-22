package io.mixeway.mixewayflowapi.domain.coderepo;

import ch.qos.logback.core.spi.ScanException;
import io.mixeway.mixewayflowapi.api.coderepo.dto.CreateCodeRepoRequestDto;
import io.mixeway.mixewayflowapi.api.user.dto.CreateUserRequestDto;
import io.mixeway.mixewayflowapi.config.TestConfig;
import io.mixeway.mixewayflowapi.config.TestDataPrepareService;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import io.mixeway.mixewayflowapi.domain.team.CreateTeamService;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import io.mixeway.mixewayflowapi.domain.user.CreateUserService;
import io.mixeway.mixewayflowapi.integrations.repo.dto.ImportCodeRepoResponseDto;
import io.mixeway.mixewayflowapi.integrations.repo.service.GetCodeRepoInfoService;
import io.mixeway.mixewayflowapi.utils.Role;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;
import java.net.MalformedURLException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
@RunWith(SpringRunner.class)
@ActiveProfiles("ut")
@Import(TestConfig.class)
class FindCodeRepoServiceTest {
    @Autowired
    FindCodeRepoService findCodeRepoService;
    @MockBean
    GetCodeRepoInfoService getCodeRepoInfoService;
    @Mock
    Principal principal;
    @Autowired
    CreateTeamService createTeamService;
    @Autowired
    FindTeamService findTeamService;
    @Autowired
    CreateCodeRepoService createCodeRepoService;
    @Autowired
    CreateUserService createUserService;
    @Autowired
    TestDataPrepareService testDataPrepareService;

    @Test
    void findCodeRepoByUrl() throws Exception {
        //Mock Creation of CodeRepo and git integrations
        ImportCodeRepoResponseDto importCodeRepoResponseDto = new ImportCodeRepoResponseDto();
        importCodeRepoResponseDto.setId(getRandomNumber(1, 1000));
        importCodeRepoResponseDto.setDescription("desc");
        importCodeRepoResponseDto.setWebUrl("https://findCodeRepoByUrl.com/repo");
        importCodeRepoResponseDto.setDefaultBranch("main");
        importCodeRepoResponseDto.setPathWithNamespace("pathwithnamespace");

        when(getCodeRepoInfoService.getRepoResponse(any(CreateCodeRepoRequestDto.class), any(String.class)))
                .thenReturn(importCodeRepoResponseDto);
        when(getCodeRepoInfoService.getRepoLanguages(any(CodeRepo.class))).thenReturn(new HashMap<>());

        Mockito.when(principal.getName()).thenReturn("admin");

        //Create Team verify if it is created
        createTeamService.createTeam("findCodeRepoByUrl","findCodeRepoByUrl", new ArrayList<>(), principal);
        List<Team> team1 = findTeamService.findAll().stream().filter(t -> t.getName().equals("findCodeRepoByUrl")).toList();
        assertFalse(team1.isEmpty());
        assertEquals(1, team1.size());
        Team team = team1.get(0);

        // Create repo with given parameters
        String name = "test-repo";
        String repoUrl = "https://createCodeRepo.com";
        String accessToken = "token123";
        Long remoteId = 1L;

        // Prepare DTO based on those parameters
        CreateCodeRepoRequestDto dto = CreateCodeRepoRequestDto.of(name, repoUrl, accessToken, remoteId, team.getId());

        // Call the createRepo method to create repository
        createCodeRepoService.createCodeRepo(dto, "GITLAB");

        Optional<CodeRepo> codeRepo = findCodeRepoService.findCodeRepoByUrl("https://findCodeRepoByUrl.com/repo");
        assertTrue(codeRepo.isPresent());
    }

    @Test
    void findCodeRepoForUser() throws IOException, ScanException, InterruptedException {
        // create user
        CreateUserRequestDto userDto = CreateUserRequestDto.of("findcoderepotest", Role.USER,"qwerqwerqwer", new ArrayList<>());
        UserInfo userInfo = createUserService.createUser(userDto);

        Mockito.when(principal.getName()).thenReturn("findcoderepotest");
        // create team
        createTeamService.createTeam("findcoderepo_test","findcoderepo_test", new ArrayList<>(), principal);
        List<Team> team1 = findTeamService.findAll().stream().filter(t -> t.getName().equals("findcoderepo_test")).toList();
        assertFalse(team1.isEmpty());
        assertEquals(1, team1.size());
        Team team = team1.get(0);

        //Create repo 1
        ImportCodeRepoResponseDto importCodeRepoResponseDto = new ImportCodeRepoResponseDto();
        importCodeRepoResponseDto.setId(getRandomNumber(1, 1000));
        importCodeRepoResponseDto.setDescription("desc");
        importCodeRepoResponseDto.setWebUrl("https://findCodeRepoByUrl.com/repo"+getRandomNumber(0,20));
        importCodeRepoResponseDto.setDefaultBranch("main");
        importCodeRepoResponseDto.setPathWithNamespace("pathwithnamespace");

        ImportCodeRepoResponseDto importCodeRepoResponseDto1 = new ImportCodeRepoResponseDto();
        importCodeRepoResponseDto1.setId(getRandomNumber(1, 1000));
        importCodeRepoResponseDto1.setDescription("desc");
        importCodeRepoResponseDto1.setWebUrl("https://findCodeRepoByUrl.com/repo"+getRandomNumber(0,20));
        importCodeRepoResponseDto1.setDefaultBranch("main");
        importCodeRepoResponseDto1.setPathWithNamespace("pathwithnamespace");

        ImportCodeRepoResponseDto importCodeRepoResponseDto2 = new ImportCodeRepoResponseDto();
        importCodeRepoResponseDto2.setId(getRandomNumber(1, 1000));
        importCodeRepoResponseDto2.setDescription("desc");
        importCodeRepoResponseDto2.setWebUrl("https://findCodeRepoByUrl.com/repo"+getRandomNumber(0,20));
        importCodeRepoResponseDto2.setDefaultBranch("main");
        importCodeRepoResponseDto2.setPathWithNamespace("pathwithnamespace");

        when(getCodeRepoInfoService.getRepoResponse(any(CreateCodeRepoRequestDto.class), any(String.class)))
                .thenReturn(importCodeRepoResponseDto, importCodeRepoResponseDto1, importCodeRepoResponseDto2);
        when(getCodeRepoInfoService.getRepoLanguages(any(CodeRepo.class))).thenReturn(new HashMap<>());

        String name = "test-repo";
        String repoUrl = "https://createCodeRepo.com";
        String accessToken = "token123";
        Long remoteId = 1L;

        // Prepare DTO based on those parameters
        CreateCodeRepoRequestDto dto = CreateCodeRepoRequestDto.of(name, repoUrl, accessToken, remoteId, team.getId());

        // Call the createRepo method to create repository
        createCodeRepoService.createCodeRepo(dto, "GITLAB");
        createCodeRepoService.createCodeRepo(dto, "GITLAB");
        createCodeRepoService.createCodeRepo(dto, "GITLAB");

        List<CodeRepo> codeRepos = findCodeRepoService.findCodeRepoForUser(principal);
        assertEquals(3, codeRepos.size());
    }

    @Test
    void findById() {

    }

    @Test
    void findAll() {
    }

    @Test
    void findByRemoteId() {
    }

    public int getRandomNumber(int min, int max) {
        return (int) ((Math.random() * (max - min)) + min);
    }
}