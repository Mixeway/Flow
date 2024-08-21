package io.mixeway.mixewayflowapi.domain.team;

import io.mixeway.mixewayflowapi.config.TestConfig;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.security.Principal;
import java.util.ArrayList;


@SpringBootTest
@RunWith(SpringRunner.class)
@ActiveProfiles("ut")
@Import(TestConfig.class)
public class CreateTeamServiceTest {
    @Autowired
    CreateTeamService createTeamService;
    @Mock
    Principal principal;

    @Test
    public void createTeam() {
        Mockito.when(principal.getName()).thenReturn("admin");
        createTeamService.createTeam("test","test", new ArrayList<>(), principal);
    }
}