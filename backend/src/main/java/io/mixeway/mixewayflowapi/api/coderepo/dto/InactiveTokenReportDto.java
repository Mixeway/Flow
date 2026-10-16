package io.mixeway.mixewayflowapi.api.coderepo.dto;

import java.util.List;

/**
 * Repositories whose stored access token no longer grants access, grouped by team.
 * Never carries token values.
 */
public record InactiveTokenReportDto(
        int checkedRepositories,
        int inactiveRepositories,
        int unverifiedRepositories,
        List<TeamEntry> teams
) {
    public record TeamEntry(Long teamId, String teamName, List<RepoEntry> repositories) {
    }

    public record RepoEntry(Long id, String name, String repoUrl, String type, String status) {
    }
}
