package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;
import lombok.RequiredArgsConstructor;
import org.springframework.core.annotation.AnnotationAwareOrderComparator;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SastEvidenceService {

    private final SastRuleClassifier ruleClassifier;
    private final List<SastEvidenceBuilder> builders;

    public FindingEvidence buildEvidence(Item item, CodeContextExtractor.CodeContext context) {
        SastRuleMetadata metadata = ruleClassifier.classify(item);
        return builders.stream()
                .sorted(AnnotationAwareOrderComparator.INSTANCE)
                .filter(builder -> builder.supports(metadata))
                .findFirst()
                .map(builder -> builder.build(item, context, metadata))
                .orElseGet(() -> FindingEvidence.unavailable());
    }
}
