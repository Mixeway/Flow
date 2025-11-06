package io.mixeway.mixewayflowapi.api.gitlabcicd.dto;

import lombok.Data;

@Data
public class GitLabCICDRequestDto {
    private String repoUrl;
    private String branch;
    private String domain;

    public GitLabCICDRequestDto() {}

    public String getRepoUrl() {
        return repoUrl;
    }

    public String getBranch() {
        return branch;
    }

    public String getDomain() {
        return domain;
    }
}
