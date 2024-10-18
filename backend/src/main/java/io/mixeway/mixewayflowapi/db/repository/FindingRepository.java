package io.mixeway.mixewayflowapi.db.repository;

import io.mixeway.mixewayflowapi.api.coderepo.dto.VulnStatsResponseDto;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.entity.Vulnerability;
import io.mixeway.mixewayflowapi.db.projection.ItemProjection;
import io.mixeway.mixewayflowapi.db.projection.RemovedVulnerabilityProjection;
import io.mixeway.mixewayflowapi.db.projection.ReviewedVulnerabilityProjection;
import org.hibernate.annotations.processing.Find;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FindingRepository extends JpaRepository<Finding, Long> {
    List<Finding> findBySourceAndCodeRepoBranchAndCodeRepo(Finding.Source source, CodeRepoBranch codeRepoBranch, CodeRepo codeRepo);
    List<Finding> findBySourceAndCodeRepo(Finding.Source source, CodeRepo codeRepo);

    @Query("SELECT new io.mixeway.mixewayflowapi.api.coderepo.dto.VulnStatsResponseDto("
            + "SUM(CASE WHEN f.source = 'SAST' AND (f.status = 'NEW' OR f.status = 'EXISTING') THEN 1 ELSE 0 END), "
            + "SUM(CASE WHEN f.source = 'IAC' AND (f.status = 'NEW' OR f.status = 'EXISTING') THEN 1 ELSE 0 END), "
            + "SUM(CASE WHEN f.source = 'SCA' AND (f.status = 'NEW' OR f.status = 'EXISTING') THEN 1 ELSE 0 END), "
            + "SUM(CASE WHEN f.source = 'SECRETS' AND (f.status = 'NEW' OR f.status = 'EXISTING') THEN 1 ELSE 0 END)) "
            + "FROM Finding f WHERE f.codeRepo.id = :codeRepo")
    VulnStatsResponseDto countFindingsBySource(@Param("codeRepo") Long codeRepo);

    List<Finding> findByCodeRepoAndCodeRepoBranch(CodeRepo codeRepo, CodeRepoBranch codeRepoBranch);
    List<Finding> findByVulnerability(Vulnerability vulnerability);

    @Query(value = """
        SELECT
            v.name AS name,
            CASE
                WHEN
                    (v.epss > 0.5)
                    OR (v.epss > 0.2 AND v.epss < 0.5 AND COUNT(CASE WHEN adtcg.category_group = 'PII' THEN 1 END) > 0)
                    OR (v.epss > 0.1 AND v.exploit_exists = TRUE)
                    OR (MAX(CASE WHEN f.source IN ('IAC', 'SAST', 'SECRETS') AND f.severity = 'CRITICAL' THEN 1 ELSE 0 END) = 1)
                THEN 'urgent'
                WHEN
                    ((v.epss > 0.1 AND v.epss < 0.5) AND COUNT(CASE WHEN adtcg.category_group = 'PII' THEN 1 END) = 0 AND v.exploit_exists = FALSE)
                    OR (v.epss < 0.1 AND v.exploit_exists = TRUE)
                    OR (MAX(CASE WHEN f.source IN ('IAC', 'SAST', 'SECRETS') AND f.severity = 'HIGH' THEN 1 ELSE 0 END) = 1)
                THEN 'notable'
                ELSE NULL
            END AS urgency,
            COUNT(DISTINCT c.id) AS count,
            v.epss AS epss,
            CASE WHEN COUNT(CASE WHEN adtcg.category_group = 'PII' THEN 1 END) > 0 THEN TRUE ELSE FALSE END AS pii,
            v.exploit_exists AS exploitAvailable,
            ARRAY_AGG(DISTINCT c.name) AS projectNames,
            ARRAY_AGG(DISTINCT c.id) AS projectIds
        FROM finding f
        JOIN vulnerability v ON f.vulnerability_id = v.id
        JOIN coderepo c ON f.coderepo_id = c.id
        LEFT JOIN app_data_type adt ON adt.coderepo_id = c.id
        LEFT JOIN app_data_type_category_groups adtcg ON adtcg.app_data_type_id = adt.id
        WHERE f.status IN ('NEW', 'EXISTING')
          AND f.coderepo_id IN (:coderepoIds)
        GROUP BY v.name, v.epss, v.exploit_exists
        HAVING
            (v.epss > 0.5)
            OR (v.epss > 0.2 AND v.epss < 0.5 AND COUNT(CASE WHEN adtcg.category_group = 'PII' THEN 1 END) > 0)
            OR (v.epss > 0.1 AND v.exploit_exists = TRUE)
            OR ((v.epss > 0.1 AND v.epss < 0.5) AND COUNT(CASE WHEN adtcg.category_group = 'PII' THEN 1 END) = 0 AND v.exploit_exists = FALSE)
            OR (v.epss < 0.1 AND v.exploit_exists = TRUE)
            OR (MAX(CASE WHEN f.source IN ('IAC', 'SAST', 'SECRETS') AND f.severity = 'CRITICAL' THEN 1 ELSE 0 END) = 1)
            OR (MAX(CASE WHEN f.source IN ('IAC', 'SAST', 'SECRETS') AND f.severity = 'HIGH' THEN 1 ELSE 0 END) = 1)
        """, nativeQuery = true)
    List<ItemProjection> findCombinedItems(@Param("coderepoIds") List<Long> coderepoIds);


    Long countAllByCodeRepoInAndStatusIn(List<CodeRepo> codeRepos, List<String> status);

    @Query(value = """
        SELECT v.name AS name, c.name AS repositoryUrl, f.updated_date AS dateDeleted
        FROM finding f
        JOIN vulnerability v ON f.vulnerability_id = v.id
        JOIN coderepo c ON f.coderepo_id = c.id
        WHERE f.status = 'REMOVED'
          AND f.coderepo_id IN (:coderepoIds)
        ORDER BY f.updated_date DESC
        LIMIT 10
        """, nativeQuery = true)
    List<RemovedVulnerabilityProjection> findTop10RemovedFindingsByCoderepoIds(@Param("coderepoIds") List<Long> coderepoIds);

    @Query(value = """
        SELECT v.name AS name, c.name AS repositoryUrl, f.suppressed_reason AS status
        FROM finding f
        JOIN vulnerability v ON f.vulnerability_id = v.id
        JOIN coderepo c ON f.coderepo_id = c.id
        WHERE f.status = 'SUPRESSED'
          AND f.coderepo_id IN (:coderepoIds)
        ORDER BY f.updated_date DESC
        LIMIT 10
        """, nativeQuery = true)
    List<ReviewedVulnerabilityProjection> findTop10SuppressedFindingsByCoderepoIds(@Param("coderepoIds") List<Long> coderepoIds);
}

