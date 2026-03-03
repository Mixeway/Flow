package io.mixeway.mixewayflowapi.integrations.nist.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class NistCveCvssMetricV31 {
    private String source;
    private String type;
    private NistCveCvssData cvssData;
    private BigDecimal exploitabilityScore;
    private BigDecimal impactScore;
}
