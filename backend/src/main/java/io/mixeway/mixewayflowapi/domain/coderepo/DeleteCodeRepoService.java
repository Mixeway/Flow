package io.mixeway.mixewayflowapi.domain.coderepo;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.repository.AppDataTypeRepository;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoBranchRepository;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoFindingStatsRepository;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoRepository;
import io.mixeway.mixewayflowapi.db.repository.CommentRepository;
import io.mixeway.mixewayflowapi.db.repository.FindingRepository;
import io.mixeway.mixewayflowapi.db.repository.ScanInfoRepository;
import io.mixeway.mixewayflowapi.db.repository.SuppressRuleRepository;
import io.mixeway.mixewayflowapi.exceptions.CodeRepoNotFoundException;
import io.mixeway.mixewayflowapi.utils.PermissionFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;

@Service
@RequiredArgsConstructor
@Log4j2
public class DeleteCodeRepoService {
    private final FindCodeRepoService findCodeRepoService;
    private final CodeRepoRepository codeRepoRepository;
    private final CodeRepoBranchRepository codeRepoBranchRepository;
    private final FindingRepository findingRepository;
    private final ScanInfoRepository scanInfoRepository;
    private final CodeRepoFindingStatsRepository codeRepoFindingStatsRepository;
    private final AppDataTypeRepository appDataTypeRepository;
    private final CommentRepository commentRepository;
    private final SuppressRuleRepository suppressRuleRepository;
    private final PermissionFactory permissionFactory;

    @Transactional
    public void deleteRepo(Long repoId, Principal principal) {
        CodeRepo repo = findCodeRepoService.findById(repoId)
                .orElseThrow(() -> new CodeRepoNotFoundException("Code repository not found"));

        permissionFactory.canUserManageTeam(repo.getTeam(), principal);
        performDelete(repoId);
        log.info("[CodeRepo] Deleted repository {} by {}", repoId, principal.getName());
    }

    /**
     * Deletes a repository and all related rows. Call this from other Spring beans so that
     * {@link Transactional} opens a persistence session (private self-invocation would skip it).
     */
    @Transactional
    public void deleteRepoById(long repoId) {
        performDelete(repoId);
    }

    private void performDelete(long repoId) {
        CodeRepo repo = codeRepoRepository.findById(repoId).orElse(null);
        if (repo == null) {
            log.warn("[CodeRepo] Skipping deletion, repository id={} not found", repoId);
            return;
        }

        String name = repo.getName();
        log.info("[CodeRepo] Starting deletion of repository id={} name={}", repoId, name);

        commentRepository.deleteByCodeRepoId(repoId);
        findingRepository.deleteByCodeRepo(repo);
        scanInfoRepository.deleteByCodeRepo(repo);
        codeRepoFindingStatsRepository.deleteByCodeRepo(repo);

        appDataTypeRepository.deleteCategoryGroupsByCodeRepoId(repoId);
        appDataTypeRepository.deleteLocationsByCodeRepoId(repoId);
        appDataTypeRepository.deleteByCodeRepoId(repoId);

        suppressRuleRepository.deleteByCodeRepoId(repoId);
        codeRepoRepository.deleteComponentLinksByRepoId(repoId);
        codeRepoRepository.deleteLanguagesByRepoId(repoId);
        codeRepoRepository.clearDefaultBranchByRepoId(repoId);
        codeRepoBranchRepository.deleteByCodeRepoId(repoId);
        codeRepoRepository.deleteRepoRowById(repoId);

        log.info("[CodeRepo] Successfully deleted repository id={} name={}", repoId, name);
    }
}
