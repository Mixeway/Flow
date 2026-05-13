package io.mixeway.mixewayflowapi.integrations.repo.service;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.RepositoryProvider;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoRepository;
import io.mixeway.mixewayflowapi.db.repository.RepositoryProviderRepository;
import io.mixeway.mixewayflowapi.domain.coderepo.CreateCodeRepoService;
import io.mixeway.mixewayflowapi.integrations.repo.apiclient.BitbucketApiClientService;
import io.mixeway.mixewayflowapi.integrations.repo.apiclient.GitHubApiClientService;
import io.mixeway.mixewayflowapi.integrations.repo.apiclient.GitLabApiClientService;
import io.mixeway.mixewayflowapi.integrations.repo.apiclient.GiteaApiClientService;
import io.mixeway.mixewayflowapi.integrations.repo.dto.ImportCodeRepoBitbucketResponseDto;
import io.mixeway.mixewayflowapi.integrations.repo.dto.ImportCodeRepoGitHubResponseDto;
import io.mixeway.mixewayflowapi.integrations.repo.dto.ImportCodeRepoGiteaResponseDto;
import io.mixeway.mixewayflowapi.integrations.repo.dto.ImportCodeRepoResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class RepositorySyncService {

    private final CodeRepoRepository codeRepoRepository;
    private final RepositoryProviderRepository repositoryProviderRepository;
    private final CreateCodeRepoService createCodeRepoService;
    private final GitLabApiClientService gitLabApiClientService;
    private final GitHubApiClientService gitHubApiClientService;
    private final GiteaApiClientService giteaApiClientService;
    private final BitbucketApiClientService bitbucketApiClientService;

    @Async
    public void syncProvider(RepositoryProvider provider) {
        log.info("Starting repository sync for provider: {}", provider.getApiUrl());
        // String accessToken = encryptionUtil.decrypt(provider.getEncryptedAccessToken());

        String repoUrlPrefix = normalizeProviderApiUrlPrefix(provider.getApiUrl());
        Set<Integer> existingRemoteIds = codeRepoRepository
                .findRemoteIdsByTypeAndRepourlPrefix(provider.getProviderType(), repoUrlPrefix)
                .stream()
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Flux<?> repositoryFlux;
        if (provider.getProviderType().equals(CodeRepo.RepoType.GITLAB)) {
            repositoryFlux = gitLabApiClientService.fetchAllProjects(provider.getApiUrl(), provider.getEncryptedAccessToken());
        } else if (provider.getProviderType().equals(CodeRepo.RepoType.GITHUB)) {
            repositoryFlux = gitHubApiClientService.fetchAllRepositories(provider.getApiUrl(), provider.getEncryptedAccessToken());
        } else if (provider.getProviderType().equals(CodeRepo.RepoType.GITEA)) {
            repositoryFlux = giteaApiClientService.fetchAllRepositories(provider.getApiUrl(), provider.getEncryptedAccessToken());
        } else if (provider.getProviderType().equals(CodeRepo.RepoType.BITBUCKET)) {
            repositoryFlux = bitbucketApiClientService.fetchAllRepositories(provider.getApiUrl(), provider.getEncryptedAccessToken());
        } else {
            log.warn("Repository sync skipped: unsupported provider type {} for {}", provider.getProviderType(), provider.getApiUrl());
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
                    } else if (project instanceof ImportCodeRepoBitbucketResponseDto) {
                        remoteId = ((ImportCodeRepoBitbucketResponseDto) project).getId();
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
                    long repoCount = codeRepoRepository.countByRepoUrlStartingWith(repoUrlPrefix);
                    log.info("Finished repository sync for provider: {}. Repositories on this host in DB: {}", provider.getApiUrl(), repoCount);
                    Long providerId = provider.getId();
                    if (providerId == null) {
                        log.warn("Provider has no id; cannot persist sync metadata for {}", provider.getApiUrl());
                        return;
                    }
                    Mono.fromRunnable(() -> repositoryProviderRepository.findById(providerId).ifPresent(p -> {
                                p.setSyncedRepoCount((int) repoCount);
                                p.setLastSyncDate(LocalDateTime.now());
                                repositoryProviderRepository.save(p);
                            }))
                            .subscribeOn(Schedulers.boundedElastic())
                            .subscribe(
                                    unused -> {},
                                    e -> log.error("Failed to persist sync metadata for provider {}: {}", provider.getApiUrl(), e.getMessage(), e));
                })
                .doOnError(error -> log.error("Synchronization failed for provider {}: {}", provider.getApiUrl(), error.getMessage(), error))
                .subscribe();
    }

    /**
     * Aligns {@code apiUrl} with how {@link CodeRepo#getRepourl()} is stored (web URL sharing the same origin prefix).
     */
    private static String normalizeProviderApiUrlPrefix(String apiUrl) {
        if (apiUrl == null) {
            return "";
        }
        String t = apiUrl.trim();
        while (t.endsWith("/")) {
            t = t.substring(0, t.length() - 1);
        }
        return t;
    }
}
