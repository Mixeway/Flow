package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;

public interface SastEvidenceBuilder {
    boolean supports(SastRuleMetadata metadata);

    FindingEvidence build(Item item, CodeContextExtractor.CodeContext context, SastRuleMetadata metadata);
}
