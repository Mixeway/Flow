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

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

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
        String secretsJsonPath = repoDir + File.separator + "secrets.json";
        List<Secret> secrets = objectMapper.readValue(new File(secretsJsonPath), new TypeReference<List<Secret>>() {});

        String scriptDir = Paths.get("backend", "src", "main", "java", "io", "mixeway", "mixewayflowapi", "integrations", "scanner", "secrets", "service").toString();
        String scriptPath = Paths.get(scriptDir, "secrets_filtering_service.py").toString();
        ProcessBuilder pythonPb = new ProcessBuilder("python3", scriptPath, secretsJsonPath);
        pythonPb.directory(new File(repoDir));
        pythonPb.redirectErrorStream(true);
        Process process = pythonPb.start();
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        StringBuilder output = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            output.append(line);
        }
        process.waitFor();

        String secretFilteringResult = output.toString();
        String result = secretFilteringResult.replaceAll("[\\[\\]\\s]", "");
        List<Boolean> filterResults = Arrays.stream(result.split(","))
                .map(s -> s.equalsIgnoreCase("true"))
                .collect(Collectors.toList());

        log.info("[GitLeaks SecretScan] GitLeaks Secret scan performed. Found {} threats [for: {}], recognized {} as valid findings.", secrets.size(), repoDir, filterResults.stream().filter(Boolean::booleanValue).count());
        List<Finding> findings = createFindingService.mapSecretsToFindings(secrets, branch, codeRepo);

        List<Finding> filteredFindings = new ArrayList<>();
        for (int i = 0; i < findings.size() && i < filterResults.size(); i++) {
            if (filterResults.get(i)) {
                filteredFindings.add(findings.get(i));
            }
        }
        log.info("[GitLeaks SecretScan] GitLeaks Secret scan results saved [for: {}]", repoDir);
        createFindingService.saveFindings(filteredFindings, branch, codeRepo, Finding.Source.SECRETS);
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
