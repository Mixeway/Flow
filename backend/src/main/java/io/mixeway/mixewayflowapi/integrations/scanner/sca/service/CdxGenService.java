package io.mixeway.mixewayflowapi.integrations.scanner.sca.service;

import ch.qos.logback.core.spi.ScanException;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Map;
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
public class CdxGenService {

    /**
     * Prepended to {@code PATH} for cdxgen and related subprocesses so the same JVM
     * can resolve {@code mvn}, {@code npm}, {@code gradle}, etc. as in an interactive shell
     * (e.g. {@code /opt/tools/bin:/usr/local/bin} in Docker).
     */
    @Value("${scan.subprocess.path-extra:}")
    private String pathExtra;

    /**
     * If set, exported as {@code JAVA_HOME} for subprocesses when the environment
     * does not already define it. Otherwise {@code java.home} of the running JVM is used
     * when {@code JAVA_HOME} is missing (helps Maven/Gradle invoked by cdxgen).
     */
    @Value("${scan.subprocess.java-home:}")
    private String javaHomeOverride;

    /**
     * When true (default), runs {@code pipreqs .} before cdxgen if {@code pipreqs} is on {@code PATH}.
     * Set to false to match a manual {@code cdxgen} run and avoid overwriting {@code requirements.txt}.
     */
    @Value("${scan.cdxgen.run-pipreqs:true}")
    private boolean runPipreqs;

    @Value("${proxy.host:#{null}}")
    private String proxyHost;

    @Value("${proxy.port:#{null}}")
    private Integer proxyPort;

    /**
     * Generates the SBOM (Software Bill of Materials) file using the cdxgen tool.
     *
     * <p>This method executes cdxgen in the specified repository directory with
     * {@link ProcessBuilder#environment()} configured for CDXGEN/CDX_* variables and optional proxy.
     * Optional {@code scan.subprocess.path-extra} widens {@code PATH} so language toolchains
     * match non-interactive vs login-shell setups.</p>
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

        if (runPipreqs) {
            runPipreqsIfAvailable(repoDir);
        }

        ProcessBuilder pb = new ProcessBuilder(
                "cdxgen",
                "--recurse",
                "--required-only",
                "--output",
                "sbom.json",
                "."
        );
        pb.directory(new File(repoDir));
        pb.redirectOutput(ProcessBuilder.Redirect.PIPE);
        pb.redirectError(ProcessBuilder.Redirect.PIPE);

        applyScannerEnvironment(pb);

        Map<String, String> env = pb.environment();
        env.put("CDXGEN_DEBUG_MODE", "debug");
        env.put("CDX_MAVEN_INCLUDE_TEST_SCOPE", "false");

        if (StringUtils.hasText(proxyHost) && proxyPort != null) {
            String proxyUrl = "http://" + proxyHost + ":" + proxyPort;
            env.put("HTTP_PROXY", proxyUrl);
            env.put("HTTPS_PROXY", proxyUrl);
            log.info("[CdxGen] Proxy settings applied: {}:{}", proxyHost, proxyPort);
        }

        Process process = pb.start();

        ExecutorService executorService = Executors.newFixedThreadPool(2);

        try {
            executorService.submit(() -> {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                    String line;
                    while (!Thread.currentThread().isInterrupted() && (line = reader.readLine()) != null) {
                        log.debug("[CdxGen] stdout: {}", line);
                    }
                } catch (IOException e) {
                    log.error("[CdxGen] Error reading standard output stream", e);
                }
            });

            executorService.submit(() -> {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                    String line;
                    while (!Thread.currentThread().isInterrupted() && (line = reader.readLine()) != null) {
                        log.debug("[CdxGen] stderr: {}", line);
                    }
                } catch (IOException e) {
                    log.error("[CdxGen] Error reading error output stream", e);
                }
            });

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

    private void runPipreqsIfAvailable(String repoDir) throws IOException, InterruptedException {
        boolean isPipreqsAvailable = false;
        try {
            ProcessBuilder pbCheckPipreqs = new ProcessBuilder("sh", "-c", "command -v pipreqs");
            applyScannerEnvironment(pbCheckPipreqs);
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
            log.debug("[CdxGen] Exception while checking for 'pipreqs': {}", e.getMessage());
        }

        if (!isPipreqsAvailable) {
            return;
        }

        log.debug("[CdxGen] Executing 'pipreqs .' in {}", repoDir);
        ProcessBuilder pbPipreqs = new ProcessBuilder("pipreqs", ".");
        pbPipreqs.directory(new File(repoDir));
        applyScannerEnvironment(pbPipreqs);
        pbPipreqs.redirectOutput(ProcessBuilder.Redirect.INHERIT);
        pbPipreqs.redirectError(ProcessBuilder.Redirect.INHERIT);
        Process pPipreqs = pbPipreqs.start();

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

    /**
     * Ensures subprocesses see the same toolchains as typical CLI usage: optional {@code PATH}
     * prefix, {@code JAVA_HOME}, and a defined {@code HOME} when missing.
     */
    private void applyScannerEnvironment(ProcessBuilder pb) {
        Map<String, String> env = pb.environment();

        if (StringUtils.hasText(pathExtra)) {
            String path = env.getOrDefault("PATH", "");
            env.put("PATH", pathExtra + File.pathSeparator + path);
            log.debug("[CdxGen] PATH prefix applied (scan.subprocess.path-extra)");
        }

        if (!StringUtils.hasText(env.get("JAVA_HOME"))) {
            if (StringUtils.hasText(javaHomeOverride)) {
                env.put("JAVA_HOME", javaHomeOverride.trim());
            } else {
                String jvmHome = System.getProperty("java.home");
                if (StringUtils.hasText(jvmHome)) {
                    env.put("JAVA_HOME", jvmHome);
                }
            }
        }

        if (!StringUtils.hasText(env.get("HOME"))) {
            String userHome = System.getProperty("user.home");
            if (StringUtils.hasText(userHome)) {
                env.put("HOME", userHome);
            }
        }
    }
}
