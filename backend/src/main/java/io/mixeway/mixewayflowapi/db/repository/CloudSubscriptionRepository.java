package io.mixeway.mixewayflowapi.db.repository;

import io.mixeway.mixewayflowapi.api.cloudsubscription.dto.GetCloudSubscriptionsResponseDto;
import io.mixeway.mixewayflowapi.db.entity.CloudSubscription;
import io.mixeway.mixewayflowapi.db.entity.Team;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CloudSubscriptionRepository extends JpaRepository<CloudSubscription, Long> {
    List<CloudSubscription> findByTeam(Team team);
    Optional<CloudSubscription> findByNameAndTeam(String name, Team team);
    boolean existsByNameAndTeam(String name, Team team);
    Optional<CloudSubscription> findByName(String name);

    Optional<CloudSubscription> findByIdAndTeamIn(Long id, List<Team> userTeams);

    @Query("SELECT c FROM CloudSubscription c JOIN FETCH c.team WHERE c.team IN :teams")
    List<CloudSubscription> findByTeamIn(@Param("teams") List<Team> teams);

    @Query("SELECT new io.mixeway.mixewayflowapi.api.cloudsubscription.dto.GetCloudSubscriptionsResponseDto(c.id, c.name, t.name, c.external_project_name, c.scan_status) " +
            "FROM CloudSubscription c JOIN c.team t WHERE t IN :teams")
    List<GetCloudSubscriptionsResponseDto> findCloudSubscriptionDtosByTeamIn(@Param("teams") List<Team> teams);

    @Modifying
    @Transactional
    @Query("UPDATE CloudSubscription c SET c.name = :name WHERE c.id = :id")
    void updateSubscriptionName(@Param("id") Long id, @Param("name") String name);
}
