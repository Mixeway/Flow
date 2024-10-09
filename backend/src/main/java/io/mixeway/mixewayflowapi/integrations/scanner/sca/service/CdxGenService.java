package io.mixeway.mixewayflowapi.integrations.scanner.sca.service;

import ch.qos.logback.core.spi.ScanException;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

/**
 * Service for generating Software Bill of Materials (SBOM) using the cdxgen tool.
 *
 * <p>This service provides methods to generate SBOM files for code repositories
 * by executing the cdxgen command-line tool. It handles process execution,
 * output redirection, timeout management, environment variable configuration,
 * and validation of the generated SBOM file.</p>
 */
@Service
@Log4j2
@RequiredArgsConstructor
public class CdxGenService {

    /**
     * Generates the SBOM (Software Bill of Materials) file using the cdxgen tool.
     *
     * <p>This method executes the cdxgen command in the specified repository directory,
     * redirecting both standard output and error streams to prevent blocking.
     * It conditionally sets environment variables for proxy configuration if the
     * system properties <code>proxy.host</code> and <code>proxy.port</code> are provided.
     * The method waits for the process to complete, with a timeout of 2 minutes.
     * If the process exceeds the timeout, it is forcibly terminated.
     * After the process completes, the method validates the generated <code>bom.json</code>
     * file by checking for its existence and ensuring it has content.</p>
     *
     * @param repoDir        the directory of the repository where cdxgen will run
     * @param codeRepo       the code repository entity
     * @param codeRepoBranch the branch of the code repository
     * @throws IOException          if an I/O error occurs when starting or communicating with the process
     * @throws InterruptedException if the current thread is interrupted while waiting for the process to finish
     * @throws ScanException        if a scanning error occurs (note: not currently thrown in this method)
     */
    public void generateBom(String repoDir, CodeRepo codeRepo, CodeRepoBranch codeRepoBranch)
            throws IOException, InterruptedException {
        log.info("[CdxGen] Starting SBOM generation for: {} branch: {}", codeRepo.getName(), codeRepoBranch.getName());

        // Step 1: Verify if 'pipreqs' command is available
        boolean isPipreqsAvailable = false;
        try {
            ProcessBuilder pbCheckPipreqs = new ProcessBuilder("sh", "-c", "command -v pipreqs");
            pbCheckPipreqs.redirectErrorStream(true);
            Process pCheckPipreqs = pbCheckPipreqs.start();
            int exitCode = pCheckPipreqs.waitFor();
            if (exitCode == 0) {
                isPipreqsAvailable = true;
                log.debug("[CdxGen] 'pipreqs' is available.");
            } else {
                log.debug("[CdxGen] 'pipreqs' is not available.");
            }
        } catch (IOException e) {
            // Command not found
            log.debug("[CdxGen] Exception while checking for 'pipreqs': {}", e.getMessage());
        }

        // Step 2: If available, execute 'pipreqs .' in repoDir
        if (isPipreqsAvailable) {
            log.debug("[CdxGen] Executing 'pipreqs .' in {}", repoDir);
            ProcessBuilder pbPipreqs = new ProcessBuilder("pipreqs", ".");
            pbPipreqs.directory(new File(repoDir));
            pbPipreqs.redirectOutput(ProcessBuilder.Redirect.INHERIT);
            pbPipreqs.redirectError(ProcessBuilder.Redirect.INHERIT);
            Process pPipreqs = pbPipreqs.start();

            // Wait for 'pipreqs' to finish
            boolean finished = pPipreqs.waitFor(10, TimeUnit.MINUTES);
            if (!finished) {
                log.debug("[CdxGen] 'pipreqs' did not finish within 10 minutes. Terminating process.");
                pPipreqs.destroyForcibly();
            } else {
                int exitCode = pPipreqs.exitValue();
                if (exitCode != 0) {
                    log.debug("[CdxGen] 'pipreqs' exited with non-zero exit code: {}", exitCode);
                } else {
                    log.debug("[CdxGen] 'pipreqs' executed successfully.");
                }
            }
        }

        // Step 3: Proceed with executing 'cdxgen'
        String proxyHost = System.getProperty("proxy.host");
        String proxyPort = System.getProperty("proxy.port");
        String command;

        if (proxyHost != null && proxyPort != null) {
            // Construct the command with environment variables inline
            command = "HTTP_PROXY=http://" + proxyHost + ":" + proxyPort + " "
                    + "HTTPS_PROXY=http://" + proxyHost + ":" + proxyPort + " "
                    + "cdxgen -o sbom.json";
            log.info("[CdxGen] Proxy settings applied: {}:{}", proxyHost, proxyPort);
        } else {
            command = "cdxgen -o sbom.json";
        }

        // Use 'sh -c' to execute the command in a shell
        ProcessBuilder pb = new ProcessBuilder("sh", "-c", command);
        pb.directory(new File(repoDir));
        pb.redirectOutput(ProcessBuilder.Redirect.PIPE);
        pb.redirectError(ProcessBuilder.Redirect.PIPE);

        Process process = pb.start();

        ExecutorService executorService = Executors.newFixedThreadPool(2);

        try {
            // Stream Gobbler for Standard Output
            executorService.submit(() -> {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                    String line;
                    while (!Thread.currentThread().isInterrupted() && (line = reader.readLine()) != null) {
                        // Optionally process the output
                    }
                } catch (IOException e) {
                    log.error("[CdxGen] Error reading standard output stream", e);
                }
            });

            // Stream Gobbler for Error Output
            executorService.submit(() -> {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                    String line;
                    while (!Thread.currentThread().isInterrupted() && (line = reader.readLine()) != null) {
                        // Optionally process the error output
                    }
                } catch (IOException e) {
                    log.error("[CdxGen] Error reading error output stream", e);
                }
            });

            // Wait for 'cdxgen' to finish with a timeout of 30 minutes
            boolean finished = process.waitFor(30, TimeUnit.MINUTES);
            if (!finished) {
                log.warn("[CdxGen] SBOM generation did not finish within 30 minutes. Terminating process.");
                process.destroyForcibly();
                boolean terminated = process.waitFor(1, TimeUnit.MINUTES);
                if (!terminated) {
                    log.error("[CdxGen] Process could not be terminated gracefully.");
                }
            } else {
                int exitCode = process.exitValue();
                if (exitCode != 0) {
                    log.warn("[CdxGen] SBOM generation process exited with non-zero exit code: {}", exitCode);
                }
            }

        } finally {
            executorService.shutdownNow();
            if (process.isAlive()) {
                log.warn("[CdxGen] Process is still alive after termination attempt. Forcibly destroying it.");
                process.destroyForcibly();
            }
        }

        // Validate the 'sbom.json' file
        File bomFile = new File(repoDir, "sbom.json");
        if (bomFile.exists()) {
            if (bomFile.length() > 0) {
                log.info("[CdxGen] SBOM generated successfully: {}", bomFile.getAbsolutePath());
            } else {
                log.warn("[CdxGen] SBOM file is empty: {}", bomFile.getAbsolutePath());
            }
        } else {
            log.warn("[CdxGen] SBOM file not found: {}", bomFile.getAbsolutePath());
        }
    }



}
