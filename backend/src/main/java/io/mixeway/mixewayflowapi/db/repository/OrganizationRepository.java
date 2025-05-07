package io.mixeway.mixewayflowapi.db.repository;

import io.mixeway.mixewayflowapi.db.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    Optional<Organization> findByName(String name);

    @Query("SELECT o FROM Organization o JOIN o.users u WHERE u.id = :userId")
    List<Organization> findByUserId(@Param("userId") Long userId);

    @Query(value = "SELECT COUNT(1) > 0 FROM users_organizations WHERE user_info_id = :userId AND organization_id = :orgId", nativeQuery = true)
    boolean existsRelationship(@Param("orgId") Long orgId, @Param("userId") Long userId);

    @Modifying
    @Query(value = "INSERT INTO users_organizations(organization_id, user_info_id) " +
            "SELECT :orgId, :userId WHERE NOT EXISTS (SELECT 1 FROM users_organizations WHERE user_info_id = :userId AND organization_id = :orgId)",
            nativeQuery = true)
    void createRelationship(@Param("orgId") Long orgId, @Param("userId") Long userId);

}
