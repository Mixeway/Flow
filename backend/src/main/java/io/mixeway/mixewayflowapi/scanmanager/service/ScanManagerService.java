package io.mixeway.mixewayflowapi.scanmanager.service;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.Vulnerability;
import io.mixeway.mixewayflowapi.domain.coderepo.UpdateCodeRepoService;
import io.mixeway.mixewayflowapi.domain.vulnerability.FindVulnerabilityService;
import io.mixeway.mixewayflowapi.domain.vulnerability.UpdateVulnerabilityService;
import io.mixeway.mixewayflowapi.integrations.repo.service.GitCommentService;
import io.mixeway.mixewayflowapi.integrations.repo.service.GitService;
import io.mixeway.mixewayflowapi.integrations.scanner.iac.service.IaCService;
import io.mixeway.mixewayflowapi.integrations.scanner.sast.service.SASTService;
import io.mixeway.mixewayflowapi.integrations.scanner.sca.apiclient.KEVApiClient;
import io.mixeway.mixewayflowapi.integrations.scanner.sca.dto.CatalogDto;
import io.mixeway.mixewayflowapi.integrations.scanner.sca.dto.VulnerabilityDto;
import io.mixeway.mixewayflowapi.integrations.scanner.sca.service.SCAService;
import io.mixeway.mixewayflowapi.integrations.scanner.secrets.service.SecretsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.function.Function;
import java.util.stream.Collectors;

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
    private final KEVApiClient kevApiClient;
    private final UpdateVulnerabilityService updateVulnerabilityService;

    private final int maxConcurrentScans = 10; // Maximum number of concurrent scans
    private final Semaphore semaphore = new Semaphore(maxConcurrentScans); // Limit concurrent scans
    //private final ConcurrentHashMap<Long, Lock> repoLocks = new ConcurrentHashMap<>(); // Ensure no parallel scans for the same repo
    private final ConcurrentHashMap<Long, Object> repoLocks = new ConcurrentHashMap<>();

    private final ExecutorService executorService = Executors.newFixedThreadPool(10);
    private final ExecutorService scanExecutorService = Executors.newFixedThreadPool(10);
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    // Counters for tracking parallel scans
    private final AtomicInteger totalScansRunning = new AtomicInteger(0);
    private final AtomicInteger sastScansRunning = new AtomicInteger(0);
    private final AtomicInteger scaScansRunning = new AtomicInteger(0);
    private final AtomicInteger iacScansRunning = new AtomicInteger(0);
    private final AtomicInteger secretScansRunning = new AtomicInteger(0);
    private final FindVulnerabilityService findVulnerabilityService;

    // Throttling cache: Repositories being scanned or scanned within the last 30 minutes
    private final Cache<Long, Boolean> scanThrottler = Caffeine.newBuilder()
            .expireAfterWrite(30, TimeUnit.MINUTES)
            .build();



    /**
     * Initiates a scan for a given repository and branch.
     * Implements throttling to prevent multiple scans within 5 minutes.
     *
     * @param codeRepo       The code repository to scan.
     * @param codeRepoBranch The branch of the code repository to scan.
     * @param commitId       The commit ID to scan. If null, the latest commit on the branch will be scanned.
     * @param iid            Optional merge request IID for processing merge comments.
     */
    public void scanRepository(CodeRepo codeRepo, CodeRepoBranch codeRepoBranch, String commitId, Long iid) {
        // Get or create a lock object for the repository
        Object repoLock = repoLocks.computeIfAbsent(codeRepo.getId(), k -> new Object());

        synchronized (repoLock) {
            // Check if a scan is already running or was run within the last 5 minutes
            Boolean existing = scanThrottler.getIfPresent(codeRepo.getId());
            if (existing != null) {
                log.info("[ScanManagerService] Scan for repo {} is already running or was run within the last 5 minutes. Ignoring request.", codeRepo.getName());
                return;
            }

            // Add repository to the throttler cache
            scanThrottler.put(codeRepo.getId(), Boolean.TRUE);
        }

        // Submit the scan task to the executor service
        executorService.submit(() -> {
            try {
                // Set scan running status
                updateCodeRepoService.setScanRunning(codeRepo);

                String repoDir = "/tmp/" + codeRepo.getName();
                String commit = "";
                AtomicBoolean scaScanPerformed = new AtomicBoolean(false);
                Future<?> timeoutFuture = null;

                try {
                    log.info("[ScanManagerService] Starting scan for {} with branch {}", codeRepo.getRepourl(), codeRepoBranch.getName());

                    validateInputs(codeRepo, codeRepoBranch);

                    String repoUrl = codeRepo.getRepourl();
                    String accessToken = codeRepo.getAccessToken();

                    // Clone or fetch the repository
                    commit = fetchRepository(commitId, repoUrl, accessToken, codeRepoBranch, repoDir);

                    // Run scans in parallel
                    Future<Void> secretScanFuture = runSecretScan(repoDir, codeRepo, codeRepoBranch);
                    Future<Void> scaScanFuture = runSCAScan(repoDir, codeRepo, codeRepoBranch, scaScanPerformed);
                    Future<Void> sastScanFuture = runSASTScan(repoDir, codeRepo, codeRepoBranch);
                    Future<Void> iacScanFuture = runIACScan(repoDir, codeRepo, codeRepoBranch);

                    List<Future<Void>> scanFutures = Arrays.asList(secretScanFuture, scaScanFuture, sastScanFuture, iacScanFuture);

                    // Schedule a timeout task to cancel scans
                    ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
                    timeoutFuture = scheduler.schedule(() -> {
                        // Cancel the scans
                        for (Future<Void> future : scanFutures) {
                            future.cancel(true);
                        }
                        log.error("[ScanManagerService] Scan timed out for repo {}.", codeRepo.getName());
                    }, 2, TimeUnit.HOURS);

                    // Wait for all scans to complete
                    for (Future<Void> future : scanFutures) {
                        try {
                            future.get(); // Wait for scan to complete
                        } catch (CancellationException ce) {
                            log.warn("[ScanManagerService] Scan task was cancelled.");
                        } catch (InterruptedException ie) {
                            log.warn("[ScanManagerService] Scan task was interrupted.");
                            Thread.currentThread().interrupt();
                        } catch (ExecutionException ee) {
                            log.error("[ScanManagerService] Exception during scan task: {}", ee.getMessage(), ee);
                        }
                    }

                    // If scans completed before timeout, cancel the timeout task
                    if (timeoutFuture != null && !timeoutFuture.isDone()) {
                        timeoutFuture.cancel(false);
                    }

                } catch (Exception e) {
                    log.error("[ScanManagerService] Exception during scan: {}", e.getMessage(), e);
                } finally {
                    // Update status
                    try {
                        updateCodeRepoService.updateCodeRepoStatus(codeRepo, codeRepoBranch, scaScanPerformed.get(), commit);
                    } catch (Exception updateEx) {
                        log.error("[ScanManagerService] Failed to update CodeRepo status for {}: {}", codeRepo.getName(), updateEx.getMessage(), updateEx);
                    }

                    // Clean up
                    try {
                        cleanUp(repoDir);
                    } catch (IOException cleanupEx) {
                        log.error("[ScanManagerService] Failed to clean up repository directory {}: {}", repoDir, cleanupEx.getMessage(), cleanupEx);
                    }

                    if (iid != null && iid > 0) {
                        try {
                            gitCommentService.processMergeComment(codeRepo, codeRepoBranch, iid);
                        } catch (MalformedURLException e) {
                            log.error("[Scan Service] Unable to process Merge request - {}", e.getLocalizedMessage());
                        }
                    }
                }
            } finally {
                // Remove the repository from the locks map
                repoLocks.remove(codeRepo.getId());
            }
        });
    }

    private Future<Void> runSecretScan(String repoDir, CodeRepo codeRepo, CodeRepoBranch codeRepoBranch) {
        Callable<Void> task = () -> {
            int currentSecretScans = secretScansRunning.incrementAndGet();
            log.info("[ScanManagerService] Starting new Secret scan, parallel Secret scans running {}", currentSecretScans);

            try {
                log.info("[ScanManagerService] Starting Secret scan... [for: {}]", repoDir);
                secretsService.runGitleaks(repoDir, codeRepo, codeRepoBranch);
            } catch (IOException | InterruptedException e) {
                if (Thread.currentThread().isInterrupted()) {
                    log.warn("[ScanManagerService] Secret scan interrupted for {}.", codeRepo.getRepourl());
                    Thread.currentThread().interrupt();
                } else {
                    log.error("[ScanManagerService] An error occurred during Secret scan for {}.", codeRepo.getRepourl());
                }
            } finally {
                int remainingSecretScans = secretScansRunning.decrementAndGet();
                log.debug("[ScanManagerService] Secret scan completed, parallel Secret scans running {}", remainingSecretScans);
            }
            return null;
        };
        return scanExecutorService.submit(task);
    }

    private Future<Void> runSCAScan(String repoDir, CodeRepo codeRepo, CodeRepoBranch codeRepoBranch, AtomicBoolean scaScanPerformed) {
        Callable<Void> task = () -> {
            int currentScaScans = scaScansRunning.incrementAndGet();
            log.info("[ScanManagerService] Starting new SCA scan, parallel SCA scans running {}", currentScaScans);

            try {
                log.info("[ScanManagerService] Starting SCA scan... [for: {}]", repoDir);
                scaScanPerformed.set(scaService.runScan(repoDir, codeRepo, codeRepoBranch));
            } catch (Exception e) {
                if (Thread.currentThread().isInterrupted()) {
                    log.warn("[ScanManagerService] SCA scan interrupted for {}.", codeRepo.getRepourl());
                    Thread.currentThread().interrupt();
                } else {
                    log.error("[ScanManagerService] An error occurred during SCA scan for {} - {}.", codeRepo.getRepourl(), e.getLocalizedMessage());
                    e.printStackTrace();
                }
            } finally {
                int remainingScaScans = scaScansRunning.decrementAndGet();
                log.debug("[ScanManagerService] SCA scan completed, parallel SCA scans running {}", remainingScaScans);
            }
            return null;
        };
        return scanExecutorService.submit(task);
    }

    private Future<Void> runSASTScan(String repoDir, CodeRepo codeRepo, CodeRepoBranch codeRepoBranch) {
        Callable<Void> task = () -> {
            int currentSastScans = sastScansRunning.incrementAndGet();
            log.info("[ScanManagerService] Starting new SAST scan, parallel SAST scans running {}", currentSastScans);

            try {
                log.info("[ScanManagerService] Starting SAST scan... [for: {}]", repoDir);
                sastService.runBearerScan(repoDir, codeRepo, codeRepoBranch);
            } catch (Exception e) {
                if (Thread.currentThread().isInterrupted()) {
                    log.warn("[ScanManagerService] SAST scan interrupted for {}.", codeRepo.getRepourl());
                    Thread.currentThread().interrupt();
                } else {
                    log.error("[ScanManagerService] An error occurred during SAST scan for {}.", codeRepo.getRepourl());
                }
            } finally {
                int remainingSastScans = sastScansRunning.decrementAndGet();
                log.debug("[ScanManagerService] SAST scan completed, parallel SAST scans running {}", remainingSastScans);
            }
            return null;
        };
        return scanExecutorService.submit(task);
    }

    private Future<Void> runIACScan(String repoDir, CodeRepo codeRepo, CodeRepoBranch codeRepoBranch) {
        Callable<Void> task = () -> {
            int currentIacScans = iacScansRunning.incrementAndGet();
            log.info("[ScanManagerService] Starting new IAC scan, parallel IAC scans running {}", currentIacScans);

            try {
                log.info("[ScanManagerService] Starting IAC scan... [for: {}]", repoDir);
                iaCService.runKics(repoDir, codeRepo, codeRepoBranch);
            } catch (Exception e) {
                if (Thread.currentThread().isInterrupted()) {
                    log.warn("[ScanManagerService] IAC scan interrupted for {}.", codeRepo.getRepourl());
                    Thread.currentThread().interrupt();
                } else {
                    log.error("[ScanManagerService] An error occurred during IAC scan for {}.", codeRepo.getRepourl());
                }
            } finally {
                int remainingIacScans = iacScansRunning.decrementAndGet();
                log.debug("[ScanManagerService] IAC scan completed, parallel IAC scans running {}", remainingIacScans);
            }
            return null;
        };
        return scanExecutorService.submit(task);
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

    public void processKEV(){
        CatalogDto catalogDto = kevApiClient.loadKev().block();
        log.info("[KEV] Processing KEV...");
        // Extract all cveIDs from the vulnerabilities in the DTO
        List<String> cveIds = catalogDto.getVulnerabilities().stream()
                .map(VulnerabilityDto::getCveID)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        if (cveIds.isEmpty()) {
            return;
        }

        // Fetch existing vulnerabilities from the database matching the cveIDs
        List<Vulnerability> existingVulnerabilities = findVulnerabilityService.getByNameIn(cveIds);

        // Map cveID to Vulnerability entity for quick lookup
        Map<String, Vulnerability> vulnerabilityMap = existingVulnerabilities.stream()
                .collect(Collectors.toMap(Vulnerability::getName, Function.identity()));

        // Iterate over vulnerabilities in the DTO
        for (VulnerabilityDto vulnerabilityDto : catalogDto.getVulnerabilities()) {
            String cveID = vulnerabilityDto.getCveID();

            if (cveID == null) {
                continue; // Ignore vulnerabilities without cveID
            }

            Vulnerability vulnerability = vulnerabilityMap.get(cveID);

            if (vulnerability != null) {
                // Vulnerability found in database, execute addExploit
                updateVulnerabilityService.addExploit(vulnerability,String.join(",", vulnerabilityDto.getCwes()));
            } else {
                // Vulnerability not found, ignore
                log.debug("Vulnerability with cveID {} not found in database.", cveID);
            }
        }
        log.info("[KEV] Done processing KEV...");

    }
}
