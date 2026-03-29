package io.mixeway.mixewayflowapi.modules.scanner.sca.util;

import io.mixeway.mixewayflowapi.db.entity.Component;
import io.mixeway.mixewayflowapi.db.entity.VulnerableConfigurations;

public class SCAScannerComparator {

    private SCAScannerComparator() {
        /* This utility class should not be instantiated */
    }

    public static boolean matchesComponentCriteria(VulnerableConfigurations config, Component component) {
        String componentCriteria = SCAScannerCriteriaBuilder.buildCriteria(component.getGroupid(), component.getName());
        return config.getCriteria() != null && config.getCriteria().equals(componentCriteria);
    }

    public static boolean matchesComponentVersion(VulnerableConfigurations config, String version) {
        if (config.getVersionStartIncluding() == null
                && config.getVersionStartExcluding() == null
                && config.getVersionEndIncluding() == null
                && config.getVersionEndExcluding() == null) {
            return true;
        }

        boolean matchesStart = true;
        boolean matchesEnd = true;

        if (config.getVersionStartIncluding() != null) {
            matchesStart = compareVersions(version, config.getVersionStartIncluding()) >= 0;
        }

        if (config.getVersionStartExcluding() != null) {
            matchesStart = compareVersions(version, config.getVersionStartExcluding()) > 0;
        }

        if (config.getVersionEndIncluding() != null) {
            matchesEnd = compareVersions(version, config.getVersionEndIncluding()) <= 0;
        }

        if (config.getVersionEndExcluding() != null) {
            matchesEnd = compareVersions(version, config.getVersionEndExcluding()) < 0;
        }

        return matchesStart && matchesEnd;
    }

    private static int compareVersions(String version1, String version2) {
        String[] parts1 = version1.split("\\.");
        String[] parts2 = version2.split("\\.");

        int maxLength = Math.max(parts1.length, parts2.length);

        for (int i = 0; i < maxLength; i++) {
            int v1 = i < parts1.length ? parseVersionPart(parts1[i]) : 0;
            int v2 = i < parts2.length ? parseVersionPart(parts2[i]) : 0;

            if (v1 != v2) {
                return Integer.compare(v1, v2);
            }
        }

        return 0;
    }

    private static int parseVersionPart(String part) {
        try {
            return Integer.parseInt(part);
        } catch (NumberFormatException e) {
            return 0;
        }
    }
}
