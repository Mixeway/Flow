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
import java.util.concurrent.Executors;

import com.fasterxml.jackson.databind.ObjectMapper;


@Service
@Log4j2
@RequiredArgsConstructor
public class SASTService {
    private final ObjectMapper objectMapper;
    private final CreateFindingService createFindingService;
    private final UpdateCodeRepoService updateCodeRepoService;
    private final GetOrCreateComponentService getOrCreateComponentService;
    private final CreateAppDataTypeService createAppDataTypeService;

    @Value("${bearer.queries.dir}")
    private String bearerRulesDir;

    public void runBearerScan(String repoDir, CodeRepo codeRepo, CodeRepoBranch codeRepoBranch) throws IOException, InterruptedException, ScanException {
        log.info("[BearerScanService] Starting Bearer scan for repository: {} branch: {}", codeRepo.getName(), codeRepoBranch.getName());
        File securityReportFile = new File(repoDir, "bearer_scan_security.json");
        File dataflowReportFile = new File(repoDir, "bearer_scan_dataflow.json");
        ProcessBuilder securityPb = new ProcessBuilder("bearer", "scan", ".", "--scanner=sast", "--external-rule-dir", bearerRulesDir, "--skip-path=.git", "--report=security", "--format=json", "--output=bearer_scan_security.json");
        ProcessBuilder dataflowPb = new ProcessBuilder("bearer", "scan", ".", "--scanner=sast", "--external-rule-dir", bearerRulesDir, "--report=dataflow", "--format=json", "--skip-path=.git", "--output=bearer_scan_dataflow.json");
        securityPb.directory(new File(repoDir));
        dataflowPb.directory(new File(repoDir));

        runProcess(securityPb);
        runProcess(dataflowPb);

        ObjectMapper objectMapper = new ObjectMapper();

        log.info("[BearerScanService] Finished stan, starting processing... - [{} / {}]",codeRepo.getRepourl(), codeRepoBranch.getName());

        try {
            BearerScanSecurity bearerScanSecurity = objectMapper.readValue(securityReportFile, BearerScanSecurity.class);
            BearerScanDataflow bearerScanDataflow = objectMapper.readValue(dataflowReportFile, BearerScanDataflow.class);

            // Optionally save findings and update status
            createFindingService.saveFindings(createFindingService.mapBearerScanToFindings(bearerScanSecurity, codeRepo, codeRepoBranch), codeRepoBranch, codeRepo, Finding.Source.SAST);
            if (bearerScanDataflow != null && bearerScanDataflow.getDataTypes()!=null){
                createAppDataTypeService.getDataTypesForCodeRepo(codeRepo,bearerScanDataflow);
            }
            // process components

            log.info("[BearerScanService] Scan results processed successfully - [{} / {}]",codeRepo.getRepourl(), codeRepoBranch.getName());
        } catch (JsonParseException e) {
            log.warn("[BearerScanService] Error with running scan, probably not supported language or no AppCode in the repo - [{} / {}]",codeRepo.getRepourl(), codeRepoBranch.getName());
        }
        log.info("[BearerScanService] Bearer scan completed for repository: {} branch: {}. Reports saved at: {}, {}", codeRepo.getName(), codeRepoBranch.getName(), securityReportFile.getAbsolutePath(), dataflowReportFile.getAbsolutePath());
    }

    private void runProcess(ProcessBuilder pb) throws IOException, InterruptedException {
        pb.redirectOutput(ProcessBuilder.Redirect.DISCARD);
        pb.redirectError(ProcessBuilder.Redirect.DISCARD);

        Process process = pb.start();

        Executors.newSingleThreadExecutor().submit(() -> {
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                while (reader.readLine() != null) {
                    // Do nothing with the output
                }
            } catch (IOException e) {
                log.error("Error reading process output", e);
            }
        });

        Executors.newSingleThreadExecutor().submit(() -> {
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                while (reader.readLine() != null) {
                    // Do nothing with the error output
                }
            } catch (IOException e) {
                log.error("Error reading process error", e);
            }
        });

        process.waitFor();
    }

}
