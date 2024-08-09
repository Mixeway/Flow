package io.mixeway.mixewayflowapi.scanmanager.scheduler;

import ch.qos.logback.core.spi.ScanException;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoRepository;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.domain.coderepobranch.GetOrCreateCodeRepoBranchService;
import io.mixeway.mixewayflowapi.domain.settings.FindSettingsService;
import io.mixeway.mixewayflowapi.integrations.repo.service.GetCodeRepoInfoService;
import io.mixeway.mixewayflowapi.integrations.scanner.sca.apiclient.DependencyTrackApiClientService;
import io.mixeway.mixewayflowapi.integrations.scanner.sca.service.SCAService;
import io.mixeway.mixewayflowapi.scanmanager.service.ScanManagerService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
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

@Service
@RequiredArgsConstructor
@Log4j2
public class ScanScheduler {
    private final CodeRepoRepository codeRepoRepository;
    private final ScanManagerService scanManagerService;
    private final GetOrCreateCodeRepoBranchService getOrCreateCodeProjectBranchService;
    private final SCAService scaService;
    private final DependencyTrackApiClientService dependencyTrackApiClientService;
    private final FindSettingsService findSettingsService;
    private static final int THREAD_POOL_SIZE = 5; // Adjust the pool size as needed
    private final FindCodeRepoService findCodeRepoService;
    private final GetCodeRepoInfoService getCodeRepoInfoService;


    @PostConstruct
    public void runAfterStartup() throws IOException, InterruptedException, ScanException, URISyntaxException {
        scaService.initialize();
    }

    @Scheduled(cron = "0 0 3 * * ?")
    public void runEveryDayAt3AM() {
        Iterable<CodeRepo> codeRepos = codeRepoRepository.findAll();
        ExecutorService executorService = Executors.newFixedThreadPool(THREAD_POOL_SIZE);

        try {
            List<Future<?>> futures = new ArrayList<>();
            codeRepos.forEach(repo -> {
                Future<?> future = executorService.submit(() -> {
                    try {
                        scanManagerService.scanRepository(repo, repo.getDefaultBranch(), null);
                    } catch (IOException | InterruptedException e) {
                        log.error("Error scanning repository: {}", repo.getName(), e);
                    } catch (ScanException e) {
                        throw new RuntimeException(e);
                    }
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
