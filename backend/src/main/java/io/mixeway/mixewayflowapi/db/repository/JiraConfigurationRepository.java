package io.mixeway.mixewayflowapi.db.repository;

import io.mixeway.mixewayflowapi.db.entity.JiraConfiguration;
import io.mixeway.mixewayflowapi.db.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JiraConfigurationRepository extends JpaRepository<JiraConfiguration, Long> {
    Optional<JiraConfiguration> findByTeam(Team team);
    Optional<JiraConfiguration> findByTeamId(Long teamId);
    void deleteByTeam(Team team);
}
