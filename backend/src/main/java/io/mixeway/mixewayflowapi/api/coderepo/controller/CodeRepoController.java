package io.mixeway.mixewayflowapi.api.coderepo.controller;

import io.mixeway.mixewayflowapi.api.coderepo.dto.*;
import io.mixeway.mixewayflowapi.api.coderepo.service.CodeRepoApiService;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.domain.coderepo.CreateCodeRepoService;
import io.mixeway.mixewayflowapi.exceptions.CodeRepoNotFoundException;
import io.mixeway.mixewayflowapi.exceptions.TeamNotFoundException;
import io.mixeway.mixewayflowapi.exceptions.UnauthorizedException;
import io.mixeway.mixewayflowapi.utils.StatusDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@Validated
@RequiredArgsConstructor
@Log4j2
public class CodeRepoController {
    private final CreateCodeRepoService createCodeRepoService;
    private final CodeRepoApiService codeRepoApiService;

    @PreAuthorize("hasAuthority('USER')")
    @PostMapping(value= "/api/v1/coderepo/create/gitlab")
    public ResponseEntity<StatusDTO> createCodeRepoGitlab(@Valid @RequestBody CreateCodeRepoRequestDto createCodeRepoRequestDto, Principal principal){
        try {
            createCodeRepoService.createCodeRepo(createCodeRepoRequestDto, CodeRepo.RepoType.GITLAB).block();
            return new ResponseEntity<>(new StatusDTO("ok"), HttpStatus.CREATED);
        } catch (Exception e){
            e.printStackTrace();
            log.error("[CodeRepo] Error Creating CodeRepo {} by {}", createCodeRepoRequestDto.getName(), principal.getName());
            return new ResponseEntity<>(new StatusDTO("Not ok"), HttpStatus.BAD_REQUEST);
        }
    }
    @PreAuthorize("hasAuthority('USER')")
    @PostMapping(value= "/api/v1/coderepo/create/github")
    public ResponseEntity<StatusDTO> createCodeRepoGitHub(@Valid @RequestBody CreateCodeRepoRequestDto createCodeRepoRequestDto, Principal principal){
        try {
            createCodeRepoService.createCodeRepo(createCodeRepoRequestDto, CodeRepo.RepoType.GITHUB).block();
            return new ResponseEntity<>(new StatusDTO("ok"), HttpStatus.CREATED);
        } catch (Exception e){
            e.printStackTrace();
            log.error("[CodeRepo] Error Creating CodeRepo {} by {}", createCodeRepoRequestDto.getName(), principal.getName());
            return new ResponseEntity<>(new StatusDTO("Not ok"), HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('USER')")
    @PostMapping(value= "/api/v1/coderepo/create/gitea")
    public ResponseEntity<StatusDTO> createCodeRepoGitea(@Valid @RequestBody CreateCodeRepoRequestDto createCodeRepoRequestDto, Principal principal){
        try {
            createCodeRepoService.createCodeRepo(createCodeRepoRequestDto, CodeRepo.RepoType.GITEA).block();
            return new ResponseEntity<>(new StatusDTO("ok"), HttpStatus.CREATED);
        } catch (Exception e){
            e.printStackTrace();
            log.error("[CodeRepo] Error Creating CodeRepo {} by {}", createCodeRepoRequestDto.getName(), principal.getName());
            return new ResponseEntity<>(new StatusDTO("Not ok"), HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping(value= "/api/v1/coderepo")
    public ResponseEntity<List<GetCodeReposResponseDto>> getRepos(Principal principal){
        try {
            return new ResponseEntity<>(codeRepoApiService.getRepos(principal), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>( HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping(value= "/api/v1/coderepo/{id}")
    public ResponseEntity<CodeRepo> getCodeRepo(@PathVariable(name = "id")Long id, Principal principal){
        try {
            return new ResponseEntity<>(codeRepoApiService.getRepo(id, principal), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>( HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping(value= "/api/v1/coderepo/team/{id}")
    public ResponseEntity<List<GetCodeReposResponseDto>> getCodeReposByTeam(@PathVariable(name = "id")Long id, Principal principal){
        try {
            return new ResponseEntity<>(codeRepoApiService.getReposByTeam(id, principal), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>( HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping(value= "/api/v1/coderepo/{id}/run")
    public ResponseEntity<StatusDTO> runScan(@PathVariable("id") Long id, Principal principal){
        try {
            codeRepoApiService.runScan(id, principal);
            return new ResponseEntity<>(new StatusDTO("ok"), HttpStatus.OK);
        } catch (Exception e){
            log.error("[CodeRepo] Error Running scan for {}", id);
            return new ResponseEntity<>(new StatusDTO("Not ok"), HttpStatus.BAD_REQUEST);
        }
    }
    @PreAuthorize("hasAuthority('TEAM_MANAGER')")
    @PutMapping(value = "/api/v1/coderepo/{id}/team")
    public ResponseEntity<StatusDTO> changeTeam(
            @PathVariable("id") Long id,
            @Valid @RequestBody ChangeTeamRequestDto request,
            Principal principal) {
        try {
            codeRepoApiService.changeTeam(id, request.getNewTeamId(), principal);
            return new ResponseEntity<>(new StatusDTO("Team changed successfully"), HttpStatus.OK);
        } catch (UnauthorizedException e) {
            log.error("[CodeRepo] Unauthorized attempt to change team for repo {} by {}", id, principal.getName());
            return new ResponseEntity<>(new StatusDTO("Unauthorized"), HttpStatus.FORBIDDEN);
        } catch (TeamNotFoundException | CodeRepoNotFoundException e) {
            log.error("[CodeRepo] Resource not found while changing team for repo {} by {}: {}",
                    id, principal.getName(), e.getMessage());
            return new ResponseEntity<>(new StatusDTO(e.getMessage()), HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException e) {
            log.error("[CodeRepo] Invalid request while changing team for repo {} by {}: {}",
                    id, principal.getName(), e.getMessage());
            return new ResponseEntity<>(new StatusDTO(e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            log.error("[CodeRepo] Error changing team for repo {} by {}: {}",
                    id, principal.getName(), e.getMessage());
            return new ResponseEntity<>(new StatusDTO("Internal server error"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping(value = "/api/v1/coderepo/bulk/change-team")
    public ResponseEntity<StatusDTO> bulkChangeTeam(@Valid @RequestBody BulkChangeTeamRequestDto request, Principal principal) {
        try {
            codeRepoApiService.bulkChangeTeam(request.getRepositoryIds(), request.getNewTeamId(), principal);
            return ResponseEntity.ok(new StatusDTO("Repositories successfully moved to the new team."));
        } catch (Exception e) {
            log.error("[CodeRepo] Error during bulk team change by {}: {}", principal.getName(), e.getMessage());
            return new ResponseEntity<>(new StatusDTO(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','TEAM_MANAGER')")
    @PutMapping(value = "/api/v1/coderepo/{id}/rename")
    public ResponseEntity<StatusDTO> renameCodeRepo(
            @PathVariable("id") Long id,
            @Valid @RequestBody RenameCodeRepoRequestDto request,
            Principal principal) {
        try {
            codeRepoApiService.renameCodeRepo(id, request.getNewName(), principal);
            return ResponseEntity.ok(new StatusDTO("Repository renamed."));
        } catch (Exception e) {
            log.error("[CodeRepo] Rename failed for id {} by {}: {}", id, principal.getName(), e.getMessage());
            return new ResponseEntity<>(new StatusDTO(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }
}
