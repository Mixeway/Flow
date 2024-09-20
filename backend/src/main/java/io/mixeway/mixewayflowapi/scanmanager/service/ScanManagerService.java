package io.mixeway.mixewayflowapi.scanmanager.service;

import ch.qos.logback.core.spi.ScanException;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.domain.coderepo.UpdateCodeRepoService;
import io.mixeway.mixewayflowapi.integrations.repo.service.GitCommentService;
import io.mixeway.mixewayflowapi.integrations.repo.service.GitService;
import io.mixeway.mixewayflowapi.integrations.scanner.iac.service.IaCService;
import io.mixeway.mixewayflowapi.integrations.scanner.sast.service.SASTService;
import io.mixeway.mixewayflowapi.integrations.scanner.sca.service.SCAService;
import io.mixeway.mixewayflowapi.integrations.scanner.secrets.service.SecretsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Service for managing and orchestrating code repository scans.
 */
@Service
@Log4j2
@RequiredArgsConstructor
public class ScanManagerService {

    private final GitService gitService;
    private final SecretsService secretsService;
    private final IaCService iaCService;
    private final SASTService sastService;
    private final ConcurrentHashMap<Long, Boolean> scanningRepos = new ConcurrentHashMap<>();
    private final UpdateCodeRepoService updateCodeRepoService;
    private final SCAService scaService;
    private final GitCommentService gitCommentService;

    private final Semaphore semaphore = new Semaphore(5); // Limit concurrent scans to 5
    private final ConcurrentHashMap<Long, Lock> repoLocks = new ConcurrentHashMap<>(); // Ensure no parallel scans for the same repo


    private final ExecutorService executorService = new ThreadPoolExecutor(
            5, 5, 0L, TimeUnit.MILLISECONDS,
            new LinkedBlockingQueue<>(100),
            Executors.defaultThreadFactory(),
            new ThreadPoolExecutor.CallerRunsPolicy()
    );

    /**
     * Asynchronously initiates a scan for a given repository and branch.
     *
     * @param codeRepo The code repository to scan.
     * @param codeRepoBranch The branch of the code repository to scan.
     * @param commitId The commit ID to scan. If null, the latest commit on the branch will be scanned.
     * @throws IOException If an I/O error occurs during scanning.
     * @throws InterruptedException If the scan is interrupted.
     * @throws ScanException If a scanning error occurs.
     */
    @Async
    public void scanRepository(CodeRepo codeRepo, CodeRepoBranch codeRepoBranch, String commitId, Long iid)
            throws IOException, InterruptedException, ScanException {

        updateCodeRepoService.setScanRunning(codeRepo);
        // Acquire a lock specific to the codeRepo
        Lock lock = repoLocks.computeIfAbsent(codeRepo.getId(), k -> new ReentrantLock());

        executorService.submit(() -> {
            String repoDir = "/tmp/" + codeRepo.getName();
            String commit = "";
            AtomicBoolean scaScanPerformed = new AtomicBoolean(false);

            try {
                semaphore.acquire(); // Acquire a permit to limit concurrency
                lock.lock(); // Ensure no parallel scans for the same repo

                log.info("[ScanManagerService] Starting scan for {} with branch {}", codeRepo.getRepourl(), codeRepoBranch.getName());

                validateInputs(codeRepo, codeRepoBranch);

                String repoUrl = codeRepo.getRepourl();
                String accessToken = codeRepo.getAccessToken();

                // Clone or fetch the repository
                commit = fetchRepository(commitId, repoUrl, accessToken, codeRepoBranch, repoDir);

                // Run scans in parallel
                CompletableFuture<Void> secretScan = runSecretScan(repoDir, codeRepo, codeRepoBranch);
                CompletableFuture<Void> scaScan = runSCAScan(repoDir, codeRepo, codeRepoBranch, scaScanPerformed);
                CompletableFuture<Void> sastScan = runSASTScan(repoDir, codeRepo, codeRepoBranch);
                CompletableFuture<Void> iacScan = runIACScan(repoDir, codeRepo, codeRepoBranch);

                // Wait for all scans to complete
                CompletableFuture<Void> allScans = CompletableFuture.allOf(secretScan, scaScan, sastScan, iacScan);

                // Add the completion stage to ensure cleanup and status update
                String finalCommit = commit;
                allScans.whenComplete((result, ex) -> {
                    if (ex != null) {
                        log.error("[ScanManagerService] Problem with scan: {}", ex.getMessage(), ex);
                    }

                    try {
                        updateCodeRepoService.updateCodeRepoStatus(codeRepo, codeRepoBranch, scaScanPerformed.get(), finalCommit);
                    } catch (Exception updateEx) {
                        log.error("[ScanManagerService] Failed to update CodeRepo status for {}: {}", codeRepo.getName(), updateEx.getMessage(), updateEx);
                    }

                    try {
                        cleanUp(repoDir);
                    } catch (IOException cleanupEx) {
                        log.error("[ScanManagerService] Failed to clean up repository directory {}: {}", repoDir, cleanupEx.getMessage(), cleanupEx);
                    }
                }).join(); // Ensure this step waits for completion before continuing

            } catch (InterruptedException | IOException e) {
                log.error("[ScanManagerService] Scan for repo {} was interrupted: {}", codeRepo.getName(), e.getMessage());
                Thread.currentThread().interrupt();
            } finally {
                lock.unlock(); // Ensure the lock is released
                semaphore.release(); // Release the semaphore permit
                repoLocks.remove(codeRepo.getId()); // Clean up the lock from the map if no longer needed
                if (iid != null && iid > 0){
                    try {
                        gitCommentService.processMergeComment(codeRepo, codeRepoBranch, iid);
                    } catch (MalformedURLException e) {
                        log.error("[Scan Service] Unable to process Merge request - {}", e.getLocalizedMessage());
                    }
                }
            }
        });
    }


    /**
     * Validates the provided inputs for the scan.
     *
     * @param codeRepo The code repository.
     * @param codeRepoBranch The branch of the code repository.
     */
    private void validateInputs(CodeRepo codeRepo, CodeRepoBranch codeRepoBranch) {
        if (codeRepo == null || codeRepoBranch == null) {
            throw new IllegalArgumentException("CodeRepo and CodeRepoBranch must be provided");
        }
    }

    /**
     * Fetches the repository based on the provided commit ID or branch.
     *
     * @param commitId The commit ID.
     * @param repoUrl The repository URL.
     * @param accessToken The access token for the repository.
     * @param codeRepoBranch The branch to fetch.
     * @param repoDir The directory to store the repository.
     * @throws IOException If an I/O error occurs.
     * @throws InterruptedException If the operation is interrupted.
     */
    private String fetchRepository(String commitId, String repoUrl, String accessToken,
                                 CodeRepoBranch codeRepoBranch, String repoDir)
            throws IOException, InterruptedException {
        if (commitId == null) {
            commitId = gitService.fetchBranch(repoUrl, accessToken, codeRepoBranch, repoDir);
        } else {
            gitService.fetchCommit(repoUrl, accessToken, commitId, repoDir);
            gitService.checkoutCommit(repoDir, commitId);
        }
        return commitId;
    }

    /**
     * Runs the Secret scan asynchronously.
     *
     * @param repoDir The repository directory.
     * @param codeRepo The code repository.
     * @param codeRepoBranch The branch of the code repository.
     * @return A CompletableFuture representing the asynchronous operation.
     */
    private CompletableFuture<Void> runSecretScan(String repoDir, CodeRepo codeRepo, CodeRepoBranch codeRepoBranch) {
        return CompletableFuture.runAsync(() -> {
            log.info("[ScanManagerService] Starting Secret scan... [for: {}]", repoDir);
            try {
                secretsService.runGitleaks(repoDir, codeRepo, codeRepoBranch);
            } catch (IOException | InterruptedException e) {
                log.error("[ScanManagerService] An error occurred during Secret scan for {}.", codeRepo.getRepourl());
            }
        });
    }

    /**
     * Runs the SCA scan asynchronously.
     *
     * @param repoDir The repository directory.
     * @param codeRepo The code repository.
     * @param codeRepoBranch The branch of the code repository.
     * @param scaScanPerformed The AtomicBoolean to track if the SCA scan was performed.
     * @return A CompletableFuture representing the asynchronous operation.
     */
    private CompletableFuture<Void> runSCAScan(String repoDir, CodeRepo codeRepo,
                                               CodeRepoBranch codeRepoBranch, AtomicBoolean scaScanPerformed) {
        return CompletableFuture.runAsync(() -> {
            log.info("[ScanManagerService] Starting SCA scan... [for: {}]", repoDir);
            try {
                scaScanPerformed.set(scaService.runScan(repoDir, codeRepo, codeRepoBranch));
            } catch (IOException | InterruptedException e) {
                log.error("[ScanManagerService] An error occurred during SCA scan for {}.", codeRepo.getRepourl());
            }
        });
    }

    /**
     * Runs the SAST scan asynchronously.
     *
     * @param repoDir The repository directory.
     * @param codeRepo The code repository.
     * @param codeRepoBranch The branch of the code repository.
     * @return A CompletableFuture representing the asynchronous operation.
     */
    private CompletableFuture<Void> runSASTScan(String repoDir, CodeRepo codeRepo, CodeRepoBranch codeRepoBranch) {
        return CompletableFuture.runAsync(() -> {
            log.info("[ScanManagerService] Starting SAST scan... [for: {}]", repoDir);
            try {
                sastService.runBearerScan(repoDir, codeRepo, codeRepoBranch);
            } catch (IOException | InterruptedException | ScanException e) {
                e.printStackTrace();
                log.error("[ScanManagerService] An error occurred during SAST scan for {}.", codeRepo.getRepourl());
            }
        });
    }

    /**
     * Runs the IAC scan asynchronously.
     *
     * @param repoDir The repository directory.
     * @param codeRepo The code repository.
     * @param codeRepoBranch The branch of the code repository.
     * @return A CompletableFuture representing the asynchronous operation.
     */
    private CompletableFuture<Void> runIACScan(String repoDir, CodeRepo codeRepo, CodeRepoBranch codeRepoBranch) {
        return CompletableFuture.runAsync(() -> {
            log.info("[ScanManagerService] Starting IAC scan... [for: {}]", repoDir);
            try {
                iaCService.runKics(repoDir, codeRepo, codeRepoBranch);
            } catch (IOException | InterruptedException | ScanException e) {
                log.error("[ScanManagerService] An error occurred during IAC scan for {}.", codeRepo.getRepourl());
            }
        });
    }

    /**
     * Waits for all scan tasks to complete.
     *
     * @param secretScan     The Secret scan task.
     * @param sastScan       The SAST scan task.
     * @param iacScan        The IAC scan task.
     * @param scaScan        The SCA scan task.
     * @param codeRepo
     * @param codeRepoBranch
     * @param b
     * @param commit
     * @throws InterruptedException If the waiting is interrupted.
     * @throws ExecutionException   If an error occurs during the execution of a task.
     */
    private void waitForScans(CompletableFuture<Void> secretScan, CompletableFuture<Void> sastScan,
                              CompletableFuture<Void> iacScan, CompletableFuture<Void> scaScan, CodeRepo codeRepo, CodeRepoBranch codeRepoBranch, boolean b, String commit)
            throws InterruptedException, ExecutionException {
        CompletableFuture<Void> allScans = CompletableFuture.allOf(secretScan, sastScan, iacScan, scaScan);
        allScans.get();
        log.info("[ScanManagerService] All scans completed successfully.");
    }

    /**
     * Cleans up the repository directory after scanning.
     *
     * @param repoDir The repository directory to clean up.
     * @throws IOException If an I/O error occurs during cleanup.
     */
    private void cleanUp(String repoDir) throws IOException {
        File dir = new File(repoDir);
        if (dir.exists()) {
            deleteDirectory(dir);
            log.info("[ScanManagerService] Successfully cleaned up directory: {}", repoDir);
        } else {
            log.warn("[ScanManagerService] Directory does not exist: {}", repoDir);
        }
    }

    /**
     * Recursively deletes a directory and its contents.
     *
     * @param dir The directory to delete.
     * @throws IOException If an I/O error occurs during deletion.
     */
    private void deleteDirectory(File dir) throws IOException {
        if (dir.isDirectory()) {
            File[] files = dir.listFiles();
            if (files != null) {
                for (File file : files) {
                    deleteDirectory(file);
                }
            }
        }
        if (!dir.delete()) {
            throw new IOException("Failed to delete file or directory: " + dir.getAbsolutePath());
        }
    }
}
