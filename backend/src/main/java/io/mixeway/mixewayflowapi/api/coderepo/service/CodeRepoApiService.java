package io.mixeway.mixewayflowapi.api.coderepo.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import io.mixeway.mixewayflowapi.api.coderepo.dto.GetCodeReposResponseDto;
import io.mixeway.mixewayflowapi.api.coderepo.dto.RunOrchScanDetailsDto;
import io.mixeway.mixewayflowapi.api.coderepo.dto.RunOrchScanReportDto;
import io.mixeway.mixewayflowapi.api.gitlabcicd.dto.GitLabCICDDetailsResponseDto;
import io.mixeway.mixewayflowapi.db.entity.*;
import io.mixeway.mixewayflowapi.db.repository.UserRepository;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.coderepo.UpdateCodeRepoService;
import io.mixeway.mixewayflowapi.domain.coderepobranch.GetOrCreateCodeRepoBranchService;
import io.mixeway.mixewayflowapi.domain.finding.FindFindingService;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import io.mixeway.mixewayflowapi.integrations.repo.service.GitService;
import io.mixeway.mixewayflowapi.exceptions.CodeRepoNotFoundException;
import io.mixeway.mixewayflowapi.exceptions.ScanThrottledException;
import io.mixeway.mixewayflowapi.exceptions.TeamNotFoundException;
import io.mixeway.mixewayflowapi.scanmanager.service.ScanManagerService;
import io.mixeway.mixewayflowapi.utils.PermissionFactory;
import com.fasterxml.jackson.core.JacksonException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.security.Principal;
import java.util.Comparator;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class CodeRepoApiService {

    private static final long MAX_SBOM_UPLOAD_BYTES = 50L * 1024 * 1024;

    private final FindCodeRepoService findCodeRepoService;
    private final ScanManagerService scanManagerService;
    private final PermissionFactory permissionFactory;
    private final FindTeamService findTeamService;
    private final UpdateCodeRepoService updateCodeRepoService;
    private final UserRepository userRepository;
    private final FindFindingService findFindingService;
    private final GitService gitService;
    private final GetOrCreateCodeRepoBranchService getOrCreateCodeRepoBranchService;
    private final ObjectMapper objectMapper;

    public List<GetCodeReposResponseDto> getRepos(Principal principal) {
        return findCodeRepoService.getCodeReposResponseDtos(principal);
    }

    public Page<GetCodeReposResponseDto> getRepos(Principal principal, Pageable pageable, String search) {
        return findCodeRepoService.getCodeReposResponseDtos(principal, pageable, search);
    }

    public CodeRepo getRepo(Long id, Principal principal) {
        return findCodeRepoService.findById(id, principal);
    }

    public List<GetCodeReposResponseDto> getReposByTeam(Long teamId, Principal principal) {
        Team team = findTeamService.findById(teamId)
                .orElseThrow(() -> new TeamNotFoundException("Team not found"));

        // Verify user has permission to access team
        permissionFactory.canUserAccessTeam(team, principal);

        List<CodeRepo> repos = findCodeRepoService.findByTeam(team);
        return repos.stream()
                .map(repo -> new GetCodeReposResponseDto(repo))
                .collect(Collectors.toList());
    }


    public void runScan(Long id, Principal principal) {
        CodeRepo repo = findCodeRepoService.findById(id, principal);
        if (repo != null){
            scanManagerService.scanRepository(repo, repo.getDefaultBranch(),null, null);
        }
    }

    public List<String> getRemoteBranches(Long id, Principal principal) {
        CodeRepo repo = findCodeRepoService.findById(id, principal);
        if (repo == null) {
            throw new CodeRepoNotFoundException("Repository not found");
        }
        try {
            return gitService.listRemoteBranches(repo.getRepourl(), repo.getAccessToken(), repo.getType());
        } catch (Exception e) {
            log.error("[CodeRepo] Error listing remote branches for repo {}: {}", id, e.getMessage());
            throw new RuntimeException("Failed to list remote branches: " + e.getMessage());
        }
    }

    public void runScanForBranch(Long id, String branchName, Principal principal) {
        CodeRepo repo = findCodeRepoService.findById(id, principal);
        if (repo == null) {
            throw new CodeRepoNotFoundException("Repository not found");
        }
        CodeRepoBranch branch = getOrCreateCodeRepoBranchService.getOrCreateCodeRepoBranch(branchName, repo);
        scanManagerService.scanRepository(repo, branch, null, null);
    }

    /**
     * Validates and stores an uploaded CycloneDX JSON SBOM as {@code sbom.json}, then queues an SCA-only Grype scan.
     *
     * @param branchName optional branch to associate findings with; defaults to the repository default branch
     */
    public void runScanFromUploadedSbom(Long repoId, MultipartFile file, String branchName, Principal principal)
            throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("SBOM file is required.");
        }
        if (file.getSize() > MAX_SBOM_UPLOAD_BYTES) {
            throw new IllegalArgumentException("SBOM file exceeds maximum allowed size (50 MB).");
        }

        CodeRepo repo = findCodeRepoService.findById(repoId, principal);
        CodeRepoBranch branch;
        if (branchName != null && !branchName.isBlank()) {
            branch = getOrCreateCodeRepoBranchService.getOrCreateCodeRepoBranch(branchName.trim(), repo);
        } else {
            branch = repo.getDefaultBranch();
        }

        Path workDir = Files.createTempDirectory("flow-sbom-upload-");
        Path target = workDir.resolve("sbom.json");
        try {
            try (var in = file.getInputStream()) {
                Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
            }
            objectMapper.readTree(target.toFile());
            scanManagerService.scanRepositoryFromUploadedSbom(repo, branch, workDir);
        } catch (ScanThrottledException e) {
            deleteSbomWorkDirQuietly(workDir);
            throw e;
        } catch (JacksonException e) {
            deleteSbomWorkDirQuietly(workDir);
            throw new IllegalArgumentException("Invalid JSON SBOM: " + e.getMessage(), e);
        }
    }

    private void deleteSbomWorkDirQuietly(Path workDir) {
        try {
            if (Files.isDirectory(workDir)) {
                try (var walk = Files.walk(workDir)) {
                    walk.sorted(Comparator.reverseOrder()).forEach(p -> {
                        try {
                            Files.deleteIfExists(p);
                        } catch (IOException ignored) {
                            // best effort
                        }
                    });
                }
            }
        } catch (IOException e) {
            log.warn("[CodeRepo] Failed to delete SBOM work directory {}: {}", workDir, e.getMessage());
        }
    }

    public void changeTeam(Long codeRepoId, Long newTeamId, Principal principal) {
        // Find the code repo
        CodeRepo codeRepo = findCodeRepoService.findById(codeRepoId)
                .orElseThrow(() -> new CodeRepoNotFoundException("Code repository not found"));

        // Verify user has permission to manage current team
        permissionFactory.canUserManageTeam(codeRepo.getTeam(), principal);

        // Find the new team
        Team newTeam = findTeamService.findById(newTeamId)
                .orElseThrow(() -> new TeamNotFoundException("New team not found"));

        // Verify user has permission to manage new team
        permissionFactory.canUserManageTeam(newTeam, principal);

        // Check if the teams are different
        if (codeRepo.getTeam().getId() == newTeamId) {
            throw new IllegalArgumentException("New team is the same as current team");
        }

        // Change the team
        updateCodeRepoService.changeTeam(codeRepo, newTeam);
    }

    public void bulkChangeTeam(List<Long> repositoryIds, Long newTeamId, Principal principal) {
        // For bulk actions by an admin, we trust the role.
        // Finer-grained checks could be added here if needed.

        // Find the new team
        Team newTeam = findTeamService.findById(newTeamId)
                .orElseThrow(() -> new TeamNotFoundException("New team not found"));

        // Call the bulk update service
        updateCodeRepoService.bulkChangeTeam(repositoryIds, newTeam);
    }

    public void bulkChangeAccessToken(List<Long> repositoryIds, String accessToken) {
        updateCodeRepoService.bulkChangeAccessToken(repositoryIds, accessToken);
    }

    public void renameCodeRepo(Long repoId, String newName, Principal principal) {
        CodeRepo repo = findCodeRepoService.findById(repoId)
                .orElseThrow(() -> new CodeRepoNotFoundException("Repository not found"));


        permissionFactory.canUserManageTeam(repo.getTeam(), principal);
        updateCodeRepoService.renameCodeRepo(repo, newName);
    }

    public Boolean isRepoInTeamByRemoteId(String repoUrl, Long teamId) {
        try {
            Optional<CodeRepo> codeRepo = findCodeRepoService.findCodeRepoByUrl(repoUrl);

            return codeRepo.isPresent() && String.valueOf(teamId).equals(codeRepo.get().getTeam().getRemoteIdentifier());
        } catch (Exception e) {
            log.error("[CodeRepo] Error checking if repo '{}' belongs to team '{}': {}", repoUrl, teamId, e.getMessage());
            return false;
        }
    }

    public Boolean isValidApiKey(String apiKey, String repoUrl) {
        Optional<UserInfo> userOptional = userRepository.findByApiKey(apiKey);
        Optional<Team> codeRepoTeam = findTeamService.findByRepoUrl(repoUrl);

        if (userOptional.isEmpty() || codeRepoTeam.isEmpty()) {
            return false;
        }

        if ("ADMIN".equals(userOptional.get().getHighestRole())) {
            log.info("[Team Service] Admin '{}' API key validation succeeded", userOptional.get().getUsername());
            return true;
        }

        List<UserInfo> teamUsers = userRepository.getUsersByTeamId(codeRepoTeam.get().getId());

        if (teamUsers.contains(userOptional.get())) {
            log.info("[Team Service] User's {} API key validation succeeded", userOptional.get().getUsername());
            return true;
        } else {
            log.info("[Team Service] User's {} API key validation failed", userOptional.get().getUsername());
            return false;
        }
    }

    public String runScan(String repoUrl, String branch, String domain) {

        CodeRepo codeRepo = findCodeRepoService.findCodeRepoByUrl(repoUrl).orElse(null);

        CodeRepoBranch repoBranch;

        if (branch == null) {
            repoBranch = codeRepo.getDefaultBranch();
        } else {
            repoBranch = codeRepo.getBranches()
                    .stream()
                    .filter(b -> b.getName().equals(branch))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Branch " + branch + " does not exist in the repository."));
        }

        scanManagerService.scanRepositorySync(codeRepo, repoBranch, null, null);

        RunOrchScanReportDto scanReport = new RunOrchScanReportDto();

        scanReport.setRepoUrl(repoUrl);
        scanReport.setBranch(repoBranch.getName());
        if (domain != null && !domain.isBlank() && !"null".equalsIgnoreCase(domain.trim())) {
            scanReport.setLinkToScanDetails("https://" + domain.trim() + "/#/show-repo/" + codeRepo.getId());
        }

        ObjectMapper mapper = new ObjectMapper();
        mapper.enable(SerializationFeature.INDENT_OUTPUT);

        Collection<Finding.Status> statuses = Arrays.asList(Finding.Status.NEW, Finding.Status.EXISTING);

        List<Finding> findings = findFindingService.findByCodeRepoAndCodeRepoBranchAndStatusIn(codeRepo, repoBranch, statuses);

        List<RunOrchScanDetailsDto> findingsDetails = new ArrayList<>();
        for (Finding finding : findings) {
            RunOrchScanDetailsDto scanDetails = new RunOrchScanDetailsDto();

            scanDetails.setName(finding.getVulnerability().getName());
            scanDetails.setDescription(finding.getVulnerability().getDescription());
            scanDetails.setExplanation(finding.getExplanation());
            scanDetails.setRecommendation(finding.getVulnerability().getRecommendation());
            scanDetails.setLocation(finding.getLocation());
            scanDetails.setSource(String.valueOf(finding.getSource()));
            scanDetails.setStatus(String.valueOf(finding.getStatus()));
            scanDetails.setSeverity(String.valueOf(finding.getSeverity()));

            findingsDetails.add(scanDetails);
        }

        scanReport.setFindings(findingsDetails);

        try {
            return mapper.writeValueAsString(scanReport);
        } catch (Exception e) {
            log.error("Error while serializing scan report: {}", e.getMessage());
        }
        return null;
    }
}
