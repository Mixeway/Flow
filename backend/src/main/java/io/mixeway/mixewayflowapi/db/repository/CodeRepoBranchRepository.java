package io.mixeway.mixewayflowapi.db.repository;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CodeRepoBranchRepository extends CrudRepository<CodeRepoBranch, Long> {
    Optional<CodeRepoBranch> findByNameAndCodeRepo(String name, CodeRepo codeRepo);

}