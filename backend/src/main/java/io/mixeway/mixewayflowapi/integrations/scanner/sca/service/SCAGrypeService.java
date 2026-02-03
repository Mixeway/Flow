package io.mixeway.mixewayflowapi.integrations.scanner.sca.service;

import ch.qos.logback.core.spi.ScanException;
import com.fasterxml.jackson.core.JsonParseException;
import com.github.packageurl.MalformedPackageURLException;
import com.github.packageurl.PackageURL;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import io.mixeway.mixewayflowapi.db.entity.Component;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoRepository;
import io.mixeway.mixewayflowapi.domain.coderepo.UpdateCodeRepoService;
import io.mixeway.mixewayflowapi.domain.component.GetOrCreateComponentService;
import io.mixeway.mixewayflowapi.domain.finding.CreateFindingService;
import io.mixeway.mixewayflowapi.integrations.scanner.sca.dto.GrypeReport;
import io.mixeway.mixewayflowapi.integrations.scanner.sca.dto.SBOMDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Service
@Log4j2
@RequiredArgsConstructor
public class SCAGrypeService {
    private final ObjectMapper objectMapper;
    private final CreateFindingService createFindingService;
    private final CdxGenService cdxGenService;
    private final UpdateCodeRepoService updateCodeRepoService;
    private final CodeRepoRepository codeRepoRepository;
    private final GetOrCreateComponentService getOrCreateComponentService;

    private File findSbom(String dir) {
        File directory = new File(dir);

        if (directory.isDirectory()) {
            File[] files = directory.listFiles();

            if (files != null) {
                for (File file : files) {
                    if (file.isFile() && "sbom.json".equals(file.getName())) {
                        return file;
                    }
                }
            }
        }
        return null;
    }

    public void runGrype(String repoDir, CodeRepo codeRepo, CodeRepoBranch codeRepoBranch) throws IOException, InterruptedException, ScanException {
        File sbomFile = findSbom(repoDir);
        if (sbomFile == null) {
            cdxGenService.generateBom(repoDir,codeRepo,codeRepoBranch);
            sbomFile = findSbom(repoDir);
        }

        log.info("[GrypeService] Starting Grype scan for repository: {} branch: {}", codeRepo.getName(), codeRepoBranch.getName());
        File grypeReportFile = new File(repoDir, "grype_report.json");

        ProcessBuilder pb = new ProcessBuilder("grype", "sbom:" + sbomFile.getAbsolutePath(), "--by-cve", "-o", "json", "--file", grypeReportFile.getAbsolutePath());
        pb.directory(new File(repoDir));
        pb.redirectOutput(ProcessBuilder.Redirect.PIPE);
        pb.redirectError(ProcessBuilder.Redirect.PIPE);

        Process process = pb.start();

        ExecutorService executorService = Executors.newFixedThreadPool(2);

        try {
            // Consume standard output stream silently
            executorService.submit(() -> {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                    while (!Thread.currentThread().isInterrupted()) {
                        String line = reader.readLine();
                        if (line == null) break;
                        // Silently consume the output
                    }
                } catch (IOException e) {
                    log.error("Error reading output stream", e);
                }
            });

            // Consume error stream silently
            executorService.submit(() -> {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                    while (!Thread.currentThread().isInterrupted()) {
                        String line = reader.readLine();
                        if (line == null) break;
                        // Silently consume the error stream
                    }
                } catch (IOException e) {
                    log.error("[GrypeService] Error reading error stream", e);
                }
            });

            // Wait for the process to finish with a timeout
            boolean finished = process.waitFor(30, TimeUnit.MINUTES);
            if (!finished) {
                log.warn("[GrypeService] Grype scan did not finish within 20 minutes. Terminating process.");
                process.destroyForcibly(); // Terminate the process
                process.waitFor(); // Wait for the process to terminate
            }
        } finally {
            executorService.shutdownNow(); // Ensure executor service is properly shut down
            if (process.isAlive()) {
                process.destroyForcibly();
            }
        }

        if (!grypeReportFile.exists()) {
            throw new ScanException("[GrypeService] Grype scan did not produce a report file.");
        }

        log.info("[GrypeService] Finished scan, starting processing... - [{} / {}]", codeRepo.getRepourl(), codeRepoBranch.getName());

        try {
            GrypeReport grypeReport = objectMapper.readValue(grypeReportFile, GrypeReport.class);

            processSBOMComponents(sbomFile, codeRepo);

            List<Finding> findings = createFindingService.mapGrypeReportToFindings(grypeReport, codeRepo, codeRepoBranch);

            createFindingService.saveFindings(findings, codeRepoBranch, codeRepo, Finding.Source.SCA, null);

            log.info("[GrypeService] Scan results processed successfully - [{} / {}]", codeRepo.getRepourl(), codeRepoBranch.getName());
        } catch (JsonParseException e) {
            log.warn("[GrypeService] Error with running scan for repository - [{} / {}]", codeRepo.getRepourl(), codeRepoBranch.getName(), e);
        }
    }

    @Transactional
    public void processSBOMComponents(File sbomFile, CodeRepo codeRepo) throws IOException {

        log.info("[GrypeService] Started processing SBOM components.");

        SBOMDto sbom = objectMapper.readValue(sbomFile, SBOMDto.class);

        List<Component> components = new ArrayList<>();
        Map<String, Component> componentsByPurl = new HashMap<>();

        if (sbom.getComponents() != null) {
            for (SBOMDto.SbomComponent c : sbom.getComponents()) {
                String purl = c.getPurl();
                if (purl == null || purl.isBlank()) {
                    continue;
                }

                PackageURL pkg;
                try {
                    pkg = new PackageURL(purl);
                } catch (MalformedPackageURLException e) {
                    log.warn("[GrypeService] Skipping invalid component purl: {}", purl, e);
                    continue;
                }

                String type = pkg.getType();
                String version = pkg.getVersion();

                String name = "maven".equals(type)
                        ? pkg.getNamespace() + ":" + pkg.getName()
                        : pkg.getName();

                Component component = getOrCreateComponentService.getOrCreate(
                        name, type, version, "nvd"
                );

                if (!components.contains(component)) {
                    components.add(component);
                }

                componentsByPurl.put(purl, component);
            }
        }

        if (sbom.getDependencies() != null) {
            for (SBOMDto.SbomDependency d : sbom.getDependencies()) {

                if (d.getRef() != null && !componentsByPurl.containsKey(d.getRef())) {

                    PackageURL pkg;
                    try {
                        pkg = new PackageURL(d.getRef());
                    } catch (MalformedPackageURLException e) {
                        log.warn("[GrypeService] Skipping invalid dependency purl: {}", d.getRef(), e);
                        continue;
                    }

                    String type = pkg.getType();
                    String version = pkg.getVersion();
                    String name = "maven".equals(type)
                            ? pkg.getNamespace() + ":" + pkg.getName()
                            : pkg.getName();

                    Component component = getOrCreateComponentService.getOrCreate(
                            name, type, version, "nvd"
                    );

                    if (!components.contains(component)) {
                        components.add(component);
                    }

                    componentsByPurl.put(d.getRef(), component);
                }

                if (d.getDependsOn() != null) {
                    for (String depPurl : d.getDependsOn()) {

                        if (depPurl == null || componentsByPurl.containsKey(depPurl)) {
                            continue;
                        }

                        PackageURL pkg;
                        try {
                            pkg = new PackageURL(depPurl);
                        } catch (MalformedPackageURLException e) {
                            log.warn("[GrypeService] Skipping invalid dependency purl: {}", depPurl, e);
                            continue;
                        }

                        String type = pkg.getType();
                        String version = pkg.getVersion();
                        String name = "maven".equals(type)
                                ? pkg.getNamespace() + ":" + pkg.getName()
                                : pkg.getName();

                        Component component = getOrCreateComponentService.getOrCreate(
                                name, type, version, "nvd"
                        );

                        if (!components.contains(component)) {
                            components.add(component);
                        }

                        componentsByPurl.put(depPurl, component);
                    }
                }
            }
        }

        List<Long> componentIds = components.stream()
                .map(Component::getId)
                .toList();

        updateCodeRepoService.updateSBOMComponents(componentIds, codeRepo.getId());

        log.info("[GrypeService] Saved SBOM components.");
    }
}
