package io.mixeway.mixewayflowapi.domain.finding;

import io.mixeway.mixewayflowapi.api.coderepo.dto.VulnStatsResponseDto;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.entity.Vulnerability;
import io.mixeway.mixewayflowapi.db.repository.FindingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FindFindingService {
    private final FindingRepository findingRepository;

    public VulnStatsResponseDto countFindingStatsForRepo(CodeRepo codeRepo){
        return findingRepository.countFindingsBySource(codeRepo.getId());
    }

    public List<Finding> getCodeRepoFindings(CodeRepo codeRepo, CodeRepoBranch codeRepoBranch){
        if (codeRepoBranch == null) {
            codeRepoBranch = codeRepo.getDefaultBranch();
        }
        return findingRepository.findByCodeRepoAndCodeRepoBranch(codeRepo, codeRepoBranch);
    }
    public Optional<Finding> findById(Long id) {
        return findingRepository.findById(id);
    }

    public List<Finding> findByVulnerability(Vulnerability vulnerability) {
        return findingRepository.findByVulnerability(vulnerability);
    }
}
