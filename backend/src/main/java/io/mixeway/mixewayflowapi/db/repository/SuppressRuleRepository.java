package io.mixeway.mixewayflowapi.db.repository;

import io.mixeway.mixewayflowapi.api.threatintel.dto.SuppressRuleResponseDTO;
import io.mixeway.mixewayflowapi.db.entity.SuppressRule;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.entity.Vulnerability;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface SuppressRuleRepository extends CrudRepository<SuppressRule, Long> {

    @Query("SELECT sr FROM SuppressRule sr WHERE sr.scope = :scope " +
            "AND sr.vulnerability = :vulnerability " +
            "AND (:teamId IS NULL OR sr.team.id = :teamId) " +
            "AND (:codeRepoId IS NULL OR sr.codeRepo.id = :codeRepoId)")
    Optional<SuppressRule> findByScopeAndVulnerabilityAndTeamAndCodeRepo(
            @Param("scope") SuppressRule.Scope scope,
            @Param("vulnerability") Vulnerability vulnerability,
            @Param("teamId") Long teamId,
            @Param("codeRepoId") Long codeRepoId);

    @Query(value = """
        WITH finding_data AS (
            SELECT
                f.vulnerability_id,
                f.coderepo_id,
                cr.team_id,
                f.file_path
            FROM
                finding f
            JOIN coderepo cr ON
                f.coderepo_id = cr.id
            WHERE
                f.id = :findingId
        )
        SELECT EXISTS (
            SELECT 1
            FROM
                suppress_rule sr,
                finding_data fd
            WHERE
                sr.vulnerability_id = fd.vulnerability_id
                AND (
                    sr.scope = 'GLOBAL'
                    OR (sr.scope = 'TEAM' AND sr.team_id = fd.team_id)
                    OR (sr.scope = 'PROJECT' AND sr.coderepo_id = fd.coderepo_id)
                )
                AND (sr.path_regex IS NULL OR sr.path_regex = '' OR fd.file_path REGEXP sr.path_regex)
        )
        """, nativeQuery = true)
    boolean existsSuppressRuleForFinding(@Param("findingId") Long findingId);

    @Query("""
    SELECT new io.mixeway.mixewayflowapi.api.threatintel.dto.SuppressRuleResponseDTO(
        sr.id,
        v.name,
        sr.scope,
        CASE
            WHEN sr.scope = 'TEAM' THEN t.name
            WHEN sr.scope = 'PROJECT' THEN cr.name
            ELSE ''
        END,
        sr.pathRegex,
        ui.username,
        sr.createdDate,
        sr.comment
    )
    FROM SuppressRule sr
    JOIN sr.vulnerability v
    JOIN sr.owner ui
    LEFT JOIN sr.team t
    LEFT JOIN sr.codeRepo cr
    WHERE
        sr.scope = io.mixeway.mixewayflowapi.db.entity.SuppressRule.Scope.GLOBAL
        OR (:isAdmin = TRUE)
        OR (
            sr.scope = io.mixeway.mixewayflowapi.db.entity.SuppressRule.Scope.TEAM
            AND t IN :userTeams
        )
        OR (
            sr.scope = io.mixeway.mixewayflowapi.db.entity.SuppressRule.Scope.PROJECT
            AND cr.team IN :userTeams
        )
    """)
    List<SuppressRuleResponseDTO> findAllAccessibleSuppressRules(@Param("isAdmin") boolean isAdmin, @Param("userTeams") Set<Team> userTeams);

    @Query("SELECT sr FROM SuppressRule sr " +
            "WHERE sr.scope = :scope " +
            "AND sr.vulnerability = :vulnerability " +
            "AND (:teamId IS NULL OR sr.team.id = :teamId) " +
            "AND (:codeRepoId IS NULL OR sr.codeRepo.id = :codeRepoId) " +
            "AND ((:pathRegex IS NULL AND sr.pathRegex IS NULL) OR (:pathRegex IS NOT NULL AND sr.pathRegex = :pathRegex))")
    Optional<SuppressRule> findByScopeAndVulnerabilityAndTeamAndCodeRepoAndPathRegex(
            @Param("scope") SuppressRule.Scope scope,
            @Param("vulnerability") Vulnerability vulnerability,
            @Param("teamId") Long teamId,
            @Param("codeRepoId") Long codeRepoId,
            @Param("pathRegex") String pathRegex);

    @Query("SELECT sr FROM SuppressRule sr " +
            "JOIN Finding f ON " +
            "   (sr.scope = 'GLOBAL' AND f.vulnerability = sr.vulnerability) OR " +
            "   (sr.scope = 'TEAM' AND f.vulnerability = sr.vulnerability AND f.codeRepo.team = sr.team) OR " +
            "   (sr.scope = 'PROJECT' AND f.vulnerability = sr.vulnerability AND f.codeRepo = sr.codeRepo) " +
            "WHERE f.id = :findingId")
    List<SuppressRule> findApplicableSuppressRules(@Param("findingId") Long findingId);
}