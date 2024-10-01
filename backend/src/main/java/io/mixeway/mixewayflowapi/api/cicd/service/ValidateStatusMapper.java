package io.mixeway.mixewayflowapi.api.cicd.service;

import io.mixeway.mixewayflowapi.api.cicd.dto.ValidateStatusDto;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ValidateStatusMapper {

    /**
     * Maps a list of Finding entities to ValidateStatusDto based on severity counts.
     *
     * @param findings The list of Finding entities.
     * @return A ValidateStatusDto containing the result and list of detected threats.
     */
    public ValidateStatusDto mapFindingsToValidateStatusDto(List<Finding> findings) {
        ValidateStatusDto dto = new ValidateStatusDto();

        long criticalCount = findings.stream()
                .filter(finding -> finding.getSeverity() == Finding.Severity.CRITICAL)
                .count();

        long highCount = findings.stream()
                .filter(finding -> finding.getSeverity() == Finding.Severity.HIGH)
                .count();

        String result = determineResult(criticalCount, highCount);
        dto.setResult(result);

        List<ValidateStatusDto.Threat> threats = findings.stream()
                .map(this::mapFindingToThreat)
                .collect(Collectors.toList());

        dto.setDetectedTreats(threats);

        return dto;
    }

    /**
     * Determines the overall result based on the counts of critical and high severity findings.
     *
     * @param criticalCount Number of critical severity findings.
     * @param highCount     Number of high severity findings.
     * @return A String representing the overall result ("danger", "warning", "success").
     */
    private String determineResult(long criticalCount, long highCount) {
        if (criticalCount > 0) {
            return "DANGER";
        } else if (highCount > 5) {
            return "DANGER";
        } else if (highCount > 0) {
            return "WARNING";
        } else {
            return "SUCCESS";
        }
    }

    /**
     * Maps a single Finding entity to a Threat DTO.
     *
     * @param finding The Finding entity.
     * @return A Threat DTO with name, location, and severity.
     */
    private ValidateStatusDto.Threat mapFindingToThreat(Finding finding) {
        String name = finding.getVulnerability().getName(); // Assuming Vulnerability has a getName() method
        String location = finding.getLocation();
        String severity = finding.getSeverity().name(); // Converts enum to String

        return new ValidateStatusDto.Threat(location, name, severity);
    }
}
