package io.mixeway.mixewayflowapi.api.gitlabcicd.dto;

import lombok.Data;

@Data
public class GitlabCICDRequestDto {
    private String repoUrl;
    private String branch;

    public GitlabCICDRequestDto() {}

    public String getRepoUrl() {
        return repoUrl;
    }

    public String getBranch() {
        return branch;
    }
}
