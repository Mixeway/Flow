package io.mixeway.mixewayflowapi.domain.repositoryallowlist;

import io.mixeway.mixewayflowapi.db.entity.RepositoryAllowlist;
import io.mixeway.mixewayflowapi.db.repository.RepositoryAllowlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FindRepositoryAllowlistService {

    private final RepositoryAllowlistRepository repositoryAllowlistRepository;

    public Iterable<RepositoryAllowlist> findAll() {
        return repositoryAllowlistRepository.findAll();
    }
}
