package io.mixeway.mixewayflowapi.db.repository;

import io.mixeway.mixewayflowapi.db.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query(value = "DELETE FROM comment WHERE finding_id IN (SELECT id FROM finding WHERE coderepo_id = :repoId)", nativeQuery = true)
    void deleteByCodeRepoId(@Param("repoId") Long repoId);
}
