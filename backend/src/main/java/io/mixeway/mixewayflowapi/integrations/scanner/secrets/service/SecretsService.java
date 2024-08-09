package io.mixeway.mixewayflowapi.integrations.scanner.secrets.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.domain.coderepo.UpdateCodeRepoService;
import io.mixeway.mixewayflowapi.domain.finding.CreateFindingService;
import io.mixeway.mixewayflowapi.integrations.scanner.secrets.dto.Secret;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
@Log4j2
@RequiredArgsConstructor
public class SecretsService {
    private final ObjectMapper objectMapper;
    private final CreateFindingService createFindingService;

    public void runGitleaks(String repoDir, CodeRepo codeRepo, CodeRepoBranch branch) throws IOException, InterruptedException {
        ProcessBuilder pb = new ProcessBuilder("gitleaks", "detect", "--source", ".", "-r", "secrets.json");
        pb.directory(new File(repoDir));
        executeCommand(pb);
        List<Secret> secrets =  objectMapper.readValue(new File(repoDir+File.separator+"secrets.json"), new TypeReference<List<Secret>>() {});
        log.info("[GitLeaks SecretScan] GitLeaks Secret scan performed found {} threats, [for: {}]", secrets.size(), repoDir);
        List<Finding> findings = createFindingService.mapSecretsToFindings(secrets, branch, codeRepo);
        log.info("[GitLeaks SecretScan] GitLeaks Secret scan performed. Threats saved [for: {}]", repoDir);
        createFindingService.saveFindings(findings, branch, codeRepo, Finding.Source.SECRETS);
    }

    private void executeCommand(ProcessBuilder pb) throws IOException, InterruptedException {
        Process process = pb.start();
        int exitCode = process.waitFor();
    }
}
