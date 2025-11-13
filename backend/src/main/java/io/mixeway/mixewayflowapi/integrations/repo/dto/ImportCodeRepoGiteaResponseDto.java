package io.mixeway.mixewayflowapi.integrations.repo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ImportCodeRepoGiteaResponseDto {
    private int id;
    private String description;
    @JsonProperty("default_branch")
    private String defaultBranch;
    @JsonProperty("html_url")
    private String webUrl;
    @JsonProperty("full_name")
    private String pathWithNamespace;
}

