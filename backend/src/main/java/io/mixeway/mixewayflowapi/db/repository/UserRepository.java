package io.mixeway.mixewayflowapi.db.repository;

import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<UserInfo, Long> {
    public UserInfo findByUsername(String username);
    List<UserInfo> findAll();

    @Query("SELECT u FROM UserInfo u JOIN u.teams t WHERE t.id = :teamId")
    List<UserInfo> getUsersByTeamId(@Param("teamId") Long teamId);

    Optional<UserInfo> findByApiKey(String apiKey);
    // Add this method to your UserRepository interface
    @Query("SELECT COUNT(u) FROM UserInfo u JOIN u.teams t WHERE t.id = :teamId")
    int countUsersByTeamId(@Param("teamId") Long teamId);

    @Query("SELECT COUNT(u) FROM UserInfo u JOIN u.organizations o WHERE o.id = :organizationId")
    int countUsersByOrganizationId(@Param("organizationId") Long organizationId);

}