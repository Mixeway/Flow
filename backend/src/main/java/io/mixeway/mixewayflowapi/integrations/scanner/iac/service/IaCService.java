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
import lombok.extern.java.Log;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;

@Service
@Log4j2
@RequiredArgsConstructor
public class IaCService {
    private final CreateFindingService createFindingService;
    private final ObjectMapper objectMapper;
    private final UpdateCodeRepoService updateCodeRepoService;


    @Value("${kics.queries.dir}")
    private String kicsQueriesDir;

    public void runKics(String repoDir, CodeRepo codeRepo, CodeRepoBranch codeRepoBranch) throws IOException, InterruptedException, ScanException {
        log.info("[KicsService] Starting KICS scan for repository: {} branch: {}", codeRepo.getName(), codeRepoBranch.getName());
        File reportFile = new File(repoDir, "kics/results.json");
        ProcessBuilder pb = new ProcessBuilder("kics", "scan", "-p", repoDir, "-q", kicsQueriesDir, "-o", reportFile.getParent());
        pb.directory(new File(repoDir));

        Process process = pb.start();
        int exitCode = process.waitFor();

        if (exitCode != 0) {
            StringBuilder errorOutput = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    errorOutput.append(line).append(System.lineSeparator());
                }
            }
        }

        if (!reportFile.exists()) {
            throw new ScanException("KICS scan did not produce a report file.");
        }

        KicsReport kicsReport = objectMapper.readValue(reportFile, KicsReport.class);
        createFindingService.saveFindings(createFindingService.mapKicsReportToFindings(kicsReport, codeRepo, codeRepoBranch),codeRepoBranch, codeRepo, Finding.Source.IAC);
        log.info("[KicsService] KICS scan completed for repository: {} branch: {}. Report saved at: {}", codeRepo.getName(), codeRepoBranch.getName(), reportFile.getAbsolutePath());
    }
}
