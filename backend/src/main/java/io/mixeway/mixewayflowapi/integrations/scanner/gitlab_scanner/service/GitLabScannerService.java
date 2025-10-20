package io.mixeway.mixewayflowapi.integrations.scanner.gitlab_scanner.service;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.domain.finding.CreateFindingService;
import io.mixeway.mixewayflowapi.integrations.scanner.gitlab_scanner.rules.GitLabRules;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Log4j2
@RequiredArgsConstructor
public class GitLabScannerService {
    private final GitLabRules gitLabRules;
    private final CreateFindingService createFindingService;

    public void runGitLabScan(CodeRepo codeRepo) {
        List<Finding> newFindings = new ArrayList<>();

        log.info("[GitLabScannerService] Starting GitLab scan for repository: {} ", codeRepo.getName());
        newFindings.addAll(gitLabRules.checkDefaultBranchProtection(codeRepo));
        newFindings.addAll(gitLabRules.checkMembersPrivileges(codeRepo));
        newFindings.addAll(gitLabRules.checkRunnersTags(codeRepo));
        newFindings.addAll(gitLabRules.checkJobsTags(codeRepo));
        newFindings.addAll(gitLabRules.checkJobsProtection(codeRepo));
        newFindings.addAll(gitLabRules.checkRunnersExecutors(codeRepo));
        newFindings.addAll(gitLabRules.checkAccessTokensScope(codeRepo));
        newFindings.addAll(gitLabRules.checkDescription(codeRepo));
        newFindings.addAll(gitLabRules.checkReadmeFile(codeRepo));
        newFindings.addAll(gitLabRules.checkContributingFile(codeRepo));
        newFindings.addAll(gitLabRules.checkSecurityFile(codeRepo));
        newFindings.addAll(gitLabRules.checkExternalRepositories(codeRepo));
        newFindings.addAll(gitLabRules.checkProtectedBranchesAccessLevel(codeRepo));
        newFindings.addAll(gitLabRules.checkSecretsInVariables(codeRepo));
        newFindings.addAll(gitLabRules.checkSuccessfulPipelineOnMerge(codeRepo));
        newFindings.addAll(gitLabRules.checkSkippedPipelineOnMerge(codeRepo));
        newFindings.addAll(gitLabRules.checkContainerRegistryAccessControl(codeRepo));
        newFindings.addAll(gitLabRules.checkProjectVisibility(codeRepo));

        createFindingService.saveFindings(newFindings, codeRepo.getDefaultBranch(), codeRepo, Finding.Source.GITLAB_SCANNER);
        log.info("[GitLabScannerService] Finished GitLab scan for repository: {} ", codeRepo.getName());
    }
}
