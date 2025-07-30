package io.mixeway.mixewayflowapi.api.repositoryprovider.service;

import com.opencsv.bean.CsvToBean;
import io.mixeway.mixewayflowapi.api.repositoryprovider.dto.CreateProviderRequestDto;
import io.mixeway.mixewayflowapi.db.entity.RepositoryProvider;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.repository.RepositoryProviderRepository;
import io.mixeway.mixewayflowapi.domain.team.FindTeamService;
import io.mixeway.mixewayflowapi.integrations.repo.service.RepositorySyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RepositoryProviderService {

    private final RepositoryProviderRepository providerRepository;
    private final FindTeamService findTeamService;
    private final RepositorySyncService repositorySyncService;
    private final RepositoryProviderRepository repositoryProviderRepository;

    @Transactional
    public void createProvider(CreateProviderRequestDto dto) {
        if (providerRepository.existsByApiUrl(dto.getApiUrl())) {
            throw new IllegalArgumentException("A repository provider with the URL '" + dto.getApiUrl() + "' already exists.");
        }
        Team defaultTeam = findTeamService.findById(dto.getDefaultTeamId())
                .orElseThrow(() -> new RuntimeException("Default team not found"));

        RepositoryProvider provider = new RepositoryProvider();
        provider.setProviderType(dto.getProviderType());
        provider.setApiUrl(dto.getApiUrl());
        provider.setEncryptedAccessToken(dto.getAccessToken());
        provider.setDefaultTeam(defaultTeam);

        RepositoryProvider savedProvider = providerRepository.save(provider);

        // Trigger initial sync asynchronously
        repositorySyncService.syncProvider(savedProvider);
    }

    public List<RepositoryProvider> findAll() {
        return repositoryProviderRepository.findAll();
    }
}