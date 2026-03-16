package io.mixeway.mixewayflowapi.modules.scanner.sca.service;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.Component;
import io.mixeway.mixewayflowapi.modules.scanner.sca.api.gateway.SCAScannerGateway;
import org.cyclonedx.model.Bom;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("ut")
public class SCAScannerServiceTest {

    private SCAScannerService scaScannerService;
    private SCAScannerGateway scaScannerGateway;

    @BeforeEach
    void setup() {
        scaScannerGateway = mock(SCAScannerGateway.class);

        scaScannerService = new SCAScannerService(scaScannerGateway);
    }

    @Test
    void shouldThrowIllegalArgumentExceptionWhenCodeRepoIsNull() {
        Bom bom = mock(Bom.class);

        assertThrows(IllegalArgumentException.class, () -> scaScannerService.scanRepository(null, null, bom));
    }

    @ParameterizedTest
    @MethodSource("provideBomComponentTestData")
    void shouldCreateBomComponentsFromBom(List<ComponentTestData> testData, int expectedCount) {
        CodeRepo codeRepo = mock(CodeRepo.class);
        List<Component> components = new ArrayList<>();
        when(codeRepo.getComponents()).thenReturn(components);

        Bom bom = new Bom();
        List<org.cyclonedx.model.Component> bomComponents = new ArrayList<>();

        for (ComponentTestData data : testData) {
            org.cyclonedx.model.Component bomComponent = new org.cyclonedx.model.Component();
            bomComponent.setGroup(data.group);
            bomComponent.setName(data.name);
            bomComponent.setVersion(data.version);
            bomComponents.add(bomComponent);

            Component component = new Component(data.group, data.name, data.version, "sca");
            when(scaScannerGateway.getOrCreateComponent(data.group, data.name, data.version)).thenReturn(component);
        }

        bom.setComponents(bomComponents);
        when(scaScannerGateway.getVulnerableConfigurationsByCriterias(anySet())).thenReturn(List.of());

        scaScannerService.scanRepository(codeRepo, null, bom);

        for (ComponentTestData data : testData) {
            verify(scaScannerGateway).getOrCreateComponent(data.group, data.name, data.version);
        }
        verify(scaScannerGateway).updateRepository(codeRepo);
        assertEquals(expectedCount, components.size());
    }

    private static Stream<Arguments> provideBomComponentTestData() {
        return Stream.of(
                Arguments.of(
                        List.of(
                                new ComponentTestData("org.springframework", "spring-core", "5.3.0"),
                                new ComponentTestData("com.google.guava", "guava", "30.1-jre")
                        ),
                        2
                ),
                Arguments.of(
                        List.of(
                                new ComponentTestData("org.apache.commons", "commons-lang3", "3.12.0")
                        ),
                        1
                ),
                Arguments.of(
                        List.of(
                                new ComponentTestData("io.netty", "netty-all", "4.1.65.Final"),
                                new ComponentTestData("com.fasterxml.jackson.core", "jackson-databind", "2.12.3"),
                                new ComponentTestData("org.slf4j", "slf4j-api", "1.7.30")
                        ),
                        3
                ),
                Arguments.of(
                        List.of(),
                        0
                )
        );
    }

    private static class ComponentTestData {
        String group;
        String name;
        String version;

        ComponentTestData(String group, String name, String version) {
            this.group = group;
            this.name = name;
            this.version = version;
        }
    }

}
