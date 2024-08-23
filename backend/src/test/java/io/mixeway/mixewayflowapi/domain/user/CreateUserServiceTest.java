package io.mixeway.mixewayflowapi.domain.user;

import io.mixeway.mixewayflowapi.api.user.dto.CreateUserRequestDto;
import io.mixeway.mixewayflowapi.config.TestConfig;
import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import io.mixeway.mixewayflowapi.utils.Role;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@RunWith(SpringRunner.class)
@ActiveProfiles("ut")
@Import(TestConfig.class)
class CreateUserServiceTest {
    @Autowired
    CreateUserService createUserService;

    @Test
    void createUser() {
        CreateUserRequestDto createUserRequestDto = CreateUserRequestDto.of("createUser", Role.USER ,"testtest", new ArrayList<>());

        UserInfo userInfo  = createUserService.createUser(createUserRequestDto);
        assertNotNull(userInfo);

    }
}