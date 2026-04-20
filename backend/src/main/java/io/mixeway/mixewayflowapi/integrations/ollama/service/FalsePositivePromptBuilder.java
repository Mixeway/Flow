package io.mixeway.mixewayflowapi.integrations.ollama.service;

import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.integrations.rag.service.RetrievedChunk;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class FalsePositivePromptBuilder {

    public String build(Finding finding, List<RetrievedChunk> chunks, String scannerLabel) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are a security code reviewer analyzing whether a static analysis finding is a false positive.\n\n");
        sb.append("## Vulnerability Details\n");
        sb.append("- Rule: ").append(finding.getVulnerability().getName()).append('\n');
        sb.append("- Title: ").append(finding.getVulnerability().getName()).append('\n');
        String desc = finding.getVulnerability().getDescription() != null ? finding.getVulnerability().getDescription() : "";
        sb.append("- Description: ").append(desc).append('\n');
        sb.append("- Severity: ").append(finding.getSeverity().name()).append('\n');
        sb.append("- File: ").append(finding.getLocation()).append('\n');
        sb.append("- Scanner: ").append(scannerLabel).append("\n\n");
        sb.append("## Relevant Code Context\n\n");
        for (RetrievedChunk c : chunks) {
            sb.append("### ").append(c.filePath()).append(" (lines ").append(c.startLine()).append("-").append(c.endLine()).append(")\n");
            sb.append(c.content()).append("\n\n");
        }
        sb.append("## Task\n");
        sb.append("Analyze whether this finding is a FALSE POSITIVE or a REAL ISSUE.\n\n");
        sb.append("Consider:\n");
        sb.append("- Is the flagged pattern actually used in a dangerous way in this specific code?\n");
        sb.append("- Is there sanitization, validation, or context that makes this safe?\n");
        sb.append("- Is this test code, mock data, or documentation?\n");
        sb.append("- Is the finding about a pattern that is safe in this framework/language context?\n\n");
        sb.append("Respond ONLY with valid JSON in this exact format:\n");
        sb.append("{\n");
        sb.append("  \"verdict\": \"FALSE_POSITIVE\" or \"REAL_ISSUE\",\n");
        sb.append("  \"confidence\": \"HIGH\" or \"MEDIUM\" or \"LOW\",\n");
        sb.append("  \"reasoning\": \"2-5 sentences explaining your decision based on the actual code\"\n");
        sb.append("}\n");
        return sb.toString();
    }
}
