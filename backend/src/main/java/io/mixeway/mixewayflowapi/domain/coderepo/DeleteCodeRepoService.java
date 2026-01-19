package io.mixeway.mixewayflowapi.domain.coderepo;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.repository.AppDataTypeRepository;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoFindingStatsRepository;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoRepository;
import io.mixeway.mixewayflowapi.db.repository.FindingRepository;
import io.mixeway.mixewayflowapi.db.repository.ScanInfoRepository;
import io.mixeway.mixewayflowapi.exceptions.CodeRepoNotFoundException;
import io.mixeway.mixewayflowapi.utils.PermissionFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.Collections;

@Service
@RequiredArgsConstructor
@Log4j2
public class DeleteCodeRepoService {
    private final FindCodeRepoService findCodeRepoService;
    private final CodeRepoRepository codeRepoRepository;
    private final FindingRepository findingRepository;
    private final ScanInfoRepository scanInfoRepository;
    private final CodeRepoFindingStatsRepository codeRepoFindingStatsRepository;
    private final AppDataTypeRepository appDataTypeRepository;
    private final PermissionFactory permissionFactory;

    @Transactional
    public void deleteRepo(Long repoId, Principal principal) {
        CodeRepo repo = findCodeRepoService.findById(repoId)
                .orElseThrow(() -> new CodeRepoNotFoundException("Code repository not found"));

        permissionFactory.canUserManageTeam(repo.getTeam(), principal);

        if (repo.getComponents() != null && !repo.getComponents().isEmpty()) {
            repo.setComponents(Collections.emptyList());
        }

        findingRepository.deleteByCodeRepo(repo);
        scanInfoRepository.deleteByCodeRepo(repo);
        codeRepoFindingStatsRepository.deleteByCodeRepo(repo);
        appDataTypeRepository.deleteAllByCodeRepo(repo);
        codeRepoRepository.delete(repo);

        log.info("[CodeRepo] Deleted repository {} by {}", repoId, principal.getName());
    }
}
