package io.mixeway.mixewayflowapi.api.coderepo.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.repository.UserRepository;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.coderepo.UpdateCodeRepoService;
import io.mixeway.mixewayflowapi.domain.coderepobranch.GetOrCreateCodeRepoBranchService;
import io.mixeway.mixewayflowapi.domain.finding.FindFindingService;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import io.mixeway.mixewayflowapi.exceptions.AccessTokenVerificationException;
import io.mixeway.mixewayflowapi.exceptions.UnauthorizedException;
import io.mixeway.mixewayflowapi.integrations.repo.service.GitService;
import io.mixeway.mixewayflowapi.integrations.repo.service.GitService.RemoteAccessStatus;
import io.mixeway.mixewayflowapi.integrations.scanner.sast.service.SastLlmProgress;
import io.mixeway.mixewayflowapi.scanmanager.service.ScanManagerService;
import io.mixeway.mixewayflowapi.utils.PermissionFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

import java.security.Principal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * A new repository access token is saved only after it has been shown to work against the repository.
 */
class CodeRepoApiServiceChangeAccessTokenTest {

    private static final String REPO_URL = "https://git.example.test/group/repo";

    private FindCodeRepoService findCodeRepoService;
    private PermissionFactory permissionFactory;
    private UpdateCodeRepoService updateCodeRepoService;
    private GitService gitService;
    private CodeRepoApiService codeRepoApiService;

    private CodeRepo repo;
    private Team team;
    private Principal principal;

    @BeforeEach
    void setUp() {
        findCodeRepoService = mock(FindCodeRepoService.class);
        permissionFactory = mock(PermissionFactory.class);
        updateCodeRepoService = mock(UpdateCodeRepoService.class);
        gitService = mock(GitService.class);
        codeRepoApiService = new CodeRepoApiService(
                findCodeRepoService,
                mock(ScanManagerService.class),
                permissionFactory,
                mock(FindTeamService.class),
                updateCodeRepoService,
                mock(UserRepository.class),
                mock(FindFindingService.class),
                gitService,
                mock(GetOrCreateCodeRepoBranchService.class),
                new ObjectMapper(),
                mock(SastLlmProgress.class));

        team = mock(Team.class);
        repo = mock(CodeRepo.class);
        when(repo.getRepourl()).thenReturn(REPO_URL);
        when(repo.getType()).thenReturn(CodeRepo.RepoType.GITLAB);
        when(repo.getTeam()).thenReturn(team);
        when(repo.getName()).thenReturn("repo");
        when(findCodeRepoService.findById(5L)).thenReturn(Optional.of(repo));
        principal = () -> "manager";
    }

    @Test
    void workingTokenIsSaved() {
        when(gitService.checkRemoteAccess(eq(REPO_URL), eq("new-token"), eq(CodeRepo.RepoType.GITLAB), anyLong()))
                .thenReturn(RemoteAccessStatus.VALID);

        codeRepoApiService.changeAccessToken(5L, "  new-token  ", principal);

        verify(updateCodeRepoService).changeAccessToken(repo, "new-token");
    }

    @ParameterizedTest
    @EnumSource(value = RemoteAccessStatus.class, names = "VALID", mode = EnumSource.Mode.EXCLUDE)
    void tokenThatFailsTheTestIsNotSaved(RemoteAccessStatus failure) {
        when(gitService.checkRemoteAccess(anyString(), anyString(), any(), anyLong())).thenReturn(failure);

        assertThrows(AccessTokenVerificationException.class,
                () -> codeRepoApiService.changeAccessToken(5L, "new-token", principal));

        verify(updateCodeRepoService, never()).changeAccessToken(any(), anyString());
    }

    @Test
    void userWhoCannotManageTheTeamNeitherTestsNorSavesAToken() {
        doThrow(new UnauthorizedException("")).when(permissionFactory).canUserManageTeam(team, principal);

        assertThrows(UnauthorizedException.class,
                () -> codeRepoApiService.changeAccessToken(5L, "new-token", principal));

        verify(gitService, never()).checkRemoteAccess(anyString(), anyString(), any(), anyLong());
        verify(updateCodeRepoService, never()).changeAccessToken(any(), anyString());
    }
}
