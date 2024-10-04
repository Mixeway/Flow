package io.mixeway.mixewayflowapi.db.repository;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoFindingStats;
import io.mixeway.mixewayflowapi.db.entity.Team;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
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

}