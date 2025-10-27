package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import ch.qos.logback.core.spi.ScanException;
import com.fasterxml.jackson.core.JsonParseException;
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

        runProcess(securityPb);
        runProcess(dataflowPb);

        ObjectMapper objectMapper = new ObjectMapper();

        log.info("[BearerScanService] Finished scan, starting processing... - [{} / {}]", codeRepo.getRepourl(), codeRepoBranch.getName());

        try {
            BearerScanSecurity bearerScanSecurity = objectMapper.readValue(securityReportFile, BearerScanSecurity.class);
            BearerScanDataflow bearerScanDataflow = objectMapper.readValue(dataflowReportFile, BearerScanDataflow.class);

            // Save findings and update status
            createFindingService.saveFindings(createFindingService.mapBearerScanToFindings(bearerScanSecurity, codeRepo, codeRepoBranch), codeRepoBranch, codeRepo, Finding.Source.SAST, null);

            if (bearerScanDataflow != null && bearerScanDataflow.getDataTypes() != null) {
                createAppDataTypeService.getDataTypesForCodeRepo(codeRepo, bearerScanDataflow);
            }

            log.info("[BearerScanService] Scan results processed successfully - [{} / {}]", codeRepo.getRepourl(), codeRepoBranch.getName());
        } catch (JsonParseException e) {
            log.warn("[BearerScanService] Error with running scan, probably not supported language or no AppCode in the repo - [{} / {}]", codeRepo.getRepourl(), codeRepoBranch.getName());
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
    private void runProcess(ProcessBuilder pb) throws IOException, InterruptedException {
        pb.redirectOutput(ProcessBuilder.Redirect.PIPE);
        pb.redirectError(ProcessBuilder.Redirect.PIPE);

        Process process = pb.start();

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

            // Stream gobbler for process error
            executor.submit(() -> {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                    while (!Thread.currentThread().isInterrupted()) {
                        String line = reader.readLine();
                        if (line == null) break;
                        // Optionally process the error output
                    }
                } catch (IOException e) {
                    log.error("Error reading process error", e);
                }
            });

            // Wait for the process to finish with a timeout
            boolean finished = process.waitFor(30, TimeUnit.MINUTES);
            if (!finished) {
                log.warn("[SASTService] Process did not finish within 20 minutes. Terminating process.");
                process.destroyForcibly(); // Terminate the process
                process.waitFor(); // Wait for the process to terminate
            }
        } finally {
            executor.shutdownNow(); // Shutdown the executor to stop stream gobblers
            if (process.isAlive()) {
                process.destroyForcibly();
            }
        }
    }

}
