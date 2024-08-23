package io.mixeway.mixewayflowapi.domain.user;

import io.mixeway.mixewayflowapi.api.user.dto.ChangePasswordDto;
import io.mixeway.mixewayflowapi.api.user.dto.ChangeRoleRequestDto;
import io.mixeway.mixewayflowapi.api.user.dto.ChangeTeamRequestDto;
import io.mixeway.mixewayflowapi.config.TestConfig;
import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import io.mixeway.mixewayflowapi.utils.Role;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.testcontainers.shaded.org.apache.commons.lang3.StringUtils;

import java.lang.reflect.Array;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@RunWith(SpringRunner.class)
@ActiveProfiles("ut")
@Import(TestConfig.class)
class UpdateUserServiceTest {
    @Autowired
    UpdateUserService updateUserService;
    @Autowired
    FindUserService findUserService;

    @Test
    void changePassword() {
        UserInfo userInfo = findUserService.findUser("admin");
        String old = userInfo.getPassword();
        updateUserService.changePassword(userInfo, "1234567890");
        userInfo = findUserService.findUser("admin");

        assertNotEquals(userInfo.getPassword(), old);
    }

    @Test
    void testChangePassword_ok() {
        ChangePasswordDto changePasswordDto = ChangePasswordDto.of("1qaz@WSX");
        UserInfo userInfo = findUserService.findUser("admin");
        String old = userInfo.getPassword();
        updateUserService.changePassword(changePasswordDto,1L);
        userInfo = findUserService.findUser("admin");

        assertNotEquals(userInfo.getPassword(), old);
    }
    @Test
    void testChangePassword_nok() {
        ChangePasswordDto changePasswordDto = ChangePasswordDto.of("1qaz@WSX");
        assertThrows(Exception.class, () -> {
            updateUserService.changePassword(changePasswordDto,1000L);
        });
    }

    @Test
    void changeUsersTeam() {
        UserInfo userInfo = findUserService.findUser("user");

        ChangeTeamRequestDto changeTeamRequestDto = ChangeTeamRequestDto.of(Arrays.asList(2L) );
        updateUserService.changeUsersTeam(changeTeamRequestDto, userInfo.getId());
        userInfo = findUserService.findUser("user");
        assertTrue(userInfo.getTeams().size() >=3);
    }

    @Test
    void changeRole() {
        UserInfo userInfo = findUserService.findUser("user");
        ChangeRoleRequestDto changeRoleRequestDto = ChangeRoleRequestDto.of(Role.ADMIN);
        updateUserService.changeRole(changeRoleRequestDto, userInfo.getId());
        userInfo = findUserService.findUser("user");
        assertEquals(3, userInfo.getRoles().size());
    }

    @Test
    void deactivate() {
        UserInfo userInfo = findUserService.findUser("user");
        updateUserService.deactivate(userInfo.getId());
        userInfo = findUserService.findUser("user");
        assertFalse(userInfo.isActive());
    }

    @Test
    void activate() {
        UserInfo userInfo = findUserService.findUser("user");
        updateUserService.activate(userInfo.getId());
        userInfo = findUserService.findUser("user");
        assertTrue(userInfo.isActive());
    }
}