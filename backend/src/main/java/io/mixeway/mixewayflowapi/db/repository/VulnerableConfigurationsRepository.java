package io.mixeway.mixewayflowapi.db.repository;

import io.mixeway.mixewayflowapi.db.entity.VulnerableConfigurations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VulnerableConfigurationsRepository extends JpaRepository<VulnerableConfigurations, Long> {

    Optional<VulnerableConfigurations> findByCriteriaAndVersionStartIncludingAndVersionStartExcludingAndVersionEndIncludingAndVersionEndExcluding(String criteria,
                                                                                                                                                  String versionStartIncluding,
                                                                                                                                                  String versionStartExcluding,
                                                                                                                                                  String versionEndIncluding,
                                                                                                                                                  String versionEndExcluding);
}
