package io.mixeway.mixewayflowapi.domain.coderepofindingstats;

import io.mixeway.mixewayflowapi.db.entity.CodeRepoFindingStats;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoFindingStatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreateCodeRepoFindingStatsService {
    private final CodeRepoFindingStatsRepository codeRepoFindingStatsRepository;

    public void create(CodeRepoFindingStats codeRepoFindingStats){
        codeRepoFindingStatsRepository.save(codeRepoFindingStats);
    }
}
