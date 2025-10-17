package io.mixeway.mixewayflowapi.scanmanager.scheduler;

import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.ScanInfo;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoRepository;
import io.mixeway.mixewayflowapi.db.repository.RepositoryProviderRepository;
import io.mixeway.mixewayflowapi.domain.scaninfo.FindScanInfoService;
import io.mixeway.mixewayflowapi.integrations.repo.service.GetCodeRepoInfoService;
import io.mixeway.mixewayflowapi.integrations.repo.service.RepositorySyncService;
import io.mixeway.mixewayflowapi.integrations.scanner.sca.service.SCAService;
import io.mixeway.mixewayflowapi.scanmanager.service.ScanManagerService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.stream.Collectors;

/**
 * Scheduler service responsible for managing and executing periodic scans on code repositories.
 * This service initializes the SCA environment on startup and schedules regular scans and metadata updates.
 */
@Service
@RequiredArgsConstructor
@Log4j2
public class ScanScheduler {

    private final CodeRepoRepository codeRepoRepository;
    private final ScanManagerService scanManagerService;
    private final SCAService scaService;
    private static final int THREAD_POOL_SIZE = 15; // Adjust the pool size as needed
    private final GetCodeRepoInfoService getCodeRepoInfoService;
    private final FindScanInfoService findScanInfoService;
    private static final int MAX_REPOS_TO_SCAN = 10;   // was 50
    private static final int DAYS_SINCE_LAST_SCAN = 14; // was 7
    private final RepositoryProviderRepository providerRepository;
    private final RepositorySyncService syncService;

    /**
     * Initializes the SCA environment after the application startup.
     * This method is executed automatically after the bean's properties have been set.
     *
     */
    @PostConstruct
    public void runAfterStartup() {
        scaService.initialize();
    }


    @Scheduled(cron = "0 0 1 * * ?") // Every day at 1:00 AM
    public void syncAllRepositories() {
        providerRepository.findAll().forEach(syncService::syncProvider);
    }
    /**
     * Scheduled task that runs every day at 1 AM.
     * This method fetches cloud vulnerability findings from Cloud Scanner.
     */
    @Scheduled(cron = "0 0 1 * * ?")
    public void runEveryDayAt1AM() {
        scanManagerService.runCloudScansForAllSubscriptions();
        log.info("[Scheduler] Fetched cloud vulnerability findings.");
    }

    /**
     * Runs every 8 hours from application start.
     * Scans up to MAX_REPOS_TO_SCAN repositories that haven't been scanned
     * in the last DAYS_SINCE_LAST_SCAN days, prioritizing the oldest scans first.
     */
    @Scheduled(initialDelay = 0, fixedDelay = 28_800_000) // 8h in ms; runs again 8h after completion
    public void runNotScannedScans() { // keeping the original name per your request
        List<CodeRepo> allRepos = new ArrayList<>();
        codeRepoRepository.findAll().forEach(allRepos::add);

        // Get repositories that haven't been scanned in the last specified days (sorted oldest-first)
        List<CodeRepo> reposToScan = getReposNotScannedRecently(allRepos);

        // Limit to MAX_REPOS_TO_SCAN repositories
        if (reposToScan.size() > MAX_REPOS_TO_SCAN) {
            reposToScan = reposToScan.subList(0, MAX_REPOS_TO_SCAN);
        }

        log.info("[Scheduler] Starting scan for {} repositories not scanned in the last {} days",
                reposToScan.size(), DAYS_SINCE_LAST_SCAN);

        // You can drop this executor entirely and just call scanManagerService directly;
        // leaving it as-is is fine since we're only submitting <= 10 tasks.
        ExecutorService executorService = Executors.newFixedThreadPool(THREAD_POOL_SIZE);

        try {
            List<Future<?>> futures = new ArrayList<>();

            reposToScan.forEach(repo -> {
                Future<?> future = executorService.submit(() -> {
                    // default branch + no specific commit/MR
                    scanManagerService.scanRepository(repo, repo.getDefaultBranch(), null, null);
                });
                futures.add(future);
            });

            // Wait for all tasks submitted by this scheduler to dispatch
            for (Future<?> f : futures) {
                try {
                    f.get();
                } catch (Exception e) {
                    log.warn("[Scheduler] Scan dispatch failed for a repository", e);
                }
            }

            log.info("[Scheduler] Completed dispatching scans for {} repositories", reposToScan.size());
        } finally {
            executorService.shutdown();
        }
    }

    /**
     * Finds repositories that haven't been scanned in the last DAYS_SINCE_LAST_SCAN days
     * and sorts them by their last scan date, with the oldest scans first.
     *
     * @param allRepos List of all repositories
     * @return List of repositories that haven't been scanned recently, sorted by scan date (oldest first)
     */
    private List<CodeRepo> getReposNotScannedRecently(List<CodeRepo> allRepos) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(DAYS_SINCE_LAST_SCAN);

        // Create a map of repositories to their most recent scan date
        Map<CodeRepo, LocalDateTime> repoToLastScanDate = new HashMap<>();

        for (CodeRepo repo : allRepos) {
            List<ScanInfo> scanInfos = findScanInfoService.findScanInfoByRepo(repo);
            if (scanInfos != null && !scanInfos.isEmpty()) {
                // Find the most recent scan date
                LocalDateTime lastScanDate = scanInfos.stream()
                        .map(ScanInfo::getInsertedDate)
                        .max(LocalDateTime::compareTo)
                        .orElse(LocalDateTime.MIN);

                repoToLastScanDate.put(repo, lastScanDate);
            } else {
                // No scan info, treat as never scanned (highest priority)
                repoToLastScanDate.put(repo, LocalDateTime.MIN);
            }
        }

        // Filter out repositories that have been scanned recently

        return allRepos.stream()
                .filter(repo -> {
                    LocalDateTime lastScanDate = repoToLastScanDate.get(repo);
                    return lastScanDate.isBefore(cutoffDate);
                })
                .sorted(Comparator.comparing(repoToLastScanDate::get))
                .collect(Collectors.toList());
    }

    /**
     * Scheduled task that runs every day at 5 AM.
     * This method updates the metadata of all code repositories by retrieving language statistics from the repository.
     *
     * @throws MalformedURLException If an invalid URL is encountered while retrieving repository languages.
     */
    @Scheduled(cron = "0 0 5 * * ?")
    public void runEveryDayAt5AM() throws MalformedURLException {
        Iterable<CodeRepo> codeRepos = codeRepoRepository.findAll();
        for (CodeRepo codeRepo : codeRepos) {
            HashMap<String, Integer> languages = getCodeRepoInfoService.getRepoLanguages(codeRepo).block();

            if (languages != null) {
                for (Map.Entry<String, Integer> entry : languages.entrySet()) {
                    String key = entry.getKey();
                    Integer value = entry.getValue();
                    codeRepo.upsertLanguage(key, value);
                }
                codeRepoRepository.save(codeRepo);
            }
        }
        log.info("[Scheduler] Updated metadata of repositories");
    }

    @Scheduled(initialDelay = 0, fixedRate = 43200000)
    public void processKEV() throws MalformedURLException {
        scanManagerService.processKEV();
    }
}