package io.mixeway.mixewayflowapi.api.jira.controller;

import io.mixeway.mixewayflowapi.api.jira.dto.CreateJiraTicketsRequestDto;
import io.mixeway.mixewayflowapi.api.jira.dto.CreateJiraTicketsResponseDto;
import io.mixeway.mixewayflowapi.api.jira.dto.JiraConfigRequestDto;
import io.mixeway.mixewayflowapi.api.jira.dto.JiraConfigResponseDto;
import io.mixeway.mixewayflowapi.api.jira.service.JiraApiService;
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
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Log4j2
@Validated
@RequestMapping("/api/v1/jira")
public class JiraController {

    private final JiraApiService jiraApiService;

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping("/team/{teamId}/config")
    public ResponseEntity<JiraConfigResponseDto> getConfiguration(
            @PathVariable Long teamId, Principal principal) {
        try {
            return ResponseEntity.ok(jiraApiService.getConfiguration(teamId, principal));
        } catch (Exception e) {
            log.error("[JIRA] Error getting config for team {}: {}", teamId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PreAuthorize("hasAuthority('TEAM_MANAGER')")
    @PostMapping("/team/{teamId}/config")
    public ResponseEntity<JiraConfigResponseDto> createConfiguration(
            @PathVariable Long teamId,
            @Valid @RequestBody JiraConfigRequestDto request,
            Principal principal) {
        try {
            return ResponseEntity.ok(jiraApiService.createConfiguration(teamId, request, principal));
        } catch (IllegalStateException e) {
            log.error("[JIRA] Config already exists for team {}: {}", teamId, e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (Exception e) {
            log.error("[JIRA] Error creating config for team {}: {}", teamId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PreAuthorize("hasAuthority('TEAM_MANAGER')")
    @PutMapping("/team/{teamId}/config")
    public ResponseEntity<JiraConfigResponseDto> updateConfiguration(
            @PathVariable Long teamId,
            @Valid @RequestBody JiraConfigRequestDto request,
            Principal principal) {
        try {
            return ResponseEntity.ok(jiraApiService.updateConfiguration(teamId, request, principal));
        } catch (Exception e) {
            log.error("[JIRA] Error updating config for team {}: {}", teamId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PreAuthorize("hasAuthority('TEAM_MANAGER')")
    @DeleteMapping("/team/{teamId}/config")
    public ResponseEntity<StatusDTO> deleteConfiguration(
            @PathVariable Long teamId, Principal principal) {
        try {
            jiraApiService.deleteConfiguration(teamId, principal);
            return ResponseEntity.ok(new StatusDTO("ok"));
        } catch (Exception e) {
            log.error("[JIRA] Error deleting config for team {}: {}", teamId, e.getMessage());
            return ResponseEntity.badRequest().body(new StatusDTO("Error deleting JIRA configuration"));
        }
    }

    @PreAuthorize("hasAuthority('USER')")
    @PostMapping("/team/{teamId}/config/test")
    public ResponseEntity<StatusDTO> testConnection(
            @PathVariable Long teamId, Principal principal) {
        try {
            boolean success = jiraApiService.testConnection(teamId, principal);
            if (success) {
                return ResponseEntity.ok(new StatusDTO("Connection successful"));
            } else {
                return ResponseEntity.badRequest().body(new StatusDTO("Connection failed"));
            }
        } catch (Exception e) {
            log.error("[JIRA] Error testing connection for team {}: {}", teamId, e.getMessage());
            return ResponseEntity.badRequest().body(new StatusDTO("Connection test failed: " + e.getMessage()));
        }
    }

    @PreAuthorize("hasAuthority('TEAM_MANAGER')")
    @PostMapping("/projects")
    public ResponseEntity<List<Map<String, String>>> fetchProjects(
            @RequestBody JiraConfigRequestDto request) {
        try {
            List<Map<String, String>> projects = jiraApiService.fetchProjects(request);
            return ResponseEntity.ok(projects);
        } catch (Exception e) {
            log.error("[JIRA] Error fetching projects: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PreAuthorize("hasAuthority('TEAM_MANAGER')")
    @PostMapping("/issue-types")
    public ResponseEntity<List<String>> fetchIssueTypes(
            @RequestBody JiraConfigRequestDto request) {
        try {
            List<String> issueTypes = jiraApiService.fetchIssueTypes(request);
            return ResponseEntity.ok(issueTypes);
        } catch (Exception e) {
            log.error("[JIRA] Error fetching issue types: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PreAuthorize("hasAuthority('USER')")
    @PostMapping("/team/{teamId}/finding/{findingId}/ticket")
    public ResponseEntity<StatusDTO> createTicket(
            @PathVariable Long teamId,
            @PathVariable Long findingId,
            Principal principal) {
        try {
            String ticketKey = jiraApiService.createTicket(teamId, findingId, principal);
            if (ticketKey != null) {
                return ResponseEntity.ok(new StatusDTO(ticketKey));
            }
            return ResponseEntity.badRequest().body(new StatusDTO("Failed to create ticket"));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new StatusDTO(e.getMessage()));
        } catch (Exception e) {
            log.error("[JIRA] Error creating ticket for finding {} in team {}: {}", findingId, teamId, e.getMessage());
            return ResponseEntity.badRequest().body(new StatusDTO("Error creating JIRA ticket"));
        }
    }

    @PreAuthorize("hasAuthority('USER')")
    @PostMapping("/team/{teamId}/tickets")
    public ResponseEntity<CreateJiraTicketsResponseDto> createTicketsBulk(
            @PathVariable Long teamId,
            @Valid @RequestBody CreateJiraTicketsRequestDto request,
            Principal principal) {
        try {
            CreateJiraTicketsResponseDto response = jiraApiService.createTicketsBulk(
                    teamId, request.getFindingIds(), principal);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("[JIRA] Error creating bulk tickets for team {}: {}", teamId, e.getMessage());
            return ResponseEntity.badRequest().body(
                    new CreateJiraTicketsResponseDto(0, 0, "Error: " + e.getMessage()));
        }
    }
}
