package io.mixeway.mixewayflowapi.domain.roles;

import io.mixeway.mixewayflowapi.config.TestConfig;
import io.mixeway.mixewayflowapi.db.entity.UserRole;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.testcontainers.shaded.org.apache.commons.lang3.StringUtils;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@RunWith(SpringRunner.class)
@ActiveProfiles("ut")
@Import(TestConfig.class)
class FindRoleServiceTest {
    @Autowired
    FindRoleService findRoleService;


    @Test
    void findUserRole_user() {
        assertDoesNotThrow( () -> {
            findRoleService.findUserRole("USER");
        });
    }

    @Test
    void findUserRole_admin() {
        assertDoesNotThrow( () -> {
            findRoleService.findUserRole("ADMIN");
        });
    }
    @Test
    void findUserRole_tm() {
        assertDoesNotThrow( () -> {
            findRoleService.findUserRole("TEAM_MANAGER");
        });
    }
    @Test
    void findUserRole_lower_nok() {
        assertThrows(Exception.class, () -> {
            findRoleService.findUserRole("user");
        });
    }
    @Test
    void findUserRole_nok() {
        assertThrows(Exception.class, () -> {
            findRoleService.findUserRole("xxx");
        });
    }
}