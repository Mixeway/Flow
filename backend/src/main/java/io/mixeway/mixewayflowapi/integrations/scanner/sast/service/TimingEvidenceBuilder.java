package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.regex.Pattern;

/**
 * Evidence builder for CWE-208 observable timing / side-channel findings.
 * Distinguishes obvious non-secret comparisons (typeof/empty/UI) from possible
 * secret compares. Username/email are left to the model: a login early-return
 * is user enumeration (TRUE_POSITIVE); an admin uniqueness check is not.
 */
@Component
@Order(25)
public class TimingEvidenceBuilder implements SastEvidenceBuilder {

    /**
     * Hint-only: names that often appear in real secret compares. Used to label
     * {@code security_sensitive}, never to force TRUE_POSITIVE.
     */
    private static final Pattern SECRET_TERMS = Pattern.compile(
            "\\b(password|passwd|pwd|secret|token|api[_-]?key|credential|hmac|signature|hash|digest|"
                    + "session[_-]?id|auth|bearer|private[_-]?key|otp|pin)\\b"
                    + "|(?<=[a-z])(token|secret|password|hash|digest|auth|bearer|signature|credential)\\b",
            Pattern.CASE_INSENSITIVE);

    /** Real credential words — if present, do not treat username/email as the whole story. */
    private static final Pattern CREDENTIAL_COMPARE_TERMS = Pattern.compile(
            "\\b(password|passwd|pwd|hmac|otp|secret|private[_-]?key)\\b",
            Pattern.CASE_INSENSITIVE);

    /**
     * Public protocol / CDN identifiers — not login oracles.
     * Username/email/login stay out: an auth early-return on those fields enumerates accounts.
     */
    private static final Pattern NON_SECRET_IDENTITY = Pattern.compile(
            "\\b(public[_-]?id|oauth[_-]?token)\\b",
            Pattern.CASE_INSENSITIVE);

    /**
     * {@code user == null} / {@code username == null} on an auth path can be an enumeration
     * oracle. Do not auto-FP those; leave them to the model. {@code password == null} stays
     * a presence check (handled via CREDENTIAL_COMPARE_TERMS).
     */
    private static final Pattern USER_RECORD_PRESENCE = Pattern.compile(
            "\\b(users?|account|user[_-]?name|username|email)\\b[^\\n;]{0,80}(?:==|===|!=|!==)\\s*(?:null|undefined)"
                    + "|(?:==|===|!=|!==)\\s*(?:null|undefined)[^\\n;]{0,80}\\b(users?|account|user[_-]?name|username|email)\\b",
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

    private static final Pattern BLOCK_COMMENT = Pattern.compile("/\\*.*?\\*/", Pattern.DOTALL);
    private static final Pattern LINE_COMMENT = Pattern.compile("(?m)//.*?$");

    /**
     * Model said the compare is not a CWE-208 secret compare. Used to stop TRUE_POSITIVE
     * when reasoning and verdict disagree.
     */
    private static final Pattern REASONING_DENIES_SECRET_COMPARE = Pattern.compile(
            "(?i)(?:\\bnot\\b|\\bn'?t\\b|\\bdoes not\\b|\\bis not\\b|\\bare not\\b)\\s+"
                    + "(?:a\\s+|an\\s+|considered\\s+)?"
                    + "(?:security[- ]sensitive|secret|credential|cwe-208)"
                    + "|\\bnon-security\\b"
                    + "|\\bstructural validation\\b"
                    + "|\\btype(?:of)? check\\b"
                    + "|\\bpresence check\\b"
                    + "|\\bpublic identifier\\b"
                    + "|\\bdoes not fall under\\b.{0,40}cwe-208"
                    + "|\\bnot\\b.{0,40}\\bsecret comparison\\b"
                    + "|\\bdoes not involve\\b.{0,40}(?:secret|credential)");

    /** Login/forgot-password oracle — do not coerce those reasonings to FALSE_POSITIVE. */
    private static final Pattern ENUMERATION_CLAIM = Pattern.compile(
            "(?i)\\benumerat|\\buser exists\\b|\\baccount exists\\b|\\boracle\\b"
                    + "|\\bforgot.?password\\b|\\bvalid user\\b|\\bunknown user\\b");

    private static final Pattern COMPARISON = Pattern.compile(
            "\\.(equals|equalsIgnoreCase|compareTo)\\s*\\(|==|===|!=|!==",
            Pattern.CASE_INSENSITIVE);

    @Override
    public boolean supports(SastRuleMetadata metadata) {
        return metadata != null && metadata.family() == VulnerabilityFamily.TIMING_SIDE_CHANNEL;
    }

    @Override
    public FindingEvidence build(Item item, CodeContextExtractor.CodeContext context, SastRuleMetadata metadata) {
        // Classify the flagged extract only — Bearer title/description and the rest of the
        // function often contain "secret"/"token"/"signature" boilerplate.
        String extract = flaggedExtract(item, context);
        String comparisonKind = detectComparisonKind(extract);
        String surrounding = surroundingText(item, context);
        boolean hasConstantTime = CONSTANT_TIME.matcher(extract).find()
                || CONSTANT_TIME.matcher(surrounding).find();
        boolean hasComparison = COMPARISON.matcher(stripComments(extract)).find();

        List<String> notes = new ArrayList<>();
        notes.add("CWE-208 is a timing side-channel issue, not information disclosure.");
        notes.add("TRUE_POSITIVE only when the flagged extract compares secret/credential values "
                + "and an attacker can observe the timing. Judge the extract; identifier names "
                + "(token/hash/password/username) in comments or nearby lines are not proof.");
        notes.add("typeof/empty/presence, UI routing, tokenizer discriminators, oauth_token, and public_id "
                + "are FALSE_POSITIVE. Username/email: TRUE_POSITIVE when the extract is a login/forgot-password "
                + "oracle (early return if user missing, different timing than bad password); FALSE_POSITIVE for "
                + "admin uniqueness or display-name checks. Enumeration fix is dummy password hash + identical "
                + "response, not timingSafeEqual(username).");
        if ("non_security".equals(comparisonKind)) {
            notes.add("Detected non-security comparison (presence/typeof/UI/tokenizer/public id). "
                    + "FALSE_POSITIVE.");
        } else if ("security_sensitive".equals(comparisonKind) && hasConstantTime) {
            notes.add("Constant-time comparison API detected. FALSE_POSITIVE.");
        } else if ("security_sensitive".equals(comparisonKind)) {
            notes.add("Flagged extract mentions a credential-like identifier. This is a hint only — "
                    + "decide TRUE_POSITIVE vs FALSE_POSITIVE from whether the comparison is a secret "
                    + "value check observable by an attacker, not from the identifier name.");
        } else {
            notes.add("Compared value sensitivity is unclear from the extract. For username/email, "
                    + "TRUE_POSITIVE if this is a login/forgot-password oracle; FALSE_POSITIVE if it is "
                    + "uniqueness or display-name logic. Use UNCERTAIN only if that cannot be determined.");
        }

        String key = consistencyKey(metadata, item, comparisonKind);
        return new FindingEvidence(
                true,
                metadata,
                detectExecutionContext(item, context),
                "Timing side-channel finding classified from the flagged extract; the model decides TRUE_POSITIVE.",
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
        String extract = stripComments(codeText);
        // Boolean config checks win even if a nearby identifier contains "token"/"secret".
        if (BOOLEAN_LITERAL_COMPARE.matcher(extract).find()) {
            return "non_security";
        }
        // typeof / length / null / empty checks alone are not secret equality comparisons.
        String withoutPresence = PRESENCE_OR_TYPE_CHECK.matcher(extract).replaceAll(" ");
        boolean presenceOrType = !withoutPresence.equals(extract);
        boolean remainingComparison = COMPARISON.matcher(withoutPresence).find();
        if (presenceOrType && !remainingComparison) {
            if (USER_RECORD_PRESENCE.matcher(extract).find()
                    && !CREDENTIAL_COMPARE_TERMS.matcher(extract).find()) {
                return "unknown";
            }
            return "non_security";
        }
        // UI / tokenizer / location.hash win over the word "hash" or "token" in the same extract.
        if (NON_SECURITY_COMPARE.matcher(extract).find()) {
            return "non_security";
        }
        String withoutQuotes = STRING_LITERALS.matcher(extract).replaceAll("\"\"");
        if (NON_SECRET_IDENTITY.matcher(withoutQuotes).find()
                && !CREDENTIAL_COMPARE_TERMS.matcher(withoutQuotes).find()) {
            return "non_security";
        }
        boolean secretOutsideQuotes = SECRET_TERMS.matcher(withoutQuotes).find();
        boolean literalDiscriminator = STRING_LITERAL_DISCRIMINATOR.matcher(extract).find();
        if (literalDiscriminator && !secretOutsideQuotes) {
            return "non_security";
        }
        if (secretOutsideQuotes) {
            return "security_sensitive";
        }
        return "unknown";
    }

    /**
     * True when the model already explained that the flagged compare is not a CWE-208
     * secret comparison. Verdict must not stay TRUE_POSITIVE in that case.
     */
    static boolean reasoningDeniesSecretCompare(String reasoning) {
        if (reasoning == null || reasoning.isBlank()) {
            return false;
        }
        if (ENUMERATION_CLAIM.matcher(reasoning).find()) {
            return false;
        }
        return REASONING_DENIES_SECRET_COMPARE.matcher(reasoning).find();
    }

    static String stripComments(String code) {
        if (code == null || code.isBlank()) {
            return "";
        }
        String withoutBlock = BLOCK_COMMENT.matcher(code).replaceAll(" ");
        return LINE_COMMENT.matcher(withoutBlock).replaceAll(" ");
    }

    private String flaggedExtract(Item item, CodeContextExtractor.CodeContext context) {
        String extract = item == null ? "" : Optional.ofNullable(item.getCodeExtract()).orElse("");
        if (!extract.isBlank()) {
            return extract;
        }
        if (context == null) {
            return "";
        }
        return Optional.ofNullable(context.localSnippet()).orElse("");
    }

    private String surroundingText(Item item, CodeContextExtractor.CodeContext context) {
        return String.join("\n",
                item == null || item.getCodeExtract() == null ? "" : item.getCodeExtract(),
                context == null || context.functionBody() == null ? "" : context.functionBody(),
                context == null || context.localSnippet() == null ? "" : context.localSnippet());
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
}
