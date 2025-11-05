package io.mixeway.mixewayflowapi.api.gitlabcicd.service;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoBranchRepository;
import io.mixeway.mixewayflowapi.db.repository.UserRepository;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Log4j2
@RequiredArgsConstructor
public class GitLabCICDService {

    private final UserRepository userRepository;
    private final FindTeamService findTeamService;
    private final FindCodeRepoService findCodeRepoService;
    private final CodeRepoBranchRepository codeRepoBranchRepository;

    public Boolean isValidApiKey(String apiKey, String repoUrl) {
        Optional<UserInfo> userOptional = userRepository.findByApiKey(apiKey);
        Optional<Team> codeRepoTeam = findTeamService.findByRepoUrl(repoUrl);

        if (userOptional.isEmpty() || codeRepoTeam.isEmpty()) {
            return false;
        }

        List<UserInfo> teamUsers = userRepository.getUsersByTeamId(codeRepoTeam.get().getId());

        if (teamUsers.contains(userOptional.get())) {
            log.info("[Team Service] User's {} API key validation succeeded", userOptional.get().getUsername());
            return true;
        } else {
            return false;
        }
    }

    public CodeRepo getCodeRepo(String repoUrl) {
        return findCodeRepoService.findCodeRepoByUrl(repoUrl).get();
    }

    public CodeRepoBranch getCodeRepoBranch(String branch, CodeRepo codeRepo) {
        return codeRepoBranchRepository.findByNameAndCodeRepo(branch, codeRepo).get();
    }
}
