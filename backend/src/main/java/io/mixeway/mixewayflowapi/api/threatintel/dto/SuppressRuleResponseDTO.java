package io.mixeway.mixewayflowapi.api.threatintel.dto;

import io.mixeway.mixewayflowapi.db.entity.SuppressRule;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SuppressRuleResponseDTO {
    private Long id;
    private String vulnerabilityName;
    private SuppressRule.Scope scope;
    private String scopeDetail;
    private String pathRegex;
    private String insertedBy;
    private LocalDateTime insertedDate;
    private String comment;

    // Constructor
    public SuppressRuleResponseDTO(Long id, String vulnerabilityName, SuppressRule.Scope scope, String scopeDetail,
                                   String pathRegex, String insertedBy, LocalDateTime insertedDate, String comment) {
        this.id = id;
        this.vulnerabilityName = vulnerabilityName;
        this.scope = scope;
        this.scopeDetail = scopeDetail;
        this.pathRegex = pathRegex;
        this.insertedBy = insertedBy;
        this.insertedDate = insertedDate;
        this.comment = comment;
    }
}