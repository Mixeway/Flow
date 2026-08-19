package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

@Component
@Order(10)
public class CryptoEvidenceBuilder implements SastEvidenceBuilder {

    private static final Pattern ECB_PATTERN = Pattern.compile("\\bECB\\b|AES\\s*/\\s*ECB", Pattern.CASE_INSENSITIVE);
    private static final Pattern CBC_PATTERN = Pattern.compile("\\bCBC\\b|AES\\s*/\\s*CBC", Pattern.CASE_INSENSITIVE);
    private static final Pattern WEAK_HASH_PATTERN = Pattern.compile("\\b(MD5|SHA-?1)\\b", Pattern.CASE_INSENSITIVE);
    private static final Pattern RANDOM_PRIMITIVE = Pattern.compile(
            "\\brandom\\.(?:randint|random|choice|sample|randrange|uniform|getrandbits)\\b"
                    + "|\\bMath\\.random\\b"
                    + "|\\bnew\\s+Random\\s*\\("
                    + "|\\bSystem\\.currentTimeMillis\\s*\\(\\s*\\)\\s*%"
                    + "|\\buuid\\.uuid4\\b",
            Pattern.CASE_INSENSITIVE);
    /**
     * Non-security sinks for weak PRNG: delays, jitter, sampling, UI, fake-data generators — not tokens/keys.
     */
    static final Pattern NON_SECURITY_RANDOM_USE = Pattern.compile(
            "asyncio\\.sleep|time\\.sleep|Thread\\.sleep|setTimeout|setInterval"
                    + "|\\bsleep\\s*\\(|\\bjitter\\b|\\bbackoff\\b|\\bdelay\\b"
                    + "|load.?balanc|sampling|sample.?rate|cleanup"
                    + "|test.?data|fixture|dummy|mock|animation|shuffle"
                    + "|random_data|create_fake_|\\bfake_[a-z0-9_]+|populate.?data|placeholder"
                    + "|usage_telemetry|telemetry",
            Pattern.CASE_INSENSITIVE);
    static final Pattern SECURITY_RANDOM_USE = Pattern.compile(
            "(?:^|[^A-Za-z0-9])(?:password|passwd|secret|(?:[A-Za-z0-9_]*_)?token|api[_-]?key|"
                    + "credential|salt|nonce|session(?:[_-]?id|_token)?|otp|csrf|iv|"
                    + "private[_-]?key|encryption[_-]?key|signing[_-]?key)(?:[^A-Za-z0-9]|$)",
            Pattern.CASE_INSENSITIVE);

    @Override
    public boolean supports(SastRuleMetadata metadata) {
        return metadata != null && (metadata.family() == VulnerabilityFamily.WEAK_CRYPTO
                || metadata.family() == VulnerabilityFamily.WEAK_HASH
                || metadata.family() == VulnerabilityFamily.INSUFFICIENT_RANDOM);
    }

    @Override
    public FindingEvidence build(Item item, CodeContextExtractor.CodeContext context, SastRuleMetadata metadata) {
        String combined = combinedText(item, context);
        // Purpose from code + path — Bearer titles/descriptions often mention tokens/keys generically.
        // Filename catches create_fake_* / random_data generators when the extract is only random.choice(...).
        String codeForPurpose = codeText(item, context) + "\n" + filePathOf(item);
        String mode = detectMode(combined);
        String primitive = detectPrimitive(combined);
        String purposeHint = securityPurposeHint(codeForPurpose, metadata);

        List<String> notes = new ArrayList<>();
        if ("ECB".equals(mode)) {
            notes.add("ECB mode is deterministic and should be treated as TRUE_POSITIVE in production cryptographic code.");
        }
        if ("CBC".equals(mode)) {
            notes.add("CBC requires a unique unpredictable IV and authentication; unauthenticated CBC should not be downgraded without strong code evidence.");
        }
        if ("MD5/SHA1".equals(primitive)) {
            notes.add("MD5/SHA-1 are TRUE_POSITIVE for password hashing, token security, signatures, or tamper-resistant integrity; "
                    + "they are FALSE_POSITIVE for cache keys, query fingerprints, checksums, and etags.");
            if ("possibly_non_security".equals(purposeHint) || "non_security".equals(purposeHint)) {
                notes.add("Detected non-security hash purpose (cache/fingerprint/checksum). Prefer FALSE_POSITIVE.");
            }
        }
        if ("RANDOM".equals(primitive)) {
            notes.add("CWE-330/338: TRUE_POSITIVE only when predictable PRNG output protects security-sensitive values "
                    + "(tokens, keys, salts, session ids, nonces).");
            notes.add("Sleep/jitter/scheduling delays, sampling, UI ids, shuffle, and test data are FALSE_POSITIVE.");
        }
        if ("non_security".equals(purposeHint)) {
            notes.add("Detected non-security purpose (sleep/jitter/scheduling/checksum/cache). Prefer FALSE_POSITIVE.");
        } else if ("security_sensitive".equals(purposeHint)) {
            notes.add("Detected security-sensitive purpose. Prefer TRUE_POSITIVE unless a CSPRNG is proven.");
        }
        if (looksLikeJwtVerificationBypass(combined)) {
            notes.add("JWT verification bypass: distinguish claim-peek helpers (owner/type classification only) "
                    + "with a later verified decode on the auth path (possible FALSE_POSITIVE) from "
                    + "unverified claims used for authentication/authorization (TRUE_POSITIVE).");
            notes.add("Remediation must use the language verifying API with key + algorithms + explicit "
                    + "verify-on (Python verify_signature=True, Ruby decode(..., true), JS jwt.verify, "
                    + "Java parseClaimsJws, C# RequireSignedTokens=true); bare decode alone is invalid.");
        }
        notes.add("Do not require attacker-controlled input to confirm weak cryptographic primitives.");

        String summary = "Cryptographic finding classified before LLM review; evaluate primitive/mode and security purpose before source taint.";
        String key = String.join("|", metadata.family().name(), primitive, mode, purposeHint, normalizedCode(item));
        return new FindingEvidence(
                true,
                metadata,
                ExecutionContext.UNKNOWN,
                summary,
                FindingEvidence.attributes(
                        "primitive", primitive,
                        "mode", mode,
                        "security_purpose_hint", purposeHint),
                TaintTrace.notRequired("cryptographic primitive/mode findings do not require user-controlled source evidence"),
                notes,
                key);
    }

    private String combinedText(Item item, CodeContextExtractor.CodeContext context) {
        return String.join("\n",
                item == null || item.getTitle() == null ? "" : item.getTitle(),
                item == null || item.getDescription() == null ? "" : item.getDescription(),
                codeText(item, context));
    }

    private String codeText(Item item, CodeContextExtractor.CodeContext context) {
        return String.join("\n",
                item == null || item.getCodeExtract() == null ? "" : item.getCodeExtract(),
                context == null || context.functionBody() == null ? "" : context.functionBody(),
                context == null || context.localSnippet() == null ? "" : context.localSnippet());
    }

    private String detectMode(String text) {
        if (ECB_PATTERN.matcher(text).find()) {
            return "ECB";
        }
        if (CBC_PATTERN.matcher(text).find()) {
            return "CBC";
        }
        return "unknown";
    }

    String detectPrimitive(String text) {
        if (WEAK_HASH_PATTERN.matcher(text).find()) {
            return "MD5/SHA1";
        }
        String lower = text == null ? "" : text.toLowerCase(Locale.ROOT);
        if (looksLikeJwtVerificationBypass(lower)) {
            return "JWT";
        }
        if (RANDOM_PRIMITIVE.matcher(text == null ? "" : text).find()
                || lower.contains("pseudo-random")
                || lower.contains("prng")
                || lower.contains("weak random")) {
            return "RANDOM";
        }
        if (lower.contains("aes")) {
            return "AES";
        }
        if (lower.contains("des")) {
            return "DES";
        }
        return "unknown";
    }

    private boolean looksLikeJwtVerificationBypass(String text) {
        if (text == null || text.isBlank()) {
            return false;
        }
        String lower = text.toLowerCase(Locale.ROOT);
        return lower.contains("verify_signature")
                || (lower.contains("jwt") && (lower.contains("decode") || lower.contains("unsigned")
                || (lower.contains("algorithm") && lower.contains("none"))));
    }

    String securityPurposeHint(String text, SastRuleMetadata metadata) {
        String source = text == null ? "" : text;
        String lower = source.toLowerCase(Locale.ROOT);
        boolean insufficientRandom = metadata != null
                && metadata.family() == VulnerabilityFamily.INSUFFICIENT_RANDOM;

        // Prefer code-shaped non-security sinks over Bearer title boilerplate ("token", "secret").
        if (insufficientRandom || RANDOM_PRIMITIVE.matcher(source).find()) {
            boolean nonSecurityUse = looksLikeNonSecurityRandomUse(source);
            boolean securityUse = looksLikeSecurityRandomUse(source);
            if (nonSecurityUse && !securityUse) {
                return "non_security";
            }
            if (securityUse && !nonSecurityUse) {
                return "security_sensitive";
            }
            if (nonSecurityUse) {
                return "non_security";
            }
            // Weak PRNG call in a fake-data / generator path with no security vocabulary → non_security.
            if (!securityUse && RANDOM_PRIMITIVE.matcher(source).find()
                    && NON_SECURITY_RANDOM_USE.matcher(source).find()) {
                return "non_security";
            }
        }

        // Weak-hash purpose before generic "token" vocabulary (Bearer titles often say "token").
        if (metadata != null && metadata.family() == VulnerabilityFamily.WEAK_HASH) {
            if (lower.contains("checksum") || lower.contains("cache") || lower.contains("etag")
                    || lower.contains("fingerprint") || lower.contains("dedup")) {
                return "possibly_non_security";
            }
            if (lower.contains("password") || lower.contains("passwd") || lower.contains("credential")
                    || lower.contains("password_hash") || lower.contains("check_password")) {
                return "security_sensitive";
            }
        }

        if (lower.contains("password") || lower.contains("credential") || lower.contains("token")
                || lower.contains("signature") || lower.contains("encrypt") || lower.contains("decrypt")
                || lower.contains("salt") || lower.contains("nonce") || lower.contains("session")) {
            return "security_sensitive";
        }
        if (lower.contains("checksum") || lower.contains("cache") || lower.contains("etag")
                || lower.contains("fingerprint")) {
            return "possibly_non_security";
        }
        return "unknown";
    }

    /**
     * Shared detector for CWE-330/338 non-security PRNG use (sleep/jitter/fake data/telemetry).
     */
    static boolean looksLikeNonSecurityRandomUse(String text) {
        if (text == null || text.isBlank()) {
            return false;
        }
        return NON_SECURITY_RANDOM_USE.matcher(text).find() && !looksLikeSecurityRandomUse(text);
    }

    static boolean looksLikeSecurityRandomUse(String text) {
        if (text == null || text.isBlank()) {
            return false;
        }
        return SECURITY_RANDOM_USE.matcher(stripStringLiterals(text)).find();
    }

    /**
     * Avoid matching secret vocabulary that appears only inside quotes.
     * Linear scan instead of regex: {@code replaceAll} on nested {@code (a|b)*} quote patterns
     * StackOverflowError's on large Python files (e.g. random_data.py) and aborts LLM persistence.
     */
    static String stripStringLiterals(String text) {
        if (text == null || text.isBlank()) {
            return "";
        }
        StringBuilder out = new StringBuilder(text.length());
        int i = 0;
        int n = text.length();
        while (i < n) {
            char c = text.charAt(i);
            if (c == '"' || c == '\'') {
                char quote = c;
                out.append('"').append('"');
                i++;
                while (i < n) {
                    char d = text.charAt(i);
                    if (d == '\\' && i + 1 < n) {
                        i += 2;
                        continue;
                    }
                    i++;
                    if (d == quote) {
                        break;
                    }
                }
            } else {
                out.append(c);
                i++;
            }
        }
        return out.toString();
    }

    private static String filePathOf(Item item) {
        if (item == null) {
            return "";
        }
        String path = item.getFilename() != null ? item.getFilename() : item.getFullFilename();
        return path == null ? "" : path;
    }

    private String normalizedCode(Item item) {
        if (item == null || item.getCodeExtract() == null) {
            return "";
        }
        return item.getCodeExtract().replaceAll("\\s+", " ").trim().toLowerCase(Locale.ROOT);
    }
}
