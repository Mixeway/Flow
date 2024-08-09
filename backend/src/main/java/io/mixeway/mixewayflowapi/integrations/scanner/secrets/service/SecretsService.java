package io.mixeway.mixewayflowapi.integrations.scanner.secrets.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.domain.finding.CreateFindingService;
import io.mixeway.mixewayflowapi.integrations.scanner.secrets.dto.Secret;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.List;

/**
 * Service responsible for running secret scanning using GitLeaks and processing the scan results.
 * This service detects secrets in the code repository and maps them to findings for further analysis.
 */
@Service
@Log4j2
@RequiredArgsConstructor
public class SecretsService {

    private final ObjectMapper objectMapper;
    private final CreateFindingService createFindingService;

    /**
     * Runs the GitLeaks secret scanning tool on the specified code repository and branch, processes the scan results,
     * and saves any detected secrets as findings.
     *
     * @param repoDir The directory of the code repository to be scanned.
     * @param codeRepo The code repository entity.
     * @param branch The branch of the code repository to be scanned.
     * @throws IOException If an I/O error occurs during the scanning or processing.
     * @throws InterruptedException If the scanning process is interrupted.
     */
    public void runGitleaks(String repoDir, CodeRepo codeRepo, CodeRepoBranch branch) throws IOException, InterruptedException {
        ProcessBuilder pb = new ProcessBuilder("gitleaks", "detect", "--source", ".", "-r", "secrets.json");
        pb.directory(new File(repoDir));
        executeCommand(pb);
        List<Secret> secrets = objectMapper.readValue(new File(repoDir + File.separator + "secrets.json"), new TypeReference<List<Secret>>() {});
        log.info("[GitLeaks SecretScan] GitLeaks Secret scan performed. Found {} threats [for: {}]", secrets.size(), repoDir);
        List<Finding> findings = createFindingService.mapSecretsToFindings(secrets, branch, codeRepo);
        log.info("[GitLeaks SecretScan] GitLeaks Secret scan results saved [for: {}]", repoDir);
        createFindingService.saveFindings(findings, branch, codeRepo, Finding.Source.SECRETS);
    }

    /**
     * Executes the command specified by the provided {@link ProcessBuilder} and waits for its completion.
     *
     * @param pb The {@link ProcessBuilder} that defines the command to be executed.
     * @throws IOException If an I/O error occurs during the execution of the command.
     * @throws InterruptedException If the process is interrupted while waiting for completion.
     */
    private void executeCommand(ProcessBuilder pb) throws IOException, InterruptedException {
        Process process = pb.start();
        int exitCode = process.waitFor();
    }
}
