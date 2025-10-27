package io.mixeway.mixewayflowapi.db.repository;

import io.mixeway.mixewayflowapi.api.coderepo.dto.VulnStatsResponseDto;
import io.mixeway.mixewayflowapi.api.teamfindings.dto.TeamVulnStatsResponseDto;
import io.mixeway.mixewayflowapi.db.entity.*;
import io.mixeway.mixewayflowapi.db.projection.ItemProjection;
import io.mixeway.mixewayflowapi.db.projection.RemovedVulnerabilityProjection;
import io.mixeway.mixewayflowapi.db.projection.ReviewedVulnerabilityProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Repository
public interface FindingRepository extends JpaRepository<Finding, Long> {
    List<Finding> findBySourceAndCloudSubscription(Finding.Source source, CloudSubscription cloudSubscription);
    List<Finding> findBySourceAndCodeRepoBranchAndCodeRepo(Finding.Source source, CodeRepoBranch codeRepoBranch, CodeRepo codeRepo);
    List<Finding> findBySourceAndCodeRepo(Finding.Source source, CodeRepo codeRepo);
    List<Finding> findByCloudSubscription(CloudSubscription cloudSubscription);


    @Query("SELECT new io.mixeway.mixewayflowapi.api.coderepo.dto.VulnStatsResponseDto("
            + "SUM(CASE WHEN f.source = 'SAST' AND (f.status = 'NEW' OR f.status = 'EXISTING') THEN 1 ELSE 0 END), "
            + "SUM(CASE WHEN f.source = 'IAC' AND (f.status = 'NEW' OR f.status = 'EXISTING') THEN 1 ELSE 0 END), "
            + "SUM(CASE WHEN f.source = 'SCA' AND (f.status = 'NEW' OR f.status = 'EXISTING') THEN 1 ELSE 0 END), "
            + "SUM(CASE WHEN f.source = 'SECRETS' AND (f.status = 'NEW' OR f.status = 'EXISTING') THEN 1 ELSE 0 END), "
            + "SUM(CASE WHEN f.source = 'GITLAB_SCANNER' AND (f.status = 'NEW' OR f.status = 'EXISTING') THEN 1 ELSE 0 END), "
            + "SUM(CASE WHEN f.source = 'DAST' AND (f.status = 'NEW' OR f.status = 'EXISTING') THEN 1 ELSE 0 END)) "
            + "FROM Finding f WHERE f.codeRepo.id = :codeRepo")
    VulnStatsResponseDto countFindingsBySource(@Param("codeRepo") Long codeRepo);

    @Query("SELECT new io.mixeway.mixewayflowapi.api.teamfindings.dto.TeamVulnStatsResponseDto("
            + "SUM(CASE WHEN f.source = 'SAST' AND (f.status = 'NEW' OR f.status = 'EXISTING') THEN 1 ELSE 0 END), "
            + "SUM(CASE WHEN f.source = 'IAC' AND (f.status = 'NEW' OR f.status = 'EXISTING') THEN 1 ELSE 0 END), "
            + "SUM(CASE WHEN f.source = 'SCA' AND (f.status = 'NEW' OR f.status = 'EXISTING') THEN 1 ELSE 0 END), "
            + "SUM(CASE WHEN f.source = 'SECRETS' AND (f.status = 'NEW' OR f.status = 'EXISTING') THEN 1 ELSE 0 END), "
            + "SUM(CASE WHEN f.source = 'GITLAB_SCANNER' AND (f.status = 'NEW' OR f.status = 'EXISTING') THEN 1 ELSE 0 END), "
            + "SUM(CASE WHEN f.source = 'CLOUD_SCANNER' AND (f.status = 'NEW' OR f.status = 'EXISTING') THEN 1 ELSE 0 END), "
            + "SUM(CASE WHEN f.source = 'DAST' AND (f.status = 'NEW' OR f.status = 'EXISTING') THEN 1 ELSE 0 END)) "
            + "FROM Finding f WHERE f.codeRepo.id IN :codeRepoIds OR f.cloudSubscription.id IN :cloudSubscriptionIds")
    TeamVulnStatsResponseDto countFindingsByTeam(@Param("codeRepoIds") List<Long> codeRepoIds, @Param("cloudSubscriptionIds") List<Long> cloudSubscriptionIds);


    @EntityGraph(attributePaths = {"vulnerability"})
    List<Finding> findByCodeRepoAndCodeRepoBranch(CodeRepo codeRepo, CodeRepoBranch codeRepoBranch);
    List<Finding> findByVulnerability(Vulnerability vulnerability);

    Long countAllByCodeRepoInAndStatusIn(List<CodeRepo> codeRepos, List<String> status);

    @Query(value = """
        SELECT v.name AS name, c.name AS repositoryUrl, f.updated_date AS dateDeleted, c.id as codeRepoId
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
        SELECT v.name AS name, c.name AS repositoryUrl, f.suppressed_reason AS status, c.id as codeRepoId
        FROM finding f
        JOIN vulnerability v ON f.vulnerability_id = v.id
        JOIN coderepo c ON f.coderepo_id = c.id
        WHERE f.status = 'SUPRESSED'
          AND f.coderepo_id IN (:coderepoIds)
        ORDER BY f.updated_date DESC
        LIMIT 10
        """, nativeQuery = true)
    List<ReviewedVulnerabilityProjection> findTop10SuppressedFindingsByCoderepoIds(@Param("coderepoIds") List<Long> coderepoIds);

    List<Finding> findByVulnerabilityAndCodeRepoIn(Vulnerability vulnerability, List<CodeRepo> byTeam);

    List<Finding> findByCodeRepoAndVulnerability(CodeRepo codeRepo, Vulnerability vulnerability);

    @Query("SELECT f FROM Finding f WHERE f.codeRepo = :codeRepo AND f.vulnerability.name = :vulnerabilityName AND f.codeRepoBranch = :codeRepoBranch AND f.location = :location")
    List<Finding> findByCodeRepoAndVulnerabilityNameAndBranchAndLocation(
            @Param("codeRepo") CodeRepo codeRepo,
            @Param("vulnerabilityName") String vulnerabilityName,
            @Param("codeRepoBranch") CodeRepoBranch codeRepoBranch,
            @Param("location") String location
    );

    @Query(value = "SELECT * FROM combined_items_view WHERE coderepo_id IN (:coderepoIds)", nativeQuery = true)
    List<ItemProjection> findCombinedItems(@Param("coderepoIds") List<Long> coderepoIds);

    @Query(value = "SELECT * FROM combined_items_view", nativeQuery = true)
    List<ItemProjection> findCombinedItemsForAdmin();

    @Query("SELECT f FROM Finding f " +
           "JOIN f.vulnerability v " +
           "WHERE f.codeRepo IN :codeRepos " +
           "AND (COALESCE(:severity, f.severity) = f.severity) " +
           "AND (COALESCE(:source, f.source) = f.source) " +
           "AND (COALESCE(:status, f.status) = f.status) " +
           "AND (:epss IS NULL OR v.epss >= :epss)" +
           "AND (COALESCE(:kev, v.exploitExists) = v.exploitExists)")
    Page<Finding> findByCodeReposPageable(@Param("codeRepos") List<CodeRepo> codeRepos, Pageable pageable,  @Param("severity") String severity, @Param("source") String source, @Param("status") String status, @Param("epss") BigDecimal epss,  @Param("kev")  Boolean exploitExists);

    @Query("SELECT f FROM Finding f " +
           "JOIN f.vulnerability v " +
           "WHERE f.cloudSubscription IN :cloudSubscriptions " +
           "AND (COALESCE(:severity, f.severity) = f.severity) " +
           "AND (COALESCE(:source, f.source) = f.source) " +
           "AND (COALESCE(:status, f.status) = f.status) " +
           "AND (:epss IS NULL OR v.epss >= :epss)" +
           "AND (COALESCE(:kev, v.exploitExists) = v.exploitExists)")
    Page<Finding> findByCloudSubscriptionsPageable(@Param("cloudSubscriptions") List<CloudSubscription> cloudSubscriptions, Pageable pageable, @Param("severity") String severity, @Param("source") String source, @Param("status") String status, @Param("epss") BigDecimal epss,  @Param("kev")  Boolean exploitExists);

    List<Finding> findAllByCodeRepoAndVulnerabilityAndLocation(CodeRepo repo,
                                                               Vulnerability vuln,
                                                               String location);

    boolean existsByCodeRepoAndVulnerabilityAndLocationAndStatus(CodeRepo codeRepo,
                                                                 Vulnerability vulnerability,
                                                                 String location,
                                                                 Finding.Status status);

    Finding findFirstByCodeRepoAndVulnerabilityAndLocationAndStatus(CodeRepo codeRepo,
                                                                    Vulnerability vulnerability,
                                                                    String location,
                                                                    Finding.Status status);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
    update Finding f
       set f.status = io.mixeway.mixewayflowapi.db.entity.Finding.Status.SUPRESSED,
           f.suppressedReason = :reason
     where f.codeRepo.id = :repoId
       and f.vulnerability.id = :vulnId
       and f.location = :location
       and f.status <> io.mixeway.mixewayflowapi.db.entity.Finding.Status.SUPRESSED
""")
    int bulkSuppressInRepoForSameVulnAndLocation(@Param("repoId") Long repoId,
                                                 @Param("vulnId") Long vulnId,
                                                 @Param("location") String location,
                                                 @Param("reason") Finding.SuppressedReason reason);
}



