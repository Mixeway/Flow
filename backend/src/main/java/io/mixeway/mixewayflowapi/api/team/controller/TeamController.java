package io.mixeway.mixewayflowapi.api.team.controller;

import io.mixeway.mixewayflowapi.api.team.dto.ChangeTeamRequestDto;
import io.mixeway.mixewayflowapi.api.team.dto.CreateTeamRequestDto;
import io.mixeway.mixewayflowapi.api.team.dto.TeamDto;
import io.mixeway.mixewayflowapi.api.team.dto.TeamIdDto;
import io.mixeway.mixewayflowapi.api.team.service.TeamService;
import io.mixeway.mixewayflowapi.domain.team.ChangeTeamService;
import io.mixeway.mixewayflowapi.domain.team.CreateTeamService;
import io.mixeway.mixewayflowapi.domain.team.DeleteTeamService;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import io.mixeway.mixewayflowapi.exceptions.TeamHasResourcesException;
import io.mixeway.mixewayflowapi.utils.StatusDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Log4j2
@Validated
public class TeamController {
    private final CreateTeamService createTeamService;
    private final FindTeamService findTeamService;
    private final ChangeTeamService changeTeamService;
    private final DeleteTeamService deleteTeamService;
    private final TeamService teamService;


    @PreAuthorize("hasAuthority('TEAM_MANAGER')")
    @PostMapping(value= "/api/v1/team/create")
    public ResponseEntity<StatusDTO> createTeam(@Valid @RequestBody CreateTeamRequestDto createTeamRequestDto, Principal principal){
        try {
            createTeamService.createTeam(createTeamRequestDto.getName(),createTeamRequestDto.getRemoteIdentifier(), createTeamRequestDto.getUsers(), principal);
            return new ResponseEntity<>(new StatusDTO("ok"), HttpStatus.OK);
        } catch (Exception e){
            log.error("[Team] Error Creating team {} by {}", createTeamRequestDto.getName(), principal.getName());
            return new ResponseEntity<>(new StatusDTO("Not ok"), HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping(value= "/api/v1/team")
    public ResponseEntity<List<TeamDto>> getTeams(Principal principal){
        try {
            return new ResponseEntity<>(findTeamService.findAllTeams(principal), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping(value= "/api/v1/team/{id}")
    public ResponseEntity<TeamDto> getTeam(@PathVariable("id") Long id, Principal principal){
        try {
            return new ResponseEntity<>(findTeamService.findTeamById(id, principal), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping(value = "/api/v1/teamsIds")
    public ResponseEntity<Page<TeamIdDto>> getTeamsIds(@RequestHeader("X-API-KEY") String apiKey, Principal principal, Pageable pageable) {
        try {
            if (!teamService.isValidApiKey(apiKey)) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
            return new ResponseEntity<>(teamService.getTeamIds(principal, pageable), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('TEAM_MANAGER')")
    @PostMapping(value= "/api/v1/team")
    public ResponseEntity<StatusDTO> modifyAccessToTeam(@Valid @RequestBody ChangeTeamRequestDto changeTeamRequestDto, Principal principal){
        try {
            changeTeamService
                    .modifyTeamAccess(
                            changeTeamRequestDto.getId(),
                            changeTeamRequestDto.getUsers(),
                            principal);
            return new ResponseEntity<>(new StatusDTO("ok"), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('TEAM_MANAGER')")
    @DeleteMapping(value= "/api/v1/team/{id}")
    public ResponseEntity<StatusDTO> deleteTeam(@PathVariable("id") Long id, Principal principal){
        try {
            deleteTeamService.deleteTeam(id, principal);
            return new ResponseEntity<>(new StatusDTO("ok"), HttpStatus.OK);
        } catch (TeamHasResourcesException e){
            log.error("[Team] Cannot delete team with ID {} by {}, reason: {}", id, principal.getName(), e.getMessage());
            return new ResponseEntity<>(new StatusDTO(e.getMessage()), HttpStatus.CONFLICT);
        } catch (Exception e){
            log.error("[Team] Error deleting team with ID {} by {}, reason: {}", id, principal.getName(), e.getMessage());
            return new ResponseEntity<>(new StatusDTO("Error deleting team"), HttpStatus.BAD_REQUEST);
        }
    }

}
