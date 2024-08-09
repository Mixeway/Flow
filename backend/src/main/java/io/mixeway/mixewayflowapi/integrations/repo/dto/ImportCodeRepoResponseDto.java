package io.mixeway.mixewayflowapi.integrations.repo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ImportCodeRepoResponseDto {
    private int id;
    private String description;
    @JsonProperty("default_branch")
    private String defaultBranch;
    @JsonProperty("web_url")
    private String webUrl;
    @JsonProperty("path_with_namespace")
    private String pathWithNamespace;
}
