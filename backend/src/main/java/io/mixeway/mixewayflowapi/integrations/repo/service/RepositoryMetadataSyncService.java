package io.mixeway.mixewayflowapi.integrations.repo.service;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.repository.AppDataTypeRepository;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoBranchRepository;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoFindingStatsRepository;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoRepository;
import io.mixeway.mixewayflowapi.db.repository.FindingRepository;
import io.mixeway.mixewayflowapi.db.repository.ScanInfoRepository;
import io.mixeway.mixewayflowapi.domain.coderepo.DeleteCodeRepoService;
import io.mixeway.mixewayflowapi.domain.coderepobranch.GetOrCreateCodeRepoBranchService;
import io.mixeway.mixewayflowapi.integrations.repo.apiclient.BitbucketApiClientService;
import io.mixeway.mixewayflowapi.integrations.repo.apiclient.GitHubApiClientService;
import io.mixeway.mixewayflowapi.integrations.repo.apiclient.GitLabApiClientService;
import io.mixeway.mixewayflowapi.integrations.repo.apiclient.GitLabApiException;
import io.mixeway.mixewayflowapi.integrations.repo.apiclient.GiteaApiClientService;
import io.mixeway.mixewayflowapi.integrations.repo.dto.ImportCodeRepoResponseDto;
import io.mixeway.mixewayflowapi.scanmanager.service.ScanManagerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class RepositoryMetadataSyncService {
    private final CodeRepoRepository codeRepoRepository;
    private final CodeRepoBranchRepository codeRepoBranchRepository;
    private final FindingRepository findingRepository;
    private final ScanInfoRepository scanInfoRepository;
    private final CodeRepoFindingStatsRepository codeRepoFindingStatsRepository;
    private final AppDataTypeRepository appDataTypeRepository;
    private final GetOrCreateCodeRepoBranchService getOrCreateCodeRepoBranchService;
    private final GitService gitService;
    private final GitLabApiClientService gitLabApiClientService;
    private final GitHubApiClientService gitHubApiClientService;
    private final GiteaApiClientService giteaApiClientService;
    private final BitbucketApiClientService bitbucketApiClientService;
    private final ScanManagerService scanManagerService;
    private final DeleteCodeRepoService deleteCodeRepoService;

    /**
     * Minimum gap between GitLab API and git calls during metadata sync.
     * 1000 ms stays under the GitLab.com Free limits (100 requests/min burst, 5000/hour)
     * for a single token, including {@code git ls-remote}. Set to 0 on a self-managed
     * instance that does not throttle.
     */
    @Value("${mixeway.gitlab.metadata-sync.interval-ms:1000}")
    private long gitlabCallIntervalMs;

    private final AtomicBoolean syncInProgress = new AtomicBoolean(false);
    private long lastGitlabCallAtNanos;

    @Async
    public void syncAllRepositoriesMetadata() {
        if (!syncInProgress.compareAndSet(false, true)) {
            log.warn("Repository metadata sync is already running, skipping this trigger");
            return;
        }
        try {
            List<CodeRepo> gitlabRepos = new ArrayList<>();
            List<CodeRepo> otherRepos = new ArrayList<>();
            codeRepoRepository.findAll().forEach(codeRepo -> {
                if (codeRepo.getType() == CodeRepo.RepoType.GITLAB) {
                    gitlabRepos.add(codeRepo);
                } else {
                    otherRepos.add(codeRepo);
                }
            });
            log.info("Repository metadata sync starting. GitLab repos={}, other repos={}, GitLab call interval={} ms",
                    gitlabRepos.size(), otherRepos.size(), Math.max(0, gitlabCallIntervalMs));
            syncGitLabRepositories(gitlabRepos);
            for (CodeRepo codeRepo : otherRepos) {
                syncRepositoryMetadata(codeRepo);
            }
            log.info("Repository metadata sync finished");
        } catch (Exception e) {
            log.error("Repository metadata sync failed: {}", e.getMessage(), e);
        } finally {
            syncInProgress.set(false);
        }
    }

    private void syncGitLabRepositories(List<CodeRepo> gitlabRepos) {
        if (gitlabRepos.isEmpty()) {
            return;
        }
        Map<String, List<CodeRepo>> groups = new LinkedHashMap<>();
        List<CodeRepo> oneByOne = new ArrayList<>();
        for (CodeRepo codeRepo : gitlabRepos) {
            String groupKey = gitLabGroupKey(codeRepo);
            if (groupKey == null) {
                oneByOne.add(codeRepo);
            } else {
                groups.computeIfAbsent(groupKey, key -> new ArrayList<>()).add(codeRepo);
            }
        }

        List<GitLabBranchTarget> branchTargets = new ArrayList<>();
        int groupNumber = 0;
        for (List<CodeRepo> group : groups.values()) {
            groupNumber++;
            String host = safeHost(group.get(0));
            log.info("GitLab metadata group {} host={} repos={}", groupNumber, host, group.size());
            loadGitLabGroup(group, host, branchTargets, oneByOne);
        }
        for (CodeRepo codeRepo : oneByOne) {
            syncRepositoryMetadata(codeRepo);
        }
        syncGitLabBranches(branchTargets);
    }

    private void loadGitLabGroup(List<CodeRepo> group, String host, List<GitLabBranchTarget> branchTargets,
                                 List<CodeRepo> oneByOne) {
        Map<Integer, ImportCodeRepoResponseDto> remoteProjects;
        try {
            remoteProjects = gitLabApiClientService.listProjectsForMetadata(
                    host, group.get(0).getAccessToken(), this::paceGitlab);
        } catch (GitLabApiException exception) {
            if (exception.isListUnavailable()) {
                log.warn("GitLab project list unavailable for {} (HTTP {}). Falling back to one request per repository for {} repos.",
                        host, exception.status(), group.size());
                oneByOne.addAll(group);
                return;
            }
            log.warn("GitLab project list failed for {}: {}", host, exception.getMessage());
            oneByOne.addAll(group);
            return;
        } catch (IllegalStateException exception) {
            throw exception;
        } catch (Exception exception) {
            log.warn("GitLab project list failed for {}: {}", host, exception.getMessage());
            oneByOne.addAll(group);
            return;
        }

        int missing = 0;
        for (CodeRepo codeRepo : group) {
            ImportCodeRepoResponseDto dto = remoteProjects.get(codeRepo.getRemoteId());
            if (dto == null) {
                missing++;
                continue;
            }
            while (true) {
                try {
                    MetadataSyncOutcome outcome = applyRepositoryMetadata(codeRepo, toRepoMetadata(dto));
                    if (outcome != null) {
                        branchTargets.add(new GitLabBranchTarget(outcome.current(), outcome.defaultBranch(), outcome.webUrl(), outcome.defaultBranchChanged()));
                    }
                    break;
                } catch (Exception exception) {
                    if (onFailure(exception, "repo " + codeRepo.getId()) != FailureAction.RETRY) {
                        break;
                    }
                }
            }
        }
        if (missing > 0) {
            log.warn("GitLab project list for {} did not include {} tracked repositories. They were left unchanged.",
                    host, missing);
        }
    }

    private void syncGitLabBranches(List<GitLabBranchTarget> targets) {
        if (targets.isEmpty()) {
            return;
        }
        targets.sort(Comparator.comparingLong(target -> target.codeRepo().getId()));
        int total = targets.size();
        long intervalMs = Math.max(0, gitlabCallIntervalMs);
        long expectedMinutes = TimeUnit.MILLISECONDS.toMinutes(total * intervalMs);
        log.info("GitLab branch listing for {} repositories, about {} min at {} ms between calls",
                total, expectedMinutes, intervalMs);

        for (int index = 0; index < total; index++) {
            GitLabBranchTarget target = targets.get(index);
            while (refreshBranches(target) == FailureAction.RETRY) {
                // 429: wait out the limit and finish this repository in the same daily run
            }
        }
    }

    private FailureAction refreshBranches(GitLabBranchTarget target) {
        try {
            paceGitlab();
            BranchSyncResult branchSyncResult = syncRepositoryBranches(
                    target.codeRepo(), target.defaultBranch(), target.webUrl());
            if (branchSyncResult.hasChanges()) {
                log.info(
                        "Repository metadata sync updated branches repoId={} remoteId={} [branchesAdded={}, branchesMarkedExisting={}, branchesMarkedMissing={}]",
                        target.codeRepo().getId(),
                        target.codeRepo().getRemoteId(),
                        branchSyncResult.branchesAdded(),
                        branchSyncResult.branchesMarkedExisting(),
                        branchSyncResult.branchesMarkedMissing()
                );
            }
            if (target.defaultBranchChanged()) {
                CodeRepo current = target.codeRepo();
                log.info("Default branch changed for repoId={} (remoteId={}). Triggering scan on branch {}.",
                        current.getId(), current.getRemoteId(), current.getDefaultBranch().getName());
                scanManagerService.scanRepository(current, current.getDefaultBranch(), null, null);
            }
            return FailureAction.SKIP;
        } catch (Exception e) {
            return onFailure(e, "branches of repo " + target.codeRepo().getId());
        }
    }

    private void syncRepositoryMetadata(CodeRepo codeRepo) {
        while (true) {
            try {
                if (codeRepo.getType() == CodeRepo.RepoType.GITLAB) {
                    paceGitlab();
                }
                RepoMetadata metadata = fetchRepositoryMetadata(codeRepo);
                MetadataSyncOutcome outcome = applyRepositoryMetadata(codeRepo, metadata);
                if (outcome == null) {
                    return;
                }
                if (codeRepo.getType() == CodeRepo.RepoType.GITLAB) {
                    paceGitlab();
                }
                BranchSyncResult branchSyncResult = syncRepositoryBranches(
                        outcome.current(), outcome.defaultBranch(), outcome.webUrl());
                logMetadataUpdate(codeRepo, outcome, branchSyncResult);
                if (outcome.defaultBranchChanged()) {
                    CodeRepo current = outcome.current();
                    log.info("Default branch changed for repoId={} (remoteId={}). Triggering scan on branch {}.",
                            current.getId(), current.getRemoteId(), current.getDefaultBranch().getName());
                    scanManagerService.scanRepository(current, current.getDefaultBranch(), null, null);
                }
                return;
            } catch (Exception e) {
                if (onFailure(e, "repo " + codeRepo.getId()) != FailureAction.RETRY) {
                    return;
                }
            }
        }
    }

    /**
     * @return null when there is nothing left to sync (missing data, or the archived repository was deleted)
     */
    private MetadataSyncOutcome applyRepositoryMetadata(CodeRepo codeRepo, RepoMetadata metadata) {
        if (metadata == null || !hasText(metadata.name()) || !hasText(metadata.webUrl()) || !hasText(metadata.defaultBranch())) {
            return null;
        }
        if (metadata.archived()) {
            log.info("Repository repoId={} remoteId={} name={} is archived. Deleting from database.",
                    codeRepo.getId(), codeRepo.getRemoteId(), codeRepo.getName());
            deleteCodeRepoService.deleteRepoById(codeRepo.getId());
            return null;
        }

        String normalizedName = metadata.name().replace(" ", "");
        CodeRepoBranch defaultBranch = getOrCreateCodeRepoBranchService.getOrCreateCodeRepoBranch(metadata.defaultBranch(), codeRepo);
        boolean nameChanged = !Objects.equals(codeRepo.getName(), normalizedName);
        boolean urlChanged = !Objects.equals(codeRepo.getRepourl(), metadata.webUrl());
        boolean defaultBranchChanged = codeRepo.getDefaultBranch() == null
                || !Objects.equals(codeRepo.getDefaultBranch().getName(), defaultBranch.getName());

        CodeRepo currentCodeRepo = codeRepo;
        if (nameChanged || urlChanged || defaultBranchChanged) {
            codeRepoRepository.updateRepositoryMetadata(codeRepo.getId(), normalizedName, metadata.webUrl(), defaultBranch);
            currentCodeRepo = codeRepoRepository.findById(codeRepo.getId()).orElse(codeRepo);
            log.info(
                    "Repository metadata sync updated repoId={} remoteId={} [nameChanged={}, urlChanged={}, defaultBranchChanged={}]",
                    codeRepo.getId(),
                    codeRepo.getRemoteId(),
                    nameChanged,
                    urlChanged,
                    defaultBranchChanged
            );
        }
        return new MetadataSyncOutcome(currentCodeRepo, metadata.defaultBranch(), metadata.webUrl(), defaultBranchChanged);
    }

    private void logMetadataUpdate(CodeRepo codeRepo, MetadataSyncOutcome outcome, BranchSyncResult branchSyncResult) {
        if (!outcome.defaultBranchChanged() && !branchSyncResult.hasChanges()) {
            return;
        }
        log.info(
                "Repository metadata sync updated repoId={} remoteId={} [defaultBranchChanged={}, branchesAdded={}, branchesMarkedExisting={}, branchesMarkedMissing={}]",
                codeRepo.getId(),
                codeRepo.getRemoteId(),
                outcome.defaultBranchChanged(),
                branchSyncResult.branchesAdded(),
                branchSyncResult.branchesMarkedExisting(),
                branchSyncResult.branchesMarkedMissing()
        );
    }

    private FailureAction onFailure(Exception exception, String context) {
        if (exception instanceof IllegalStateException && Thread.currentThread().isInterrupted()) {
            throw (IllegalStateException) exception;
        }
        if (!isGitLabRateLimit(exception)) {
            log.warn("Failed to sync metadata ({}): {}", context, exception.getMessage());
            return FailureAction.SKIP;
        }
        long waitSeconds = retryAfterSeconds(exception);
        log.warn("GitLab rate limit during {}. Waiting {}s, then continuing the same daily sync.", context, waitSeconds);
        sleepMillis(waitSeconds * 1000L);
        return FailureAction.RETRY;
    }

    private void paceGitlab() {
        long intervalNanos = TimeUnit.MILLISECONDS.toNanos(Math.max(0, gitlabCallIntervalMs));
        long now = System.nanoTime();
        if (lastGitlabCallAtNanos != 0 && intervalNanos > 0) {
            long remaining = intervalNanos - (now - lastGitlabCallAtNanos);
            if (remaining > 0) {
                sleepMillis(TimeUnit.NANOSECONDS.toMillis(remaining));
            }
        }
        lastGitlabCallAtNanos = System.nanoTime();
    }

    private static void sleepMillis(long millis) {
        if (millis <= 0) {
            return;
        }
        try {
            Thread.sleep(millis);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("interrupted", exception);
        }
    }

    private static String gitLabGroupKey(CodeRepo codeRepo) {
        try {
            String host = codeRepo.getGitHostUrl();
            String token = codeRepo.getAccessToken();
            if (host == null || host.isBlank() || token == null || token.isBlank()) {
                return null;
            }
            return host + "\n" + token;
        } catch (Exception exception) {
            return null;
        }
    }

    private static String safeHost(CodeRepo codeRepo) {
        try {
            return codeRepo.getGitHostUrl();
        } catch (Exception exception) {
            return codeRepo.getRepourl();
        }
    }

    private static boolean isGitLabRateLimit(Throwable error) {
        Throwable current = error;
        while (current != null) {
            if (current instanceof GitLabApiException gitlabApiException && gitlabApiException.isRateLimited()) {
                return true;
            }
            String message = current.getMessage();
            if (message != null) {
                String normalized = message.toLowerCase(Locale.ROOT);
                if (message.contains("429") || normalized.contains("rate limit") || normalized.contains("too many requests")) {
                    return true;
                }
            }
            current = current.getCause();
        }
        return false;
    }

    private static long retryAfterSeconds(Throwable error) {
        Throwable current = error;
        while (current != null) {
            if (current instanceof GitLabApiException gitlabApiException && gitlabApiException.retryAfterSeconds() > 0) {
                return gitlabApiException.retryAfterSeconds();
            }
            current = current.getCause();
        }
        return 60;
    }

    private static RepoMetadata toRepoMetadata(ImportCodeRepoResponseDto dto) {
        return new RepoMetadata(dto.getId(), dto.getPathWithNamespace(), dto.getWebUrl(), dto.getDefaultBranch(), dto.isArchived());
    }

    private enum FailureAction {
        SKIP, RETRY
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    @Transactional
    private void deleteArchivedRepository(CodeRepo repo) {
        log.info("[RepositoryMetadataSync] Starting deletion of archived repository id={} name={}", repo.getId(), repo.getName());
        
        // Clear components relationship
        if (repo.getComponents() != null && !repo.getComponents().isEmpty()) {
            repo.setComponents(Collections.emptyList());
            codeRepoRepository.save(repo);
        }
        
        // Delete all findings and related data
        findingRepository.deleteByCodeRepo(repo);
        scanInfoRepository.deleteByCodeRepo(repo);
        codeRepoFindingStatsRepository.deleteByCodeRepo(repo);
        appDataTypeRepository.deleteAllByCodeRepo(repo);
        
        // Delete branches explicitly (including default branch reference)
        List<CodeRepoBranch> branches = codeRepoBranchRepository.findByCodeRepo(repo);
        if (!branches.isEmpty()) {
            log.debug("[RepositoryMetadataSync] Deleting {} branches for repository id={}", branches.size(), repo.getId());
            codeRepoBranchRepository.deleteAll(branches);
        }
        
        // Finally, delete the repository itself
        codeRepoRepository.delete(repo);
        log.info("[RepositoryMetadataSync] Successfully deleted archived repository id={} name={}", repo.getId(), repo.getName());
    }

    private RepoMetadata fetchRepositoryMetadata(CodeRepo codeRepo) throws Exception {
        String gitHostUrl = codeRepo.getGitHostUrl();
        ImportCodeRepoResponseDto dto;
        if (codeRepo.getType().equals(CodeRepo.RepoType.GITLAB)) {
            dto = gitLabApiClientService.getProjectInfo((long) codeRepo.getRemoteId(), gitHostUrl, codeRepo.getAccessToken()).block();
        } else if (codeRepo.getType().equals(CodeRepo.RepoType.GITHUB)) {
            var githubDto = gitHubApiClientService.getProjectInfo(codeRepo.getName(), gitHostUrl, codeRepo.getAccessToken()).block();
            if (githubDto == null) {
                return null;
            }
        dto = new ImportCodeRepoResponseDto();
        dto.setId(githubDto.getId());
        dto.setPathWithNamespace(githubDto.getPathWithNamespace());
        dto.setWebUrl(githubDto.getWebUrl());
        dto.setDefaultBranch(githubDto.getDefaultBranch());
        dto.setArchived(githubDto.isArchived());
        } else if (codeRepo.getType().equals(CodeRepo.RepoType.GITEA)) {
            var giteaDto = giteaApiClientService.getProjectInfo(codeRepo.getName(), gitHostUrl, codeRepo.getAccessToken()).block();
            if (giteaDto == null) {
                return null;
            }
        dto = new ImportCodeRepoResponseDto();
        dto.setId(giteaDto.getId());
        dto.setPathWithNamespace(giteaDto.getPathWithNamespace());
        dto.setWebUrl(giteaDto.getWebUrl());
        dto.setDefaultBranch(giteaDto.getDefaultBranch());
        dto.setArchived(giteaDto.isArchived());
        } else if (codeRepo.getType().equals(CodeRepo.RepoType.BITBUCKET)) {
            var bitbucketDto = bitbucketApiClientService.getProjectInfo(codeRepo.getName(), gitHostUrl, codeRepo.getAccessToken()).block();
            if (bitbucketDto == null) {
                return null;
            }
        dto = new ImportCodeRepoResponseDto();
        dto.setId(bitbucketDto.getId());
        dto.setPathWithNamespace(bitbucketDto.getPathWithNamespace());
        dto.setWebUrl(bitbucketDto.getWebUrl());
        dto.setDefaultBranch(bitbucketDto.getDefaultBranch());
        dto.setArchived(bitbucketDto.isArchived());
        } else {
            return null;
        }

        if (dto == null) {
            return null;
        }
        return new RepoMetadata(dto.getId(), dto.getPathWithNamespace(), dto.getWebUrl(), dto.getDefaultBranch(), dto.isArchived());
    }

    private BranchSyncResult syncRepositoryBranches(CodeRepo codeRepo, String defaultBranchName, String preferredRepoUrl) throws Exception {
        String repoUrl = hasText(preferredRepoUrl) ? preferredRepoUrl : codeRepo.getRepourl();
        List<String> branchNames = gitService.listRemoteBranches(repoUrl, codeRepo.getAccessToken(), codeRepo.getType());
        List<CodeRepoBranch> localBranches = codeRepoBranchRepository.findByCodeRepo(codeRepo);
        java.util.Map<String, CodeRepoBranch> localBranchesByName = localBranches.stream()
                .collect(Collectors.toMap(CodeRepoBranch::getName, b -> b, (a, b) -> a));
        Set<String> localBranchNames = localBranches.stream()
                .map(CodeRepoBranch::getName)
                .collect(Collectors.toSet());
        Set<String> remoteBranchNames = new java.util.HashSet<>();
        int branchesAdded = 0;
        int branchesMarkedExisting = 0;
        int branchesMarkedMissing = 0;

        if (branchNames != null) {
            for (String branchName : branchNames) {
                if (!hasText(branchName)) {
                    continue;
                }
                remoteBranchNames.add(branchName);
                if (!localBranchNames.contains(branchName)) {
                    CodeRepoBranch branch = getOrCreateCodeRepoBranchService.getOrCreateCodeRepoBranch(branchName, codeRepo);
                    branchesAdded++;
                    localBranchNames.add(branchName);
                    if (!branch.isExistsOnRemote()) {
                        branch.markRemotePresence(true);
                        codeRepoBranchRepository.save(branch);
                        branchesMarkedExisting++;
                    }
                } else {
                    CodeRepoBranch branch = localBranchesByName.get(branchName);
                    if (branch != null && !branch.isExistsOnRemote()) {
                        branch.markRemotePresence(true);
                        codeRepoBranchRepository.save(branch);
                        branchesMarkedExisting++;
                    }
                }
            }
        }

        if (hasText(defaultBranchName)) {
            remoteBranchNames.add(defaultBranchName);
            CodeRepoBranch defaultBranch = getOrCreateCodeRepoBranchService.getOrCreateCodeRepoBranch(defaultBranchName, codeRepo);
            if (!localBranchNames.contains(defaultBranchName)) {
                branchesAdded++;
                localBranchNames.add(defaultBranchName);
            }
            if (!defaultBranch.isExistsOnRemote()) {
                defaultBranch.markRemotePresence(true);
                codeRepoBranchRepository.save(defaultBranch);
                branchesMarkedExisting++;
            }
        }

        for (CodeRepoBranch localBranch : localBranches) {
            String localName = localBranch.getName();
            boolean existsOnRemote = remoteBranchNames.contains(localName);
            if (localBranch.isExistsOnRemote() != existsOnRemote) {
                localBranch.markRemotePresence(existsOnRemote);
                codeRepoBranchRepository.save(localBranch);
                if (existsOnRemote) {
                    branchesMarkedExisting++;
                } else {
                    branchesMarkedMissing++;
                }
            }
        }
        return new BranchSyncResult(branchesAdded, branchesMarkedExisting, branchesMarkedMissing);
    }

    private record RepoMetadata(int remoteId, String name, String webUrl, String defaultBranch, boolean archived) {}
    private record MetadataSyncOutcome(CodeRepo current, String defaultBranch, String webUrl, boolean defaultBranchChanged) {}
    private record GitLabBranchTarget(CodeRepo codeRepo, String defaultBranch, String webUrl, boolean defaultBranchChanged) {}
    private record BranchSyncResult(int branchesAdded, int branchesMarkedExisting, int branchesMarkedMissing) {
        private boolean hasChanges() {
            return branchesAdded > 0 || branchesMarkedExisting > 0 || branchesMarkedMissing > 0;
        }
    }
}
