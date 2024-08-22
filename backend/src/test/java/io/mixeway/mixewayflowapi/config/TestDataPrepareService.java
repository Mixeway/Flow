package io.mixeway.mixewayflowapi.config;

import ch.qos.logback.core.spi.ScanException;
import io.mixeway.mixewayflowapi.api.coderepo.dto.CreateCodeRepoRequestDto;
import io.mixeway.mixewayflowapi.api.user.dto.CreateUserRequestDto;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import io.mixeway.mixewayflowapi.domain.coderepo.CreateCodeRepoService;
import io.mixeway.mixewayflowapi.domain.team.CreateTeamService;
import io.mixeway.mixewayflowapi.domain.user.CreateUserService;
import io.mixeway.mixewayflowapi.integrations.repo.dto.ImportCodeRepoResponseDto;
import io.mixeway.mixewayflowapi.integrations.repo.service.GetCodeRepoInfoService;
import io.mixeway.mixewayflowapi.utils.Role;
import lombok.RequiredArgsConstructor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@Service
@RequiredArgsConstructor
public class TestDataPrepareService {
    @MockBean
    GetCodeRepoInfoService getCodeRepoInfoService;
    private final CreateCodeRepoService createCodeRepoService;
    private final CreateTeamService createTeamService;
    private final CreateUserService createUserService;


    public void populateCodeRepo(Long id, String repoUrl, String repoName, Team team) throws IOException, ScanException, InterruptedException {
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

        // Create repo with given parameters
        String accessToken = "token123";

        // Prepare DTO based on those parameters
        CreateCodeRepoRequestDto dto = CreateCodeRepoRequestDto.of(repoName, repoUrl, accessToken, id, team.getId());

        // Call the createRepo method to create repository
        createCodeRepoService.createCodeRepo(dto, "GITLAB");

    }

    public void populateTeam(Principal principal, String name){
        createTeamService.createTeam("test","test", new ArrayList<>(), principal);
    }

    public void createUser(String name, Role role){
        CreateUserRequestDto userDto = CreateUserRequestDto.of(name, role,"qwerqwerqwer", new ArrayList<>());
        createUserService.createUser(userDto);
    }

    public void createNCodeRepos(Map<String,Long> repos, Team team){

    }
}
