package io.mixeway.mixewayflowapi.domain.coderepo;

import ch.qos.logback.core.spi.ScanException;
import io.mixeway.mixewayflowapi.api.coderepo.dto.CreateCodeRepoRequestDto;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoRepository;
import io.mixeway.mixewayflowapi.domain.coderepobranch.GetOrCreateCodeRepoBranchService;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import io.mixeway.mixewayflowapi.exceptions.TeamNotFoundException;
import io.mixeway.mixewayflowapi.integrations.repo.dto.ImportCodeRepoResponseDto;
import io.mixeway.mixewayflowapi.integrations.repo.service.GetCodeRepoInfoService;
import io.mixeway.mixewayflowapi.integrations.scanner.sca.service.SCAService;
import io.mixeway.mixewayflowapi.scanmanager.service.ScanManagerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
public class CreateCodeRepoService {
    private final CodeRepoRepository codeRepoRepository;
    private final FindTeamService findTeamService;
    private final GetCodeRepoInfoService getCodeRepoInfoService;
    private final GetOrCreateCodeRepoBranchService findOrCreateCodeRepoBranchService;
    private final SCAService scaService;
    private final ScanManagerService scanManagerService;


    public void createCodeRepo(CreateCodeRepoRequestDto createCodeRepoRequestDto, CodeRepo.RepoType repoType) throws IOException, ScanException, InterruptedException {
        ImportCodeRepoResponseDto importCodeRepoResponseDto = getCodeRepoInfoService.getRepoResponse(createCodeRepoRequestDto, repoType);
        Optional<Team> team = findTeamService.findById(createCodeRepoRequestDto.getTeam());
        Optional<CodeRepo> cr = codeRepoRepository.findByRepourl(importCodeRepoResponseDto.getWebUrl());
        if (team.isPresent() && cr.isEmpty()){
           CodeRepo codeRepo = new CodeRepo(
                   createCodeRepoRequestDto.getName(),
                   importCodeRepoResponseDto.getWebUrl(), createCodeRepoRequestDto.getAccessToken(),team.get(),
                   importCodeRepoResponseDto.getId(), repoType);
           codeRepo = codeRepoRepository.save(codeRepo);
           CodeRepoBranch codeRepoBranch = findOrCreateCodeRepoBranchService.getOrCreateCodeRepoBranch(importCodeRepoResponseDto.getDefaultBranch(),codeRepo);
           codeRepo.updateBranch(codeRepoBranch);
           codeRepoRepository.save(codeRepo);
           log.info("[CodeRepoService] Created repo {} in team {} with default branch {}", codeRepo.getRepourl(), team.get().getName(), codeRepoBranch.getName());
           CodeRepo finalCodeRepo = codeRepo;
           getCodeRepoInfoService.getRepoLanguages(codeRepo).forEach(finalCodeRepo::upsertLanguage);
           finalCodeRepo = codeRepoRepository.save(finalCodeRepo);
           scaService.createDtrackProject(finalCodeRepo);
           log.info("[CodeRepoService] Creating intial scan for {} default branch {}", codeRepo.getRepourl(), codeRepoBranch.getName());
           scanManagerService.scanRepository(finalCodeRepo, finalCodeRepo.getDefaultBranch(), null);

        } else {
            throw new TeamNotFoundException();
        }
        log.info("[CodeRepo] Imported Code repo from {} id {} name {}",
                importCodeRepoResponseDto.getWebUrl(),
                importCodeRepoResponseDto.getId(),
                importCodeRepoResponseDto.getPathWithNamespace());

    }
}
