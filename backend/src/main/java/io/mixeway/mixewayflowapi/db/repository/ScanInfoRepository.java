package io.mixeway.mixewayflowapi.db.repository;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.ScanInfo;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ScanInfoRepository extends CrudRepository<ScanInfo, Long> {

    Optional<ScanInfo> findByCodeRepoAndCodeRepoBranchAndCommitId(CodeRepo codeRepo, CodeRepoBranch codeRepoBranch, String commitId);
    List<ScanInfo> findAllByCodeRepoAndCodeRepoBranchAndCommitIdOrderByInsertedDateDesc(CodeRepo codeRepo, CodeRepoBranch codeRepoBranch, String commitId);
    List<ScanInfo> findByCodeRepo(CodeRepo repo);
    boolean existsByCodeRepoBranch(CodeRepoBranch codeRepoBranch);
    void deleteByCodeRepo(CodeRepo codeRepo);

    /**
     * Snapshots of the commits that were really scanned on the branch, newest first. Leaves out the
     * snapshots written for a throttled scan request (all counters -1) and for an SBOM uploaded
     * without a commit.
     */
    @Query("""
    select s from ScanInfo s
     where s.codeRepo = :codeRepo
       and s.codeRepoBranch = :codeRepoBranch
       and s.commitId <> ''
       and s.sastHigh >= 0
     order by s.insertedDate desc, s.id desc
""")
    List<ScanInfo> findScannedCommits(@Param("codeRepo") CodeRepo codeRepo,
                                      @Param("codeRepoBranch") CodeRepoBranch codeRepoBranch,
                                      Pageable pageable);
}