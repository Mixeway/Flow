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
    Vulnerability vulnerability;
    List<String> affectedRepositories;
}
