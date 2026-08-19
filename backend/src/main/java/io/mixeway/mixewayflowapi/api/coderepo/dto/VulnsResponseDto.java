package io.mixeway.mixewayflowapi.api.coderepo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class VulnsResponseDto {
    Long id;
    String name;
    String location;
    String source;
    String status;
    String severity;
    String inserted;
    @JsonProperty("last_seen")
    String lastSeen;
    String urgency;
    @JsonProperty("jira_ticket_key")
    String jiraTicketKey;
    @JsonProperty("ai_verification_grade")
    String aiVerificationGrade;
    @JsonProperty("ai_verification_confidence")
    Double aiVerificationConfidence;
    @JsonProperty("ai_verification_reasoning")
    String aiVerificationReasoning;
    @JsonProperty("ai_verification_recommendation")
    String aiVerificationRecommendation;

}
