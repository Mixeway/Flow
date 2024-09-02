package io.mixeway.mixewayflowapi.integrations.repo.service;

import io.mixeway.mixewayflowapi.api.coderepo.dto.CreateCodeRepoRequestDto;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.integrations.repo.apiclient.GitHubApiClientService;
import io.mixeway.mixewayflowapi.integrations.repo.apiclient.GitLabApiClientService;
import io.mixeway.mixewayflowapi.integrations.repo.dto.ImportCodeRepoGitHubResponseDto;
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
    private final GitHubApiClientService gitHubApiClientService;

    public ImportCodeRepoResponseDto getRepoResponse(CreateCodeRepoRequestDto createCodeRepoRequestDto, CodeRepo.RepoType repoType){
        if (repoType.equals(CodeRepo.RepoType.GITLAB)){
            return gitLabApiClientService
                    .getProjectInfo(createCodeRepoRequestDto.getRemoteId(),
                            createCodeRepoRequestDto.getRepoUrl(),
                            createCodeRepoRequestDto.getAccessToken()).block();

        } else if (repoType.equals(CodeRepo.RepoType.GITHUB)) {
            ImportCodeRepoGitHubResponseDto importCodeRepoGitHubResponseDto = gitHubApiClientService
                    .getProjectInfo(createCodeRepoRequestDto.getName(),
                            createCodeRepoRequestDto.getRepoUrl(),
                            createCodeRepoRequestDto.getAccessToken()).block();
            ImportCodeRepoResponseDto importCodeRepoResponseDto = new ImportCodeRepoResponseDto();
            importCodeRepoResponseDto.setDefaultBranch(importCodeRepoGitHubResponseDto.getDefaultBranch());
            importCodeRepoResponseDto.setId(importCodeRepoGitHubResponseDto.getId());
            importCodeRepoResponseDto.setDescription(importCodeRepoGitHubResponseDto.getDescription());
            importCodeRepoResponseDto.setPathWithNamespace(importCodeRepoGitHubResponseDto.getPathWithNamespace());
            importCodeRepoResponseDto.setWebUrl(importCodeRepoGitHubResponseDto.getWebUrl());
            return importCodeRepoResponseDto;
        } else {
            log.error("[CodeRepo Import Service] Only Gitlab supported");
        }
        return null;
    }
    public HashMap<String, Integer> getRepoLanguages(CodeRepo codeRepo) throws MalformedURLException {
        if (codeRepo.getType().equals(CodeRepo.RepoType.GITLAB)) {
            return gitLabApiClientService
                    .getProjectLanguages(codeRepo.getRemoteId(),
                            codeRepo.getGitHostUrl(),
                            codeRepo.getAccessToken()).block();
        } else if (codeRepo.getType().equals(CodeRepo.RepoType.GITHUB)){
            return gitHubApiClientService
                    .getProjectLanguages(codeRepo.getName(),
                            codeRepo.getGitHostUrl(),
                            codeRepo.getAccessToken()).block();
        } else {
            log.error("[CodeRepoImportService] not recognized option for repo type during languages load...");
            return new HashMap<>();
        }
    }
}
