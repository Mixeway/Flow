package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Locale;

@Component
@Order(1000)
public class GeneralEvidenceBuilder implements SastEvidenceBuilder {

    @Override
    public boolean supports(SastRuleMetadata metadata) {
        return true;
    }

    @Override
    public FindingEvidence build(Item item, CodeContextExtractor.CodeContext context, SastRuleMetadata metadata) {
        String sink = item == null || item.getCodeExtract() == null ? "unknown" : item.getCodeExtract();
        String key = String.join("|",
                metadata == null ? VulnerabilityFamily.GENERAL.name() : metadata.family().name(),
                normalizedCode(item));
        return new FindingEvidence(
                true,
                metadata,
                ExecutionContext.UNKNOWN,
                "General finding evidence; use existing code context and ReAct tools to prove source, sink, and neutralization.",
                FindingEvidence.attributes(
                        "code_context_category", context == null || context.category() == null ? "unknown" : context.category()),
                metadata != null && metadata.requiresTaint() ? TaintTrace.unknown(sink)
                        : TaintTrace.notRequired("this finding family does not require structured taint by default"),
                List.of("FALSE_POSITIVE still requires positive safety evidence; otherwise prefer UNCERTAIN."),
                key);
    }

    private String normalizedCode(Item item) {
        if (item == null || item.getCodeExtract() == null) {
            return "";
        }
        return item.getCodeExtract().replaceAll("\\s+", " ").trim().toLowerCase(Locale.ROOT);
    }
}
