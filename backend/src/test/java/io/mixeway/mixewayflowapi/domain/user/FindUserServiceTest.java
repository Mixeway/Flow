package io.mixeway.mixewayflowapi.domain.user;

import io.mixeway.mixewayflowapi.config.TestConfig;
import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@RunWith(SpringRunner.class)
@ActiveProfiles("ut")
@Import(TestConfig.class)
class FindUserServiceTest {

    @Autowired
    FindUserService findUserService;

    @Test
    void findUser_ok() {
        UserInfo userInfo = findUserService.findUser("admin");
        assertNotNull(userInfo);
    }
    @Test
    void findUser_nok() {
        UserInfo userInfo = findUserService.findUser("xxx");
        assertNull(userInfo);
    }

    @Test
    void findAll() {
        List<UserInfo> userInfos = findUserService.findAll();
        assertTrue(userInfos.size() >= 3);
    }

    @Test
    void findById_ok() {
        Optional<UserInfo> userInfo = findUserService.findById(1L);
        assertTrue(userInfo.isPresent());
    }
    @Test
    void findById_mok() {
        Optional<UserInfo> userInfo = findUserService.findById(1000L);
        assertFalse(userInfo.isPresent());
    }
}