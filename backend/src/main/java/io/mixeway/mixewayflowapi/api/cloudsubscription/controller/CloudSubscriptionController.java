package io.mixeway.mixewayflowapi.api.cloudsubscription.controller;

import io.mixeway.mixewayflowapi.api.cloudsubscription.dto.CloudSubscriptionDTO;
import io.mixeway.mixewayflowapi.api.cloudsubscription.service.CloudSubscriptionService;
import io.mixeway.mixewayflowapi.db.entity.CloudSubscription;
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

    @PreAuthorize("hasAuthority('TEAM_MANAGER')")
    @PostMapping("/team/{teamId}")
    public ResponseEntity<StatusDTO> create(
            @PathVariable Long teamId,
            @Valid @RequestBody CloudSubscriptionDTO dto,
            Principal principal) {
        try {
            cloudSubscriptionService.create(dto.getName(), teamId, principal);
            return new ResponseEntity<>(new StatusDTO("Created successfully"), HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("Error creating cloud subscription: {}", e.getMessage());
            return new ResponseEntity<>(new StatusDTO(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('TEAM_MANAGER')")
    @PutMapping("/{id}/team/{teamId}")
    public ResponseEntity<StatusDTO> update(
            @PathVariable Long id,
            @PathVariable Long teamId,
            @Valid @RequestBody CloudSubscriptionDTO dto,
            Principal principal) {
        try {
            cloudSubscriptionService.update(id, dto.getName(), teamId, principal);
            return new ResponseEntity<>(new StatusDTO("Updated successfully"), HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error updating cloud subscription: {}", e.getMessage());
            return new ResponseEntity<>(new StatusDTO(e.getMessage()), HttpStatus.BAD_REQUEST);
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
            return new ResponseEntity<>(new StatusDTO("Deleted successfully"), HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error deleting cloud subscription: {}", e.getMessage());
            return new ResponseEntity<>(new StatusDTO(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('TEAM_MANAGER')")
    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<CloudSubscription>> getAll(
            @PathVariable Long teamId,
            Principal principal) {
        try {
            List<CloudSubscription> subscriptions = cloudSubscriptionService.getByTeam(teamId, principal);
            return new ResponseEntity<>(subscriptions, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error retrieving cloud subscriptions: {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
