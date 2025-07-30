package io.mixeway.mixewayflowapi.db.repository;

import io.mixeway.mixewayflowapi.db.entity.RepositoryProvider;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepositoryProviderRepository extends JpaRepository<RepositoryProvider, Long> {

    /**
     * Checks if a RepositoryProvider with the given API URL already exists.
     * @param apiUrl The URL to check.
     * @return true if a provider with this URL exists, false otherwise.
     */
    boolean existsByApiUrl(String apiUrl);
}
