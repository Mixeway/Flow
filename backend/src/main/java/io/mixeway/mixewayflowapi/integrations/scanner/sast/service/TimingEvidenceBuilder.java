package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

/**
 * Evidence builder for CWE-208 observable timing / side-channel findings.
 * Distinguishes security-sensitive secret comparisons from non-security equality checks.
 */
@Component
@Order(25)
public class TimingEvidenceBuilder implements SastEvidenceBuilder {

    private static final Pattern SECRET_TERMS = Pattern.compile(
            "\\b(password|passwd|pwd|secret|token|api[_-]?key|credential|hmac|signature|hash|digest|"
                    + "session[_-]?id|auth|bearer|private[_-]?key|otp|pin)\\b",
            Pattern.CASE_INSENSITIVE);

    private static final Pattern CONSTANT_TIME = Pattern.compile(
            "MessageDigest\\.isEqual|slowEquals|constantTime|constant_time|timingSafeEqual|"
                    + "crypto\\.timingSafeEqual|SecureCompare|CryptographicOperations\\.FixedTimeEquals",
            Pattern.CASE_INSENSITIVE);

    /** Boolean / config checks are never CWE-208 secret comparisons. */
    private static final Pattern BOOLEAN_LITERAL_COMPARE = Pattern.compile(
            "(==|===|!=|!==)\\s*(true|false)\\b"
                    + "|\\b(true|false)\\s*(==|===|!=|!==)",
            Pattern.CASE_INSENSITIVE);

    /**
     * Presence / emptiness / typeof checks are not secret-value comparisons.
     * Identifiers like {@code cesiumAccessToken} must not force security_sensitive
     * when the only operation is "is string / non-empty".
     */
    private static final Pattern PRESENCE_OR_TYPE_CHECK = Pattern.compile(
            "\\btypeof\\s+[^\\n;{]+?(?:===?|!==?)\\s*['\"](?:string|number|object|boolean|undefined|function|symbol|bigint)['\"]"
                    + "|\\.length\\s*(?:===?|!==?|>=?|<=?)\\s*0\\b"
                    + "|\\.(?:isEmpty|isBlank|isPresent)\\s*\\(\\s*\\)"
                    + "|Objects\\.(?:isNull|nonNull)\\s*\\([^)]*\\)"
                    + "|(?:==|===|!=|!==)\\s*(?:null|undefined|['\"]\\s*['\"])"
                    + "|(?:null|undefined)\\s*(?:==|===|!=|!==)",
            Pattern.CASE_INSENSITIVE);

    private static final Pattern NON_SECURITY_COMPARE = Pattern.compile(
            "==\\s*['\"]#[A-Za-z0-9_-]+['\"]"
                    + "|===\\s*['\"]#[A-Za-z0-9_-]+['\"]"
                    + "|\\.equals\\s*\\(\\s*[\"'][%*#]?[\"']\\s*\\)"
                    + "|location\\.hash|window\\.location"
                    + "|feature[_-]?flag|ui[_-]?route|hashchange|anchor"
                    + "|Math\\.random|setTimeout|setInterval|load.?balanc|jitter|cleanup"
                    + "|wildcard|tokenizer|regex\\s*part|prefixedregex"
                    + "|showToken|matchhighlight|highlightSelectionMatches"
                    + "|pushContext|popContext|override\\s*=",
            Pattern.CASE_INSENSITIVE);

    /**
     * Enum / lexer / tokenizer discriminators: {@code type == "hash"}, {@code kind === 'word'}.
     * The quoted value is a token-class name, not a secret hash/digest.
     */
    private static final Pattern STRING_LITERAL_DISCRIMINATOR = Pattern.compile(
            "\\b[A-Za-z_][\\w.]*\\s*(?:==|===|!=|!==)\\s*['\"][A-Za-z_][A-Za-z0-9_-]{0,48}['\"]"
                    + "|['\"][A-Za-z_][A-Za-z0-9_-]{0,48}['\"]\\s*(?:==|===|!=|!==)\\s*[A-Za-z_][\\w.]*"
                    + "|\\.equals(?:IgnoreCase)?\\s*\\(\\s*['\"][A-Za-z_][A-Za-z0-9_-]{0,48}['\"]\\s*\\)",
            Pattern.CASE_INSENSITIVE);

    /** Strip quotes so SECRET_TERMS does not match inside {@code "hash"} / {@code "token"}. */
    private static final Pattern STRING_LITERALS = Pattern.compile(
            "\"([^\"\\\\]|\\\\.)*\"|'([^'\\\\]|\\\\.)*'");

    private static final Pattern COMPARISON = Pattern.compile(
            "\\.(equals|equalsIgnoreCase|compareTo)\\s*\\(|==|===|!=|!==",
            Pattern.CASE_INSENSITIVE);

    @Override
    public boolean supports(SastRuleMetadata metadata) {
        return metadata != null && metadata.family() == VulnerabilityFamily.TIMING_SIDE_CHANNEL;
    }

    @Override
    public FindingEvidence build(Item item, CodeContextExtractor.CodeContext context, SastRuleMetadata metadata) {
        // Classify from code only — Bearer title/description often contain "secret"/"token"
        // boilerplate and would falsely mark every CWE-208 finding as security_sensitive.
        String codeText = codeText(item, context);
        String comparisonKind = detectComparisonKind(codeText);
        boolean hasConstantTime = CONSTANT_TIME.matcher(codeText).find();
        boolean hasComparison = COMPARISON.matcher(codeText).find();

        List<String> notes = new ArrayList<>();
        notes.add("CWE-208 is a timing side-channel issue, not information disclosure.");
        notes.add("TRUE_POSITIVE requires a time-variable comparison of secret/credential values observable by an attacker.");
        notes.add("UI routing, feature flags, Math.random jitter, scheduling, and non-secret equality checks are FALSE_POSITIVE.");
        if ("non_security".equals(comparisonKind)) {
            notes.add("Detected non-security comparison (UI route/tokenizer discriminator/feature flag/scheduling/boolean/presence/typeof). Prefer FALSE_POSITIVE.");
        } else if ("security_sensitive".equals(comparisonKind) && !hasConstantTime) {
            notes.add("Security-sensitive comparison without constant-time API evidence. Prefer TRUE_POSITIVE when attacker can observe timing.");
        } else if ("security_sensitive".equals(comparisonKind) && hasConstantTime) {
            notes.add("Constant-time comparison API detected. Prefer FALSE_POSITIVE.");
        } else {
            notes.add("Compared value sensitivity is unclear from local evidence; use UNCERTAIN only if secret vs non-secret cannot be determined.");
        }

        String key = consistencyKey(metadata, item, comparisonKind);
        return new FindingEvidence(
                true,
                metadata,
                detectExecutionContext(item, context),
                "Timing side-channel finding classified by compared-value sensitivity and constant-time protection.",
                FindingEvidence.attributes(
                        "comparison_kind", comparisonKind,
                        "has_comparison", Boolean.toString(hasComparison),
                        "constant_time_api", Boolean.toString(hasConstantTime)),
                TaintTrace.notRequired("timing side-channels require secret comparison analysis more than full taint"),
                notes,
                key);
    }

    String detectComparisonKind(String codeText) {
        if (codeText == null || codeText.isBlank()) {
            return "unknown";
        }
        // Boolean config checks win even if a nearby identifier contains "token"/"secret".
        if (BOOLEAN_LITERAL_COMPARE.matcher(codeText).find()) {
            return "non_security";
        }
        // typeof / length / null / empty checks alone are not secret equality comparisons.
        String withoutPresence = PRESENCE_OR_TYPE_CHECK.matcher(codeText).replaceAll(" ");
        boolean presenceOrType = !withoutPresence.equals(codeText);
        boolean remainingComparison = COMPARISON.matcher(withoutPresence).find();
        if (presenceOrType && !remainingComparison) {
            return "non_security";
        }
        // Ignore secret vocabulary that appears only inside quotes (type == "hash").
        String withoutQuotes = STRING_LITERALS.matcher(codeText).replaceAll("\"\"");
        boolean secretOutsideQuotes = SECRET_TERMS.matcher(withoutQuotes).find();
        boolean literalDiscriminator = STRING_LITERAL_DISCRIMINATOR.matcher(codeText).find();
        if (literalDiscriminator && !secretOutsideQuotes) {
            return "non_security";
        }
        boolean nonSecurity = NON_SECURITY_COMPARE.matcher(codeText).find();
        if (nonSecurity && !secretOutsideQuotes) {
            return "non_security";
        }
        if (secretOutsideQuotes) {
            return "security_sensitive";
        }
        if (nonSecurity) {
            return "non_security";
        }
        return "unknown";
    }

    private ExecutionContext detectExecutionContext(Item item, CodeContextExtractor.CodeContext context) {
        String filename = item == null ? "" : java.util.Optional.ofNullable(item.getFilename())
                .orElse(java.util.Optional.ofNullable(item.getFullFilename()).orElse(""));
        String lowerPath = filename.replace('\\', '/').toLowerCase(Locale.ROOT);
        String language = context == null || context.language() == null ? "" : context.language();
        if (lowerPath.contains("/test/") || lowerPath.contains("/tests/")) {
            return ExecutionContext.TEST_CODE;
        }
        if ("javascript".equals(language) || "typescript".equals(language)
                || lowerPath.contains("frontend/") || lowerPath.endsWith(".js") || lowerPath.endsWith(".ts")) {
            return ExecutionContext.WEB_CLIENT;
        }
        if ("java".equals(language) || lowerPath.endsWith(".java") || lowerPath.contains("backend/")) {
            return ExecutionContext.SERVER_SIDE;
        }
        return ExecutionContext.UNKNOWN;
    }

    private String consistencyKey(SastRuleMetadata metadata, Item item, String comparisonKind) {
        String file = item == null ? "" : java.util.Optional.ofNullable(item.getFilename())
                .orElse(java.util.Optional.ofNullable(item.getFullFilename()).orElse(""));
        String rule = metadata.ruleId() == null ? metadata.family().name() : metadata.ruleId();
        return String.join("|", rule, file, "timing", comparisonKind);
    }

    private String codeText(Item item, CodeContextExtractor.CodeContext context) {
        return String.join("\n",
                item == null || item.getCodeExtract() == null ? "" : item.getCodeExtract(),
                context == null || context.functionBody() == null ? "" : context.functionBody(),
                context == null || context.localSnippet() == null ? "" : context.localSnippet());
    }
}
