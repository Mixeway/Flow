package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@Order(30)
public class SecretExposureEvidenceBuilder implements SastEvidenceBuilder {

    private static final Pattern SECRET_TERMS = Pattern.compile(
            "\\b(password|passwd|pwd|secret|token|api[_-]?key|private[_-]?key|credential|access[_-]?key|client[_-]?secret)\\b",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern PLACEHOLDER_TERMS = Pattern.compile(
            "\\b(example|sample|dummy|test|placeholder|changeme|your[-_ ]?secret|xxxx|<[^>]+>)\\b",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern STRING_ASSIGNMENT = Pattern.compile(
            "\\b(?:public|private|protected|static|final|String|var|String\\s+)*\\s*"
                    + "([A-Za-z_][A-Za-z0-9_]*)\\s*=\\s*\"([^\"]*)\"");
    private static final Pattern IDENTIFIER = Pattern.compile("\\b[A-Za-z_][A-Za-z0-9_]*\\b");

    @Override
    public boolean supports(SastRuleMetadata metadata) {
        return metadata != null && metadata.family() == VulnerabilityFamily.HARDCODED_SECRET;
    }

    @Override
    public FindingEvidence build(Item item, CodeContextExtractor.CodeContext context, SastRuleMetadata metadata) {
        String combined = combinedText(item, context);
        SecretValueTrace valueTrace = traceSecretValue(item, context, combined);
        String secretKind = detectSecretKind(combined, valueTrace);
        String placeholderHint = valueTrace.likelyRealSecret() ? "real_secret_candidate" : valueTrace.valueRole();

        return new FindingEvidence(
                true,
                metadata,
                ExecutionContext.UNKNOWN,
                "Hardcoded secret finding classified by constant value trace and usage role.",
                FindingEvidence.attributes(
                        "secret_kind", secretKind,
                        "placeholder_hint", placeholderHint,
                        "constant_variable", valueTrace.variableName(),
                        "literal_kind", valueTrace.literalKind(),
                        "value_role", valueTrace.valueRole(),
                        "declaration_evidence", valueTrace.declarationEvidence(),
                        "usage_evidence", valueTrace.usageEvidence(),
                        "source_location", item == null ? "unknown" : item.getFilename()),
                TaintTrace.notRequired("hardcoded secret findings are value-at-rest/configuration issues and do not require user-controlled taint"),
                List.of(
                        "TRUE_POSITIVE requires a credential, token, private key, or secret-like value that is not clearly a placeholder.",
                        "FALSE_POSITIVE requires positive evidence that the value is a placeholder, template key, regex/pattern, filename, public identifier, or non-secret constant.",
                        "Resolve local constants before asking for user-controlled taint; hardcoded secret findings use value tracing, not source taint."),
                consistencyKey(metadata, secretKind, valueTrace, item));
    }

    private SecretValueTrace traceSecretValue(Item item, CodeContextExtractor.CodeContext context, String combined) {
        String candidate = primaryCandidate(item);
        Matcher matcher = STRING_ASSIGNMENT.matcher(combined);
        SecretValueTrace firstSecretLike = null;
        while (matcher.find()) {
            String variable = matcher.group(1);
            String literal = matcher.group(2);
            SecretValueTrace trace = buildTrace(variable, literal, combined);
            if (!candidate.isBlank()) {
                if (!variable.equals(candidate)) {
                    continue;
                }
                return trace;
            }
            if (firstSecretLike == null && SECRET_TERMS.matcher(variable + " " + literal).find()) {
                firstSecretLike = trace;
            }
        }
        return firstSecretLike != null ? firstSecretLike : SecretValueTrace.unknown();
    }

    private SecretValueTrace buildTrace(String variable, String literal, String combined) {
        String role = classifyLiteralRole(variable, literal);
        String declaration = variable + " = \"" + clip(literal) + "\"";
        String usage = summarizeUsage(variable, combined);
        return new SecretValueTrace(
                variable,
                literal.isBlank() ? "empty_string" : "string_literal",
                role,
                declaration,
                usage,
                "real_secret".equals(role));
    }

    private String classifyLiteralRole(String variable, String literal) {
        String lowerVariable = variable.toLowerCase(Locale.ROOT);
        String lowerLiteral = literal.toLowerCase(Locale.ROOT);
        if (literal.isBlank()) {
            return "empty_literal";
        }
        if (PLACEHOLDER_TERMS.matcher(literal).find()) {
            return "placeholder";
        }
        if (literal.equals(variable) || literal.matches("[A-Z][A-Z0-9_]{2,}")) {
            return "template_or_message_key";
        }
        if (lowerVariable.contains("pattern") || lowerLiteral.startsWith("^") || lowerLiteral.endsWith("$")) {
            return "regex_pattern";
        }
        if (lowerVariable.contains("template") || lowerLiteral.endsWith(".html")
                || lowerLiteral.endsWith(".ftl") || lowerLiteral.endsWith(".vm")) {
            return "template_or_file_name";
        }
        if (lowerVariable.contains("link") || lowerVariable.contains("url") || lowerLiteral.startsWith("http://")
                || lowerLiteral.startsWith("https://")) {
            return "url_or_link_template";
        }
        if (SECRET_TERMS.matcher(variable).find() && looksLikeSecretValue(literal)) {
            return "real_secret";
        }
        if (SECRET_TERMS.matcher(variable + " " + literal).find()) {
            return "secret_named_constant";
        }
        return "public_constant";
    }

    private boolean looksLikeSecretValue(String literal) {
        if (literal.length() < 8) {
            return false;
        }
        boolean hasLower = literal.matches(".*[a-z].*");
        boolean hasUpper = literal.matches(".*[A-Z].*");
        boolean hasDigit = literal.matches(".*\\d.*");
        boolean hasSymbol = literal.matches(".*[^A-Za-z0-9_\\-].*");
        return (hasLower && hasUpper && (hasDigit || hasSymbol)) || literal.length() >= 24;
    }

    private String summarizeUsage(String variable, String combined) {
        List<String> usages = new ArrayList<>();
        String[] lines = combined.split("\\R");
        for (String line : lines) {
            if (line.contains(variable) && !line.matches(".*\\b" + Pattern.quote(variable) + "\\s*=.*")) {
                usages.add(clip(line.trim()));
            }
            if (usages.size() >= 3) {
                break;
            }
        }
        return usages.isEmpty() ? "no usage evidence in supplied context" : String.join(" | ", usages);
    }

    private String primaryCandidate(Item item) {
        if (item == null || item.getCodeExtract() == null) {
            return "";
        }
        Matcher matcher = IDENTIFIER.matcher(item.getCodeExtract());
        while (matcher.find()) {
            String token = matcher.group();
            if (SECRET_TERMS.matcher(token).find()) {
                return token;
            }
        }
        return "";
    }

    private String detectSecretKind(String combined, SecretValueTrace valueTrace) {
        String lower = combined.toLowerCase(Locale.ROOT);
        String traceText = (valueTrace.variableName() + " " + valueTrace.declarationEvidence()).toLowerCase(Locale.ROOT);
        if (traceText.contains("private key")) return "private_key";
        if (traceText.contains("api") && traceText.contains("key")) return "api_key";
        if (traceText.contains("token")) return "token";
        if (traceText.contains("password") || traceText.contains("passwd") || traceText.contains("pwd")) return "password";
        if (traceText.contains("secret")) return "secret";
        if (lower.contains("private key")) return "private_key";
        if (lower.contains("api") && lower.contains("key")) return "api_key";
        if (lower.contains("token")) return "token";
        if (lower.contains("password") || lower.contains("passwd") || lower.contains("pwd")) return "password";
        if (lower.contains("secret")) return "secret";
        if (SECRET_TERMS.matcher(combined).find()) return "credential";
        return "unknown";
    }

    private String consistencyKey(SastRuleMetadata metadata, String secretKind, SecretValueTrace valueTrace, Item item) {
        String file = item == null ? "" : java.util.Optional.ofNullable(item.getFilename())
                .orElse(java.util.Optional.ofNullable(item.getFullFilename()).orElse(""));
        return String.join("|", metadata.family().name(), secretKind, file,
                valueTrace.valueRole(), valueTrace.variableName());
    }

    private String combinedText(Item item, CodeContextExtractor.CodeContext context) {
        return String.join("\n",
                item == null || item.getTitle() == null ? "" : item.getTitle(),
                item == null || item.getDescription() == null ? "" : item.getDescription(),
                item == null || item.getCodeExtract() == null ? "" : item.getCodeExtract(),
                context == null || context.functionBody() == null ? "" : context.functionBody(),
                context == null || context.localSnippet() == null ? "" : context.localSnippet());
    }

    private String clip(String value) {
        if (value == null) {
            return "";
        }
        String normalized = value.replaceAll("\\s+", " ").trim();
        return normalized.length() <= 160 ? normalized : normalized.substring(0, 160) + "...";
    }
}
