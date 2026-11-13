package io.mixeway.mixewayflowapi.domain.coderepo;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoRepository;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import io.mixeway.mixewayflowapi.domain.user.FindUserService;
import io.mixeway.mixewayflowapi.utils.PermissionFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * A pipeline names its repository by URL, not always written the way it was registered in Flow, and
 * only gets to a repository of its user's team.
 */
class FindCodeRepoByUrlTest {

    private static final String REGISTERED_URL = "https://bitbucket.org/workspace/repo";

    private CodeRepoRepository codeRepoRepository;
    private FindCodeRepoService findCodeRepoService;

    private CodeRepo repo;
    private UserInfo user;
    private Principal principal;

    @BeforeEach
    void setUp() {
        codeRepoRepository = mock(CodeRepoRepository.class);
        FindUserService findUserService = mock(FindUserService.class);
        findCodeRepoService = new FindCodeRepoService(codeRepoRepository, mock(FindTeamService.class),
                findUserService, mock(PermissionFactory.class));

        Team team = team(3L);
        repo = mock(CodeRepo.class);
        when(repo.getTeam()).thenReturn(team);
        when(codeRepoRepository.findByRepourl(REGISTERED_URL)).thenReturn(Optional.of(repo));

        principal = () -> "pipeline-user";
        user = mock(UserInfo.class);
        when(user.getHighestRole()).thenReturn("USER");
        when(user.getTeams()).thenReturn(Set.of(team));
        when(findUserService.findUser("pipeline-user")).thenReturn(user);
    }

    @Test
    void repositoryIsFoundHoweverThePipelineWritesItsUrl() {
        for (String url : List.of(
                REGISTERED_URL,
                "https://bitbucket.org/workspace/repo.git",
                "http://bitbucket.org/workspace/repo",
                "https://build-user@bitbucket.org/workspace/repo.git",
                " https://bitbucket.org/workspace/repo/ ")) {
            assertSame(repo, findCodeRepoService.findByUrl(url, principal).orElse(null), url);
        }
    }

    @Test
    void repositoryRegisteredWithGitSuffixIsFoundWithoutIt() {
        when(codeRepoRepository.findByRepourl(REGISTERED_URL)).thenReturn(Optional.empty());
        when(codeRepoRepository.findByRepourl(REGISTERED_URL + ".git")).thenReturn(Optional.of(repo));

        assertSame(repo, findCodeRepoService.findByUrl(REGISTERED_URL, principal).orElse(null));
    }

    @Test
    void repositoryOfAnotherTeamIsNotFound() {
        Team anotherTeam = team(4L);
        when(user.getTeams()).thenReturn(Set.of(anotherTeam));

        assertTrue(findCodeRepoService.findByUrl(REGISTERED_URL, principal).isEmpty());
    }

    @Test
    void administratorFindsRepositoriesOfAnyTeam() {
        when(user.getHighestRole()).thenReturn("ADMIN");
        when(user.getTeams()).thenReturn(Set.of());

        assertSame(repo, findCodeRepoService.findByUrl(REGISTERED_URL, principal).orElse(null));
    }

    @Test
    void anotherRepositoryIsNotMistakenForThisOne() {
        assertTrue(findCodeRepoService.findByUrl("https://bitbucket.org/workspace/repo-two", principal).isEmpty());
        assertEquals(REGISTERED_URL + "-two",
                FindCodeRepoService.urlVariants("https://bitbucket.org/workspace/repo-two.git").get(1));
    }

    private static Team team(long id) {
        Team team = mock(Team.class);
        when(team.getId()).thenReturn(id);
        return team;
    }
}
