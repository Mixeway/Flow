package io.mixeway.mixewayflowapi.integrations.repo.service;

import io.mixeway.mixewayflowapi.api.coderepo.dto.CreateCodeRepoRequestDto;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.integrations.repo.apiclient.GitHubApiClientService;
import io.mixeway.mixewayflowapi.integrations.repo.apiclient.GitLabApiClientService;
import io.mixeway.mixewayflowapi.integrations.repo.apiclient.GiteaApiClientService;
import io.mixeway.mixewayflowapi.integrations.repo.dto.ImportCodeRepoGitHubResponseDto;
import io.mixeway.mixewayflowapi.integrations.repo.dto.ImportCodeRepoGiteaResponseDto;
import io.mixeway.mixewayflowapi.integrations.repo.dto.ImportCodeRepoResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.net.MalformedURLException;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
@Log4j2
public class GetCodeRepoInfoService {
    private final GitLabApiClientService gitLabApiClientService;
    private final GitHubApiClientService gitHubApiClientService;
    private final GiteaApiClientService giteaApiClientService;

    /**
     * Reactively fetches repository information without blocking.
     * @return A Mono emitting the repository information.
     */
    public Mono<ImportCodeRepoResponseDto> getRepoResponse(CreateCodeRepoRequestDto createCodeRepoRequestDto, CodeRepo.RepoType repoType) {
        if (repoType.equals(CodeRepo.RepoType.GITLAB)) {
            return gitLabApiClientService.getProjectInfo(
                    createCodeRepoRequestDto.getRemoteId(),
                    createCodeRepoRequestDto.getRepoUrl(),
                    createCodeRepoRequestDto.getAccessToken()
            );
        } else if (repoType.equals(CodeRepo.RepoType.GITHUB)) {
            // Fetch GitHub-specific info and map it to the common DTO
            return gitHubApiClientService.getProjectInfo(
                    createCodeRepoRequestDto.getName(),
                    createCodeRepoRequestDto.getRepoUrl(),
                    createCodeRepoRequestDto.getAccessToken()
            ).map(githubDto -> {
                ImportCodeRepoResponseDto commonDto = new ImportCodeRepoResponseDto();
                commonDto.setDefaultBranch(githubDto.getDefaultBranch());
                commonDto.setId(githubDto.getId());
                commonDto.setDescription(githubDto.getDescription());
                commonDto.setPathWithNamespace(githubDto.getPathWithNamespace());
                commonDto.setWebUrl(githubDto.getWebUrl());
                return commonDto;
            });
        } else if (repoType.equals(CodeRepo.RepoType.GITEA)) {
            // Gitea API uses owner/repo path format, not ID, and returns html_url instead of web_url
            return giteaApiClientService.getProjectInfo(
                    createCodeRepoRequestDto.getName(),
                    createCodeRepoRequestDto.getRepoUrl(),
                    createCodeRepoRequestDto.getAccessToken()
            ).map(giteaDto -> {
                ImportCodeRepoResponseDto commonDto = new ImportCodeRepoResponseDto();
                commonDto.setDefaultBranch(giteaDto.getDefaultBranch());
                commonDto.setId(giteaDto.getId());
                commonDto.setDescription(giteaDto.getDescription());
                commonDto.setPathWithNamespace(giteaDto.getPathWithNamespace());
                commonDto.setWebUrl(giteaDto.getWebUrl()); // This maps html_url to webUrl
                return commonDto;
            });
        } else {
            log.error("[CodeRepo Import Service] Only GitLab, GitHub, and Gitea are supported.");
            return Mono.error(new UnsupportedOperationException("Unsupported repository type."));
        }
    }

    public Mono<HashMap<String, Integer>> getRepoLanguages(CodeRepo codeRepo) throws MalformedURLException {
        if (codeRepo.getType().equals(CodeRepo.RepoType.GITLAB)) {
            return gitLabApiClientService
                    .getProjectLanguages(codeRepo.getRemoteId(),
                            codeRepo.getGitHostUrl(),
                            codeRepo.getAccessToken());
        } else if (codeRepo.getType().equals(CodeRepo.RepoType.GITHUB)){
            return gitHubApiClientService
                    .getProjectLanguages(codeRepo.getName(),
                            codeRepo.getGitHostUrl(),
                            codeRepo.getAccessToken());
        } else if (codeRepo.getType().equals(CodeRepo.RepoType.GITEA)){
            // Gitea API uses owner/repo path format, not ID
            return giteaApiClientService
                    .getProjectLanguages(codeRepo.getName(),
                            codeRepo.getGitHostUrl(),
                            codeRepo.getAccessToken());
        } else {
            log.error("[CodeRepoImportService] not recognized option for repo type during languages load...");
            return Mono.just(new HashMap<>());
        }
    }
}
