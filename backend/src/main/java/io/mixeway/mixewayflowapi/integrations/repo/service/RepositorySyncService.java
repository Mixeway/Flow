package io.mixeway.mixewayflowapi.integrations.repo.service;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.RepositoryProvider;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoRepository;
import io.mixeway.mixewayflowapi.domain.coderepo.CreateCodeRepoService;
import io.mixeway.mixewayflowapi.integrations.repo.apiclient.GitHubApiClientService;
import io.mixeway.mixewayflowapi.integrations.repo.apiclient.GitLabApiClientService;
import io.mixeway.mixewayflowapi.integrations.repo.apiclient.GiteaApiClientService;
import io.mixeway.mixewayflowapi.integrations.repo.dto.ImportCodeRepoGitHubResponseDto;
import io.mixeway.mixewayflowapi.integrations.repo.dto.ImportCodeRepoGiteaResponseDto;
import io.mixeway.mixewayflowapi.integrations.repo.dto.ImportCodeRepoResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class RepositorySyncService {

    private final CodeRepoRepository codeRepoRepository;
    private final CreateCodeRepoService createCodeRepoService;
    private final GitLabApiClientService gitLabApiClientService;
    private final GitHubApiClientService gitHubApiClientService;
    private final GiteaApiClientService giteaApiClientService;

    @Async
    public void syncProvider(RepositoryProvider provider) {
        log.info("Starting repository sync for provider: {}", provider.getApiUrl());
        // String accessToken = encryptionUtil.decrypt(provider.getEncryptedAccessToken());

        Set<Integer> existingRemoteIds = codeRepoRepository.findByType(provider.getProviderType())
                .stream()
                .map(CodeRepo::getRemoteId)
                .collect(Collectors.toSet());

        Flux<?> repositoryFlux;
        if (provider.getProviderType().equals(CodeRepo.RepoType.GITLAB)) {
            repositoryFlux = gitLabApiClientService.fetchAllProjects(provider.getApiUrl(), provider.getEncryptedAccessToken());
        } else if (provider.getProviderType().equals(CodeRepo.RepoType.GITHUB)) {
            repositoryFlux = gitHubApiClientService.fetchAllRepositories(provider.getApiUrl(), provider.getEncryptedAccessToken());
        } else if (provider.getProviderType().equals(CodeRepo.RepoType.GITEA)) {
            repositoryFlux = giteaApiClientService.fetchAllRepositories(provider.getApiUrl(), provider.getEncryptedAccessToken());
        } else {
            return;
        }

        repositoryFlux
                .filter(project -> {
                    long remoteId;
                    if (project instanceof ImportCodeRepoResponseDto) {
                        remoteId = ((ImportCodeRepoResponseDto) project).getId();
                    } else if (project instanceof ImportCodeRepoGitHubResponseDto) {
                        remoteId = ((ImportCodeRepoGitHubResponseDto) project).getId();
                    } else if (project instanceof ImportCodeRepoGiteaResponseDto) {
                        remoteId = ((ImportCodeRepoGiteaResponseDto) project).getId();
                    } else {
                        return false;
                    }
                    return !existingRemoteIds.contains((int) remoteId);
                })
                .flatMap(project ->
                                // flatMap now correctly calls a method that returns a Mono<Void>
                                createCodeRepoService.importProjectAsCodeRepo(
                                        project,
                                        provider.getDefaultTeam(),
                                        provider.getEncryptedAccessToken(),
                                        provider.getApiUrl(),
                                        provider.getProviderType()
                                )
                        , 5) // The concurrency parameter limits how many imports run in parallel
                .doOnComplete(() -> {
                    long repoCount = codeRepoRepository.countByRepoUrlStartingWith(provider.getApiUrl());
                    provider.setSyncedRepoCount((int) repoCount);
                    provider.setLastSyncDate(java.time.LocalDateTime.now());
                    log.info("Finished repository sync for provider: {}. Total synced repos: {}", provider.getApiUrl(), repoCount);
                })
                .doOnError(error -> log.error("Synchronization failed for provider {}: {}", provider.getApiUrl(), error.getMessage()))
                .subscribe();
    }
}
