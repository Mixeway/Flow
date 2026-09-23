package io.mixeway.mixewayflowapi.api.coderepo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class GetFindingResponseDto {
    VulnsResponseDto vulnsResponseDto;
    String description;
    String recommendation;
    String explanation;
    String refs;
    List<CommentDto> comments;
    @JsonProperty("ai_verification_reasoning")
    String aiVerificationReasoning;
    @JsonProperty("ai_verification_recommendation")
    String aiVerificationRecommendation;
}
