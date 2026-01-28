package io.mixeway.mixewayflowapi.db.repository;

import io.mixeway.mixewayflowapi.api.coderepo.dto.DailyFindings;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoFindingStats;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CodeRepoFindingStatsRepository extends CrudRepository<CodeRepoFindingStats, Long> {

    @Query("SELECT s FROM CodeRepoFindingStats s WHERE s.codeRepo = :codeRepo ORDER BY s.dateInserted DESC limit 14")
    List<CodeRepoFindingStats> findTop14ByCodeRepoOrderByDateInsertedDesc(@Param("codeRepo") CodeRepo codeRepo);


    @Query("SELECT c FROM CodeRepoFindingStats c WHERE (DATE(c.dateInserted) BETWEEN :startDate AND :endDate) AND c.codeRepo.id in :repos")
    List<CodeRepoFindingStats> findStatsBetweenDatesAndForCodeRepos(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate,
                                                                    @Param("repos") List<Long> repos);

    List<CodeRepoFindingStats> findByCodeRepo(CodeRepo codeRepo);

    @Query("SELECT new io.mixeway.mixewayflowapi.api.coderepo.dto.DailyFindings(" +
           "DATE(c.dateInserted), SUM(c.openedFindings)) " +
           "FROM CodeRepoFindingStats c " +
           "WHERE DATE(c.dateInserted) BETWEEN :startDate AND :endDate " +
           "AND c.codeRepo.id IN :repos " +
           "GROUP BY DATE(c.dateInserted)")
    List<DailyFindings> findOpenedFindingsBetweenDates(@Param("startDate") LocalDate startDate,
                                                       @Param("endDate") LocalDate endDate,
                                                       @Param("repos") List<Long> repos);

    @Query("SELECT new io.mixeway.mixewayflowapi.api.coderepo.dto.DailyFindings(" +
           "DATE(c.dateInserted), SUM(c.removedFindings)) " +
           "FROM CodeRepoFindingStats c " +
           "WHERE DATE(c.dateInserted) BETWEEN :startDate AND :endDate " +
           "AND c.codeRepo.id IN :repos " +
           "GROUP BY DATE(c.dateInserted)")
    List<DailyFindings> findRemovedFindingsBetweenDates(@Param("startDate") LocalDate startDate,
                                                        @Param("endDate") LocalDate endDate,
                                                        @Param("repos") List<Long> repos);

    @Query("SELECT new io.mixeway.mixewayflowapi.api.coderepo.dto.DailyFindings(" +
           "DATE(c.dateInserted), SUM(c.reviewedFindings)) " +
           "FROM CodeRepoFindingStats c " +
           "WHERE DATE(c.dateInserted) BETWEEN :startDate AND :endDate " +
           "AND c.codeRepo.id IN :repos " +
           "GROUP BY DATE(c.dateInserted)")
    List<DailyFindings> findReviewedFindingsBetweenDates(@Param("startDate") LocalDate startDate,
                                                         @Param("endDate") LocalDate endDate,
                                                         @Param("repos") List<Long> repos);

    @Query("SELECT new io.mixeway.mixewayflowapi.api.coderepo.dto.DailyFindings(" +
           "DATE(c.dateInserted), SUM(c.averageFixTime)) " +
           "FROM CodeRepoFindingStats c " +
           "WHERE DATE(c.dateInserted) BETWEEN :startDate AND :endDate " +
           "AND c.codeRepo.id IN :repos " +
           "GROUP BY DATE(c.dateInserted)")
    List<DailyFindings> findETAFindingsBetweenDates(@Param("startDate") LocalDate startDate,
                                                    @Param("endDate") LocalDate endDate,
                                                    @Param("repos") List<Long> repos);


    /**
     * Find all stats for a specific repository after a given date
     */
    List<CodeRepoFindingStats> findByCodeRepoAndDateInsertedAfter(CodeRepo codeRepo, LocalDateTime date);

    /**
     * Find the most recent stats record for a repository
     */
    Optional<CodeRepoFindingStats> findTopByCodeRepoOrderByDateInsertedDesc(CodeRepo codeRepo);

    /**
     * Find all stats for a specific repository
     */
    List<CodeRepoFindingStats> findByCodeRepoOrderByDateInsertedDesc(CodeRepo codeRepo);

    void deleteByCodeRepo(CodeRepo codeRepo);

}