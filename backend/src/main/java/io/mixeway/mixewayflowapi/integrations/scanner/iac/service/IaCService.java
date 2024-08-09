package io.mixeway.mixewayflowapi.integrations.scanner.iac.service;

import ch.qos.logback.core.spi.ScanException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.domain.coderepo.UpdateCodeRepoService;
import io.mixeway.mixewayflowapi.domain.finding.CreateFindingService;
import io.mixeway.mixewayflowapi.integrations.scanner.iac.dto.KicsReport;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Service responsible for running IaC (Infrastructure as Code) scans using KICS (Keeping Infrastructure as Code Secure).
 * This service initiates a KICS scan on the specified repository and processes the scan results.
 */
@Service
@Log4j2
@RequiredArgsConstructor
public class IaCService {

    private final CreateFindingService createFindingService;
    private final ObjectMapper objectMapper;
    private final UpdateCodeRepoService updateCodeRepoService;

    @Value("${kics.queries.dir}")
    private String kicsQueriesDir;

    /**
     * Runs the KICS scan on the specified code repository and branch, processes the results, and saves any findings.
     *
     * @param repoDir         The directory of the code repository to scan.
     * @param codeRepo        The code repository entity.
     * @param codeRepoBranch  The branch of the code repository to scan.
     * @throws IOException           If an I/O error occurs.
     * @throws InterruptedException  If the scan process is interrupted.
     * @throws ScanException         If the scan fails to produce a report file.
     */
    public void runKics(String repoDir, CodeRepo codeRepo, CodeRepoBranch codeRepoBranch) throws IOException, InterruptedException, ScanException {
        log.info("[KicsService] Starting KICS scan for repository: {} branch: {}", codeRepo.getName(), codeRepoBranch.getName());
        File reportFile = new File(repoDir, "kics/results.json");
        ProcessBuilder pb = new ProcessBuilder("kics", "scan", "-p", repoDir, "-q", kicsQueriesDir, "-o", reportFile.getParent());
        pb.directory(new File(repoDir));

        Process process = pb.start();

        // Create an ExecutorService to handle the streams concurrently
        ExecutorService executorService = Executors.newFixedThreadPool(2);

        // Consume standard output stream silently
        executorService.submit(() -> {
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                while (reader.readLine() != null) {
                    // Silently consume the output
                }
            } catch (IOException e) {
                log.error("Error reading output stream", e);
            }
        });

        // Consume error stream silently
        executorService.submit(() -> {
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                while (reader.readLine() != null) {
                    // Silently consume the error stream
                }
            } catch (IOException e) {
                log.error("Error reading error stream", e);
            }
        });

        process.waitFor();
        executorService.shutdown(); // Ensure executor service is properly shut down

        if (!reportFile.exists()) {
            throw new ScanException("KICS scan did not produce a report file.");
        }

        KicsReport kicsReport = objectMapper.readValue(reportFile, KicsReport.class);
        createFindingService.saveFindings(createFindingService.mapKicsReportToFindings(kicsReport, codeRepo, codeRepoBranch), codeRepoBranch, codeRepo, Finding.Source.IAC);
        log.info("[KicsService] KICS scan completed for repository: {} branch: {}. Report saved at: {}", codeRepo.getName(), codeRepoBranch.getName(), reportFile.getAbsolutePath());
    }
}
