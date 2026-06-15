package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import ch.qos.logback.core.spi.ScanException;
import com.fasterxml.jackson.core.JsonProcessingException;
import io.mixeway.mixewayflowapi.db.entity.Component;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.domain.appdatatype.CreateAppDataTypeService;
import io.mixeway.mixewayflowapi.domain.coderepo.UpdateCodeRepoService;
import io.mixeway.mixewayflowapi.domain.component.GetOrCreateComponentService;
import io.mixeway.mixewayflowapi.domain.finding.CreateFindingService;
import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.BearerScanDataflow;
import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.BearerScanSecurity;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Service responsible for running Static Application Security Testing (SAST) scans using the Bearer tool.
 * This service initiates the Bearer SAST scan on the specified repository, processes the scan results,
 * and saves any findings or data types identified in the scan.
 */
@Service
@Log4j2
@RequiredArgsConstructor
public class SASTService {

    private final CreateFindingService createFindingService;
    private final CreateAppDataTypeService createAppDataTypeService;

    /** Max number of stderr lines kept for diagnostics when bearer fails. */
    private static final int MAX_ERROR_LINES = 50;

    @Value("${bearer.queries.dir}")
    private String bearerRulesDir;

    /**
     * Runs the Bearer SAST scan on the specified code repository and branch, processes the results,
     * and saves any findings or data types identified in the scan.
     *
     * @param repoDir         The directory of the code repository to scan.
     * @param codeRepo        The code repository entity.
     * @param codeRepoBranch  The branch of the code repository to scan.
     * @throws IOException           If an I/O error occurs during the scan process.
     * @throws InterruptedException  If the scan process is interrupted.
     * @throws ScanException         If the scan fails to produce the required report files.
     */
    public void runBearerScan(String repoDir, CodeRepo codeRepo, CodeRepoBranch codeRepoBranch) throws IOException, InterruptedException, ScanException {
        log.info("[BearerScanService] Starting Bearer scan for repository: {} branch: {}", codeRepo.getName(), codeRepoBranch.getName());
        File securityReportFile = new File(repoDir, "bearer_scan_security.json");
        File dataflowReportFile = new File(repoDir, "bearer_scan_dataflow.json");

        ProcessBuilder securityPb;
        ProcessBuilder dataflowPb;

        // Check if bearerRulesDir is null or empty, and adjust the ProcessBuilder commands accordingly
        if (bearerRulesDir == null || bearerRulesDir.isEmpty()) {
            securityPb = new ProcessBuilder("bearer", "scan", ".", "--scanner=sast", "--skip-path=.git,vendor", "--report=security", "--format=json", "--output=bearer_scan_security.json");
            dataflowPb = new ProcessBuilder("bearer", "scan", ".", "--scanner=sast", "--skip-path=.git,vendor", "--report=dataflow", "--format=json", "--output=bearer_scan_dataflow.json");
        } else {
            securityPb = new ProcessBuilder("bearer", "scan", ".", "--scanner=sast", "--external-rule-dir="+ bearerRulesDir, "--skip-path=.git,vendor", "--report=security", "--format=json", "--output=bearer_scan_security.json");
            dataflowPb = new ProcessBuilder("bearer", "scan", ".", "--scanner=sast", "--external-rule-dir="+ bearerRulesDir, "--skip-path=.git,vendor", "--report=dataflow", "--format=json", "--output=bearer_scan_dataflow.json");
        }
        securityPb.directory(new File(repoDir));
        dataflowPb.directory(new File(repoDir));

        ProcessResult securityResult = runProcess(securityPb);
        ProcessResult dataflowResult = runProcess(dataflowPb);

        // Bearer exit codes: 0 = success/no findings, 1 = success WITH findings (normal),
        // anything else indicates an actual scan error.
        if (isBearerError(securityResult.exitCode)) {
            log.warn("[BearerScanService] Bearer (security report) exited with error code {} for [{} / {}]. Stderr:{}{}",
                    securityResult.exitCode, codeRepo.getRepourl(), codeRepoBranch.getName(), System.lineSeparator(), securityResult.stderr());
        }
        if (isBearerError(dataflowResult.exitCode)) {
            log.warn("[BearerScanService] Bearer (dataflow report) exited with error code {} for [{} / {}]. Stderr:{}{}",
                    dataflowResult.exitCode, codeRepo.getRepourl(), codeRepoBranch.getName(), System.lineSeparator(), dataflowResult.stderr());
        }

        ObjectMapper objectMapper = new ObjectMapper();

        log.info("[BearerScanService] Finished scan, starting processing... - [{} / {}]", codeRepo.getRepourl(), codeRepoBranch.getName());

        // An empty report file is the expected output when bearer finds no issues for a
        // supported language; treat it as "no findings" instead of a parsing failure.
        if (isEmptyReport(securityReportFile)) {
            log.info("[BearerScanService] Empty Bearer security report (no findings) - [{} / {}]", codeRepo.getRepourl(), codeRepoBranch.getName());
            log.info("[BearerScanService] Bearer scan completed for repository: {} branch: {}. Reports saved at: {}, {}", codeRepo.getName(), codeRepoBranch.getName(), securityReportFile.getAbsolutePath(), dataflowReportFile.getAbsolutePath());
            return;
        }

        // When the repository language is not supported (e.g. Kotlin), bearer writes a
        // human-readable message into the output file instead of JSON ("The security report
        // is not yet available for your application."). That is not an error - there is simply
        // nothing to ingest, so log it clearly and stop instead of failing to parse.
        if (!looksLikeJson(securityReportFile)) {
            log.info("[BearerScanService] No SAST report - language likely not supported by Bearer for [{} / {}]. Bearer message: {}",
                    codeRepo.getRepourl(), codeRepoBranch.getName(), previewFile(securityReportFile));
            log.info("[BearerScanService] Bearer scan completed for repository: {} branch: {}. Reports saved at: {}, {}", codeRepo.getName(), codeRepoBranch.getName(), securityReportFile.getAbsolutePath(), dataflowReportFile.getAbsolutePath());
            return;
        }

        try {
            BearerScanSecurity bearerScanSecurity = objectMapper.readValue(securityReportFile, BearerScanSecurity.class);
            BearerScanDataflow bearerScanDataflow = (isEmptyReport(dataflowReportFile) || !looksLikeJson(dataflowReportFile))
                    ? null
                    : objectMapper.readValue(dataflowReportFile, BearerScanDataflow.class);

            // Save findings and update status
            createFindingService.saveFindings(createFindingService.mapBearerScanToFindings(bearerScanSecurity, codeRepo, codeRepoBranch), codeRepoBranch, codeRepo, Finding.Source.SAST, null);

            if (bearerScanDataflow != null && bearerScanDataflow.getDataTypes() != null) {
                createAppDataTypeService.getDataTypesForCodeRepo(codeRepo, bearerScanDataflow);
            }

            log.info("[BearerScanService] Scan results processed successfully - [{} / {}]", codeRepo.getRepourl(), codeRepoBranch.getName());
        } catch (JsonProcessingException e) {
            log.warn("[BearerScanService] Failed to parse Bearer report for [{} / {}]. Security report exit code: {}. Report preview: {}. Bearer stderr:{}{}",
                    codeRepo.getRepourl(), codeRepoBranch.getName(), securityResult.exitCode,
                    previewFile(securityReportFile), System.lineSeparator(), securityResult.stderr());
        }

        log.info("[BearerScanService] Bearer scan completed for repository: {} branch: {}. Reports saved at: {}, {}", codeRepo.getName(), codeRepoBranch.getName(), securityReportFile.getAbsolutePath(), dataflowReportFile.getAbsolutePath());
    }

    /**
     * Runs a process defined by the provided ProcessBuilder. The output and error streams of the process are discarded.
     *
     * @param pb  The ProcessBuilder that defines the process to be run.
     * @throws IOException           If an I/O error occurs during the process execution.
     * @throws InterruptedException  If the process is interrupted while waiting.
     */
    private ProcessResult runProcess(ProcessBuilder pb) throws IOException, InterruptedException {
        pb.redirectOutput(ProcessBuilder.Redirect.PIPE);
        pb.redirectError(ProcessBuilder.Redirect.PIPE);

        Process process = pb.start();

        // Keep the last stderr lines so the real cause is visible if bearer fails.
        List<String> errorLines = Collections.synchronizedList(new ArrayList<>());
        Integer exitCode = null;

        ExecutorService executor = Executors.newFixedThreadPool(2);

        try {
            // Stream gobbler for process output
            executor.submit(() -> {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                    while (!Thread.currentThread().isInterrupted()) {
                        String line = reader.readLine();
                        if (line == null) break;
                        // Optionally process the output
                    }
                } catch (IOException e) {
                    log.error("Error reading process output", e);
                }
            });

            // Stream gobbler for process error - captured for diagnostics
            executor.submit(() -> {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                    while (!Thread.currentThread().isInterrupted()) {
                        String line = reader.readLine();
                        if (line == null) break;
                        if (errorLines.size() < MAX_ERROR_LINES) {
                            errorLines.add(line);
                        }
                    }
                } catch (IOException e) {
                    log.error("Error reading process error", e);
                }
            });

            // Wait for the process to finish with a timeout
            boolean finished = process.waitFor(30, TimeUnit.MINUTES);
            if (!finished) {
                log.warn("[SASTService] Process did not finish within 30 minutes. Terminating process.");
                process.destroyForcibly(); // Terminate the process
                process.waitFor(); // Wait for the process to terminate
            } else {
                exitCode = process.exitValue();
            }
        } finally {
            executor.shutdownNow(); // Shutdown the executor to stop stream gobblers
            if (process.isAlive()) {
                process.destroyForcibly();
            }
        }

        return new ProcessResult(exitCode == null ? -1 : exitCode, new ArrayList<>(errorLines));
    }

    /**
     * Bearer returns exit code 1 when it completes successfully but finds issues, which is
     * normal. Only codes other than 0 and 1 (and the -1 timeout sentinel) signal a real error.
     */
    private boolean isBearerError(int exitCode) {
        return exitCode != 0 && exitCode != 1;
    }

    /**
     * Returns true when the report file is missing or contains no usable content,
     * which is bearer's normal output when there are no findings.
     */
    private boolean isEmptyReport(File reportFile) {
        if (reportFile == null || !reportFile.exists() || reportFile.length() == 0) {
            return true;
        }
        try {
            String content = Files.readString(reportFile.toPath(), StandardCharsets.UTF_8).trim();
            return content.isEmpty() || "{}".equals(content) || "[]".equals(content);
        } catch (IOException e) {
            return false;
        }
    }

    /**
     * Returns true when the report file content starts like a JSON document ({@code {} or [}).
     * Bearer writes a plaintext message (not JSON) when the language is unsupported, even with
     * {@code --format=json}, so this distinguishes a real report from that message.
     */
    private boolean looksLikeJson(File reportFile) {
        if (reportFile == null || !reportFile.exists() || reportFile.length() == 0) {
            return false;
        }
        try {
            String content = Files.readString(reportFile.toPath(), StandardCharsets.UTF_8).trim();
            return content.startsWith("{") || content.startsWith("[");
        } catch (IOException e) {
            return false;
        }
    }

    /** Reads a short, single-line preview of a report file for diagnostic logging. */
    private String previewFile(File reportFile) {
        if (reportFile == null || !reportFile.exists()) {
            return "<missing>";
        }
        try {
            String content = Files.readString(reportFile.toPath(), StandardCharsets.UTF_8).trim();
            if (content.isEmpty()) {
                return "<empty>";
            }
            content = content.replaceAll("\\s+", " ");
            return content.length() > 300 ? content.substring(0, 300) + "..." : content;
        } catch (IOException e) {
            return "<unreadable: " + e.getMessage() + ">";
        }
    }

    /** Holds the outcome of a subprocess: exit code and captured stderr lines. */
    private record ProcessResult(int exitCode, List<String> errorLines) {
        String stderr() {
            return String.join(System.lineSeparator(), errorLines);
        }
    }

}
