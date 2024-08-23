package io.mixeway.mixewayflowapi.domain.team;

import io.mixeway.mixewayflowapi.api.user.dto.CreateUserRequestDto;
import io.mixeway.mixewayflowapi.config.TestConfig;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import io.mixeway.mixewayflowapi.domain.user.CreateUserService;
import io.mixeway.mixewayflowapi.domain.user.FindUserService;
import io.mixeway.mixewayflowapi.utils.Role;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
@RunWith(SpringRunner.class)
@ActiveProfiles("ut")
@Import(TestConfig.class)
class ChangeTeamServiceTest {
    @Autowired
    ChangeTeamService changeTeamService;
    @Autowired
    CreateUserService createUserService;
    @Autowired
    FindUserService findUserService;
    @Mock
    Principal principal;
    @Autowired
    FindTeamService findTeamService;

    @Test
    void modifyTeamAccess() {
        CreateUserRequestDto createUserRequestDto = CreateUserRequestDto.of("modifyTeamAccess", Role.USER ,"testtest", new ArrayList<>());
        Mockito.when(principal.getName()).thenReturn("admin");

        UserInfo userInfo  = createUserService.createUser(createUserRequestDto);

        changeTeamService.modifyTeamAccess(1L, Arrays.asList(userInfo.getId()), principal);
        Optional<Team> team = findTeamService.findById(1L);
        assertTrue(team.isPresent());
        userInfo = findUserService.findUser("modifyTeamAccess");
        assertTrue(userInfo.getTeams().contains(team.get()));

    }
}