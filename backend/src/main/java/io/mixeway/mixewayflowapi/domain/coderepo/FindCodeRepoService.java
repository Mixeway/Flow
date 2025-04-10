package io.mixeway.mixewayflowapi.domain.coderepo;

import io.mixeway.mixewayflowapi.api.coderepo.dto.GetCodeReposResponseDto;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.ScanInfo;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoRepository;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import io.mixeway.mixewayflowapi.domain.user.FindUserService;
import io.mixeway.mixewayflowapi.exceptions.TeamNotFoundException;
import io.mixeway.mixewayflowapi.utils.PermissionFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FindCodeRepoService {
    private final CodeRepoRepository codeRepoRepository;
    private final FindTeamService findTeamService;
    private final FindUserService findUserService;
    private final PermissionFactory permissionFactory;

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
    public List<GetCodeReposResponseDto> getCodeReposResponseDtos(Principal principal){
        UserInfo userInfo = findUserService.findUser(principal.getName());
        List<Team> userTeams = userInfo.getHighestRole().equals("ADMIN") ? findTeamService.findAll() : new ArrayList<>(userInfo.getTeams());

        List<GetCodeReposResponseDto> codeRepoResults = codeRepoRepository.findCodeRepoDtosByTeamIn(userTeams);

        List<CodeRepo> codeRepos = codeRepoRepository.findByTeamIn(userTeams);
        Map<Long, List<ScanInfo>> scanInfoMap = codeRepos.stream()
                .collect(Collectors.toMap(CodeRepo::getId, CodeRepo::getScanInfos));

        codeRepoResults.forEach(codeRepoResult -> codeRepoResult.setScanInfos(scanInfoMap.get(codeRepoResult.getId())));

        return codeRepoResults;

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

    public List<CodeRepo> getByTeam(Long teamId, Principal principal) {
        Team team = findTeamService.findById(teamId)
                .orElseThrow(() -> new TeamNotFoundException("Team not found"));

        permissionFactory.canUserManageTeam(team, principal);

        return codeRepoRepository.findByTeam(team);
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

    public List<CodeRepo> findByTeam(Team team){
        return codeRepoRepository.findByTeam(team);
    }

    public Optional<CodeRepo> findAllByUrl(String url) {
        return codeRepoRepository.findByRepourl(url);
    }


    public List<CodeRepo> findbyTeamIn(List<Team> team) {
        return codeRepoRepository.findByTeamIn(team);
    }
}
