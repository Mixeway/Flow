package io.mixeway.mixewayflowapi.integrations.scanner.gitlab_scanner.service;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.integrations.scanner.gitlab_scanner.rules.GitLabRules;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

@Service
@Log4j2
@RequiredArgsConstructor
public class GitLabScannerService {
    private final GitLabRules gitLabRules;

    public void runGitLabScan(CodeRepo codeRepo) {
        log.info("[GitLabScannerService] Starting GitLab scan for repository: {} ", codeRepo.getName());
        gitLabRules.checkDefaultBranchProtection(codeRepo);
        gitLabRules.checkMembersPrivileges(codeRepo);
        gitLabRules.checkRunnersTags(codeRepo);
        gitLabRules.checkJobsTags(codeRepo);
        gitLabRules.checkJobsProtection(codeRepo);
        gitLabRules.checkRunnersExecutors(codeRepo);
        gitLabRules.checkAccessTokensScope(codeRepo);
        gitLabRules.checkDescription(codeRepo);
        gitLabRules.checkReadmeFile(codeRepo);
        gitLabRules.checkContributingFile(codeRepo);
        gitLabRules.checkSecurityFile(codeRepo);
        gitLabRules.checkExternalRepositories(codeRepo);
        gitLabRules.checkProtectedBranchesAccessLevel(codeRepo);
        gitLabRules.checkSecretsInVariables(codeRepo);
        log.info("[GitLabScannerService] Finished GitLab scan for repository: {} ", codeRepo.getName());

    }
}
