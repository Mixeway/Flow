package io.mixeway.mixewayflowapi.integrations.nist.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class NistCveCvssData {
    private BigDecimal version;
    private String vectorString;
    private String attackVector;
    private String attackComplexity;
    private String privilegesRequired;
    private String userInteraction;
    private String scope;
    private String confidentialityImpact;
    private String integrityImpact;
    private String availabilityImpact;
    private BigDecimal baseScore;
    private String baseSeverity;
    private String exploitCodeMaturity;
    private String remediationLevel;
    private String reportConfidence;
    private String temporalScore;
    private String temporalSeverity;
    private String confidentialityRequirement;
    private String integrityRequirement;
    private String availabilityRequirement;
    private String modifiedAttackVector;
    private String modifiedAttackComplexity;
    private String modifiedPrivilegesRequired;
    private String modifiedUserInteraction;
    private String modifiedScope;
    private String modifiedConfidentialityImpact;
    private String modifiedIntegrityImpact;
    private String modifiedAvailabilityImpact;
    private String environmentalScore;
    private String environmentalSeverity;
}
