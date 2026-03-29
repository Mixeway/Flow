package io.mixeway.mixewayflowapi.modules.scanner.sca.util;

public class SCAScannerCriteriaBuilder {

    private SCAScannerCriteriaBuilder() {
        /* This utility class should not be instantiated */
    }

    public static String buildCriteria(String group, String name) {
        boolean hasGroup = group != null && !group.isEmpty();
        boolean hasName = name != null && !name.isEmpty();

        String criteria;
        if (hasGroup && hasName) {
            criteria = group + ":" + name;
        } else if (hasGroup) {
            criteria = group;
        } else if (hasName) {
            criteria = name;
        } else {
            return "";
        }

        return criteria.trim();
    }
}
