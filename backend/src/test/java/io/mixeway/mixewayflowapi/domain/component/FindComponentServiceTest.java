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

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@RunWith(SpringRunner.class)
@ActiveProfiles("ut")
@Import(TestConfig.class)
class FindComponentServiceTest {
    @Autowired
    FindCodeRepoService findCodeRepoService;
    @Autowired
    GetOrCreateComponentService getOrCreateComponentService;
    @Autowired
    FindComponentService findComponentService;

    @Test
    void findAll() {
        getOrCreateComponentService.getOrCreate("component1","group","1.0.0", "api");
        List<Component> components = findComponentService.findAll();
        assertFalse(components.isEmpty());

    }
}