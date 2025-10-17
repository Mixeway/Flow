package io.mixeway.mixewayflowapi.api.threatintel.controller;

import io.mixeway.mixewayflowapi.api.threatintel.dto.SuppressRuleDTO;
import io.mixeway.mixewayflowapi.api.threatintel.dto.SuppressRuleResponseDTO;
import io.mixeway.mixewayflowapi.api.threatintel.service.SuppressRuleService;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.entity.UserInfo;
import io.mixeway.mixewayflowapi.db.entity.UserRole;
import io.mixeway.mixewayflowapi.domain.suppressrule.FindSuppressRuleService;
import io.mixeway.mixewayflowapi.domain.user.FindUserService;
import io.mixeway.mixewayflowapi.utils.StatusDTO;
import io.mixeway.mixewayflowapi.exceptions.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@Log4j2
public class SuppressRuleController {
    private final FindSuppressRuleService findSuppressRuleService;
    private final FindUserService findUserService;
    private final SuppressRuleService suppressRuleService;

    @PreAuthorize("isAuthenticated()")
    @GetMapping(value= "/api/v1/threat-intel/suppress-rules")
    public List<SuppressRuleResponseDTO> getSuppressRules(Principal principal) {
        UserInfo user = findUserService.findUser(principal.getName());
        boolean isAdmin = user.getHighestRole().equals("ADMIN");
        Set<Team> userTeams = user.getTeams();
        return findSuppressRuleService.suppressRuleResponseDTOS(isAdmin, userTeams);
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping(value= "/api/v1/threat-intel/suppress-rules/{id}")
    public ResponseEntity<StatusDTO> deleteRule(Principal principal, @PathVariable("id") Long id) {
        try {
            suppressRuleService.deleteRule(id, principal);
            return new ResponseEntity<>(new StatusDTO(""), HttpStatus.OK);
        } catch (UnauthorizedException e) {
            log.warn("[SuppressRule] Unauthorized delete for rule {}: {}", id, e.getMessage());
            return new ResponseEntity<>(new StatusDTO(e.getMessage()), HttpStatus.FORBIDDEN);
        } catch (IllegalArgumentException e) {
            log.warn("[SuppressRule] Delete failed, rule not found {}: {}", id, e.getMessage());
            return new ResponseEntity<>(new StatusDTO(e.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            log.error("[SuppressRule] Error deleting rule {}: {}", id, e.getLocalizedMessage());
            return new ResponseEntity<>(new StatusDTO(""), HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('TEAM_MANAGER')")
    @PostMapping(value= "/api/v1/threat-intel/suppress-rules")
    public ResponseEntity<StatusDTO> createRule(Principal principal, @RequestBody SuppressRuleDTO suppressRuleDTO) {
        try {
            suppressRuleService.createRule(suppressRuleDTO, principal);
            return new ResponseEntity<>(new StatusDTO(""), HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("[SuppressRule] Error creating rule {}", e.getLocalizedMessage());
            return new ResponseEntity<>(new StatusDTO(""), HttpStatus.BAD_REQUEST);
        }
    }

}
