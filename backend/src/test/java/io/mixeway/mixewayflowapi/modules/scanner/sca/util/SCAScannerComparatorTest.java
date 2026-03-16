package io.mixeway.mixewayflowapi.modules.scanner.sca.util;

import io.mixeway.mixewayflowapi.db.entity.Component;
import io.mixeway.mixewayflowapi.db.entity.VulnerableConfigurations;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;

class SCAScannerComparatorTest {

    @ParameterizedTest
    @MethodSource("provideMatchesComponentCriteriaTestData")
    void shouldMatchComponentCriteria(String configCriteria, String componentGroup, String componentName, boolean expectedMatch) {
        VulnerableConfigurations config = new VulnerableConfigurations();
        config.setCriteria(configCriteria);

        Component component = new Component(componentGroup, componentName, null, null);

        boolean result = SCAScannerComparator.matchesComponentCriteria(config, component);

        assertEquals(expectedMatch, result);
    }

    @Test
    void shouldReturnFalseWhenConfigCriteriaIsNull() {
        VulnerableConfigurations config = new VulnerableConfigurations();
        config.setCriteria(null);

        Component component = new Component("org.springframework", "spring-core", "5.3.0", "sca");

        boolean result = SCAScannerComparator.matchesComponentCriteria(config, component);

        assertFalse(result);
    }

    @Test
    void shouldReturnTrueWhenAllVersionPropertiesAreNull() {
        VulnerableConfigurations config = new VulnerableConfigurations();
        config.setVersionStartIncluding(null);
        config.setVersionStartExcluding(null);
        config.setVersionEndIncluding(null);
        config.setVersionEndExcluding(null);

        boolean result = SCAScannerComparator.matchesComponentVersion(config, "1.0.0");

        assertTrue(result);
    }

    @ParameterizedTest
    @MethodSource("provideVersionComparisonTestData")
    void shouldCompareVersionsCorrectly(String version, String versionStartIncluding, String versionStartExcluding,
                                         String versionEndIncluding, String versionEndExcluding, boolean expectedMatch) {
        VulnerableConfigurations config = new VulnerableConfigurations();
        config.setVersionStartIncluding(versionStartIncluding);
        config.setVersionStartExcluding(versionStartExcluding);
        config.setVersionEndIncluding(versionEndIncluding);
        config.setVersionEndExcluding(versionEndExcluding);

        boolean result = SCAScannerComparator.matchesComponentVersion(config, version);

        assertEquals(expectedMatch, result);
    }

    private static Stream<Arguments> provideMatchesComponentCriteriaTestData() {
        return Stream.of(
                Arguments.of("org.springframework:spring-core", "org.springframework", "spring-core", true),
                Arguments.of("com.google.guava:guava", "com.google.guava", "guava", true),
                Arguments.of("org.springframework:spring-core", "org.springframework", "spring-web", false),
                Arguments.of("org.springframework:spring-core", "com.springframework", "spring-core", false),
                Arguments.of("io.netty:netty-all", "io.netty", "netty-all", true),
                Arguments.of("org.apache.commons:commons-lang3", "org.apache.commons", "commons-lang3", true),
                Arguments.of("", "org.springframework", "spring-core", false),
                Arguments.of("invalid-criteria", "org.springframework", "spring-core", false)
        );
    }

    private static Stream<Arguments> provideVersionComparisonTestData() {
        return Stream.of(
                // versionStartIncluding tests
                Arguments.of("1.0.0", "1.0.0", null, null, null, true),
                Arguments.of("1.0.0", "1.0", null, null, null, true),
                Arguments.of("1.0.0", "1", null, null, null, true),
                Arguments.of("1.0", "1.0.0", null, null, null, true),
                Arguments.of("1", "1.0.0", null, null, null, true),
                Arguments.of("1.0.1", "1.0.0", null, null, null, true),
                Arguments.of("1.0.1", "1.0", null, null, null, true),
                Arguments.of("1.0.1", "1", null, null, null, true),
                Arguments.of("1.1.0", "1.0.0", null, null, null, true),
                Arguments.of("2.0.0", "1.0.0", null, null, null, true),
                Arguments.of("0.9.0", "1.0.0", null, null, null, false),
                Arguments.of("0.0.1", "1.0.0", null, null, null, false),
                Arguments.of("0.0.1", "1", null, null, null, false),

                // versionStartExcluding tests
                Arguments.of("1.0.1", null, "1.0.0", null, null, true),
                Arguments.of("1.1.0", null, "1.0.0", null, null, true),
                Arguments.of("1.0.0", null, "1.0.0", null, null, false),
                Arguments.of("0.9.0", null, "1.0.0", null, null, false),

                // versionEndIncluding tests
                Arguments.of("2.0.0", null, null, "2.0.0", null, true),
                Arguments.of("1.9.0", null, null, "2.0.0", null, true),
                Arguments.of("1.0.0", null, null, "2.0.0", null, true),
                Arguments.of("2.0.1", null, null, "2.0.0", null, false),
                Arguments.of("3.0.0", null, null, "2.0.0", null, false),

                // versionEndExcluding tests
                Arguments.of("1.9.0", null, null, null, "2.0.0", true),
                Arguments.of("1.0.0", null, null, null, "2.0.0", true),
                Arguments.of("2.0.0", null, null, null, "2.0.0", false),
                Arguments.of("2.0.1", null, null, null, "2.0.0", false),

                // Range tests (startIncluding + endExcluding)
                Arguments.of("1.0.0", "1.0.0", null, null, "2.0.0", true),
                Arguments.of("1.5.0", "1.0.0", null, null, "2.0.0", true),
                Arguments.of("1.9.9", "1.0.0", null, null, "2.0.0", true),
                Arguments.of("2.0.0", "1.0.0", null, null, "2.0.0", false),
                Arguments.of("0.9.0", "1.0.0", null, null, "2.0.0", false),

                // Range tests (startExcluding + endIncluding)
                Arguments.of("1.0.1", null, "1.0.0", "2.0.0", null, true),
                Arguments.of("1.5.0", null, "1.0.0", "2.0.0", null, true),
                Arguments.of("2.0.0", null, "1.0.0", "2.0.0", null, true),
                Arguments.of("1.0.0", null, "1.0.0", "2.0.0", null, false),
                Arguments.of("2.0.1", null, "1.0.0", "2.0.0", null, false)
        );
    }

}
