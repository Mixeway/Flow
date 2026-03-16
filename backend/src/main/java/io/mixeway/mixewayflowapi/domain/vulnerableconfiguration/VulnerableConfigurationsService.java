package io.mixeway.mixewayflowapi.domain.vulnerableconfiguration;

import io.mixeway.mixewayflowapi.db.entity.VulnerableConfigurations;
import io.mixeway.mixewayflowapi.db.repository.VulnerableConfigurationsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Log4j2
public class VulnerableConfigurationsService {

    private final VulnerableConfigurationsRepository vulnerableConfigurationsRepository;

    public VulnerableConfigurations getOrCreateVulnerableConfigurations(String criteria, String versionStartIncluding, String versionStartExcluding, String versionEndIncluding, String versionEndExcluding) {
        Optional<VulnerableConfigurations> optional = vulnerableConfigurationsRepository.findByCriteriaAndVersionStartIncludingAndVersionStartExcludingAndVersionEndIncludingAndVersionEndExcluding(
                criteria,
                versionStartIncluding,
                versionStartExcluding,
                versionEndIncluding,
                versionEndExcluding
        );

        if (optional.isPresent()) {
            return optional.get();
        } else {
            VulnerableConfigurations newVulnerableConfigurations = new VulnerableConfigurations();
            newVulnerableConfigurations.setCriteria(criteria);
            newVulnerableConfigurations.setVersionStartIncluding(versionStartIncluding);
            newVulnerableConfigurations.setVersionStartExcluding(versionStartExcluding);
            newVulnerableConfigurations.setVersionEndIncluding(versionEndIncluding);
            newVulnerableConfigurations.setVersionEndExcluding(versionEndExcluding);
            return vulnerableConfigurationsRepository.save(newVulnerableConfigurations);
        }
    }

    public List<VulnerableConfigurations> getVulnerableConfigurationsByCriterias(Set<String> criteria) {
        return vulnerableConfigurationsRepository.findByCriteriaIn(criteria);
    }
}
