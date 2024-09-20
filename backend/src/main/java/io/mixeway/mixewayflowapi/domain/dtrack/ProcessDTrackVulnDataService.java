package io.mixeway.mixewayflowapi.domain.dtrack;

import io.mixeway.mixewayflowapi.db.entity.*;
import io.mixeway.mixewayflowapi.db.repository.CodeRepoRepository;
import io.mixeway.mixewayflowapi.domain.coderepo.UpdateCodeRepoService;
import io.mixeway.mixewayflowapi.domain.component.GetOrCreateComponentService;
import io.mixeway.mixewayflowapi.domain.finding.CreateFindingService;
import io.mixeway.mixewayflowapi.domain.vulnerability.GetOrCreateVulnerabilityService;
import io.mixeway.mixewayflowapi.integrations.scanner.sca.dto.DTrackGetVulnResponseDto;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProcessDTrackVulnDataService {
    private final GetOrCreateComponentService getOrCreateComponentService;
    private final GetOrCreateVulnerabilityService getOrCreateVulnerabilityService;
    private final CreateFindingService createFindingService;
    private final UpdateCodeRepoService updateCodeRepoService;
    private final CodeRepoRepository codeRepoRepository;

    @Transactional
    public void processVulnerabilities(List<DTrackGetVulnResponseDto> vulnerabilityData, CodeRepo codeRepo, CodeRepoBranch codeRepoBranch) {
        List<Finding> findings = new ArrayList<>();

        for (DTrackGetVulnResponseDto dto : vulnerabilityData) {
            // Step 1: Process components
            List<Component> components = dto.getComponents().stream()
                    .map(compDto -> getOrCreateComponentService.getOrCreate(
                            compDto.getName(),
                            compDto.getGroup(),
                            compDto.getVersion(),
                            "nvd"
                    ))
                    .toList();

            // Step 2: Process vulnerability
            Vulnerability vulnerability = getOrCreateVulnerabilityService.getOrCreate(
                    dto.getVulnId(),
                    dto.getDescription(),
                    dto.getReferences(),
                    dto.getRecommendation(),
                    mapSeverity(dto.getSeverity())
            );
            Hibernate.initialize(vulnerability.getComponents());

            // Step 3: Link Vulnerability and Components
            for (Component component : components) {
                if (!vulnerability.getComponents().contains(component)) {
                    vulnerability.getComponents().add(component);
                }

                String location = (component.getGroupid() != null ? component.getGroupid() + ":" : "") + component.getName() + ":" + component.getVersion();
                Finding finding = new Finding(
                        vulnerability,
                        component,
                        codeRepoBranch,
                        codeRepo,
                        vulnerability.getDescription(),
                        location,
                        vulnerability.getSeverity(),
                        Finding.Source.SCA // Assuming the source is SCA
                );
                findings.add(finding);
            }
        }
        createFindingService.saveFindings(findings, codeRepoBranch, codeRepo, Finding.Source.SCA);
    }

    private Finding.Severity mapSeverity(String severity) {
        return switch (severity.toUpperCase()) {
            case "CRITICAL" -> Finding.Severity.CRITICAL;
            case "HIGH" -> Finding.Severity.HIGH;
            case "MEDIUM" -> Finding.Severity.MEDIUM;
            case "LOW" -> Finding.Severity.LOW;
            case "INFO" -> Finding.Severity.INFO;
            default -> Finding.Severity.INFO;
        };
    }

    @Transactional
    public void processComponents(List<DTrackGetVulnResponseDto.Component> body, CodeRepo codeRepo) {
        codeRepo = codeRepoRepository.findById(codeRepo.getId()).get();
        List<Component> components = body.stream()
                .map(compDto -> getOrCreateComponentService.getOrCreate(
                        compDto.getName(),
                        compDto.getGroup(),
                        compDto.getVersion(),
                        "nvd"
                ))
                .toList();
        updateCodeRepoService.updateComponents(components, codeRepo);
    }
}

