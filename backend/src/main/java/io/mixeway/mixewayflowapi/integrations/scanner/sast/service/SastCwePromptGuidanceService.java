package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class SastCwePromptGuidanceService {

    private static final Map<String, List<String>> CWE_GUIDANCE = buildCweGuidance();
    private static final Map<VulnerabilityFamily, List<String>> FAMILY_GUIDANCE = buildFamilyGuidance();

    public String buildGuidance(SastRuleMetadata metadata) {
        if (metadata == null) {
            return "";
        }
        List<String> cwes = metadata.cweIds() == null ? List.of() : metadata.cweIds();
        StringBuilder sb = new StringBuilder();
        if (cwes.isEmpty()) {
            List<String> familyChecks = FAMILY_GUIDANCE.getOrDefault(metadata.family(),
                    FAMILY_GUIDANCE.get(VulnerabilityFamily.GENERAL));
            if (familyChecks != null && !familyChecks.isEmpty()) {
                sb.append(renderGuidance(metadata.family() == null ? "family" : metadata.family().name(), familyChecks));
            }
        } else {
            sb.append(guidanceHeader());
            for (String cwe : cwes) {
                String normalized = normalizeCwe(cwe);
                List<String> checks = CWE_GUIDANCE.getOrDefault(normalized,
                        FAMILY_GUIDANCE.getOrDefault(metadata.family(), FAMILY_GUIDANCE.get(VulnerabilityFamily.GENERAL)));
                sb.append("CWE-").append(normalized).append(" checklist:\n");
                appendChecks(sb, checks);
            }
            sb.append('\n');
        }
        appendGoLanguageGuidance(sb, metadata);
        return sb.toString();
    }

    private static String guidanceHeader() {
        return "## CWE-specific review guidance\n"
                + "Apply the checklist for every CWE attached to this finding before deciding the verdict.\n"
                + "Remediation (all CWEs): when TRUE_POSITIVE, remediation_code must rewrite the flagged code extract "
                + "and nearby local context — same identifiers, call site, and sink. Do not invent a standalone textbook "
                + "example with placeholder names (expected/actual/userInput) unless those exact names appear in the finding.\n";
    }

    private static String renderGuidance(String label, List<String> checks) {
        StringBuilder sb = new StringBuilder(guidanceHeader());
        sb.append(label).append(" checklist:\n");
        appendChecks(sb, checks);
        sb.append('\n');
        return sb.toString();
    }

    private static void appendChecks(StringBuilder sb, List<String> checks) {
        if (checks == null) {
            return;
        }
        for (String check : checks) {
            sb.append("- ").append(check).append('\n');
        }
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
                "Go: exec.Command(name, args...) / exec.CommandContext never invoke a shell. A literal/constant executable "
                        + "plus extra argv (including os.Args[1:]) is not command injection. TRUE_POSITIVE only if untrusted "
                        + "web/API data reaches the executable name, a shell wrapper (bash -c / sh -c / cmd.exe), or "
                        + "dangerous flags of a privileged binary.",
                "Developer tool / CLI context (same threat model as CWE-22): tools/ under //go:build ignore, "
                        + "cmd/ generators, linters, golangci-lint wrappers, and `go run` helpers are NOT attack surfaces. "
                        + "os.Args, flag.*, cobra/urfave args are developer-controlled → FALSE_POSITIVE. Do NOT mark "
                        + "UNCERTAIN because 'a developer might pass malicious flags'.",
                "settings.NAME (e.g. PRE_CONSUME_SCRIPT) is only a config indirection — search where that setting is assigned before trusting it.",
                "FALSE_POSITIVE when the setting value is proven operator-only (env/hardcoded deploy config) or argv is allowlisted/fixed; TRUE_POSITIVE when users/admins can set the command via UI/API/DB.",
                "UNCERTAIN when settings.X reaches subprocess but the setting's value origin is not found — do not invent trust from the settings. prefix alone."));
        guidance.put("79", List.of(
                "Identify source, HTML/JS/URL/attribute/header sink context, and escaping applied for that exact context.",
                "TRUE_POSITIVE requires attacker-controlled content reaching an executable/browser-interpreted sink or an HTTP header/response-line sink without context-appropriate neutralization.",
                "AJAX/fetch responses, backend JSON fields, message events, URL fragments, uploaded filenames, and database rich text are not automatically trusted.",
                "innerHTML/insertAdjacentHTML/jQuery.html() classification with deterministic rules:",
                "FALSE_POSITIVE when STRONG evidence of safety (cite the specific evidence):",
                "  • Visible sanitizer in code: DOMPurify.sanitize(), bleach.clean(), html/template auto-escape, "
                        + "Rails sanitize(), htmlspecialchars(). Cite 'visible sanitizer call'.",
                "  • Render/markup API with sanitized field: endpoint path contains /render, /markdown, /format, "
                        + "/template, /markup AND response field indicates sanitization (.sanitizedHtml, .renderedMarkdown, "
                        + ".safeContent). Cite 'render API with sanitized field'.",
                "  • Static content proven: from config file, build-time data, hardcoded strings. "
                        + "Cite 'static application content'.",
                "  • CSP protection: script-src restrictions prevent inline execution. Cite 'CSP blocks inline scripts'.",
                "TRUE_POSITIVE when STRONG evidence of risk:",
                "  • External domain: fetch('https://other-domain.com').",
                "  • Client-side concatenation: innerHTML = '<div>' + data + '</div>'.",
                "  • Known UGC endpoints WITHOUT sanitization evidence: /comment, /post, /message, /review, /profile "
                        + "with generic fields (.text, .body, .message, .html, .content) and no visible sanitizer/CSP.",
                "  • Explicit 'unsanitized', 'raw', 'untrusted' in variable/field names.",
                "UNCERTAIN when ambiguous:",
                "  • Same-origin endpoint (relative URL, /api/...) BUT not clearly render API or UGC endpoint, "
                        + "AND generic field name (.html, .content), AND no visible sanitizer or CSP. "
                        + "Example: fetch('/api/data').then(d => el.innerHTML = d.html).",
                "  • Render API BUT generic field: /api/render with field .html (not .sanitizedHtml).",
                "  • Dynamic URL with unknown source: fetch(getURL()) where getURL() is not visible.",
                "Guidance: If doubt about sanitization exists, prefer UNCERTAIN over FALSE_POSITIVE. "
                        + "If typical dangerous pattern (UGC + generic field), prefer TRUE_POSITIVE over UNCERTAIN. "
                        + "Do not assume same-origin means sanitized - require proof.",
                "html tagged templates / htmlRaw for static literals are FALSE_POSITIVE. Cite 'html tagged template'.",
                "TRUE_POSITIVE when a raw user string (topic name, comment, query param, unsanitized JSON field) "
                        + "reaches innerHTML / jQuery replaceWith/html without server or client sanitizer.",
                "Regex capture groups (Matcher.group / group(1)), URL decoding, and path '..' stripping are NOT XSS or header-injection neutralizers; they can still return attacker payloads such as <script>…</script> or CR/LF.",
                "Do not confuse a different sanitized variable with the variable actually written to the sink/header.",
                "i18n/translate/get_translation/format/render helpers are NOT XSS neutralizers by themselves — follow their payload argument, not only the helper name.",
                "Self-DOM / same-node round-trip (read el.innerHTML/outerHTML → transform → write the same property) is usually FALSE_POSITIVE unless evidence shows that node was previously filled with attacker-controlled HTML (URL/postMessage/user edit).",
                "Do not mark UNCERTAIN only because a wrapper helper is unfamiliar when the payload origin is visible in the same line (e.g. document.body.innerHTML passed through translate).",
                "JSON HTTP responses are not XSS sinks: res.json / NextResponse.json / Response.json, or res.send/res.end/write after Content-Type application/json (or application/problem+json), do not execute as HTML in a browser. Assess CWE-113 separately only if CR/LF reach a header name/value. res.send(string) without a JSON content type (Express often defaults to text/html) remains an XSS candidate; text/html + send/template/innerHTML remains TRUE_POSITIVE.",
                "Follow the sanitizer callee body — a helper named sanitize*/clean*/escape* is never enough. "
                        + "High-confidence FALSE_POSITIVE only when the SAME sink variable is processed by a library "
                        + "with a tight default/safelist for HTML (DOMPurify.sanitize with no ADD_TAGS/ADD_ATTR, "
                        + "sanitize-html/bleach.clean/JSoup Safelist.basic or tighter, OWASP Encoder.forHtml) and "
                        + "that output is what reaches the sink.",
                "Custom/self-made sanitizers and library calls with relaxed options are not automatic FALSE_POSITIVE. "
                        + "Follow the options object. Relaxed signals: allowedAttributes false/all, allowVulnerableTags, "
                        + "parseStyleAttributes false, extra tags such as style/link/meta/iframe/svg, ADD_TAGS/ADD_ATTR, "
                        + "Safelist.relaxed plus addAttributes, bleach extra tags. For innerHTML, <script> via innerHTML "
                        + "does not execute — judge leftover on*, javascript:/data: on href/src/srcset/action, and "
                        + "unsanitized CSS in style tags or style attributes. If those are not closed, TRUE_POSITIVE "
                        + "or UNCERTAIN (never confidence >=0.85 FALSE_POSITIVE). If the callee body is not in context, "
                        + "UNCERTAIN — do not invent completeness from the helper name.",
                "A manual tag/script blocklist is NOT a sanitizer: querySelector('script').remove(), stripping <style>, regex </script>, or textContent taken AFTER innerHTML was assigned. XSS occurs at the innerHTML write; keep TRUE_POSITIVE for that pattern.",
                "Go html/template auto-escapes string/fmt values. template.HTML / template.JS / template.URL mark trusted content — "
                        + "TRUE_POSITIVE only if that exact value is attacker-controlled and skips the app's sanitizer. "
                        + "htmlutil.HTMLFormat/HTMLPrintf escape arguments; a literal format string typed template.HTML is FALSE_POSITIVE. "
                        + "Markup pipelines (markdown/org/chroma) that post-process with bluemonday/NeedPostProcess are FALSE_POSITIVE "
                        + "at the renderer sink. Code-search/blame/diff highlighting via chroma is escaped source, not raw HTML. "
                        + "i18n locale strings (Crowdin/ini) cast to template.HTML are not user input.",
                "FALSE_POSITIVE requires framework auto-escaping, a text-only sink such as textContent/createTextNode, a JSON (not HTML) HTTP response, CR/LF stripping for header sinks, a tight library sanitizer/safelist proven on the exact sink variable, a proven same-node DOM round-trip of non-attacker content, render API with sanitized field, visible sanitizer call, or CSP protection."));
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
                "RISKY SCHEME (SQL only): proven application-safe / known-trusted source (literals/constants/literal call sites/internal_call/config) + SQL *text* still built by string concatenation/interpolation => TRUE_POSITIVE with confidence 0.50-0.60 (~0.55). "
                        + "RISKY SCHEME does NOT apply when the query text is a literal/constant and remaining arguments are bound parameters "
                        + "(Go database/sql or xorm/gorm Exec(query, args...), Java PreparedStatement, ?/$1 placeholders). "
                        + "A wrapper that does args := []any{sql}; args = append(args, ids...); engine.Exec(args...) with a literal sql "
                        + "is parameterization → FALSE_POSITIVE, not RISKY SCHEME. "
                        + "Raise above 0.60 only with a current untrusted source; pure literal SQL with no concat / numeric / parameterized => FALSE_POSITIVE.",
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
                "HTTP exceptions returned to the same client (ForbiddenException / UnauthorizedException / BadRequestException / "
                        + "HttpException / ResponseStatusException and equivalents) that interpolate fields from the same request "
                        + "(command/dto/req/body) or from a record already scoped to the authenticated principal — including "
                        + "email/phone — are same-user validation feedback → FALSE_POSITIVE, not third-party disclosure.",
                "api_key, password, token, secret, cookie, or Authorization values in exception messages remain TRUE_POSITIVE. "
                        + "Email/phone in server logs or telemetry (logger.info/error, CWE-532) remain TRUE_POSITIVE. "
                        + "Data belonging to a different user (lookup by attacker-controlled id without authorization) remains TRUE_POSITIVE.",
                "Keep UNCERTAIN only when both sensitivity and audience remain unproven, or when it is unclear whether the "
                        + "echoed record is the caller's own.",
                "Do not mark TRUE_POSITIVE for local-only diagnostic output without concrete sensitive content or an external exposure path.",
                "Go pprof: import \"net/http/pprof\" only registers http.DefaultServeMux. FALSE_POSITIVE when the public "
                        + "server uses chi/echo/gin/custom mux and pprof is served on localhost (or gated by a flag). "
                        + "TRUE_POSITIVE when ListenAndServe(addr, nil) / DefaultServeMux is the public handler. "
                        + "Cite 'pprof not on public ServeMux' in false_positive_evidence."));
        guidance.put("208", List.of(
                "CWE-208 is about observable timing discrepancies in security-sensitive comparisons (timing side-channel), NOT about information disclosure.",
                "Judge the flagged extract. Identifier names (token/hash/password/username) in comments or nearby lines are not proof of a secret compare.",
                "TRUE_POSITIVE only when the flagged comparison is a secret/credential value (password, HMAC, session secret) that an attacker can time, OR a login/forgot-password oracle that enumerates accounts by returning faster when the user does not exist than when the password is wrong.",
                "typeof / .length > 0 / null/empty / isEmpty presence checks are NOT secret comparisons → FALSE_POSITIVE (even if the variable is named token/secret/password).",
                "Username/email: TRUE_POSITIVE when the extract is an authentication oracle (early return / different error if user missing). FALSE_POSITIVE for admin uniqueness, profile update, or display-name compares. Remediation for enumeration is dummy password hashing and identical responses — not crypto.timingSafeEqual(username, stored).",
                "oauth_token (OAuth1 public identifier), Cloudinary/upload public_id, file/schema/package.json hashes, and UI/tab token resync are NOT CWE-208 secrets → FALSE_POSITIVE.",
                "Parser/tokenizer/lexer discriminators such as type == \"hash\", type == \"word\", kind === 'token' are NOT CWE-208 → FALSE_POSITIVE (the quoted word is a token class name, not a secret hash/digest).",
                "Math.random() / scheduling jitter / cleanup triggers / load balancing / rate sampling are NOT CWE-208; these are non-security uses → FALSE_POSITIVE.",
                "When TRUE_POSITIVE for a secret compare, remediation_code must rewrite the flagged comparison with the language-appropriate constant-time API (JS: crypto.timingSafeEqual, Java: MessageDigest.isEqual, Python: hmac.compare_digest), keeping the same compared expressions. When TRUE_POSITIVE for username/email enumeration, do not use those APIs on the identifier — hash a dummy password and return the same error in both branches.",
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
                "Do not downgrade weak cryptography because source taint is unknown; the primitive choice itself is the issue.",
                "Go tls.Config: MinVersion 0 / unset uses the crypto/tls default (TLS 1.2+ on supported Go). "
                        + "Missing MinVersion is FALSE_POSITIVE — cite 'Go crypto/tls default MinVersion' or state that "
                        + "the default is TLS 1.2+. Do not require a magic phrase when MinVersion is unset/0.",
                "A name→TLS-version lookup map that includes tls.VersionTLS10/TLS11 (or 'tlsv1.0') is operator "
                        + "configuration, not an active downgrade. FALSE_POSITIVE unless MinVersion is hardcoded to 1.0/1.1. "
                        + "Cite 'TLS version map is not active downgrade'.",
                "TRUE_POSITIVE for an explicit MinVersion: tls.VersionTLS10/TLS11 assignment, or InsecureSkipVerify: true with no config gate."));
        guidance.put("328", List.of(
                "Determine whether MD5/SHA-1 is used for a security-sensitive purpose or a non-security checksum/cache key.",
                "TRUE_POSITIVE for password hashing, token/signature security, or tamper-resistant integrity where THIS application chose the weak digest (not a wire protocol).",
                "HMAC-SHA1/HMAC-MD5 is not equivalent to a plain hash; do not flag HMAC solely because the underlying digest is SHA-1/MD5.",
                "Import-only findings (import \"crypto/md5\", import \"crypto/sha1\", from hashlib import md5) are NOT vulnerabilities. Judge the call site purpose; if the scan flagged only the import, FALSE_POSITIVE.",
                "FALSE_POSITIVE for third-party protocol identifiers and non-security fingerprints. Cite 'third-party protocol' or 'non-security checksum' in false_positive_evidence:",
                "  • Git object IDs / git hash-object / sha1Pattern — SHA-1 is Git's native object format (SHA-256 is optional).",
                "  • Have I Been Pwned / api.pwnedpasswords.com k-anonymity — the API requires SHA-1 prefixes. CheckPassword/pwn in the name is NOT password storage.",
                "  • npm SRI sha1-/sha512- comparing a tarball to the publisher-declared integrity string.",
                "  • Maven/RubyGems sidecar .md5/.sha1 checksum files; Alpine APK Q1+base64(SHA-1) and apk index signatures; Chef Mixlib X-Ops-Sign v1.0–1.2 (v1.3 is SHA-256).",
                "  • GitHub Actions artifact-name MD5 URL segments and x-actions-results-md5; Matrix txnId = hash(payload) for idempotency.",
                "  • Cache keys, UI element ids, commit-status context hashes, MultiHasher computing md5+sha1+sha256+sha512 for registries.",
                "Do not treat the word password/pass/login in a path, comment, or 'not used for password hashing' sentence as proof of password hashing.",
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
                "Do not stop at http.NewRequest / client.Get. The security boundary is the Client/Transport that performs Do(): "
                        + "DialContext, hostmatcher, ALLOWED_HOST_LIST, private-IP deny, no-redirect policy. "
                        + "A user-configurable webhook URL with those controls on the HTTP client is not 'no validation'.",
                "A helper that only builds *http.Request / HttpRequest (NewRequest, newRequest) is not the SSRF sink. "
                        + "Follow the caller that Do()/send()s it — a shared webhook/HTTP client, Transport, or host allow-list. "
                        + "If that client is allow-listed, FALSE_POSITIVE at the builder too. "
                        + "Cite 'host allow-list on HTTP client'.",
                "Validation must account for redirects, DNS rebinding, localhost/private IP ranges, alternate schemes, and URL parser confusion.",
                "FALSE_POSITIVE requires strict scheme/host/IP allowlist and protection against DNS/private IP bypasses. "
                        + "Cite 'host allow-list on HTTP client' in false_positive_evidence when that Transport/dialer is shown."));
        guidance.put("1004", List.of(
                "Cookie flag findings are misconfiguration/API-usage findings, not taint findings.",
                "TRUE_POSITIVE is mandatory when HttpOnly is missing or false on a cookie set in non-test code. Do not require proving the cookie is sensitive.",
                "Do NOT mark UNCERTAIN because cookie sensitivity is unclear — missing HttpOnly is enough.",
                "FALSE_POSITIVE only when existing code proves HttpOnly is enabled in the language/framework idiom "
                        + "(e.g. setHttpOnly(true), httpOnly: true, HttpOnly: true, httponly=True, SESSION_COOKIE_HTTPONLY), "
                        + "a framework guarantee that sets HttpOnly, or a test-only path."));
        guidance.put("614", List.of(
                "Cookie flag findings are misconfiguration/API-usage findings, not taint findings.",
                "TRUE_POSITIVE is mandatory when Secure is omitted or hardcoded false on a cookie set in non-test code. Do not require proving the cookie is sensitive.",
                "Do NOT mark UNCERTAIN because cookie sensitivity is unclear — missing Secure is enough.",
                "Secure bound to TLS/HTTPS session config (Go http.Cookie{Secure: setting.SessionConfig.Secure}, "
                        + "Django SESSION_COOKIE_SECURE, Express cookie.secure from config) is not 'missing' — "
                        + "self-hosted apps that also speak HTTP must not force Secure: true. "
                        + "FALSE_POSITIVE; cite 'framework guarantee' and 'Secure bound to HTTPS/session config'.",
                "FALSE_POSITIVE when existing code proves Secure is enabled in the language/framework idiom "
                        + "(e.g. setSecure(true), secure: true, Secure: true, secure=True, SESSION_COOKIE_SECURE), "
                        + "an HTTPS-only framework guarantee, config-driven Secure for dual HTTP/HTTPS, or a test-only path."));
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
        guidance.put("346", originValidationGuidance());
        guidance.put("940", originValidationGuidance());
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
        guidance.put("276", permissionGuidance());
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

    private static List<String> originValidationGuidance() {
        return List.of(
                "Identify the protected operation/resource and the origin/authorization check guarding it.",
                "TRUE_POSITIVE requires reachable access or a side-effect without the required origin, privilege, or identity check.",
                "FALSE_POSITIVE requires framework-enforced authorization or an explicit guard on the relevant path.",
                "postMessage / addEventListener('message') / onmessage: missing event.origin in the listener itself is not "
                        + "TRUE_POSITIVE if a callee that receives event / event.data / event.origin rejects untrusted origins "
                        + "(https scheme + host allowlist such as === 'https://…', endsWith('.example.com'), "
                        + "new URL(event.origin).hostname) BEFORE any state, DOM, or network side-effect. Follow parse* / "
                        + "isTrusted*Origin / isAllowedOrigin helpers in the same file.",
                "event.source === iframe.contentWindow (or === expectedWindow) proves the sender is that frame — "
                        + "FALSE_POSITIVE even without event.origin. Cite 'event.source window check'.",
                "postMessage(..., '*') with a non-secret payload (resize, scroll, theme, navigation hint) is hardening, "
                        + "not TRUE_POSITIVE. TRUE_POSITIVE only if secrets/tokens/PII are posted to *.",
                "Keep TRUE_POSITIVE when an untrusted message can reach a side-effect; origin === '*' / missing scheme / "
                        + "checking only event.data.type / checking origin AFTER innerHTML, eval, or further postMessage does not count "
                        + "unless the payload is proven non-secret and event.source is bound to the expected window.",
                "Prefer UNCERTAIN when the listener is shown but the callee body that would check origin is not in context.",
                "CORS / Access-Control-Allow-Origin: wildcard or reflected origin with credentials remains TRUE_POSITIVE; "
                        + "a strict allowlist or non-credentialed public data may be FALSE_POSITIVE.");
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
                "This is a local OS discretionary-access finding (chmod/WriteFile/OpenFile/mkdir mode), not web/API taint. "
                        + "The attacker is another Unix UID that can REACH the inode — not a logged-in application user "
                        + "and not 'any user of the product'. If no such local principal exists (single-user/container UID, "
                        + "or others cannot traverse the path), the mode on the leaf file is not exploitable → FALSE_POSITIVE.",
                "Decode the mode bits before judging. Never treat 'mode is not 0600' or a scanner G302-style rule "
                        + "(any WriteFile/chmod > 0600) as proof of a vulnerability. "
                        + "0644/0o644 = rw-r--r-- (owner r/w, group/others read). It is NOT world-writable. "
                        + "0755/0o755 = rwxr-xr-x (owner r/w/x, group/others r/x). It is NOT world-writable. "
                        + "World/group WRITE requires bits 0002 / 0020 (0666, 0664, 0777, 0775). "
                        + "World/group READ is 0004 / 0040. Execute is 0001 / 0010 / 0100.",
                "Path reachability (mandatory): opening a file requires search (x) on every parent directory. "
                        + "A 0644/0755 leaf behind 0700 parents, os.MkdirTemp / MkdirTemp (0700), or an application data dir "
                        + "that others cannot enter is unreachable → FALSE_POSITIVE even if the leaf is world-readable. "
                        + "Cite parent-dir mode when shown (MkdirAll/MkdirTemp/Chmod on the directory).",
                "Classify the file contents, not the API name: "
                        + "(A) secret — private keys, credentials, tokens, TLS material, password files; "
                        + "(B) public-by-design — *.pub / authorized-key material / known_hosts / README / LICENSE / "
                        + "static assets / source / templates; "
                        + "(C) executable — scripts, git hooks, binaries, +x programs meant to be run by the owner; "
                        + "(D) directory. Judge (A)–(D) with the bits, not with 'least privilege' slogans.",
                "TRUE_POSITIVE only when a reachable local UID gets a dangerous right: "
                        + "(1) group/other WRITE on a file the owner later trusts or executes (config, hooks, authorized_keys, "
                        + "binaries, secrets); or (2) group/other READ of class (A) secrets; or (3) 0777/0666 on a reachable path. "
                        + "Other-execute of a non-setuid script runs as the executor, not the owner — that is not hijacking "
                        + "the owner's process and is not TP by itself.",
                "FALSE_POSITIVE: owner-write-only modes (no 0020/0002) on class (B) public material (0644 on *.pub is the "
                        + "OpenSSH/ssh-keygen default — do not recommend 0600 for public keys and do not claim 0644 lets "
                        + "others modify the file); 0755 on class (C) executables/hooks the owner must run; 0755/0711 on "
                        + "directories; 0644 on README/LICENSE/gitignore/static files; unreachable leaves (0700 parents / "
                        + "temp dirs); Windows code where POSIX bits are ignored. Do not 'fix' these to 0600/0700.",
                "UNCERTAIN only if the numeric mode is not in the extract AND searches do not recover it, AND the content "
                        + "class is unknown. Do not mark UNCERTAIN merely because parent-dir mode was not scanned when the "
                        + "leaf is clearly class (B) or the bits have no group/other write.",
                "Remediation_code must keep the same path/call and change only bits that are actually dangerous "
                        + "(strip group/other write; restrict read on secrets). Do not rewrite 0644→0600 for public files "
                        + "or 0755→0700 for ordinary executables without a demonstrated reachable local attacker.",
                "When FALSE_POSITIVE, false_positive_evidence MUST contain 'not world-writable' and either 'rw-r--r--' "
                        + "(0644/0o644) or 'rwxr-xr-x' (0755/0o755), plus content class (public-by-design / git hook / "
                        + "source generator). Without those phrases a MISCONFIGURATION validator may override the verdict.",
                "0o666/0666 is group+other write before umask. unix.Umask / ApplyUmask (typically 0022 → 0644) or a 0700 "
                        + "temp dir (MkdirTemp) makes the leaf not world-writable in practice. Cite 'umask' and "
                        + "'not world-writable' → FALSE_POSITIVE hygiene. Bare 0666 on a reachable shared path without "
                        + "umask remains TRUE_POSITIVE.");
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
        guidance.put(VulnerabilityFamily.ACCESS_CONTROL, originValidationGuidance());
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

    private void appendGoLanguageGuidance(StringBuilder sb, SastRuleMetadata metadata) {
        if (!isGoRule(metadata)) {
            return;
        }
        sb.append("## Go language review guidance\n");
        sb.append("Bearer/gosec Go rules match idiomatic APIs. Apply this in addition to the CWE checklist. "
                + "When FALSE_POSITIVE, copy the required citation phrase into false_positive_evidence so the "
                + "MISCONFIGURATION/weak-hash validator cannot override you.\n");
        appendChecks(sb, goChecksFor(metadata));
        sb.append('\n');
    }

    private static boolean isGoRule(SastRuleMetadata metadata) {
        if (metadata == null || metadata.ruleId() == null) {
            return false;
        }
        String id = metadata.ruleId().toLowerCase(Locale.ROOT);
        return id.startsWith("go_") || id.startsWith("go.") || id.contains("gosec");
    }

    private static List<String> goChecksFor(SastRuleMetadata metadata) {
        VulnerabilityFamily family = metadata.family();
        String ruleId = metadata.ruleId() == null ? "" : metadata.ruleId().toLowerCase(Locale.ROOT);
        List<String> checks = new ArrayList<>();
        if (family == VulnerabilityFamily.COMMAND_INJECTION) {
            checks.addAll(goCommandChecks());
        } else if (family == VulnerabilityFamily.SQL_INJECTION) {
            checks.addAll(goSqlChecks());
        } else if (family == VulnerabilityFamily.XSS) {
            checks.addAll(goXssChecks());
        } else if (family == VulnerabilityFamily.WEAK_HASH) {
            checks.addAll(goWeakHashChecks());
        } else if (family == VulnerabilityFamily.WEAK_CRYPTO || family == VulnerabilityFamily.INSECURE_CONFIG) {
            checks.addAll(goTlsChecks());
            if (ruleId.contains("hash") || ruleId.contains("md5") || ruleId.contains("sha1")) {
                checks.addAll(goWeakHashChecks());
            }
        } else if (family == VulnerabilityFamily.PERMISSIONS) {
            checks.addAll(goPermissionChecks());
        } else if (family == VulnerabilityFamily.SSRF) {
            checks.addAll(goSsrfChecks());
        } else if (family == VulnerabilityFamily.COOKIE_SECURITY) {
            checks.addAll(goCookieChecks());
        } else if (family == VulnerabilityFamily.EXCEPTION_LEAK || family == VulnerabilityFamily.LOGGER_LEAK
                || ruleId.contains("pprof")) {
            checks.addAll(goPprofChecks());
        } else {
            checks.addAll(goCommonNoiseChecks());
        }
        return checks;
    }

    private static List<String> goCommandChecks() {
        return List.of(
                "exec.Command / CommandContext takes (name, args...): no shell, no string splitting. A literal binary "
                        + "plus os.Args[1:] is extra flags, not injection.",
                "tools/, build/, //go:build ignore, golangci-lint, go generate helpers → cli_developer_tool FALSE_POSITIVE. "
                        + "Cite 'developer tool CLI argv'.",
                "TRUE_POSITIVE only if HTTP/API/user content becomes the executable name or `sh -c` / `bash -c` script.");
    }

    private static List<String> goSqlChecks() {
        return List.of(
                "database/sql, xorm, gorm: Engine.Exec(query, args...) with a string-literal query and `?`/`$1` is "
                        + "parameterization. Wrappers that do args := []any{sql}; append(ids); Exec(args...) are FALSE_POSITIVE.",
                "RISKY SCHEME does not apply to bound parameters. int64 ids / strconv.Atoi cannot inject SQL.",
                "TRUE_POSITIVE: fmt.Sprintf / string concat into the query text itself. Cite 'parameterized Exec with literal SQL' "
                        + "when FP.");
    }

    private static List<String> goXssChecks() {
        return List.of(
                "html/template escapes strings. template.HTML is a trust marker — FP if the format string is a literal and "
                        + "args go through htmlutil.HTMLFormat/HTMLPrintf (those escape non-HTML args).",
                "Markup (markdown/org/chroma) after bluemonday / NeedPostProcess is FP at the renderer. Do not treat "
                        + "template.HTML(highlightedLines) as XSS when chroma produced the HTML.",
                "Locale/i18n strings and allowlisted emoji/provider icons are not user HTML. Cite 'html/template auto-escape' "
                        + "or 'markup sanitizer post-process' when FP.");
    }

    private static List<String> goWeakHashChecks() {
        return List.of(
                "Import of crypto/md5 or crypto/sha1 is never a vulnerability by itself → FALSE_POSITIVE. Judge Sum/New call sites.",
                "Protocol SHA-1/MD5 that Go forges must speak: Git object IDs, HIBP range API, npm SRI, Maven/RubyGems sidecars, "
                        + "Alpine APK Q1 checksums, Chef Mixlib 1.0–1.2, Actions artifact MD5 names, Matrix txnId. "
                        + "Cite 'third-party protocol'.",
                "Non-security: HashFilePathForWebUI, commit-status context hash, cache keys, MultiHasher (md5+sha1+sha256+sha512). "
                        + "Cite 'non-security checksum'.",
                "CheckPassword / pwn / password in a path does NOT mean password storage. HIBP must stay FALSE_POSITIVE.",
                "TRUE_POSITIVE: password storage, or app-chosen SHA-1/MD5 MAC-less integrity of untrusted third-party bytes "
                        + "where a stronger digest is not dictated by a protocol.");
    }

    private static List<String> goTlsChecks() {
        return List.of(
                "tls.Config{} / MinVersion: 0 means the crypto/tls default (TLS 1.2+). Missing MinVersion → FALSE_POSITIVE. "
                        + "Cite 'Go crypto/tls default MinVersion' or 'TLS 1.2+'. Applies to SMTP/LDAP/Redis/HTTP clients alike.",
                "A map of name→tls.VersionTLS10/11 for operator config is not an active downgrade. TP only if MinVersion is "
                        + "hardcoded to TLS 1.0/1.1. Cite 'TLS version map is not active downgrade'.",
                "InsecureSkipVerify from setting.*.SkipTLSVerify is operator-gated self-hosted config, not a default bypass. "
                        + "Hardcoded true with no gate remains TRUE_POSITIVE.");
    }

    private static List<String> goPermissionChecks() {
        return List.of(
                "os.WriteFile/OpenFile/Chmod third argument is Unix mode. gosec G302 (any mode > 0600) is not proof of a bug.",
                "0o644 on README/LICENSE/gitignore/generated source/*.pub is public-by-design. 0o755 on git hooks and hook.d "
                        + "dirs is required execute. unix.Umask/ApplyUmask restricts bits — not a permissive assignment.",
                "0o666 + ApplyUmask/umask (0022 → 0644) or MkdirTemp (0700) is FALSE_POSITIVE hygiene. Cite 'umask' and "
                        + "'not world-writable'.",
                "//go:build ignore, build/, tools/, one-shot modelmigration copies are not a runtime attack surface for 0644.",
                "When FP, false_positive_evidence MUST include 'not world-writable' and 'rw-r--r--' or 'rwxr-xr-x'.");
    }

    private static List<String> goSsrfChecks() {
        return List.of(
                "http.NewRequest(w.URL) is not the boundary. Find the *http.Client that Do()s the request: Transport, "
                        + "DialContext, hostmatcher.NewHTTPTransport, ALLOWED_HOST_LIST, private-IP deny.",
                "A helper that only builds the request (newMatrixRequest, newRequest) inherits the caller's client. "
                        + "If Deliver() uses webhookHTTPClient + hostmatcher, the builder is FALSE_POSITIVE too.",
                "Webhook/migration URLs are user-configurable by design. If the client allow-list is shown, this is not "
                        + "'unsanitized SSRF'. Cite 'host allow-list on HTTP client'.",
                "TRUE_POSITIVE only if that client has no host/IP allow-list and the URL is user/admin controllable.");
    }

    private static List<String> goCookieChecks() {
        return List.of(
                "http.Cookie{Secure: setting.SessionConfig.Secure} is the dual HTTP/HTTPS idiom. Secure is not missing.",
                "FALSE_POSITIVE; cite 'framework guarantee' and 'Secure bound to HTTPS/session config'.",
                "TRUE_POSITIVE when the Secure field is omitted or set to a false literal.");
    }

    private static List<String> goPprofChecks() {
        return List.of(
                "Named import of net/http/pprof registers DefaultServeMux only. Chi/echo/gin/custom mux for the public "
                        + "listener plus localhost:6060 behind EnablePprof is FALSE_POSITIVE.",
                "Cite 'pprof not on public ServeMux'. TRUE_POSITIVE if http.ListenAndServe(addr, nil) is public.");
    }

    private static List<String> goCommonNoiseChecks() {
        return List.of(
                "Common Go scanner noise: exec.Command is not a shell; tls.Config MinVersion 0 is TLS 1.2+; "
                        + "0o644/0o755 are not world-writable; crypto/sha1 imports follow Git/package protocols; "
                        + "pprof on DefaultServeMux is unused if the public server has its own mux.",
                "Prefer FALSE_POSITIVE with an explicit citation phrase over UNCERTAIN for these idioms.");
    }
}
