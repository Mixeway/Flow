package io.mixeway.mixewayflowapi.db.repository;

import io.mixeway.mixewayflowapi.api.components.dto.ComponentProjectionDto;
import io.mixeway.mixewayflowapi.api.components.dto.ComponentRawDataDto;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.Component;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComponentRepository extends JpaRepository<Component, Long> {
    Optional<Component> findByNameAndVersion(String name, String version);
    Optional<Component> findFirstByNameAndVersionAndGroupidOrderByIdAsc(String name, String version, String groupid);

    @Query("SELECT new io.mixeway.mixewayflowapi.api.components.dto.ComponentRawDataDto(c.id, c.name, c.version, c.groupid, v.name, cr.repourl) " +
            "FROM Component c " +
            "LEFT JOIN c.vulnerabilities v " +
            "LEFT JOIN c.codeRepos cr " +
            "WHERE cr IN :accessibleRepos OR cr IS NULL")
    List<ComponentRawDataDto> findComponentData(@Param("accessibleRepos") List<CodeRepo> accessibleRepos);

}
