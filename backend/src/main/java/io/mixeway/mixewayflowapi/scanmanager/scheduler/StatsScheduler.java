package io.mixeway.mixewayflowapi.scanmanager.scheduler;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoFindingStats;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.coderepofindingstats.CreateCodeRepoFindingStatsService;
import io.mixeway.mixewayflowapi.domain.finding.FindFindingService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Scheduler service responsible for generating and saving statistics related to code repository findings.
 * This service periodically analyzes findings and calculates various metrics for each repository.
 */
@Service
@RequiredArgsConstructor
@Log4j2
public class StatsScheduler {

    private final FindCodeRepoService findCodeRepoService;
    private final FindFindingService findFindingService;
    private final CreateCodeRepoFindingStatsService createCodeRepoFindingStatsService;

    /**
     * Scheduled task that runs every day at 3 AM.
     * This method collects findings statistics for each code repository, calculates metrics,
     * and saves the statistics for further analysis.
     */
    @Scheduled(cron = "0 0 3 * * ?")
    @Transactional
    public void collectAndSaveStats() {
        log.info("[StatusService] Starting generation of stats for CodeRepos...");

        for (CodeRepo codeRepo : findCodeRepoService.findAll()) {
            List<Finding> findings = findFindingService.getCodeRepoFindings(codeRepo, codeRepo.getDefaultBranch());

            int sastCritical = countFindings(findings, Finding.Source.SAST, Finding.Severity.CRITICAL, Finding.Status.EXISTING, Finding.Status.NEW);
            int sastHigh = countFindings(findings, Finding.Source.SAST, Finding.Severity.HIGH, Finding.Status.EXISTING, Finding.Status.NEW);
            int sastMedium = countFindings(findings, Finding.Source.SAST, Finding.Severity.MEDIUM, Finding.Status.EXISTING, Finding.Status.NEW);
            int sastRest = countRestFindings(findings, Finding.Source.SAST, Finding.Status.EXISTING, Finding.Status.NEW);

            int scaCritical = countFindings(findings, Finding.Source.SCA, Finding.Severity.CRITICAL, Finding.Status.EXISTING, Finding.Status.NEW);
            int scaHigh = countFindings(findings, Finding.Source.SCA, Finding.Severity.HIGH, Finding.Status.EXISTING, Finding.Status.NEW);
            int scaMedium = countFindings(findings, Finding.Source.SCA, Finding.Severity.MEDIUM, Finding.Status.EXISTING, Finding.Status.NEW);
            int scaRest = countRestFindings(findings, Finding.Source.SCA, Finding.Status.EXISTING, Finding.Status.NEW);

            int iacCritical = countFindings(findings, Finding.Source.IAC, Finding.Severity.CRITICAL, Finding.Status.EXISTING, Finding.Status.NEW);
            int iacHigh = countFindings(findings, Finding.Source.IAC, Finding.Severity.HIGH, Finding.Status.EXISTING, Finding.Status.NEW);
            int iacMedium = countFindings(findings, Finding.Source.IAC, Finding.Severity.MEDIUM, Finding.Status.EXISTING, Finding.Status.NEW);
            int iacRest = countRestFindings(findings, Finding.Source.IAC, Finding.Status.EXISTING, Finding.Status.NEW);

            int secretsCritical = countFindings(findings, Finding.Source.SECRETS, Finding.Severity.CRITICAL, Finding.Status.EXISTING, Finding.Status.NEW);
            int secretsHigh = countFindings(findings, Finding.Source.SECRETS, Finding.Severity.HIGH, Finding.Status.EXISTING, Finding.Status.NEW);
            int secretsMedium = countFindings(findings, Finding.Source.SECRETS, Finding.Severity.MEDIUM, Finding.Status.EXISTING, Finding.Status.NEW);
            int secretsRest = countRestFindings(findings, Finding.Source.SECRETS, Finding.Status.EXISTING, Finding.Status.NEW);

            int openedFindings = sastCritical + sastHigh + sastMedium + sastRest +
                    scaCritical + scaHigh + scaMedium + scaRest +
                    iacCritical + iacHigh + iacMedium + iacRest +
                    secretsCritical + secretsHigh + secretsMedium + secretsRest;

            int removedFindings = countFindings(findings, null, null, Finding.Status.REMOVED);
            int reviewedFindings = countFindings(findings, null, null, Finding.Status.SUPRESSED);
            int averageFixTime = calculateAverageFixTime(findings);

            CodeRepoFindingStats stats = new CodeRepoFindingStats(
                    codeRepo,
                    sastCritical, sastHigh, sastMedium, sastRest,
                    scaCritical, scaHigh, scaMedium, scaRest,
                    iacCritical, iacHigh, iacMedium, iacRest,
                    secretsCritical, secretsHigh, secretsMedium, secretsRest,
                    openedFindings, removedFindings, reviewedFindings, averageFixTime
            );

            createCodeRepoFindingStatsService.create(stats);
        }
        log.info("[StatusService] Finished generation of stats for CodeRepos...");
    }

    /**
     * Counts the number of findings in the provided list that match the specified source, severity, and statuses.
     *
     * @param findings The list of findings to filter and count.
     * @param source   The source of the findings to count, or null to count all sources.
     * @param severity The severity of the findings to count, or null to count all severities.
     * @param statuses The statuses of the findings to count.
     * @return The count of findings that match the specified criteria.
     */
    private int countFindings(List<Finding> findings, Finding.Source source, Finding.Severity severity, Finding.Status... statuses) {
        return (int) findings.stream()
                .filter(f -> (source == null || f.getSource() == source) &&
                        (severity == null || f.getSeverity() == severity) &&
                        (statuses.length == 0 || java.util.Arrays.asList(statuses).contains(f.getStatus())))
                .count();
    }

    /**
     * Counts the number of findings in the provided list that are not of critical, high, or medium severity,
     * but match the specified source and statuses.
     *
     * @param findings The list of findings to filter and count.
     * @param source   The source of the findings to count.
     * @param statuses The statuses of the findings to count.
     * @return The count of findings that match the specified criteria and are not critical, high, or medium severity.
     */
    private int countRestFindings(List<Finding> findings, Finding.Source source, Finding.Status... statuses) {
        return (int) findings.stream()
                .filter(f -> f.getSource() == source &&
                        f.getSeverity() != Finding.Severity.CRITICAL &&
                        f.getSeverity() != Finding.Severity.HIGH &&
                        f.getSeverity() != Finding.Severity.MEDIUM &&
                        java.util.Arrays.asList(statuses).contains(f.getStatus()))
                .count();
    }

    /**
     * Calculates the average fix time in days for the findings in the provided list that have been removed.
     *
     * @param findings The list of findings to filter and analyze.
     * @return The average fix time in days, or 0 if no findings have been removed.
     */
    private int calculateAverageFixTime(List<Finding> findings) {
        return (int) findings.stream()
                .filter(f -> f.getStatus() == Finding.Status.REMOVED)
                .mapToLong(f -> ChronoUnit.DAYS.between(f.getInsertedDate(), f.getUpdatedDate()))
                .average()
                .orElse(0);
    }
}
