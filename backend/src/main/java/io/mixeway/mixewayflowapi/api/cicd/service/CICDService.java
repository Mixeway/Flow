package io.mixeway.mixewayflowapi.api.cicd.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.mixeway.mixewayflowapi.api.cicd.dto.CicdScanRequestDto;
import io.mixeway.mixewayflowapi.api.cicd.dto.CodeRepoDto;
import io.mixeway.mixewayflowapi.api.cicd.dto.ValidateStatusDto;
import io.mixeway.mixewayflowapi.api.coderepo.service.UploadedSbom;
import io.mixeway.mixewayflowapi.api.gitlabcicd.service.GitLabCICDService;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.coderepobranch.GetOrCreateCodeRepoBranchService;
import io.mixeway.mixewayflowapi.domain.finding.FindFindingService;
import io.mixeway.mixewayflowapi.scanmanager.service.ScanManagerService;
import io.mixeway.mixewayflowapi.utils.StatusDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

@Service
@RequiredArgsConstructor
@Log4j2
public class CICDService {

    /** How long an SBOM upload waits for its result before telling the pipeline to ask again later. */
    static final long SBOM_RESULT_WAIT_MINUTES = 20;

    private final FindCodeRepoService findCodeRepoService;
    private final GetOrCreateCodeRepoBranchService getOrCreateCodeRepoBranchService;
    private final FindFindingService findFindingService;
    private final ValidateStatusMapper validateStatusMapper;
    private final ScanManagerService scanManagerService;
    private final GitLabCICDService gitLabCICDService;
    private final ObjectMapper objectMapper;
    private final PlatformTransactionManager transactionManager;

    @Value("${frontend.url:}")
    private String frontendUrl;

    public ResponseEntity<ValidateStatusDto> validateCodeRepo(CodeRepoDto codeRepoDto){
        Optional<CodeRepo> repo =findCodeRepoService.findCodeRepoByUrl(codeRepoDto.getRepoUrl());
        if (repo.isPresent() && repo.get().isScanNotRunning()
                && !scanManagerService.isPipelineSbomScanPending(repo.get().getId())){
            CodeRepoBranch codeRepoBranch = getOrCreateCodeRepoBranchService.getOrCreateCodeRepoBranch(codeRepoDto.getBranch(), repo.get());

            List<Finding> findings = findFindingService.getCodeRepoFindings(repo.get(), codeRepoBranch);
            ValidateStatusDto validateStatusDto = validateStatusMapper.mapFindingsToValidateStatusDto(findings);
            return new ResponseEntity<>(validateStatusDto, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.LOCKED);
        }

    }

    /**
     * Starts a scan of the commit a pipeline is building and returns at once; the pipeline carries on
     * (for instance building its SBOM) while Flow scans.
     */
    public ResponseEntity<StatusDTO> startScan(CicdScanRequestDto request, Principal principal) {
        if (isBlank(request.getRepoUrl()) || isBlank(request.getBranch())) {
            return status(HttpStatus.BAD_REQUEST, "repoUrl and branch are required");
        }
        Target target = findTarget(request.getRepoUrl(), request.getBranch(), principal);
        if (target == null) {
            return status(HttpStatus.NOT_FOUND, "Repository not found");
        }

        ScanManagerService.ScanRequest outcome = scanManagerService.requestScan(
                target.codeRepo(), target.branch(), blankToNull(request.getCommitId()),
                request.getPullRequestId(), request.isSbomFromPipeline());
        log.info("[CICD] Scan of {} / {} requested by pipeline (SBOM from pipeline: {}): {}",
                target.codeRepo().getName(), target.branch().getName(), request.isSbomFromPipeline(), outcome);

        return switch (outcome) {
            case STARTED -> status(HttpStatus.ACCEPTED, "started");
            case QUEUED -> status(HttpStatus.ACCEPTED, "queued");
            case THROTTLED -> status(HttpStatus.TOO_MANY_REQUESTS, "throttled");
        };
    }

    /**
     * Takes the SBOM a pipeline built and scans the dependencies from it. The scan waits its turn
     * behind a scan of the repository that is still running, so the result covers both.
     *
     * @param wait whether to hold the request until the result is there and answer with it - the same
     *             summary as {@code POST /api/v1/gitlabcicd/run} - instead of just accepting the upload
     */
    public ResponseEntity<?> uploadSbom(String repoUrl, String branchName, String commitId, Long pullRequestId,
                                        String domain, boolean wait, MultipartFile file, Principal principal)
            throws IOException {
        if (isBlank(repoUrl) || isBlank(branchName)) {
            return status(HttpStatus.BAD_REQUEST, "repoUrl and branch are required");
        }
        Path workDir;
        try {
            workDir = UploadedSbom.store(file, objectMapper);
        } catch (IllegalArgumentException e) {
            return status(HttpStatus.BAD_REQUEST, e.getMessage());
        }

        Target target;
        CompletableFuture<Void> scanned;
        try {
            target = findTarget(repoUrl, branchName, principal);
            if (target == null) {
                UploadedSbom.deleteQuietly(workDir);
                return status(HttpStatus.NOT_FOUND, "Repository not found");
            }
            scanned = scanManagerService.scanRepositoryFromPipelineSbom(
                    target.codeRepo(), target.branch(), workDir, blankToNull(commitId), pullRequestId);
        } catch (RuntimeException e) {
            UploadedSbom.deleteQuietly(workDir);
            throw e;
        }
        log.info("[CICD] SBOM for {} / {} uploaded by pipeline", target.codeRepo().getName(), target.branch().getName());

        if (!wait) {
            return status(HttpStatus.ACCEPTED, "accepted");
        }
        try {
            scanned.get(SBOM_RESULT_WAIT_MINUTES, TimeUnit.MINUTES);
        } catch (TimeoutException e) {
            // Still queued or scanning: the pipeline can poll /api/v1/cicd/check for the result.
            return status(HttpStatus.ACCEPTED, "running");
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return status(HttpStatus.ACCEPTED, "running");
        } catch (ExecutionException e) {
            log.warn("[CICD] SBOM uploaded for {} / {} could not be scanned: {}",
                    target.codeRepo().getName(), target.branch().getName(), e.getCause().getMessage());
            return status(HttpStatus.UNPROCESSABLE_ENTITY, "The SBOM could not be scanned");
        }

        String summary = gitLabCICDService.createScanSummary(target.codeRepo(), target.branch(), linkHost(domain));
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(summary);
    }

    private record Target(CodeRepo codeRepo, CodeRepoBranch branch) {
    }

    /**
     * The repository and branch a pipeline refers to, or null when the user may not see such a
     * repository. Read in a transaction of its own, so that no database connection is held while a
     * request waits for a scan.
     */
    private Target findTarget(String repoUrl, String branchName, Principal principal) {
        return new TransactionTemplate(transactionManager).execute(tx ->
                findCodeRepoService.findByUrl(repoUrl, principal)
                        .map(codeRepo -> new Target(codeRepo,
                                getOrCreateCodeRepoBranchService.getOrCreateCodeRepoBranch(branchName.trim(), codeRepo)))
                        .orElse(null));
    }

    /** Host for the link to the results: the one the pipeline asked for, else Flow's own. */
    private String linkHost(String domain) {
        String host = isBlank(domain) || "null".equalsIgnoreCase(domain.trim()) ? frontendUrl : domain;
        if (host == null) {
            return "";
        }
        host = host.trim().replaceFirst("^(?i)https?://", "");
        return host.endsWith("/") ? host.substring(0, host.length() - 1) : host;
    }

    private static ResponseEntity<StatusDTO> status(HttpStatus httpStatus, String status) {
        return new ResponseEntity<>(new StatusDTO(status), httpStatus);
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private static String blankToNull(String value) {
        return isBlank(value) ? null : value.trim();
    }
}
