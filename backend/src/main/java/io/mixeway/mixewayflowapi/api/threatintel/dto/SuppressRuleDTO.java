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

    // Constructor
    public SuppressRuleDTO(long ownerId, String scope, String vulnerabilityId, Long teamId, Long codeRepoId) {
        this.scope = scope;
        this.vulnerabilityId = vulnerabilityId;
        this.teamId = teamId;
        this.codeRepoId = codeRepoId;
    }

    // Default constructor
    public SuppressRuleDTO() {
    }
}