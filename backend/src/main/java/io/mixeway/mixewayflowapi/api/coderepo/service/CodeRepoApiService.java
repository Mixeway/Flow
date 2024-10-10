package io.mixeway.mixewayflowapi.api.coderepo.service;

import ch.qos.logback.core.spi.ScanException;
import io.mixeway.mixewayflowapi.api.coderepo.dto.GetCodeReposResponseDto;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.scanmanager.service.ScanManagerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class CodeRepoApiService {
    private final FindCodeRepoService findCodeRepoService;
    private final ScanManagerService scanManagerService;

    public List<GetCodeReposResponseDto> getRepos(Principal principal) {
        return findCodeRepoService.getCodeReposResponseDtos(principal);
    }

    public CodeRepo getRepo(Long id, Principal principal) {
        return findCodeRepoService.findById(id, principal);
    }

    public void runScan(Long id, Principal principal) {
        CodeRepo repo = findCodeRepoService.findById(id, principal);
        if (repo != null){
            scanManagerService.scanRepository(repo, repo.getDefaultBranch(),null, null);
        }
    }
}
