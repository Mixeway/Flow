package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Helpers for JWT signature-verification findings (CWE-347): detect weak remediations
 * and produce language-idiomatic fixes that explicitly enable signature verification
 * (key/secret + algorithms allowlist + verify flag / verifying API).
 */
final class JwtVerificationRemediation {

    private static final Pattern BARE_JWT_DECODE = Pattern.compile("jwt\\.decode\\s*\\(\\s*\\w+\\s*\\)");
    private static final Pattern BARE_DECODE_TOKEN = Pattern.compile("decode\\s*\\(\\s*token\\s*\\)");
    private static final Pattern DECODE_SECOND_ARG = Pattern.compile("decode\\s*\\(\\s*\\w+\\s*,\\s*[^)\\s,]");
    private static final Pattern EXPLICIT_VERIFY_SIGNATURE_TRUE = Pattern.compile(
            "verify_signature\"?\\s*[:=]\\s*true", Pattern.CASE_INSENSITIVE);
    /** Ruby JWT.decode(token, secret, true, ...) — 3rd positional arg enables verification. */
    private static final Pattern RUBY_VERIFY_TRUE = Pattern.compile(
            "jwt\\.decode\\s*\\(\\s*[^,]+,\\s*[^,]+,\\s*true\\b", Pattern.CASE_INSENSITIVE);
    private static final Pattern CSHARP_REQUIRE_SIGNATURE = Pattern.compile(
            "requiresignature(?:confirmation)?\\s*=\\s*true", Pattern.CASE_INSENSITIVE);

    private JwtVerificationRemediation() {
    }

    static boolean looksLikeWeakRemediation(String remediationCode) {
        if (remediationCode == null || remediationCode.isBlank()) {
            return false;
        }
        String lower = remediationCode.toLowerCase(Locale.ROOT);
        if (!(lower.contains("jwt") || lower.contains("verify_signature") || lower.contains("decode(")
                || lower.contains("validatetoken") || lower.contains("parseclaims"))) {
            return false;
        }
        if (looksLikeStrongRemediation(lower)) {
            return false;
        }
        boolean hasExplicitVerifyTrue = hasExplicitVerifyEnabled(lower);
        boolean bareDecode = BARE_JWT_DECODE.matcher(lower).find()
                || BARE_DECODE_TOKEN.matcher(lower).find()
                || lower.contains("jwtdecode(")
                || lower.contains("parseclaimsjwt("); // JJWT unsigned parse
        boolean onlyRemoveBypass = (lower.contains("remove") || lower.contains("removing")
                || lower.contains("without") || lower.contains("enable signature"))
                && lower.contains("verify_signature")
                && !hasExplicitVerifyTrue;
        boolean incompleteVerifyApi = lower.contains("jwt.decode")
                || lower.contains("jwt.verify")
                || lower.contains("jwt::decode")
                || lower.contains("validatetoken")
                || lower.contains("parseclaims")
                || lower.contains("jwt.parse");
        return bareDecode || onlyRemoveBypass || incompleteVerifyApi
                || (lower.contains("jwt") && (lower.contains("decode") || lower.contains("verify_signature")));
    }

    static boolean looksLikeStrongRemediation(String remediationCode) {
        if (remediationCode == null || remediationCode.isBlank()) {
            return false;
        }
        String lower = remediationCode.toLowerCase(Locale.ROOT);
        boolean hasKey = hasKeyMaterial(lower);
        boolean hasAlgorithms = lower.contains("algorithms") || lower.contains("algorithm")
                || lower.contains("signingmethod") || lower.contains("hs256")
                || lower.contains("rs256") || lower.contains("new key(");
        boolean explicitVerify = hasExplicitVerifyEnabled(lower);

        // Python / generic PyJWT-style decode
        if (lower.contains("jwt.decode") && hasKey && hasAlgorithms && explicitVerify) {
            return true;
        }
        // JavaScript / TypeScript: jwt.verify verifies by API contract
        if (lower.contains("jwt.verify") && hasKey && hasAlgorithms) {
            return true;
        }
        // Java / Kotlin JJWT: parseClaimsJws requires a signature
        if (lower.contains("parseclaimsjws") && (hasKey || lower.contains("setsigningkey"))) {
            return true;
        }
        // Go jose/jwt: Parse with key func + method allowlist
        if ((lower.contains("jwt.parse") || lower.contains("jwt.parsewithclaims"))
                && hasKey
                && (lower.contains("signingmethod") || hasAlgorithms)) {
            return true;
        }
        // PHP firebase/php-jwt: JWT::decode + Key(alg)
        if (lower.contains("jwt::decode") && hasKey && hasAlgorithms) {
            return true;
        }
        // Ruby: JWT.decode(token, secret, true, algorithm: ...)
        if (RUBY_VERIFY_TRUE.matcher(lower).find() && hasKey && hasAlgorithms) {
            return true;
        }
        // C#: ValidateToken with RequireSignature = true
        if (lower.contains("validatetoken") && hasKey
                && (CSHARP_REQUIRE_SIGNATURE.matcher(lower).find()
                || lower.contains("tokenvalidationparameters"))) {
            return true;
        }
        return false;
    }

    static boolean looksLikeWeakRecommendation(String recommendation) {
        if (recommendation == null || recommendation.isBlank()) {
            return false;
        }
        String lower = recommendation.toLowerCase(Locale.ROOT);
        if (!(lower.contains("jwt") || lower.contains("verify_signature") || lower.contains("signature"))) {
            return false;
        }
        if (looksLikeStrongRemediation(lower)) {
            return false;
        }
        boolean mentionsKey = lower.contains("key") || lower.contains("secret") || lower.contains("algorithms");
        boolean mentionsExplicitVerify = hasExplicitVerifyEnabled(lower)
                || lower.contains("jwt.verify")
                || lower.contains("parseclaimsjws")
                || lower.contains("validatetoken")
                || lower.contains("requiresignature");
        boolean onlyRemoveOption = (lower.contains("remove") || lower.contains("removing")
                || lower.contains("enable signature"))
                && lower.contains("verify_signature")
                && (!mentionsKey || !mentionsExplicitVerify);
        return onlyRemoveOption || looksLikeWeakRemediation(recommendation);
    }

    static String recommendation() {
        return "Enable real JWT signature verification at this call site: reuse the project signing "
                + "key/secret, allowlist algorithms (reject 'none'), and turn verification on explicitly "
                + "(Python: options={\"verify_signature\": True}; Ruby: JWT.decode(..., true, ...); "
                + "JS/TS: jwt.verify; Java: parseClaimsJws + setSigningKey; "
                + "C#: ValidateToken with RequireSignature=true). "
                + "Do not only remove verify_signature=False. Never hardcode a new secret. "
                + "If this helper is claim-peek-only and a separate verified decode already gates authentication, "
                + "keep peeking unverified and ensure every trust decision uses the verified path.";
    }

    static String remediationCode(String language, String flaggedExtract) {
        String tokenVar = extractTokenVariable(flaggedExtract);
        return switch (language == null ? "" : language) {
            case "python" ->
                    "payload = jwt.decode(\n"
                            + "    " + tokenVar + ",\n"
                            + "    key=JWT_SECRET,  # reuse project secret/config; do not hardcode\n"
                            + "    algorithms=[\"HS256\"],  # allowlist expected algs; reject 'none'\n"
                            + "    options={\"verify_signature\": True},  # must be explicit True\n"
                            + ")";
            case "javascript", "typescript" ->
                    "// Use jwt.verify (not jwt.decode) — verification is mandatory\n"
                            + "const payload = jwt.verify(" + tokenVar + ", JWT_SECRET, {\n"
                            + "  algorithms: ['HS256'],  // allowlist; reject 'none'\n"
                            + "});";
            case "java", "kotlin" ->
                    "// parseClaimsJws verifies signature; do NOT use parseClaimsJwt (unsigned)\n"
                            + "Claims payload = Jwts.parserBuilder()\n"
                            + "    .setSigningKey(jwtSecretKey) // reuse project key material\n"
                            + "    .build()\n"
                            + "    .parseClaimsJws(" + tokenVar + ")\n"
                            + "    .getBody();";
            case "go" ->
                    "token, err := jwt.Parse(" + tokenVar + ", func(t *jwt.Token) (interface{}, error) {\n"
                            + "    // Explicit alg allowlist — reject 'none' / unexpected methods\n"
                            + "    if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {\n"
                            + "        return nil, fmt.Errorf(\"unexpected signing method: %v\", t.Header[\"alg\"])\n"
                            + "    }\n"
                            + "    return []byte(jwtSecret), nil // reuse project secret; verification enabled\n"
                            + "})\nif err != nil || !token.Valid {\n"
                            + "    return err // signature/claims verification failed\n"
                            + "}";
            case "php" ->
                    "// JWT::decode verifies signature when Key + algorithm are supplied\n"
                            + "$payload = JWT::decode(" + tokenVar + ", new Key($jwtSecret, 'HS256'));";
            case "ruby" ->
                    "# 3rd arg `true` enables signature verification (must not be false)\n"
                            + "payload = JWT.decode(" + tokenVar + ", jwt_secret, true, algorithm: 'HS256').first";
            case "csharp" ->
                    "var validationParameters = new TokenValidationParameters {\n"
                            + "    ValidateIssuerSigningKey = true,\n"
                            + "    IssuerSigningKey = jwtSecretKey, // reuse project key material\n"
                            + "    ValidateIssuer = true,\n"
                            + "    ValidateAudience = true,\n"
                            + "    RequireSignedTokens = true, // explicit signature required\n"
                            + "    ValidAlgorithms = new[] { SecurityAlgorithms.HmacSha256 }\n"
                            + "};\n"
                            + "var payload = new JwtSecurityTokenHandler()\n"
                            + "    .ValidateToken(" + tokenVar + ", validationParameters, out _);";
            default ->
                    "payload = jwt.decode(\n"
                            + "    " + tokenVar + ",\n"
                            + "    key=JWT_SECRET,\n"
                            + "    algorithms=[\"HS256\"],\n"
                            + "    options={\"verify_signature\": True},\n"
                            + ")";
        };
    }

    static String extractTokenVariable(String extract) {
        if (extract == null || extract.isBlank()) {
            return "token";
        }
        Matcher m = Pattern.compile(
                "(?i)(?:jwt\\.)?decode\\s*\\(\\s*([A-Za-z_$@][\\w.]*)").matcher(extract);
        if (m.find()) {
            return m.group(1);
        }
        m = Pattern.compile("(?i)(?:jwt\\.)?verify\\s*\\(\\s*([A-Za-z_$@][\\w.]*)").matcher(extract);
        if (m.find()) {
            return m.group(1);
        }
        m = Pattern.compile("(?i)parseclaimsjw[st]\\s*\\(\\s*([A-Za-z_][\\w.]*)").matcher(extract);
        if (m.find()) {
            return m.group(1);
        }
        m = Pattern.compile("(?i)validatetoken\\s*\\(\\s*([A-Za-z_][\\w.]*)").matcher(extract);
        if (m.find()) {
            return m.group(1);
        }
        return "token";
    }

    private static boolean hasKeyMaterial(String lower) {
        return lower.contains("key=") || lower.contains("key =")
                || lower.contains("secret") || lower.contains("signing_key")
                || lower.contains("signingkey") || lower.contains("jwt_secret")
                || lower.contains("jwtsecret") || lower.contains("public_key")
                || lower.contains("private_key") || lower.contains(", key")
                || lower.contains("setsigningkey") || lower.contains("issuersigningkey")
                || lower.contains("new key(")
                || DECODE_SECOND_ARG.matcher(lower).find();
    }

    private static boolean hasExplicitVerifyEnabled(String lower) {
        return EXPLICIT_VERIFY_SIGNATURE_TRUE.matcher(lower).find()
                || RUBY_VERIFY_TRUE.matcher(lower).find()
                || CSHARP_REQUIRE_SIGNATURE.matcher(lower).find()
                || lower.contains("requiresignedtokens = true")
                || lower.contains("requiresignedtokens=true");
    }
}
