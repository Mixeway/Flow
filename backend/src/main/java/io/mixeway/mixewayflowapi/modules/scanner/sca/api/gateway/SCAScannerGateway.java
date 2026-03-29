package io.mixeway.mixewayflowapi.modules.scanner.sca.api.gateway;

import io.mixeway.mixewayflowapi.db.entity.*;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.coderepo.UpdateCodeRepoService;
import io.mixeway.mixewayflowapi.domain.component.GetOrCreateComponentService;
import io.mixeway.mixewayflowapi.domain.finding.CreateFindingService;
import io.mixeway.mixewayflowapi.domain.vulnerableconfiguration.VulnerableConfigurationsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class SCAScannerGateway {

    private final GetOrCreateComponentService getOrCreateComponentService;
    private final UpdateCodeRepoService updateCodeRepoService;
    private final VulnerableConfigurationsService vulnerableConfigurationsService;
    private final CreateFindingService createFindingService;
    private final FindCodeRepoService findCodeRepoService;

    public Component getOrCreateComponent(String group, String name, String version) {
        return getOrCreateComponentService.getOrCreate(name, group, version, "");
    }

    public void updateRepository(CodeRepo repository) {
        updateCodeRepoService.updateCodeRepo(repository);
    }

    public List<VulnerableConfigurations> getVulnerableConfigurationsByCriterias(Set<String> criteria) {
        return vulnerableConfigurationsService.getVulnerableConfigurationsByCriterias(criteria);
    }

    public void updateFindings(List<Finding> newFindings, CodeRepoBranch repoWhereFindingWasFound, CodeRepo repoInWhichFindingWasFound, Finding.Source source, CloudSubscription cloudSubscription) {
        createFindingService.saveFindings(newFindings, repoWhereFindingWasFound, repoInWhichFindingWasFound, source, cloudSubscription);
    }

    public Optional<CodeRepo> getCodeRepository(Long codeRepoId) {
        return findCodeRepoService.findById(codeRepoId);
    }
}
