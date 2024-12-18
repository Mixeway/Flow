package io.mixeway.mixewayflowapi.db.repository;

import io.mixeway.mixewayflowapi.db.entity.Team;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface TeamRepository extends CrudRepository<Team, Long>  {
    Optional<Team> findByName(String name);
    Optional<Team> findById(Long id);

    List<Team> findByRemoteIdentifier(String remoteIdentifier);
    List<Team> findAll();
}
