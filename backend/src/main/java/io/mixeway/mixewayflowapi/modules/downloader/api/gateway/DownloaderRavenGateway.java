package io.mixeway.mixewayflowapi.modules.downloader.api.gateway;

import io.mixeway.mixewayflowapi.api.constraint.service.ConstraintService;
import io.mixeway.mixewayflowapi.db.entity.Constraint;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.entity.Vulnerability;
import io.mixeway.mixewayflowapi.db.entity.VulnerableConfigurations;
import io.mixeway.mixewayflowapi.domain.vulnerability.GetOrCreateVulnerabilityService;
import io.mixeway.mixewayflowapi.domain.vulnerability.UpdateVulnerabilityService;
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
                VulnerableConfigurations vulnerableConfiguration = parseVulnerableConfiguration(entry, vulnerability);
                if (vulnerableConfiguration != null)
                    configurations.add(vulnerableConfiguration);
            });
        } catch (InvalidPackageDataException e) {
            log.error("Error parsing package data: {}", e.getInvalidEntry());
            throw new InvalidDataForVulnerabilityException(vulnerability.getName(), downloaderVulnerability, e.getMessage());
        }
        vulnerability.setConfigurations(configurations);
    }

    public VulnerableConfigurations parseVulnerableConfiguration(String entry, Vulnerability vulnerability) {
        VulnerableConfigurations config = new VulnerableConfigurations();
        config.setVulnerability(vulnerability);

        String[] parts = entry.split(" ", 2);
        if (parts.length != 2) {
            return null;
        }

        String criteria = parts[0];
        String versionPart = parts[1];

        config.setCriteria(criteria);

        // Handle multiple version constraints separated by comma
        String[] versionConstraints = versionPart.split(",");

        for (String constraint : versionConstraints) {
            constraint = constraint.trim();

            if (constraint.startsWith(">=")) {
                config.setVersionStartIncluding(constraint.substring(2));
            } else if (constraint.startsWith(">")) {
                config.setVersionStartExcluding(constraint.substring(1));
            } else if (constraint.startsWith("<=")) {
                config.setVersionEndIncluding(constraint.substring(2));
            } else if (constraint.startsWith("<")) {
                config.setVersionEndExcluding(constraint.substring(1));
            } else {
                throw new InvalidPackageDataException(entry, "Invalid package entry");
            }
        }

        //Correction of data:
        if (config.getVersionStartIncluding() != null && config.getVersionStartExcluding() != null)
            throw new InvalidPackageDataException(entry, "Invalid package entry");

        return config;
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
