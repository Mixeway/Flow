package io.mixeway.mixewayflowapi.api.cicd.dto;

import lombok.Data;

@Data
public class CodeRepoDto {
    String repoUrl;
    String branch;
}
