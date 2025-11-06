package io.mixeway.mixewayflowapi.api.gitlabcicd.controller;
import io.mixeway.mixewayflowapi.api.gitlabcicd.dto.GitLabCICDRequestDto;
import io.mixeway.mixewayflowapi.api.gitlabcicd.dto.GitLabCICDSummaryResponseDto;
import io.mixeway.mixewayflowapi.api.gitlabcicd.service.GitLabCICDService;
import io.mixeway.mixewayflowapi.api.teamfindings.dto.TeamFindingsAndVulnsResponseDto;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.scanmanager.service.ScanManagerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Validated
@Log4j2
public class GitLabCICDController {

    private final GitLabCICDService gitLabCICDService;

    @PreAuthorize("hasAuthority('USER')")
    @PostMapping(value = "/api/v1/gitlabcicd/run")
    public ResponseEntity<String> runScanViaGitLabCICD(@RequestHeader("X-API-KEY") String apiKey, @RequestBody GitLabCICDRequestDto requestDto) {
        try {
            String repoUrl = requestDto.getRepoUrl();
            String branch = requestDto.getBranch();
            String domain = requestDto.getDomain();

            if (!gitLabCICDService.isValidApiKey(apiKey, repoUrl)) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }

            CodeRepo codeRepo = gitLabCICDService.getCodeRepo(repoUrl);
            CodeRepoBranch codeRepoBranch = gitLabCICDService.getCodeRepoBranch(branch, codeRepo);

            gitLabCICDService.runCodeRepoScan(codeRepo, codeRepoBranch);

            String scanSummary = gitLabCICDService.createScanSummary(codeRepo, codeRepoBranch, domain);

            return new ResponseEntity<>(scanSummary, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
}
