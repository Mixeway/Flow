package io.mixeway.mixewayflowapi.domain.component;

import io.mixeway.mixewayflowapi.config.TestConfig;
import io.mixeway.mixewayflowapi.db.entity.Component;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
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
class GetOrCreateComponentServiceTest {
    @Autowired
    FindCodeRepoService findCodeRepoService;
    @Autowired
    GetOrCreateComponentService getOrCreateComponentService;

    @Test
    void getOrCreate_ok() {
        Component component = getOrCreateComponentService.getOrCreate("component1","group","1.0.0", "api");
        assertTrue(component.getId() > 0);
    }
    @Test
    void getOrCreate_nok() {
        Component component;
        assertThrows(Exception.class, () -> {
            getOrCreateComponentService.getOrCreate(StringUtils.repeat('x', 80),"group","1.0.0", "api");
        });
        assertThrows(Exception.class, () -> {
            getOrCreateComponentService.getOrCreate("name",StringUtils.repeat('x', 80),"1.0.0", "api");
        });
        assertThrows(Exception.class, () -> {
            getOrCreateComponentService.getOrCreate("name","group",StringUtils.repeat('x', 120), "api");
        });
    }

}