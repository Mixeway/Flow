package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class SastCwePromptGuidanceService {

    private static final Map<String, List<String>> CWE_GUIDANCE = buildCweGuidance();
    private static final Map<VulnerabilityFamily, List<String>> FAMILY_GUIDANCE = buildFamilyGuidance();

    public String buildGuidance(SastRuleMetadata metadata) {
        if (metadata == null || metadata.cweIds() == null || metadata.cweIds().isEmpty()) {
            return "";
        }

        StringBuilder sb = new StringBuilder();
        sb.append("## CWE-specific review guidance\n");
        sb.append("Apply the checklist for every CWE attached to this finding before deciding the verdict.\n");
        sb.append("Remediation (all CWEs): when TRUE_POSITIVE, remediation_code must rewrite the flagged code extract ");
        sb.append("and nearby local context — same identifiers, call site, and sink. Do not invent a standalone textbook ");
        sb.append("example with placeholder names (expected/actual/userInput) unless those exact names appear in the finding.\n");
        for (String cwe : metadata.cweIds()) {
            String normalized = normalizeCwe(cwe);
            List<String> checks = CWE_GUIDANCE.getOrDefault(normalized,
                    FAMILY_GUIDANCE.getOrDefault(metadata.family(), FAMILY_GUIDANCE.get(VulnerabilityFamily.GENERAL)));
            sb.append("CWE-").append(normalized).append(" checklist:\n");
            for (String check : checks) {
                sb.append("- ").append(check).append('\n');
            }
        }
        sb.append('\n');
        return sb.toString();
    }

    private String normalizeCwe(String cwe) {
        if (cwe == null || cwe.isBlank()) {
            return "unknown";
        }
        return cwe.toUpperCase(java.util.Locale.ROOT).replace("CWE-", "").trim();
    }

    private static Map<String, List<String>> buildCweGuidance() {
        Map<String, List<String>> guidance = new LinkedHashMap<>();
        guidance.put("22", List.of(
                "Identify the exact path value, its source, and the filesystem sink in the language at hand "
                        + "(Python Path/open/shutil; Java Paths/Files/FileInputStream; Node fs/path; Go os/filepath; "
                        + "PHP fopen/file_get_contents/unlink; .NET File/Path; Ruby File/FileUtils; Rust std::fs).",
                "Trace through local aliases to object/model fields/getters "
                        + "(self.input_doc.original_file, document.source_path, doc.getSourcePath(), "
                        + "file.originalFilename, $doc->filename) and then to field/property assignment + object "
                        + "construction — do not stop at a constructor/plugin/method parameter.",
                "TRUE_POSITIVE requires user-controlled path input (upload, consume/watch directory, HTTP filename, "
                        + "request path) reaching file access without canonical base-directory enforcement "
                        + "(resolve/realpath/getCanonicalPath/filepath.Clean/Path.GetFullPath + prefix allowlist).",
                "FALSE_POSITIVE requires safe join/canonical path validation under a fixed base dir, or a proven "
                        + "trusted/static/operator-only path with no user influence on the path string.",
                "Developer tool / CLI context: CLI tools (Click/Typer/argparse/Commander/yargs), build scripts "
                        + "(Maven/Gradle plugins, npm scripts, Webpack), and code generators are NOT attack surfaces. "
                        + "CLI arguments (--file, --output, --config), process.cwd(), __dirname, argv values, "
                        + "tsconfig/package.json options, and developer prompts (inquirer/prompts answers) are "
                        + "developer-controlled inputs → FALSE_POSITIVE. Do NOT mark UNCERTAIN because 'a developer "
                        + "might accept malicious input' — that is not the threat model for developer tools. "
                        + "Only mark TRUE_POSITIVE if the tool processes untrusted user uploads, watches external directories, "
                        + "or exposes web/API endpoints. Test files (*.test.*, *.spec.*, __tests__/) with hardcoded "
                        + "paths are test fixtures, not production code → FALSE_POSITIVE.",
                "Fixed base directory patterns: path.join(FIXED_CONST_DIR, var) where FIXED_CONST_DIR is a literal, "
                        + "constant, __dirname, process.cwd(), or environment variable (e.g., PACKAGES_DIR, extensionsDir, "
                        + "appDir, distDir, runtimeDir) is FALSE_POSITIVE if var is not proven user-controlled. "
                        + "Directory listing safety: fs.readdirSync(FIXED_DIR) / os.listdir(FIXED_DIR) filenames from a "
                        + "fixed base directory are application-controlled (the app created those directories), not "
                        + "attacker-controlled → FALSE_POSITIVE. An attacker cannot inject '../' into directory NAMES on "
                        + "the filesystem to escape FIXED_DIR. Cite 'directory listing from fixed base' or 'fixed base directory'.",
                "Multipart upload temp paths: file.tmpWorkingDirectory, parser temp paths, or file.path from "
                        + "formidable/busboy/multer are FALSE_POSITIVE — these are framework-controlled temp locations. "
                        + "Cite 'multipart parser temp path'.",
                "Configuration file origins: Paths read from tsconfig.json (outDir/rootDir), package.json (main/bin), "
                        + ".env files, webpack.config.js, vite.config.js, or similar build/app configuration files are "
                        + "operator-controlled → FALSE_POSITIVE. These files are not writable by web users; they define "
                        + "the application structure. Do NOT mark UNCERTAIN because 'the origin of tsconfig is unclear' — "
                        + "config files are trusted by design. Only mark TRUE_POSITIVE if the application allows users to "
                        + "upload/modify config files via web UI/API.",
                "Framework-specific patterns (common sources that require investigation):",
                "  • Spring: file.originalFilename (multipart), @RequestParam paths (requires validation check)",
                "  • Express/Koa: file.filepath / file.path (multipart parser temp - safe), req.body.path (user input - unsafe)",
                "  • Django: request.FILES['file'].name (filename from user - unsafe without validation)",
                "  For these patterns: (1) identify the exact source, (2) check if it's from user input vs framework internals, "
                        + "(3) search for validation/sanitization before use.",
                "UNCERTAIN only when: (a) origin is self.obj.field / getter / param AND searches do not show who sets "
                        + "that field, AND (b) no evidence of the above safe patterns, AND (c) context is web/API "
                        + "(not CLI/build tool). Do not mark UNCERTAIN for developer tools or fixed base dirs."));
        guidance.put("73", guidance.get("22"));
        guidance.put("78", List.of(
                "Identify the command string/argument list and whether user-controlled data reaches shell interpretation.",
                "Prefer TRUE_POSITIVE when untrusted input reaches shell execution without argument separation or allowlist validation.",
                "A fixed executable with shell=false and a structured argument list is not shell injection; assess only option/argument injection if an attacker can inject dangerous flags.",
                "settings.NAME (e.g. PRE_CONSUME_SCRIPT) is only a config indirection — search where that setting is assigned before trusting it.",
                "FALSE_POSITIVE when the setting value is proven operator-only (env/hardcoded deploy config) or argv is allowlisted/fixed; TRUE_POSITIVE when users/admins can set the command via UI/API/DB.",
                "UNCERTAIN when settings.X reaches subprocess but the setting's value origin is not found — do not invent trust from the settings. prefix alone."));
        guidance.put("79", List.of(
                "Identify source, HTML/JS/URL/attribute/header sink context, and escaping applied for that exact context.",
                "TRUE_POSITIVE requires attacker-controlled content reaching an executable/browser-interpreted sink or an HTTP header/response-line sink without context-appropriate neutralization.",
                "AJAX/fetch responses, backend JSON fields, message events, URL fragments, uploaded filenames, and database rich text are not automatically trusted.",
                "Regex capture groups (Matcher.group / group(1)), URL decoding, and path '..' stripping are NOT XSS or header-injection neutralizers; they can still return attacker payloads such as <script>…</script> or CR/LF.",
                "Do not confuse a different sanitized variable with the variable actually written to the sink/header.",
                "i18n/translate/get_translation/format/render helpers are NOT XSS neutralizers by themselves — follow their payload argument, not only the helper name.",
                "Self-DOM / same-node round-trip (read el.innerHTML/outerHTML → transform → write the same property) is usually FALSE_POSITIVE unless evidence shows that node was previously filled with attacker-controlled HTML (URL/postMessage/user edit).",
                "Do not mark UNCERTAIN only because a wrapper helper is unfamiliar when the payload origin is visible in the same line (e.g. document.body.innerHTML passed through translate).",
                "FALSE_POSITIVE requires framework auto-escaping, a text-only sink such as textContent/createTextNode, CR/LF stripping for header sinks, sanitizer proven complete for the exact sink context, or a proven same-node DOM round-trip of non-attacker content."));
        guidance.put("89", List.of(
                "Identify the exact SQL value, source, type, and query construction sink.",
                "TRUE_POSITIVE is mandatory when the SQL value is not a hardcoded/literal/constant origin AND the shown code clearly concatenates or interpolates that string into dynamic SQL without parameterization or a complete allowlist.",
                "Unknown input_source / unknown callers do NOT justify UNCERTAIN when the shown code clearly concatenates/interpolates a non-literal string into SQL (any language: +, ., f-string, template literal, sprintf, #{}, $var, etc.): that case is TRUE_POSITIVE.",
                "A SQL string held in a variable is not automatically TRUE_POSITIVE: if the query text is a literal, constant, or framework-parameterized builder and only values are bound, prefer FALSE_POSITIVE.",
                "Numeric typed or parsed values (int/Integer/long/number/parseInt/Integer.parseInt/int()/strconv.Atoi) cannot inject SQL syntax through that parameter; confirm FALSE_POSITIVE when proven.",
                "Desktop GUI input is still user-controlled; desktop context alone does not make raw string SQL concatenation/interpolation safe.",
                "ORM lookups (Django filter/exclude/get, ActiveRecord where, SQLAlchemy filter, etc.) are generally safe; treat raw()/extra()/RawSQL/cursor.execute/knex.raw/sequelize.query as risky only when the SQL string or interpolated fragment is user-controlled.",
                "Prefer UNCERTAIN over FALSE_POSITIVE only when both (a) origin is unproven AND (b) the query is not clearly built by concatenating/interpolating a non-literal string. Do not assume config loaders (getSqlString/getQuery/etc.) are trusted without tracing where their values come from.",
                "DDL/identifier concatenation (CREATE INDEX/TABLE, quoted table/column names built with +/append) is still SQL injection when field/tableName/nativeName/json values are non-literal. Double-quoting identifiers is NOT a neutralizer; require allowlist validation.",
                "origin-tag all-callsites-pass-literal-arg applies only when the sink SQL argument itself is the call-site literal. If the method builds SQL locally from this.field / getters / JSON / resource names, call-site ctor literals do NOT justify FALSE_POSITIVE.",
                "RISKY SCHEME (SQL only): proven application-safe / known-trusted source (literals/constants/literal call sites/internal_call/config) + SQL still built by string concatenation/interpolation => TRUE_POSITIVE with confidence 0.50-0.60 (~0.55), NOT FALSE_POSITIVE and NOT UNCERTAIN merely because current origin is trusted or unclear. Rationale: the helper may later be reused with user input. Raise above 0.60 only with a current untrusted source; pure literal SQL with no concat / numeric / parameterized => FALSE_POSITIVE.",
                "When TRUE_POSITIVE, remediation_code must rewrite the flagged SQL construction site (same variables/sink). Never invent an unrelated query (e.g. SELECT username/password). Bind VALUES; allowlist/validate identifiers or SQL fragments that placeholders cannot bind."));
        guidance.put("90", guidance.get("89"));
        guidance.put("113", List.of(
                "CWE-113 is HTTP response splitting / header injection: untrusted data reaches setHeader/addHeader/sendRedirect/Location/Set-Cookie or equivalent response writers without CR/LF neutralization.",
                "TRUE_POSITIVE when untrusted input reaches an HTTP header or response-line sink and CR/LF are not stripped/encoded and the value is not a strict allowlist.",
                "Regex capture groups, URL decoding, and path normalization (removing '..') are NOT sufficient neutralizers for header injection or response splitting.",
                "Do not confuse a different sanitized variable with the variable actually written to the header (e.g. reqPath sanitized but Location uses raw getRequestURI()).",
                "FALSE_POSITIVE requires proven CR/LF stripping/encoding, strict allowlist validation of the exact header value, or a trusted/literal header value."));
        guidance.put("117", List.of(
                "Check whether logged content contains secrets, PII, CRLF/control characters, or internal details.",
                "Evaluate the log audience: browser console, local stdout, server logs, telemetry, files, or HTTP response.",
                "Browser console output is visible only to the current user's own DevTools; without credentials/tokens/secrets it is usually FALSE_POSITIVE.",
                "Build-time execution context (Maven plugin, Gradle task, annotation processor, code generator, test runner): data is class metadata, artifact coordinates, or build configuration — NOT attacker-controlled → FALSE_POSITIVE.",
                "If the logged value is a class name, interface name, method name, Maven artifact id/groupId/version, or build output directory, the data is build-time metadata and cannot be attacker-controlled → FALSE_POSITIVE.",
                "TRUE_POSITIVE requires sensitive, forgeable, or attacker-controlled content exposed to an audience that should not receive it."));
        guidance.put("200", List.of(
                "Identify the concrete information disclosed and who can observe it.",
                "TRUE_POSITIVE requires sensitive information, internal details, stack traces, secrets, or PII reaching an untrusted audience.",
                "Server logs, telemetry, files, HTTP responses, and user-visible exception details can be untrusted audiences depending on access.",
                "ValidationError / ValueError / GraphQL enum or form-field messages that expose only generic validation text, "
                        + "currency codes, enum values, or field names — without password/token/api_key/secret/PII — are FALSE_POSITIVE.",
                "api_key, password, phone, email, token, or credential values in exception messages are TRUE_POSITIVE when "
                        + "reachable by clients/logs; keep UNCERTAIN only when both sensitivity and audience remain unproven.",
                "Do not mark TRUE_POSITIVE for local-only diagnostic output without concrete sensitive content or an external exposure path."));
        guidance.put("208", List.of(
                "CWE-208 is about observable timing discrepancies in security-sensitive comparisons (timing side-channel), NOT about information disclosure.",
                "TRUE_POSITIVE requires a time-variable comparison of secret/credential values (e.g. password, token, hash comparison) where an attacker can measure the response time difference to infer the value.",
                "typeof / .length > 0 / null/empty / isEmpty presence checks are NOT secret comparisons → FALSE_POSITIVE (even if the variable is named token/secret).",
                "Parser/tokenizer/lexer discriminators such as type == \"hash\", type == \"word\", kind === 'token' are NOT CWE-208 → FALSE_POSITIVE (the quoted word is a token class name, not a secret hash/digest).",
                "Math.random() / scheduling jitter / cleanup triggers / load balancing / rate sampling are NOT CWE-208; these are non-security uses → FALSE_POSITIVE.",
                "When TRUE_POSITIVE, remediation_code must rewrite the flagged comparison site with the language-appropriate constant-time API (JS: crypto.timingSafeEqual, Java: MessageDigest.isEqual, Python: hmac.compare_digest), keeping the same compared expressions — never paste a Java API into JavaScript or invent unrelated expected/actual placeholders.",
                "FALSE_POSITIVE requires proof the comparison is not security-sensitive, uses constant-time comparison, or the timing difference is not observable/exploitable."));
        guidance.put("209", guidance.get("200"));
        guidance.put("259", List.of(
                "Determine whether the value is a real credential or a placeholder/test fixture.",
                "TRUE_POSITIVE requires a hardcoded password/secret/token/private key used or plausibly usable in runtime code.",
                "Check for placeholder markers such as example/sample/dummy/test/changeme and whether the file is production code.",
                "FALSE_POSITIVE requires positive evidence that the value is public, dummy, test-only, or non-secret."));
        guidance.put("312", guidance.get("259"));
        guidance.put("315", guidance.get("259"));
        guidance.put("798", guidance.get("259"));
        guidance.put("295", List.of(
                "Check whether certificate or hostname verification is disabled or bypassed.",
                "TRUE_POSITIVE when any permissive trust manager, hostname verifier bypass, or disabled SSL verification is shown in existing code.",
                "Do NOT mark FALSE_POSITIVE or UNCERTAIN because of test/dev/demo/mock/example naming, localhost, config origin, or path hints.",
                "FALSE_POSITIVE only when existing code proves a real neutralizer: proper certificate/hostname verification, safe trust store, or equivalent secure TLS wrapper."));
        guidance.put("326", List.of(
                "Identify key size/strength and whether the primitive protects security-sensitive data.",
                "TRUE_POSITIVE is likely for insufficient key sizes in production cryptographic use.",
                "Do not require attacker-controlled source data to confirm weak cryptographic strength."));
        guidance.put("327", List.of(
                "Identify algorithm/mode/padding and whether it is used for real security-sensitive encryption.",
                "ECB and unsafe/unauthenticated CBC in production cryptographic code should be treated as TRUE_POSITIVE unless strong counter-evidence exists.",
                "CBC needs a unique unpredictable IV and authentication/MAC; static IVs or unauthenticated CBC should not be downgraded.",
                "Do not downgrade weak cryptography because source taint is unknown; the primitive choice itself is the issue."));
        guidance.put("328", List.of(
                "Determine whether MD5/SHA-1 is used for a security-sensitive purpose or a non-security checksum/cache key.",
                "TRUE_POSITIVE for password hashing, token/signature security, or tamper-resistant integrity.",
                "HMAC-SHA1/HMAC-MD5 is not equivalent to a plain hash; do not flag HMAC solely because the underlying digest is SHA-1/MD5.",
                "FALSE_POSITIVE can be correct for ETags, cache keys, deduplication, CSPRNG-derived formatting, or third-party protocol identifiers."));
        guidance.put("330", List.of(
                "Identify whether randomness is used for security: tokens, keys, salts, session ids, nonces, or crypto.",
                "TRUE_POSITIVE when predictable PRNG output protects security-sensitive values.",
                "Non-security uniqueness, UI element IDs, CSS classes, animation jitter, scheduling triggers, cleanup intervals, load balancing, sampling rates, test data, or random delays are FALSE_POSITIVE.",
                "For CWE-330, FALSE_POSITIVE is allowed from non-security use proven in the shown code or fake-data generators "
                        + "(create_fake_*, random_data, fixtures, shuffle, telemetry delay) — do not keep UNCERTAIN merely "
                        + "because a global anti-test-naming rule applies to other CWEs. Path name alone is not enough; "
                        + "the random call must not protect tokens/keys/salts/session ids.",
                "FALSE_POSITIVE requires non-security use or a cryptographically secure random source."));
        guidance.put("352", List.of(
                "Check whether the operation is state-changing and reachable cross-site with ambient credentials.",
                "TRUE_POSITIVE requires missing/ineffective CSRF protection on a state-changing action.",
                "FALSE_POSITIVE requires safe/idempotent operation, same-site guarantees, or proven CSRF token validation."));
        guidance.put("502", List.of(
                "Base the chain only on code facts. Store/cache .get is not a file read — do not invent filesystem paths or uploads.",
                "TRUE_POSITIVE only when code proves attacker-influenced bytes reach unsafe deserialization (upload, user-writable path, request body/stream, or untrusted write into the same store/key) without safe parser/allowlist/integrity check.",
                "FALSE_POSITIVE when writers of the observed channel (file or store/key) are proven app/operator-only — not reachable by end-user content.",
                "UNCERTAIN when a read/get->deserialize path is shown but writer trust is not in code. Do not invent file vs store, nor attacker vs trusted.",
                "Reconstruct only what appears: for files path->open/read->deser then writers; for store/cache get->deser then set/dumps to that key."));
        guidance.put("532", guidance.get("117"));
        guidance.put("601", List.of(
                "Identify the redirect target source and redirect sink.",
                "TRUE_POSITIVE requires user-controlled URL/host reaching redirect without same-origin or allowlist validation.",
                "Database-backed redirect targets are untrusted if users/admins can store arbitrary URLs; trusted operator-only allowlisted targets may be safe.",
                "FALSE_POSITIVE requires relative-only redirects, strict allowlist validation, framework validation that rejects external hosts, "
                        + "OR same-origin construction: new URL(window.location.href|location.href) with only searchParams/query mutation "
                        + "(no host/hostname/protocol/href overwrite on the URL object) before location.href/assign/replace.",
                "Setting workspace/layer/query values via URLSearchParams on the current page URL is NOT open redirect — the host cannot change."));
        guidance.put("611", List.of(
                "Check XML parser configuration for external entity and DTD processing.",
                "TRUE_POSITIVE requires XML parsing of untrusted data with external entities/DTDs enabled.",
                "FALSE_POSITIVE requires explicit secure parser features disabling XXE vectors."));
        guidance.put("918", List.of(
                "Identify URL/host source, outbound request sink, and network boundary.",
                "TRUE_POSITIVE requires user-controlled target reaching server-side HTTP/network request without allowlist validation.",
                "Validation must account for redirects, DNS rebinding, localhost/private IP ranges, alternate schemes, and URL parser confusion.",
                "FALSE_POSITIVE requires strict scheme/host/IP allowlist and protection against DNS/private IP bypasses."));
        guidance.put("1004", List.of(
                "Cookie flag findings are misconfiguration/API-usage findings, not taint findings.",
                "TRUE_POSITIVE is mandatory when HttpOnly is missing or false on a cookie set in non-test code. Do not require proving the cookie is sensitive.",
                "Do NOT mark UNCERTAIN because cookie sensitivity is unclear — missing HttpOnly is enough.",
                "FALSE_POSITIVE only when existing code proves HttpOnly is enabled in the language/framework idiom "
                        + "(e.g. setHttpOnly(true), httpOnly: true, HttpOnly: true, httponly=True, SESSION_COOKIE_HTTPONLY), "
                        + "a framework guarantee that sets HttpOnly, or a test-only path."));
        guidance.put("614", List.of(
                "Cookie flag findings are misconfiguration/API-usage findings, not taint findings.",
                "TRUE_POSITIVE is mandatory when Secure is missing or false on a cookie set in non-test code. Do not require proving the cookie is sensitive.",
                "Do NOT mark UNCERTAIN because cookie sensitivity is unclear — missing Secure is enough.",
                "FALSE_POSITIVE only when existing code proves Secure is enabled in the language/framework idiom "
                        + "(e.g. setSecure(true), secure: true, Secure: true, secure=True, SESSION_COOKIE_SECURE), "
                        + "an HTTPS-only framework guarantee, or a test-only path."));
        guidance.put("1333", List.of(
                "Identify whether user-controlled input can influence the regex PATTERN (not only the haystack) "
                        + "or whether a fixed catastrophic regex matches attacker-controlled text.",
                "TRUE_POSITIVE requires realistic attacker control AND a vulnerable pattern with backtracking risk "
                        + "(nested quantifiers, overlapping alternation, etc.) that is not neutralized.",
                "FALSE_POSITIVE when the pattern is built via metacharacter escaping / literal quoting before "
                        + "RegExp/re.compile/Pattern.compile (e.g. JS replace of regex metacharacters with \\$& then "
                        + "new RegExp(...), Pattern.quote, re.escape, escapeRegExp, preg_quote, Regex.Escape, "
                        + "regexp.QuoteMeta). Escaped user search text is a literal match and cannot inject ReDoS syntax.",
                "FALSE_POSITIVE when the flagged sink only rebuilds an existing RegExp from .source / .flags "
                        + "(e.g. new RegExp(query.source, query.ignoreCase ? \"gi\" : \"g\")). That line does not "
                        + "introduce new pattern syntax — assess the original RegExp construction site instead.",
                "Browser/editor search UIs (CodeMirror, Ace, Monaco, in-page find dialog) where the same user types "
                        + "the query and it runs only in their own tab against editor text are usually FALSE_POSITIVE "
                        + "(self-DoS / intentional /re/ feature), not server-side ReDoS. Prefer TRUE_POSITIVE only when "
                        + "the regex runs server-side or can affect other users/sessions.",
                "User-controlled haystack alone is not enough for TRUE_POSITIVE when the pattern is a safe literal "
                        + "or otherwise free of catastrophic backtracking.",
                "Prefer FALSE_POSITIVE over UNCERTAIN when the shown sink line itself performs metacharacter escaping "
                        + "or only rebuilds via .source — that is complete neutralization / non-injection proof "
                        + "for that sink line."));
        guidance.put("15", List.of(
                "Identify which external/system setting can affect security behavior.",
                "TRUE_POSITIVE requires attacker/operator-controlled configuration changing a security-sensitive path.",
                "FALSE_POSITIVE requires fixed trusted configuration or a safe framework/operator boundary."));
        guidance.put("80", guidance.get("79"));
        guidance.put("88", guidance.get("78"));
        guidance.put("93", List.of(
                "For CRLF/log injection, the impact is log/header forging or record splitting; the value does not need to contain a secret.",
                "TRUE_POSITIVE requires untrusted text reaching a server log, HTTP header, or response line without CR/LF stripping, encoding, or strict allowlist validation.",
                "Regex capture groups, URL decoding, and path '..' stripping are not CR/LF neutralizers.",
                "If the same untrusted variable reaches multiple logger calls in the same method/file without neutralization, keep the verdict consistent across those cases.",
                "FALSE_POSITIVE requires proof that CR/LF characters are removed/encoded or that the logged/header value is fixed/trusted."));
        guidance.put("94", List.of(
                "CWE-94 is code injection: attacker-controlled data reaches a language/runtime execution sink "
                        + "(eval/exec/compile/__import__/Runtime.exec/ProcessBuilder/script engine/dynamic Function).",
                "Bearer 'code generation' on setattr is usually NOT CWE-94. setattr stores an attribute; it does not execute code.",
                "For setattr / gsetattr / __set__ / __dict__ / contribute_to_class / Object.defineProperty, "
                        + "judge ONLY the ATTRIBUTE NAME slot (2nd argument of setattr) — never the assigned VALUE "
                        + "and never the value's HTTP/GraphQL/DB origin.",
                "SAFE setattr (FALSE_POSITIVE, no sanitizer needed): NAME is a string literal, a constant, "
                        + "self.field_name / this.field / cls._meta.x, a local field-name holder, or the `name` "
                        + "argument of ORM contribute_to_class. Examples: setattr(obj, 'email', value); "
                        + "setattr(instance, self.amount_field, amount); setattr(info.context, \"refresh_token\", token); "
                        + "setattr(cls, name, self) inside contribute_to_class. VALUE may be untrusted — still FALSE_POSITIVE.",
                "UNSAFE setattr (TRUE_POSITIVE): the attribute NAME is attacker-controlled without an allowlist "
                        + "(mass assignment). Examples: for key, value in data.items(): setattr(obj, key, value); "
                        + "setattr(obj, request.POST['field'], value); setattr(obj, data[name], value).",
                "UNSAFE execution (TRUE_POSITIVE): untrusted data reaches eval/exec/compile/__import__/Function/"
                        + "script engine without sandbox/allowlist — regardless of setattr.",
                "UNCERTAIN only when you cannot tell whether the NAME is attacker-controlled or whether a real "
                        + "execution sink exists. Unclear VALUE origin is never a reason for UNCERTAIN or TRUE_POSITIVE."));
        guidance.put("95", List.of(
                "CWE-95 is eval injection: attacker-controlled data reaches eval/Function/script-engine style execution.",
                "TRUE_POSITIVE when untrusted input reaches eval/exec/compile/dynamic Function without neutralization.",
                "setattr / __set__ / model-field wiring without an eval-family sink: apply the CWE-94 setattr rule "
                        + "(safe name = FALSE_POSITIVE; attacker-controlled name = TRUE_POSITIVE).",
                "Unclear VALUE origin is not UNCERTAIN when there is no eval-family sink.",
                "FALSE_POSITIVE requires a non-eval sink or proven sandbox/allowlist around the eval sink."));
        guidance.put("98", guidance.get("22"));
        guidance.put("118", List.of(
                "Identify the memory boundary, buffer, or unsafe native operation involved.",
                "TRUE_POSITIVE requires shown code where input can violate the memory/object boundary.",
                "FALSE_POSITIVE requires managed safe APIs, fixed sizes, or unreachable/test-only code."));
        guidance.put("134", List.of(
                "Identify whether attacker-controlled data reaches a format string rather than a normal formatted argument.",
                "TRUE_POSITIVE requires untrusted input controlling the format template.",
                "FALSE_POSITIVE requires constant format strings with untrusted data passed only as arguments."));
        guidance.put("190", List.of(
                "Identify arithmetic operation, bounds, and whether overflow changes security-sensitive behavior.",
                "TRUE_POSITIVE requires input-controlled values causing overflow with security impact.",
                "FALSE_POSITIVE requires bounded values, checked arithmetic, or non-security impact."));
        guidance.put("201", guidance.get("200"));
        // CWE-208 keeps its dedicated timing side-channel checklist (set above); do not overwrite with CWE-200.
        guidance.put("210", guidance.get("200"));
        guidance.put("242", List.of(
                "Identify the dangerous function/API and why it is unsafe in this language/framework.",
                "TRUE_POSITIVE requires reachable use in production code with security impact.",
                "FALSE_POSITIVE requires test-only/dead code or a wrapper that fully constrains dangerous behavior."));
        guidance.put("269", accessControlGuidance());
        guidance.put("284", accessControlGuidance());
        guidance.put("297", guidance.get("295"));
        guidance.put("306", missingAuthenticationGuidance());
        guidance.put("313", guidance.get("259"));
        guidance.put("319", List.of(
                "Identify whether the code uses naive Socket class instead of SSLSocketFactory for socket connections.",
                "TRUE_POSITIVE requires use of 'new Socket()' without SSLSocketFactory, regardless of whether the connection is local or remote.",
                "FALSE_POSITIVE requires use of SSLSocketFactory.createSocket() or SSLSocket, or proof that SSL/TLS is enforced by a framework wrapper."));
        guidance.put("329", List.of(
                "Identify IV/nonce generation and whether it is unique and unpredictable where required.",
                "TRUE_POSITIVE requires reused, static, predictable, or attacker-controlled IV/nonce in security-sensitive crypto.",
                "FALSE_POSITIVE requires correct random/unique IV handling for the selected mode."));
        guidance.put("346", accessControlGuidance());
        guidance.put("347", List.of(
                "Identify what integrity/authenticity check is missing or bypassed "
                        + "(JWT signature, MAC, certificate, or other authenticity check).",
                "For JWT verify_signature=False / algorithms=['none'] / unsigned decode: distinguish "
                        + "(A) auth/trust decisions based on the unverified payload (TRUE_POSITIVE) from "
                        + "(B) claim-peek helpers that only classify tokens (e.g. is_saleor_token / owner field) "
                        + "while a later verified jwt.decode(token, key, algorithms=[...]) gates auth "
                        + "(FALSE_POSITIVE when that verified path is proven in code).",
                "TRUE_POSITIVE when unverified JWT claims are used for authentication, authorization, "
                        + "identity, or other trust decisions, or when no verified decode exists on the auth path.",
                "FALSE_POSITIVE when existing code proves a complete signature/MAC/certificate verification path "
                        + "for the security decision, or when the flagged decode is proven claim-peek-only "
                        + "with a separate verified decode before trust is granted.",
                "UNCERTAIN when the unverified decode is visible but callers/auth path verification cannot be proven.",
                "When TRUE_POSITIVE, remediation_code must keep the same decode call site/variables and enable "
                        + "real verification with key/secret + algorithms allowlist + explicit verify-on: "
                        + "Python options={'verify_signature': True}; Ruby JWT.decode(..., true, ...); "
                        + "JS/TS jwt.verify (not jwt.decode); Java parseClaimsJws + setSigningKey "
                        + "(not parseClaimsJwt); C# ValidateToken with RequireSignedTokens=true; "
                        + "PHP JWT::decode + Key(alg); Go jwt.Parse with method allowlist + token.Valid. "
                        + "Only removing verify_signature=False is INVALID. "
                        + "Do not invent a hardcoded secret; use the project's existing JWT secret/config symbol "
                        + "when visible, otherwise write a clear placeholder and say where the key must come from."));
        guidance.put("353", guidance.get("347"));
        guidance.put("378", permissionGuidance());
        guidance.put("384", List.of(
                "Identify session id creation/rotation and authentication transition.",
                "TRUE_POSITIVE requires session identifiers not rotated or constrained after authentication.",
                "FALSE_POSITIVE requires framework session fixation protection or explicit session regeneration."));
        guidance.put("400", resourceExhaustionGuidance());
        guidance.put("409", resourceExhaustionGuidance());
        guidance.put("470", List.of(
                "Identify reflective class/function lookup and whether untrusted input controls the target.",
                "TRUE_POSITIVE requires user-controlled reflection reaching class loading, method invocation, or object construction.",
                "FALSE_POSITIVE requires a strict allowlist or fixed trusted target."));
        guidance.put("501", List.of(
                "Identify the trust boundary crossed (e.g. request.setAttribute / session.put) and which VALUE crosses it.",
                "Trace the VALUE argument only — nearby getHeader/getParameter is NOT the source unless that VALUE is derived from it.",
                "TRUE_POSITIVE requires attacker-influenced data crossing from lower-trust to higher-trust context without validation.",
                "FALSE_POSITIVE when VALUE is an operator/admin security-service config id (SecurityNamedServiceConfig / "
                        + "initializeFromConfig / clone) or another internal marker with no untrusted influence — "
                        + "classify input_source as config_file or internal_call.",
                "UNCERTAIN when a config/object carrier is visible but writers of the stored field/id are not found — "
                        + "do not invent trust from naming alone."));
        guidance.put("521", List.of(
                "Identify password policy requirements and whether weak credentials are permitted.",
                "TRUE_POSITIVE requires missing/weak policy on real account credentials.",
                "FALSE_POSITIVE requires external identity provider enforcement, test-only code, or stronger policy elsewhere."));
        guidance.put("548", guidance.get("200"));
        guidance.put("598", guidance.get("200"));
        guidance.put("625", guidance.get("1333"));
        guidance.put("643", guidance.get("89"));
        guidance.put("650", accessControlGuidance());
        guidance.put("693", List.of(
                "Identify the missing or ineffective protection mechanism and the protected asset.",
                "TRUE_POSITIVE requires a real protection gap on production-relevant code.",
                "FALSE_POSITIVE requires another complete protection layer or framework guarantee."));
        guidance.put("704", List.of(
                "Identify the type conversion and whether it changes authorization, validation, size, or interpretation.",
                "TRUE_POSITIVE requires attacker-controlled value causing unsafe conversion with security impact.",
                "FALSE_POSITIVE requires safe checked conversion or non-security impact."));
        guidance.put("706", List.of(
                "Identify the name resolution target and whether untrusted input controls it.",
                "TRUE_POSITIVE requires unsafe resolution of files, classes, hosts, or resources across a trust boundary.",
                "FALSE_POSITIVE requires fixed names, allowlists, or safe framework resolution."));
        guidance.put("732", permissionGuidance());
        guidance.put("780", guidance.get("327"));
        guidance.put("913", List.of(
                "Identify dynamically controlled behavior, configuration, or code path.",
                "TRUE_POSITIVE requires attacker influence over behavior that changes security-sensitive execution.",
                "FALSE_POSITIVE requires trusted-only configuration or strict allowlisting."));
        guidance.put("917", guidance.get("78"));
        guidance.put("942", List.of(
                "Identify CORS origin policy and whether credentials or sensitive responses are exposed.",
                "TRUE_POSITIVE requires overly permissive origins with credentials or sensitive data exposure.",
                "FALSE_POSITIVE requires non-credentialed public data or strict origin allowlist."));
        guidance.put("943", guidance.get("89"));
        guidance.put("1018", List.of(
                "Identify the protected UI/resource and whether framing or embedding is allowed.",
                "TRUE_POSITIVE requires missing clickjacking/frame protection for sensitive UI.",
                "FALSE_POSITIVE requires safe frame-ancestors/X-Frame-Options or non-sensitive endpoint."));
        guidance.put("1021", guidance.get("1018"));
        guidance.put("1287", List.of(
                "Identify the input, syntactic constraints, and parser/interpreter that consumes it.",
                "TRUE_POSITIVE requires missing syntactic validation before security-sensitive interpretation.",
                "FALSE_POSITIVE requires strict grammar validation or safe parser constraints.",
                "For dynamic RegExp/regex construction: escaping all regex metacharacters (or Pattern.quote / "
                        + "re.escape / escapeRegExp / preg_quote / Regex.Escape) before compiling the pattern is "
                        + "complete syntactic neutralization → FALSE_POSITIVE. Do not keep UNCERTAIN merely because "
                        + "the search string originated from user input.",
                "new RegExp(existing.source, flags) only re-applies flags to an already-built pattern → "
                        + "FALSE_POSITIVE for that sink; do not treat .source as fresh unsanitized user input."));
        guidance.put("1395", List.of(
                "Identify the vulnerable component/API and whether the reviewed code actually depends on it.",
                "TRUE_POSITIVE requires reachable use of the vulnerable package/API/version.",
                "FALSE_POSITIVE requires unused dependency, safe version, or non-reachable code path."));
        return guidance;
    }

    private static List<String> accessControlGuidance() {
        return List.of(
                "Identify the protected operation/resource and the authorization/authentication check guarding it.",
                "TRUE_POSITIVE requires reachable access without the required privilege or identity check.",
                "FALSE_POSITIVE requires framework-enforced authorization or an explicit guard on the relevant path.");
    }

    private static List<String> missingAuthenticationGuidance() {
        return List.of(
                "This is a missing-authentication / unauthenticated sensitive operation finding, not classic source-to-sink taint.",
                "Language-agnostic checklist for database/service connects: (1) does the sink open a DB/service connection? "
                        + "(2) does the call include an authentication channel (user/password args, auth options object, "
                        + "URL userinfo, token, IAM, client cert)? (3) what is the value of those credentials?",
                "TRUE_POSITIVE when the connect/auth channel is missing, OR credentials are proven null/empty "
                        + "(null, None, undefined, \"\", '', empty config) after tracing assignments in the local method/class.",
                "FALSE_POSITIVE when an authentication channel is present AND there is no evidence that credentials are null/empty "
                        + "(e.g. password comes from an auth token, non-empty config, environment secret, or login parameters).",
                "Do NOT treat 'N arguments' alone as proof of authentication. Trace the password/token/user identifiers "
                        + "with local reads/searches before deciding.",
                "If the API looks credentialed but the password/token value cannot be determined, return UNCERTAIN — "
                        + "not automatic FALSE_POSITIVE.",
                "Do not analyze this as HTTP→SQL injection unless the CWE explicitly requires taint.");
    }

    private static List<String> permissionGuidance() {
        return List.of(
                "Identify file/resource permissions and who can read or write them.",
                "TRUE_POSITIVE requires overly broad permissions on sensitive or executable resources.",
                "FALSE_POSITIVE requires non-sensitive resources, safe umask/framework defaults, or test-only scope.");
    }

    private static List<String> resourceExhaustionGuidance() {
        return List.of(
                "Identify attacker-controlled size, repetition, recursion, timeout, or resource allocation.",
                "TRUE_POSITIVE requires realistic untrusted control over resource consumption without limits.",
                "FALSE_POSITIVE requires bounded input, quotas, timeouts, streaming limits, or trusted-only use.");
    }

    private static Map<VulnerabilityFamily, List<String>> buildFamilyGuidance() {
        Map<VulnerabilityFamily, List<String>> guidance = new LinkedHashMap<>();
        guidance.put(VulnerabilityFamily.SQL_INJECTION, CWE_GUIDANCE.get("89"));
        guidance.put(VulnerabilityFamily.COMMAND_INJECTION, CWE_GUIDANCE.get("78"));
        guidance.put(VulnerabilityFamily.PATH_TRAVERSAL, CWE_GUIDANCE.get("22"));
        guidance.put(VulnerabilityFamily.XSS, CWE_GUIDANCE.get("79"));
        guidance.put(VulnerabilityFamily.WEAK_CRYPTO, CWE_GUIDANCE.get("327"));
        guidance.put(VulnerabilityFamily.WEAK_HASH, CWE_GUIDANCE.get("328"));
        guidance.put(VulnerabilityFamily.INSUFFICIENT_RANDOM, CWE_GUIDANCE.get("330"));
        guidance.put(VulnerabilityFamily.LOGGER_LEAK, CWE_GUIDANCE.get("117"));
        guidance.put(VulnerabilityFamily.EXCEPTION_LEAK, CWE_GUIDANCE.get("200"));
        guidance.put(VulnerabilityFamily.TIMING_SIDE_CHANNEL, CWE_GUIDANCE.get("208"));
        guidance.put(VulnerabilityFamily.HARDCODED_SECRET, CWE_GUIDANCE.get("259"));
        guidance.put(VulnerabilityFamily.COOKIE_SECURITY, CWE_GUIDANCE.get("1004"));
        guidance.put(VulnerabilityFamily.CSRF, CWE_GUIDANCE.get("352"));
        guidance.put(VulnerabilityFamily.DESERIALIZATION, CWE_GUIDANCE.get("502"));
        guidance.put(VulnerabilityFamily.XXE, CWE_GUIDANCE.get("611"));
        guidance.put(VulnerabilityFamily.OPEN_REDIRECT, CWE_GUIDANCE.get("601"));
        guidance.put(VulnerabilityFamily.SSRF, CWE_GUIDANCE.get("918"));
        guidance.put(VulnerabilityFamily.TRUST_BOUNDARY, CWE_GUIDANCE.get("501"));
        guidance.put(VulnerabilityFamily.REGEX_DOS, CWE_GUIDANCE.get("1333"));
        guidance.put(VulnerabilityFamily.ACCESS_CONTROL, accessControlGuidance());
        guidance.put(VulnerabilityFamily.CLEAR_TEXT_TRANSMISSION, CWE_GUIDANCE.get("319"));
        guidance.put(VulnerabilityFamily.PERMISSIONS, permissionGuidance());
        guidance.put(VulnerabilityFamily.INSECURE_CONFIG, CWE_GUIDANCE.get("693"));
        guidance.put(VulnerabilityFamily.VULNERABLE_DEPENDENCY, CWE_GUIDANCE.get("1395"));
        guidance.put(VulnerabilityFamily.GENERAL, List.of(
                "Identify the concrete source, sink, security boundary, and any neutralizer relevant to this CWE.",
                "TRUE_POSITIVE requires code-supported exploitability, not just a generic scanner description.",
                "When TRUE_POSITIVE, remediation_code must rewrite the flagged code extract (same variables/sink), not a generic unrelated example.",
                "FALSE_POSITIVE requires positive safety evidence; if key facts remain missing, use UNCERTAIN."));
        return guidance;
    }
}
