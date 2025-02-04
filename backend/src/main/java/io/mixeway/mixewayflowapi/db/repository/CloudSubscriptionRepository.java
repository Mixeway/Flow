package io.mixeway.mixewayflowapi.db.repository;

import io.mixeway.mixewayflowapi.db.entity.CloudSubscription;
import io.mixeway.mixewayflowapi.db.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CloudSubscriptionRepository extends JpaRepository<CloudSubscription, Long> {
    List<CloudSubscription> findByTeam(Team team);
    Optional<CloudSubscription> findByNameAndTeam(String name, Team team);
    boolean existsByNameAndTeam(String name, Team team);
}