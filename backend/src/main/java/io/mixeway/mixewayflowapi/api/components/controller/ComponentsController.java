package io.mixeway.mixewayflowapi.api.components.controller;

import io.mixeway.mixewayflowapi.api.components.dto.GetComponentsResponseDto;
import io.mixeway.mixewayflowapi.api.components.service.ComponentsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

/**
 * REST controller for managing components and their associated vulnerabilities and repositories.
 *
 * This controller provides endpoints to retrieve components, their associated vulnerabilities,
 * and the repositories in which these components are used. Access to these endpoints is restricted
 * to users with the 'USER' authority.
 */
@RestController
@Validated
@RequiredArgsConstructor
@Log4j2
public class ComponentsController {

    private final ComponentsService componentsService;

    /**
     * Retrieves a list of components along with their associated vulnerabilities and affected repositories.
     *
     * This endpoint is protected and can only be accessed by users with the 'USER' authority.
     * It leverages the {@link ComponentsService#getComponentsWithVulnerabilitiesAndRepos(Principal)} method
     * to fetch and compile the data into a list of {@link GetComponentsResponseDto}.
     *
     * @param principal The security principal of the currently authenticated user.
     * @return A {@link ResponseEntity} containing a list of {@link GetComponentsResponseDto} if successful,
     *         or a BAD_REQUEST status if an error occurs during the process.
     */
    @PreAuthorize("hasAuthority('USER')")
    @GetMapping(value = "/api/v1/components")
    public ResponseEntity<List<GetComponentsResponseDto>> getComponents(Principal principal) {
        try {
            return new ResponseEntity<>(componentsService.getComponentsWithVulnerabilitiesAndRepos(principal), HttpStatus.OK);
        } catch (Exception e) {
            log.error("Failed to retrieve components", e);
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
