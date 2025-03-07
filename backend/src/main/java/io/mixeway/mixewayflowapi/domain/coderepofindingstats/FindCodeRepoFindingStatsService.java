package io.mixeway.mixewayflowapi.domain.coderepofindingstats;

import io.mixeway.mixewayflowapi.api.coderepo.dto.AggregatedRepoStatsDTO;
import io.mixeway.mixewayflowapi.api.coderepo.dto.DailyFindings;
import io.mixeway.mixewayflowapi.api.coderepo.dto.GetCodeReposResponseDto;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoFindingStats;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoFindingStatsRepository;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FindCodeRepoFindingStatsService {
    private final CodeRepoFindingStatsRepository codeRepoFindingStatsRepository;
    private final FindCodeRepoService findCodeRepoService;

    public List<CodeRepoFindingStats> getStatsForRepo(CodeRepo codeRepo){
        return codeRepoFindingStatsRepository.findTop14ByCodeRepoOrderByDateInsertedDesc(codeRepo);
    }


    public AggregatedRepoStatsDTO getAggregatedStatsForLastSevenDays(Principal principal) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(6);
        List<Long> repoIds = findCodeRepoService.getCodeReposResponseDtos(principal).stream().map(GetCodeReposResponseDto::getId).toList();

        List<DailyFindings> activeFindings = codeRepoFindingStatsRepository
                .findOpenedFindingsBetweenDates(startDate, endDate, repoIds);
        List<DailyFindings> removedFindings = codeRepoFindingStatsRepository
                .findRemovedFindingsBetweenDates(startDate, endDate, repoIds);
        List<DailyFindings> reviewedFindings = codeRepoFindingStatsRepository
                .findReviewedFindingsBetweenDates(startDate, endDate, repoIds);
        List<DailyFindings> averageFixTime = codeRepoFindingStatsRepository
                .findETAFindingsBetweenDates(startDate, endDate, repoIds);

        return new AggregatedRepoStatsDTO(activeFindings, removedFindings, reviewedFindings, averageFixTime);
    }
}
