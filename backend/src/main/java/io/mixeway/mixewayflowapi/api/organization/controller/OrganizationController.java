// OrganizationController.java
package io.mixeway.mixewayflowapi.api.organization.controller;

import io.mixeway.mixewayflowapi.api.organization.dto.*;
import io.mixeway.mixewayflowapi.api.organization.service.OrganizationApiService;
import io.mixeway.mixewayflowapi.utils.StatusDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/organizations")
@RequiredArgsConstructor
@Validated
@Log4j2
public class OrganizationController {
    private final OrganizationApiService organizationApiService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping
    public ResponseEntity<List<OrganizationDto>> getAllOrganizations() {
        return ResponseEntity.ok(organizationApiService.getAllOrganizations());
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<OrganizationDto> getOrganization(@PathVariable Long id) {
        return ResponseEntity.ok(organizationApiService.getOrganization(id));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping
    public ResponseEntity<StatusDTO> createOrganization(@Valid @RequestBody OrganizationCreateRequestDto requestDto) {
        try {
            organizationApiService.createOrganization(requestDto);
            return new ResponseEntity<>(new StatusDTO("Organization created successfully"), HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("[OrganizationController] Error creating organization: {}", e.getMessage());
            return new ResponseEntity<>(new StatusDTO("Failed to create organization: " + e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<StatusDTO> updateOrganization(
            @PathVariable Long id,
            @Valid @RequestBody OrganizationUpdateRequestDto requestDto) {
        try {
            if (!id.equals(requestDto.getId())) {
                return new ResponseEntity<>(new StatusDTO("ID in path must match ID in body"), HttpStatus.BAD_REQUEST);
            }

            organizationApiService.updateOrganization(requestDto);
            return new ResponseEntity<>(new StatusDTO("Organization updated successfully"), HttpStatus.OK);
        } catch (Exception e) {
            log.error("[OrganizationController] Error updating organization: {}", e.getMessage());
            return new ResponseEntity<>(new StatusDTO("Failed to update organization: " + e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<StatusDTO> deleteOrganization(@PathVariable Long id) {
        try {
            organizationApiService.deleteOrganization(id);
            return new ResponseEntity<>(new StatusDTO("Organization deleted successfully"), HttpStatus.OK);
        } catch (Exception e) {
            log.error("[OrganizationController] Error deleting organization: {}", e.getMessage());
            return new ResponseEntity<>(new StatusDTO("Failed to delete organization: " + e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/{id}/teams")
    public ResponseEntity<List<TeamDto>> getOrganizationTeams(@PathVariable Long id) {
        return ResponseEntity.ok(organizationApiService.getOrganizationTeams(id));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/{id}/users")
    public ResponseEntity<List<UserDto>> getOrganizationUsers(@PathVariable Long id) {
        return ResponseEntity.ok(organizationApiService.getOrganizationUsers(id));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/{id}/admin")
    public ResponseEntity<UserDto> getOrganizationAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(organizationApiService.getOrganizationAdmin(id));
    }
}