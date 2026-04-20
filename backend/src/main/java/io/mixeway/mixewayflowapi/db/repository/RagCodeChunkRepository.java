package io.mixeway.mixewayflowapi.db.repository;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.RagCodeChunk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RagCodeChunkRepository extends JpaRepository<RagCodeChunk, Long> {

    void deleteByCodeRepo(CodeRepo codeRepo);

    List<RagCodeChunk> findByCodeRepo_Id(long codeRepoId);
}
