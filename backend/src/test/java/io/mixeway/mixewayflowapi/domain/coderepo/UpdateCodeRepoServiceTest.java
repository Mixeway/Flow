package io.mixeway.mixewayflowapi.domain.coderepo;

import ch.qos.logback.core.spi.ScanException;
import io.mixeway.mixewayflowapi.api.coderepo.dto.CreateCodeRepoRequestDto;
import io.mixeway.mixewayflowapi.config.TestConfig;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.Component;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.domain.team.CreateTeamService;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import io.mixeway.mixewayflowapi.integrations.repo.dto.ImportCodeRepoResponseDto;
import io.mixeway.mixewayflowapi.integrations.repo.service.GetCodeRepoInfoService;
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
import org.testcontainers.shaded.org.checkerframework.checker.units.qual.A;

import java.io.IOException;
import java.net.MalformedURLException;
import java.security.Principal;
import java.util.*;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
@RunWith(SpringRunner.class)
@ActiveProfiles("ut")
@Import(TestConfig.class)
class UpdateCodeRepoServiceTest {
    @Autowired
    UpdateCodeRepoService updateCodeRepoService;

    @Autowired
    FindCodeRepoService findCodeRepoService;
    @Autowired
    CreateCodeRepoService createCodeRepoService;
    @MockBean
    GetCodeRepoInfoService getCodeRepoInfoService;
    @Autowired
    CreateTeamService createTeamService;
    @Autowired
    FindTeamService findTeamService;
    @Mock
    Principal principal;

    @Test
    void updateScaUUID() {
        String uuid = UUID.randomUUID().toString();
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(14493750L);
        updateCodeRepoService.updateScaUUID(codeRepo, uuid);
        codeRepo = findCodeRepoService.findByRemoteId(14493750L);
        assertEquals(uuid, codeRepo.getScaUUID());
    }

    @Test
    void updateComponents() {
        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(14493750L);
        List<Component> components = createDummyComponents();
        updateCodeRepoService.updateComponents(components, codeRepo);
        codeRepo = findCodeRepoService.findByRemoteId(14493750L);
        assertEquals(10, codeRepo.getComponents().size());
    }

    @Test
    void updateCodeRepoStatus() throws IOException, ScanException, InterruptedException {
        //Create coderepo
        // Mock Creation of CodeRepo and git integrations
        ImportCodeRepoResponseDto importCodeRepoResponseDto = new ImportCodeRepoResponseDto();
        importCodeRepoResponseDto.setId(9999);
        importCodeRepoResponseDto.setDescription("desc123");
        importCodeRepoResponseDto.setWebUrl("https://example.com/repo3");
        importCodeRepoResponseDto.setDefaultBranch("main");
        importCodeRepoResponseDto.setPathWithNamespace("pathwithnamespace321");

        when(getCodeRepoInfoService.getRepoResponse(any(CreateCodeRepoRequestDto.class), any(CodeRepo.RepoType.class)))
                .thenReturn(importCodeRepoResponseDto);
        when(getCodeRepoInfoService.getRepoLanguages(any(CodeRepo.class))).thenReturn(new HashMap<>());

        Mockito.when(principal.getName()).thenReturn("admin");

        // Create Team verify if it is created
        createTeamService.createTeam("updateCodeRepoStatus","updateCodeRepoStatus", new ArrayList<>(), principal);
        List<Team> team1 = findTeamService.findAll().stream().filter(t -> t.getName().equals("updateCodeRepoStatus")).toList();
        assertFalse(team1.isEmpty());
        assertEquals(1, team1.size());
        Team team = team1.get(0);

        // Create repo with given parameters
        String name = "test-repo3";
        String repoUrl = "https://createCodeRepo.com2";
        String accessToken = "token123";
        Long remoteId = 9999L;

        // Prepare DTO based on those parameters
        CreateCodeRepoRequestDto dto = CreateCodeRepoRequestDto.of(name, repoUrl, accessToken, remoteId, team.getId());

        // Call the createRepo method to create repository
        createCodeRepoService.createCodeRepo(dto, CodeRepo.RepoType.GITLAB);

        CodeRepo codeRepo = findCodeRepoService.findByRemoteId(9999L);

        updateCodeRepoService.updateCodeRepoStatus(codeRepo, codeRepo.getDefaultBranch(),true,"123");
        codeRepo = findCodeRepoService.findByRemoteId(9999L);

        assertFalse(codeRepo.getIacScan().equals(CodeRepo.ScanStatus.NOT_PERFORMED));
        assertFalse(codeRepo.getSastScan().equals(CodeRepo.ScanStatus.NOT_PERFORMED));
        assertTrue(codeRepo.getScaScan().equals(CodeRepo.ScanStatus.NOT_PERFORMED));
        assertFalse(codeRepo.getSecretsScan().equals(CodeRepo.ScanStatus.NOT_PERFORMED));
    }

    private static List<Component> createDummyComponents() {
        List<Component> components = new ArrayList<>();
        Random random = new Random();

        for (int i = 0; i < 10; i++) {
            String groupid = "group" + random.nextInt(100);
            String name = "component" + random.nextInt(1000);
            String version = "v" + random.nextInt(10) + "." + random.nextInt(10) + "." + random.nextInt(10);
            String origin = random.nextBoolean() ? "internal" : "external";

            components.add(new Component(groupid, name, version, origin));
        }

        return components;
    }
}