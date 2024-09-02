package io.mixeway.mixewayflowapi.api.coderepo.controller;

import io.mixeway.mixewayflowapi.api.coderepo.CodeRepoApiService;
import io.mixeway.mixewayflowapi.api.coderepo.dto.CreateCodeRepoRequestDto;
import io.mixeway.mixewayflowapi.api.coderepo.dto.GetCodeReposResponseDto;
import io.mixeway.mixewayflowapi.api.team.dto.CreateTeamRequestDto;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.domain.coderepo.CreateCodeRepoService;
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

    @PreAuthorize("hasAuthority('TEAM_MANAGER')")
    @PostMapping(value= "/api/v1/coderepo/create/gitlab")
    public ResponseEntity<StatusDTO> createCodeRepoGitlab(@Valid @RequestBody CreateCodeRepoRequestDto createCodeRepoRequestDto, Principal principal){
        try {
            createCodeRepoService.createCodeRepo(createCodeRepoRequestDto, CodeRepo.RepoType.GITLAB);
            return new ResponseEntity<>(new StatusDTO("ok"), HttpStatus.CREATED);
        } catch (Exception e){
            e.printStackTrace();
            log.error("[CodeRepo] Error Creating CodeRepo {} by {}", createCodeRepoRequestDto.getName(), principal.getName());
            return new ResponseEntity<>(new StatusDTO("Not ok"), HttpStatus.BAD_REQUEST);
        }
    }
    @PreAuthorize("hasAuthority('TEAM_MANAGER')")
    @PostMapping(value= "/api/v1/coderepo/create/github")
    public ResponseEntity<StatusDTO> createCodeRepoGitHub(@Valid @RequestBody CreateCodeRepoRequestDto createCodeRepoRequestDto, Principal principal){
        try {
            createCodeRepoService.createCodeRepo(createCodeRepoRequestDto, CodeRepo.RepoType.GITHUB);
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
}
