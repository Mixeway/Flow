package io.mixeway.mixewayflowapi.domain.coderepo;

import io.mixeway.mixewayflowapi.api.coderepo.dto.GetCodeReposResponseDto;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
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
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.Optional;

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

    /**
     * The repository with that clone URL, provided the user may see it (their team's, or any for an
     * administrator). Pipelines do not always know the URL exactly as it was registered, so the
     * scheme, credentials in the URL, a trailing slash and a {@code .git} suffix are not held against it.
     */
    public Optional<CodeRepo> findByUrl(String url, Principal principal) {
        if (url == null || url.isBlank() || principal == null) {
            return Optional.empty();
        }
        Optional<CodeRepo> codeRepo = Optional.empty();
        for (String candidate : urlVariants(url)) {
            codeRepo = codeRepoRepository.findByRepourl(candidate);
            if (codeRepo.isPresent()) {
                break;
            }
        }
        if (codeRepo.isEmpty()) {
            return Optional.empty();
        }
        UserInfo userInfo = findUserService.findUser(principal.getName());
        if (userInfo.getHighestRole().equals("ADMIN")) {
            return codeRepo;
        }
        Team team = codeRepo.get().getTeam();
        boolean ownTeam = team != null
                && userInfo.getTeams().stream().anyMatch(userTeam -> userTeam.getId() == team.getId());
        return ownTeam ? codeRepo : Optional.empty();
    }

    /** The ways the same repository URL may be written, the given one first. */
    static List<String> urlVariants(String url) {
        String trimmed = url.trim();
        String base = trimmed.replaceFirst("^(?i)(https?://)[^/@]*@", "$1");
        while (base.endsWith("/")) {
            base = base.substring(0, base.length() - 1);
        }
        if (base.toLowerCase().endsWith(".git")) {
            base = base.substring(0, base.length() - 4);
        }
        String other = base.matches("(?i)^http://.*") ? "https://" + base.substring(7)
                : base.matches("(?i)^https://.*") ? "http://" + base.substring(8) : null;

        Set<String> variants = new LinkedHashSet<>();
        variants.add(trimmed);
        for (String root : other == null ? List.of(base) : List.of(base, other)) {
            variants.add(root);
            variants.add(root + ".git");
            variants.add(root + "/");
        }
        return List.copyOf(variants);
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
        return codeRepoRepository.findCodeRepoDtosByTeamIn(userTeams);

    }

    public Page<GetCodeReposResponseDto> getCodeReposResponseDtos(Principal principal, Pageable pageable, String search) {
        UserInfo userInfo = findUserService.findUser(principal.getName());
        List<Team> userTeams = userInfo.getHighestRole().equals("ADMIN") ? findTeamService.findAll() : new ArrayList<>(userInfo.getTeams());
        String normalizedSearch = search == null ? "" : search.trim();
        return codeRepoRepository.findCodeRepoDtosByTeamInAndSearch(userTeams, normalizedSearch, pageable);
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

    public CodeRepo findByRemoteIdAndRepoUrl(Long id, String repoUrl) {
        Optional<CodeRepo> codeRepo = codeRepoRepository.findByRemoteIdAndRepourl(id, repoUrl);
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
