package io.mixeway.mixewayflowapi.db.repository;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CodeRepoBranchRepository extends CrudRepository<CodeRepoBranch, Long> {
    Optional<CodeRepoBranch> findByNameAndCodeRepo(String name, CodeRepo codeRepo);
    List<CodeRepoBranch> findByCodeRepo(CodeRepo codeRepo);
    List<CodeRepoBranch> findByCodeRepoAndExistsOnRemoteTrue(CodeRepo codeRepo);

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("DELETE FROM CodeRepoBranch b WHERE b.codeRepo.id = :repoId")
    void deleteByCodeRepoId(@Param("repoId") Long repoId);
}