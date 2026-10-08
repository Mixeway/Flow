package io.mixeway.mixewayflowapi.api.coderepo.service;

import io.mixeway.mixewayflowapi.api.coderepo.dto.InactiveTokenCheckStatusDto;
import io.mixeway.mixewayflowapi.api.coderepo.dto.InactiveTokenCheckStatusDto.State;
import io.mixeway.mixewayflowapi.api.coderepo.dto.InactiveTokenReportDto;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.domain.coderepo.FindCodeRepoService;
import io.mixeway.mixewayflowapi.integrations.repo.service.GitService;
import io.mixeway.mixewayflowapi.integrations.repo.service.GitService.RemoteAccessStatus;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@Log4j2
@RequiredArgsConstructor
public class InactiveTokenService {

    private static final int PARALLEL_CHECKS = 8;
    private static final long CHECK_TIMEOUT_SECONDS = 30;

    private final FindCodeRepoService findCodeRepoService;
    private final GitService gitService;
    private final TransactionTemplate transactionTemplate;

    private final ExecutorService jobExecutor = Executors.newSingleThreadExecutor(r -> {
        Thread thread = new Thread(r, "inactive-token-check");
        thread.setDaemon(true);
        return thread;
    });
    private final AtomicInteger checkedCount = new AtomicInteger();
    private volatile int totalCount;
    private volatile InactiveTokenCheckStatusDto status = InactiveTokenCheckStatusDto.idle();

    private record RepoToCheck(long id, String name, String repoUrl, String accessToken,
                               CodeRepo.RepoType type, long teamId, String teamName) {
    }

    private record CheckResult(RepoToCheck repo, RemoteAccessStatus status) {
    }

    /**
     * Starts a background check of all repositories. If a check is already running, it is not started again
     * and the status of the running check is returned instead.
     */
    public synchronized InactiveTokenCheckStatusDto startCheck(String requestedBy) {
        if (status.state() == State.RUNNING) {
            return getStatus();
        }
        checkedCount.set(0);
        totalCount = 0;
        status = new InactiveTokenCheckStatusDto(State.RUNNING, requestedBy, Instant.now(), null, 0, 0, null);
        jobExecutor.submit(this::runCheck);
        return getStatus();
    }

    public InactiveTokenCheckStatusDto getStatus() {
        InactiveTokenCheckStatusDto current = status;
        if (current.state() == State.RUNNING) {
            return current.withProgress(checkedCount.get(), totalCount);
        }
        return current;
    }

    @PreDestroy
    void shutdown() {
        jobExecutor.shutdownNow();
    }

    private void runCheck() {
        InactiveTokenCheckStatusDto running = status;
        try {
            InactiveTokenReportDto report = checkAllRepositories();
            status = new InactiveTokenCheckStatusDto(State.DONE, running.requestedBy(), running.startedAt(), Instant.now(),
                    report.checkedRepositories(), report.checkedRepositories(), report);
        } catch (Exception e) {
            log.error("[InactiveToken] Inactive access token check failed: {}", e.getMessage());
            status = new InactiveTokenCheckStatusDto(State.FAILED, running.requestedBy(), running.startedAt(), Instant.now(),
                    checkedCount.get(), totalCount, null);
        }
    }

    private InactiveTokenReportDto checkAllRepositories() {
        List<RepoToCheck> repos = transactionTemplate.execute(tx -> {
            List<RepoToCheck> loaded = new ArrayList<>();
            for (CodeRepo repo : findCodeRepoService.findAll()) {
                loaded.add(new RepoToCheck(repo.getId(), repo.getName(), repo.getRepourl(), repo.getAccessToken(),
                        repo.getType(), repo.getTeam().getId(), repo.getTeam().getName()));
            }
            return loaded;
        });
        totalCount = repos.size();

        List<CheckResult> results = new ArrayList<>();
        try (ExecutorService executor = Executors.newFixedThreadPool(PARALLEL_CHECKS)) {
            List<Future<CheckResult>> futures = new ArrayList<>();
            for (RepoToCheck repo : repos) {
                futures.add(executor.submit(() -> {
                    try {
                        return new CheckResult(repo,
                                gitService.checkRemoteAccess(repo.repoUrl(), repo.accessToken(), repo.type(), CHECK_TIMEOUT_SECONDS));
                    } finally {
                        checkedCount.incrementAndGet();
                    }
                }));
            }
            for (Future<CheckResult> future : futures) {
                try {
                    results.add(future.get());
                } catch (ExecutionException e) {
                    log.warn("[InactiveToken] Token check failed: {}", e.getCause().getMessage());
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        }

        Map<Long, List<CheckResult>> failedByTeam = new HashMap<>();
        int inactive = 0;
        int unverified = 0;
        for (CheckResult result : results) {
            switch (result.status()) {
                case VALID -> {
                    continue;
                }
                case UNREACHABLE -> unverified++;
                default -> inactive++;
            }
            failedByTeam.computeIfAbsent(result.repo().teamId(), k -> new ArrayList<>()).add(result);
        }

        List<InactiveTokenReportDto.TeamEntry> teams = failedByTeam.values().stream()
                .map(teamResults -> new InactiveTokenReportDto.TeamEntry(
                        teamResults.get(0).repo().teamId(),
                        teamResults.get(0).repo().teamName(),
                        teamResults.stream()
                                .sorted(Comparator.comparing(r -> r.repo().name(), String.CASE_INSENSITIVE_ORDER))
                                .map(r -> new InactiveTokenReportDto.RepoEntry(
                                        r.repo().id(), r.repo().name(), r.repo().repoUrl(),
                                        r.repo().type().name(), r.status().name()))
                                .toList()))
                .sorted(Comparator.comparing(InactiveTokenReportDto.TeamEntry::teamName, String.CASE_INSENSITIVE_ORDER))
                .toList();

        log.info("[InactiveToken] Checked {} repositories: {} with inactive token, {} unverified",
                repos.size(), inactive, unverified);
        return new InactiveTokenReportDto(repos.size(), inactive, unverified, teams);
    }
}
