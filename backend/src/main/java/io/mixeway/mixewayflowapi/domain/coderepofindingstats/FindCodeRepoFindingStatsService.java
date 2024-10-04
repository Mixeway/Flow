package io.mixeway.mixewayflowapi.domain.coderepofindingstats;

import io.mixeway.mixewayflowapi.api.coderepo.dto.AggregatedRepoStatsDTO;
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
import java.util.Map;
import java.util.stream.Collectors;

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

        List<CodeRepoFindingStats> statsList = codeRepoFindingStatsRepository
                .findStatsBetweenDatesAndForCodeRepos(startDate, endDate, findCodeRepoService.getCodeReposResponseDtos(principal).stream().map(GetCodeReposResponseDto::getId).toList());

        Map<LocalDate, List<CodeRepoFindingStats>> groupedByDate = statsList.stream()
                .collect(Collectors.groupingBy(stats -> stats.getDateInserted().toLocalDate()));

        List<AggregatedRepoStatsDTO.DailyFindings> activeFindings = groupedByDate.entrySet().stream()
                .map(entry -> new AggregatedRepoStatsDTO.DailyFindings(entry.getKey().toString(),
                        entry.getValue().stream().mapToInt(stats -> stats.getSastCritical() + stats.getSastHigh() +
                                stats.getScaCritical() + stats.getScaHigh() +
                                stats.getIacCritical() + stats.getIacHigh() +
                                stats.getSecretsCritical() + stats.getSecretsHigh()).sum()))
                .collect(Collectors.toList());

        List<AggregatedRepoStatsDTO.DailyFindings> removedFindings = groupedByDate.entrySet().stream()
                .map(entry -> new AggregatedRepoStatsDTO.DailyFindings(entry.getKey().toString(),
                        entry.getValue().stream().mapToInt(CodeRepoFindingStats::getRemovedFindings).sum()))
                .collect(Collectors.toList());

        List<AggregatedRepoStatsDTO.DailyFindings> reviewedFindings = groupedByDate.entrySet().stream()
                .map(entry -> new AggregatedRepoStatsDTO.DailyFindings(entry.getKey().toString(),
                        entry.getValue().stream().mapToInt(CodeRepoFindingStats::getReviewedFindings).sum()))
                .collect(Collectors.toList());

        List<AggregatedRepoStatsDTO.DailyFindings> averageFixTime = groupedByDate.entrySet().stream()
                .map(entry -> new AggregatedRepoStatsDTO.DailyFindings(entry.getKey().toString(),
                        entry.getValue().stream().mapToInt(CodeRepoFindingStats::getAverageFixTime).sum() / entry.getValue().size()))
                .collect(Collectors.toList());

        return new AggregatedRepoStatsDTO(activeFindings, removedFindings, reviewedFindings, averageFixTime);
    }
}
