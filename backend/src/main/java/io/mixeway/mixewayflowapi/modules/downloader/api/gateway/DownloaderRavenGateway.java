package io.mixeway.mixewayflowapi.modules.downloader.api.gateway;

import io.mixeway.mixewayflowapi.api.constraint.service.ConstraintService;
import io.mixeway.mixewayflowapi.db.entity.Constraint;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.entity.Vulnerability;
import io.mixeway.mixewayflowapi.db.entity.VulnerableConfigurations;
import io.mixeway.mixewayflowapi.domain.vulnerability.GetOrCreateVulnerabilityService;
import io.mixeway.mixewayflowapi.domain.vulnerability.UpdateVulnerabilityService;
import io.mixeway.mixewayflowapi.domain.vulnerableconfiguration.VulnerableConfigurationsService;
import io.mixeway.mixewayflowapi.modules.downloader.exception.InvalidDataForVulnerabilityException;
import io.mixeway.mixewayflowapi.modules.downloader.exception.InvalidPackageDataException;
import io.mixeway.mixewayflowapi.modules.downloader.model.DownloaderVulnerability;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RequiredArgsConstructor
@Log4j2
@Service
public class DownloaderRavenGateway {

    private final GetOrCreateVulnerabilityService getOrCreateVulnerabilityService;
    private final UpdateVulnerabilityService updateVulnerabilityService;
    private final ConstraintService constraintService;
    private final VulnerableConfigurationsService vulnerableConfigurationsService;

    public void createOrUpdateVulnerability(String key, DownloaderVulnerability downloaderVulnerability) {

        Vulnerability vulnerability = getOrCreateVulnerabilityService.getOrCreate(
                    key,
                    downloaderVulnerability.getAttackComplexity(),
                    downloaderVulnerability.getRef(),
                    downloaderVulnerability.getRecommendation(),
                    Finding.Severity.valueOf(downloaderVulnerability.getSeverity()),
                    downloaderVulnerability.getEpss(),
                    downloaderVulnerability.getEpssPercentile(),
                    downloaderVulnerability.getExploitExists()
            );

            updateBaseInfo(vulnerability, downloaderVulnerability);

            updateComponents(vulnerability);
            updateConfigurations(vulnerability, downloaderVulnerability);
            updateConstraints(vulnerability, downloaderVulnerability);

            updateVulnerabilityService.updateVulnerability(vulnerability);

            log.debug("Vulnerability {} updated", vulnerability.getName());
    }

    private void updateConstraints(Vulnerability vulnerability, DownloaderVulnerability downloaderVulnerability) {
        vulnerability.getConstraints().clear();
        List<Constraint> constraints = vulnerability.getConstraints();
        downloaderVulnerability.getConstraints().forEach(c -> constraints.add(constraintService.createConstraint(vulnerability, c)));
    }

    private void updateComponents(Vulnerability vulnerability) {
        log.debug("Components should be updated");
    }

    private void updateConfigurations(Vulnerability vulnerability, DownloaderVulnerability downloaderVulnerability) {
        Set<VulnerableConfigurations> configurations;
        if (vulnerability.getConfigurations() != null) {
            vulnerability.getConfigurations().clear();
            configurations = vulnerability.getConfigurations();
        } else {
            configurations = new HashSet<>();
        }

        try {
            downloaderVulnerability.getPackages().forEach(entry -> {
                VulnerableConfigurations vulnerableConfiguration = parseVulnerableConfiguration(entry);
                if (vulnerableConfiguration != null) {
                    configurations.add(vulnerableConfiguration);
                }
            });
        } catch (InvalidPackageDataException e) {
            log.error("Error parsing package data: {}", e.getInvalidEntry());
            throw new InvalidDataForVulnerabilityException(vulnerability.getName(), downloaderVulnerability, e.getMessage());
        }
        vulnerability.setConfigurations(configurations);
    }

    public VulnerableConfigurations parseVulnerableConfiguration(String entry) {
        int operatorIndex = findFirstOperatorIndex(entry);

        if (operatorIndex == -1) {
            // No version constraints found
            return null;
        }

        String criteria = entry.substring(0, operatorIndex);
        String versionPart = entry.substring(operatorIndex);
        String versionStartIncluding = null;
        String versionStartExcluding = null;
        String versionEndIncluding = null;
        String versionEndExcluding = null;

        // Handle multiple version constraints separated by comma
        String[] versionConstraints = versionPart.split(",");

        for (String constraint : versionConstraints) {
            constraint = constraint.trim();

            if (constraint.startsWith(">=")) {
                versionStartIncluding = constraint.substring(2);
            } else if (constraint.startsWith(">")) {
                versionStartExcluding = constraint.substring(1);
            } else if (constraint.startsWith("<=")) {
                versionEndIncluding = constraint.substring(2);
            } else if (constraint.startsWith("<")) {
                versionEndExcluding = constraint.substring(1);
            } else {
                throw new InvalidPackageDataException(entry, "Invalid package entry");
            }
        }

        //Correction of data:
        if (versionStartIncluding != null && versionStartExcluding != null) {
            int comparison = compareVersions(versionStartIncluding, versionStartExcluding);
            if (comparison >= 0) {
                versionStartExcluding = null;
            } else {
                versionStartIncluding = null;
            }
        }
        if (versionEndIncluding != null && versionEndExcluding != null) {
            int comparison = compareVersions(versionEndIncluding, versionEndExcluding);
            if (comparison >= 0) {
                versionEndExcluding = null;
            } else {
                versionEndIncluding = null;
            }
        }

        String versionStart = versionStartIncluding != null ? versionStartIncluding : versionStartExcluding;
        String versionEnd = versionEndIncluding != null ? versionEndIncluding : versionEndExcluding;
        if (versionStart != null && versionEnd != null && compareVersions(versionStart, versionEnd) >= 0) {
            throw new InvalidPackageDataException(entry, "Start version " + versionStart + " is greater than end version " + versionEnd);
        }

        return vulnerableConfigurationsService.getOrCreateVulnerableConfigurations(criteria,
                versionStartIncluding,
                versionStartExcluding,
                versionEndIncluding,
                versionEndExcluding);
    }

    private int findFirstOperatorIndex(String entry) {
        int[] indices = {
                entry.indexOf(">="),
                entry.indexOf("<="),
                entry.indexOf(">"),
                entry.indexOf("<")
        };

        int minIndex = -1;
        for (int index : indices) {
            if (index != -1 && (minIndex == -1 || index < minIndex)) {
                minIndex = index;
            }
        }

        return minIndex;
    }

    private int compareVersions(String version1, String version2) {
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

    private int parseVersionPart(String part) {
        try {
            return Integer.parseInt(part);
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    private void updateBaseInfo(Vulnerability vulnerability, DownloaderVulnerability downloaderVulnerability) {
        vulnerability.setDescription(downloaderVulnerability.getDescription());
        vulnerability.setInsertedDate(downloaderVulnerability.getInsertedDate().toLocalDateTime());
        vulnerability.setVector(downloaderVulnerability.getVector());
        vulnerability.setWeaknesses(downloaderVulnerability.getWeaknesses());
        vulnerability.setUpdatedDate(downloaderVulnerability.getUpdatedDate().toLocalDateTime());
        vulnerability.setPublishedDate(downloaderVulnerability.getPublishedDate().toLocalDateTime());
        vulnerability.setNistLastModifiedDate(downloaderVulnerability.getNistLastModifiedDate().toLocalDateTime());
        vulnerability.setMetricVersion(downloaderVulnerability.getMetricVersion());
        vulnerability.setExploitabilityScore(downloaderVulnerability.getExploitabilityScore());
        vulnerability.setImpactScore(downloaderVulnerability.getImpactScore());
        vulnerability.setAttackVector(downloaderVulnerability.getAttackVector());
        vulnerability.setPrivilegesRequired(downloaderVulnerability.getPrivilegesRequired());
        vulnerability.setUserInteraction(downloaderVulnerability.getUserInteraction());
        vulnerability.setScope(downloaderVulnerability.getScope());
        vulnerability.setConfidentialityImpact(downloaderVulnerability.getConfidentialityImpact());
        vulnerability.setIntegrityImpact(downloaderVulnerability.getIntegrityImpact());
        vulnerability.setAvailabilityImpact(downloaderVulnerability.getAvailabilityImpact());
        vulnerability.setBaseScore(downloaderVulnerability.getBaseScore());
        vulnerability.setBaseSeverity(downloaderVulnerability.getBaseSeverity());
    }
}
