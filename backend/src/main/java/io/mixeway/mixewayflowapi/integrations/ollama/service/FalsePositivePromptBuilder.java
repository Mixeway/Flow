package io.mixeway.mixewayflowapi.integrations.ollama.service;

import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.integrations.ollama.util.SecretExplanationParser;
import io.mixeway.mixewayflowapi.integrations.rag.service.RetrievedChunk;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class FalsePositivePromptBuilder {

    public String build(Finding finding, List<RetrievedChunk> chunks, Finding.Source source) {
        return switch (source) {
            case SAST -> buildSast(finding, chunks);
            case IAC -> buildIac(finding, chunks);
            case SECRETS -> buildSecrets(finding, chunks);
            default -> buildSast(finding, chunks);
        };
    }

    private String buildSast(Finding finding, List<RetrievedChunk> chunks) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are an expert application-security reviewer (SAST). Your job is to verify the finding against the actual code.\n\n");
        appendCommonFindingBlock(sb, finding, "SAST");
        appendChunks(sb, chunks);
        sb.append("## Task (SAST-specific)\n");
        sb.append("1) Does the vulnerable pattern **actually occur** at the indicated location in this codebase snapshot?\n");
        sb.append("2) In **any realistic execution path or deployment**, could this lead to a **meaningful security impact** ");
        sb.append("(confidentiality, integrity, availability, authn/z bypass, injection, etc.)?\n");
        sb.append("3) **Prefer REAL_ISSUE when in doubt** — do not classify as FALSE_POSITIVE unless you can justify it clearly.\n");
        sb.append("4) Use FALSE_POSITIVE only when the finding is clearly a **rule misfire**, dead/unreachable code, or safe-by-construction usage; ");
        sb.append("not merely \"low severity\".\n");
        sb.append("5) Set **confidence** to **HIGH** only if you are **very sure** the finding is not a real security issue; ");
        sb.append("if you lean toward false positive but are not fully sure, use **REAL_ISSUE** or **FALSE_POSITIVE** with **MEDIUM**/**LOW** (the pipeline treats SAST auto-suppression only for HIGH).\n\n");
        sb.append("Write **reasoning** as **at least 5–8 sentences**, concrete and code-referenced.\n\n");
        appendJsonSchema(sb, true);
        return sb.toString();
    }

    private String buildIac(Finding finding, List<RetrievedChunk> chunks) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are an expert cloud / infrastructure security reviewer (IaC). ");
        sb.append("Assess whether the flagged configuration is unsafe **in a realistic deployment context**.\n\n");
        appendCommonFindingBlock(sb, finding, "IaC");
        appendChunks(sb, chunks);
        sb.append("## Task (IaC-specific)\n");
        sb.append("1) Given the surrounding resources and typical usage, does this setting **materially weaken security** ");
        sb.append("(exposure, overly permissive IAM/network, missing encryption, etc.)?\n");
        sb.append("2) Could it be intentional for dev/test only, or overridden elsewhere? Say so if it is likely benign.\n");
        sb.append("3) Prefer FALSE POSITIVE when the risk is theoretical without context or is standard for the platform.\n\n");
        sb.append("Write **reasoning** as **at least 5–8 sentences**.\n\n");
        appendJsonSchema(sb, true);
        return sb.toString();
    }

    private String buildSecrets(Finding finding, List<RetrievedChunk> chunks) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are an expert secrets and credential-handling reviewer. ");
        sb.append("Decide if the reported match is a **real credential** that could authenticate to a real system, or a **benign** value.\n\n");
        appendCommonFindingBlock(sb, finding, "SECRETS");
        Optional<SecretExplanationParser.ParsedSecretExplanation> parsed =
                SecretExplanationParser.parse(finding.getExplanation());
        parsed.ifPresent(p -> {
            sb.append("## Parsed fingerprint (if present)\n");
            if (p.commitSha() != null) {
                sb.append("- Commit / blob ref: ").append(p.commitSha()).append('\n');
            }
            if (p.filePath() != null && !p.filePath().isBlank()) {
                sb.append("- File path: ").append(p.filePath()).append('\n');
            }
            if (p.detectorType() != null && !p.detectorType().isBlank()) {
                sb.append("- Detector / rule type: ").append(p.detectorType()).append('\n');
            }
            if (p.lineNumber() > 0) {
                sb.append("- Line: ").append(p.lineNumber()).append('\n');
            }
            sb.append('\n');
        });
        appendChunks(sb, chunks);
        sb.append("## Task (secrets-specific)\n");
        sb.append("1) Is this a **real secret** (API key, password, token, private key material) vs **placeholder, example, test, mock, ");
        sb.append("documentation, default/dev-only** value (e.g. `changeit`, `password`, `changeme`, `example`, `YOUR_KEY_HERE`)?\n");
        sb.append("2) If real, what service or resource type is it likely for (database, cloud API, TLS store, etc.)? **Never** echo raw secret values.\n");
        sb.append("3) Mark **FALSE_POSITIVE** for placeholders, samples, tests, mocks, or non-sensitive defaults.\n");
        sb.append("4) For **REAL_ISSUE**, you must still avoid raw secrets in the output; use **masked_preview** like `12******ab` (show only first/last few characters).\n\n");
        sb.append("Write **reasoning** as **at least 6–10 sentences**.\n\n");
        appendJsonSchemaSecrets(sb);
        return sb.toString();
    }

    private static void appendCommonFindingBlock(StringBuilder sb, Finding finding, String scannerLabel) {
        sb.append("## Vulnerability details\n");
        sb.append("- Rule / title: ").append(finding.getVulnerability().getName()).append('\n');
        String desc = finding.getVulnerability().getDescription() != null ? finding.getVulnerability().getDescription() : "";
        sb.append("- Description: ").append(desc).append('\n');
        sb.append("- Severity: ").append(finding.getSeverity().name()).append('\n');
        sb.append("- Location (scanner): ").append(finding.getLocation()).append('\n');
        sb.append("- Scanner channel: ").append(scannerLabel).append('\n');
        if (finding.getExplanation() != null && !finding.getExplanation().isBlank()) {
            sb.append("- Scanner explanation / evidence:\n```\n");
            sb.append(truncate(finding.getExplanation(), 8000)).append("\n```\n\n");
        }
    }

    private static void appendChunks(StringBuilder sb, List<RetrievedChunk> chunks) {
        sb.append("## Relevant code context\n\n");
        if (chunks == null || chunks.isEmpty()) {
            sb.append("(No indexed chunks — rely on explanation and location.)\n\n");
            return;
        }
        for (RetrievedChunk c : chunks) {
            sb.append("### ").append(c.filePath()).append(" (lines ").append(c.startLine()).append("-").append(c.endLine()).append(")\n");
            sb.append(c.content()).append("\n\n");
        }
    }

    private static void appendJsonSchema(StringBuilder sb, boolean includeSecretBlock) {
        sb.append("Respond **ONLY** with valid JSON:\n");
        sb.append("{\n");
        sb.append("  \"verdict\": \"FALSE_POSITIVE\" or \"REAL_ISSUE\",\n");
        sb.append("  \"confidence\": \"HIGH\" or \"MEDIUM\" or \"LOW\",\n");
        sb.append("  \"reasoning\": \"detailed multi-sentence explanation\"\n");
        sb.append("}\n");
        if (includeSecretBlock) {
            sb.append("(Do not include secret_analysis for non-secret findings.)\n");
        }
    }

    private static void appendJsonSchemaSecrets(StringBuilder sb) {
        sb.append("Respond **ONLY** with valid JSON:\n");
        sb.append("{\n");
        sb.append("  \"verdict\": \"FALSE_POSITIVE\" or \"REAL_ISSUE\",\n");
        sb.append("  \"confidence\": \"HIGH\" or \"MEDIUM\" or \"LOW\",\n");
        sb.append("  \"reasoning\": \"detailed multi-sentence explanation (no raw secrets)\",\n");
        sb.append("  \"secret_analysis\": {\n");
        sb.append("    \"credential_category\": \"e.g. api_key | database_password | token | placeholder | test_data | example_value | other\",\n");
        sb.append("    \"likely_service\": \"short description or unknown\",\n");
        sb.append("    \"masked_preview\": \"masked like ab******cd or empty if N/A\",\n");
        sb.append("    \"enrichment_for_ticket\": \"one paragraph for analysts: what this likely protects; no raw secrets\"\n");
        sb.append("  }\n");
        sb.append("}\n");
        sb.append("For FALSE_POSITIVE, still fill secret_analysis explaining why it is benign.\n");
    }

    private static String truncate(String s, int max) {
        if (s.length() <= max) {
            return s;
        }
        return s.substring(0, max) + "\n… [truncated]";
    }
}
