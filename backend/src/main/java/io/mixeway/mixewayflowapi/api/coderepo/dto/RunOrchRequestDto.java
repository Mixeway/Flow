package io.mixeway.mixewayflowapi.api.coderepo.dto;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RunOrchRequestDto {
    private String repoUrl;
    private Long teamId;
    private String branch;
    private String domain;

    public RunOrchRequestDto() {}

    @NotNull(message = "RepoURL must not be null.")
    public String getRepoUrl() {
        return repoUrl;
    }

    @NotNull(message = "TeamID must not be null.")
    public Long getTeamId() {
        return teamId;
    }

    public String getBranch() { return branch; }

    public String getDomain() {
        return domain;
    }

}
