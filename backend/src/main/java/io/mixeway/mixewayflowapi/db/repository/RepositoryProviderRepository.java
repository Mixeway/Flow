package io.mixeway.mixewayflowapi.db.repository;

import io.mixeway.mixewayflowapi.db.entity.RepositoryProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RepositoryProviderRepository extends JpaRepository<RepositoryProvider, Long> {

    /**
     * Checks if a RepositoryProvider with the given API URL already exists.
     * @param apiUrl The URL to check.
     * @return true if a provider with this URL exists, false otherwise.
     */
    boolean existsByApiUrl(String apiUrl);

    @Query("SELECT rp FROM RepositoryProvider rp LEFT JOIN rp.defaultTeam dt WHERE " +
            ":search IS NULL OR :search = '' OR " +
            "LOWER(CONCAT('', rp.providerType)) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(rp.apiUrl) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(COALESCE(dt.name, '')) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<RepositoryProvider> findAllBySearch(@Param("search") String search);
}
