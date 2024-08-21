package io.mixeway.mixewayflowapi.domain.coderepo;

import ch.qos.logback.core.spi.ScanException;
import io.mixeway.mixewayflowapi.api.coderepo.dto.CreateCodeRepoRequestDto;
import io.mixeway.mixewayflowapi.config.TestConfig;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.domain.team.CreateTeamService;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import io.mixeway.mixewayflowapi.integrations.repo.dto.ImportCodeRepoResponseDto;
import io.mixeway.mixewayflowapi.integrations.repo.service.GetCodeRepoInfoService;
import jakarta.inject.Inject;
import lombok.RequiredArgsConstructor;
import org.junit.Test;
import org.junit.jupiter.api.Order;
import org.junit.runner.RunWith;
import static org.mockito.Mockito.*;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import static org.junit.Assert.*;

@SpringBootTest
@RunWith(SpringRunner.class)
@ActiveProfiles("ut")
@Import(TestConfig.class)
public class CreateCodeRepoServiceTest {
    @Autowired
    CreateCodeRepoService createCodeRepoService;
    @Autowired
    FindTeamService findTeamService;
    @Autowired
    FindCodeRepoService findCodeRepoService;
    @MockBean
    GetCodeRepoInfoService getCodeRepoInfoService;
    @Autowired
    CreateTeamService createTeamService;
    @Mock
    Principal principal;

    @Test
    public void createCodeRepo() throws ScanException, IOException, InterruptedException {
        //Mock Creation of CodeRepo and git integrations
        ImportCodeRepoResponseDto importCodeRepoResponseDto = new ImportCodeRepoResponseDto();
        importCodeRepoResponseDto.setId(1);
        importCodeRepoResponseDto.setDescription("desc");
        importCodeRepoResponseDto.setWebUrl("https://example.com/repo");
        importCodeRepoResponseDto.setDefaultBranch("main");
        importCodeRepoResponseDto.setPathWithNamespace("pathwithnamespace");

        when(getCodeRepoInfoService.getRepoResponse(any(CreateCodeRepoRequestDto.class), any(String.class)))
                .thenReturn(importCodeRepoResponseDto);
        when(getCodeRepoInfoService.getRepoLanguages(any(CodeRepo.class))).thenReturn(new HashMap<>());

        Mockito.when(principal.getName()).thenReturn("admin");

        //Create Team verify if it is created
        createTeamService.createTeam("createCodeRepoTest","createCodeRepoTest", new ArrayList<>(), principal);
        List<Team> team1 = findTeamService.findAll().stream().filter(t -> t.getName().equals("createCodeRepoTest")).toList();
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

        // https://example.com/repo taken from TestConfig.class Mocked method
        Optional<CodeRepo> codeRepo = findCodeRepoService.findCodeRepoByUrl("https://example.com/repo");
        assertTrue(codeRepo.isPresent());
    }

}