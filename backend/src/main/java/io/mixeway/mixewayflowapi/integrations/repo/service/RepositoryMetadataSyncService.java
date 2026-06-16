package io.mixeway.mixewayflowapi.integrations.repo.service;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoBranchRepository;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoRepository;
import io.mixeway.mixewayflowapi.domain.coderepobranch.GetOrCreateCodeRepoBranchService;
import io.mixeway.mixewayflowapi.integrations.repo.apiclient.BitbucketApiClientService;
import io.mixeway.mixewayflowapi.integrations.repo.apiclient.GitHubApiClientService;
import io.mixeway.mixewayflowapi.integrations.repo.apiclient.GitLabApiClientService;
import io.mixeway.mixewayflowapi.integrations.repo.apiclient.GiteaApiClientService;
import io.mixeway.mixewayflowapi.integrations.repo.dto.ImportCodeRepoResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class RepositoryMetadataSyncService {
    private final CodeRepoRepository codeRepoRepository;
    private final CodeRepoBranchRepository codeRepoBranchRepository;
    private final GetOrCreateCodeRepoBranchService getOrCreateCodeRepoBranchService;
    private final GitService gitService;
    private final GitLabApiClientService gitLabApiClientService;
    private final GitHubApiClientService gitHubApiClientService;
    private final GiteaApiClientService giteaApiClientService;
    private final BitbucketApiClientService bitbucketApiClientService;

    public void syncAllRepositoriesMetadata() {
        codeRepoRepository.findAll().forEach(this::syncRepositoryMetadata);
    }

    private void syncRepositoryMetadata(CodeRepo codeRepo) {
        try {
            RepoMetadata metadata = fetchRepositoryMetadata(codeRepo);
            if (metadata == null || !hasText(metadata.name()) || !hasText(metadata.webUrl()) || !hasText(metadata.defaultBranch())) {
                return;
            }

            String normalizedName = metadata.name().replace(" ", "");
            CodeRepoBranch defaultBranch = getOrCreateCodeRepoBranchService.getOrCreateCodeRepoBranch(metadata.defaultBranch(), codeRepo);
            boolean nameChanged = !Objects.equals(codeRepo.getName(), normalizedName);
            boolean urlChanged = !Objects.equals(codeRepo.getRepourl(), metadata.webUrl());
            boolean defaultBranchChanged = codeRepo.getDefaultBranch() == null
                    || !Objects.equals(codeRepo.getDefaultBranch().getName(), defaultBranch.getName());

            if (nameChanged || urlChanged || defaultBranchChanged) {
                codeRepoRepository.updateRepositoryMetadata(codeRepo.getId(), normalizedName, metadata.webUrl(), defaultBranch);
            }

            BranchSyncResult branchSyncResult = syncRepositoryBranches(codeRepo, metadata.defaultBranch(), metadata.webUrl());
            if (nameChanged || urlChanged || defaultBranchChanged || branchSyncResult.hasChanges()) {
                log.info(
                        "Repository metadata sync updated repoId={} remoteId={} [nameChanged={}, urlChanged={}, defaultBranchChanged={}, branchesAdded={}, branchesMarkedExisting={}, branchesMarkedMissing={}]",
                        codeRepo.getId(),
                        codeRepo.getRemoteId(),
                        nameChanged,
                        urlChanged,
                        defaultBranchChanged,
                        branchSyncResult.branchesAdded(),
                        branchSyncResult.branchesMarkedExisting(),
                        branchSyncResult.branchesMarkedMissing()
                );
            }
        } catch (Exception e) {
            log.warn("Failed to sync metadata for repo {} (id={}): {}", codeRepo.getName(), codeRepo.getId(), e.getMessage());
        }
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
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
        } else {
            return null;
        }

        if (dto == null) {
            return null;
        }
        return new RepoMetadata(dto.getId(), dto.getPathWithNamespace(), dto.getWebUrl(), dto.getDefaultBranch());
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

    private record RepoMetadata(int remoteId, String name, String webUrl, String defaultBranch) {}
    private record BranchSyncResult(int branchesAdded, int branchesMarkedExisting, int branchesMarkedMissing) {
        private boolean hasChanges() {
            return branchesAdded > 0 || branchesMarkedExisting > 0 || branchesMarkedMissing > 0;
        }
    }
}
