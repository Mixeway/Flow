package io.mixeway.mixewayflowapi.db.repository;

import io.mixeway.mixewayflowapi.db.entity.Team;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TeamRepository extends CrudRepository<Team, Long>  {
    Optional<Team> findByName(String name);
    Optional<Team> findById(Long id);

    List<Team> findByRemoteIdentifier(String remoteIdentifier);
    List<Team> findAll();

    @Query("SELECT t FROM Team t")
    Page<Team> findAllPageable(Pageable pageable);

    /**
     * Removes all user associations for a specific team from the join table
     *
     * @param teamId ID of the team to remove associations for
     */
    @Modifying
    @Query(value = "DELETE FROM users_teams WHERE team_id = :teamId", nativeQuery = true)
    void removeAllUserAssociations(@Param("teamId") Long teamId);


    // Add to TeamRepository.java
    long countByOrganizationId(Long organizationId);

    @Query("SELECT COUNT(cr) FROM CodeRepo cr WHERE cr.team.id = :teamId")
    long countRepositoriesByTeamId(@Param("teamId") Long teamId);

    @Query("SELECT t FROM Team t WHERE t.organization.id = :organizationId")
    List<Team> findByOrganizationId(@Param("organizationId") Long organizationId);



}
