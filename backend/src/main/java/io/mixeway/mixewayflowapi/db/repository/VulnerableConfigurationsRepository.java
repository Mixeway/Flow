package io.mixeway.mixewayflowapi.db.repository;

import io.mixeway.mixewayflowapi.db.entity.VulnerableConfigurations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface VulnerableConfigurationsRepository extends JpaRepository<VulnerableConfigurations, Long> {

    Optional<VulnerableConfigurations> findByCriteriaAndVersionStartIncludingAndVersionStartExcludingAndVersionEndIncludingAndVersionEndExcluding(String criteria,
                                                                                                                                                  String versionStartIncluding,
                                                                                                                                                  String versionStartExcluding,
                                                                                                                                                  String versionEndIncluding,
                                                                                                                                                  String versionEndExcluding);

    @Query("SELECT vc FROM VulnerableConfigurations vc WHERE vc.criteria IN :criteriaList")
    List<VulnerableConfigurations> findByCriteriaIn(@Param("criteriaList") Set<String> criteriaList);
}
