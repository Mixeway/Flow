package io.mixeway.mixewayflowapi.api.cloudsubscription.controller;

import io.mixeway.mixewayflowapi.api.cloudsubscription.dto.CloudSubscriptionDto;
import io.mixeway.mixewayflowapi.api.cloudsubscription.dto.GetCloudSubscriptionsResponseDto;
import io.mixeway.mixewayflowapi.api.cloudsubscription.service.CloudSubscriptionService;
import io.mixeway.mixewayflowapi.api.coderepo.dto.ChangeTeamRequestDto;
import io.mixeway.mixewayflowapi.db.entity.CloudSubscription;
import io.mixeway.mixewayflowapi.exceptions.CodeRepoNotFoundException;
import io.mixeway.mixewayflowapi.exceptions.TeamNotFoundException;
import io.mixeway.mixewayflowapi.exceptions.UnauthorizedException;
import io.mixeway.mixewayflowapi.integrations.scanner.cloud_scanner.service.FetchProjectExternalName;
import io.mixeway.mixewayflowapi.utils.StatusDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/v1/cloudsubscription")
public class CloudSubscriptionController {
    private final CloudSubscriptionService cloudSubscriptionService;
    private final FetchProjectExternalName fetchProjectExternalName;

    @PreAuthorize("hasAuthority('TEAM_MANAGER')")
    @PostMapping("/team/{teamId}")
    public ResponseEntity<StatusDTO> create(
            @PathVariable Long teamId,
            @Valid @RequestBody CloudSubscriptionDto dto,
            Principal principal) {
        try {
            String externalProjectName = fetchProjectExternalName.fetchProjectExternalName(dto.getName());
            CloudSubscription cloudSubscription = cloudSubscriptionService.create(dto.getName(), teamId, principal, externalProjectName);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new StatusDTO("Created successfully"));
        } catch (Exception e) {
            log.error("Error creating cloud subscription: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new StatusDTO(e.getMessage()));
        }
    }

    @PreAuthorize("hasAuthority('TEAM_MANAGER')")
    @PutMapping("/{id}/team/{teamId}")
    public ResponseEntity<StatusDTO> update(
            @PathVariable Long id,
            @PathVariable Long teamId,
            @PathVariable String externalProjectName,
            @Valid @RequestBody CloudSubscriptionDto dto,
            Principal principal) {
        try {
            cloudSubscriptionService.update(id, dto.getName(), teamId, principal, externalProjectName);
            return ResponseEntity.ok(new StatusDTO("Updated successfully"));
        } catch (Exception e) {
            log.error("Error updating cloud subscription: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new StatusDTO(e.getMessage()));
        }
    }

    @PreAuthorize("hasAuthority('TEAM_MANAGER')")
    @DeleteMapping("/{id}/team/{teamId}")
    public ResponseEntity<StatusDTO> delete(
            @PathVariable Long id,
            @PathVariable Long teamId,
            Principal principal) {
        try {
            cloudSubscriptionService.delete(id, teamId, principal);
            return ResponseEntity.ok(new StatusDTO("Deleted successfully"));
        } catch (Exception e) {
            log.error("Error deleting cloud subscription: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new StatusDTO(e.getMessage()));
        }
    }

    @PreAuthorize("hasAuthority('TEAM_MANAGER')")
    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<CloudSubscription>> getCloudSubscriptionsByTeam(
            @PathVariable Long teamId,
            Principal principal) {
        try {
            List<CloudSubscription> subscriptions = cloudSubscriptionService.getByTeam(teamId, principal);
            return ResponseEntity.ok(subscriptions);
        } catch (Exception e) {
            log.error("Error retrieving cloud subscriptions: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping("/cloudsubscriptions")
    public ResponseEntity<List<GetCloudSubscriptionsResponseDto>> getCloudSubscriptions(Principal principal) {
        try {
            return ResponseEntity.ok(cloudSubscriptionService.getCloudSubscriptions(principal));
        } catch (Exception e) {
            log.error("Error retrieving code repositories: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping(value= "/{id}")
    public ResponseEntity<CloudSubscription> getCloudSubscription(@PathVariable(name = "id")Long id, Principal principal){
        try {
            return new ResponseEntity<>(cloudSubscriptionService.getById(id, principal), HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>( HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('TEAM_MANAGER')")
    @GetMapping(value= "/{id}/run")
    public ResponseEntity<StatusDTO> runScan(@PathVariable("id") Long id, Principal principal){
        try {
            cloudSubscriptionService.runScan(id, principal);
            return new ResponseEntity<>(new StatusDTO("ok"), HttpStatus.OK);
        } catch (Exception e){
            log.error("[CodeRepo] Error Running scan for {}", id);
            return new ResponseEntity<>(new StatusDTO("Not ok"), HttpStatus.BAD_REQUEST);
        }
    }
    @PreAuthorize("hasAuthority('TEAM_MANAGER')")
    @PutMapping(value = "/{id}/team")
    public ResponseEntity<StatusDTO> changeTeam(
            @PathVariable("id") Long id,
            @Valid @RequestBody ChangeTeamRequestDto request,
            Principal principal) {
        try {
            cloudSubscriptionService.changeTeam(id, request.getNewTeamId(), principal);
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
}
