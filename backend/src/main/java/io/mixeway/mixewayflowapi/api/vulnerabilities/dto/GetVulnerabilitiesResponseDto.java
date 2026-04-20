package io.mixeway.mixewayflowapi.api.vulnerabilities.dto;

import io.mixeway.mixewayflowapi.db.entity.Vulnerability;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetVulnerabilitiesResponseDto {
    private Vulnerability vulnerability;
    private List<String> affectedRepositories;
    /** True if any accessible finding for this vuln was analyzed by AI. */
    private boolean anyAiAnalyzed;
    /** True if any accessible finding was suppressed as AI false positive. */
    private boolean anyAiFalsePositiveSuppressed;
}
