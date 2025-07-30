package io.mixeway.mixewayflowapi.api.repositoryprovider.dto;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.RepositoryProvider;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class RepositoryProviderDto {
    private Long id;
    private CodeRepo.RepoType providerType;
    private String apiUrl;
    private String defaultTeamName;
    private LocalDateTime lastSyncDate;
    private Integer syncedRepoCount;

    public RepositoryProviderDto(RepositoryProvider provider) {
        this.id = provider.getId();
        this.providerType = provider.getProviderType();
        this.apiUrl = provider.getApiUrl();
        this.defaultTeamName = provider.getDefaultTeam().getName();
        this.lastSyncDate = provider.getLastSyncDate();
        this.syncedRepoCount = provider.getSyncedRepoCount();
    }
}
