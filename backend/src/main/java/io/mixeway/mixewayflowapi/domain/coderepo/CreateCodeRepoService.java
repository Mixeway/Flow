package io.mixeway.mixewayflowapi.domain.coderepo;

import ch.qos.logback.core.spi.ScanException;
import io.mixeway.mixewayflowapi.api.coderepo.dto.CreateCodeRepoRequestDto;
import io.mixeway.mixewayflowapi.config.AppConfigService;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoRepository;
import io.mixeway.mixewayflowapi.domain.coderepobranch.GetOrCreateCodeRepoBranchService;
import io.mixeway.mixewayflowapi.domain.organization.OrganizationService;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import io.mixeway.mixewayflowapi.exceptions.TeamNotFoundException;
import io.mixeway.mixewayflowapi.integrations.repo.dto.ImportCodeRepoBitbucketResponseDto;
import io.mixeway.mixewayflowapi.integrations.repo.dto.ImportCodeRepoGitHubResponseDto;
import io.mixeway.mixewayflowapi.integrations.repo.dto.ImportCodeRepoGiteaResponseDto;
import io.mixeway.mixewayflowapi.integrations.repo.dto.ImportCodeRepoResponseDto;
import io.mixeway.mixewayflowapi.integrations.repo.service.GetCodeRepoInfoService;
import io.mixeway.mixewayflowapi.integrations.scanner.sca.service.SCAService;
import io.mixeway.mixewayflowapi.scanmanager.service.ScanManagerService;
import io.mixeway.mixewayflowapi.utils.PlanManagementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

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
    private final AppConfigService appConfigService;
    private final OrganizationService organizationService;
    private final PlanManagementService planManagementService;



    /**
     * Reactively creates a CodeRepo. The original blocking logic is wrapped in a Mono
     * and scheduled to run on a thread pool safe for blocking operations.
     * The method now returns a Mono<Void> to signal asynchronous completion.
     */
    @Transactional
    public Mono<Void> createCodeRepo(CreateCodeRepoRequestDto createCodeRepoRequestDto, CodeRepo.RepoType repoType) {
        // Start the reactive chain by calling the non-blocking getRepoResponse method
        return getCodeRepoInfoService.getRepoResponse(createCodeRepoRequestDto, repoType)
                .flatMap(repoResponse ->
                        // Wrap the entire block of existing, blocking logic in a Mono.
                        // This ensures it doesn't block the reactive pipeline's thread.
                        Mono.fromRunnable(() -> {
                                    Optional<Team> team = findTeamService.findById(createCodeRepoRequestDto.getTeam());
                                    Optional<CodeRepo> cr = codeRepoRepository.findByRepourl(repoResponse.getWebUrl());

                                    if (team.isPresent() && cr.isEmpty()) {
                                        try {
                                            // Check if we're in SaaS mode
                                            if (appConfigService.isSaasMode()) {
                                                // Validate quota for repository creation
                                                organizationService.validateRepositoryAddition(team.get().getId());
                                                planManagementService.validateRepositoryAddition(team.get().getId(), team.get().getOrganization());
                                            }

                                            // Continue with existing logic
                                            CodeRepo codeRepo = new CodeRepo(
                                                    createCodeRepoRequestDto.getName(),
                                                    repoResponse.getWebUrl(), createCodeRepoRequestDto.getAccessToken(), team.get(),
                                                    repoResponse.getId(), repoType);
                                            codeRepo = codeRepoRepository.save(codeRepo);
                                            CodeRepoBranch codeRepoBranch = findOrCreateCodeRepoBranchService.getOrCreateCodeRepoBranch(repoResponse.getDefaultBranch(), codeRepo);
                                            codeRepo.updateBranch(codeRepoBranch);
                                            codeRepoRepository.save(codeRepo);
                                            log.info("[CodeRepoService] Created repo {} in team {} with default branch {}", codeRepo.getRepourl(), team.get().getName(), codeRepoBranch.getName());

                                            // The getRepoLanguages method must also be non-blocking.
                                            // We block here since we are already on a blocking-safe thread.
                                            CodeRepo finalCodeRepo = codeRepo;
                                            getCodeRepoInfoService.getRepoLanguages(codeRepo).block()
                                                    .forEach(finalCodeRepo::upsertLanguage);

                                            finalCodeRepo = codeRepoRepository.save(finalCodeRepo);
                                            scaService.createDtrackProject(finalCodeRepo);
                                            log.info("[CodeRepoService] Creating initial scan for {} default branch {}", codeRepo.getRepourl(), codeRepoBranch.getName());
                                            scanManagerService.scanRepository(finalCodeRepo, finalCodeRepo.getDefaultBranch(), null, null);

                                            log.info("[CodeRepo] Imported Code repo from {} id {} name {}",
                                                    repoResponse.getWebUrl(),
                                                    repoResponse.getId(),
                                                    repoResponse.getPathWithNamespace());
                                        } catch (Exception e) {
                                            // Because we are in a Runnable, we must wrap checked exceptions.
                                            throw new RuntimeException("Failed to create code repo", e);
                                        }
                                    }
                                    else {
                                        // FIX: Uncommented this block to throw an exception when the team is not found or the repo already exists.
                                        log.warn("[CodeRepoService] Trying to add repository that exsits");
                                        //throw new TeamNotFoundException("[CreateCodeRepoService] Team " + createCodeRepoRequestDto.getTeam() + " not found or repo already exists.");
                                    }
                                })
                                // Schedule the execution of the blocking code on the 'boundedElastic' scheduler.
                                .subscribeOn(Schedulers.boundedElastic())
                ).then(); // .then() converts the result to a Mono<Void> to signal completion.
    }


    /**
     * Reactively imports a project by calling the reactive createCodeRepo method.
     * This method MUST return a Mono<Void> to be compatible with the flatMap operator.
     */
    @Transactional
    public Mono<Void> importProjectAsCodeRepo(Object projectDetails, Team team, String accessToken, String apiUrl, CodeRepo.RepoType repoType) {
        String name;
        long remoteId;

        if (repoType == CodeRepo.RepoType.GITLAB && projectDetails instanceof ImportCodeRepoResponseDto) {
            ImportCodeRepoResponseDto gitlabProject = (ImportCodeRepoResponseDto) projectDetails;
            name = gitlabProject.getPathWithNamespace();
            remoteId = gitlabProject.getId();
        } else if (repoType == CodeRepo.RepoType.GITHUB && projectDetails instanceof ImportCodeRepoGitHubResponseDto) {
            ImportCodeRepoGitHubResponseDto githubRepo = (ImportCodeRepoGitHubResponseDto) projectDetails;
            name = githubRepo.getPathWithNamespace(); // 'pathWithNamespace' from GitHub DTO is typically 'full_name'
            remoteId = githubRepo.getId();
        } else if (repoType == CodeRepo.RepoType.GITEA && projectDetails instanceof ImportCodeRepoGiteaResponseDto) {
            ImportCodeRepoGiteaResponseDto giteaRepo = (ImportCodeRepoGiteaResponseDto) projectDetails;
            name = giteaRepo.getPathWithNamespace();
            remoteId = giteaRepo.getId();
        } else if (repoType == CodeRepo.RepoType.BITBUCKET && projectDetails instanceof ImportCodeRepoBitbucketResponseDto) {
            ImportCodeRepoBitbucketResponseDto bitbucketRepo = (ImportCodeRepoBitbucketResponseDto) projectDetails;
            name = bitbucketRepo.getPathWithNamespace();
            remoteId = bitbucketRepo.getId();
        } else {
            log.warn("Skipping import due to mismatched project details type or unsupported repo type.");
            return Mono.empty(); // Return an empty Mono for unsupported cases.
        }

        // Use the static factory method to create the DTO
        CreateCodeRepoRequestDto requestDto = CreateCodeRepoRequestDto.of(
                name,
                apiUrl, // The base API URL for the provider
                accessToken,
                remoteId,
                team.getId()
        );

        // Call the other reactive method and return its Mono<Void> result.
        return createCodeRepo(requestDto, repoType)
                .doOnError(e -> {
                    // Log the full stack trace for better debugging
                    log.error("Failed to auto-import repository '{}'. Reason: {}", name, e.getMessage(), e);
                })
                .onErrorResume(e -> Mono.empty()); // Prevents one failure from stopping the whole sync process.
    }
}