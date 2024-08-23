package io.mixeway.mixewayflowapi.domain.team;

import io.mixeway.mixewayflowapi.api.team.dto.TeamDto;
import io.mixeway.mixewayflowapi.config.TestConfig;
import io.mixeway.mixewayflowapi.db.entity.Team;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@RunWith(SpringRunner.class)
@ActiveProfiles("ut")
@Import(TestConfig.class)
class FindTeamServiceTest {

    @Autowired
    private FindTeamService findTeamService;
    @Mock
    Principal principal;

    @Test
    void findAllTeams() {
        Mockito.when(principal.getName()).thenReturn("admin");

        List<TeamDto> teamDtos = findTeamService.findAllTeams(principal);
        assertTrue(teamDtos.size() >= 3);

        Mockito.when(principal.getName()).thenReturn("user");

        teamDtos = findTeamService.findAllTeams(principal);
        assertTrue(teamDtos.size() >= 2);
    }

    @Test
    void findById_ok() {
        Optional<Team> team = findTeamService.findById(1L);
        assertTrue(team.isPresent());
    }

    @Test
    void findById_nok() {
        Optional<Team> team = findTeamService.findById(1000L);
        assertFalse(team.isPresent());
    }

    @Test
    void findAll() {
        List<Team> teams = findTeamService.findAll();
        assertTrue( teams.size() >= 3);
    }
}