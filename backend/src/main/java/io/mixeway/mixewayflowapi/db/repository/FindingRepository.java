package io.mixeway.mixewayflowapi.db.repository;

import io.mixeway.mixewayflowapi.api.coderepo.dto.VulnStatsResponseDto;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.entity.Vulnerability;
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


}
