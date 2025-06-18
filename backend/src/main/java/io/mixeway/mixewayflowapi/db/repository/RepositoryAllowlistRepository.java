package io.mixeway.mixewayflowapi.db.repository;

import io.mixeway.mixewayflowapi.db.entity.RepositoryAllowlist;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepositoryAllowlistRepository extends CrudRepository<RepositoryAllowlist, Long> {
    List<RepositoryAllowlist> findAll();
}
