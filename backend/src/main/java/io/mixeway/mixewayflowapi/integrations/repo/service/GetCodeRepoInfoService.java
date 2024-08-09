package io.mixeway.mixewayflowapi.integrations.repo.service;

import io.mixeway.mixewayflowapi.api.coderepo.dto.CreateCodeRepoRequestDto;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.integrations.repo.apiclient.GitLabApiClientService;
import io.mixeway.mixewayflowapi.integrations.repo.dto.ImportCodeRepoResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.net.MalformedURLException;
import java.util.HashMap;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Log4j2
public class GetCodeRepoInfoService {
    private final GitLabApiClientService gitLabApiClientService;

    public ImportCodeRepoResponseDto getRepoResponse(CreateCodeRepoRequestDto createCodeRepoRequestDto, String repo){
        if (repo.toUpperCase(Locale.ROOT).equals("GITLAB")){
            return gitLabApiClientService
                    .getProjectInfo(createCodeRepoRequestDto.getRemoteId(),
                            createCodeRepoRequestDto.getRepoUrl(),
                            createCodeRepoRequestDto.getAccessToken()).block();

        } else {
            log.error("[CodeRepo Import Service] Only Gitlab supported");
        }
        return null;
    }
    public HashMap<String, Integer> getRepoLanguages(CodeRepo codeRepo) throws MalformedURLException {
        return gitLabApiClientService
                .getProjectLanguages(codeRepo.getRemoteId(),
                        codeRepo.getGitHostUrl(),
                        codeRepo.getAccessToken()).block();
    }
}
