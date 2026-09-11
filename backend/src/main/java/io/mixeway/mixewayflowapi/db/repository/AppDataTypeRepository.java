package io.mixeway.mixewayflowapi.db.repository;

import io.mixeway.mixewayflowapi.db.entity.AppDataType;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AppDataTypeRepository extends CrudRepository<AppDataType, Long> {
    void deleteAllByCodeRepo(CodeRepo codeRepo);

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query(value = "DELETE FROM app_data_type_category_groups WHERE app_data_type_id IN (SELECT id FROM app_data_type WHERE coderepo_id = :repoId)", nativeQuery = true)
    void deleteCategoryGroupsByCodeRepoId(@Param("repoId") Long repoId);

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query(value = "DELETE FROM app_data_type_location WHERE app_data_type_id IN (SELECT id FROM app_data_type WHERE coderepo_id = :repoId)", nativeQuery = true)
    void deleteLocationsByCodeRepoId(@Param("repoId") Long repoId);

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query(value = "DELETE FROM app_data_type WHERE coderepo_id = :repoId", nativeQuery = true)
    void deleteByCodeRepoId(@Param("repoId") Long repoId);
}