package io.mixeway.mixewayflowapi.modules.scanner.sca.service;

import io.mixeway.mixewayflowapi.db.entity.*;
import io.mixeway.mixewayflowapi.modules.scanner.sca.api.gateway.SCAScannerGateway;
import io.mixeway.mixewayflowapi.modules.scanner.sca.model.SCABomComponent;
import io.mixeway.mixewayflowapi.modules.scanner.sca.util.SCAScannerComparator;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.cyclonedx.model.Bom;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SCAScannerService {

    private final SCAScannerGateway scaScannerGateway;
    private final EntityManager entityManager;

    @Transactional
    public void scanRepository(CodeRepo repository, CodeRepoBranch codeRepoBranch, Bom bom) {
        log.info("SCA Scan started");

        if (repository == null)
            throw new IllegalArgumentException("CodeRepo cannot be null");

        List<SCABomComponent> bomComponents = bom.getComponents()
                .stream()
                .map(m -> {
                    // Check if scope is not "required" (direct dependency)
                    // In CycloneDX, scope can be: required, optional, excluded
                    // If scope is null or "required", it's typically a direct dependency
                    boolean isTransitive = m.getScope() != null &&
                                          !m.getScope().equals(org.cyclonedx.model.Component.Scope.REQUIRED);
                    return new SCABomComponent(m.getGroup(), m.getName(), m.getVersion(), isTransitive);
                })
                .distinct()
                .toList();

        repository.getCodeRepoComponents().clear();
        entityManager.flush();
        bomComponents.forEach(bomComponent -> updateComponent(bomComponent, repository));
        scaScannerGateway.updateRepository(repository);

        List<Component> components = repository.getComponents();

        Set<String> criteria = buildCriteria(bomComponents);
        List<VulnerableConfigurations> vulnerableConfigurations = scaScannerGateway.getVulnerableConfigurationsByCriterias(criteria);
        List<Finding> findings = findVulnerabilities(vulnerableConfigurations, components, repository, codeRepoBranch);

        scaScannerGateway.updateFindings(findings, codeRepoBranch, repository, Finding.Source.SCA, null);

        log.info("SCA Scan finished");
    }

    private List<Finding> findVulnerabilities(List<VulnerableConfigurations> vulnerableConfigurations, List<Component> components, CodeRepo codeRepo, CodeRepoBranch codeRepoBranch) {
        List<Finding> findings = new ArrayList<>();

        for (Component component : components) {
            for (VulnerableConfigurations vulnerableConfiguration : vulnerableConfigurations) {
                if (SCAScannerComparator.matchesComponentCriteria(vulnerableConfiguration, component) &&
                    SCAScannerComparator.matchesComponentVersion(vulnerableConfiguration, component.getVersion())) {

                    vulnerableConfiguration.getVulnerabilities().forEach(vulnerability -> {
                        Finding finding = new Finding(
                                vulnerability,
                                component,
                                codeRepoBranch,
                                codeRepo,
                                null,
                                vulnerability.getDescription(),
                                vulnerableConfiguration.getCriteria(),
                                vulnerability.getSeverity(),
                                Finding.Source.SCA
                        );
                        findings.add(finding);
                    });
                }
            }
        }

        return findings;
    }

    private Set<String> buildCriteria(List<SCABomComponent> bomComponents) {
        return bomComponents.stream()
                .map(bomComponent -> bomComponent.getGroup() + ":" + bomComponent.getName())
                .collect(Collectors.toSet());
    }

    private void updateComponent(SCABomComponent bomComponent, CodeRepo repository) {
        Component component = scaScannerGateway.getOrCreateComponent(bomComponent.getGroup(), bomComponent.getName(), bomComponent.getVersion());
        repository.addComponent(component, bomComponent.isTransitive());
    }
}
