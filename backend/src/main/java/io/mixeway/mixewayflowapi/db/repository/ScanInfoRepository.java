package io.mixeway.mixewayflowapi.db.repository;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.ScanInfo;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ScanInfoRepository extends CrudRepository<ScanInfo, Long> {

    Optional<ScanInfo> findByCodeRepoAndCodeRepoBranchAndCommitId(CodeRepo codeRepo, CodeRepoBranch codeRepoBranch, String commitId);
}