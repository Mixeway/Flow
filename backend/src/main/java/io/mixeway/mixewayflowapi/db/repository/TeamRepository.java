package io.mixeway.mixewayflowapi.db.repository;

import io.mixeway.mixewayflowapi.db.entity.Team;
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
    /**
     * Removes all user associations for a specific team from the join table
     *
     * @param teamId ID of the team to remove associations for
     */
    @Modifying
    @Query(value = "DELETE FROM users_teams WHERE team_id = :teamId", nativeQuery = true)
    void removeAllUserAssociations(@Param("teamId") Long teamId);

}
