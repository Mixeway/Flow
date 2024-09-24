package io.mixeway.mixewayflowapi.domain.coderepo;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoRepository;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import io.mixeway.mixewayflowapi.domain.user.FindUserService;
import io.mixeway.mixewayflowapi.utils.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FindCodeRepoService {
    private final CodeRepoRepository codeRepoRepository;
    private final FindTeamService findTeamService;
    private final FindUserService findUserService;

    public Optional<CodeRepo> findCodeRepoByUrl(String url){
        return codeRepoRepository.findByRepourl(url);
    }

    public List<CodeRepo> findCodeRepoForUser(Principal principal){
        UserInfo userInfo = findUserService.findUser(principal.getName());
        List<Team> userTeams;
        if (userInfo.getHighestRole().equals("ADMIN")){
            userTeams = findTeamService.findAll();
        } else {
            userTeams = userInfo.getTeams().stream().toList();
        }
        return codeRepoRepository.findByTeamIn(userTeams);
    }

    public CodeRepo findById(Long id, Principal principal) {
        UserInfo userInfo = findUserService.findUser(principal.getName());
        List<Team> userTeams;
        if (userInfo.getHighestRole().equals("ADMIN")){
            userTeams = findTeamService.findAll();
        } else {
            userTeams = userInfo.getTeams().stream().toList();
        }
        Optional<CodeRepo> codeRepo = codeRepoRepository.findByIdAndTeamIn(id, userTeams);
        return codeRepo.orElseThrow();
    }
    public Iterable<CodeRepo> findAll(){
        return codeRepoRepository.findAll();
    }

    public CodeRepo findByRemoteId(Long id) {

        Optional<CodeRepo> codeRepo = codeRepoRepository.findByRemoteId(id);
        return codeRepo.orElseThrow();
    }

    public Optional<CodeRepo> findById(long id) {
        return codeRepoRepository.findById(id);
    }
}
