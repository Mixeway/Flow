package io.mixeway.mixewayflowapi.api.stats;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoFindingStats;
import io.mixeway.mixewayflowapi.db.entity.ScanInfo;
import io.mixeway.mixewayflowapi.db.entity.Team;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoFindingStatsRepository;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.scaninfo.FindScanInfoService;
import io.mixeway.mixewayflowapi.utils.PermissionFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/stats")
@RequiredArgsConstructor
@Log4j2
public class StatsController {

    private final CodeRepoFindingStatsRepository codeRepoFindingStatsRepository;
    private final FindCodeRepoService findCodeRepoService;
    private final PermissionFactory permissionFactory;
    private final FindScanInfoService findScanInfoService;

    /**
     * Returns vulnerability trend data over time for repositories the user has access to
     */
    @GetMapping("/trend")
    public ResponseEntity<?> getVulnerabilityTrend(Principal principal,
                                                   @RequestParam(required = false) Long teamId,
                                                   @RequestParam(required = false) Integer days) {

        int daysToFetch = days != null ? days : 30; // Default to 30 days
        LocalDateTime startDate = LocalDateTime.now().minusDays(daysToFetch);

        List<Team> accessibleTeams;

        if (teamId != null) {
            // If team ID is provided, check access and return data for that team
            Optional<Team> teamOpt = permissionFactory.findById(teamId, principal);
            if (teamOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            accessibleTeams = Collections.singletonList(teamOpt.get());
        } else {
            // Otherwise, return data for all teams the user has access to
            accessibleTeams = permissionFactory.findTeams(principal);
        }

        // Get all code repos for accessible teams
        List<CodeRepo> accessibleRepos = new ArrayList<>();
        for (Team team : accessibleTeams) {
            accessibleRepos.addAll(findCodeRepoService.findByTeam(team));
        }

        // Get stats for these repos within the date range
        List<CodeRepoFindingStats> allStats = new ArrayList<>();
        for (CodeRepo repo : accessibleRepos) {
            allStats.addAll(codeRepoFindingStatsRepository.findByCodeRepoAndDateInsertedAfter(repo, startDate));
        }

        // Group stats by date and aggregate the counts
        Map<String, Map<String, Integer>> trendData = new LinkedHashMap<>();

        for (CodeRepoFindingStats stat : allStats) {
            String dateKey = stat.getDateInserted().toLocalDate().toString();

            trendData.putIfAbsent(dateKey, new HashMap<>());
            Map<String, Integer> dailyData = trendData.get(dateKey);

            // Aggregate vulnerability counts by severity
            updateCount(dailyData, "sastCritical", stat.getSastCritical());
            updateCount(dailyData, "sastHigh", stat.getSastHigh());
            updateCount(dailyData, "sastMedium", stat.getSastMedium());
            updateCount(dailyData, "sastRest", stat.getSastRest());

            updateCount(dailyData, "scaCritical", stat.getScaCritical());
            updateCount(dailyData, "scaHigh", stat.getScaHigh());
            updateCount(dailyData, "scaMedium", stat.getScaMedium());
            updateCount(dailyData, "scaRest", stat.getScaRest());

            updateCount(dailyData, "iacCritical", stat.getIacCritical());
            updateCount(dailyData, "iacHigh", stat.getIacHigh());
            updateCount(dailyData, "iacMedium", stat.getIacMedium());
            updateCount(dailyData, "iacRest", stat.getIacRest());

            updateCount(dailyData, "secretsCritical", stat.getSecretsCritical());
            updateCount(dailyData, "secretsHigh", stat.getSecretsHigh());
            updateCount(dailyData, "secretsMedium", stat.getSecretsMedium());
            updateCount(dailyData, "secretsRest", stat.getSecretsRest());

            // Track overall statuses
            updateCount(dailyData, "openFindings", stat.getOpenedFindings());
            updateCount(dailyData, "removedFindings", stat.getRemovedFindings());
            updateCount(dailyData, "reviewedFindings", stat.getReviewedFindings());
        }

        // Convert to a list of objects for easier consumption by the frontend
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<String, Map<String, Integer>> entry : trendData.entrySet()) {
            Map<String, Object> item = new HashMap<>(entry.getValue());
            item.put("date", entry.getKey());
            result.add(item);
        }

        return ResponseEntity.ok(result);
    }

    /**
     * Returns summary statistics for repositories the user has access to
     */
    @GetMapping("/summary")
    public ResponseEntity<?> getVulnerabilitySummary(Principal principal,
                                                     @RequestParam(required = false) Long teamId) {

        List<Team> accessibleTeams;

        if (teamId != null) {
            Optional<Team> teamOpt = permissionFactory.findById(teamId, principal);
            if (teamOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            accessibleTeams = Collections.singletonList(teamOpt.get());
        } else {
            accessibleTeams = permissionFactory.findTeams(principal);
        }

        // Get all code repos for accessible teams
        List<CodeRepo> accessibleRepos = new ArrayList<>();
        for (Team team : accessibleTeams) {
            accessibleRepos.addAll(findCodeRepoService.findByTeam(team));
        }

        // Get the latest stats for each repo
        List<CodeRepoFindingStats> latestStats = new ArrayList<>();
        for (CodeRepo repo : accessibleRepos) {
            Optional<CodeRepoFindingStats> latestStat = codeRepoFindingStatsRepository
                    .findTopByCodeRepoOrderByDateInsertedDesc(repo);
            latestStat.ifPresent(latestStats::add);
        }

        // Calculate summary statistics
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalRepos", accessibleRepos.size());

        int criticalTotal = 0;
        int highTotal = 0;
        int mediumTotal = 0;
        int lowTotal = 0;
        int sastTotal = 0;
        int scaTotal = 0;
        int iacTotal = 0;
        int secretsTotal = 0;
        int openTotal = 0;
        int removedTotal = 0;
        int reviewedTotal = 0;
        int totalAvgFixTime = 0;
        int reposWithFixTimeData = 0;

        for (CodeRepoFindingStats stat : latestStats) {
            // Count by severity
            criticalTotal += stat.getSastCritical() + stat.getScaCritical() +
                    stat.getIacCritical() + stat.getSecretsCritical();

            highTotal += stat.getSastHigh() + stat.getScaHigh() +
                    stat.getIacHigh() + stat.getSecretsHigh();

            mediumTotal += stat.getSastMedium() + stat.getScaMedium() +
                    stat.getIacMedium() + stat.getSecretsMedium();

            lowTotal += stat.getSastRest() + stat.getScaRest() +
                    stat.getIacRest() + stat.getSecretsRest();

            // Count by source
            sastTotal += stat.getSastCritical() + stat.getSastHigh() +
                    stat.getSastMedium() + stat.getSastRest();

            scaTotal += stat.getScaCritical() + stat.getScaHigh() +
                    stat.getScaMedium() + stat.getScaRest();

            iacTotal += stat.getIacCritical() + stat.getIacHigh() +
                    stat.getIacMedium() + stat.getIacRest();

            secretsTotal += stat.getSecretsCritical() + stat.getSecretsHigh() +
                    stat.getSecretsMedium() + stat.getSecretsRest();

            // Count by status
            openTotal += stat.getOpenedFindings();
            removedTotal += stat.getRemovedFindings();
            reviewedTotal += stat.getReviewedFindings();

            // Track average fix time
            if (stat.getAverageFixTime() > 0) {
                totalAvgFixTime += stat.getAverageFixTime();
                reposWithFixTimeData++;
            }
        }

        summary.put("criticalTotal", criticalTotal);
        summary.put("highTotal", highTotal);
        summary.put("mediumTotal", mediumTotal);
        summary.put("lowTotal", lowTotal);

        summary.put("sastTotal", sastTotal);
        summary.put("scaTotal", scaTotal);
        summary.put("iacTotal", iacTotal);
        summary.put("secretsTotal", secretsTotal);

        summary.put("openTotal", openTotal);
        summary.put("removedTotal", removedTotal);
        summary.put("reviewedTotal", reviewedTotal);

        // Calculate average fix time across all repos with data
        int avgFixTime = reposWithFixTimeData > 0 ? totalAvgFixTime / reposWithFixTimeData : 0;
        summary.put("averageFixTime", avgFixTime);

        return ResponseEntity.ok(summary);
    }

    /**
     * Returns repositories with the most vulnerabilities that the user has access to
     */
    @GetMapping("/top-repos")
    public ResponseEntity<?> getTopVulnerableRepos(Principal principal,
                                                   @RequestParam(required = false) Long teamId,
                                                   @RequestParam(required = false) Integer limit) {

        int resultsLimit = limit != null ? limit : 10; // Default to top 10

        List<Team> accessibleTeams;

        if (teamId != null) {
            Optional<Team> teamOpt = permissionFactory.findById(teamId, principal);
            if (teamOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            accessibleTeams = Collections.singletonList(teamOpt.get());
        } else {
            accessibleTeams = permissionFactory.findTeams(principal);
        }

        // Get all code repos for accessible teams
        List<CodeRepo> accessibleRepos = new ArrayList<>();
        for (Team team : accessibleTeams) {
            accessibleRepos.addAll(findCodeRepoService.findByTeam(team));
        }

        // Get the latest stats for each repo
        List<Map<String, Object>> repoStats = new ArrayList<>();
        for (CodeRepo repo : accessibleRepos) {
            Optional<CodeRepoFindingStats> latestStat = codeRepoFindingStatsRepository
                    .findTopByCodeRepoOrderByDateInsertedDesc(repo);

            if (latestStat.isPresent()) {
                CodeRepoFindingStats stat = latestStat.get();
                Map<String, Object> repoData = new HashMap<>();

                repoData.put("repoId", repo.getId());
                repoData.put("repoName", repo.getName());
                repoData.put("teamName", repo.getTeam().getName());

                int criticalCount = stat.getSastCritical() + stat.getScaCritical() +
                        stat.getIacCritical() + stat.getSecretsCritical();

                int highCount = stat.getSastHigh() + stat.getScaHigh() +
                        stat.getIacHigh() + stat.getSecretsHigh();

                int totalVulns = stat.getOpenedFindings();

                repoData.put("criticalCount", criticalCount);
                repoData.put("highCount", highCount);
                repoData.put("totalVulnerabilities", totalVulns);
                repoData.put("averageFixTime", stat.getAverageFixTime());

                repoStats.add(repoData);
            }
        }

        // Sort repos by total vulnerabilities (descending) and take the top N
        repoStats.sort((a, b) ->
                Integer.compare(
                        (Integer) b.get("totalVulnerabilities"),
                        (Integer) a.get("totalVulnerabilities")
                )
        );

        return ResponseEntity.ok(
                repoStats.stream()
                        .limit(resultsLimit)
                        .collect(Collectors.toList())
        );
    }

    /**
     * Returns vulnerability statistics grouped by team for teams the user has access to
     */
    @GetMapping("/teams-summary")
    public ResponseEntity<?> getTeamsSummary(Principal principal) {
        List<Team> accessibleTeams = permissionFactory.findTeams(principal);

        List<Map<String, Object>> teamStats = new ArrayList<>();

        for (Team team : accessibleTeams) {
            Map<String, Object> teamData = new HashMap<>();
            teamData.put("teamId", team.getId());
            teamData.put("teamName", team.getName());

            List<CodeRepo> teamRepos = findCodeRepoService.findByTeam(team);
            teamData.put("repoCount", teamRepos.size());

            int criticalTotal = 0;
            int highTotal = 0;
            int totalVulns = 0;
            int fixedVulns = 0;

            for (CodeRepo repo : teamRepos) {
                Optional<CodeRepoFindingStats> latestStat = codeRepoFindingStatsRepository
                        .findTopByCodeRepoOrderByDateInsertedDesc(repo);

                if (latestStat.isPresent()) {
                    CodeRepoFindingStats stat = latestStat.get();

                    criticalTotal += stat.getSastCritical() + stat.getScaCritical() +
                            stat.getIacCritical() + stat.getSecretsCritical();

                    highTotal += stat.getSastHigh() + stat.getScaHigh() +
                            stat.getIacHigh() + stat.getSecretsHigh();

                    totalVulns += stat.getOpenedFindings();
                    fixedVulns += stat.getRemovedFindings();
                }
            }

            teamData.put("criticalCount", criticalTotal);
            teamData.put("highCount", highTotal);
            teamData.put("totalVulnerabilities", totalVulns);
            teamData.put("fixedVulnerabilities", fixedVulns);

            teamStats.add(teamData);
        }

        // Sort teams by total vulnerabilities (descending)
        teamStats.sort((a, b) ->
                Integer.compare(
                        (Integer) b.get("totalVulnerabilities"),
                        (Integer) a.get("totalVulnerabilities")
                )
        );

        return ResponseEntity.ok(teamStats);
    }

    // Helper method to update counts in the aggregation map
    private void updateCount(Map<String, Integer> map, String key, int value) {
        map.put(key, map.getOrDefault(key, 0) + value);
    }

    /**
     * Returns aggregated dashboard statistics including team count, scan counts, etc.
     */
    @GetMapping("/dashboard-metrics")
    public ResponseEntity<?> getDashboardMetrics(Principal principal) {
        // Get all teams the user has access to
        List<Team> accessibleTeams = permissionFactory.findTeams(principal);

        // Get all code repos for accessible teams
        List<CodeRepo> accessibleRepos = new ArrayList<>();
        for (Team team : accessibleTeams) {
            accessibleRepos.addAll(findCodeRepoService.findByTeam(team));
        }

        // Calculate monthly date range
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);

        // Initialize counters
        long totalScans = 0;
        long monthlyScans = 0;

        // For each repo, count total and monthly scans
        for (CodeRepo repo : accessibleRepos) {
            // We need to count ScanInfo records for each repo
            List<ScanInfo> repoScans = findScanInfoService.findScanInfoByRepo(repo);
            totalScans += repoScans.size();

            // Count scans within the last 30 days
            long repoMonthlyScans = repoScans.stream()
                    .filter(scan -> scan.getInsertedDate().isAfter(thirtyDaysAgo))
                    .count();
            monthlyScans += repoMonthlyScans;
        }

        // Build the response
        Map<String, Object> dashboardMetrics = new HashMap<>();
        dashboardMetrics.put("teams", accessibleTeams.size());
        dashboardMetrics.put("totalScans", totalScans);
        dashboardMetrics.put("monthlyScans", monthlyScans);

        return ResponseEntity.ok(dashboardMetrics);
    }
}