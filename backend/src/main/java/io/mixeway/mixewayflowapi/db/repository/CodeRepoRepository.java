package io.mixeway.mixewayflowapi.db.repository;

import io.mixeway.mixewayflowapi.api.coderepo.dto.GetCodeReposResponseDto;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.Settings;
import io.mixeway.mixewayflowapi.db.entity.Team;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface CodeRepoRepository extends CrudRepository<CodeRepo, Long> {
    Optional<CodeRepo> findByName(String name);
    Optional<CodeRepo> findByRepourl(String repourl);

    Optional<CodeRepo> findByIdAndTeamIn(Long id, List<Team> userTeams);
    Optional<CodeRepo> findByRemoteId(Long id);

    @Modifying
    @Transactional
    @Query("UPDATE CodeRepo c SET c.scaScan = 'NOT_PERFORMED' WHERE c.id = :id")
    void updateScaScanToNotPerformed(@Param("id") Long id);

    @Query("SELECT new io.mixeway.mixewayflowapi.api.coderepo.dto.GetCodeReposResponseDto(c.id, c.name, c.repourl, t.name, c.sastScan, c.iacScan, c.secretsScan, c.scaScan) FROM CodeRepo c JOIN c.team t WHERE t IN :teams")
    List<GetCodeReposResponseDto> findCodeRepoDtosByTeamIn(@Param("teams") List<Team> teams);

    @Query("SELECT c FROM CodeRepo c JOIN FETCH c.team WHERE c.team IN :teams")
    List<CodeRepo> findByTeamIn(@Param("teams") List<Team> teams);

}