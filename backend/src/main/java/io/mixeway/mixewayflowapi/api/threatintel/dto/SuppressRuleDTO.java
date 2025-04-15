package io.mixeway.mixewayflowapi.api.threatintel.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SuppressRuleDTO {

    private String scope; // "GLOBAL", "TEAM", or "PROJECT"
    private String vulnerabilityId; // ID of the vulnerability
    private Long teamId; // Optional, required if scope is "TEAM"
    private Long codeRepoId; // Optional, required if scope is "PROJECT"
    private String pathRegex; // Optional, path regex pattern for file paths

    // Constructor
    public SuppressRuleDTO(long ownerId, String scope, String vulnerabilityId, Long teamId, Long codeRepoId, String pathRegex) {
        this.scope = scope;
        this.vulnerabilityId = vulnerabilityId;
        this.teamId = teamId;
        this.codeRepoId = codeRepoId;
        this.pathRegex = pathRegex;
    }

    // Default constructor
    public SuppressRuleDTO() {
    }
}