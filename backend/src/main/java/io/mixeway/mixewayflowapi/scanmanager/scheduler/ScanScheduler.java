package io.mixeway.mixewayflowapi.scanmanager.scheduler;

import ch.qos.logback.core.spi.ScanException;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoRepository;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.integrations.repo.service.GetCodeRepoInfoService;
import io.mixeway.mixewayflowapi.integrations.scanner.sca.service.SCAService;
import io.mixeway.mixewayflowapi.scanmanager.service.ScanManagerService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.aspectj.apache.bcel.classfile.Code;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

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
    private static final int THREAD_POOL_SIZE = 5; // Adjust the pool size as needed
    private final GetCodeRepoInfoService getCodeRepoInfoService;

    /**
     * Initializes the SCA environment after the application startup.
     * This method is executed automatically after the bean's properties have been set.
     *
     * @throws URISyntaxException If an error occurs related to URI syntax during initialization.
     */
    @PostConstruct
    public void runAfterStartup() {
        scaService.initialize();
    }

    /**
     * Scheduled task that runs every day at 3 AM.
     * This method scans all code repositories concurrently using a fixed thread pool.
     */
    @Scheduled(cron = "0 0 3 * * ?")
    public void runEveryDayAt3AM() {
        Iterable<CodeRepo> codeRepos = codeRepoRepository.findAll();
        ExecutorService executorService = Executors.newFixedThreadPool(THREAD_POOL_SIZE);

        try {
            List<Future<?>> futures = new ArrayList<>();
            codeRepos.forEach(repo -> {
                Future<?> future = executorService.submit(() -> {
                    scanManagerService.scanRepository(repo, repo.getDefaultBranch(), null, null);
                });
                futures.add(future);
            });

            // Wait for all tasks to complete
            for (Future<?> future : futures) {
                try {
                    future.get();
                } catch (Exception e) {
                    log.error("Error waiting for task completion", e);
                }
            }
        } finally {
            executorService.shutdown();
        }
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
            for (Map.Entry<String, Integer> entry : getCodeRepoInfoService.getRepoLanguages(codeRepo).entrySet()) {
                String key = entry.getKey();
                Integer value = entry.getValue();
                codeRepo.upsertLanguage(key, value);
            }
            codeRepoRepository.save(codeRepo);
        }
        log.info("[Scheduler] Updated metadata of repositories");
    }
}
