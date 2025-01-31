package io.mixeway.mixewayflowapi.api.coderepo.dto;

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
}
