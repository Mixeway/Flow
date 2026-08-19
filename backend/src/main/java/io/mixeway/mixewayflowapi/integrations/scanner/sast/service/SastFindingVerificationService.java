package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import com.fasterxml.jackson.core.json.JsonReadFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import io.mixeway.mixewayflowapi.integrations.llm.service.LlmApiClient;
import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.BearerScanDataflow;
import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.BearerScanSecurity;
import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Consumer;
import java.util.regex.Pattern;

@Service
@Log4j2
@RequiredArgsConstructor
public class SastFindingVerificationService {

    private final LlmApiClient llmApiClient;
    private final CodeContextExtractor codeContextExtractor;
    private final CodeSearchService codeSearchService;
    private final SastEvidenceService sastEvidenceService;
    private final SastConsistencyService sastConsistencyService;
    private final SastCwePromptGuidanceService sastCwePromptGuidanceService;
    private final ObjectMapper objectMapper = JsonMapper.builder()
            .enable(JsonReadFeature.ALLOW_BACKSLASH_ESCAPING_ANY_CHARACTER)
            .build();

    private final Map<String, CachedVerdict> fingerprintCache = new ConcurrentHashMap<>();
    
    /** Configuration: number of parallel threads for finding verification. */
    @Value("${sast.verification.threads:#{T(java.lang.Math).max(2, T(java.lang.Runtime).getRuntime().availableProcessors() / 2)}}")
    private int verificationThreads;
    
    /** Configuration: max concurrent LLM API calls (affects throughput). */
    @Value("${sast.verification.max-concurrent-calls:3}")
    private int maxConcurrentCalls;
    
    /** Configuration: rate limit between LLM API calls in milliseconds. */
    @Value("${sast.verification.rate-limit-ms:2000}")
    private long rateLimitMs;
    
    /** Thread pool for parallel finding verification within a single repository scan. */
    private ExecutorService verificationExecutor;
    
    /** 
     * Rate limiter: allows multiple concurrent LLM calls with distributed rate limiting.
     * Initialized in @PostConstruct based on maxConcurrentCalls configuration.
     */
    private Semaphore rateLimitSemaphore;
    private final ConcurrentLinkedQueue<Long> recentCallTimes = new ConcurrentLinkedQueue<>();
    
    @PostConstruct
    public void init() {
        log.info("[SastVerification] Initializing with {} threads, {} max concurrent calls, {}ms rate limit",
                verificationThreads, maxConcurrentCalls, rateLimitMs);
        
        verificationExecutor = Executors.newFixedThreadPool(
                verificationThreads,
                r -> {
                    Thread t = new Thread(r, "sast-verification-" + System.currentTimeMillis());
                    t.setDaemon(true);
                    return t;
                });
        
        rateLimitSemaphore = new Semaphore(maxConcurrentCalls);
    }

    /** Hardcoded secret/password rules skipped from LLM verification (cookie/JWT/session stay analyzed). */
    private static final Set<String> SKIP_LLM_HARDCODED_SECRET_RULES = Set.of(
            "go_gosec_secrets_secrets",
            "go_lang_hardcoded_mysql_database_password",
            "go_lang_hardcoded_pg_database_password",
            "java_lang_hardcoded_database_password",
            "java_lang_hardcoded_secret",
            "javascript_express_hardcoded_secret",
            "javascript_lang_hardcoded_secret",
            "javascript_lang_jwt_hardcoded_secret",
            "javascript_third_parties_passport_hardcoded_secret",
            "php_lang_hardcoded_secret",
            "ruby_lang_hardcoded_secret",
            "ruby_rails_insecure_http_password"
    );

    private static final int RAW_RESPONSE_LOG_LIMIT = 2000;
    private static final int MAX_TOOL_ROUNDS = 4;
    private static final int MAX_TOOL_CALLS_PER_FINDING = 6;
    private static final int MAX_TOOL_CALLS_PATH_TRAVERSAL = 10;
    private static final int MAX_TOOL_CALLS_TAINT = 8;
    private static final int MAX_JSON_REPAIR_ATTEMPTS = 1;
    private static final int MAX_WEAK_REASONING_REPAIR_ATTEMPTS = 1;
    private static final int MAX_MISSING_VERDICT_RETRIES = 1;
    private static final int MAX_MISSING_CONFIDENCE_RETRIES = 1;
    private static final int MAX_MISSING_CONTEXT_RETRIES = 1;
    private static final Pattern SQL_NUMERIC_PARAMETER_EVIDENCE_PATTERN = Pattern.compile(
            "\\b(?:byte|short|int|integer|long|float|double|decimal|number|biginteger|bigdecimal|"
                    + "uint(?:8|16|32|64)?|int(?:8|16|32|64)?|float(?:32|64)?)\\s+"
                    + "[A-Za-z_][A-Za-z0-9_]*\\b"
                    + "|\\b[A-Za-z_][A-Za-z0-9_]*\\s*:\\s*"
                    + "(?:number|byte|short|int|integer|long|float|double|decimal|bigint)\\b"
                    + "|\\b(?:parameter|argument|value|variable)\\s+[A-Za-z_][A-Za-z0-9_]*\\s+"
                    + "(?:is|as|has type|typed as)\\s+(?:a\\s+|an\\s+)?"
                    + "(?:number|byte|short|int|integer|long|float|double|decimal|bigint)\\b"
                    + "|\\b[A-Za-z_][A-Za-z0-9_]*\\s+(?:parameter|argument|value|variable)\\s+"
                    + "(?:is|as|has type|typed as)\\s+(?:a\\s+|an\\s+)?"
                    + "(?:number|byte|short|int|integer|long|float|double|decimal|bigint)\\b"
                    + "|\\b(?:Integer|Long|Short|Byte|Float|Double)\\.parse(?:Int|Long|Short|Byte|Float|Double)\\s*\\("
                    + "|\\b(?:parseInt|parseFloat|Number|int|float)\\s*\\("
                    + "|\\bstrconv\\.(?:Atoi|ParseInt|ParseUint|ParseFloat)\\s*\\("
                    + "|\\bConvert\\.To(?:Int16|Int32|Int64|UInt16|UInt32|UInt64|Decimal|Double)\\s*\\(",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern NUMERIC_IDENTIFIER_DECLARATION_PATTERN = Pattern.compile(
            "\\b(?:byte|short|int|integer|long|float|double|decimal|number|biginteger|bigdecimal|"
                    + "Integer|Long|Short|Byte|Float|Double|BigInteger|BigDecimal)\\s+"
                    + "([A-Za-z_][A-Za-z0-9_]*)\\b",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern STRING_IDENTIFIER_DECLARATION_PATTERN = Pattern.compile(
            // Java/Kotlin/C#/Go typed declarations + Python/TS annotations (name: str/string)
            "\\b(?:String|CharSequence|Object|string|str)\\s+([A-Za-z_][A-Za-z0-9_]*)\\b"
                    + "|\\b([A-Za-z_][A-Za-z0-9_]*)\\s*:\\s*(?:str|string|String)\\b",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern WEAK_HASH_EVIDENCE_PATTERN = Pattern.compile(
            "\\b(?:md5|sha-?1|weak\\s+hash(?:ing)?|MessageDigest|getInstance\\s*\\(\\s*[\"'](?:MD5|SHA-?1)[\"'])\\b",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern PASSWORD_HASH_PURPOSE_PATTERN = Pattern.compile(
            "\\b(?:password|passwd|pwd|pass|credential|credentials|login)\\b"
                    + "|\\bpassText\\b"
                    + "|\\bpass\\s*\\.\\s*getBytes\\s*\\(",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern TIMING_EQUALS_METHOD_PATTERN = Pattern.compile(
            "([A-Za-z_][\\w.]*)\\s*\\.\\s*equals(?:IgnoreCase)?\\s*\\(\\s*([^)]+?)\\s*\\)");
    private static final Pattern TIMING_OBJECTS_EQUALS_PATTERN = Pattern.compile(
            "Objects\\.equals\\s*\\(\\s*([^,]+?)\\s*,\\s*([^)]+?)\\s*\\)");
    private static final Pattern TIMING_OPERATOR_COMPARE_PATTERN = Pattern.compile(
            "\\b([A-Za-z_][\\w.]*)\\s*(?:===?|!==?|!=)\\s*([A-Za-z_][\\w.]*)\\b");
    private static final Pattern NAIVE_SOCKET_CONSTRUCTOR_PATTERN = Pattern.compile(
            "\\bnew\\s+Socket\\s*\\(",
            Pattern.CASE_INSENSITIVE);

    /**
     * Trusted-source SQL string concatenation is still a risky scheme (future misuse),
     * scored as TRUE_POSITIVE in the mid-confidence band rather than FALSE_POSITIVE.
     */
    private static final double SQL_RISKY_TRUSTED_CONCAT_CONFIDENCE = 0.55d;

    /** Cross-language SQL execution / query APIs used in structural SQLi evidence. */
    private static final String SQL_EXEC_API_REGEX =
            "(?:executeQuery|executeUpdate|createQuery|createNativeQuery|prepareStatement|prepareCall|"
                    + "cursor\\.execute|connection\\.execute|session\\.execute|execute\\s*\\(|"
                    + "db\\.query|client\\.query|pool\\.query|connection\\.query|sequelize\\.query|"
                    + "knex\\.raw|find_by_sql|QueryRow|QueryContext|ExecContext|Exec\\s*\\(|"
                    + "rawQuery|mysqli_query|pg_query|mysql_query|PDO\\s*->\\s*(?:query|exec|prepare)|"
                    + "DB::(?:select|statement|raw|unprepared)|ActiveRecord::Base\\.connection\\.execute|"
                    + "sqlx\\.query|SqlCommand|ExecuteReader|ExecuteNonQuery|ExecuteScalar)";

    /** Cross-language cookie flag enabling idioms (positive neutralizer evidence). */
    private static final Pattern COOKIE_FLAG_NEUTRALIZER_PATTERN = Pattern.compile(
            // Java / Kotlin
            "sethttponly\\s*\\(\\s*true\\s*\\)|setsecure\\s*\\(\\s*true\\s*\\)"
                    + "|\\.httponly\\s*\\(\\s*true\\s*\\)|\\.secure\\s*\\(\\s*true\\s*\\)"
                    // JS / TS / Express / Nest
                    + "|\\bhttponly\\s*[:=]\\s*true\\b|\\bsecure\\s*[:=]\\s*true\\b"
                    + "|\\bsamesite\\s*[:=]\\s*['\"]?(?:strict|lax|none)['\"]?"
                    // Go net/http / gorilla
                    + "|\\bhttponly\\s*:\\s*true\\b|\\bsecure\\s*:\\s*true\\b"
                    + "|samesite(?:default|lax|strict|none)mode"
                    // Python / Django
                    + "|\\bhttponly\\s*=\\s*true\\b|\\bsecure\\s*=\\s*true\\b"
                    + "|session_cookie_httponly\\s*=\\s*true|session_cookie_secure\\s*=\\s*true"
                    + "|csrf_cookie_httponly\\s*=\\s*true|csrf_cookie_secure\\s*=\\s*true"
                    + "|set_cookie\\s*\\([^;\\n]{0,200}\\bhttponly\\s*=\\s*true"
                    // PHP setcookie / session / Symfony
                    + "|session\\.cookie_httponly\\s*=\\s*1|session\\.cookie_secure\\s*=\\s*1"
                    + "|['\"]httponly['\"]\\s*=>\\s*true|['\"]secure['\"]\\s*=>\\s*true"
                    + "|['\"]samesite['\"]\\s*=>\\s*['\"](?:strict|lax|none)['\"]"
                    + "|->withhttponly\\s*\\(\\s*true\\s*\\)|->withsecure\\s*\\(\\s*true\\s*\\)"
                    // Ruby / Rails
                    + "|httponly:\\s*true|secure:\\s*true|same_site:\\s*:(?:strict|lax|none)"
                    // C#
                    + "|\\.httponly\\s*=\\s*true|\\.secure\\s*=\\s*true|samesitemode\\.(?:strict|lax|none)",
            Pattern.CASE_INSENSITIVE);

    private static final String VALIDATOR_SYSTEM_PROMPT =
            "You are an independent security peer reviewer. You receive a completed SAST finding analysis " +
            "(code snippets, structured evidence, CWE-specific guidance, investigation tool results, and a proposed verdict). " +
            "Your job is to verify whether the verdict is supported by the shown evidence. " +
            "Evaluate whether every cited fact is grounded in code or tool results, whether any assumption is unjustified, " +
            "whether counter-evidence or neutralization was overlooked, and whether any proposed remediation is safe. " +
            "Apply the supplied CWE-specific guidance and structured evidence; do not invent additional facts. " +
            "If exploitability, source, sink, execution context, or neutralization remains unproven, prefer UNCERTAIN over " +
            "FALSE_POSITIVE. Exception for CWE-94/95 setattr / code generation: judge the attribute NAME slot, not VALUE " +
            "origin. A literal, constant, or internal NAME (self.field / cls._meta.x / contribute_to_class field id) " +
            "with no eval/exec/compile/script-engine sink is FALSE_POSITIVE even if VALUE comes from HTTP, GraphQL, or a " +
            "database. Attacker-controlled NAME (mass assignment) is TRUE_POSITIVE. Do not keep UNCERTAIN and do not " +
            "require a sanitizer because VALUE origin is unclear. Exception for SQL injection: proven trusted/literal/" +
            "constant/internal source plus SQL built by string concatenation/interpolation is a RISKY SCHEME — keep " +
            "TRUE_POSITIVE with confidence 0.50-0.60 (~0.55); do not downgrade to UNCERTAIN or FALSE_POSITIVE merely " +
            "because the current source is trusted or call-site origin is not attacker-controlled. " +
            "Exception: knex identifier placeholders (??) with a bindings array are parameterization → FALSE_POSITIVE, " +
            "not a RISKY SCHEME. Do not treat reviewer guesses that a value 'likely came from HTTP' as taint. " +
            "Proposed remediation code is not applied code and must never be cited as evidence that the current finding is already fixed.";

    private static final String SYSTEM_PROMPT =
            "You are an expert security code reviewer specializing in SAST false positive detection. " +
            "Analyze each finding using only the supplied code snippets, structured evidence, CWE-specific guidance, " +
            "and tool results. Do not infer attacker control, trusted sources, sanitization, execution context, or reachability " +
            "from names or paths alone. Mark TRUE_POSITIVE only when exploitability is supported by shown evidence; " +
            "mark FALSE_POSITIVE only when positive safety evidence is shown; otherwise use UNCERTAIN. " +
            "Exception for CWE-94/95 setattr / code generation: the safety evidence is the attribute NAME slot, not a " +
            "sanitizer and not VALUE origin. Literal/constant/internal NAME + no eval/exec/compile sink is FALSE_POSITIVE " +
            "even if VALUE is HTTP/GraphQL/DB. Do not use UNCERTAIN because VALUE origin is unclear. " +
            "Exception for Node/JavaScript CWE-319: http.createServer is not an unsafe API by itself — FALSE_POSITIVE " +
            "unless shown code transmits secrets on a cleartext client channel. Developer scripts and localhost listeners " +
            "are FALSE_POSITIVE. Java new Socket() rules do not apply to Node HTTP servers. " +
            "Exception for SQL: knex identifier placeholders (??) with bindings are parameterization → FALSE_POSITIVE. " +
            "Do not treat reviewer prose ('likely HTTP') as taint; require a request/query/body assignment in code. " +
            "Exception for CWE-328: HMAC-SHA1/HMAC-MD5 required by a third-party protocol (OAuth 1.0) is FALSE_POSITIVE. " +
            "For true positives, provide actionable remediation only when the available context is sufficient.";

    private static final String MISCONFIGURATION_SYSTEM_PROMPT =
            "You are an expert security reviewer for SAST misconfiguration and insecure API usage findings. " +
            "These findings are not classic source-to-sink taint findings. Analyze only the supplied code snippets, " +
            "structured evidence, CWE-specific guidance, and tool results. Do not require attacker-controlled input " +
            "unless the CWE-specific guidance explicitly says it is required. Mark TRUE_POSITIVE when the vulnerable API, " +
            "unsafe setting, insecure protocol, disabled protection, or insecure permission is shown in existing code " +
            "and no equivalent safe wrapper, framework guarantee, or rule-specific neutralizer is proven. " +
            "Do NOT mark FALSE_POSITIVE or UNCERTAIN because of test/dev/demo/mock/example naming, localhost, " +
            "config-file origin, or path hints. Mark FALSE_POSITIVE only when existing code proves a real safety " +
            "neutralizer (safe configuration, TLS/SSL enforcement, secure wrapper, or equivalent). " +
            "If the unsafe API/configuration is shown and no such neutralizer is proven, return TRUE_POSITIVE. " +
            "Exception for Node/JavaScript CWE-319 / javascript_lang_http_insecure: http.createServer is the normal " +
            "Node listener (TLS usually at a reverse proxy). FALSE_POSITIVE unless shown code sends secrets over a " +
            "cleartext client request or serves sensitive production traffic in plaintext with no TLS termination. " +
            "scripts/, localhost, and local OpenAPI/dev servers are FALSE_POSITIVE. Do not apply Java Socket guidance.";

    private static final String MISCONFIGURATION_VALIDATOR_SYSTEM_PROMPT =
            "You are an independent security peer reviewer for SAST misconfiguration and insecure API usage findings. " +
            "Verify whether the proposed verdict is grounded in the shown code, structured evidence, CWE guidance, and tool results. " +
            "Do not downgrade solely because attacker-controlled input or source-to-sink taint is unclear; these rules are about " +
            "unsafe API/configuration usage unless the CWE guidance says otherwise. Do NOT accept FALSE_POSITIVE based on " +
            "test/dev/demo/mock/example naming, localhost, config origin, or path hints. Override to FALSE_POSITIVE only with " +
            "concrete existing-code evidence of a safe configuration, TLS/SSL enforcement, secure wrapper, or another " +
            "rule-specific neutralizer. If the unsafe API/configuration is shown and no neutralizer is proven, keep or " +
            "return TRUE_POSITIVE. Exception for Node/JavaScript CWE-319: http.createServer alone is FALSE_POSITIVE; " +
            "Java Socket rules do not apply. Proposed remediation code is not applied code and must never be cited as evidence.";

    private static final Pattern PERMISSIVE_SSL_EVIDENCE_PATTERN = Pattern.compile(
            "\\b(?:trustAllCerts|trustAll|TrustAll|ALLOW_ALL_HOSTNAME_VERIFIER|NoopHostnameVerifier|"
                    + "InsecureTrustManagerFactory|TrustManager\\s*\\[\\s*\\]|checkServerTrusted\\s*\\([^)]*\\)\\s*\\{|"
                    + "HostnameVerifier[^{\\n]*\\{[^{\\n]*return\\s+true|"
                    + "setHostnameVerifier\\s*\\(|verify\\s*\\(\\s*String[^)]*\\)\\s*\\{\\s*return\\s+true)",
            Pattern.CASE_INSENSITIVE | Pattern.DOTALL);

    @PreDestroy
    public void shutdown() {
        log.info("[SastVerification] Shutting down verification executor");
        verificationExecutor.shutdown();
        try {
            if (!verificationExecutor.awaitTermination(60, TimeUnit.SECONDS)) {
                log.warn("[SastVerification] Executor did not terminate in 60s, forcing shutdown");
                verificationExecutor.shutdownNow();
                if (!verificationExecutor.awaitTermination(10, TimeUnit.SECONDS)) {
                    log.error("[SastVerification] Executor did not terminate after forced shutdown");
                }
            }
        } catch (InterruptedException e) {
            log.error("[SastVerification] Shutdown interrupted, forcing shutdown");
            verificationExecutor.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }

    public void verifyFindings(BearerScanSecurity scanSecurity, BearerScanDataflow scanDataflow, String repoDir) {
        verifyFindings(scanSecurity, scanDataflow, repoDir, null);
    }

    /**
     * Verifies all SAST findings using the LLM. The optional {@code onItemVerified} callback is
     * invoked immediately after each item's verdict is confirmed, allowing the caller to persist
     * intermediate results so that a container restart does not discard already-completed work.
     */
    public void verifyFindings(BearerScanSecurity scanSecurity, BearerScanDataflow scanDataflow, String repoDir,
            Consumer<Item> onItemVerified) {
        if (!llmApiClient.isEnabled()) {
            log.debug("[SastVerification] LLM evaluation is disabled, skipping verification");
            return;
        }

        log.info("[SastVerification] Starting LLM-based SAST finding verification (critical/high/medium only)");
        VerificationSummary summary = new VerificationSummary();

        if (scanSecurity.getCritical() != null && !scanSecurity.getCritical().isEmpty()) {
            summary.add(verifyItems(scanSecurity.getCritical(), repoDir, scanDataflow, true, onItemVerified));
        }
        if (scanSecurity.getHigh() != null && !scanSecurity.getHigh().isEmpty()) {
            summary.add(verifyItems(scanSecurity.getHigh(), repoDir, scanDataflow, true, onItemVerified));
        }
        if (scanSecurity.getMedium() != null && !scanSecurity.getMedium().isEmpty()) {
            summary.add(verifyItems(scanSecurity.getMedium(), repoDir, scanDataflow, true, onItemVerified));
        }

        log.info("[SastVerification] Completed LLM evaluation. Total findings: {}, LLM requests: {}, valid verdicts: {}, not verified: {}, cache hits: {}, normalized verdicts: {}, json repairs attempted: {}, json repairs succeeded: {}, duplicate actions skipped: {}, query expansions used: {}, validation overrides: {}, remediation corrections: {}, rejection reasons: {}",
                summary.totalFindings, summary.llmRequests, summary.validVerdicts, summary.notVerified,
                summary.cacheHits, summary.normalizedVerdicts, summary.jsonRepairAttempts,
                summary.jsonRepairSuccesses, summary.duplicateActionsSkipped,
                summary.queryExpansionsUsed, summary.validationOverrides,
                summary.remediationCorrections, summary.formatFailureReasons());
    }

    private VerificationSummary verifyItems(List<Item> items, String repoDir, BearerScanDataflow dataflow, boolean useDataflow) {
        return verifyItems(items, repoDir, dataflow, useDataflow, null);
    }

    private VerificationSummary verifyItems(List<Item> items, String repoDir, BearerScanDataflow dataflow,
            boolean useDataflow, Consumer<Item> onItemVerified) {
        ConcurrentVerificationSummary summary = new ConcurrentVerificationSummary();
        if (items == null || items.isEmpty()) return summary.toVerificationSummary();
        summary.totalFindings.set(items.size());

        // Phase 1: Filter out cached and hardcoded secret findings (sequential, fast)
        List<Item> toVerify = new ArrayList<>();
        for (Item item : items) {
            if (isHardcodedSecretFinding(item)) {
                log.info("[SastVerification] Skipping LLM verification for hardcoded secret {}",
                        formatItemRef(item));
                summary.totalFindings.decrementAndGet();
                continue;
            }
            if (item.getFingerprint() != null) {
                CachedVerdict cached = fingerprintCache.get(item.getFingerprint());
                if (cached != null) {
                    item.setAiVerdict(cached.verdict);
                    item.setAiConfidence(cached.confidence);
                    item.setAiReasoning(cached.reasoning);
                    item.setAiRecommendation(cached.recommendation);
                    log.debug("[SastVerification] Cache hit for fingerprint {}", item.getFingerprint());
                    summary.cacheHits.incrementAndGet();
                    summary.validVerdicts.incrementAndGet();
                    invokeCallback(onItemVerified, item);
                    continue;
                }
            }
            toVerify.add(item);
        }

        if (toVerify.isEmpty()) {
            return summary.toVerificationSummary();
        }

        // Phase 2: Parallel verification of remaining findings
        log.info("[SastVerification] Verifying {} findings in parallel", toVerify.size());
        
        List<CompletableFuture<Void>> futures = new ArrayList<>();
        for (Item item : toVerify) {
            CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
                if (Thread.currentThread().isInterrupted()) {
                    log.warn("[SastVerification] Verification interrupted for {}", formatItemRef(item));
                    return;
                }
                try {
                    VerificationResult result = verifySingleItem(item, repoDir, dataflow, useDataflow);
                    
                    // Update thread-safe counters
                    summary.llmRequests.addAndGet(result.llmRequests());
                    summary.jsonRepairAttempts.addAndGet(result.jsonRepairAttempts());
                    summary.jsonRepairSuccesses.addAndGet(result.jsonRepairSuccesses());
                    summary.duplicateActionsSkipped.addAndGet(result.duplicateActionsSkipped());
                    summary.queryExpansionsUsed.addAndGet(result.queryExpansionsUsed());
                    summary.validationOverrides.addAndGet(result.validationOverrides());
                    summary.remediationCorrections.addAndGet(result.remediationCorrections());
                    
                    if (result.verified()) {
                        summary.validVerdicts.incrementAndGet();
                        if (result.normalized()) {
                            summary.normalizedVerdicts.incrementAndGet();
                        }
                        invokeCallback(onItemVerified, item);
                    } else {
                        summary.notVerified.incrementAndGet();
                        summary.addFailure(result.failureReason());
                    }
                } catch (Throwable t) {
                    summary.notVerified.incrementAndGet();
                    log.error("[SastVerification] Verification threw for {}: {}",
                            formatItemRef(item), t.getMessage(), t);
                }
            }, verificationExecutor);
            
            futures.add(future);
        }

        // Wait for all verifications to complete
        try {
            CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]))
                    .get(30, TimeUnit.MINUTES); // Timeout for entire batch
        } catch (TimeoutException e) {
            log.error("[SastVerification] Verification batch timed out after 30 minutes, cancelling remaining");
            futures.forEach(f -> f.cancel(true));
        } catch (InterruptedException e) {
            log.warn("[SastVerification] Verification batch interrupted");
            futures.forEach(f -> f.cancel(true));
            Thread.currentThread().interrupt();
        } catch (ExecutionException e) {
            log.error("[SastVerification] Verification batch failed: {}", e.getMessage(), e);
        }

        return summary.toVerificationSummary();
    }

    private record ReactOutcome(VerificationResult result, List<Map<String, Object>> messages) {}

    private String systemPromptFor(SastRuleMetadata metadata) {
        return isMisconfigurationProfile(metadata) ? MISCONFIGURATION_SYSTEM_PROMPT : SYSTEM_PROMPT;
    }

    private String validatorSystemPromptFor(SastRuleMetadata metadata) {
        return isMisconfigurationProfile(metadata) ? MISCONFIGURATION_VALIDATOR_SYSTEM_PROMPT : VALIDATOR_SYSTEM_PROMPT;
    }

    private boolean isMisconfigurationProfile(SastRuleMetadata metadata) {
        if (metadata == null || metadata.promptProfile() == null) {
            return false;
        }
        // Cookie flag findings are configuration issues: use the same no-taint / force-TP policy.
        return metadata.promptProfile() == PromptProfile.MISCONFIGURATION
                || metadata.promptProfile() == PromptProfile.COOKIE_SECURITY
                || metadata.family() == VulnerabilityFamily.COOKIE_SECURITY;
    }

    private boolean isHardcodedSecretFinding(Item item) {
        return item != null
                && item.getId() != null
                && SKIP_LLM_HARDCODED_SECRET_RULES.contains(item.getId());
    }

    private VerificationResult verifySingleItem(Item item, String repoDir, BearerScanDataflow dataflow, boolean useDataflow) {
        CodeContextExtractor.CodeContext context = useDataflow && dataflow != null
                ? codeContextExtractor.extractWithDataflow(repoDir, item, dataflow)
                : codeContextExtractor.extractLocal(repoDir, item);
        FindingEvidence structuredEvidence = sastEvidenceService.buildEvidence(item, context);

        StringBuilder userPrompt = new StringBuilder();
        userPrompt.append("Analyze this finding and determine if it is a TRUE positive, FALSE positive, or UNCERTAIN.\n\n");
        userPrompt.append(buildFindingSection(item, context.language()));
        userPrompt.append(buildDescriptionSection(item));
        userPrompt.append(buildLocalTriageSection(item));
        userPrompt.append(structuredEvidence.toPromptSection());
        userPrompt.append(sastCwePromptGuidanceService.buildGuidance(structuredEvidence.metadata()));
        userPrompt.append(buildCodeInjectionNameSlotSection(item));
        userPrompt.append(buildCodeContextSection(context));

        if (useDataflow && !context.relatedFiles().isEmpty()) {
            userPrompt.append(buildRelatedFilesSection(context));
        }

        if (!context.reactSuggestions().isEmpty()) {
            userPrompt.append(buildReactSuggestionsSection(context));
        }

        userPrompt.append(buildInstructionsSection(useDataflow && !context.relatedFiles().isEmpty(), context.category(), item));

        String itemRef = formatItemRef(item);
        SastRuleMetadata metadata = structuredEvidence.metadata();
        ReactOutcome outcome = runReactVerification(item, repoDir, userPrompt.toString(), itemRef,
                context.category(), metadata);
        VerificationResult result = outcome.result();

        // Verdict validation: independent peer review (adds 1 LLM request)
        if (result.verified()) {
            rateLimitPause();
            int[] validationMetrics = validateVerdict(outcome.messages(), item, itemRef, context, metadata);
            result = new VerificationResult(result.verified(), result.failureReason(), result.normalized(),
                    result.llmRequests() + 1, result.jsonRepairAttempts(), result.jsonRepairSuccesses(),
                    result.duplicateActionsSkipped(), result.queryExpansionsUsed(),
                    validationMetrics[0], validationMetrics[1]);
        }
        if (result.verified()) {
            try {
                boolean deterministicNormalized = applyDeterministicContextNormalizations(item, context,
                        outcome.messages(), itemRef, metadata, structuredEvidence);
                if (deterministicNormalized) {
                    result = new VerificationResult(result.verified(), result.failureReason(), true,
                            result.llmRequests(), result.jsonRepairAttempts(), result.jsonRepairSuccesses(),
                            result.duplicateActionsSkipped(), result.queryExpansionsUsed(),
                            result.validationOverrides(), result.remediationCorrections());
                }
            } catch (Throwable t) {
                log.error("[SastVerification] Deterministic normalization threw for {}, keeping validator verdict {}: {}",
                        itemRef, item.getAiVerdict(), t.getMessage(), t);
            }
        }
        if (result.verified()) {
            try {
                sastConsistencyService.recordFinding(item, structuredEvidence);
            } catch (Throwable t) {
                log.error("[SastVerification] Consistency recording threw for {}: {}", itemRef, t.getMessage(), t);
            }
        }

        return result;
    }

    /**
     * Runs a ReAct-style investigation loop for one finding. In each turn the model
     * returns a single JSON object that is either a tool request
     * ({@code search_repo}/{@code read_file}) or the final verdict
     * ({@code "action":"final"}). Tool requests are executed against the repository via
     * {@link CodeSearchService} and their results are fed back as observations. This works
     * on any OpenAI-compatible chat model without native function-calling support.
     */
    private ReactOutcome runReactVerification(Item item, String repoDir, String userPrompt, String itemRef,
                                               CodeContextExtractor.EvidenceCategory category,
                                               SastRuleMetadata metadata) {
        List<Map<String, Object>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPromptFor(metadata)));
        messages.add(Map.of("role", "user", "content", userPrompt));

        long startedAt = System.currentTimeMillis();
        log.info("[SastVerification] Starting ReAct verification for {}", itemRef);

        int toolBudget = resolveToolBudget(category, metadata);
        int maxToolRounds = resolveToolRounds(category, metadata);
        int llmRequests = 0;
        int jsonRepairAttempts = 0;
        int jsonRepairSuccesses = 0;
        int duplicateActionsSkipped = 0;
        int queryExpansionsUsed = 0;
        int weakReasoningRepairs = 0;
        boolean pendingReadAfterSearch = false;
        int readEnforcementPrompts = 0;
        Set<String> seenActions = new HashSet<>();
        for (int round = 0; round <= maxToolRounds; round++) {
            boolean lastRound = round == maxToolRounds || toolBudget <= 0;

            List<Map<String, Object>> requestMessages = messages;
            if (lastRound) {
                requestMessages = new ArrayList<>(messages);
                requestMessages.add(Map.of("role", "user", "content",
                        "Stop investigating and respond NOW with the final JSON object "
                                + "(\"action\":\"final\" plus all verdict fields). Do not request any tool."));
            }

            LlmApiClient.LlmResponse response = llmApiClient.chatCompletion(requestMessages, true);
            llmRequests++;
            if (response.isEmpty()) {
                long elapsedMs = System.currentTimeMillis() - startedAt;
                log.warn("[SastVerification] LLM request failed or returned empty response for {} after {} ms (round {}).",
                        itemRef, elapsedMs, round);
                return new ReactOutcome(VerificationResult.failed(ParseFailureReason.EMPTY_RESPONSE, llmRequests, jsonRepairAttempts,
                        jsonRepairSuccesses, duplicateActionsSkipped, queryExpansionsUsed), messages);
            }

            JsonNode node = tryParseJson(response.content());
            String action = node != null ? node.path("action").asText("") : "";

            if (!lastRound && ("search_repo".equals(action) || "read_file".equals(action))) {
                String actionKey = buildActionKey(action, node);
                if (seenActions.contains(actionKey)) {
                    duplicateActionsSkipped++;
                    messages.add(Map.of("role", "assistant", "content", response.content()));
                    messages.add(Map.of("role", "user", "content",
                            "TOOL RESULT (" + action + "):\nDuplicate action skipped (already executed). "
                                    + "Use a different query/path or provide final verdict."));
                    continue;
                }

                ActionExecution execution = executeReactAction(action, node, repoDir, itemRef);
                if (execution.queryExpansionUsed()) {
                    queryExpansionsUsed++;
                }
                if ("search_repo".equals(action)) {
                    pendingReadAfterSearch = true;
                } else if ("read_file".equals(action)) {
                    pendingReadAfterSearch = false;
                }
                seenActions.add(actionKey);
                messages.add(Map.of("role", "assistant", "content", response.content()));
                messages.add(Map.of("role", "user", "content",
                        "TOOL RESULT (" + action + "):\n" + execution.observation()));
                toolBudget--;
                continue;
            }

            if (pendingReadAfterSearch && toolBudget > 0 && readEnforcementPrompts < 2 && !lastRound) {
                readEnforcementPrompts++;
                messages.add(Map.of("role", "assistant", "content", response.content()));
                messages.add(Map.of("role", "user", "content",
                        "Before final verdict, you must execute at least one read_file action to inspect concrete code lines "
                                + "for the source-to-sink path. Do not finalize yet."));
                continue;
            }

            long elapsedMs = System.currentTimeMillis() - startedAt;
            StageOneParse stageOne = parseStageOneResponse(response.content());
            VerificationResult result;
            if (stageOne.verdict() != null) {
                VerificationResult expanded = requestStageTwoDetails(messages, response.content(), stageOne.verdict(),
                        item, itemRef, metadata);
                llmRequests += expanded.llmRequests();
                if (expanded.verified()) {
                    result = expanded.withMetrics(llmRequests, jsonRepairAttempts, jsonRepairSuccesses,
                            duplicateActionsSkipped, queryExpansionsUsed);
                } else {
                    applyMinimalVerdict(stageOne.verdict(), item);
                    result = VerificationResult.verified(true, llmRequests, jsonRepairAttempts, jsonRepairSuccesses,
                            duplicateActionsSkipped, queryExpansionsUsed);
                }
            } else {
                result = VerificationResult.failed(stageOne.failureReason(), llmRequests, jsonRepairAttempts,
                        jsonRepairSuccesses, duplicateActionsSkipped, queryExpansionsUsed);
            }
            if (!result.verified()) {
                if (result.failureReason() == ParseFailureReason.INVALID_JSON
                        && jsonRepairAttempts < MAX_JSON_REPAIR_ATTEMPTS) {
                    jsonRepairAttempts++;
                    VerificationResult repaired = retryJsonRepair(messages, response.content(), item, itemRef, metadata);
                    llmRequests += repaired.llmRequests();
                    if (repaired.verified()) {
                        jsonRepairSuccesses++;
                        return new ReactOutcome(VerificationResult.verified(repaired.normalized(),
                                llmRequests, jsonRepairAttempts, jsonRepairSuccesses,
                                duplicateActionsSkipped, queryExpansionsUsed), messages);
                    }
                    result = VerificationResult.failed(repaired.failureReason(),
                            llmRequests, jsonRepairAttempts, jsonRepairSuccesses,
                            duplicateActionsSkipped, queryExpansionsUsed);
                } else if (result.failureReason() == ParseFailureReason.MISSING_VERDICT
                        && jsonRepairAttempts < (MAX_JSON_REPAIR_ATTEMPTS + MAX_MISSING_VERDICT_RETRIES)) {
                    jsonRepairAttempts++;
                    VerificationResult repaired = retryMissingVerdict(messages, response.content(), item, itemRef,
                            llmRequests, metadata);
                    llmRequests += repaired.llmRequests();
                    if (repaired.verified()) {
                        jsonRepairSuccesses++;
                        return new ReactOutcome(VerificationResult.verified(repaired.normalized(),
                                llmRequests, jsonRepairAttempts, jsonRepairSuccesses,
                                duplicateActionsSkipped, queryExpansionsUsed), messages);
                    }
                    result = VerificationResult.failed(repaired.failureReason(),
                            llmRequests, jsonRepairAttempts, jsonRepairSuccesses,
                            duplicateActionsSkipped, queryExpansionsUsed);
                } else if (result.failureReason() == ParseFailureReason.MISSING_CONFIDENCE
                        && jsonRepairAttempts < (MAX_JSON_REPAIR_ATTEMPTS + MAX_MISSING_VERDICT_RETRIES + MAX_MISSING_CONFIDENCE_RETRIES)) {
                    jsonRepairAttempts++;
                    VerificationResult repaired = retryMissingConfidence(messages, response.content(), item, itemRef,
                            llmRequests, metadata);
                    llmRequests += repaired.llmRequests();
                    if (repaired.verified()) {
                        jsonRepairSuccesses++;
                        return new ReactOutcome(VerificationResult.verified(repaired.normalized(),
                                llmRequests, jsonRepairAttempts, jsonRepairSuccesses,
                                duplicateActionsSkipped, queryExpansionsUsed), messages);
                    }
                    result = VerificationResult.failed(repaired.failureReason(),
                            llmRequests, jsonRepairAttempts, jsonRepairSuccesses,
                            duplicateActionsSkipped, queryExpansionsUsed);
                } else if ((result.failureReason() == ParseFailureReason.MISSING_EXECUTION_CONTEXT
                        || result.failureReason() == ParseFailureReason.MISSING_INPUT_SOURCE)
                        && jsonRepairAttempts < (MAX_JSON_REPAIR_ATTEMPTS
                        + MAX_MISSING_VERDICT_RETRIES
                        + MAX_MISSING_CONFIDENCE_RETRIES
                        + MAX_MISSING_CONTEXT_RETRIES)) {
                    jsonRepairAttempts++;
                    VerificationResult repaired = retryMissingContextFields(messages, response.content(), item, itemRef,
                            metadata);
                    llmRequests += repaired.llmRequests();
                    if (repaired.verified()) {
                        jsonRepairSuccesses++;
                        return new ReactOutcome(VerificationResult.verified(repaired.normalized(),
                                llmRequests, jsonRepairAttempts, jsonRepairSuccesses,
                                duplicateActionsSkipped, queryExpansionsUsed), messages);
                    }
                    result = VerificationResult.failed(repaired.failureReason(),
                            llmRequests, jsonRepairAttempts, jsonRepairSuccesses,
                            duplicateActionsSkipped, queryExpansionsUsed);
                } else {
                    result = result.withMetrics(llmRequests, jsonRepairAttempts, jsonRepairSuccesses,
                            duplicateActionsSkipped, queryExpansionsUsed);
                }
            } else {
                result = result.withMetrics(llmRequests, jsonRepairAttempts, jsonRepairSuccesses,
                        duplicateActionsSkipped, queryExpansionsUsed);
            }

            boolean stage2ResolvedUncertain = result.verified()
                    && stageOne.verdict() != null
                    && "UNCERTAIN".equals(stageOne.verdict().verdict())
                    && !"UNCERTAIN".equals(item.getAiVerdict());

            if (result.verified()
                    && !stage2ResolvedUncertain
                    && weakReasoningRepairs < MAX_WEAK_REASONING_REPAIR_ATTEMPTS
                    && shouldRepairWeakReasoning(item.getAiReasoning())) {
                weakReasoningRepairs++;
                VerificationResult repairedReasoning = retryWeakReasoningRepair(messages, response.content(), item,
                        itemRef, metadata);
                llmRequests += repairedReasoning.llmRequests();
                if (repairedReasoning.verified()) {
                    result = repairedReasoning.withMetrics(llmRequests, jsonRepairAttempts, jsonRepairSuccesses,
                            duplicateActionsSkipped, queryExpansionsUsed);
                }
            }

            if (result.verified()) {
                log.info("[SastVerification] ReAct verification succeeded for {} after {} ms ({} tool call(s)). Verdict: {}, confidence: {} ({})",
                        itemRef, elapsedMs, resolveToolBudget(category, metadata) - toolBudget,
                        item.getAiVerdict(), item.getAiConfidence(),
                        ConfidenceLevel.fromConfidence(item.getAiConfidence()));
            } else {
                log.warn("[SastVerification] ReAct verification completed but response was not usable for {} after {} ms",
                        itemRef, elapsedMs);
                log.warn("[SastVerification] Raw unusable LLM response for {}: {}",
                        itemRef, truncateForLog(response.content(), RAW_RESPONSE_LOG_LIMIT));
            }
            return new ReactOutcome(result, messages);
        }

        return new ReactOutcome(
                VerificationResult.failed(ParseFailureReason.EMPTY_RESPONSE, llmRequests, jsonRepairAttempts,
                        jsonRepairSuccesses, duplicateActionsSkipped, queryExpansionsUsed),
                messages);
    }

    /**
     * Executes a ReAct tool action against the scanned repository and returns the textual
     * observation to feed back to the model. Never throws.
     */
    private ActionExecution executeReactAction(String action, JsonNode node, String repoDir, String itemRef) {
        try {
            if ("search_repo".equals(action)) {
                String pattern = node.path("pattern").asText("");
                String pathGlob = node.path("path_glob").asText("");
                log.info("[SastVerification] ReAct search_repo(pattern='{}', glob='{}') for {}",
                        truncateForLog(pattern, 120), pathGlob, itemRef);
                String result = codeSearchService.searchRepo(repoDir, pattern, pathGlob);
                if (!isNoMatchesResult(result)) {
                    return ActionExecution.of(result, false);
                }
                List<String> fallbackPatterns = expandSearchPattern(pattern);
                if (fallbackPatterns.isEmpty()) {
                    return ActionExecution.of(result, false);
                }
                StringBuilder merged = new StringBuilder(result);
                boolean expansionUsed = false;
                for (String fallback : fallbackPatterns) {
                    if (fallback.equals(pattern)) {
                        continue;
                    }
                    String fallbackResult = codeSearchService.searchRepo(repoDir, fallback, pathGlob);
                    if (!isNoMatchesResult(fallbackResult)) {
                        expansionUsed = true;
                        merged.append("\n\nQuery expansion [").append(fallback).append("]:\n")
                                .append(fallbackResult);
                    }
                }
                return ActionExecution.of(merged.toString(), expansionUsed);
            }
            if ("read_file".equals(action)) {
                String path = node.path("path").asText("");
                int startLine = node.path("start_line").asInt(0);
                int endLine = node.path("end_line").asInt(0);
                log.info("[SastVerification] ReAct read_file(path='{}', {}-{}) for {}",
                        path, startLine, endLine, itemRef);
                return ActionExecution.of(codeSearchService.readFile(repoDir, path, startLine, endLine), false);
            }
            return ActionExecution.of("Unknown action: " + action, false);
        } catch (Exception e) {
            log.warn("[SastVerification] ReAct action '{}' failed for {}: {}", action, itemRef, e.getMessage());
            return ActionExecution.of("Tool execution error: " + e.getMessage(), false);
        }
    }

    private String buildActionKey(String action, JsonNode node) {
        if ("search_repo".equals(action)) {
            return "search_repo|" + node.path("pattern").asText("").trim().toLowerCase(Locale.ROOT)
                    + "|" + node.path("path_glob").asText("").trim().toLowerCase(Locale.ROOT);
        }
        if ("read_file".equals(action)) {
            return "read_file|" + node.path("path").asText("").trim().toLowerCase(Locale.ROOT)
                    + "|" + node.path("start_line").asInt(0) + "|" + node.path("end_line").asInt(0);
        }
        return action;
    }

    private boolean isNoMatchesResult(String result) {
        return result != null && result.startsWith("No matches found for pattern:");
    }

    private List<String> expandSearchPattern(String pattern) {
        if (pattern == null || pattern.isBlank()) {
            return List.of();
        }
        Set<String> expanded = new LinkedHashSet<>();
        expanded.add(pattern);
        String candidate = pattern.trim();

        // Handle dotted field access (e.g. file.filepath, answers.destination, obj.field)
        if (candidate.contains(".")) {
            String[] parts = candidate.split("\\.", 2);
            if (parts.length == 2) {
                String objectName = parts[0];
                String fieldName = parts[1];
                
                // Object assignment: file = , file=...
                expanded.add("\\b" + objectName + "\\s*=(?!=)");
                
                // Field assignment: file.filepath = , obj.field =
                expanded.add("\\b" + objectName + "\\." + fieldName + "\\s*=(?!=)");
                
                // Setter method: setFilepath(, setField(
                String setterName = "set" + Character.toUpperCase(fieldName.charAt(0)) + fieldName.substring(1);
                expanded.add("\\b" + setterName + "\\s*\\(");
                
                // Constructor/builder pattern: new ... (filepath: , fieldName:
                expanded.add(fieldName + "\\s*:");
                
                // Getter method (to find where object comes from): getFilepath()
                String getterName = "get" + Character.toUpperCase(fieldName.charAt(0)) + fieldName.substring(1);
                expanded.add("\\b" + getterName + "\\s*\\(");
                
                // Just the field name alone (may reveal assignments or definitions)
                expanded.add("\\b" + fieldName + "\\s*=(?!=)");
            }
        }

        // Stimulus framework patterns
        if (candidate.endsWith("Value")) {
            String base = candidate.substring(0, candidate.length() - "Value".length());
            if (!base.isBlank()) {
                expanded.add("static\\s+values\\s*=\\s*\\{");
                expanded.add("\\b" + base + "\\s*:");
                expanded.add("data-.*" + base.toLowerCase(Locale.ROOT) + ".*-value");
            }
        }
        if (candidate.endsWith("Target")) {
            String base = candidate.substring(0, candidate.length() - "Target".length());
            if (!base.isBlank()) {
                expanded.add("static\\s+targets\\s*=\\s*\\[");
                expanded.add("\\b" + base + "\\b");
                expanded.add("data-.*target");
            }
        }
        
        // Common getter/setter patterns for simple identifiers
        if (!candidate.contains(".") && !candidate.contains("(") && !candidate.contains(")")) {
            String capitalized = Character.toUpperCase(candidate.charAt(0)) + candidate.substring(1);
            expanded.add("get" + capitalized + "\\s*\\(");
            expanded.add("set" + capitalized + "\\s*\\(");
            
            // Constructor parameter pattern
            expanded.add("\\(.*\\b" + candidate + "\\s*[,)]");
            
            // Method parameter pattern
            expanded.add("\\bfunction\\s+\\w+\\s*\\([^)]*\\b" + candidate + "\\b");
            expanded.add("\\b\\w+\\s*\\([^)]*\\b" + candidate + "\\b[,)]");
        }
        
        return expanded.stream().toList();
    }

    private int resolveToolBudget(CodeContextExtractor.EvidenceCategory category, SastRuleMetadata metadata) {
        // Path Traversal and classic taint sinks need higher budget for deep source tracing
        if (metadata != null) {
            if (metadata.family() == VulnerabilityFamily.PATH_TRAVERSAL) {
                return category == CodeContextExtractor.EvidenceCategory.DEAD_END 
                    ? Math.max(MAX_TOOL_CALLS_PATH_TRAVERSAL, 12)
                    : MAX_TOOL_CALLS_PATH_TRAVERSAL;
            }
            if (metadata.family() == VulnerabilityFamily.SQL_INJECTION
                    || metadata.family() == VulnerabilityFamily.XSS
                    || metadata.family() == VulnerabilityFamily.COMMAND_INJECTION) {
                return category == CodeContextExtractor.EvidenceCategory.DEAD_END
                    ? Math.max(MAX_TOOL_CALLS_TAINT, 10)
                    : MAX_TOOL_CALLS_TAINT;
            }
        }
        
        if (category == null) {
            return MAX_TOOL_CALLS_PER_FINDING;
        }
        return switch (category) {
            case DEAD_END -> Math.max(MAX_TOOL_CALLS_PER_FINDING, 10);
            case AMBIGUOUS -> Math.max(MAX_TOOL_CALLS_PER_FINDING, 8);
            default -> MAX_TOOL_CALLS_PER_FINDING;
        };
    }

    private int resolveToolRounds(CodeContextExtractor.EvidenceCategory category, SastRuleMetadata metadata) {
        // More rounds for Path Traversal to trace through object fields
        if (metadata != null && metadata.family() == VulnerabilityFamily.PATH_TRAVERSAL) {
            return category == CodeContextExtractor.EvidenceCategory.DEAD_END 
                ? Math.max(MAX_TOOL_ROUNDS, 8)
                : Math.max(MAX_TOOL_ROUNDS, 6);
        }
        
        if (category == null) {
            return MAX_TOOL_ROUNDS;
        }
        return switch (category) {
            case DEAD_END -> Math.max(MAX_TOOL_ROUNDS, 7);
            case AMBIGUOUS -> Math.max(MAX_TOOL_ROUNDS, 6);
            default -> MAX_TOOL_ROUNDS;
        };
    }

    private boolean shouldRepairWeakReasoning(String reasoning) {
        if (reasoning == null || reasoning.isBlank()) {
            return false;
        }
        int sentenceCount = countSentences(reasoning);
        String lower = reasoning.toLowerCase(Locale.ROOT);
        boolean hasFlowWords = lower.contains("source") && (lower.contains("sink") || lower.contains("logger"));
        boolean hasFlowArrow = reasoning.contains("->");
        return sentenceCount < 3 || (!hasFlowWords && !hasFlowArrow);
    }

    private int countSentences(String text) {
        int count = 0;
        boolean inSentence = false;
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (!Character.isWhitespace(c)) {
                inSentence = true;
            }
            if ((c == '.' || c == '!' || c == '?') && inSentence) {
                count++;
                inSentence = false;
            }
        }
        if (count == 0 && !text.isBlank()) {
            return 1;
        }
        return count;
    }

    private VerificationResult retryJsonRepair(List<Map<String, Object>> messages, String rawResponse,
                                               Item item, String itemRef, SastRuleMetadata metadata) {
        List<Map<String, Object>> repairMessages = new ArrayList<>(messages);
        repairMessages.add(Map.of("role", "assistant", "content", rawResponse));
        repairMessages.add(Map.of("role", "user", "content",
                "Your previous response was not valid JSON. Return exactly one valid JSON object now, "
                        + "using Stage 1 minimal schema: "
                        + "{\"action\":\"final\",\"verdict\":\"TRUE_POSITIVE|FALSE_POSITIVE|UNCERTAIN\","
                        + "\"confidence\":0.0-1.0,\"reasoning\":\"3-6 sentences\"}. "
                        + "No markdown, no explanation, no code fences."));

        LlmApiClient.LlmResponse repairResponse = llmApiClient.chatCompletion(repairMessages, true);
        if (repairResponse.isEmpty()) {
            log.warn("[SastVerification] JSON repair retry returned empty response for {}", itemRef);
            return VerificationResult.failed(ParseFailureReason.EMPTY_RESPONSE, 1, 0, 0, 0, 0);
        }

        StageOneParse stageOne = parseStageOneResponse(repairResponse.content());
        if (stageOne.verdict() == null) {
            log.warn("[SastVerification] JSON repair retry still unusable for {}: {}",
                    itemRef, stageOne.failureReason());
            return VerificationResult.failed(stageOne.failureReason(), 1, 0, 0, 0, 0);
        }
        VerificationResult expanded = requestStageTwoDetails(repairMessages, repairResponse.content(), stageOne.verdict(),
                item, itemRef, metadata);
        if (!expanded.verified()) {
            applyMinimalVerdict(stageOne.verdict(), item);
            return VerificationResult.verified(true, 1 + expanded.llmRequests(), 0, 0, 0, 0);
        }
        return expanded.withMetrics(1 + expanded.llmRequests(), 0, 0, 0, 0);
    }

    private VerificationResult retryMissingVerdict(List<Map<String, Object>> messages, String rawResponse,
                                                   Item item, String itemRef, int llmRequestsSoFar,
                                                   SastRuleMetadata metadata) {
        List<Map<String, Object>> retryMessages = new ArrayList<>(messages);
        retryMessages.add(Map.of("role", "assistant", "content", rawResponse));
        retryMessages.add(Map.of("role", "user", "content",
                "Your previous response missed required verdict fields. Return exactly one valid JSON object now "
                        + "using this minimal final schema: "
                        + "{\"action\":\"final\",\"verdict\":\"TRUE_POSITIVE|FALSE_POSITIVE|UNCERTAIN\","
                        + "\"confidence\":0.0-1.0}. "
                        + "No extra fields, no markdown, no prose."));

        LlmApiClient.LlmResponse retryResponse = llmApiClient.chatCompletion(retryMessages, true);
        if (retryResponse.isEmpty()) {
            log.warn("[SastVerification] Missing-verdict retry returned empty response for {}", itemRef);
            return VerificationResult.failed(ParseFailureReason.EMPTY_RESPONSE, 1, 0, 0, 0, 0);
        }

        StageOneParse stageOne = parseStageOneResponse(retryResponse.content());
        if (stageOne.verdict() == null) {
            log.warn("[SastVerification] Missing-verdict retry still unusable for {}: {}",
                    itemRef, stageOne.failureReason());
            return VerificationResult.failed(stageOne.failureReason(), 1, 0, 0, 0, 0);
        }
        VerificationResult expanded = requestStageTwoDetails(retryMessages, retryResponse.content(), stageOne.verdict(),
                item, itemRef, metadata);
        if (!expanded.verified()) {
            applyMinimalVerdict(stageOne.verdict(), item);
            return VerificationResult.verified(true, 1 + expanded.llmRequests(), 0, 0, 0, 0);
        }
        return expanded.withMetrics(1 + expanded.llmRequests(), 0, 0, 0, 0);
    }

    private VerificationResult retryMissingConfidence(List<Map<String, Object>> messages, String rawResponse,
                                                      Item item, String itemRef, int llmRequestsSoFar,
                                                      SastRuleMetadata metadata) {
        List<Map<String, Object>> retryMessages = new ArrayList<>(messages);
        retryMessages.add(Map.of("role", "assistant", "content", rawResponse));
        retryMessages.add(Map.of("role", "user", "content",
                "Your previous response missed `confidence`. Return exactly one valid JSON object now "
                        + "using Stage 1 minimal schema: "
                        + "{\"action\":\"final\",\"verdict\":\"TRUE_POSITIVE|FALSE_POSITIVE|UNCERTAIN\","
                        + "\"confidence\":0.0-1.0,\"reasoning\":\"3-6 sentences\"}. "
                        + "No extra fields, no markdown, no prose."));

        LlmApiClient.LlmResponse retryResponse = llmApiClient.chatCompletion(retryMessages, true);
        if (retryResponse.isEmpty()) {
            log.warn("[SastVerification] Missing-confidence retry returned empty response for {}", itemRef);
            return VerificationResult.failed(ParseFailureReason.EMPTY_RESPONSE, 1, 0, 0, 0, 0);
        }

        StageOneParse stageOne = parseStageOneResponse(retryResponse.content());
        if (stageOne.verdict() == null) {
            log.warn("[SastVerification] Missing-confidence retry still unusable for {}: {}",
                    itemRef, stageOne.failureReason());
            return VerificationResult.failed(stageOne.failureReason(), 1, 0, 0, 0, 0);
        }
        VerificationResult expanded = requestStageTwoDetails(retryMessages, retryResponse.content(), stageOne.verdict(),
                item, itemRef, metadata);
        if (!expanded.verified()) {
            applyMinimalVerdict(stageOne.verdict(), item);
            return VerificationResult.verified(true, 1 + expanded.llmRequests(), 0, 0, 0, 0);
        }
        return expanded.withMetrics(1 + expanded.llmRequests(), 0, 0, 0, 0);
    }

    private StageOneParse parseStageOneResponse(String content) {
        JsonNode node = tryParseJson(content);
        if (node == null || !node.isObject()) {
            return new StageOneParse(null, ParseFailureReason.INVALID_JSON);
        }
        String action = textValue(node, "action");
        if (!"final".equals(action)) {
            return new StageOneParse(null, ParseFailureReason.MISSING_ACTION);
        }
        String verdict = textValue(node, "verdict");
        if (!isValidVerdict(verdict)) {
            return new StageOneParse(null, ParseFailureReason.MISSING_VERDICT);
        }
        if (!node.hasNonNull("confidence") || !node.get("confidence").isNumber()) {
            return new StageOneParse(null, ParseFailureReason.MISSING_CONFIDENCE);
        }
        String reasoning = textValue(node, "reasoning");
        if (reasoning.isBlank()) {
            return new StageOneParse(null, ParseFailureReason.MISSING_REASONING);
        }
        return new StageOneParse(new MinimalVerdict(
                verdict,
                Math.max(0.0, Math.min(1.0, node.get("confidence").asDouble())),
                reasoning
        ), null);
    }

    private VerificationResult requestStageTwoDetails(List<Map<String, Object>> messages,
                                                      String stageOneRawResponse,
                                                      MinimalVerdict stageOneVerdict,
                                                      Item item,
                                                      String itemRef,
                                                      SastRuleMetadata metadata) {
        boolean uncertainResolution = "UNCERTAIN".equals(stageOneVerdict.verdict());

        List<Map<String, Object>> stageTwoMessages = new ArrayList<>(messages);
        stageTwoMessages.add(Map.of("role", "assistant", "content", stageOneRawResponse));

        String stageTwoInstruction;
        if (isMisconfigurationProfile(metadata)) {
            stageTwoInstruction = "Stage 2 now: return final JSON with `action` as \"final\". "
                    + "Add required fields: execution_context, input_source, reasoning (3-6 sentences), "
                    + "recommendation, remediation_code, false_positive_evidence. "
                    + "This is a MISCONFIGURATION/API-usage finding, not a classic source-to-sink taint finding. "
                    + "Do NOT change to FALSE_POSITIVE or UNCERTAIN merely because host/user/input origin is config_file, "
                    + "internal_call, environment_variable, local, library, or unknown, or because names/paths suggest "
                    + "test/dev/demo/mock/example. "
                    + "Return TRUE_POSITIVE when the unsafe API/configuration is shown and existing code does not prove "
                    + "a real safety neutralizer (safe wrapper, TLS/SSL enforcement, framework guarantee, or rule-specific "
                    + "neutralizer). Return only valid JSON.";
        } else if (uncertainResolution) {
            stageTwoInstruction = "Stage 2 now: return final JSON with `action` as \"final\". "
                    + "Add required fields: execution_context, input_source, reasoning (3-6 sentences, "
                    + "source -> transformations -> sink), recommendation, remediation_code, false_positive_evidence. "
                    + "IMPORTANT: now that you have classified execution_context and input_source, "
                    + "RE-EVALUATE your verdict. "
                    + (CodeInjectionSinkEvidence.isCodeInjectionFinding(item)
                    ? "For CWE-94/95 setattr / code generation: input_source and verdict depend on the ATTRIBUTE NAME "
                    + "slot, not the assigned VALUE. Literal/constant/internal NAME + no eval/exec/compile sink "
                    + "=> FALSE_POSITIVE even if VALUE is http_request/database. Mass-assignment NAME or a real "
                    + "eval/exec/compile sink => TRUE_POSITIVE. Do NOT keep UNCERTAIN and do NOT change to "
                    + "TRUE_POSITIVE merely because VALUE origin is HTTP/GraphQL/DB/unknown. "
                    : "")
                    + "For classic source-to-sink injection CWEs (not setattr wiring): if input_source resolves "
                    + "to an untrusted origin (http_request, database, file_untrusted, gui_input, url_fragment) "
                    + "AND the sink is exploitable AND no complete neutralizer is proven, you MUST change verdict "
                    + "to TRUE_POSITIVE — do not keep UNCERTAIN merely because the full monorepo call graph was not scanned. "
                    + "If input_source resolves to a trusted origin (internal_call, config_file, environment_variable) "
                    + "or a complete neutralizer is proven (parameterization with proven-safe SQL text, literal SQL, sanitizer), "
                    + "change verdict to FALSE_POSITIVE — EXCEPT for SQL injection: trusted/literal/constant/"
                    + "internal_call/config source + SQL still built by string concatenation/interpolation is a "
                    + "RISKY SCHEME => TRUE_POSITIVE with confidence 0.50-0.60 (~0.55), NOT FALSE_POSITIVE and NOT "
                    + "UNCERTAIN merely because the current source is trusted. For CWE-502 deserialization: "
                    + "env/config trusts the PATH only. "
                    + "Decide on FILE CONTENT control — attacker-influenced bytes => file_untrusted + TRUE_POSITIVE; "
                    + "proven app/operator-only static artifact => FALSE_POSITIVE; writer trust unknown => keep UNCERTAIN. "
                    + "For SQL injection: unknown input_source + clear non-literal "
                    + "string concatenation/interpolation into SQL (any language idiom) without "
                    + "parameterization/allowlist MUST be TRUE_POSITIVE — do not keep UNCERTAIN for unknown origin. "
                    + "For CWE-208 timing: TRUE_POSITIVE only for security-sensitive "
                    + "secret/credential comparisons; non-security UI/hash/routing compares are FALSE_POSITIVE. "
                    + "CLI tool / developer context: if execution_context is cli_developer_tool, CLI arguments, "
                    + "developer prompts (inquirer/prompts answers), tsconfig/package.json options, and process.cwd() "
                    + "are developer-controlled → FALSE_POSITIVE. Do NOT keep UNCERTAIN because 'a developer might "
                    + "accept malicious input' — developer tools are not web attack surfaces. Test context: if the "
                    + "file is *.test.* / *.spec.* / __tests__/, hardcoded paths are test fixtures → FALSE_POSITIVE. "
                    + "Only keep UNCERTAIN if a key fact is genuinely unknown after investigation AND local evidence "
                    + "does not already mandate a verdict. Adjust confidence accordingly. "
                    + "Return only valid JSON.";
        } else {
            stageTwoInstruction = "Stage 2 now: return final JSON with the SAME verdict and confidence "
                    + "(verdict=" + stageOneVerdict.verdict() + ", confidence="
                    + String.format(Locale.ROOT, "%.2f", stageOneVerdict.confidence()) + "). "
                    + "Keep `action` as \"final\". "
                    + "Add required fields: execution_context, input_source, reasoning (3-6 sentences, "
                    + "source -> transformations -> sink), recommendation, remediation_code, false_positive_evidence. "
                    + "Return only valid JSON.";
        }
        stageTwoMessages.add(Map.of("role", "user", "content", stageTwoInstruction));

        LlmApiClient.LlmResponse stageTwoResponse = llmApiClient.chatCompletion(stageTwoMessages, true);
        if (stageTwoResponse.isEmpty()) {
            log.warn("[SastVerification] Stage-2 expansion returned empty response for {}", itemRef);
            return VerificationResult.failed(ParseFailureReason.EMPTY_RESPONSE, 1, 0, 0, 0, 0);
        }

        VerificationResult parsed = parseSingleResponse(stageTwoResponse.content(), item, metadata);
        if (!parsed.verified()) {
            log.warn("[SastVerification] Stage-2 expansion unusable for {}: {}", itemRef, parsed.failureReason());
            return parsed.withMetrics(1, 0, 0, 0, 0);
        }

        if (uncertainResolution && !stageOneVerdict.verdict().equals(item.getAiVerdict())) {
            log.info("[SastVerification] Stage-2 resolved UNCERTAIN for {} -> {} (confidence: {})",
                    itemRef, item.getAiVerdict(),
                    String.format(Locale.ROOT, "%.2f", item.getAiConfidence()));
            return parsed.withMetrics(1, 0, 0, 0, 0);
        }

        if (!uncertainResolution
                && (!stageOneVerdict.verdict().equals(item.getAiVerdict())
                    || Math.abs(stageOneVerdict.confidence() - item.getAiConfidence()) > 0.0001d)) {
            log.warn("[SastVerification] Stage-2 changed verdict/confidence for {} (stage1={}:{}, stage2={}:{})",
                    itemRef,
                    stageOneVerdict.verdict(),
                    String.format(Locale.ROOT, "%.2f", stageOneVerdict.confidence()),
                    item.getAiVerdict(),
                    String.format(Locale.ROOT, "%.2f", item.getAiConfidence()));
            return VerificationResult.failed(ParseFailureReason.INVALID_STAGE2_MISMATCH, 1, 0, 0, 0, 0);
        }
        return parsed.withMetrics(1, 0, 0, 0, 0);
    }

    private void applyMinimalVerdict(MinimalVerdict minimalVerdict, Item item) {
        item.setAiVerdict(minimalVerdict.verdict());
        item.setAiConfidence(minimalVerdict.confidence());
        item.setAiReasoning(minimalVerdict.reasoning());
        item.setAiRecommendation("TRUE_POSITIVE".equals(minimalVerdict.verdict())
                ? defaultTruePositiveRecommendation(item, minimalVerdict.reasoning())
                : null);
    }

    private VerificationResult retryWeakReasoningRepair(List<Map<String, Object>> messages, String rawResponse,
                                                        Item item, String itemRef, SastRuleMetadata metadata) {
        List<Map<String, Object>> repairMessages = new ArrayList<>(messages);
        repairMessages.add(Map.of("role", "assistant", "content", rawResponse));
        repairMessages.add(Map.of("role", "user", "content",
                "Rewrite the final JSON response now. Keep the same verdict unless evidence forces a change, "
                        + "keep `action` as \"final\", and include required fields: execution_context, input_source, "
                        + "verdict, confidence, reasoning, recommendation, remediation_code, false_positive_evidence. "
                        + "If execution_context or input_source is uncertain, set it explicitly to \"unknown\". "
                        + "Also expand `reasoning` to 3-6 sentences and explicitly describe source -> transformations/calls -> sink "
                        + "with concrete code evidence. Return only valid JSON."));

        LlmApiClient.LlmResponse repairResponse = llmApiClient.chatCompletion(repairMessages, true);
        if (repairResponse.isEmpty()) {
            log.warn("[SastVerification] Weak reasoning repair returned empty response for {}", itemRef);
            return VerificationResult.failed(ParseFailureReason.EMPTY_RESPONSE, 1, 0, 0, 0, 0);
        }

        VerificationResult repaired = parseSingleResponse(repairResponse.content(), item, metadata);
        if (!repaired.verified()) {
            log.warn("[SastVerification] Weak reasoning repair still unusable for {}: {}",
                    itemRef, repaired.failureReason());
        }
        return repaired.withMetrics(1, 0, 0, 0, 0);
    }

    private VerificationResult retryMissingContextFields(List<Map<String, Object>> messages, String rawResponse,
                                                         Item item, String itemRef, SastRuleMetadata metadata) {
        List<Map<String, Object>> retryMessages = new ArrayList<>(messages);
        retryMessages.add(Map.of("role", "assistant", "content", rawResponse));
        retryMessages.add(Map.of("role", "user", "content",
                "Your previous final JSON missed required context fields. Return exactly one valid JSON object now, "
                        + "keep `action` as \"final\", keep the same verdict/confidence unless evidence forces a change, "
                        + "and include all required fields: execution_context, input_source, verdict, confidence, reasoning, "
                        + "recommendation, remediation_code, false_positive_evidence. "
                        + "If context cannot be proven from code, set execution_context and/or input_source to \"unknown\". "
                        + "No markdown, no explanations, JSON only."));

        LlmApiClient.LlmResponse retryResponse = llmApiClient.chatCompletion(retryMessages, true);
        if (retryResponse.isEmpty()) {
            log.warn("[SastVerification] Missing-context retry returned empty response for {}", itemRef);
            return VerificationResult.failed(ParseFailureReason.EMPTY_RESPONSE, 1, 0, 0, 0, 0);
        }

        VerificationResult repaired = parseSingleResponse(retryResponse.content(), item, metadata);
        if (!repaired.verified()) {
            log.warn("[SastVerification] Missing-context retry still unusable for {}: {}",
                    itemRef, repaired.failureReason());
        }
        return repaired.withMetrics(1, 0, 0, 0, 0);
    }

    // ── Verdict Validation (independent peer review) ──────────────────────────

    /**
     * Performs an independent LLM peer review of the completed analysis. Builds a fresh
     * context from the code snippets and tool call evidence (without the analyzer's system
     * prompt or calibration rules) and asks a critical reviewer to verify or override
     * the verdict and remediation.
     *
     * @return a two-element int array: [validationOverrides, remediationCorrections]
     */
    private int[] validateVerdict(List<Map<String, Object>> reactMessages, Item item, String itemRef,
                                  CodeContextExtractor.CodeContext context, SastRuleMetadata metadata) {
        String validatorPrompt = buildValidatorPrompt(reactMessages, item, context, metadata);
        List<Map<String, Object>> validatorMessages = new ArrayList<>();
        validatorMessages.add(Map.of("role", "system", "content", validatorSystemPromptFor(metadata)));
        validatorMessages.add(Map.of("role", "user", "content", validatorPrompt));

        LlmApiClient.LlmResponse response = llmApiClient.chatCompletion(validatorMessages, true);
        if (response.isEmpty()) {
            log.warn("[SastVerification] Validation returned empty response for {}", itemRef);
            return new int[]{0, 0};
        }

        return applyValidationResult(response.content(), item, itemRef, context, metadata);
    }

    private String buildValidatorPrompt(List<Map<String, Object>> reactMessages, Item item,
                                        CodeContextExtractor.CodeContext context, SastRuleMetadata metadata) {
        StringBuilder sb = new StringBuilder();

        // Section 1: Finding details
        sb.append("## Finding under review\n");
        sb.append("- Rule: ").append(item.getId()).append(" — ").append(item.getTitle()).append("\n");
        sb.append("- File: ").append(item.getFilename()).append(":").append(item.getLineNumber()).append("\n");
        sb.append("- Flagged code: `").append(item.getCodeExtract()).append("`\n");
        sb.append("- Evidence category: ").append(formatEvidenceCategory(context.category())).append("\n\n");
        sb.append(buildMetadataReviewSection(metadata));
        sb.append(sastCwePromptGuidanceService.buildGuidance(metadata));

        // Section 2: Code context (same snippets the analyzer saw)
        sb.append(buildCodeContextSection(context));

        // Section 3: Investigation evidence (tool call results extracted from messages)
        sb.append("## Investigation evidence (tool calls performed by the analyzer)\n");
        int toolCallCount = 0;
        for (Map<String, Object> msg : reactMessages) {
            String role = (String) msg.get("role");
            String content = (String) msg.get("content");
            if (content == null) continue;

            if ("user".equals(role) && content.startsWith("TOOL RESULT")) {
                toolCallCount++;
                sb.append("### Tool result #").append(toolCallCount).append("\n");
                sb.append("```\n").append(content).append("\n```\n\n");
            } else if ("assistant".equals(role)
                    && (content.contains("\"search_repo\"") || content.contains("\"read_file\""))) {
                sb.append("Analyzer request: ").append(truncateForLog(content, 500)).append("\n\n");
            }
        }
        if (toolCallCount == 0) {
            sb.append("No tool calls were performed.\n\n");
        }

        // Section 4: The verdict to review
        sb.append("## Verdict to review\n");
        sb.append("```json\n");
        sb.append("{\n");
        sb.append("  \"verdict\": \"").append(item.getAiVerdict()).append("\",\n");
        sb.append("  \"confidence\": ").append(String.format(Locale.ROOT, "%.2f", item.getAiConfidence())).append(",\n");
        sb.append("  \"reasoning\": ").append(jsonStringValue(item.getAiReasoning())).append("\n");
        sb.append("}\n");
        sb.append("```\n\n");
        if (item.getAiRecommendation() != null && !item.getAiRecommendation().isBlank()) {
            sb.append("## Proposed remediation (NOT applied code)\n");
            sb.append("The following recommendation/remediation was generated by the analyzer. ");
            sb.append("It is NOT part of the scanned repository and MUST NOT be used as evidence that ");
            sb.append("a sanitizer, escaping, allowlist, or other neutralizer already exists in the code.\n");
            sb.append("```\n").append(item.getAiRecommendation()).append("\n```\n\n");
        }

        // Section 5: Hard evidence constraints (must override validator freedom if present)
        String callerCtxForValidator = context != null && context.callerContext() != null
                ? context.callerContext() : "";
        String crossFileCtx = context != null && context.crossFileCallerContext() != null
                ? context.crossFileCallerContext() : "";
        boolean originTagPresent = callerCtxForValidator.contains("[origin-tag: all-callsites-pass-literal-arg=true]")
                || crossFileCtx.contains("[origin-tag: all-callsites-pass-literal-arg=true]");
        boolean riskyTrustedSqlConcat = hasSqlRiskyTrustedConcatPattern(item, context, "", "", item.getAiReasoning());
        // Call-site literals of the enclosing function/ctor do not prove safety when the sink SQL is
        // built locally from identifiers/fields (e.g. CREATE INDEX " + field).
        boolean localUnneutralizedSql = hasUnneutralizedStringSqlInjectionEvidence(
                item, context, "", "", item.getAiReasoning());
        if (riskyTrustedSqlConcat) {
            sb.append("## HARD EVIDENCE CONSTRAINT\n");
            sb.append("SQL is built by string concatenation/interpolation, but concatenated operands are proven ");
            sb.append("application-safe (literals/constants/literal call sites) with no attacker-controlled source.\n");
            sb.append("This is a RISKY SCHEME: verdict MUST be TRUE_POSITIVE with confidence in [0.50, 0.60] ");
            sb.append("(use ~0.55). Do NOT mark FALSE_POSITIVE or UNCERTAIN — trusted/unclear current origin does ");
            sb.append("not make string-built SQL safe; the pattern can be reused later with user input. ");
            sb.append("Do NOT raise confidence above 0.60 without proving a current untrusted source.\n\n");
        } else if (originTagPresent && !localUnneutralizedSql) {
            sb.append("## HARD EVIDENCE CONSTRAINT\n");
            sb.append("The code context extractor found that **all discovered call sites of the vulnerable function ");
            sb.append("pass string literals or named constants** ");
            sb.append("(origin-tag: all-callsites-pass-literal-arg=true), and the SQL text is not built by ");
            sb.append("concatenating identifiers into dynamic SQL.\n\n");
            sb.append("This is a deterministic structural finding, not an LLM inference.\n");
            sb.append("**You MUST NOT change the verdict to UNCERTAIN or TRUE_POSITIVE on the basis of uncertainty ");
            sb.append("about the argument origin.** If you disagree, you must cite a specific call site that ");
            sb.append("passes an attacker-controlled value. Without such counter-evidence, the verdict MUST remain ");
            sb.append("FALSE_POSITIVE.\n\n");
        } else if (originTagPresent) {
            sb.append("## EVIDENCE NOTE (origin-tag limited)\n");
            sb.append("Call sites of the enclosing function may pass literals, but the shown code builds SQL ");
            sb.append("locally by concatenating/interpolating non-literal identifiers or fields. ");
            sb.append("Do NOT treat origin-tag: all-callsites-pass-literal-arg=true as FALSE_POSITIVE proof here; ");
            sb.append("judge the concatenated operands (instance fields, getters, JSON/config, resource names).\n\n");
        }
        if (hasNaiveSocketConstructorEvidence(item, context)) {
            sb.append("## HARD EVIDENCE CONSTRAINT\n");
            sb.append("This is the `java_lang_socket_init` rule for CWE-319. The shown code uses `new Socket(...)` ");
            sb.append("instead of `SSLSocketFactory.createSocket(...)` or `SSLSocket`.\n\n");
            sb.append("This rule is deterministic and does not require attacker-controlled host/port input. ");
            sb.append("You MUST keep or return TRUE_POSITIVE unless the existing code evidence proves that TLS is ");
            sb.append("enforced by an SSL socket factory, SSLSocket, or an equivalent framework wrapper. ");
            sb.append("Configuration-file origin, local address, library context, or unknown caller origin is not ");
            sb.append("a reason to downgrade this rule to UNCERTAIN.\n\n");
        }
        if (isHttpHeaderInjectionFinding(item, metadata)) {
            sb.append("## HARD EVIDENCE CONSTRAINT\n");
            sb.append("This finding writes request-derived data into an HTTP header/response sink ");
            sb.append("(addHeader/setHeader/Location/Set-Cookie/sendRedirect or equivalent).\n\n");
            sb.append("Regex capture groups (Matcher.group / Pattern), URLDecoder.decode, and path '..' removal ");
            sb.append("are NOT valid neutralizers for XSS, CRLF, or HTTP response splitting. ");
            sb.append("A capture group still returns attacker-controlled text such as ");
            sb.append("`<script>alert(1)</script>` or values containing CR/LF.\n");
            sb.append("Only CR/LF stripping/encoding, strict allowlisting of the exact header value, ");
            sb.append("or a proven trusted/literal header value may justify FALSE_POSITIVE.\n");
            sb.append("Do not claim a different sanitized variable protects the sink unless that exact variable ");
            sb.append("is the one written to the header.\n\n");
        }
        if (hasUnneutralizedStringSqlInjectionEvidence(item, "", item.getAiReasoning())) {
            sb.append("## HARD EVIDENCE CONSTRAINT\n");
            sb.append("This SQL finding shows non-hardcoded/untrusted string input reaching dynamic SQL via ");
            sb.append("concatenation/interpolation (including +, ., f-strings, template literals, sprintf, or "
                    + "language-equivalent formatting) without parameterization or a complete allowlist.\n");
            sb.append("You MUST keep or return TRUE_POSITIVE. Do not downgrade because the value is GUI input, ");
            sb.append("stored in a local variable, or 'looks validated' without a proven SQL-safe neutralizer.\n\n");
        }
        if (isMissingDatabaseAuthenticationFinding(item, metadata)) {
            sb.append("## HARD EVIDENCE CONSTRAINT\n");
            sb.append("Missing database/service authentication is language-agnostic API review, not classic taint.\n");
            sb.append("Trace whether the connect call has an auth channel and whether password/token/user values ");
            sb.append("are proven null/empty. Argument count alone is not proof of authentication. ");
            sb.append("If credentials look present but their values are unknown, prefer UNCERTAIN over FALSE_POSITIVE.\n\n");
        }
        if (CodeInjectionSinkEvidence.isCodeInjectionFinding(item)) {
            sb.append("## HARD EVIDENCE CONSTRAINT\n");
            sb.append("CWE-94/95 code generation/injection: the exploitable fact is the ATTRIBUTE NAME slot or a real ");
            sb.append("eval/exec/compile/script-engine sink — not the assigned VALUE and not VALUE origin.\n");
            sb.append("setattr(obj, 'literal', v), setattr(obj, self.field, v), setattr(obj, cls._meta.x, v), ");
            sb.append("contribute_to_class(cls, name) / descriptor __set__ writing fixed fields, with no eval/exec ");
            sb.append("sink, MUST be FALSE_POSITIVE even when v is HTTP/GraphQL/DB. A sanitizer is not required.\n");
            sb.append("TRUE_POSITIVE only for attacker-controlled NAME (mass assignment: for key in data: setattr) ");
            sb.append("or untrusted data reaching eval/exec/compile/Function/script engine.\n");
            sb.append("Do NOT keep UNCERTAIN because VALUE origin is unknown. Do NOT override FALSE_POSITIVE to ");
            sb.append("UNCERTAIN for missing sanitizer/taint on the VALUE. If the analyzer used VALUE origin as the ");
            sb.append("reason for UNCERTAIN/TRUE_POSITIVE, original_verdict_correct is false — re-judge the NAME slot.\n\n");
        }
        // Section 6: Review instructions
        sb.append("## Your task\n");
        sb.append("Critically review the verdict above. Respond with ONLY a valid JSON object:\n");
        sb.append("```\n");
        sb.append("{\n");
        sb.append("  \"original_verdict_correct\": true/false,\n");
        sb.append("  \"verdict\": \"TRUE_POSITIVE\" | \"FALSE_POSITIVE\" | \"UNCERTAIN\",\n");
        sb.append("  \"confidence\": 0.0-1.0,\n");
        sb.append("  \"explanation\": \"3-6 sentences: cite specific code/tool evidence. ");
        sb.append("If you disagree, explain exactly which evidence or assumption is wrong.\",\n");
        sb.append("  \"remediation_valid\": true | false | null,\n");
        sb.append("  \"corrected_remediation_code\": \"corrected code if remediation was invalid, or null\"\n");
        sb.append("}\n");
        sb.append("```\n");
        sb.append("Rules:\n");
        sb.append("- Do NOT rubber-stamp. Genuinely evaluate each piece of evidence.\n");
        sb.append("- If evidence is fabricated or misinterpreted, override the verdict.\n");
        sb.append("- If a neutralizer/sanitizer was overlooked, change to FALSE_POSITIVE.\n");
        sb.append("- If an untrusted source was missed, change to TRUE_POSITIVE.\n");
        sb.append("- If remediation_code exists in the proposed remediation, verify whether the proposed fix is correct ");
        sb.append("for THIS finding's code (same sink/variables/SQL shape). Mark remediation_valid=false and provide ");
        sb.append("corrected_remediation_code when the proposal is a generic unrelated example ");
        sb.append("(e.g. SELECT username/password, MessageDigest.isEqual(expected, actual) with invented names, ");
        sb.append("or a different-language API) or ignores the flagged sink/variables. ");
        sb.append("For JWT verification bypass, mark remediation_valid=false when the proposal only removes ");
        sb.append("verify_signature=False / options bypass without the language-idiomatic verifying API ");
        sb.append("(key/secret + algorithms + explicit verify-on: Python verify_signature=True, Ruby 3rd-arg true, ");
        sb.append("JS jwt.verify, Java parseClaimsJws, C# RequireSignedTokens=true, etc.). ");
        sb.append("Corrected remediation must rewrite the flagged extract. ");
        sb.append("NEVER treat proposed remediation code as already-applied code or as false-positive evidence.\n");
        sb.append("- Apply the structured evidence and CWE-specific guidance included above; do not duplicate or ignore it.\n");
        sb.append("- FALSE_POSITIVE requires positive safety evidence appropriate to the CWE. ");
        sb.append("If a key fact (source/sink/neutralizer/secret vs non-secret) is genuinely missing, return UNCERTAIN. ");
        sb.append("Do not use UNCERTAIN merely because repository-wide callers were not fully enumerated when local evidence suffices.\n");
        sb.append("- For CWE-208: non-security comparisons are FALSE_POSITIVE; secret comparisons without constant-time are TRUE_POSITIVE.\n");
        sb.append("- For SQL injection: non-hardcoded/untrusted input + clear string concatenation/interpolation ");
        sb.append("into SQL without parameterization/allowlist => TRUE_POSITIVE high confidence. ");
        sb.append("Trusted/literal/constant/known-safe operands + string-built SQL (risky scheme) => TRUE_POSITIVE ");
        sb.append("with confidence 0.50-0.60 (not FALSE_POSITIVE, not UNCERTAIN for unclear origin). ");
        sb.append("Pure literal SQL with no concat, or numeric-only, or parameterized/allowlisted => FALSE_POSITIVE.\n");
        sb.append("- For HTTP header/response-splitting/XSS header sinks: regex groups, URL decode, and '..' path ");
        sb.append("filters are not neutralizers.\n");
        sb.append("- For CWE-94/95 setattr: fixed/internal NAME + no exec sink => FALSE_POSITIVE; ");
        sb.append("attacker-controlled NAME (mass assignment) or eval/exec/compile => TRUE_POSITIVE. ");
        sb.append("Do not use UNCERTAIN because the assigned VALUE origin is unclear.\n");
        sb.append("- For missing authentication: trace credential values; do not infer auth from argument count alone.\n");
        sb.append("- Do not treat config/query loaders (getSqlString/getQuery/etc.) as trusted without tracing their SQL origin.\n");
        sb.append("- Return ONLY valid JSON, no markdown fences, no prose.\n");

        return sb.toString();
    }

    private String buildMetadataReviewSection(SastRuleMetadata metadata) {
        if (metadata == null) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        sb.append("## Structured rule metadata\n");
        sb.append("- Family: ").append(metadata.family()).append('\n');
        sb.append("- Prompt profile: ").append(metadata.promptProfile()).append('\n');
        sb.append("- Policy profile: ").append(metadata.policyProfile()).append('\n');
        sb.append("- Requires taint: ").append(metadata.requiresTaint()).append('\n');
        sb.append("- Requires execution context: ").append(metadata.requiresExecutionContext()).append('\n');
        sb.append("- Requires data sensitivity: ").append(metadata.requiresDataSensitivity()).append("\n\n");
        if (isMisconfigurationProfile(metadata)) {
            sb.append("MISCONFIGURATION review rule: this is not a classic source-to-sink taint finding. ");
            sb.append("Do not downgrade solely because attacker-controlled input is unclear. ");
            sb.append("Do not accept FALSE_POSITIVE based on test/dev/demo/mock/example naming, localhost, or path hints. ");
            sb.append("Focus on whether the unsafe API/configuration is shown and whether existing code proves ");
            sb.append("a real safety neutralizer (safe wrapper, TLS/SSL enforcement, framework guarantee, or ");
            sb.append("another rule-specific neutralizer). Without that neutralizer, verdict must be TRUE_POSITIVE.\n\n");
        }
        return sb.toString();
    }

    private String jsonStringValue(String value) {
        if (value == null || value.isBlank()) return "null";
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception e) {
            return "\"" + value.replace("\"", "\\\"").replace("\n", "\\n") + "\"";
        }
    }

    private int[] applyValidationResult(String rawResponse, Item item, String itemRef,
                                        CodeContextExtractor.CodeContext context, SastRuleMetadata metadata) {
        int overrides = 0;
        int remediationFixes = 0;

        JsonNode node = tryParseJson(rawResponse);
        if (node == null) {
            log.warn("[SastVerification] Validation response is not valid JSON for {}", itemRef);
            return new int[]{0, 0};
        }

        boolean originalCorrect = node.path("original_verdict_correct").asBoolean(true);
        String validatorVerdict = textValue(node, "verdict");
        double validatorConfidence = node.path("confidence").asDouble(-1);
        String explanation = textValue(node, "explanation");

        if (!originalCorrect && isValidVerdict(validatorVerdict) && validatorConfidence >= 0) {
            String previousVerdict = item.getAiVerdict();
            double previousConfidence = item.getAiConfidence();
            ValidatorVerdict normalizedValidatorVerdict = normalizeValidatorFalsePositive(
                    item, context, metadata, validatorVerdict, validatorConfidence, explanation, itemRef);
            validatorVerdict = normalizedValidatorVerdict.verdict();
            validatorConfidence = normalizedValidatorVerdict.confidence();
            explanation = normalizedValidatorVerdict.explanation();
            if (!"FALSE_POSITIVE".equals(validatorVerdict)
                    && hasNumericSqlParameterEvidence(item, context, explanation, item.getAiReasoning())) {
                log.warn("[SastVerification] Validator marked {} for {} despite numeric SQL parameter evidence; "
                                + "normalizing to FALSE_POSITIVE",
                        validatorVerdict, itemRef);
                validatorVerdict = "FALSE_POSITIVE";
                validatorConfidence = Math.max(validatorConfidence, 0.85d);
                explanation = appendNormalizationReason(explanation,
                        "SQL injection requires attacker-controlled SQL syntax. The query parameter is proven "
                                + "numeric/parsed as a number, so it cannot inject SQL text through that parameter.");
            }
            if (!"FALSE_POSITIVE".equals(validatorVerdict)
                    && isRegexDosFinding(item, metadata)
                    && hasRegexEscapeSafetyEvidence(item, explanation, item.getAiReasoning())) {
                log.warn("[SastVerification] Validator marked {} for {} despite regex neutralization evidence; "
                                + "normalizing to FALSE_POSITIVE",
                        validatorVerdict, itemRef);
                validatorVerdict = "FALSE_POSITIVE";
                validatorConfidence = Math.max(validatorConfidence, 0.85d);
                explanation = appendNormalizationReason(explanation,
                        "Dynamic-regex / ReDoS findings are FALSE_POSITIVE when the sink metacharacter-escapes / "
                                + "literally quotes input, or only rebuilds an existing RegExp via .source.");
            }
            if (!"FALSE_POSITIVE".equals(validatorVerdict)
                    && isOpenRedirectFinding(item, metadata)
                    && hasOpenRedirectSafetyEvidence(item, explanation, item.getAiReasoning())) {
                log.warn("[SastVerification] Validator marked {} for {} despite same-origin/relative redirect evidence; "
                                + "normalizing to FALSE_POSITIVE",
                        validatorVerdict, itemRef);
                validatorVerdict = "FALSE_POSITIVE";
                validatorConfidence = Math.max(validatorConfidence, 0.85d);
                explanation = appendNormalizationReason(explanation,
                        "Open redirect is FALSE_POSITIVE when the redirect target is built from the current page URL "
                                + "with only search/query-parameter mutation (host unchanged), or is a relative-only literal.");
            }
            if (!"FALSE_POSITIVE".equals(validatorVerdict)
                    && isPathTraversalFinding(item, metadata)
                    && hasMultipartTempPathEvidence(item, context, explanation, item.getAiReasoning())) {
                log.warn("[SastVerification] Validator marked {} for {} despite multipart parser temp-path evidence; "
                                + "normalizing to FALSE_POSITIVE",
                        validatorVerdict, itemRef);
                validatorVerdict = "FALSE_POSITIVE";
                validatorConfidence = Math.max(validatorConfidence, 0.90d);
                explanation = appendNormalizationReason(explanation,
                        "Path traversal is FALSE_POSITIVE when the filesystem sink reads the multipart parser "
                                + "temp-path field (file.filepath / tmp_name / temporary_file_path), not the client filename.");
            }
            if (!"FALSE_POSITIVE".equals(validatorVerdict)
                    && isInsufficientRandomFinding(item, metadata)
                    && hasNonSecurityRandomUseEvidence(item, explanation, item.getAiReasoning())) {
                log.warn("[SastVerification] Validator marked {} for {} despite non-security PRNG use evidence; "
                                + "normalizing to FALSE_POSITIVE",
                        validatorVerdict, itemRef);
                validatorVerdict = "FALSE_POSITIVE";
                validatorConfidence = Math.max(validatorConfidence, 0.85d);
                explanation = appendNormalizationReason(explanation,
                        "Weak PRNG used for non-security purposes (sleep/jitter/scheduling/sampling/test data) "
                                + "is FALSE_POSITIVE; CWE-330/338 requires security-sensitive randomness.");
            }
            // Coherence guard: if all call sites pass literal/constant SQL args, the validator
            // MUST NOT downgrade to UNCERTAIN or TRUE_POSITIVE. Only override if the validator
            // cites a specific attacker-controlled call site — which it cannot, because none exists.
            String callerCtxForGuard = context != null && context.callerContext() != null
                    ? context.callerContext() : "";
            String crossFileCtxForGuard = context != null && context.crossFileCallerContext() != null
                    ? context.crossFileCallerContext() : "";
            boolean allCallsitesLiteralGuard = callerCtxForGuard.contains("[origin-tag: all-callsites-pass-literal-arg=true]")
                    || crossFileCtxForGuard.contains("[origin-tag: all-callsites-pass-literal-arg=true]");
            boolean riskyTrustedSqlForGuard = hasSqlRiskyTrustedConcatPattern(
                    item, context, "", explanation, item.getAiReasoning());
            // Origin-tag only proves caller args of the enclosing function are literals. It must not
            // override local SQL built by concatenating non-literal identifiers/fields (DDL etc.).
            boolean unneutralizedSqlForLiteralGuard = hasUnneutralizedStringSqlInjectionEvidence(
                    item, context, "", explanation, item.getAiReasoning());
            boolean preserveRiskyTrustedSql = shouldPreserveSqlRiskyTrustedConcatVerdict(
                    previousVerdict, previousConfidence, validatorVerdict, item, context, explanation);
            if (riskyTrustedSqlForGuard || preserveRiskyTrustedSql) {
                if (!"TRUE_POSITIVE".equals(validatorVerdict)
                        || validatorConfidence < 0.50d || validatorConfidence > 0.60d) {
                    log.warn("[SastVerification] Validator marked {} for {} on trusted-source SQL concat; "
                                    + "coherence guard normalizing to TRUE_POSITIVE @ {}",
                            validatorVerdict, itemRef, SQL_RISKY_TRUSTED_CONCAT_CONFIDENCE);
                    validatorVerdict = "TRUE_POSITIVE";
                    validatorConfidence = SQL_RISKY_TRUSTED_CONCAT_CONFIDENCE;
                    explanation = appendNormalizationReason(explanation,
                            "RISKY SCHEME: SQL is concatenated/interpolated from proven application-safe "
                                    + "literals/constants. Mark TRUE_POSITIVE with mid confidence (~0.55), not "
                                    + "FALSE_POSITIVE/UNCERTAIN — the helper can later be reused with user input.");
                }
            } else if (allCallsitesLiteralGuard && !unneutralizedSqlForLiteralGuard
                    && !"FALSE_POSITIVE".equals(validatorVerdict)) {
                log.warn("[SastVerification] Validator marked {} for {} despite all-callsites-literal origin-tag; "
                                + "coherence guard normalizing to FALSE_POSITIVE",
                        validatorVerdict, itemRef);
                validatorVerdict = "FALSE_POSITIVE";
                validatorConfidence = Math.max(validatorConfidence, 0.88d);
                explanation = appendNormalizationReason(explanation,
                        "All discovered call sites pass string literals or named constants "
                                + "(origin-tag: all-callsites-pass-literal-arg=true). "
                                + "No attacker-controlled call site was found; the validator cannot override "
                                + "this structural finding without citing a concrete counter-example.");
            }
            if (!riskyTrustedSqlForGuard && !preserveRiskyTrustedSql
                    && !"TRUE_POSITIVE".equals(validatorVerdict)
                    && hasUnneutralizedStringSqlInjectionEvidence(
                            item, context, "", explanation, item.getAiReasoning())) {
                log.warn("[SastVerification] Validator marked {} for {} despite unneutralized String SQL injection evidence; "
                                + "normalizing to TRUE_POSITIVE",
                        validatorVerdict, itemRef);
                validatorVerdict = "TRUE_POSITIVE";
                validatorConfidence = Math.max(validatorConfidence, 0.90d);
                explanation = appendNormalizationReason(explanation,
                        "Non-hardcoded/untrusted string input concatenated or interpolated into dynamic SQL without "
                                + "parameterization, numeric typing, or a complete allowlist is TRUE_POSITIVE.");
            }
            if (!"TRUE_POSITIVE".equals(validatorVerdict)
                    && isHttpHeaderInjectionFinding(item, metadata)
                    && citesWeakHeaderNeutralizerOnly(explanation, item.getAiReasoning())) {
                log.warn("[SastVerification] Validator marked {} for {} using weak header neutralizer evidence; "
                                + "normalizing to TRUE_POSITIVE",
                        validatorVerdict, itemRef);
                validatorVerdict = "TRUE_POSITIVE";
                validatorConfidence = Math.max(validatorConfidence, 0.90d);
                explanation = appendNormalizationReason(explanation,
                        "Regex capture groups, URL decoding, and path '..' filtering do not neutralize HTTP header "
                                + "injection / response splitting / XSS into headers. Keep TRUE_POSITIVE.");
            }
            if (!"TRUE_POSITIVE".equals(validatorVerdict)
                    && hasProvenEmptyDatabaseCredentialsEvidence(item, context, explanation, item.getAiReasoning())) {
                log.warn("[SastVerification] Validator marked {} for {} despite proven empty DB credentials; "
                                + "normalizing to TRUE_POSITIVE",
                        validatorVerdict, itemRef);
                validatorVerdict = "TRUE_POSITIVE";
                validatorConfidence = Math.max(validatorConfidence, 0.90d);
                explanation = appendNormalizationReason(explanation,
                        "Database/service credentials are proven null/empty in the shown code, so missing "
                                + "authentication remains TRUE_POSITIVE.");
            }
            if (!"TRUE_POSITIVE".equals(validatorVerdict)
                    && hasWeakHashPasswordEvidence(item, explanation, item.getAiReasoning())) {
                log.warn("[SastVerification] Validator marked {} for {} despite weak password hash evidence; "
                                + "normalizing to TRUE_POSITIVE",
                        validatorVerdict, itemRef);
                validatorVerdict = "TRUE_POSITIVE";
                validatorConfidence = Math.max(validatorConfidence, 0.90d);
                explanation = appendNormalizationReason(explanation,
                        "MD5/SHA-1 used for password hashing, password storage, or password comparison is "
                                + "security-sensitive weak hashing and remains exploitable.");
            }
            if (!"TRUE_POSITIVE".equals(validatorVerdict)
                    && hasMisconfigurationTruePositiveEvidence(item, context, metadata)) {
                log.warn("[SastVerification] Validator marked {} for {} despite MISCONFIGURATION API/config evidence; "
                                + "normalizing to TRUE_POSITIVE",
                        validatorVerdict, itemRef);
                validatorVerdict = "TRUE_POSITIVE";
                validatorConfidence = Math.max(validatorConfidence, 0.90d);
                explanation = appendNormalizationReason(explanation,
                        misconfigurationTruePositiveReason(item, metadata));
            }
            if (("FALSE_POSITIVE".equals(validatorVerdict) || "UNCERTAIN".equals(validatorVerdict))
                    && isMisconfigurationProfile(metadata)
                    && (isTestNamingOnlyMisconfigurationFalsePositive("", explanation)
                        || !citesRealMisconfigurationNeutralizer("", explanation))) {
                log.warn("[SastVerification] Validator downgraded MISCONFIGURATION for {} without a proven neutralizer; "
                                + "normalizing to TRUE_POSITIVE",
                        itemRef);
                validatorVerdict = "TRUE_POSITIVE";
                validatorConfidence = Math.max(validatorConfidence, 0.90d);
                explanation = appendNormalizationReason(explanation,
                        "MISCONFIGURATION findings must not be downgraded based on test/dev/demo/mock naming, path hints, "
                                + "missing taint, or unclear sensitivity. Without a proven safety neutralizer in existing code, "
                                + "the verdict is TRUE_POSITIVE.");
            }
            if (!"FALSE_POSITIVE".equals(validatorVerdict)
                    && hasLocalOnlyNonSensitiveLeakEvidence(item, explanation, item.getAiReasoning())) {
                log.warn("[SastVerification] Validator marked {} for {} despite local-only non-sensitive leak evidence; "
                                + "normalizing to FALSE_POSITIVE",
                        validatorVerdict, itemRef);
                validatorVerdict = "FALSE_POSITIVE";
                validatorConfidence = Math.max(validatorConfidence, 0.85d);
                explanation = appendNormalizationReason(explanation,
                        "Information leakage requires sensitive content and an exposure path to an untrusted audience. "
                                + "Local-only console output in a desktop/CLI context without concrete secrets is not exploitable.");
            }

            item.setAiVerdict(validatorVerdict);
            item.setAiConfidence(Math.max(0.0, Math.min(1.0, validatorConfidence)));
            if (!explanation.isBlank()) {
                item.setAiReasoning(explanation);
            }

            // If verdict changed from TP to FP, clear recommendation; if FP to TP, note no remediation
            if ("FALSE_POSITIVE".equals(validatorVerdict) || "UNCERTAIN".equals(validatorVerdict)) {
                item.setAiRecommendation(null);
            } else if ("TRUE_POSITIVE".equals(validatorVerdict)
                    && (item.getAiRecommendation() == null || item.getAiRecommendation().isBlank())) {
                item.setAiRecommendation(defaultTruePositiveRecommendation(item, explanation));
            }

            overrides = 1;
            log.info("[SastVerification] Validation OVERRODE verdict for {}: {} ({}) -> {} ({}) | {}",
                    itemRef, previousVerdict,
                    String.format(Locale.ROOT, "%.2f", previousConfidence),
                    validatorVerdict,
                    String.format(Locale.ROOT, "%.2f", validatorConfidence),
                    truncateForLog(explanation, 300));

            if (item.getFingerprint() != null) {
                fingerprintCache.put(item.getFingerprint(),
                        new CachedVerdict(validatorVerdict, validatorConfidence,
                                explanation.isBlank() ? item.getAiReasoning() : explanation,
                                item.getAiRecommendation()));
            }
        } else {
            log.info("[SastVerification] Validation CONFIRMED verdict for {}: {} ({})",
                    itemRef, item.getAiVerdict(),
                    String.format(Locale.ROOT, "%.2f", item.getAiConfidence()));
        }

        if ("TRUE_POSITIVE".equals(item.getAiVerdict())
                && (item.getAiRecommendation() == null || item.getAiRecommendation().isBlank())) {
            item.setAiRecommendation(defaultTruePositiveRecommendation(item, item.getAiReasoning()));
        }

        // Check remediation correction
        String correctedRemediation = textValue(node, "corrected_remediation_code");
        boolean remediationValid = node.path("remediation_valid").asBoolean(true);
        if (!remediationValid && !correctedRemediation.isBlank() && "TRUE_POSITIVE".equals(item.getAiVerdict())) {
            String currentRec = item.getAiRecommendation();
            if (currentRec != null && !currentRec.isBlank()) {
                item.setAiRecommendation(currentRec + "\n\n### Corrected remediation code\n```\n"
                        + correctedRemediation + "\n```");
                remediationFixes = 1;
                log.info("[SastVerification] Validation corrected remediation for {}", itemRef);
            }
        }

        return new int[]{overrides, remediationFixes};
    }

    // ── End of Verdict Validation ───────────────────────────────────────────────

    private String defaultTruePositiveRecommendation(Item item, String explanation) {
        return formatRecommendation(
                defaultTruePositiveRecommendationText(item, explanation),
                defaultTruePositiveRemediationCode(item, explanation));
    }

    private String defaultTruePositiveRecommendationText(Item item, String explanation) {
        if (isNaiveSocketSslFinding(item)) {
            return naiveSocketRecommendation();
        }
        if (hasWeakHashPasswordEvidence(item, "", explanation)) {
            return "Replace MD5/SHA-1 password hashing with BCrypt, Argon2, or PBKDF2 using a per-user salt "
                    + "and an appropriate work factor.";
        }
        if (isJwtVerificationBypassFinding(item, null)) {
            return jwtVerificationRecommendation(item);
        }
        if (isSqlInjectionFinding(item)) {
            return sqlInjectionRecommendation(item);
        }
        return "Review and remediate this finding; the validator confirmed it as exploitable.";
    }

    private String defaultTruePositiveRemediationCode(Item item, String explanation) {
        if (isNaiveSocketSslFinding(item)) {
            return naiveSocketRemediationCode(item);
        }
        if (hasWeakHashPasswordEvidence(item, "", explanation)) {
            return wrapWithFlaggedExtract(item,
                    "Use a password hashing function such as BCrypt, Argon2, or PBKDF2WithHmacSHA256 "
                            + "with a unique per-user salt and configurable work factor; do not use MessageDigest "
                            + "MD5/SHA-1 for passwords.");
        }
        if (isSqlInjectionFinding(item)) {
            return sqlInjectionRemediationCode(item);
        }
        if (isDeserializationFamily(null, item)) {
            return deserializationRemediationCode(item);
        }
        if (isTimingSideChannelFinding(item, null)) {
            return timingRemediationCode(item);
        }
        if (isJwtVerificationBypassFinding(item, null)) {
            return jwtVerificationRemediationCode(item);
        }
        String extract = flaggedCodeExtract(item);
        if (!extract.isBlank()) {
            return wrapWithFlaggedExtract(item,
                    "Cannot provide a precise rewrite automatically; adapt a safe API to the flagged call site above "
                            + "(same variables/sink).");
        }
        return "Cannot provide a safe code snippet: The validator confirmed exploitability but did not provide "
                + "enough code context to generate a precise remediation.";
    }

    private JsonNode tryParseJson(String content) {
        try {
            return objectMapper.readTree(extractJson(content));
        } catch (Exception e) {
            return null;
        }
    }

    private String formatItemRef(Item item) {
        return String.format("item '%s' [%s:%s, rule=%s]",
                item.getTitle(),
                item.getFilename(),
                item.getLineNumber(),
                item.getId());
    }

    private String buildFindingSection(Item item, String language) {
        StringBuilder sb = new StringBuilder();
        sb.append("## Finding\n");
        sb.append("- Rule: ").append(item.getId()).append(" - ").append(item.getTitle()).append("\n");
        if (item.getCweIds() != null && !item.getCweIds().isEmpty()) {
            sb.append("- CWE: CWE-").append(String.join(", CWE-", item.getCweIds())).append("\n");
        }
        sb.append("- File: ").append(item.getFilename()).append(":").append(item.getLineNumber()).append("\n");
        sb.append("- Flagged code: `").append(item.getCodeExtract()).append("`\n\n");
        return sb.toString();
    }

    private String buildDescriptionSection(Item item) {
        if (item.getDescription() == null || item.getDescription().isBlank()) {
            return "";
        }
        String raw = item.getDescription();
        int remediationsIdx = raw.indexOf("## Remediations");
        int referencesIdx = raw.indexOf("## References");

        int descriptionEnd = raw.length();
        if (remediationsIdx > 0) {
            descriptionEnd = remediationsIdx;
        } else if (referencesIdx > 0) {
            descriptionEnd = referencesIdx;
        }
        String description = raw.substring(0, descriptionEnd).trim();
        if (description.startsWith("## Description")) {
            description = description.substring("## Description".length()).trim();
        }

        String remediation = "";
        if (remediationsIdx >= 0) {
            int remediationStart = remediationsIdx + "## Remediations".length();
            int remediationEnd = (referencesIdx > remediationsIdx) ? referencesIdx : raw.length();
            remediation = raw.substring(remediationStart, remediationEnd).trim();
        }

        StringBuilder sb = new StringBuilder();
        if (!description.isBlank()) {
            sb.append("## Vulnerability description (summary)\n").append(description).append("\n\n");
        }
        if (!remediation.isBlank()) {
            sb.append("## Scanner-suggested remediation (reference only)\n");
            sb.append("The static analyzer proposed the following remediation guidance. ");
            sb.append("Use it only as a reference to inform your own fix — do not copy it verbatim.\n");
            sb.append("IMPORTANT: this text may contain generic PLACEHOLDER identifiers (e.g. `user.Input`, ");
            sb.append("`user_input`, `dynamic_input`, `unsafe`). They are illustrative only — they do NOT exist in ");
            sb.append("this codebase. Never search the repository for them and never put them in your remediation_code; ");
            sb.append("use the real variable/function names from the shown code instead.\n");
            sb.append(remediation).append("\n\n");
        }
        return sb.toString();
    }

    private String buildCodeInjectionNameSlotSection(Item item) {
        if (!CodeInjectionSinkEvidence.isCodeInjectionFinding(item)) {
            return "";
        }
        return """
                ## CWE-94/95 decision rule (overrides generic taint instructions)
                Bearer often labels setattr / __set__ / contribute_to_class as "code generation". That is not eval/exec.
                Decide by the ATTRIBUTE NAME argument (2nd arg of setattr), never by the assigned VALUE.
                - FALSE_POSITIVE: NAME is a string literal (`"refresh_token"`, `'email'`), a constant, `self.field`, \
                `cls._meta.return_field_name`, a local field-name holder, or the `name` passed into Django/ORM \
                `contribute_to_class`. No eval/exec/compile/script-engine in the shown method. VALUE may be HTTP/GraphQL/DB.
                - TRUE_POSITIVE: NAME comes from attacker-controlled keys (`for key, value in data.items(): setattr(obj, key, value)`, \
                `setattr(obj, request.POST['f'], v)`) OR untrusted data reaches eval/exec/compile/Function.
                - UNCERTAIN only if you cannot tell whether NAME is attacker-controlled after reading the local method. \
                Unclear VALUE origin is not UNCERTAIN and is not TRUE_POSITIVE.
                Do not require a sanitizer for FALSE_POSITIVE on this rule.

                """;
    }

    private String buildLocalTriageSection(Item item) {
        FindingContext findingContext = classifyFindingContext(item);
        StringBuilder sb = new StringBuilder();
        sb.append("## Local triage context\n");
        sb.append("- Rule category: ").append(findingContext.ruleCategory()).append("\n");
        if (findingContext.nonProductionPath()) {
            sb.append("- Path hint: non-production or documentation-like path indicator (")
                    .append(findingContext.pathEvidence())
                    .append("). Use this only as a reachability hint, not as false-positive proof. A FALSE_POSITIVE verdict still needs code-based evidence.\n\n");
        } else {
            sb.append("- Path hint: no obvious documentation, tutorial, example, or test path indicator detected.\n\n");
        }
        return sb.toString();
    }

    private FindingContext classifyFindingContext(Item item) {
        String filename = Optional.ofNullable(item.getFilename())
                .orElse(Optional.ofNullable(item.getFullFilename()).orElse(""));
        String normalizedPath = filename.replace('\\', '/').toLowerCase(Locale.ROOT);
        String pathEvidence = detectNonProductionPathEvidence(normalizedPath);
        return new FindingContext(
                pathEvidence != null,
                pathEvidence == null ? "" : pathEvidence,
                detectRuleCategory(item)
        );
    }

    private String detectNonProductionPathEvidence(String normalizedPath) {
        if (normalizedPath == null || normalizedPath.isBlank()) {
            return null;
        }
        if (normalizedPath.startsWith("docs/") || normalizedPath.contains("/docs/")) {
            return "docs";
        }
        if (normalizedPath.startsWith("docs_src/") || normalizedPath.contains("/docs_src/")) {
            return "docs_src";
        }
        if (normalizedPath.startsWith("examples/") || normalizedPath.contains("/examples/")) {
            return "examples";
        }
        if (normalizedPath.startsWith("test/") || normalizedPath.startsWith("tests/")
                || normalizedPath.contains("/test/") || normalizedPath.contains("/tests/")) {
            return "tests";
        }
        if (normalizedPath.startsWith("spec/") || normalizedPath.contains("/spec/")) {
            return "spec";
        }
        if (normalizedPath.contains("tutorial")) {
            return "tutorial";
        }
        return null;
    }

    private String detectRuleCategory(Item item) {
        String ruleId = Optional.ofNullable(item.getId()).orElse("").toLowerCase(Locale.ROOT);
        String title = Optional.ofNullable(item.getTitle()).orElse("").toLowerCase(Locale.ROOT);
        String combined = ruleId + " " + title;
        if (combined.contains("insufficient") && combined.contains("random")) {
            return "INSUFFICIENT_RANDOM";
        }
        if (combined.contains("logger") || combined.contains("log message")) {
            return "LOGGER_LEAK";
        }
        if (combined.contains("observable timing") || combined.contains("timing discrepancy")
                || combined.contains("observable_timing")) {
            return "TIMING_SIDE_CHANNEL";
        }
        if (combined.contains("exception")) {
            return "EXCEPTION_LEAK";
        }
        if (combined.contains("command") || combined.contains("subprocess") || combined.contains("os_command")) {
            return "COMMAND_INJECTION";
        }
        if (combined.contains("code generation") || combined.contains("code injection")
                || combined.contains("eval injection") || combined.contains("script injection")) {
            return "CODE_INJECTION";
        }
        if (combined.contains("xss") || combined.contains("cross-site") || combined.contains("innerhtml")
                || combined.contains("html injection") || combined.contains("unsafe html")) {
            return "XSS";
        }
        if (combined.contains("mark_safe") || combined.contains("safe html")
                || combined.contains("unescaped html") || combined.contains("html escape")) {
            return "SAFE_HTML";
        }
        if (combined.contains("redirect")) {
            return "OPEN_REDIRECT";
        }
        if (combined.contains("path traversal") || combined.contains("directory traversal")
                || combined.contains("file path") || combined.contains("filename")) {
            return "PATH_TRAVERSAL";
        }
        if (combined.contains("weak hash") || combined.contains("weak hashing")
                || combined.contains("md5") || combined.contains("sha-1") || combined.contains("sha1")) {
            return "WEAK_HASH";
        }
        if (combined.contains("enumeration") || combined.contains("user_enumeration")
                || (combined.contains("auth") && (combined.contains("error") || combined.contains("message") || combined.contains("response")))
                || combined.contains("login") || combined.contains("credential")
                || combined.contains("password_disclosure") || combined.contains("account_enumeration")) {
            return "AUTH_ENUMERATION";
        }
        return "GENERAL";
    }

    private String buildCodeContextSection(CodeContextExtractor.CodeContext context) {
        StringBuilder sb = new StringBuilder();
        sb.append("## Code context\n");
        sb.append("Language: ").append(context.language()).append("\n");
        sb.append("Evidence category: ").append(formatEvidenceCategory(context.category())).append("\n\n");

        if (!context.fileImports().isBlank()) {
            sb.append("Imports:\n```\n").append(context.fileImports()).append("\n```\n\n");
        }

        if (!context.fileHeader().isBlank()) {
            sb.append("File header (first lines — use to identify framework, class hierarchy, and module type):\n```\n")
                    .append(context.fileHeader()).append("\n```\n\n");
        }

        if (!context.functionBody().isBlank()) {
            sb.append("Function containing the finding:\n```\n").append(context.functionBody()).append("\n```\n\n");
        }

        if (!context.localSnippet().isBlank() && !isSubstantiallyContained(context.localSnippet(), context.functionBody())) {
            sb.append("Local file context around the finding:\n```\n").append(context.localSnippet()).append("\n```\n\n");
        }

        if (!context.definitionContext().isBlank()) {
            sb.append("Definitions/assignments of identifiers used at the finding ")
                    .append("(same file; use these to trace where the flagged value originates):\n```\n")
                    .append(context.definitionContext()).append("\n```\n\n");
        }

        if (!context.frameworkContext().isBlank()) {
            sb.append("Framework/source and neutralizer hints ")
                    .append("(not a verdict; use these conventions while tracing source-to-sink evidence):\n```\n")
                    .append(context.frameworkContext()).append("\n```\n\n");
        }

        // Caller sections: only included for AMBIGUOUS and DEAD_END (they are empty for proven cases)
        if (!context.callerContext().isBlank()) {
            sb.append("Call sites of the enclosing function (same file; use these to determine what data ")
                    .append("reaches the function's parameters and whether it is attacker-controlled):\n```\n")
                    .append(context.callerContext()).append("\n```\n\n");
        }

        if (!context.crossFileCallerContext().isBlank()) {
            sb.append("External call sites of the enclosing function — ranked: [imports module] first, ")
                    .append("[same package] second, untagged last. Use these to resolve parameter origins ")
                    .append("before answering UNCERTAIN:\n```\n")
                    .append(context.crossFileCallerContext()).append("\n```\n\n");
        }

        if (!context.templateContext().isBlank()) {
            sb.append("Resolved template/view for this render-to-safe-sink pattern ")
                    .append("(check how user-controlled values are escaped or filtered here):\n```\n")
                    .append(context.templateContext()).append("\n```\n\n");
        }

        return sb.toString();
    }

    private String formatEvidenceCategory(CodeContextExtractor.EvidenceCategory category) {
        if (category == null) return "AMBIGUOUS";
        return switch (category) {
            case PROVEN_SOURCE_UNTRUSTED ->
                "PROVEN_SOURCE_UNTRUSTED — HTTP/form/file source is directly visible; focus on whether a neutralizer is present";
            case PROVEN_SOURCE_TRUSTED ->
                "PROVEN_SOURCE_TRUSTED — value appears to come from a constant, setting, or operator-controlled source; verify before marking FALSE_POSITIVE";
            case PROVEN_SOURCE_DOM ->
                "PROVEN_SOURCE_DOM — value originates from DOM content (querySelector, textContent, dataset, Stimulus target); classify input_source as dom_content";
            case NEUTRALIZED ->
                "NEUTRALIZED — a sanitizer/neutralizer was detected near the sink; verify it is complete for this vulnerability class";
            case AMBIGUOUS ->
                "AMBIGUOUS — source is partially visible but origin is unclear; check definitions and callers above";
            case DEAD_END ->
                "DEAD_END — flagged value originates from a function parameter with no clear local evidence; cross-file callers and ReAct investigation are needed";
        };
    }

    private String buildReactSuggestionsSection(CodeContextExtractor.CodeContext context) {
        if (context.reactSuggestions() == null || context.reactSuggestions().isEmpty()) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        sb.append("## Pre-suggested investigation actions\n");
        sb.append("The following targeted searches are recommended to resolve the origin of the flagged value. ");
        sb.append("Use them as your first ReAct actions before exploring freely:\n");
        for (String suggestion : context.reactSuggestions()) {
            sb.append("- ").append(suggestion).append("\n");
        }
        sb.append("\n");
        return sb.toString();
    }

    /**
     * Returns true when {@code snippet} is already substantially covered by {@code container},
     * so sending both would be redundant. Uses a line-overlap ratio: if ≥70 % of snippet lines
     * already appear in container, the snippet is considered redundant.
     */
    private boolean isSubstantiallyContained(String snippet, String container) {
        if (snippet == null || snippet.isBlank()) return true;
        if (container == null || container.isBlank()) return false;
        if (snippet.equals(container)) return true;

        String[] snippetLines = snippet.split("\n");
        if (snippetLines.length == 0) return true;

        Set<String> containerLines = new HashSet<>(Arrays.asList(container.split("\n")));
        int matched = 0;
        for (String line : snippetLines) {
            if (containerLines.contains(line)) {
                matched++;
            }
        }
        return (double) matched / snippetLines.length >= 0.70;
    }

    private String buildRelatedFilesSection(CodeContextExtractor.CodeContext context) {
        StringBuilder sb = new StringBuilder();
        sb.append("## Related files in data flow\n");
        sb.append("These files are part of the data flow chain for this finding:\n\n");
        for (CodeContextExtractor.RelatedSnippet related : context.relatedFiles()) {
            sb.append("### ").append(related.filename()).append("\n");
            sb.append("```\n").append(related.snippet()).append("\n```\n\n");
        }
        return sb.toString();
    }

    private String buildInstructionsSection(boolean includeDataflow,
                                             CodeContextExtractor.EvidenceCategory category,
                                             Item item) {
        StringBuilder sb = new StringBuilder();
        sb.append("## Instructions\n");
        sb.append("Work through the following steps in order. Your JSON response must reflect this reasoning.\n\n");

        sb.append("### Repository investigation (you can look beyond the snippets above)\n");

        boolean codeInjection = CodeInjectionSinkEvidence.isCodeInjectionFinding(item);
        if (codeInjection) {
            sb.append("This is CWE-94/95 code generation/injection. Investigate the ATTRIBUTE NAME slot of ");
            sb.append("setattr / __set__ / contribute_to_class / Object.defineProperty (is it a literal, ");
            sb.append("self.field, class-body field id, or request/data key?). Do NOT spend the tool budget ");
            sb.append("tracing the assigned VALUE origin. Also search the enclosing method for eval/exec/compile.\n\n");
        } else if (category == CodeContextExtractor.EvidenceCategory.PROVEN_SOURCE_UNTRUSTED) {
            sb.append("Evidence category is PROVEN_SOURCE_UNTRUSTED: an untrusted HTTP/form/file source is ");
            sb.append("already visible in the code above. Your primary task is to verify whether a complete ");
            sb.append("neutralizer/sanitizer exists between that source and the sink. Use search_repo/read_file ");
            sb.append("to check for guards, validators, or escape functions that may not be visible in the snippets.\n\n");
        } else if (category == CodeContextExtractor.EvidenceCategory.PROVEN_SOURCE_TRUSTED) {
            sb.append("Evidence category is PROVEN_SOURCE_TRUSTED: the value appears to come from a constant, ");
            sb.append("setting, or operator-controlled source. Verify this before marking FALSE_POSITIVE — ");
            sb.append("confirm the source cannot be influenced by an attacker (e.g. check whether admin UI, ");
            sb.append("form fields, or database writes can change the value).\n\n");
        } else if (category == CodeContextExtractor.EvidenceCategory.PROVEN_SOURCE_DOM) {
            sb.append("Evidence category is PROVEN_SOURCE_DOM: the flagged value originates from DOM content ");
            sb.append("(e.g. querySelector, textContent, dataset, Stimulus target). ");
            sb.append("Classify input_source as `dom_content`. For logger_leak in web_client, ");
            sb.append("client-side console logging of DOM content is visible only in the user's ");
            sb.append("own browser dev tools, not stored server-side — prefer FALSE_POSITIVE.\n\n");
        } else if (category == CodeContextExtractor.EvidenceCategory.NEUTRALIZED) {
            sb.append("Evidence category is NEUTRALIZED: a sanitizer/neutralizer was detected near the sink. ");
            sb.append("Verify that the protection is complete for this vulnerability class and covers ALL ");
            sb.append("attacker-controlled paths, not just one branch.\n\n");
        } else if (category == CodeContextExtractor.EvidenceCategory.DEAD_END) {
            sb.append("Evidence category is DEAD_END: the flagged value comes from a function parameter and ");
            sb.append("no local evidence of its origin was found. The Pre-suggested investigation actions ");
            sb.append("section above provides targeted search queries — start with those before exploring freely.\n\n");
        } else {
            sb.append("Evidence category is AMBIGUOUS: the source is partially visible but not conclusive. ");
            sb.append("Check the definitions and caller sections above, then use search_repo/read_file to ");
            sb.append("resolve any remaining gaps.\n\n");
        }

        sb.append("Available investigation actions:\n");
        sb.append("- `search_repo`: search all source files for a regex/text; returns `path:line: content` matches.\n");
        sb.append("- `read_file`: read a slice of a file (use paths returned by search_repo).\n");
        sb.append("Tool-budget strategy (local-first):\n");
        sb.append("- first inspect the finding file/function with `read_file` and same-file `search_repo`;\n");
        sb.append("- only after local evidence is exhausted, expand to repo-wide `search_repo`.\n");
        sb.append("Use them to RESOLVE ");
        if (codeInjection) {
            sb.append("whether the setattr/__set__ ATTRIBUTE NAME is a literal/internal holder or attacker-controlled — for example:\n");
            sb.append("- read the enclosing method to see the 2nd argument of setattr (string literal vs variable vs request key);\n");
            sb.append("- search for eval/exec/compile/Function in that method;\n");
            sb.append("- only if NAME is a variable, find where that name identifier is assigned.\n");
        } else {
            sb.append("the origin of the flagged value — for example:\n");
            sb.append("- find where a function/method is called to see whether arguments are attacker-controlled (search for its name);\n");
            sb.append("- find where a field/attribute/variable is assigned (search for `name =`, `self.name =`, etc.);\n");
            sb.append("- find the definition of an imported symbol, or a sanitizer/guard applied in another file.\n");
            sb.append("MULTI-STEP FIELD TRACKING STRATEGY for object.field patterns (e.g. file.filepath, answers.destination, obj.name):\n");
            sb.append("1. Search for the FIELD assignment: `object.field =` or setter `setField(` to find where field is set;\n");
            sb.append("2. Search for the OBJECT assignment: `object =` to find where object is created/initialized;\n");
            sb.append("3. Search for CONSTRUCTOR/BUILDER: look for `new ClassName(` or builder pattern with `field:` parameter;\n");
            sb.append("4. Search CROSS-FILE: if object comes from a parameter, search for call sites of the method/function;\n");
            sb.append("5. For framework patterns (Strapi `answers.destination`, Spring `file.originalFilename`): check framework docs or common patterns;\n");
            sb.append("6. If the field is populated from HTTP request, database, or file upload, classify as untrusted even if intermediate steps are unclear.\n");
        }
        sb.append("Search only for identifiers that actually appear in the shown code — never search for placeholder names ");
        sb.append("from the scanner remediation text (e.g. `user.Input`, `dynamic_input`).\n");
        sb.append(String.format(Locale.ROOT,
                "Prefer 1-%d focused actions. Do NOT answer UNCERTAIN because the origin is 'outside the shown code' "
                + "without first searching for it. Only answer UNCERTAIN if the origin still cannot be determined "
                + "after investigating.\n\n",
                MAX_TOOL_CALLS_PER_FINDING));

        sb.append("### Step 1 — Classify execution context\n");
        sb.append("Read the imports and code structure. Choose ONE of:\n");
        sb.append("- `web_server`: code runs inside a web framework (FastAPI, Flask, Django, Spring MVC, Express, Rails, Gin, Echo, Actix, Rocket, JAX-RS, or similar). HTTP requests are untrusted input.\n");
        sb.append("- `web_client`: code runs in the browser as client-side JavaScript (Stimulus, React, Vue, Angular, jQuery, vanilla DOM manipulation, Web Components, Alpine.js, or similar). Inputs come from the DOM, URL, postMessage, or user interaction events.\n");
        sb.append("- `desktop_gui`: code runs in a desktop GUI application (Java Swing/AWT/JavaFX/SWT, WinForms/WPF, Qt, Tk, Electron main process, or similar). GUI fields are local user input; do NOT classify Java Swing/AWT/JavaFX as web_client.\n");
        sb.append("- `cli_developer_tool`: code uses a developer CLI library (Typer, Click, argparse, Cobra, picocli, Thor, docopt, or similar) or is a standalone script run by developers. Inputs are developer-supplied.\n");
        sb.append("- `test`: code contains test framework imports (pytest, unittest, JUnit, RSpec, Mocha, Jasmine, Mockito, or similar). Not executed in production.\n");
        sb.append("- `library`: code defines classes/functions with no entry point, intended to be imported by callers.\n");
        sb.append("- `unknown`: cannot be determined from the supplied code.\n\n");

        if (codeInjection) {
            sb.append("### Step 2 — Classify who controls the ATTRIBUTE NAME (not the assigned value)\n");
            sb.append("For CWE-94/95 setattr / code generation, `input_source` is the origin of the NAME argument ");
            sb.append("(setattr's 2nd arg), never the VALUE being stored.\n");
            sb.append("- `internal_call`: NAME is a string literal, constant, `self.field` / `this.field`, ");
            sb.append("`cls._meta.*`, a local field-name holder, or ORM `contribute_to_class` field id from a class body. ");
            sb.append("Use this even when the assigned VALUE comes from HTTP/GraphQL/DB.\n");
            sb.append("- `http_request` / `database` / `file_untrusted`: NAME itself is taken from request/json/data.keys() ");
            sb.append("or other untrusted input (mass assignment).\n");
            sb.append("- `unknown`: you cannot tell whether NAME is attacker-controlled after local investigation.\n");
            sb.append("Do not set `http_request` only because the VALUE is request-derived.\n\n");
        } else {
            sb.append("### Step 2 — Classify input source for the flagged variable\n");
            sb.append("Trace where the flagged value comes from. Choose ONE of:\n");
            sb.append("- `http_request`: HTTP body, query param, header, cookie, form field, path variable — untrusted.\n");
            sb.append("- `database`: read from a database that stores user-submitted data — potentially untrusted.\n");
            sb.append("- `file_untrusted`: content of a file supplied by an untrusted party — untrusted. "
                    + "This is FILE BYTES, not a parser-generated temp path string.\n");
            sb.append("- `multipart_parser_temp_path`: filesystem path is the tempfile the multipart parser "
                    + "(formidable/koa-body/multer, PHP $_FILES tmp_name, Django temporary_file_path, "
                    + "Rails tempfile.path) created. Trusted for path traversal. The client filename "
                    + "(originalFilename) is a different field and remains untrusted if used as a path.\n");
            sb.append("- `gui_input`: value read from a desktop GUI field/control (e.g. JTextField, JPasswordField, text box, table selection) — local user input.\n");
            sb.append("- `dom_content`: value read from existing DOM elements (e.g. element.innerHTML, element.textContent, dataset attributes, element.value). Trustworthiness depends on how the DOM was populated: server-rendered content is generally trusted, but content from URL fragments, postMessage, or user-editable fields may be untrusted.\n");
            sb.append("- `url_fragment`: value from window.location (hash, search params, pathname) — potentially untrusted in client-side code.\n");
            sb.append("- `cli_argument_developer`: argument passed by a developer running the tool — trusted.\n");
            sb.append("- `internal_call`: value computed internally with no external input — trusted.\n");
            sb.append("- `config_file`: read from a configuration file managed by operators — trusted for the config VALUE. "
                    + "If it only names a path whose file is later deserialized, classify based on who controls that file's bytes.\n");
            sb.append("- `environment_variable`: from an env var set by operators — trusted for the env VALUE / PATH. "
                    + "If the env var only supplies a filesystem path and that file is deserialized, still use "
                    + "`environment_variable` when writers are app/operator-only; use `file_untrusted` only when "
                    + "file contents are attacker-influenced (upload, user-writable path, untrusted dump).\n");
            sb.append("- `unknown`: cannot be determined from the supplied code.\n\n");
        }

        sb.append("### Step 3 - Assess the vulnerability\n");
        sb.append("Use the structured evidence, execution_context, input_source, and CWE-specific review guidance above. ");
        sb.append("Do not re-derive rule-specific policy from memory; apply the checklist for the finding's CWE/family.\n");
        if (codeInjection) {
            sb.append("- For THIS finding (CWE-94/95): judge the attribute NAME, not VALUE origin. ");
            sb.append("input_source=internal_call + no eval/exec sink => FALSE_POSITIVE. ");
            sb.append("Attacker-controlled NAME or eval/exec/compile sink => TRUE_POSITIVE. ");
            sb.append("Do not use UNCERTAIN because VALUE origin is unclear. A sanitizer is not required.\n");
        }
        sb.append("- Mark TRUE_POSITIVE only when the shown code proves the issue is exploitable for this CWE.\n");
        sb.append("- Mark FALSE_POSITIVE only when the shown code proves a complete neutralizer, safe source, framework guarantee, or non-exploitable context appropriate to this CWE.\n");
        sb.append("- For source-to-sink injection (SQL/command/XSS/SSTI — not setattr wiring): untrusted input_source + exploitable sink + no neutralizer => TRUE_POSITIVE. "
                + "Do not use UNCERTAIN just because some callers outside the shown snippets were not enumerated.\n");
        sb.append("- For CWE-94/95 setattr / code generation: judge the attribute NAME, not the VALUE origin. "
                + "SAFE (FALSE_POSITIVE): setattr(obj, 'literal', v), setattr(obj, self.field, v), __set__ writing "
                + "fixed fields — even if v is HTTP/DB. UNSAFE (TRUE_POSITIVE): setattr(obj, request/data[key], v) "
                + "or for key in data: setattr(obj, key, v), or a real eval/exec/compile sink. "
                + "Do not use UNCERTAIN because VALUE origin is unclear.\n");
        sb.append("- For SQL injection: if the value is not hardcoded/literal/constant AND the shown code clearly "
                + "concatenates/interpolates that string into SQL (any language idiom: +, ., f-string, template "
                + "literal, sprintf, etc.) without parameterization or a complete allowlist, "
                + "verdict MUST be TRUE_POSITIVE.\n");
        sb.append("- For CWE-502 deserialization: path-from-env/config is usually fine for the PATH. Decide on "
                + "FILE CONTENT control after tracing writers (pickle.dump/save). Attacker-influenced bytes => "
                + "TRUE_POSITIVE; proven app/operator-only static artifact => FALSE_POSITIVE; unresolved writer "
                + "trust => UNCERTAIN (do not invent either side).\n");
        sb.append("- For HTTP header/response-splitting sinks: regex capture groups, URL decoding, and path '..' "
                + "filters are NOT neutralizers.\n");
        sb.append("- For missing authentication (e.g. DB connect): trace whether an auth channel exists and whether "
                + "password/token values are null/empty. Do not infer authentication from argument count alone; "
                + "if values are unknown, prefer UNCERTAIN over FALSE_POSITIVE.\n");
        sb.append("- For misconfiguration/timing/crypto: local primitive + data character is enough; full call-graph is not required.\n");
        sb.append("- Use UNCERTAIN only when a key fact is missing or contradictory (e.g. unknown whether a compared value is a secret), "
                + "not when repository-wide search was incomplete.\n");
        sb.append("- Reasoning must cite concrete identifiers/functions and describe source -> transformations/calls -> sink when taint is required.\n");
        sb.append("- For configuration-style findings where taint is not required, reason about the configured primitive/flag/secret/audience and why it is safe or unsafe.\n");
        if (includeDataflow) {
            sb.append("- Check if related files show sanitization, allowlisting, framework defaults, or wrappers that affect exploitability.\n");
        }

        sb.append("\n### Step 4 - Score confidence\n");
        sb.append("`confidence` measures how certain you are in the VERDICT itself (not the severity or impact). ");
        sb.append("Assign the numeric value that falls inside the matching standardized band:\n");
        sb.append(ConfidenceLevel.promptRubric());
        sb.append(String.format(Locale.ROOT,
                "- You may give a definitive verdict (TRUE_POSITIVE or FALSE_POSITIVE) once your confidence reaches %.2f. "
                + "Do not retreat to UNCERTAIN when the CWE guidance and shown evidence are sufficient for a verdict.\n",
                ConfidenceLevel.DEFINITIVE_VERDICT_MIN));
        sb.append(String.format(Locale.ROOT,
                "- Use UNCERTAIN for genuine ambiguity and score such cases below %.2f.\n",
                ConfidenceLevel.DEFINITIVE_VERDICT_MIN));
        sb.append(String.format(Locale.ROOT,
                "- Reserve VERY_HIGH (>= %.2f) for cases where the relevant source/configuration, sink/impact, and missing or sufficient protection are explicit in the shown code.\n",
                ConfidenceLevel.VERY_HIGH.lowerBound()));

        sb.append("\nRemediation rules for TRUE_POSITIVE (apply to EVERY CWE, not only SQL):\n");
        sb.append("- recommendation is required. remediation_code is required (or a 'Cannot provide a safe code snippet:' message).\n");
        sb.append("- Prefer framework-native safe APIs over generic sanitization.\n");
        sb.append("- CRITICAL: remediation_code must rewrite the flagged code extract and shown local context ");
        sb.append("(same variables, expressions, sink/call site, SQL shape). Start from that snippet and show the fixed version.\n");
        sb.append("- Do NOT invent unrelated textbook examples with placeholder names ");
        sb.append("(`expected`/`actual`, `SELECT ... WHERE username = ? AND password = ?`, `res.cookie('name', value, ...)`) ");
        sb.append("unless those exact names/queries appear in the finding.\n");
        sb.append("- Language must match the finding file (JS→crypto.timingSafeEqual, Java→MessageDigest.isEqual, ");
        sb.append("Python→hmac.compare_digest, etc.).\n");
        sb.append("- For concatenated SQL / identifiers / DDL fragments: placeholders often cannot bind those parts — ");
        sb.append("recommend allowlisting/validation at the shown construction site (same variables and sink).\n");
        sb.append("- For JWT verification bypass (verify_signature=False / unsigned decode): remediation_code must ");
        sb.append("use the language-idiomatic verifying API with project key/secret, algorithms allowlist, ");
        sb.append("and verification explicitly enabled ");
        sb.append("(Python: options={\"verify_signature\": True}; Ruby: JWT.decode(..., true, ...); ");
        sb.append("JS/TS: jwt.verify; Java: parseClaimsJws; C#: RequireSignedTokens=true; ");
        sb.append("PHP: JWT::decode+Key; Go: jwt.Parse + token.Valid). ");
        sb.append("Bare jwt.decode(token) / only deleting verify_signature=False is INVALID. ");
        sb.append("Do not invent a hardcoded secret; reuse the project's JWT secret/config symbol when visible, ");
        sb.append("otherwise use a named placeholder and state where the key must come from. ");
        sb.append("If the helper is claim-peek-only and a verified decode already gates auth, prefer FALSE_POSITIVE.\n");
        sb.append("- If a `Scanner-suggested remediation` section is provided above, treat it as a reference only: ");
        sb.append("produce your OWN remediation_code adapted to the actual code shown (correct variable names, call site, imports, and framework idioms), not a verbatim copy of the scanner text.\n");
        sb.append("- The scanner guidance is often generic; if it is inaccurate, incomplete, or wrong for this context, improve or replace it and base your fix on the real code and data flow shown.\n");
        sb.append("- Keep remediation_code focused and COMPLETE: show only the minimal changed function/lines with correct, closed syntax. ");
        sb.append("Do not emit a truncated or unbalanced snippet; if a full fix would be long, show just the key corrected line(s).\n");
        sb.append("\n## Response protocol\n");
        sb.append("Respond with ONLY a single valid JSON object. No markdown, no prose, no text outside the JSON. ");
        sb.append("Use valid JSON escaping. Do not escape single quotes or dollar signs.\n");
        sb.append("Each response must be EXACTLY ONE of the following:\n\n");

        sb.append("A) An investigation step (when you need more context to determine the origin):\n");
        sb.append("{\"thought\": \"why you need this\", \"action\": \"search_repo\", ");
        sb.append("\"pattern\": \"regex or literal text\", \"path_glob\": \"optional filename glob, e.g. *.py\"}\n");
        sb.append("or\n");
        sb.append("{\"thought\": \"why you need this\", \"action\": \"read_file\", ");
        sb.append("\"path\": \"repo-relative/path\", \"start_line\": 1, \"end_line\": 60}\n");
        sb.append("After each investigation step you will receive a `TOOL RESULT` message; then send your next response.\n\n");

        sb.append("B) Stage 1 final verdict (minimal):\n");
        sb.append("{");
        sb.append("\"action\": \"final\", ");
        sb.append("\"verdict\": \"TRUE_POSITIVE|FALSE_POSITIVE|UNCERTAIN\", ");
        sb.append("\"confidence\": 0.0-1.0, ");
        sb.append("\"reasoning\": \"3-6 sentences describing source -> transformations/call chain -> sink with concrete code evidence\"");
        sb.append("}\n\n");
        sb.append("C) Stage 2 details (only when requested after Stage 1):\n");
        sb.append("{");
        sb.append("\"action\": \"final\", ");
        sb.append("\"execution_context\": \"web_server|web_client|desktop_gui|cli_developer_tool|test|library|unknown\", ");
        sb.append("\"input_source\": \"http_request|database|file_untrusted|multipart_parser_temp_path|gui_input|dom_content|url_fragment|cli_argument_developer|internal_call|config_file|environment_variable|unknown\", ");
        sb.append("\"verdict\": \"TRUE_POSITIVE|FALSE_POSITIVE|UNCERTAIN\", ");
        sb.append("\"confidence\": 0.0-1.0, ");
        sb.append("\"reasoning\": \"3-6 sentences describing source -> transformations/call chain -> sink with concrete code evidence\", ");
        sb.append("\"recommendation\": \"required for TRUE_POSITIVE, empty string otherwise\", ");
        sb.append("\"remediation_code\": \"required for TRUE_POSITIVE, empty string otherwise\", ");
        sb.append("\"false_positive_evidence\": \"for FALSE_POSITIVE: short verbatim citation of the existing sanitizer/escaping/text-only sink/allowlist/framework guarantee/trusted source/local-only non-sensitive exposure/same-origin or relative-only redirect construction, empty otherwise\"");
        sb.append("}\n");
        return sb.toString();
    }

    private VerificationResult parseSingleResponse(String content, Item item, SastRuleMetadata metadata) {
        JsonNode node;
        try {
            String json = extractJson(content);
            node = objectMapper.readTree(json);
        } catch (Exception e) {
            log.warn("[SastVerification] Failed to parse LLM response for {}: {}", item.getTitle(), e.getMessage());
            return VerificationResult.failed(ParseFailureReason.INVALID_JSON);
        }

        if (!node.isObject()) {
            log.warn("[SastVerification] LLM response for {} was not a JSON object", item.getTitle());
            return VerificationResult.failed(ParseFailureReason.INVALID_JSON);
        }

        String action = textValue(node, "action");
        if (!"final".equals(action)) {
            log.warn("[SastVerification] LLM response for {} did not contain action=final", item.getTitle());
            return VerificationResult.failed(ParseFailureReason.MISSING_ACTION);
        }

        String executionContext = textValue(node, "execution_context");
        String inputSource = textValue(node, "input_source");
        if (executionContext.isBlank()) {
            log.warn("[SastVerification] LLM response for {} did not contain execution_context", item.getTitle());
            return VerificationResult.failed(ParseFailureReason.MISSING_EXECUTION_CONTEXT);
        }
        if (inputSource.isBlank()) {
            log.warn("[SastVerification] LLM response for {} did not contain input_source", item.getTitle());
            return VerificationResult.failed(ParseFailureReason.MISSING_INPUT_SOURCE);
        }
        log.info("[SastVerification] LLM classified context for {}: execution_context={}, input_source={}",
                item.getTitle(), executionContext.isBlank() ? "not provided" : executionContext,
                inputSource.isBlank() ? "not provided" : inputSource);

        String verdict = textValue(node, "verdict");
        if (!isValidVerdict(verdict)) {
            log.warn("[SastVerification] LLM response for {} did not contain a valid verdict", item.getTitle());
            return VerificationResult.failed(ParseFailureReason.MISSING_VERDICT);
        }
        if (!node.hasNonNull("confidence") || !node.get("confidence").isNumber()) {
            log.warn("[SastVerification] LLM response for {} did not contain a valid confidence", item.getTitle());
            return VerificationResult.failed(ParseFailureReason.MISSING_CONFIDENCE);
        }

        String reasoning = textValue(node, "reasoning");
        if (reasoning.isBlank()) {
            log.warn("[SastVerification] LLM response for {} did not contain reasoning", item.getTitle());
            return VerificationResult.failed(ParseFailureReason.MISSING_REASONING);
        }

        boolean normalized = false;
        double confidence = node.get("confidence").asDouble();
        String recommendation = textValue(node, "recommendation");
        String remediationCode = textValue(node, "remediation_code");
        String falsePositiveEvidence = textValue(node, "false_positive_evidence");

        // If model classified this as a developer CLI tool or test and marked TRUE_POSITIVE
        // without proving untrusted input, downgrade to UNCERTAIN
        if ("TRUE_POSITIVE".equals(verdict)
                && isTrustedExecutionContext(executionContext, inputSource)
                && !isMisconfigurationProfile(metadata)
                && !hasNaiveSocketConstructorEvidence(item)) {
            log.warn("[SastVerification] LLM marked TRUE_POSITIVE for {} but classified context as trusted ({}:{}); normalizing to UNCERTAIN",
                    item.getTitle(), executionContext, inputSource);
            verdict = "UNCERTAIN";
            recommendation = "";
            remediationCode = "";
            reasoning = appendNormalizationReason(reasoning,
                    "Execution context is " + executionContext + " with input_source " + inputSource
                    + "; untrusted external input is not proven.");
            normalized = true;
        }

        if ("TRUE_POSITIVE".equals(verdict) && isContradictoryTruePositiveReasoning(reasoning)) {
            log.warn("[SastVerification] LLM response for {} had TRUE_POSITIVE verdict but non-vulnerable reasoning; normalizing to FALSE_POSITIVE", item.getTitle());
            verdict = "FALSE_POSITIVE";
            normalized = true;
            if (falsePositiveEvidence.isBlank()) {
                falsePositiveEvidence = "LLM reasoning stated that the finding is not vulnerable or not exploitable.";
            }
        }

        if ("FALSE_POSITIVE".equals(verdict) && isPathOnlyFalsePositiveEvidence(falsePositiveEvidence, reasoning)) {
            log.warn("[SastVerification] LLM response for {} used path-only false-positive evidence; normalizing to UNCERTAIN", item.getTitle());
            verdict = "UNCERTAIN";
            recommendation = "";
            remediationCode = "";
            falsePositiveEvidence = "";
            reasoning = appendNormalizationReason(reasoning,
                    "Path names alone do not prove the finding is not exploitable; code-based evidence is required.");
            normalized = true;
        }

        if (("FALSE_POSITIVE".equals(verdict) || "UNCERTAIN".equals(verdict))
                && isMisconfigurationProfile(metadata)
                && (isTestNamingOnlyMisconfigurationFalsePositive(falsePositiveEvidence, reasoning)
                    || !citesRealMisconfigurationNeutralizer(falsePositiveEvidence, reasoning))) {
            log.warn("[SastVerification] LLM downgraded MISCONFIGURATION for {} without a proven neutralizer; "
                            + "normalizing to TRUE_POSITIVE",
                    item.getTitle());
            verdict = "TRUE_POSITIVE";
            confidence = Math.max(confidence, 0.90d);
            falsePositiveEvidence = "";
            recommendation = misconfigurationRecommendation(item);
            remediationCode = misconfigurationRemediationCode(item);
            reasoning = appendNormalizationReason(reasoning,
                    "MISCONFIGURATION findings must not be downgraded based on test/dev/demo/mock naming, path hints, "
                            + "missing taint, or unclear sensitivity. Without a proven safety neutralizer in existing code, "
                            + "the verdict is TRUE_POSITIVE.");
            normalized = true;
        }

        if (!"FALSE_POSITIVE".equals(verdict)
                && hasNumericSqlParameterEvidence(item, falsePositiveEvidence, reasoning)) {
            log.warn("[SastVerification] LLM marked {} for {} despite numeric SQL parameter evidence; "
                            + "normalizing to FALSE_POSITIVE",
                    verdict, item.getTitle());
            verdict = "FALSE_POSITIVE";
            confidence = Math.max(confidence, 0.85d);
            recommendation = "";
            remediationCode = "";
            if (falsePositiveEvidence.isBlank()) {
                falsePositiveEvidence = "SQL query parameter is typed or parsed as a numeric value.";
            }
            reasoning = appendNormalizationReason(reasoning,
                    "SQL injection requires attacker-controlled SQL syntax. The query parameter is proven "
                            + "numeric/parsed as a number, so it cannot inject SQL text through that parameter.");
            normalized = true;
        }

        if (!"FALSE_POSITIVE".equals(verdict)
                && isRegexDosFinding(item, metadata)
                && hasRegexEscapeSafetyEvidence(item, falsePositiveEvidence, reasoning)) {
            log.warn("[SastVerification] LLM marked {} for {} despite regex neutralization evidence; "
                            + "normalizing to FALSE_POSITIVE",
                    verdict, item.getTitle());
            verdict = "FALSE_POSITIVE";
            confidence = Math.max(confidence, 0.85d);
            recommendation = "";
            remediationCode = "";
            if (falsePositiveEvidence.isBlank()) {
                falsePositiveEvidence = "Regex pattern is metacharacter-escaped, literally quoted, or rebuilt "
                        + "from an existing RegExp.source without new pattern injection.";
            }
            reasoning = appendNormalizationReason(reasoning,
                    "Dynamic-regex / ReDoS findings are FALSE_POSITIVE when the sink metacharacter-escapes / "
                            + "literally quotes input before compile, or only rebuilds an existing RegExp via "
                            + ".source (no new pattern syntax at this site).");
            normalized = true;
        }

        if (!"FALSE_POSITIVE".equals(verdict)
                && isOpenRedirectFinding(item, metadata)
                && hasOpenRedirectSafetyEvidence(item, falsePositiveEvidence, reasoning)) {
            log.warn("[SastVerification] LLM marked {} for {} despite same-origin/relative redirect evidence; "
                            + "normalizing to FALSE_POSITIVE",
                    verdict, item.getTitle());
            verdict = "FALSE_POSITIVE";
            confidence = Math.max(confidence, 0.85d);
            recommendation = "";
            remediationCode = "";
            if (falsePositiveEvidence.isBlank()) {
                falsePositiveEvidence = "Redirect target is built from the current page URL with only "
                        + "search/query-parameter mutation, or is a relative-only literal path.";
            }
            reasoning = appendNormalizationReason(reasoning,
                    "Open redirect requires attacker control of the redirect host/URL. Same-origin "
                            + "URL + searchParams-only mutation (or relative-only literal) cannot redirect externally.");
            normalized = true;
        }

        if (!"FALSE_POSITIVE".equals(verdict)
                && isPathTraversalFinding(item, metadata)
                && isMultipartTempPathPresent(item.getCodeExtract(), falsePositiveEvidence, reasoning)) {
            log.warn("[SastVerification] LLM marked {} for {} despite multipart parser temp-path evidence; "
                            + "normalizing to FALSE_POSITIVE",
                    verdict, item.getTitle());
            verdict = "FALSE_POSITIVE";
            confidence = Math.max(confidence, 0.90d);
            recommendation = "";
            remediationCode = "";
            if (falsePositiveEvidence.isBlank()) {
                falsePositiveEvidence = "Filesystem sink reads the multipart parser temp-path field, "
                        + "not the client filename.";
            }
            reasoning = appendNormalizationReason(reasoning,
                    "Path traversal taints the path string. Multipart parser temp paths "
                            + "(file.filepath / tmp_name / temporary_file_path / tempfile.path) are "
                            + "server-generated; the client filename is a different field.");
            normalized = true;
        }

        if (hasSqlRiskyTrustedConcatPattern(item, null, "", falsePositiveEvidence, reasoning)) {
            if (!"TRUE_POSITIVE".equals(verdict) || confidence < 0.50d || confidence > 0.60d) {
                log.warn("[SastVerification] LLM marked {} for {} on trusted-source SQL concat; "
                                + "normalizing to TRUE_POSITIVE @ {}",
                        verdict, item.getTitle(), SQL_RISKY_TRUSTED_CONCAT_CONFIDENCE);
                verdict = "TRUE_POSITIVE";
                confidence = SQL_RISKY_TRUSTED_CONCAT_CONFIDENCE;
                falsePositiveEvidence = "";
                recommendation = sqlInjectionRecommendation(item);
                remediationCode = sqlInjectionRemediationCode(item);
                reasoning = appendNormalizationReason(reasoning,
                        "RISKY SCHEME: SQL is concatenated/interpolated from proven application-safe "
                                + "literals/constants. TRUE_POSITIVE with mid confidence (~0.55), not FALSE_POSITIVE.");
                normalized = true;
            }
        } else if (!"TRUE_POSITIVE".equals(verdict)
                && hasUnneutralizedStringSqlInjectionEvidence(item, falsePositiveEvidence, reasoning)) {
            log.warn("[SastVerification] LLM marked {} for {} despite unneutralized String SQL injection evidence; "
                            + "normalizing to TRUE_POSITIVE",
                    verdict, item.getTitle());
            verdict = "TRUE_POSITIVE";
            confidence = Math.max(confidence, 0.90d);
            falsePositiveEvidence = "";
            recommendation = sqlInjectionRecommendation(item);
            remediationCode = sqlInjectionRemediationCode(item);
            reasoning = appendNormalizationReason(reasoning,
                    "Non-hardcoded/untrusted string input concatenated or interpolated into dynamic SQL without "
                            + "parameterization, numeric typing, or a complete allowlist is TRUE_POSITIVE.");
            normalized = true;
        }

        // Header injection / response splitting: reject FP that only cites regex/decode/path filters
        if (("FALSE_POSITIVE".equals(verdict) || "UNCERTAIN".equals(verdict))
                && isHttpHeaderInjectionFinding(item, metadata)
                && isUntrustedInputSource(inputSource)
                && citesWeakHeaderNeutralizerOnly(falsePositiveEvidence, reasoning)) {
            log.warn("[SastVerification] LLM marked {} for {} using weak header neutralizer evidence; "
                            + "normalizing to TRUE_POSITIVE",
                    verdict, item.getTitle());
            verdict = "TRUE_POSITIVE";
            confidence = Math.max(confidence, 0.90d);
            falsePositiveEvidence = "";
            if (recommendation.isBlank()) {
                recommendation = "Strip or encode CR/LF and context-encode untrusted values before writing them "
                        + "to HTTP headers/responses; prefer strict allowlists for header values.";
            }
            reasoning = appendNormalizationReason(reasoning,
                    "Regex capture groups, URL decoding, and path '..' filtering do not neutralize HTTP header "
                            + "injection / response splitting. Untrusted input reaching a header sink is TRUE_POSITIVE.");
            normalized = true;
        }

        if (!"TRUE_POSITIVE".equals(verdict)
                && hasProvenEmptyDatabaseCredentialsEvidence(item, null, falsePositiveEvidence, reasoning)) {
            log.warn("[SastVerification] LLM marked {} for {} despite proven empty DB credentials; "
                            + "normalizing to TRUE_POSITIVE",
                    verdict, item.getTitle());
            verdict = "TRUE_POSITIVE";
            confidence = Math.max(confidence, 0.90d);
            falsePositiveEvidence = "";
            if (recommendation.isBlank()) {
                recommendation = "Provide non-empty credentials or an equivalent authentication mechanism "
                        + "when opening the database/service connection.";
            }
            reasoning = appendNormalizationReason(reasoning,
                    "Database/service credentials are proven null/empty in the shown code, so missing "
                            + "authentication remains TRUE_POSITIVE.");
            normalized = true;
        }

        // Source-to-sink injection: classified untrusted input + exploitable sink + no neutralizer => TP.
        // CWE-94/95 setattr wiring is not an execution sink — VALUE origin (http_request) must not force TP.
        if ("UNCERTAIN".equals(verdict)
                && isClassicInjectionFamily(metadata)
                && isUntrustedInputSource(inputSource)
                && !hasNonExecutionCodeInjectionWiringEvidence(item, null)
                && !containsPositiveSafetyEvidence(item, reasoning + " " + falsePositiveEvidence)
                && !(isPathTraversalFinding(item, metadata)
                && doesSinkUseParserTempPath(item.getCodeExtract()))) {
            log.warn("[SastVerification] LLM left {} UNCERTAIN despite untrusted input_source={}; "
                            + "normalizing to TRUE_POSITIVE",
                    item.getTitle(), inputSource);
            verdict = "TRUE_POSITIVE";
            confidence = Math.max(confidence, 0.75d);
            falsePositiveEvidence = "";
            if (recommendation.isBlank()) {
                recommendation = "Neutralize untrusted input before it reaches the vulnerable sink "
                        + "(parameterization, allowlist, or CWE-appropriate sanitizer).";
            }
            reasoning = appendNormalizationReason(reasoning,
                    "input_source=" + inputSource + " is untrusted and no complete neutralizer was proven. "
                            + "For source-to-sink injection CWEs this is TRUE_POSITIVE; do not keep UNCERTAIN "
                            + "merely because repository-wide callers were not fully enumerated.");
            normalized = true;
        }

        // SQL injection: unknown source + clear non-literal String concat into SQL => TP
        if (!"TRUE_POSITIVE".equals(verdict)
                && ("unknown".equalsIgnoreCase(inputSource) || inputSource == null || inputSource.isBlank())
                && hasUnneutralizedStringSqlInjectionEvidence(item, falsePositiveEvidence, reasoning)) {
            log.warn("[SastVerification] LLM marked {} for {} with unknown input_source despite unneutralized "
                            + "String SQL concatenation; normalizing to TRUE_POSITIVE",
                    verdict, item.getTitle());
            verdict = "TRUE_POSITIVE";
            confidence = Math.max(confidence, 0.90d);
            falsePositiveEvidence = "";
            recommendation = sqlInjectionRecommendation(item);
            remediationCode = sqlInjectionRemediationCode(item);
            reasoning = appendNormalizationReason(reasoning,
                    "Unknown input_source does not justify UNCERTAIN when the shown code clearly concatenates "
                            + "or interpolates a non-literal string into dynamic SQL without parameterization or a "
                            + "complete allowlist. This is TRUE_POSITIVE.");
            normalized = true;
        }

        // Deserialization: only force TP when evidence shows attacker-influenced file/stream bytes
        // (not merely path-from-env + open/read of a possibly static operator artifact).
        if (!"TRUE_POSITIVE".equals(verdict)
                && isDeserializationFamily(metadata, item)
                && hasAttackerInfluencedDeserializationEvidence(item, null, "")
                && !containsDeserializationSafetyEvidence(falsePositiveEvidence + " " + reasoning)) {
            log.warn("[SastVerification] LLM marked {} for {} despite attacker-influenced bytes reaching unsafe "
                            + "deserialization; normalizing to TRUE_POSITIVE (input_source was {})",
                    verdict, item.getTitle(), inputSource);
            verdict = "TRUE_POSITIVE";
            confidence = Math.max(confidence, 0.85d);
            falsePositiveEvidence = "";
            inputSource = "file_untrusted";
            if (recommendation.isBlank()) {
                recommendation = "Avoid unsafe deserialization of attacker-influenced bytes. Prefer a safe format "
                        + "(e.g. JSON) or enforce integrity checks and a strict type allowlist before loading.";
            }
            if (remediationCode.isBlank() || looksLikeProseRemediation(remediationCode)) {
                remediationCode = deserializationRemediationCode(item);
            }
            reasoning = appendNormalizationReason(reasoning,
                    "Attacker-influenced bytes reach an unsafe deserialization API without allowlist/safe_load/"
                            + "integrity proof. input_source=file_untrusted; verdict is TRUE_POSITIVE.");
            normalized = true;
        }

        if (!"TRUE_POSITIVE".equals(verdict)
                && hasMisconfigurationTruePositiveEvidence(item, null, metadata)) {
            log.warn("[SastVerification] LLM marked {} for {} despite MISCONFIGURATION API/config evidence; "
                            + "normalizing to TRUE_POSITIVE",
                    verdict, item.getTitle());
            verdict = "TRUE_POSITIVE";
            confidence = Math.max(confidence, 0.90d);
            falsePositiveEvidence = "";
            recommendation = misconfigurationRecommendation(item);
            remediationCode = misconfigurationRemediationCode(item);
            reasoning = appendNormalizationReason(reasoning, misconfigurationTruePositiveReason(item, metadata));
            normalized = true;
        }

        if (!"TRUE_POSITIVE".equals(verdict)
                && hasWeakHashPasswordEvidence(item, falsePositiveEvidence, reasoning)) {
            log.warn("[SastVerification] LLM marked {} for {} despite weak password hash evidence; "
                            + "normalizing to TRUE_POSITIVE",
                    verdict, item.getTitle());
            verdict = "TRUE_POSITIVE";
            confidence = Math.max(confidence, 0.90d);
            falsePositiveEvidence = "";
            recommendation = "Replace MD5/SHA-1 password hashing with BCrypt, Argon2, or PBKDF2 using a per-user salt "
                    + "and an appropriate work factor.";
            remediationCode = "Use a password hashing function such as BCrypt, Argon2, or PBKDF2WithHmacSHA256 "
                    + "with a unique per-user salt and configurable work factor; do not use MessageDigest MD5/SHA-1 "
                    + "for passwords.";
            reasoning = appendNormalizationReason(reasoning,
                    "MD5/SHA-1 used for password hashing, password storage, or password comparison is "
                            + "security-sensitive weak hashing and remains exploitable.");
            normalized = true;
        }

        if (!"FALSE_POSITIVE".equals(verdict)
                && hasLocalOnlyNonSensitiveLeakEvidence(item, falsePositiveEvidence, reasoning)) {
            log.warn("[SastVerification] LLM marked {} for {} despite local-only non-sensitive leak evidence; "
                            + "normalizing to FALSE_POSITIVE",
                    verdict, item.getTitle());
            verdict = "FALSE_POSITIVE";
            confidence = Math.max(confidence, 0.85d);
            recommendation = "";
            remediationCode = "";
            falsePositiveEvidence = "The exception/log output is limited to local console or desktop GUI context "
                    + "and no concrete secret, credential, token, PII, or remote exposure is shown.";
            reasoning = appendNormalizationReason(reasoning,
                    "Information leakage requires sensitive content and an exposure path to an untrusted audience. "
                            + "Local-only console output in a desktop/CLI context without concrete secrets is not exploitable.");
            normalized = true;
        }

        // A FALSE_POSITIVE verdict in the lowest confidence band is self-contradictory:
        // the model is dismissing the finding while signalling it has no confidence in that
        // dismissal. Treat it as unresolved (UNCERTAIN) so a real vulnerability is never
        // auto-suppressed on the basis of a low-confidence "safe" verdict.
        if ("FALSE_POSITIVE".equals(verdict)
                && ConfidenceLevel.fromConfidence(confidence) == ConfidenceLevel.VERY_LOW
                && !hasNumericSqlParameterEvidence(item, falsePositiveEvidence, reasoning)) {
            log.warn("[SastVerification] LLM marked FALSE_POSITIVE for {} with {} confidence ({}); normalizing to UNCERTAIN",
                    item.getTitle(), ConfidenceLevel.VERY_LOW, String.format(Locale.ROOT, "%.2f", confidence));
            verdict = "UNCERTAIN";
            recommendation = "";
            remediationCode = "";
            falsePositiveEvidence = "";
            reasoning = appendNormalizationReason(reasoning,
                    "False-positive verdict had very low confidence (" + String.format(Locale.ROOT, "%.2f", confidence)
                    + "); insufficient certainty to dismiss the finding.");
            normalized = true;
        }

        // Client-side HTML injection guard: if the model dismisses an HTML sink by trusting
        // backend/API/JSON response content, require explicit escaping/sanitization evidence.
        // Stored or reflected user-controlled content can travel through the backend and still
        // reach innerHTML/insertAdjacentHTML unsafely on the client.
        if ("FALSE_POSITIVE".equals(verdict)
                && "web_client".equals(executionContext)
                && isHtmlInjectionSink(item)
                && reliesOnTrustedServerResponseReasoning(falsePositiveEvidence, reasoning)
                && !containsHtmlNeutralizationEvidence(falsePositiveEvidence, reasoning)) {
            log.warn("[SastVerification] LLM marked FALSE_POSITIVE for {} by trusting backend/API response content "
                    + "without explicit HTML neutralization proof; normalizing to UNCERTAIN", item.getTitle());
            verdict = "UNCERTAIN";
            recommendation = "";
            remediationCode = "";
            falsePositiveEvidence = "";
            reasoning = appendNormalizationReason(reasoning,
                    "Client-side HTML injection rule: backend/API/JSON response content is not automatically trusted. "
                            + "FALSE_POSITIVE requires explicit escaping, sanitization, or text-only insertion proof "
                            + "before content reaches innerHTML/insertAdjacentHTML.");
            normalized = true;
        }

        // Library execution-sink guard: if the model marked FALSE_POSITIVE for a known execution-sink
        // vulnerability type (EL injection, code injection, command injection, SSTI, etc.) while
        // classifying the context as library/internal_call, require that the false_positive_evidence
        // proves in-function sandboxing — not just "callers appear internal". Without in-function
        // proof the finding must remain UNCERTAIN because the library API is open to any caller.
        if ("FALSE_POSITIVE".equals(verdict)
                && "library".equals(executionContext)
                && ("internal_call".equals(inputSource) || "unknown".equals(inputSource))
                && isExecutionSinkVulnerability(item)) {
            boolean hasSandboxingProof = containsSandboxingEvidence(falsePositiveEvidence, reasoning);
            if (!hasSandboxingProof) {
                log.warn("[SastVerification] LLM marked FALSE_POSITIVE for {} (execution_context=library, input_source={}) "
                        + "without in-function sandboxing proof; normalizing to UNCERTAIN",
                        item.getTitle(), inputSource);
                verdict = "UNCERTAIN";
                recommendation = "";
                remediationCode = "";
                falsePositiveEvidence = "";
                reasoning = appendNormalizationReason(reasoning,
                        "Execution-sink library rule: the function passes its parameter directly to an execution engine "
                        + "with no in-function sandbox. FALSE_POSITIVE requires proof of in-function allowlist/guard, "
                        + "not just that visible callers are internal.");
                normalized = true;
            }
        }

        if ("TRUE_POSITIVE".equals(verdict)) {
            if (recommendation.isBlank()) {
                recommendation = defaultTruePositiveRecommendationText(item, reasoning);
                normalized = true;
            }
            if (remediationCode.isBlank()) {
                remediationCode = defaultTruePositiveRemediationCode(item, reasoning);
                normalized = true;
            }
            // Replace generic SELECT username/password templates with fragment-aware SQL fixes.
            if (isSqlInjectionFinding(item)
                    && (looksLikeGenericSqlRemediation(remediationCode)
                    || looksLikeProseRemediation(remediationCode))) {
                remediationCode = sqlInjectionRemediationCode(item);
                if (recommendation.isBlank() || looksLikeGenericSqlRecommendation(recommendation)) {
                    recommendation = sqlInjectionRecommendation(item);
                }
                normalized = true;
            }
            // Replace placeholder timing/cookie/deser/JWT remediations with extract-anchored ones.
            if (isTimingSideChannelFinding(item, null)
                    && looksLikeGenericUnanchoredRemediation(remediationCode, item)) {
                remediationCode = timingRemediationCode(item);
                if (recommendation.isBlank()) {
                    recommendation = timingRecommendation(item);
                }
                normalized = true;
            } else if (isCookieSecurityFinding(item)
                    && looksLikeGenericUnanchoredRemediation(remediationCode, item)) {
                remediationCode = cookieRemediationCode(item);
                normalized = true;
            } else if (isDeserializationFamily(null, item)
                    && looksLikeGenericUnanchoredRemediation(remediationCode, item)) {
                remediationCode = deserializationRemediationCode(item);
                normalized = true;
            } else if (isJwtVerificationBypassFinding(item, metadata)
                    && (looksLikeWeakJwtRemediation(remediationCode)
                    || looksLikeGenericUnanchoredRemediation(remediationCode, item)
                    || looksLikeProseRemediation(remediationCode))) {
                remediationCode = jwtVerificationRemediationCode(item);
                if (recommendation.isBlank() || looksLikeWeakJwtRecommendation(recommendation)) {
                    recommendation = jwtVerificationRecommendation(item);
                }
                normalized = true;
            } else if (!remediationCode.isBlank()
                    && looksLikeGenericUnanchoredRemediation(remediationCode, item)
                    && !flaggedCodeExtract(item).isBlank()) {
                remediationCode = wrapWithFlaggedExtract(item, remediationCode);
                normalized = true;
            }
        }

        applyVerdict(new ParsedVerdict(
                verdict,
                confidence,
                reasoning,
                recommendation,
                remediationCode,
                falsePositiveEvidence
        ), item);
        return VerificationResult.verified(normalized);
    }

    private void applyVerdict(ParsedVerdict parsedVerdict, Item item) {
        String verdict = parsedVerdict.verdict();
        double confidence = parsedVerdict.confidence();
        String reasoning = parsedVerdict.reasoning() == null ? "" : parsedVerdict.reasoning().trim();
        String recommendation = "TRUE_POSITIVE".equals(verdict)
                ? formatRecommendation(parsedVerdict.recommendation(), parsedVerdict.remediationCode())
                : null;

        confidence = Math.max(0.0, Math.min(1.0, confidence));

        item.setAiVerdict(verdict);
        item.setAiConfidence(confidence);
        item.setAiReasoning(reasoning);
        item.setAiRecommendation(recommendation);

        if (item.getFingerprint() != null) {
            fingerprintCache.put(item.getFingerprint(), new CachedVerdict(verdict, confidence, reasoning, recommendation));
        }

        log.debug("[SastVerification] {} | {} (confidence: {} / {}) | {}",
                item.getFilename(), verdict, confidence, ConfidenceLevel.fromConfidence(confidence), reasoning);
    }

    private boolean isValidVerdict(String verdict) {
        return "TRUE_POSITIVE".equals(verdict) || "FALSE_POSITIVE".equals(verdict) || "UNCERTAIN".equals(verdict);
    }

    private String textValue(JsonNode node, String fieldName) {
        if (!node.hasNonNull(fieldName)) {
            return "";
        }
        return node.get(fieldName).asText("").trim();
    }

    /**
     * Returns true when the model itself classified the execution context as trusted
     * (developer CLI tool or test) with a trusted input source — meaning TRUE_POSITIVE
     * cannot be supported without contradicting the model's own context classification.
     */
    private boolean isTrustedExecutionContext(String executionContext, String inputSource) {
        if (executionContext == null || inputSource == null) return false;
        boolean trustedContext = executionContext.equals("cli_developer_tool")
                || executionContext.equals("test");
        boolean trustedInput = inputSource.equals("cli_argument_developer")
                || inputSource.equals("internal_call")
                || inputSource.equals("config_file")
                || inputSource.equals("environment_variable");
        return trustedContext && trustedInput;
    }

    private boolean isContradictoryTruePositiveReasoning(String reasoning) {
        if (reasoning == null) {
            return false;
        }
        String lower = reasoning.toLowerCase(Locale.ROOT);
        return lower.contains("not vulnerable")
                || lower.contains("does not leak")
                || lower.contains("doesn't leak")
                || lower.contains("does not disclose")
                || lower.contains("doesn't disclose")
                || lower.contains("does not expose")
                || lower.contains("doesn't expose")
                || lower.contains("not exploitable")
                || lower.contains("cannot be exploited")
                || lower.contains("is not exploitable")
                || lower.contains("this is safe")
                || lower.contains("code is safe")
                || lower.contains("is a false positive")
                || lower.contains("this is a false")
                || lower.contains("false positive")
                || lower.contains("no sensitive data")
                || lower.contains("no sensitive information");
    }

    private boolean isPathOnlyFalsePositiveEvidence(String falsePositiveEvidence, String reasoning) {
        String evidence = Optional.ofNullable(falsePositiveEvidence).orElse("").trim();
        if (evidence.isBlank()) {
            return false;
        }

        String lowerEvidence = evidence.toLowerCase(Locale.ROOT);

        // Match specific non-production path patterns, not general words like "example" or "documentation"
        boolean mentionsNonProductionPath = lowerEvidence.contains("docs_src")
                || lowerEvidence.contains("docs/")
                || lowerEvidence.contains("/docs")
                || lowerEvidence.contains("tutorial directory")
                || lowerEvidence.contains("tutorial code")
                || lowerEvidence.contains("example directory")
                || lowerEvidence.contains("example code")
                || lowerEvidence.contains("/examples/")
                || lowerEvidence.contains("test directory")
                || lowerEvidence.contains("tests/")
                || lowerEvidence.contains("/tests/")
                || lowerEvidence.contains("non-production path")
                || lowerEvidence.contains("non-production directory");

        // Match phrasing that indicates location-only reasoning, not code-based proof
        boolean pathOnlyLanguage = lowerEvidence.contains("located in")
                || lowerEvidence.contains("is in the")
                || lowerEvidence.contains("resides in")
                || lowerEvidence.contains("lives in")
                || lowerEvidence.contains("found in the")
                || lowerEvidence.contains("this directory")
                || lowerEvidence.contains("that directory")
                || lowerEvidence.contains("in this folder")
                || lowerEvidence.contains("file is part of");

        if (!mentionsNonProductionPath || !pathOnlyLanguage) {
            return false;
        }

        String combined = (evidence + " " + Optional.ofNullable(reasoning).orElse("")).toLowerCase(Locale.ROOT);
        boolean hasCodeBasedProof = combined.contains("guard")
                || combined.contains("if __name__")
                || combined.contains("@test")
                || combined.contains("assert")
                || combined.contains("mock")
                || combined.contains("safe api")
                || combined.contains("parameterized")
                || combined.contains("allow-list")
                || combined.contains("allowlist")
                || combined.contains("escaped")
                || combined.contains("encoded")
                || combined.contains("validated")
                || combined.contains("sanitized")
                || combined.contains("constant value")
                || combined.contains("not registered")
                || combined.contains("not mounted")
                || combined.contains("not imported")
                || combined.contains("never executed")
                || combined.contains("unreachable");

        return !hasCodeBasedProof;
    }

    /**
     * Returns true when the finding is an execution-sink injection type where the library rule applies:
     * EL injection, code/script injection, OS command injection, SSTI, or expression evaluation.
     * SQL injection is excluded here because the DB schema execution pattern (reading SQL from classpath)
     * is correctly classified as FALSE_POSITIVE even in library context.
     */
    private boolean isExecutionSinkVulnerability(Item item) {
        // Check CWE IDs: 917=EL Injection, 78=OS Cmd, 1336=SSTI always treat as execution sinks.
        // CWE-94/95 only when the shown code has a real eval/exec/compile/script-engine sink —
        // setattr / model-field wiring labeled "code generation" is not an execution sink.
        List<String> cweIds = item.getCweIds();
        if (cweIds != null) {
            for (String cwe : cweIds) {
                String normalized = Optional.ofNullable(cwe).orElse("")
                        .toUpperCase(Locale.ROOT).replace("CWE-", "").trim();
                if ("917".equals(normalized) || "78".equals(normalized) || "1336".equals(normalized)) {
                    return true;
                }
                if (("94".equals(normalized) || "95".equals(normalized))
                        && CodeInjectionSinkEvidence.hasRealExecutionSink(item)) {
                    return true;
                }
            }
        }
        // Fallback: check title keywords — code/eval injection titles require a real sink in code.
        String title = item.getTitle() == null ? "" : item.getTitle().toLowerCase(Locale.ROOT);
        if (title.contains("expression language")
                || title.contains("el injection")
                || title.contains("command injection")
                || title.contains("os command")
                || title.contains("ssti")
                || title.contains("template injection")) {
            return true;
        }
        if (title.contains("code injection")
                || title.contains("code generation")
                || title.contains("script injection")
                || title.contains("eval injection")) {
            return CodeInjectionSinkEvidence.hasRealExecutionSink(item);
        }
        return false;
    }

    /**
     * CWE-94/95 labeled as code generation/injection, but the shown code only assigns attributes
     * (setattr / __set__ / __dict__) with a fixed or internal name and no execution sink.
     * Language- and repo-agnostic: value origin does not matter.
     */
    private boolean hasNonExecutionCodeInjectionWiringEvidence(Item item, CodeContextExtractor.CodeContext context) {
        if (!CodeInjectionSinkEvidence.isCodeInjectionFinding(item)) {
            return false;
        }
        String extra = extraCodeForCodeInjection(item, context);
        return CodeInjectionSinkEvidence.isNonExecutionAttributeAssignment(item, extra)
                && !CodeInjectionSinkEvidence.isNameControlledMassAssignment(item, extra)
                && !CodeInjectionSinkEvidence.hasRealExecutionSink(item, extra);
    }

    private String extraCodeForCodeInjection(Item item, CodeContextExtractor.CodeContext context) {
        StringBuilder extra = new StringBuilder();
        if (item != null) {
            extra.append(Optional.ofNullable(item.getDescription()).orElse("")).append('\n');
        }
        if (context == null) {
            return extra.toString();
        }
        extra.append(Optional.ofNullable(context.functionBody()).orElse("")).append('\n');
        extra.append(Optional.ofNullable(context.localSnippet()).orElse("")).append('\n');
        extra.append(Optional.ofNullable(context.definitionContext()).orElse("")).append('\n');
        extra.append(Optional.ofNullable(context.callerContext()).orElse("")).append('\n');
        extra.append(Optional.ofNullable(context.crossFileCallerContext()).orElse("")).append('\n');
        if (context.relatedFiles() != null) {
            for (CodeContextExtractor.RelatedSnippet related : context.relatedFiles()) {
                if (related != null && related.snippet() != null) {
                    extra.append(related.snippet()).append('\n');
                }
            }
        }
        return extra.toString();
    }

    private boolean hasNaiveSocketConstructorEvidence(Item item) {
        return hasNaiveSocketConstructorEvidence(item, null);
    }

    private boolean hasNaiveSocketConstructorEvidence(Item item, CodeContextExtractor.CodeContext context) {
        if (!isNaiveSocketSslFinding(item)) {
            return false;
        }
        String combined = String.join(" ",
                Optional.ofNullable(item.getCodeExtract()).orElse(""),
                context == null ? "" : Optional.ofNullable(context.functionBody()).orElse(""),
                context == null ? "" : Optional.ofNullable(context.localSnippet()).orElse(""),
                context == null ? "" : Optional.ofNullable(context.definitionContext()).orElse(""),
                context == null ? "" : Optional.ofNullable(context.callerContext()).orElse(""),
                context == null ? "" : Optional.ofNullable(context.crossFileCallerContext()).orElse(""));
        return NAIVE_SOCKET_CONSTRUCTOR_PATTERN.matcher(combined).find();
    }

    private boolean hasMisconfigurationTruePositiveEvidence(Item item, CodeContextExtractor.CodeContext context,
                                                            SastRuleMetadata metadata) {
        if (!isMisconfigurationProfile(metadata)) {
            return false;
        }
        // Deterministic TP for modeled unsafe API/config patterns. Test/dev naming is never a neutralizer.
        return hasNaiveSocketConstructorEvidence(item, context)
                || hasPermissiveSslEvidence(item, context)
                || hasCookieSecurityMisconfigurationEvidence(item, context, metadata);
    }

    /**
     * Cookie flag findings (missing/false HttpOnly, Secure, SameSite) are misconfigurations:
     * once the scanner shows the cookie is set without the flag in non-test code, verdict is TRUE_POSITIVE
     * unless existing code proves the flag is set (or a framework guarantee does).
     */
    private boolean hasCookieSecurityMisconfigurationEvidence(Item item, CodeContextExtractor.CodeContext context,
                                                              SastRuleMetadata metadata) {
        if (metadata == null || metadata.family() != VulnerabilityFamily.COOKIE_SECURITY) {
            return false;
        }
        if (isTestOnlyCookiePath(item)) {
            return false;
        }
        String evidence = misconfigurationEvidenceText(item, context);
        if (citesCookieFlagNeutralizer(evidence)) {
            return false;
        }
        String combined = (Optional.ofNullable(item.getId()).orElse("")
                + " " + Optional.ofNullable(item.getTitle()).orElse("")
                + " " + evidence).toLowerCase(Locale.ROOT);
        return combined.contains("cookie")
                || combined.contains("httponly")
                || combined.contains("samesite")
                || combined.contains("same-site");
    }

    private boolean isTestOnlyCookiePath(Item item) {
        if (item == null) {
            return false;
        }
        String path = Optional.ofNullable(item.getFilename()).orElse(
                Optional.ofNullable(item.getFullFilename()).orElse("")).replace('\\', '/').toLowerCase(Locale.ROOT);
        return path.contains("/test/") || path.contains("/tests/") || path.contains("/spec/")
                || path.contains("/__tests__/") || path.contains("/test\\") || path.contains("src/test/")
                || path.endsWith("_test.go") || path.endsWith("_test.py") || path.contains("/test_")
                || path.endsWith(".spec.js") || path.endsWith(".spec.ts") || path.endsWith("_spec.rb");
    }

    private boolean citesCookieFlagNeutralizer(String evidence) {
        String text = Optional.ofNullable(evidence).orElse("");
        if (text.isBlank()) {
            return false;
        }
        String lower = text.toLowerCase(Locale.ROOT);
        return COOKIE_FLAG_NEUTRALIZER_PATTERN.matcher(lower).find()
                || (lower.contains("framework guarantee")
                    && (lower.contains("httponly") || lower.contains("secure") || lower.contains("samesite")));
    }

    private boolean hasPermissiveSslEvidence(Item item, CodeContextExtractor.CodeContext context) {
        if (!isSslHostnameVerifierFinding(item) && !isPermissiveSslTitle(item)) {
            return false;
        }
        String combined = misconfigurationEvidenceText(item, context);
        return PERMISSIVE_SSL_EVIDENCE_PATTERN.matcher(combined).find()
                || combined.toLowerCase(Locale.ROOT).contains("trustallcerts")
                || combined.toLowerCase(Locale.ROOT).contains("trust all")
                || combined.toLowerCase(Locale.ROOT).contains("hostname verifier");
    }

    private boolean isPermissiveSslTitle(Item item) {
        if (item == null) {
            return false;
        }
        String combined = (Optional.ofNullable(item.getId()).orElse("")
                + " " + Optional.ofNullable(item.getTitle()).orElse("")).toLowerCase(Locale.ROOT);
        return combined.contains("hostname verifier")
                || combined.contains("trust manager")
                || combined.contains("certificate verification")
                || combined.contains("ssl verification");
    }

    private String misconfigurationEvidenceText(Item item, CodeContextExtractor.CodeContext context) {
        return String.join(" ",
                Optional.ofNullable(item.getCodeExtract()).orElse(""),
                Optional.ofNullable(item.getTitle()).orElse(""),
                context == null ? "" : Optional.ofNullable(context.functionBody()).orElse(""),
                context == null ? "" : Optional.ofNullable(context.localSnippet()).orElse(""),
                context == null ? "" : Optional.ofNullable(context.definitionContext()).orElse(""),
                context == null ? "" : Optional.ofNullable(context.callerContext()).orElse(""),
                context == null ? "" : Optional.ofNullable(context.crossFileCallerContext()).orElse(""));
    }

    private String misconfigurationTruePositiveReason(Item item, SastRuleMetadata metadata) {
        if (hasNaiveSocketConstructorEvidence(item)) {
            return naiveSocketTruePositiveReason();
        }
        if (hasPermissiveSslEvidence(item, null) || isSslHostnameVerifierFinding(item)) {
            return "MISCONFIGURATION SSL/TLS finding: permissive trust manager, hostname-verifier bypass, or disabled "
                    + "certificate verification is shown in existing code. Test/dev/demo/mock naming, localhost, "
                    + "config-file origin, and path hints are not neutralizers. Without a proven safe TLS/SSL "
                    + "configuration or equivalent wrapper, the verdict is TRUE_POSITIVE.";
        }
        if (metadata != null && metadata.family() == VulnerabilityFamily.COOKIE_SECURITY) {
            return "COOKIE_SECURITY misconfiguration: the cookie is set without the required Secure/HttpOnly/SameSite "
                    + "protection in non-test code. Cookie sensitivity is not required. Without proven language/"
                    + "framework flag enablement (HttpOnly/Secure/SameSite), a framework guarantee, or a test-only "
                    + "path, the verdict is TRUE_POSITIVE.";
        }
        String profile = metadata == null ? "MISCONFIGURATION" : metadata.promptProfile().name();
        return profile + " findings are configuration/API-usage findings, not classic taint findings. "
                + "The unsafe API or configuration is shown in existing code and no safe wrapper, framework guarantee, "
                + "or rule-specific neutralizer is proven. Test/dev naming or path hints are not false-positive evidence.";
    }

    private String misconfigurationRecommendation(Item item) {
        if (isNaiveSocketSslFinding(item)) {
            return naiveSocketRecommendation();
        }
        if (isCookieSecurityFinding(item)) {
            return "Enable the missing cookie flag(s) HttpOnly, Secure, and/or SameSite using the idiomatic "
                    + "API for this language/framework before sending the cookie.";
        }
        return "Use a safe configuration or framework-supported secure wrapper for this API/configuration, "
                + "and document the rule-specific safety guarantee in code.";
    }

    private String misconfigurationRemediationCode(Item item) {
        if (isNaiveSocketSslFinding(item)) {
            return naiveSocketRemediationCode(item);
        }
        if (isCookieSecurityFinding(item)) {
            return cookieRemediationCode(item);
        }
        return wrapWithFlaggedExtract(item,
                "Cannot provide a safe code snippet: The finding is a misconfiguration/API-usage issue, "
                        + "but the scanner context did not identify a precise rule-specific replacement. "
                        + "Adapt a secure configuration/API at the flagged call site above.");
    }

    private boolean isCookieSecurityFinding(Item item) {
        if (item == null) {
            return false;
        }
        String combined = (Optional.ofNullable(item.getId()).orElse("")
                + " " + Optional.ofNullable(item.getTitle()).orElse("")).toLowerCase(Locale.ROOT);
        return combined.contains("cookie") || combined.contains("httponly") || combined.contains("samesite");
    }

    private boolean isJwtVerificationBypassFinding(Item item, SastRuleMetadata metadata) {
        if (metadata != null && metadata.cweIds() != null
                && metadata.cweIds().stream().anyMatch(cwe -> {
            String n = cwe == null ? "" : cwe.toUpperCase(Locale.ROOT).replace("CWE-", "").trim();
            return "347".equals(n) || "353".equals(n);
        })) {
            String extract = flaggedCodeExtract(item).toLowerCase(Locale.ROOT);
            String combined = jwtFindingText(item);
            if (combined.contains("jwt") || combined.contains("verify_signature")
                    || extract.contains("jwt.decode") || extract.contains("jwtdecode")
                    || extract.contains("verify_signature")) {
                return true;
            }
        }
        String combined = jwtFindingText(item);
        return combined.contains("jwt_verification_bypass")
                || combined.contains("jwt verification")
                || (combined.contains("jwt") && (combined.contains("verify_signature")
                || combined.contains("signature") || combined.contains("unsigned")))
                || flaggedCodeExtract(item).toLowerCase(Locale.ROOT).contains("verify_signature");
    }

    private String jwtFindingText(Item item) {
        return (Optional.ofNullable(item == null ? null : item.getId()).orElse("")
                + " " + Optional.ofNullable(item == null ? null : item.getTitle()).orElse("")
                + " " + Optional.ofNullable(item == null ? null : item.getDescription()).orElse("")
                + " " + flaggedCodeExtract(item)).toLowerCase(Locale.ROOT);
    }

    /**
     * True when remediation only drops verify_signature=False (or similar) without supplying
     * a signing key and algorithms allowlist — e.g. bare jwt.decode(token).
     */
    boolean looksLikeWeakJwtRemediation(String remediationCode) {
        return JwtVerificationRemediation.looksLikeWeakRemediation(remediationCode);
    }

    boolean looksLikeWeakJwtRecommendation(String recommendation) {
        return JwtVerificationRemediation.looksLikeWeakRecommendation(recommendation);
    }

    private String jwtVerificationRecommendation(Item item) {
        return JwtVerificationRemediation.recommendation();
    }

    private String jwtVerificationRemediationCode(Item item) {
        return wrapWithFlaggedExtract(item,
                JwtVerificationRemediation.remediationCode(inferFindingLanguage(item), flaggedCodeExtract(item)));
    }

    private String inferFindingLanguage(Item item) {
        if (item == null) {
            return "unknown";
        }
        String path = Optional.ofNullable(item.getFullFilename()).orElse(
                Optional.ofNullable(item.getFilename()).orElse(""));
        String language = codeContextExtractor.detectLanguage(path);
        if (language != null && !"unknown".equals(language)) {
            return language;
        }
        String ruleId = Optional.ofNullable(item.getId()).orElse("").toLowerCase(Locale.ROOT);
        if (ruleId.startsWith("java_")) return "java";
        if (ruleId.startsWith("javascript_") || ruleId.startsWith("js_")) return "javascript";
        if (ruleId.startsWith("typescript_") || ruleId.startsWith("ts_")) return "typescript";
        if (ruleId.startsWith("python_") || ruleId.startsWith("py_")) return "python";
        if (ruleId.startsWith("go_") || ruleId.startsWith("golang_")) return "go";
        if (ruleId.startsWith("php_")) return "php";
        if (ruleId.startsWith("ruby_") || ruleId.startsWith("rails_")) return "ruby";
        if (ruleId.startsWith("csharp_") || ruleId.startsWith("dotnet_")) return "csharp";
        if (ruleId.startsWith("kotlin_")) return "kotlin";
        if (ruleId.startsWith("rust_")) return "rust";
        return "unknown";
    }

    private String cookieRemediationCode(Item item) {
        String fix = switch (inferFindingLanguage(item)) {
            case "javascript", "typescript" ->
                    "res.cookie('name', value, { httpOnly: true, secure: true, sameSite: 'lax' });";
            case "python" ->
                    "response.set_cookie('name', value, httponly=True, secure=True, samesite='Lax')\n"
                            + "# Django settings alternative:\n"
                            + "# SESSION_COOKIE_HTTPONLY = True\n"
                            + "# SESSION_COOKIE_SECURE = True";
            case "go" ->
                    "http.SetCookie(w, &http.Cookie{\n"
                            + "    Name:     \"name\",\n"
                            + "    Value:    value,\n"
                            + "    HttpOnly: true,\n"
                            + "    Secure:   true,\n"
                            + "    SameSite: http.SameSiteLaxMode,\n"
                            + "})";
            case "php" ->
                    "setcookie('name', $value, [\n"
                            + "    'httponly' => true,\n"
                            + "    'secure' => true,\n"
                            + "    'samesite' => 'Lax',\n"
                            + "]);";
            case "ruby" ->
                    "cookies['name'] = { value: value, httponly: true, secure: true, same_site: :lax }";
            case "csharp" ->
                    "Response.Cookies.Append(\"name\", value, new CookieOptions {\n"
                            + "    HttpOnly = true,\n"
                            + "    Secure = true,\n"
                            + "    SameSite = SameSiteMode.Lax\n"
                            + "});";
            default ->
                    "Cookie cookie = new Cookie(name, value);\n"
                            + "cookie.setHttpOnly(true);\n"
                            + "cookie.setSecure(true);\n"
                            + "cookie.setAttribute(\"SameSite\", \"Lax\"); // or Strict\n"
                            + "response.addCookie(cookie);";
        };
        return wrapWithFlaggedExtract(item, fix);
    }

    private String sqlInjectionRecommendation(Item item) {
        String extract = Optional.ofNullable(item == null ? null : item.getCodeExtract()).orElse("");
        String lower = extract.toLowerCase(Locale.ROOT);
        if (looksLikeUnboundSqlShape(lower)) {
            return "Do not concatenate or interpolate untrusted data into SQL. "
                    + "Bind VALUES with parameterized/prepared APIs; allowlist or strictly validate any dynamic "
                    + "identifiers or SQL fragments that cannot be bound, then call the same sink.";
        }
        return "Use a parameterized/prepared query or a complete allowlist for the SQL value; "
                + "do not concatenate or interpolate untrusted string input into SQL.";
    }

    private String sqlInjectionRemediationCode(Item item) {
        String contextual = contextualSqlRemediationCode(item);
        if (contextual != null && !contextual.isBlank()) {
            return contextual;
        }
        return universalSqlRemediationTemplate(inferFindingLanguage(item), null);
    }

    /**
     * Universal remediation anchored to the flagged extract: echo the unsafe call site and
     * describe the language-appropriate fix pattern without inventing an unrelated query.
     */
    private String contextualSqlRemediationCode(Item item) {
        if (item == null) {
            return null;
        }
        String extract = Optional.ofNullable(item.getCodeExtract()).orElse("").trim();
        if (extract.isBlank()) {
            return null;
        }
        return universalSqlRemediationTemplate(inferFindingLanguage(item), extract);
    }

    private String universalSqlRemediationTemplate(String language, String flaggedExtract) {
        String c = codeCommentPrefix(language);
        StringBuilder sb = new StringBuilder();
        if (flaggedExtract != null && !flaggedExtract.isBlank()) {
            sb.append(c).append(" Flagged (unsafe):\n");
            sb.append(flaggedExtract.trim()).append('\n');
        }
        sb.append(c).append(" Fix (adapt to this call site — same variables/sink, do not invent a different query):\n");
        sb.append(c).append(" 1) Keep SQL text constant; bind every former concatenated/interpolated VALUE.\n");
        sb.append(c).append(" 2) If the dynamic part is an identifier or SQL fragment (DDL, object name, AS <sql>), ");
        sb.append("allowlist/validate it — placeholders usually cannot bind those.\n");
        sb.append(c).append(" 3) Call the same sink only with constant SQL + binders, or with validated fragments.\n");
        switch (language == null ? "" : language) {
            case "python" -> sb.append("cursor.execute(CONSTANT_SQL_WITH_PLACEHOLDERS, (value,))");
            case "javascript", "typescript" ->
                    sb.append("await pool.query(CONSTANT_SQL_WITH_PLACEHOLDERS, [value]);");
            case "go" -> sb.append("db.Query(CONSTANT_SQL_WITH_PLACEHOLDERS, value)");
            case "php" -> sb.append("$stmt = $pdo->prepare(CONSTANT_SQL_WITH_PLACEHOLDERS);\n")
                    .append("$stmt->execute([$value]);");
            case "ruby" -> sb.append("connection.exec_params(CONSTANT_SQL_WITH_PLACEHOLDERS, [value])");
            case "csharp" -> sb.append("cmd.CommandText = CONSTANT_SQL_WITH_PLACEHOLDERS;\n")
                    .append("cmd.Parameters.AddWithValue(\"@p\", value);");
            default -> sb.append("PreparedStatement ps = connection.prepareStatement(CONSTANT_SQL_WITH_PLACEHOLDERS);\n")
                    .append("ps.setObject(1, value); // bind former concatenated values\n")
                    .append("// use ps.executeQuery()/executeUpdate() instead of Statement + concatenated SQL");
        }
        return sb.toString();
    }

    /** Anchor a fix snippet to the finding's flagged extract whenever available. */
    private String wrapWithFlaggedExtract(Item item, String fixSnippet) {
        String fix = fixSnippet == null ? "" : fixSnippet.trim();
        String extract = flaggedCodeExtract(item);
        if (extract.isBlank()) {
            return fix;
        }
        if (fix.toLowerCase(Locale.ROOT).contains("flagged (unsafe)")) {
            return fix;
        }
        String c = codeCommentPrefix(inferFindingLanguage(item));
        return c + " Flagged (unsafe):\n"
                + extract + "\n"
                + c + " Fix (adapt to this call site — same variables/sink):\n"
                + fix;
    }

    private String flaggedCodeExtract(Item item) {
        return Optional.ofNullable(item == null ? null : item.getCodeExtract()).orElse("").trim();
    }

    private static String codeCommentPrefix(String language) {
        return switch (language == null ? "" : language) {
            case "python", "ruby" -> "#";
            default -> "//";
        };
    }

    /**
     * True when remediation looks like a generic textbook snippet that does not reuse
     * identifiers from the flagged extract (when an extract exists).
     */
    private boolean looksLikeGenericUnanchoredRemediation(String remediationCode, Item item) {
        if (remediationCode == null || remediationCode.isBlank()) {
            return false;
        }
        String lower = remediationCode.toLowerCase(Locale.ROOT);
        if (lower.contains("flagged (unsafe)")) {
            return false;
        }
        String extract = flaggedCodeExtract(item);
        if (extract.isBlank()) {
            return lower.contains("expected, actual")
                    || lower.contains("messagedigest.isequal(expected")
                    || (lower.contains("res.cookie('name'") || lower.contains("res.cookie(\"name\""));
        }
        Set<String> extractIds = significantIdentifiers(extract);
        if (extractIds.isEmpty()) {
            return false;
        }
        Set<String> remIds = significantIdentifiers(remediationCode);
        boolean sharesIdentifier = remIds.stream().anyMatch(extractIds::contains);
        boolean placeholderOnly = (lower.contains("expected") && lower.contains("actual"))
                || lower.contains("serialized_data")
                || lower.contains("serializeddata")
                || lower.contains("cookie('name'")
                || lower.contains("cookie(\"name\"")
                || lower.contains("messagedigest.isequal(expected");
        return !sharesIdentifier && placeholderOnly;
    }

    private Set<String> significantIdentifiers(String code) {
        Set<String> ids = new LinkedHashSet<>();
        if (code == null || code.isBlank()) {
            return ids;
        }
        java.util.regex.Matcher m = Pattern.compile("\\b([A-Za-z_][A-Za-z0-9_]{2,})\\b").matcher(code);
        Set<String> stop = Set.of(
                "if", "for", "var", "let", "const", "new", "return", "true", "false", "null", "this",
                "string", "number", "boolean", "object", "undefined", "function", "import", "from",
                "class", "public", "private", "static", "void", "int", "long", "byte",
                "flagged", "unsafe", "fix", "adapt", "same", "variables", "sink", "call", "site",
                "buffer", "crypto", "messagedigest", "equals", "typeof", "length");
        while (m.find()) {
            String id = m.group(1);
            if (!stop.contains(id.toLowerCase(Locale.ROOT))) {
                ids.add(id.toLowerCase(Locale.ROOT));
            }
        }
        return ids;
    }

    private boolean looksLikeUnboundSqlShape(String lowerExtract) {
        if (lowerExtract == null || lowerExtract.isBlank()) {
            return false;
        }
        return lowerExtract.contains("tostring()")
                || lowerExtract.contains("stringbuilder")
                || lowerExtract.contains("stringbuffer")
                || lowerExtract.contains("append(")
                || lowerExtract.contains("create ")
                || lowerExtract.contains("drop ")
                || lowerExtract.contains("alter ")
                || lowerExtract.contains("executeupdate")
                || lowerExtract.contains("execute(");
    }

    private boolean looksLikeGenericSqlRemediation(String remediationCode) {
        if (remediationCode == null || remediationCode.isBlank()) {
            return false;
        }
        String lower = remediationCode.toLowerCase(Locale.ROOT);
        boolean inventsUnrelatedQuery = (lower.contains("username") && lower.contains("password"))
                || lower.contains("where username = ?")
                || lower.contains("select ... where username");
        boolean missingFlaggedAnchor = !lower.contains("flagged")
                && !lower.contains("constant_sql_with_placeholders");
        return inventsUnrelatedQuery
                || (missingFlaggedAnchor && lower.contains("select ... where") && !lower.contains("constant_sql"));
    }

    private boolean looksLikeGenericSqlRecommendation(String recommendation) {
        if (recommendation == null || recommendation.isBlank()) {
            return false;
        }
        String lower = recommendation.toLowerCase(Locale.ROOT);
        return lower.contains("do not concatenate raw gui, http, file, or url input into sql");
    }

    /** True when remediation_code is narrative advice rather than a code snippet. */
    private boolean looksLikeProseRemediation(String remediationCode) {
        if (remediationCode == null || remediationCode.isBlank()) {
            return true;
        }
        String trimmed = remediationCode.trim();
        if (trimmed.contains("\n") || trimmed.contains(";") || trimmed.contains(" = ")) {
            return false;
        }
        String lower = trimmed.toLowerCase(Locale.ROOT);
        return lower.startsWith("use ")
                || lower.startsWith("avoid ")
                || lower.startsWith("prefer ")
                || lower.contains("do not pickle")
                || lower.contains("safe parser");
    }

    /** Language-specific remediation snippet (code only) for unsafe deserialization. */
    private String deserializationRemediationCode(Item item) {
        String extract = Optional.ofNullable(item == null ? null : item.getCodeExtract())
                .orElse("").toLowerCase(Locale.ROOT);
        boolean pickle = extract.contains("pickle.load") || extract.contains("pickle.loads");
        boolean yaml = extract.contains("yaml.load(");
        String fix = switch (inferFindingLanguage(item)) {
            case "python" -> {
                if (yaml) {
                    yield "import yaml\n"
                            + "data = yaml.safe_load(serialized_data)  # not yaml.load(...)";
                }
                if (pickle) {
                    yield "import json\n"
                            + "import hmac\n"
                            + "import hashlib\n"
                            + "\n"
                            + "# Prefer a safe format instead of pickle.loads(...):\n"
                            + "data = json.loads(serialized_data)\n"
                            + "\n"
                            + "# If you must keep a binary blob, verify integrity first:\n"
                            + "# mac = hmac.new(secret_key, serialized_data, hashlib.sha256).digest()\n"
                            + "# if not hmac.compare_digest(mac, expected_mac):\n"
                            + "#     raise ValueError('tampered payload')";
                }
                yield "import json\n"
                        + "data = json.loads(serialized_data)  # avoid pickle/marshal/yaml.load on untrusted bytes";
            }
            case "javascript", "typescript" ->
                    "// Prefer JSON over node-serialize / unserialize / YAML load:\n"
                            + "const data = JSON.parse(serializedData);\n"
                            + "// If integrity is required:\n"
                            + "// const ok = crypto.timingSafeEqual(hmac, expectedHmac);\n"
                            + "// if (!ok) throw new Error('tampered payload');";
            case "php" ->
                    "// Prefer json_decode over unserialize on untrusted input:\n"
                            + "$data = json_decode($serialized, true, 512, JSON_THROW_ON_ERROR);\n"
                            + "// If unserialize is unavoidable, restrict allowed classes:\n"
                            + "// $data = unserialize($serialized, ['allowed_classes' => [MyDto::class]]);";
            case "ruby" ->
                    "# Prefer JSON over Marshal/YAML.load:\n"
                            + "data = JSON.parse(serialized_data)\n"
                            + "# YAML: Psych.safe_load(serialized_data, permitted_classes: [Hash, Array, String])";
            case "csharp" ->
                    "// Prefer System.Text.Json over BinaryFormatter / insecure TypeNameHandling:\n"
                            + "var data = JsonSerializer.Deserialize<MyDto>(serializedData);\n"
                            + "// Do not use BinaryFormatter or TypeNameHandling.All on untrusted input.";
            case "go" ->
                    "// Prefer encoding/json over gob for untrusted input:\n"
                            + "var data MyDto\n"
                            + "if err := json.Unmarshal(serialized, &data); err != nil {\n"
                            + "    return err\n"
                            + "}";
            default ->
                    "// Prefer a data-only format (JSON) or an allowlisted ObjectInputFilter:\n"
                            + "ObjectInputFilter filter = ObjectInputFilter.Config.createFilter(\"com.example.dto.*;!*\");\n"
                            + "ois.setObjectInputFilter(filter);\n"
                            + "MyDto data = (MyDto) ois.readObject();\n"
                            + "// Better: MyDto data = objectMapper.readValue(bytes, MyDto.class);";
        };
        return wrapWithFlaggedExtract(item, fix);
    }

    private boolean isNaiveSocketSslFinding(Item item) {
        if (item == null) {
            return false;
        }
        String ruleId = Optional.ofNullable(item.getId()).orElse("").toLowerCase(Locale.ROOT);
        if ("java_lang_socket_init".equals(ruleId)) {
            return true;
        }
        String title = Optional.ofNullable(item.getTitle()).orElse("").toLowerCase(Locale.ROOT);
        List<String> cweIds = item.getCweIds() == null ? List.of() : item.getCweIds();
        boolean cwe319 = cweIds.stream()
                .filter(Objects::nonNull)
                .map(cwe -> cwe.toUpperCase(Locale.ROOT).replace("CWE-", "").trim())
                .anyMatch("319"::equals);
        return cwe319 && title.contains("naive socket") && title.contains("ssl socket");
    }

    private String naiveSocketTruePositiveReason() {
        return "CWE-319 java_lang_socket_init is a deterministic transport-security rule: the existing code uses "
                + "`new Socket(...)` instead of `SSLSocketFactory.createSocket(...)` or `SSLSocket`. "
                + "This rule does not require attacker-controlled host or port input; configuration-file origin, "
                + "local address, library context, or unknown caller origin does not make the plain socket usage uncertain.";
    }

    private String naiveSocketRecommendation() {
        return "Use `SSLSocketFactory.createSocket(...)` or an equivalent TLS-enforcing socket wrapper instead of "
                + "instantiating `java.net.Socket` directly for this connection.";
    }

    private String naiveSocketRemediationCode(Item item) {
        return wrapWithFlaggedExtract(item,
                "SSLSocketFactory socketFactory = (SSLSocketFactory) SSLSocketFactory.getDefault();\n"
                        + "try (SSLSocket socket = (SSLSocket) socketFactory.createSocket(host, port)) {\n"
                        + "    socket.startHandshake();\n"
                        + "    // Use the TLS socket connection here.\n"
                        + "}");
    }

    private boolean isSqlInjectionFinding(Item item) {
        String combined = (Optional.ofNullable(item.getId()).orElse("")
                + " " + Optional.ofNullable(item.getTitle()).orElse("")
                + " " + Optional.ofNullable(item.getDescription()).orElse("")
                + " " + Optional.ofNullable(item.getCodeExtract()).orElse(""))
                .toLowerCase(Locale.ROOT);
        if (combined.contains("sql_injection")
                || combined.contains("sql injection")
                || combined.contains("sqli")
                || combined.contains("cwe-89")
                || combined.contains("cwe 89")
                || (combined.contains("sql query")
                    && (combined.contains("unsanitized") || combined.contains("external input")))) {
            return true;
        }
        List<String> cweIds = item.getCweIds();
        return cweIds != null
                && cweIds.stream().anyMatch(cwe -> "89".equals(cwe) || "CWE-89".equalsIgnoreCase(cwe));
    }
    
    private boolean isSslHostnameVerifierFinding(Item item) {
        String ruleId = Optional.ofNullable(item.getId()).orElse("").toLowerCase(Locale.ROOT);
        String title = Optional.ofNullable(item.getTitle()).orElse("").toLowerCase(Locale.ROOT);
        String combined = ruleId + " " + title;
        if (combined.contains("ssl") || combined.contains("tls") || combined.contains("hostname")
                || combined.contains("certificate") || combined.contains("trust")) {
            List<String> cweIds = item.getCweIds();
            if (cweIds != null && cweIds.stream().anyMatch(cwe -> "295".equals(cwe) || "CWE-295".equalsIgnoreCase(cwe) 
                    || "297".equals(cwe) || "CWE-297".equalsIgnoreCase(cwe))) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Returns true when FALSE_POSITIVE/UNCERTAIN evidence for a MISCONFIGURATION finding is based only on
     * test/dev/demo/mock naming or path hints rather than a real safety neutralizer.
     * Avoids matching incidental prose such as "for example".
     */
    private boolean isTestNamingOnlyMisconfigurationFalsePositive(String falsePositiveEvidence, String reasoning) {
        String combined = ((falsePositiveEvidence == null ? "" : falsePositiveEvidence) + " "
                + (reasoning == null ? "" : reasoning)).toLowerCase(Locale.ROOT);
        if (combined.isBlank()) {
            return false;
        }
        boolean citesNamingOrPath = Pattern.compile(
                "\\b(?:test[_/-]?only|test[_/-]?development|development\\s+scope|development\\s+context|"
                        + "test\\s+scope|test\\s+context|variable/?method\\s+naming|naming\\s+indicates|"
                        + "demo|mock|stub|sample|dummy|debug|localhost|non-production|path\\s+hint)\\b"
                        + "|\\bdev\\b",
                Pattern.CASE_INSENSITIVE).matcher(combined).find();
        return citesNamingOrPath && !citesRealMisconfigurationNeutralizer(falsePositiveEvidence, reasoning);
    }

    private boolean citesRealMisconfigurationNeutralizer(String falsePositiveEvidence, String reasoning) {
        String combined = ((falsePositiveEvidence == null ? "" : falsePositiveEvidence) + " "
                + (reasoning == null ? "" : reasoning)).toLowerCase(Locale.ROOT);
        if (combined.isBlank()) {
            return false;
        }
        return combined.contains("sslsocket")
                || combined.contains("sslcontext.getdefault")
                || combined.contains("trust store")
                || combined.contains("truststore")
                || combined.contains("safe wrapper")
                || combined.contains("secure wrapper")
                || combined.contains("hostname verification is enabled")
                || combined.contains("certificate verification is enabled")
                || combined.contains("defaulttrustmanager")
                || combined.contains("pkix")
                || combined.contains("framework guarantee")
                || combined.contains("enforces tls")
                || combined.contains("tls is enforced")
                || combined.contains("uses httpsurlconnection with default")
                || citesCookieFlagNeutralizer(combined);
    }

    private boolean applyDeterministicContextNormalizations(Item item, CodeContextExtractor.CodeContext context,
                                                           List<Map<String, Object>> reactMessages,
                                                           String itemRef, SastRuleMetadata metadata,
                                                           FindingEvidence evidence) {
        if (hasMisconfigurationTruePositiveEvidence(item, context, metadata)) {
            if ("TRUE_POSITIVE".equals(item.getAiVerdict()) && item.getAiConfidence() != null
                    && item.getAiConfidence() >= 0.90d) {
                log.debug("[SastVerification] Skipping normalization for {} - already TRUE_POSITIVE with high confidence", itemRef);
                return false;
            }

            String previousVerdict = item.getAiVerdict();
            double previousConfidence = item.getAiConfidence() == null ? 0.0d : item.getAiConfidence();
            item.setAiVerdict("TRUE_POSITIVE");
            item.setAiConfidence(Math.max(previousConfidence, 0.90d));
            item.setAiRecommendation(formatRecommendation(misconfigurationRecommendation(item),
                    misconfigurationRemediationCode(item)));
            item.setAiReasoning(appendNormalizationReason(item.getAiReasoning(),
                    misconfigurationTruePositiveReason(item, metadata)));
            log.warn("[SastVerification] Deterministic context normalized {} from {} ({}) to TRUE_POSITIVE ({}) "
                            + "because MISCONFIGURATION evidence shows unsafe API/configuration",
                    itemRef,
                    previousVerdict,
                    String.format(Locale.ROOT, "%.2f", previousConfidence),
                    String.format(Locale.ROOT, "%.2f", item.getAiConfidence()));
            return true;
        }

        if (isPathTraversalFinding(item, metadata)
                && hasMultipartTempPathEvidence(item, context, item.getAiReasoning())
                && (!"FALSE_POSITIVE".equals(item.getAiVerdict())
                || item.getAiConfidence() == null
                || item.getAiConfidence() < 0.90d)) {
            String previousVerdict = item.getAiVerdict();
            double previousConfidence = item.getAiConfidence() == null ? 0.0d : item.getAiConfidence();
            item.setAiVerdict("FALSE_POSITIVE");
            item.setAiConfidence(Math.max(previousConfidence, 0.90d));
            item.setAiRecommendation(null);
            item.setAiReasoning(appendNormalizationReason(item.getAiReasoning(),
                    "Path traversal taints the path string, not uploaded bytes. The sink reads a "
                            + "multipart-parser temp path (file.filepath / tmp_name / temporary_file_path / "
                            + "tempfile.path), which is server-generated. Deterministic FALSE_POSITIVE."));
            log.warn("[SastVerification] Deterministic context normalized {} from {} ({}) to FALSE_POSITIVE ({}) "
                            + "because multipart parser temp-path is not a user-controlled path",
                    itemRef, previousVerdict,
                    String.format(Locale.ROOT, "%.2f", previousConfidence),
                    String.format(Locale.ROOT, "%.2f", item.getAiConfidence()));
            return true;
        }

        // CWE-94/95 setattr / attribute wiring: leave the verdict to the model (prompt + evidence, not a forced FP).

        // CWE-330/338 weak PRNG: sleep/jitter/scheduling/fake-data → FP (not token/key generation)
        if (isInsufficientRandomFinding(item, metadata)) {
            String purposeHint = evidence != null && evidence.attributes() != null
                    ? evidence.attributes().getOrDefault("security_purpose_hint", "unknown")
                    : "unknown";
            boolean nonSecurity = "non_security".equals(purposeHint)
                    || "possibly_non_security".equals(purposeHint)
                    || hasNonSecurityRandomUseEvidence(item, context, item.getAiReasoning());
            if (nonSecurity
                    && (!"FALSE_POSITIVE".equals(item.getAiVerdict())
                    || item.getAiConfidence() == null
                    || item.getAiConfidence() < 0.85d)) {
                String previousVerdict = item.getAiVerdict();
                double previousConfidence = item.getAiConfidence() == null ? 0.0d : item.getAiConfidence();
                item.setAiVerdict("FALSE_POSITIVE");
                item.setAiConfidence(Math.max(previousConfidence, 0.85d));
                item.setAiRecommendation(null);
                item.setAiReasoning(appendNormalizationReason(item.getAiReasoning(),
                        "CWE-330/338 requires predictable PRNG output used for security-sensitive values. "
                                + "The shown use is non-security (sleep/jitter/scheduling/sampling/fake data). "
                                + "Deterministic FALSE_POSITIVE."));
                log.warn("[SastVerification] Deterministic context normalized {} from {} ({}) to FALSE_POSITIVE ({}) "
                                + "because non-security weak-PRNG use",
                        itemRef, previousVerdict,
                        String.format(Locale.ROOT, "%.2f", previousConfidence),
                        String.format(Locale.ROOT, "%.2f", item.getAiConfidence()));
                return true;
            }
        }

        // Weak hash (MD5/SHA-1): cache key / fingerprint / checksum → FP; password/token → leave/TP path
        if (isWeakHashFinding(item, Optional.ofNullable(item.getCodeExtract()).orElse(""))
                && hasNonSecurityWeakHashEvidence(item, context, evidence)
                && (!"FALSE_POSITIVE".equals(item.getAiVerdict())
                || item.getAiConfidence() == null
                || item.getAiConfidence() < 0.85d)) {
            String previousVerdict = item.getAiVerdict();
            double previousConfidence = item.getAiConfidence() == null ? 0.0d : item.getAiConfidence();
            item.setAiVerdict("FALSE_POSITIVE");
            item.setAiConfidence(Math.max(previousConfidence, 0.85d));
            item.setAiRecommendation(null);
            item.setAiReasoning(appendNormalizationReason(item.getAiReasoning(),
                    "MD5/SHA-1 used for non-security purposes (cache key, fingerprint, checksum, etag) is "
                            + "FALSE_POSITIVE. Deterministic FALSE_POSITIVE."));
            log.warn("[SastVerification] Deterministic context normalized {} from {} ({}) to FALSE_POSITIVE ({}) "
                            + "because non-security weak-hash use",
                    itemRef, previousVerdict,
                    String.format(Locale.ROOT, "%.2f", previousConfidence),
                    String.format(Locale.ROOT, "%.2f", item.getAiConfidence()));
            return true;
        }

        // JWT claim-peek helper + verified decode on auth path → FP
        if (isJwtVerificationBypassFinding(item, metadata)
                && looksLikeJwtClaimPeekWithVerifiedAuthPath(item, context)
                && (!"FALSE_POSITIVE".equals(item.getAiVerdict())
                || item.getAiConfidence() == null
                || item.getAiConfidence() < 0.85d)) {
            String previousVerdict = item.getAiVerdict();
            double previousConfidence = item.getAiConfidence() == null ? 0.0d : item.getAiConfidence();
            item.setAiVerdict("FALSE_POSITIVE");
            item.setAiConfidence(Math.max(previousConfidence, 0.85d));
            item.setAiRecommendation(null);
            item.setAiReasoning(appendNormalizationReason(item.getAiReasoning(),
                    "JWT decode with signature verification disabled is used only to peek claims "
                            + "(owner/type/issuer classification), and a separate verifying decode gates auth. "
                            + "Deterministic FALSE_POSITIVE."));
            log.warn("[SastVerification] Deterministic context normalized {} from {} ({}) to FALSE_POSITIVE ({}) "
                            + "because JWT claim-peek with verified auth path",
                    itemRef, previousVerdict,
                    String.format(Locale.ROOT, "%.2f", previousConfidence),
                    String.format(Locale.ROOT, "%.2f", item.getAiConfidence()));
            return true;
        }

        // Exception/log leak: generic ValidationError / same-user validation feedback → FP
        if (isLoggingOrExceptionLeakFinding(item, metadata)
                && (hasNonSensitiveExceptionLeakEvidence(item, evidence)
                || hasSameUserValidationFeedbackEvidence(item, evidence))
                && (!"FALSE_POSITIVE".equals(item.getAiVerdict())
                || item.getAiConfidence() == null
                || item.getAiConfidence() < 0.85d)) {
            String previousVerdict = item.getAiVerdict();
            double previousConfidence = item.getAiConfidence() == null ? 0.0d : item.getAiConfidence();
            item.setAiVerdict("FALSE_POSITIVE");
            item.setAiConfidence(Math.max(previousConfidence, 0.85d));
            item.setAiRecommendation(null);
            item.setAiReasoning(appendNormalizationReason(item.getAiReasoning(),
                    "Information leakage requires sensitive content exposed beyond the requester. "
                            + "Generic ValidationError / same-user validation feedback is FALSE_POSITIVE."));
            log.warn("[SastVerification] Deterministic context normalized {} from {} ({}) to FALSE_POSITIVE ({}) "
                            + "because non-sensitive or same-user validation exception content",
                    itemRef, previousVerdict,
                    String.format(Locale.ROOT, "%.2f", previousConfidence),
                    String.format(Locale.ROOT, "%.2f", item.getAiConfidence()));
            return true;
        }

        // CWE-208 timing side-channel: non-security compares → FP; secret compares without constant-time → TP
        if (isTimingSideChannelFinding(item, metadata)) {
            String comparisonKind = evidence != null && evidence.attributes() != null
                    ? evidence.attributes().getOrDefault("comparison_kind", "unknown")
                    : "unknown";
            boolean constantTime = evidence != null && evidence.attributes() != null
                    && "true".equalsIgnoreCase(evidence.attributes().get("constant_time_api"));
            if ("non_security".equals(comparisonKind)
                    && (!"FALSE_POSITIVE".equals(item.getAiVerdict())
                    || item.getAiConfidence() == null
                    || item.getAiConfidence() < 0.85d)) {
                String previousVerdict = item.getAiVerdict();
                double previousConfidence = item.getAiConfidence() == null ? 0.0d : item.getAiConfidence();
                item.setAiVerdict("FALSE_POSITIVE");
                item.setAiConfidence(Math.max(previousConfidence, 0.85d));
                item.setAiRecommendation(null);
                item.setAiReasoning(appendNormalizationReason(item.getAiReasoning(),
                        "CWE-208 requires a security-sensitive secret/credential comparison. The shown comparison is "
                                + "non-security (UI route/tokenizer discriminator/feature flag/scheduling/presence/typeof). "
                                + "Deterministic FALSE_POSITIVE."));
                log.warn("[SastVerification] Deterministic context normalized {} from {} ({}) to FALSE_POSITIVE ({}) "
                                + "because non-security timing comparison",
                        itemRef, previousVerdict,
                        String.format(Locale.ROOT, "%.2f", previousConfidence),
                        String.format(Locale.ROOT, "%.2f", item.getAiConfidence()));
                return true;
            }
            if ("security_sensitive".equals(comparisonKind) && !constantTime) {
                boolean needsVerdict = !"TRUE_POSITIVE".equals(item.getAiVerdict())
                        || item.getAiConfidence() == null
                        || item.getAiConfidence() < 0.85d;
                boolean needsRemediation = needsVerdict
                        || looksLikeWrongLanguageTimingRemediation(item);
                if (needsVerdict || needsRemediation) {
                    String previousVerdict = item.getAiVerdict();
                    double previousConfidence = item.getAiConfidence() == null ? 0.0d : item.getAiConfidence();
                    item.setAiVerdict("TRUE_POSITIVE");
                    item.setAiConfidence(Math.max(previousConfidence, 0.85d));
                    item.setAiRecommendation(formatRecommendation(
                            timingRecommendation(item),
                            timingRemediationCode(item)));
                    if (needsVerdict) {
                        item.setAiReasoning(appendNormalizationReason(item.getAiReasoning(),
                                "CWE-208: security-sensitive comparison without constant-time protection. "
                                        + "Deterministic TRUE_POSITIVE."));
                    }
                    log.warn("[SastVerification] Deterministic context normalized {} from {} ({}) to TRUE_POSITIVE ({}) "
                                    + "because security-sensitive timing comparison"
                                    + (needsRemediation && !needsVerdict ? " (remediation language fix)" : ""),
                            itemRef, previousVerdict,
                            String.format(Locale.ROOT, "%.2f", previousConfidence),
                            String.format(Locale.ROOT, "%.2f", item.getAiConfidence()));
                    return true;
                }
            }
        }

        // SQL Injection: numeric / literal-callsite / ORM-safe normalization
        if (isSqlInjectionFinding(item)) {
            String reactText = reactMessagesText(reactMessages);
            boolean hasNumericEvidence = hasNumericSqlParameterEvidence(item, context, reactText,
                    "", item.getAiReasoning());
            boolean hasOrmSafeSql = hasOrmSafeSqlEvidence(item, context);

            String callerCtx = context != null && context.callerContext() != null ? context.callerContext() : "";
            String crossFileCtx = context != null && context.crossFileCallerContext() != null
                    ? context.crossFileCallerContext() : "";
            boolean allCallsitesLiteral = callerCtx.contains("[origin-tag: all-callsites-pass-literal-arg=true]")
                    || crossFileCtx.contains("[origin-tag: all-callsites-pass-literal-arg=true]");

            boolean hasUnneutralizedStringSql = hasUnneutralizedStringSqlInjectionEvidence(
                    item, context, reactText, "", item.getAiReasoning());
            boolean riskyTrustedSqlConcat = hasSqlRiskyTrustedConcatPattern(
                    item, context, reactText, "", item.getAiReasoning());

            log.info("[SastVerification] Deterministic normalization check for {}: isSqlInjection={}, "
                            + "hasNumericEvidence={}, hasOrmSafeSql={}, allCallsitesLiteral={}, "
                            + "hasUnneutralizedStringSql={}, riskyTrustedSqlConcat={}",
                    itemRef, true, hasNumericEvidence, hasOrmSafeSql, allCallsitesLiteral,
                    hasUnneutralizedStringSql, riskyTrustedSqlConcat);

            if (hasOrmSafeSql && !hasUnneutralizedStringSql) {
                if ("FALSE_POSITIVE".equals(item.getAiVerdict()) && item.getAiConfidence() != null
                        && item.getAiConfidence() >= 0.85d) {
                    return false;
                }
                String previousVerdict = item.getAiVerdict();
                double previousConfidence = item.getAiConfidence() == null ? 0.0d : item.getAiConfidence();
                item.setAiVerdict("FALSE_POSITIVE");
                item.setAiConfidence(Math.max(previousConfidence, 0.85d));
                item.setAiRecommendation(null);
                item.setAiReasoning(appendNormalizationReason(item.getAiReasoning(),
                        "SQL is produced via ORM/parameterized APIs (e.g. sql_with_params / prepared statements), "
                                + "not attacker-controlled string concatenation. Deterministic FALSE_POSITIVE."));
                log.warn("[SastVerification] Deterministic context normalized {} from {} ({}) to FALSE_POSITIVE ({}) "
                                + "because SQL uses ORM/parameterized APIs",
                        itemRef, previousVerdict,
                        String.format(Locale.ROOT, "%.2f", previousConfidence),
                        String.format(Locale.ROOT, "%.2f", item.getAiConfidence()));
                return true;
            }

            if (hasNumericEvidence) {
                if ("FALSE_POSITIVE".equals(item.getAiVerdict()) && item.getAiConfidence() != null
                        && item.getAiConfidence() >= 0.85d) {
                    return false;
                }
                String previousVerdict = item.getAiVerdict();
                double previousConfidence = item.getAiConfidence() == null ? 0.0d : item.getAiConfidence();
                item.setAiVerdict("FALSE_POSITIVE");
                item.setAiConfidence(Math.max(previousConfidence, 0.85d));
                item.setAiRecommendation(null);
                item.setAiReasoning(appendNormalizationReason(item.getAiReasoning(),
                        "SQL injection requires attacker-controlled SQL syntax. The SQL value is proven numeric "
                                + "from the surrounding function context and is the value concatenated into the query, "
                                + "so it cannot inject SQL text through that parameter."));
                log.warn("[SastVerification] Deterministic context normalized {} from {} ({}) to FALSE_POSITIVE ({}) "
                                + "because SQL uses a numeric parameter",
                        itemRef, previousVerdict,
                        String.format(Locale.ROOT, "%.2f", previousConfidence),
                        String.format(Locale.ROOT, "%.2f", item.getAiConfidence()));
                return true;
            }

            // Trusted/literal operands + string-built SQL => RISKY SCHEME (TP mid-confidence).
            if (riskyTrustedSqlConcat
                    && (!"TRUE_POSITIVE".equals(item.getAiVerdict())
                    || item.getAiConfidence() == null
                    || item.getAiConfidence() < 0.50d
                    || item.getAiConfidence() > 0.60d)) {
                String previousVerdict = item.getAiVerdict();
                double previousConfidence = item.getAiConfidence() == null ? 0.0d : item.getAiConfidence();
                item.setAiVerdict("TRUE_POSITIVE");
                item.setAiConfidence(SQL_RISKY_TRUSTED_CONCAT_CONFIDENCE);
                item.setAiRecommendation(formatRecommendation(
                        sqlInjectionRecommendation(item),
                        sqlInjectionRemediationCode(item)));
                item.setAiReasoning(appendNormalizationReason(item.getAiReasoning(),
                        "RISKY SCHEME: SQL is concatenated/interpolated from proven application-safe "
                                + "literals/constants (no current attacker-controlled source). "
                                + "TRUE_POSITIVE with mid confidence (~0.55), not FALSE_POSITIVE — "
                                + "the pattern can later be reused with user input."));
                log.warn("[SastVerification] Deterministic context normalized {} from {} ({}) to TRUE_POSITIVE ({}) "
                                + "because trusted-source SQL string concatenation is a risky scheme",
                        itemRef,
                        previousVerdict,
                        String.format(Locale.ROOT, "%.2f", previousConfidence),
                        String.format(Locale.ROOT, "%.2f", item.getAiConfidence()));
                return true;
            }

            // Local non-literal/untrusted String concat into SQL => high-confidence TP.
            if (hasUnneutralizedStringSql
                    && (!"TRUE_POSITIVE".equals(item.getAiVerdict())
                    || item.getAiConfidence() == null
                    || item.getAiConfidence() < 0.90d)) {
                String previousVerdict = item.getAiVerdict();
                double previousConfidence = item.getAiConfidence() == null ? 0.0d : item.getAiConfidence();
                item.setAiVerdict("TRUE_POSITIVE");
                item.setAiConfidence(Math.max(previousConfidence, 0.90d));
                item.setAiRecommendation(formatRecommendation(
                        sqlInjectionRecommendation(item),
                        sqlInjectionRemediationCode(item)));
                item.setAiReasoning(appendNormalizationReason(item.getAiReasoning(),
                        "Non-hardcoded/unknown-origin string input is clearly concatenated or interpolated into "
                                + "dynamic SQL without parameterization, numeric typing, or a complete allowlist. "
                                + "Unknown callers do not justify UNCERTAIN — deterministic TRUE_POSITIVE."));
                log.warn("[SastVerification] Deterministic context normalized {} from {} ({}) to TRUE_POSITIVE ({}) "
                                + "because SQL uses unneutralized non-literal String concatenation",
                        itemRef,
                        previousVerdict,
                        String.format(Locale.ROOT, "%.2f", previousConfidence),
                        String.format(Locale.ROOT, "%.2f", item.getAiConfidence()));
                return true;
            }

            // Pure literal SQL argument (no identifier concat) + literal call sites => FP.
            if (allCallsitesLiteral && !hasUnneutralizedStringSql && !riskyTrustedSqlConcat) {
                if ("FALSE_POSITIVE".equals(item.getAiVerdict()) && item.getAiConfidence() != null
                        && item.getAiConfidence() >= 0.85d) {
                    log.debug("[SastVerification] Skipping normalization for {} - already FALSE_POSITIVE with high confidence", itemRef);
                    return false;
                }

                String previousVerdict = item.getAiVerdict();
                double previousConfidence = item.getAiConfidence() == null ? 0.0d : item.getAiConfidence();
                item.setAiVerdict("FALSE_POSITIVE");
                item.setAiConfidence(Math.max(previousConfidence, 0.85d));
                item.setAiRecommendation(null);
                item.setAiReasoning(appendNormalizationReason(item.getAiReasoning(),
                        "SQL injection requires attacker-controlled input. All discovered call sites pass "
                                + "string literals or named constants (origin-tag: all-callsites-pass-literal-arg=true), "
                                + "and the SQL text is not built by concatenating identifiers into dynamic SQL."));
                log.warn("[SastVerification] Deterministic context normalized {} from {} ({}) to FALSE_POSITIVE ({}) "
                                + "because SQL uses a literal/constant parameter",
                        itemRef,
                        previousVerdict,
                        String.format(Locale.ROOT, "%.2f", previousConfidence),
                        String.format(Locale.ROOT, "%.2f", item.getAiConfidence()));
                return true;
            }
        }

        // CWE-502: force TP only when attacker-influenced bytes are proven (not path-from-env alone).
        if (isDeserializationFamily(metadata, item)) {
            String reactText = reactMessagesText(reactMessages);
            boolean attackerBytes = hasAttackerInfluencedDeserializationEvidence(item, context, reactText);
            boolean safeDeser = containsDeserializationSafetyEvidence(
                    Optional.ofNullable(item.getAiReasoning()).orElse("") + " " + reactText);
            if (attackerBytes && !safeDeser
                    && (!"TRUE_POSITIVE".equals(item.getAiVerdict())
                    || item.getAiConfidence() == null
                    || item.getAiConfidence() < 0.85d)) {
                String previousVerdict = item.getAiVerdict();
                double previousConfidence = item.getAiConfidence() == null ? 0.0d : item.getAiConfidence();
                item.setAiVerdict("TRUE_POSITIVE");
                item.setAiConfidence(Math.max(previousConfidence, 0.85d));
                item.setAiRecommendation(formatRecommendation(
                        "Avoid unsafe deserialization of attacker-influenced bytes. Prefer a safe format "
                                + "(e.g. JSON) or enforce integrity checks and a strict type allowlist before loading.",
                        deserializationRemediationCode(item)));
                item.setAiReasoning(appendNormalizationReason(item.getAiReasoning(),
                        "Attacker-influenced bytes reach an unsafe deserialization API without allowlist/safe_load/"
                                + "integrity proof — deterministic TRUE_POSITIVE."));
                log.warn("[SastVerification] Deterministic context normalized {} from {} ({}) to TRUE_POSITIVE ({}) "
                                + "because attacker-influenced deserialization payload",
                        itemRef,
                        previousVerdict,
                        String.format(Locale.ROOT, "%.2f", previousConfidence),
                        String.format(Locale.ROOT, "%.2f", item.getAiConfidence()));
                return true;
            }
        }

        // Build-tool / Maven-plugin context guard for logger/exception leakage findings.
        // Code in maven-plugin, annotation-processor, gradle task, or test modules logs
        // build-time class metadata (class names, interface names, artifact coordinates) —
        // this data is never attacker-controlled, so leakage findings are always FALSE_POSITIVE.
        if (isLoggerOrExceptionLeakFinding(item) && isInBuildToolContext(item)) {
            if (!"FALSE_POSITIVE".equals(item.getAiVerdict()) || (item.getAiConfidence() != null && item.getAiConfidence() < 0.85d)) {
                String previousVerdict = item.getAiVerdict();
                double previousConfidence = item.getAiConfidence() == null ? 0.0d : item.getAiConfidence();
                item.setAiVerdict("FALSE_POSITIVE");
                item.setAiConfidence(Math.max(previousConfidence, 0.90d));
                item.setAiRecommendation(null);
                item.setAiReasoning(appendNormalizationReason(item.getAiReasoning(),
                        "This file is part of a build-time tool (Maven plugin, annotation processor, Gradle task, or test runner). "
                                + "The logged data consists of build-time metadata (class names, interface names, artifact coordinates, "
                                + "project paths) which is not attacker-controlled. Logger/exception leakage findings in build-time "
                                + "tools are not exploitable at runtime."));
                log.warn("[SastVerification] Deterministic context normalized {} from {} ({}) to FALSE_POSITIVE ({}) "
                                + "because build-tool context for logger/exception leak",
                        itemRef,
                        previousVerdict,
                        String.format(Locale.ROOT, "%.2f", previousConfidence),
                        String.format(Locale.ROOT, "%.2f", item.getAiConfidence()));
                return true;
            }
        }

        return false;
    }

    private boolean isClassicInjectionFamily(SastRuleMetadata metadata) {
        if (metadata == null || metadata.family() == null) {
            return false;
        }
        return switch (metadata.family()) {
            case SQL_INJECTION, COMMAND_INJECTION, PATH_TRAVERSAL, XSS, SSRF, OPEN_REDIRECT,
                 XXE, DESERIALIZATION, REGEX_DOS, TRUST_BOUNDARY -> true;
            default -> false;
        };
    }

    private boolean isUntrustedInputSource(String inputSource) {
        if (inputSource == null || inputSource.isBlank()) {
            return false;
        }
        String normalized = inputSource.trim().toLowerCase(Locale.ROOT);
        return normalized.equals("http_request")
                || normalized.equals("database")
                || normalized.equals("file_untrusted")
                || normalized.equals("gui_input")
                || normalized.equals("url_fragment");
    }

    private boolean isDeserializationFamily(SastRuleMetadata metadata, Item item) {
        if (metadata != null && metadata.family() == VulnerabilityFamily.DESERIALIZATION) {
            return true;
        }
        if (item == null) {
            return false;
        }
        List<String> cweIds = item.getCweIds();
        if (cweIds != null && cweIds.stream().anyMatch(cwe -> "502".equals(cwe) || "CWE-502".equalsIgnoreCase(cwe))) {
            return true;
        }
        String combined = (Optional.ofNullable(item.getId()).orElse("")
                + " " + Optional.ofNullable(item.getTitle()).orElse("")
                + " " + Optional.ofNullable(item.getCodeExtract()).orElse("")).toLowerCase(Locale.ROOT);
        return combined.contains("pickle.loads") || combined.contains("pickle.load")
                || combined.contains("yaml.load") || combined.contains("marshal.load")
                || combined.contains("objectinputstream") || combined.contains("unserialize(")
                || combined.contains("insecure deserialization") || combined.contains("avoid_pickle");
    }

    /**
     * True only when evidence shows attacker-influenced bytes reaching an unsafe deserializer.
     * Path-from-env + open/read of a possibly static operator artifact is NOT enough.
     */
    private boolean hasAttackerInfluencedDeserializationEvidence(Item item, CodeContextExtractor.CodeContext context,
                                                                 String reactText) {
        if (item == null) {
            return false;
        }
        String extractLower = Optional.ofNullable(item.getCodeExtract()).orElse("").toLowerCase(Locale.ROOT);
        // Pickle-only: dump/dumps is serialization. Do not force-TP a serialize-only extract just because
        // the same file/context also contains pickle.loads (common in cache round-trips).
        if (isPickleSerializeOnlyExtract(extractLower)) {
            return false;
        }
        // Pickle-only: when the flagged extract mentions pickle, require a load sink in the extract itself.
        // Nearby pickle.loads in the same file must not upgrade a non-load pickle finding.
        if (extractLower.contains("pickle.")
                && !(extractLower.contains("pickle.loads") || extractLower.contains("pickle.load("))) {
            return false;
        }
        // Evidence for force-TP must come from code/context/tool output — NOT from LLM reasoning,
        // scanner prose, or FP narrative (those often contain the word "attacker" and self-trigger).
        String combined = String.join("\n",
                Optional.ofNullable(item.getCodeExtract()).orElse(""),
                context == null || context.functionBody() == null ? "" : context.functionBody(),
                context == null || context.localSnippet() == null ? "" : context.localSnippet(),
                context == null || context.definitionContext() == null ? "" : context.definitionContext(),
                context == null || context.callerContext() == null ? "" : context.callerContext(),
                Optional.ofNullable(reactText).orElse("")).toLowerCase(Locale.ROOT);

        boolean unsafeSink = combined.contains("pickle.loads") || combined.contains("pickle.load(")
                || combined.contains("yaml.load(") || combined.contains("marshal.load")
                || combined.contains("objectinputstream") || combined.contains("readobject(")
                || combined.contains("unserialize(") || combined.contains("binaryformatter")
                || combined.contains("jsonpickle.decode");
        if (!unsafeSink) {
            return false;
        }

        // Direct untrusted channels into the deserializer (not merely env path + local file read).
        // Deliberately no bare "attacker" — that word appears in uncertain LLM prose and scanner blurbs.
        return combined.contains("request.") || combined.contains("req.body")
                || combined.contains("req.files") || combined.contains("@requestbody")
                || combined.contains("multipart") || combined.contains("uploadedfile")
                || combined.contains("request.files") || combined.contains("$_files")
                || combined.contains("http_request") || combined.contains("file_untrusted")
                || combined.contains("user upload") || combined.contains("user-uploaded")
                || combined.contains("untrusted upload")
                || combined.contains("world-writable") || combined.contains("user-writable")
                || combined.contains("tmp/") || combined.contains("/tmp")
                || (combined.contains("pickle.dump") && (combined.contains("request") || combined.contains("upload")));
    }

    /**
     * Pickle {@code dump}/{@code dumps} alone is serialization, not unsafe deserialization.
     * Other libraries are intentionally unaffected.
     */
    private boolean isPickleSerializeOnlyExtract(String extractLower) {
        if (extractLower == null || extractLower.isBlank()) {
            return false;
        }
        boolean pickleDump = extractLower.contains("pickle.dumps") || extractLower.contains("pickle.dump(");
        boolean pickleLoad = extractLower.contains("pickle.loads") || extractLower.contains("pickle.load(");
        return pickleDump && !pickleLoad;
    }

    private boolean containsDeserializationSafetyEvidence(String text) {
        if (text == null || text.isBlank()) {
            return false;
        }
        String lower = text.toLowerCase(Locale.ROOT);
        return lower.contains("yaml.safe_load") || lower.contains("safeloader")
                || lower.contains("objectinputfilter") || lower.contains("json.loads")
                || lower.contains("type allowlist") || lower.contains("class allowlist")
                || lower.contains("integrity") || lower.contains("hmac")
                || lower.contains("signature verif") || lower.contains("signed payload");
    }

    private boolean isTimingSideChannelFinding(Item item, SastRuleMetadata metadata) {
        if (metadata != null && metadata.family() == VulnerabilityFamily.TIMING_SIDE_CHANNEL) {
            return true;
        }
        if (item == null) {
            return false;
        }
        String combined = (Optional.ofNullable(item.getId()).orElse("")
                + " " + Optional.ofNullable(item.getTitle()).orElse("")).toLowerCase(Locale.ROOT);
        if (combined.contains("observable timing") || combined.contains("timing discrepancy")
                || combined.contains("observable_timing")) {
            return true;
        }
        List<String> cweIds = item.getCweIds();
        return cweIds != null && cweIds.stream()
                .anyMatch(cwe -> "208".equals(cwe) || "CWE-208".equalsIgnoreCase(cwe));
    }

    private boolean isInsufficientRandomFinding(Item item, SastRuleMetadata metadata) {
        if (metadata != null && metadata.family() == VulnerabilityFamily.INSUFFICIENT_RANDOM) {
            return true;
        }
        if (item == null) {
            return false;
        }
        String combined = (Optional.ofNullable(item.getId()).orElse("")
                + " " + Optional.ofNullable(item.getTitle()).orElse("")).toLowerCase(Locale.ROOT);
        if (combined.contains("weak_random") || combined.contains("weak random")
                || combined.contains("pseudo-random") || combined.contains("prng")
                || combined.contains("insufficient random") || combined.contains("insecure random")) {
            return true;
        }
        List<String> cweIds = item.getCweIds();
        return cweIds != null && cweIds.stream().anyMatch(cwe -> {
            String normalized = Optional.ofNullable(cwe).orElse("").toUpperCase(Locale.ROOT).replace("CWE-", "").trim();
            return "330".equals(normalized) || "338".equals(normalized);
        });
    }

    /**
     * Sleep/jitter/scheduling/sampling/fake-data uses of weak PRNG are not CWE-330/338 true positives.
     * Uses shared detectors with {@link CryptoEvidenceBuilder}; includes function body / local snippet
     * when available so one-line extracts like {@code random.randint(...)} still resolve.
     */
    private boolean hasNonSecurityRandomUseEvidence(Item item, String... texts) {
        return hasNonSecurityRandomUseEvidence(item, null, texts);
    }

    private boolean hasNonSecurityRandomUseEvidence(Item item, CodeContextExtractor.CodeContext context,
                                                    String... texts) {
        StringBuilder sb = new StringBuilder();
        String code = Optional.ofNullable(item).map(Item::getCodeExtract).orElse("");
        String filename = Optional.ofNullable(item)
                .map(i -> i.getFilename() != null ? i.getFilename() : i.getFullFilename())
                .orElse("");
        sb.append(code).append('\n').append(filename);
        if (context != null) {
            if (context.functionBody() != null) {
                sb.append('\n').append(context.functionBody());
            }
            if (context.localSnippet() != null) {
                sb.append('\n').append(context.localSnippet());
            }
            if (context.callerContext() != null) {
                sb.append('\n').append(context.callerContext());
            }
        }
        if (texts != null) {
            for (String text : texts) {
                if (text != null && !text.isBlank()) {
                    sb.append('\n').append(text);
                }
            }
        }
        return CryptoEvidenceBuilder.looksLikeNonSecurityRandomUse(sb.toString());
    }

    private boolean hasNonSecurityWeakHashEvidence(Item item, CodeContextExtractor.CodeContext context,
                                                   FindingEvidence evidence) {
        if (hasWeakHashPasswordEvidence(item, "", item.getAiReasoning())) {
            return false;
        }
        if (evidence != null && evidence.attributes() != null) {
            String purpose = evidence.attributes().getOrDefault("security_purpose_hint", "");
            if ("non_security".equals(purpose) || "possibly_non_security".equals(purpose)) {
                return true;
            }
        }
        String combined = Optional.ofNullable(item).map(Item::getCodeExtract).orElse("");
        if (context != null) {
            combined = combined + "\n" + Optional.ofNullable(context.functionBody()).orElse("")
                    + "\n" + Optional.ofNullable(context.localSnippet()).orElse("");
        }
        String lower = combined.toLowerCase(Locale.ROOT);
        boolean nonSecurityPurpose = lower.contains("cache")
                || lower.contains("fingerprint")
                || lower.contains("checksum")
                || lower.contains("etag")
                || lower.contains("dedup")
                || looksLikeProtocolHmac(lower)
                || lower.contains("digest(") && (lower.contains("query") || lower.contains("document"));
        return nonSecurityPurpose && !PASSWORD_HASH_PURPOSE_PATTERN.matcher(combined).find();
    }

    static boolean looksLikeProtocolHmac(String text) {
        if (text == null || text.isBlank()) {
            return false;
        }
        String lower = text.toLowerCase(Locale.ROOT);
        boolean hmacCall = lower.contains("createhmac")
                || lower.contains("createhmac(")
                || lower.contains("crypto.createhmac")
                || lower.contains("hmac('sha1")
                || lower.contains("hmac(\"sha1")
                || lower.contains("hmac-sha1")
                || lower.contains("hmacsha1");
        boolean protocol = lower.contains("oauth") || lower.contains("signingmaterial")
                || lower.contains("signaturebasestring") || lower.contains("rfc2104")
                || lower.contains("protocol");
        return hmacCall && (protocol || lower.contains("sha1") || lower.contains("sha-1"));
    }

    /**
     * Claim-peek helper (owner/type/iss only) with a verifying decode elsewhere in the shown auth path.
     */
    private boolean looksLikeJwtClaimPeekWithVerifiedAuthPath(Item item, CodeContextExtractor.CodeContext context) {
        String code = Optional.ofNullable(item).map(Item::getCodeExtract).orElse("");
        String body = context != null && context.functionBody() != null ? context.functionBody() : "";
        String callers = "";
        if (context != null) {
            callers = Optional.ofNullable(context.callerContext()).orElse("")
                    + "\n" + Optional.ofNullable(context.crossFileCallerContext()).orElse("");
        }
        String local = (code + "\n" + body).toLowerCase(Locale.ROOT);
        String surrounding = (local + "\n" + callers).toLowerCase(Locale.ROOT);
        boolean unverifiedPeek = local.contains("verify_signature") && local.contains("false")
                || local.contains("verify_signature\": false")
                || local.contains("verify_signature': false");
        if (!unverifiedPeek && !(local.contains("jwt.decode") || local.contains("jwt_decode"))) {
            return false;
        }
        boolean claimPeekOnly = (local.contains("owner") || local.contains("iss") || local.contains("\"type\"")
                || local.contains("'type'") || local.contains("token_type") || local.contains("alg"))
                && (local.contains("return true") || local.contains("return false"));
        boolean verifiedElsewhere = surrounding.contains("jwt_decode(")
                || (surrounding.contains("jwt.decode(") && surrounding.contains("verify"))
                || surrounding.contains("jwt.verify")
                || surrounding.contains("parseclaimsjws")
                || surrounding.contains("requiresignedtokens")
                || (surrounding.contains("jwtmanager") && surrounding.contains("decode"));
        // Avoid FP when the same function uses unverified claims for authz decisions.
        boolean trustsUnverified = local.contains("permissions") || local.contains("is_staff")
                || local.contains("authenticate") || local.contains("get_user");
        return claimPeekOnly && verifiedElsewhere && !trustsUnverified;
    }

    private boolean hasSameUserValidationFeedbackEvidence(Item item, FindingEvidence evidence) {
        if (evidence != null && evidence.attributes() != null
                && "true".equalsIgnoreCase(evidence.attributes().getOrDefault("same_user_validation_feedback", "false"))) {
            return true;
        }
        String code = Optional.ofNullable(item).map(Item::getCodeExtract).orElse("");
        return LoggingEvidenceBuilder.looksLikeSameUserValidationFeedback(code);
    }

    private boolean hasOrmSafeSqlEvidence(Item item, CodeContextExtractor.CodeContext context) {
        String combined = Optional.ofNullable(item).map(Item::getCodeExtract).orElse("");
        if (context != null) {
            combined = combined + "\n" + Optional.ofNullable(context.functionBody()).orElse("")
                    + "\n" + Optional.ofNullable(context.localSnippet()).orElse("");
        }
        String lower = combined.toLowerCase(Locale.ROOT);
        return lower.contains("sql_with_params")
                || lower.contains("get_compiler(")
                || lower.contains("cursor.execute(") && (lower.contains("%s") || lower.contains("params"))
                || lower.contains("queryset") && lower.contains(".query")
                || lower.contains("preparedstatement")
                || lower.contains("createquery(");
    }

    private boolean isLoggingOrExceptionLeakFinding(Item item, SastRuleMetadata metadata) {
        if (metadata != null && (metadata.family() == VulnerabilityFamily.LOGGER_LEAK
                || metadata.family() == VulnerabilityFamily.EXCEPTION_LEAK)) {
            return true;
        }
        if (item == null) {
            return false;
        }
        String combined = (Optional.ofNullable(item.getId()).orElse("")
                + " " + Optional.ofNullable(item.getTitle()).orElse("")).toLowerCase(Locale.ROOT);
        if (combined.contains("exception message")
                || combined.contains("sensitive data in exception")
                || combined.contains("information leakage")
                || combined.contains("information disclosure")
                || combined.contains("logger")
                || combined.contains("log injection")) {
            return true;
        }
        List<String> cweIds = item.getCweIds();
        return cweIds != null && cweIds.stream().anyMatch(cwe -> {
            String normalized = Optional.ofNullable(cwe).orElse("").toUpperCase(Locale.ROOT).replace("CWE-", "").trim();
            return "200".equals(normalized) || "209".equals(normalized) || "532".equals(normalized)
                    || "117".equals(normalized);
        });
    }

    private boolean hasNonSensitiveExceptionLeakEvidence(Item item, FindingEvidence evidence) {
        String code = Optional.ofNullable(item).map(Item::getCodeExtract).orElse("");
        if (!LoggingEvidenceBuilder.hasNoObviousSecretContent(code)) {
            return false;
        }
        if (evidence != null && evidence.attributes() != null) {
            if ("secret_or_pii_candidate".equals(evidence.attributes().getOrDefault("data_sensitivity", ""))) {
                return false;
            }
            if ("true".equalsIgnoreCase(evidence.attributes().getOrDefault("generic_validation_exception", "false"))) {
                return true;
            }
        }
        return LoggingEvidenceBuilder.looksLikeGenericValidationException(code);
    }

    private String timingRecommendation(Item item) {
        return switch (inferFindingLanguage(item)) {
            case "javascript", "typescript" ->
                    "Use a constant-time comparison API for secret/credential values (e.g. crypto.timingSafeEqual).";
            case "python" ->
                    "Use a constant-time comparison API for secret/credential values (e.g. hmac.compare_digest).";
            case "go" ->
                    "Use a constant-time comparison API for secret/credential values (e.g. subtle.ConstantTimeCompare).";
            case "csharp" ->
                    "Use a constant-time comparison API for secret/credential values "
                            + "(e.g. CryptographicOperations.FixedTimeEquals).";
            case "php" ->
                    "Use a constant-time comparison API for secret/credential values (e.g. hash_equals).";
            case "ruby" ->
                    "Use a constant-time comparison API for secret/credential values "
                            + "(e.g. ActiveSupport::SecurityUtils.secure_compare).";
            default ->
                    "Use a constant-time comparison API for secret/credential values "
                            + "(e.g. MessageDigest.isEqual, crypto.timingSafeEqual).";
        };
    }

    private String timingRemediationCode(Item item) {
        String[] operands = extractTimingCompareOperands(flaggedCodeExtract(item));
        String left = operands != null ? operands[0] : null;
        String right = operands != null ? operands[1] : null;
        String expected = left != null ? left : "expected";
        String actual = right != null ? right : "actual";
        String fix = switch (inferFindingLanguage(item)) {
            case "javascript", "typescript" ->
                    "const ok = crypto.timingSafeEqual(\n"
                            + "  Buffer.from(" + actual + "), Buffer.from(" + expected + "));";
            case "python" ->
                    "import hmac\n"
                            + "ok = hmac.compare_digest(" + actual + ", " + expected + ")";
            case "go" ->
                    "import \"crypto/subtle\"\n"
                            + "ok := subtle.ConstantTimeCompare([]byte(" + actual + "), []byte(" + expected + ")) == 1";
            case "csharp" ->
                    "bool ok = CryptographicOperations.FixedTimeEquals(" + actual + ", " + expected + ");";
            case "php" ->
                    "$ok = hash_equals(" + phpTimingOperand(expected) + ", " + phpTimingOperand(actual) + ");";
            case "ruby" ->
                    "ok = ActiveSupport::SecurityUtils.secure_compare(" + expected + ", " + actual + ")";
            case "kotlin", "java" ->
                    "boolean ok = MessageDigest.isEqual(\n"
                            + "    String.valueOf(" + expected + ").getBytes(java.nio.charset.StandardCharsets.UTF_8),\n"
                            + "    String.valueOf(" + actual + ").getBytes(java.nio.charset.StandardCharsets.UTF_8));";
            default ->
                    "MessageDigest.isEqual(" + expected + ", " + actual
                            + "); // or language-equivalent constant-time compare";
        };
        return wrapWithFlaggedExtract(item, fix);
    }

    private static String phpTimingOperand(String expression) {
        if (expression == null || expression.isBlank()) {
            return "$value";
        }
        String trimmed = expression.trim();
        return trimmed.startsWith("$") ? trimmed : "$" + trimmed.replaceFirst("^\\$", "");
    }

    String[] extractTimingCompareOperands(String code) {
        if (code == null || code.isBlank()) {
            return null;
        }
        java.util.regex.Matcher equals = TIMING_EQUALS_METHOD_PATTERN.matcher(code);
        if (equals.find()) {
            return new String[]{equals.group(1).trim(), equals.group(2).trim()};
        }
        java.util.regex.Matcher objectsEquals = TIMING_OBJECTS_EQUALS_PATTERN.matcher(code);
        if (objectsEquals.find()) {
            return new String[]{objectsEquals.group(1).trim(), objectsEquals.group(2).trim()};
        }
        java.util.regex.Matcher op = TIMING_OPERATOR_COMPARE_PATTERN.matcher(code);
        while (op.find()) {
            String left = op.group(1);
            String right = op.group(2);
            if ("typeof".equals(left) || "typeof".equals(right)) {
                continue;
            }
            String rightLower = right.toLowerCase(Locale.ROOT);
            if (Set.of("true", "false", "null", "undefined", "string", "number", "object",
                    "boolean", "function", "symbol", "bigint").contains(rightLower)) {
                continue;
            }
            int start = op.start();
            String prefix = code.substring(Math.max(0, start - 12), start).toLowerCase(Locale.ROOT);
            if (prefix.contains("typeof")) {
                continue;
            }
            return new String[]{left, right};
        }
        return null;
    }

    /** True when an existing timing remediation cites a constant-time API from the wrong language. */
    private boolean looksLikeWrongLanguageTimingRemediation(Item item) {
        if (item == null) {
            return false;
        }
        String rec = Optional.ofNullable(item.getAiRecommendation()).orElse("").toLowerCase(Locale.ROOT);
        if (rec.isBlank()) {
            return true;
        }
        String language = inferFindingLanguage(item);
        boolean citesJava = rec.contains("messagedigest.isequal");
        boolean citesJs = rec.contains("crypto.timingsafeequal");
        boolean citesPython = rec.contains("hmac.compare_digest");
        return switch (language) {
            case "javascript", "typescript" -> citesJava || (!citesJs && rec.contains("messagedigest"));
            case "python" -> citesJava || citesJs || (!citesPython && rec.contains("messagedigest"));
            case "java", "kotlin" -> citesJs && !citesJava;
            default -> false;
        };
    }

    /** True when the finding is a logger-message or exception-message leakage (CWE 117/532/200/209). */
    private boolean isLoggerOrExceptionLeakFinding(Item item) {
        if (item == null) return false;
        String title = item.getTitle() != null ? item.getTitle().toLowerCase(Locale.ROOT) : "";
        String id = item.getId() != null ? item.getId().toLowerCase(Locale.ROOT) : "";
        if (title.contains("logger") || title.contains("log message") || title.contains("exception message")
                || title.contains("leakage") || title.contains("information in logger")
                || id.contains("logger") || id.contains("log_") || id.contains("_log")) {
            return true;
        }
        List<String> cweIds = item.getCweIds() != null ? item.getCweIds() : List.of();
        for (String cwe : cweIds) {
            String normalized = cwe.toUpperCase(Locale.ROOT).replace("CWE-", "").trim();
            if ("117".equals(normalized) || "532".equals(normalized)
                    || "209".equals(normalized) || "200".equals(normalized)
                    || "201".equals(normalized) || "210".equals(normalized)) {
                return true;
            }
        }
        return false;
    }

    /**
     * True when the finding's file path indicates it is part of a build-time tool:
     * Maven plugin, annotation processor, Gradle plugin, or test module.
     * These tools process build metadata (class names, artifacts, project paths) that
     * is never attacker-controlled at runtime.
     */
    private boolean isInBuildToolContext(Item item) {
        if (item == null || item.getFilename() == null) return false;
        String path = item.getFilename().replace('\\', '/').toLowerCase(Locale.ROOT);
        return path.contains("maven-plugin")
                || path.contains("mavenplugin")
                || path.contains("annotation-processor")
                || path.contains("annotationprocessor")
                || path.contains("gradle-plugin")
                || path.contains("gradleplugin")
                || path.contains("mailetdocs")
                || path.contains("-plugin/src/")
                || path.contains("/apt/")          // Java annotation processing tool
                || path.contains("/codegen/");
    }

    private boolean hasNumericSqlParameterEvidence(Item item, String falsePositiveEvidence, String reasoning) {
        return hasNumericSqlParameterEvidence(item, null, falsePositiveEvidence, reasoning);
    }

    private boolean hasNumericSqlParameterEvidence(Item item, CodeContextExtractor.CodeContext context,
                                                   String falsePositiveEvidence, String reasoning) {
        return hasNumericSqlParameterEvidence(item, context, "", falsePositiveEvidence, reasoning);
    }

    private boolean hasNumericSqlParameterEvidence(Item item, CodeContextExtractor.CodeContext context,
                                                   String additionalEvidence, String falsePositiveEvidence,
                                                   String reasoning) {
        if (!isSqlInjectionFinding(item)) {
            return false;
        }
        String combined = sqlEvidenceText(item, context, additionalEvidence, falsePositiveEvidence, reasoning);
        String localContext = Optional.ofNullable(item.getCodeExtract()).orElse("")
                + " " + (context == null ? "" : Optional.ofNullable(context.functionBody()).orElse(""));
        
        boolean hasString = hasStringIdentifierUsedInSqlConcat(combined);
        boolean hasStringLocal = hasStringIdentifierUsedInSqlConcat(localContext);
        boolean hasNumeric = hasNumericIdentifierUsedInSqlConcat(combined);
        boolean hasNumericLocal = hasNumericIdentifierUsedInSqlConcat(localContext);
        boolean hasPattern = SQL_NUMERIC_PARAMETER_EVIDENCE_PATTERN.matcher(combined).find();
        
        if (hasStringLocal && hasNumericLocal) {
            return false;
        }
        if (hasString && !hasNumericLocal) {
            return false;
        }
        
        if (hasString && hasNumeric) {
            boolean hasDirectSqlExecution = Pattern.compile(
                        "(?is)\\b" + SQL_EXEC_API_REGEX + "\\s*\\(\\s*\\$?[A-Za-z_][A-Za-z0-9_]*\\s*[,\\)]")
                .matcher(localContext).find();
            if (hasDirectSqlExecution) {
                return false;
            }
        }
        
        if (hasNumeric) {
            return true;
        }
        return mentionsSqlExecution(combined) && hasPattern;
    }

    private String sqlEvidenceText(Item item, CodeContextExtractor.CodeContext context,
                                   String falsePositiveEvidence, String reasoning) {
        return sqlEvidenceText(item, context, "", falsePositiveEvidence, reasoning);
    }

    private String sqlEvidenceText(Item item, CodeContextExtractor.CodeContext context, String additionalEvidence,
                                   String falsePositiveEvidence, String reasoning) {
        return String.join(" ",
                Optional.ofNullable(item.getCodeExtract()).orElse(""),
                Optional.ofNullable(item.getDescription()).orElse(""),
                context == null ? "" : Optional.ofNullable(context.functionBody()).orElse(""),
                context == null ? "" : Optional.ofNullable(context.localSnippet()).orElse(""),
                context == null ? "" : Optional.ofNullable(context.definitionContext()).orElse(""),
                context == null ? "" : Optional.ofNullable(context.callerContext()).orElse(""),
                context == null ? "" : Optional.ofNullable(context.crossFileCallerContext()).orElse(""),
                Optional.ofNullable(additionalEvidence).orElse(""),
                Optional.ofNullable(falsePositiveEvidence).orElse(""),
                Optional.ofNullable(reasoning).orElse(""));
    }

    private String reactMessagesText(List<Map<String, Object>> reactMessages) {
        if (reactMessages == null || reactMessages.isEmpty()) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        for (Map<String, Object> message : reactMessages) {
            Object content = message.get("content");
            if (content instanceof String text && text.startsWith("TOOL RESULT")) {
                sb.append(text).append('\n');
            }
        }
        return sb.toString();
    }

    private boolean hasNumericIdentifierUsedInSqlConcat(String text) {
        Set<String> identifiers = declaredIdentifiers(NUMERIC_IDENTIFIER_DECLARATION_PATTERN, text);
        return identifiers.stream().anyMatch(identifier -> identifierUsedInSqlConcat(text, identifier));
    }

    private boolean hasStringIdentifierUsedInSqlConcat(String text) {
        Set<String> identifiers = declaredIdentifiers(STRING_IDENTIFIER_DECLARATION_PATTERN, text);
        return identifiers.stream().anyMatch(identifier -> identifierUsedInSqlConcat(text, identifier));
    }

    private Set<String> declaredIdentifiers(Pattern pattern, String text) {
        Set<String> identifiers = new HashSet<>();
        java.util.regex.Matcher matcher = pattern.matcher(Optional.ofNullable(text).orElse(""));
        while (matcher.find()) {
            for (int i = 1; i <= matcher.groupCount(); i++) {
                String group = matcher.group(i);
                if (group != null && !group.isBlank()) {
                    identifiers.add(group);
                    break;
                }
            }
        }
        return identifiers;
    }

    private boolean identifierUsedInSqlConcat(String text, String identifier) {
        String quoted = Pattern.quote(identifier);
        // Java/JS/C# '+' concat, PHP '.' concat, nearby SQL keywords.
        String sqlBeforeConcat = "(?is)\\b(?:select|insert|update|delete|where|from|query|sql|executeQuery)\\b"
                + "[\\s\\S]{0,600}(?:\\+|\\.)\\s*\\$?" + quoted + "\\s*(?:\\+|\\.)?";
        String concatBeforeSql = "(?is)(?:\\+|\\.)\\s*\\$?" + quoted + "\\s*(?:\\+|\\.)?[\\s\\S]{0,600}"
                + "\\b(?:select|insert|update|delete|where|from|query|sql|executeQuery)\\b";
        String directSqlParameter = "(?is)\\b" + SQL_EXEC_API_REGEX + "\\s*\\(\\s*\\$?"
                + quoted + "\\s*[,\\)]";
        // Interpolation forms: f"...{id}", `...${id}`, $"...{id}", "...#{id}", "...$id..."
        String interpolated = "(?is)(?:f[\"']|`|\\$\"|\"[^\"]*#\\{|\"[^\"]*\\$" + quoted + ")"
                + "[\\s\\S]{0,400}\\b(?:select|insert|update|delete|where|from)\\b"
                + "|\\b(?:select|insert|update|delete|where|from)\\b[\\s\\S]{0,400}"
                + "(?:\\{" + quoted + "\\}|\\$\\{" + quoted + "\\}|#\\{" + quoted + "\\}|\\$" + quoted + "\\b)";
        return Pattern.compile(sqlBeforeConcat).matcher(text).find()
                || Pattern.compile(concatBeforeSql).matcher(text).find()
                || Pattern.compile(directSqlParameter).matcher(text).find()
                || Pattern.compile(interpolated).matcher(text).find();
    }

    private boolean hasUnneutralizedStringSqlInjectionEvidence(Item item, String falsePositiveEvidence, String reasoning) {
        return hasUnneutralizedStringSqlInjectionEvidence(item, null, "", falsePositiveEvidence, reasoning);
    }

    private boolean hasUnneutralizedStringSqlInjectionEvidence(Item item, CodeContextExtractor.CodeContext context,
                                                               String additionalEvidence, String falsePositiveEvidence,
                                                               String reasoning) {
        if (!isSqlInjectionFinding(item)
                || hasNumericSqlParameterEvidence(item, context, additionalEvidence, falsePositiveEvidence, reasoning)) {
            return false;
        }
        String code = Optional.ofNullable(item.getCodeExtract()).orElse("");
        String contextCode = context == null ? "" : String.join(" ",
                Optional.ofNullable(context.functionBody()).orElse(""),
                Optional.ofNullable(context.localSnippet()).orElse(""),
                Optional.ofNullable(context.definitionContext()).orElse(""));
        String structuralSource = (code + "\n" + contextCode + "\n" + Optional.ofNullable(additionalEvidence).orElse("")).trim();
        if (hasKnexParameterizedIdentifierBinding(structuralSource)) {
            return false;
        }
        String combined = code
                + " " + Optional.ofNullable(item.getId()).orElse("")
                + " " + Optional.ofNullable(item.getTitle()).orElse("")
                + " " + Optional.ofNullable(item.getDescription()).orElse("")
                + " " + contextCode
                + " " + Optional.ofNullable(additionalEvidence).orElse("")
                + " " + Optional.ofNullable(falsePositiveEvidence).orElse("")
                + " " + Optional.ofNullable(reasoning).orElse("")
                + " " + Optional.ofNullable(item.getAiReasoning()).orElse("");
        String lower = combined.toLowerCase(Locale.ROOT);
        if (containsSqlNeutralizerEvidence(lower) || containsHardcodedSqlOnlyEvidence(lower, structuralSource)) {
            return false;
        }
        // Trusted-source concat is handled as a mid-confidence RISKY SCHEME, not high-TP.
        if (hasSqlRiskyTrustedConcatPattern(item, context, additionalEvidence, falsePositiveEvidence, reasoning)) {
            return false;
        }
        boolean structuralConcat = hasStructuralSqlStringConcatEvidence(structuralSource);
        // Judge taint from code/context only — LLM prose ("likely HTTP") is not a source.
        String structuralLower = structuralSource.toLowerCase(Locale.ROOT);
        boolean untrustedSource = containsUntrustedSqlSourceEvidence(structuralLower);
        boolean rawConstruction = containsRawSqlConstructionEvidence(lower) || structuralConcat;
        return mentionsSqlExecution(combined) && untrustedSource && rawConstruction;
    }

    /**
     * Keep an already-scored mid-band SQL risky-scheme TP when the validator tries to downgrade to
     * UNCERTAIN/FP only because the current source looks trusted/unclear — without proving a new
     * attacker-controlled source or a real SQL neutralizer.
     */
    private boolean shouldPreserveSqlRiskyTrustedConcatVerdict(String previousVerdict, double previousConfidence,
                                                               String validatorVerdict, Item item,
                                                               CodeContextExtractor.CodeContext context,
                                                               String validatorExplanation) {
        if (!"TRUE_POSITIVE".equals(previousVerdict)
                || previousConfidence < 0.50d
                || previousConfidence > 0.60d
                || !isSqlInjectionFinding(item)
                || (!"UNCERTAIN".equals(validatorVerdict) && !"FALSE_POSITIVE".equals(validatorVerdict))) {
            return false;
        }
        String code = Optional.ofNullable(item.getCodeExtract()).orElse("");
        String contextCode = context == null ? "" : String.join("\n",
                Optional.ofNullable(context.functionBody()).orElse(""),
                Optional.ofNullable(context.localSnippet()).orElse(""),
                Optional.ofNullable(context.definitionContext()).orElse(""));
        String structuralSource = (code + "\n" + contextCode).trim();
        if (!hasStructuralSqlStringConcatEvidence(structuralSource)) {
            return false;
        }
        String reasoningLower = Optional.ofNullable(item.getAiReasoning()).orElse("").toLowerCase(Locale.ROOT);
        boolean priorRiskyScheme = reasoningLower.contains("risky scheme")
                || reasoningLower.contains("application-safe")
                || hasSqlRiskyTrustedConcatPattern(item, context, "", "", item.getAiReasoning());
        if (!priorRiskyScheme) {
            return false;
        }
        // Title often says "external input"; judge only code/context + validator text for attacker proof.
        String lower = (structuralSource + " " + Optional.ofNullable(validatorExplanation).orElse(""))
                .toLowerCase(Locale.ROOT);
        // Allow a real FP only when the validator cites a genuine SQL neutralizer.
        if ("FALSE_POSITIVE".equals(validatorVerdict) && containsSqlNeutralizerEvidence(lower)) {
            return false;
        }
        // Do not let "origin unclear" / trusted-source hesitation wipe a mid-band risky-scheme TP.
        return !containsUntrustedSqlSourceEvidence(lower);
    }

    /**
     * Trusted/literal/constant SQL operands concatenated into dynamic SQL — not exploitable from a
     * current attacker source, but an insecure scheme that should stay TRUE_POSITIVE at mid confidence.
     */
    private boolean hasSqlRiskyTrustedConcatPattern(Item item, CodeContextExtractor.CodeContext context,
                                                    String additionalEvidence, String falsePositiveEvidence,
                                                    String reasoning) {
        if (!isSqlInjectionFinding(item)
                || hasNumericSqlParameterEvidence(item, context, additionalEvidence, falsePositiveEvidence, reasoning)) {
            return false;
        }
        String code = Optional.ofNullable(item.getCodeExtract()).orElse("");
        String contextCode = context == null ? "" : String.join(" ",
                Optional.ofNullable(context.functionBody()).orElse(""),
                Optional.ofNullable(context.localSnippet()).orElse(""),
                Optional.ofNullable(context.definitionContext()).orElse(""));
        String callerCtx = context == null ? "" : String.join(" ",
                Optional.ofNullable(context.callerContext()).orElse(""),
                Optional.ofNullable(context.crossFileCallerContext()).orElse(""));
        String structuralSource = (code + "\n" + contextCode + "\n"
                + Optional.ofNullable(additionalEvidence).orElse("")).trim();
        String combined = code + " " + contextCode + " " + callerCtx
                + " " + Optional.ofNullable(additionalEvidence).orElse("")
                + " " + Optional.ofNullable(falsePositiveEvidence).orElse("")
                + " " + Optional.ofNullable(reasoning).orElse("")
                + " " + Optional.ofNullable(item.getAiReasoning()).orElse("");
        String lower = combined.toLowerCase(Locale.ROOT);
        if (hasKnexParameterizedIdentifierBinding(structuralSource) || containsSqlNeutralizerEvidence(lower)
                || !mentionsSqlExecution(combined)) {
            return false;
        }
        if (!hasStructuralSqlStringConcatEvidence(structuralSource)) {
            return false;
        }
        // Current attacker-controlled source => high TP, not risky-scheme band.
        if (containsUntrustedSqlSourceEvidence(lower)) {
            return false;
        }
        // Instance/JSON/resource fields in the SQL build are not "known safe app constants".
        if (sqlConcatUsesMutableOrExternalOperands(structuralSource + "\n" + combined)) {
            return false;
        }
        boolean originTag = lower.contains("all-callsites-pass-literal")
                || callerCtx.contains("[origin-tag: all-callsites-pass-literal-arg=true]");
        boolean literalOrConstantClaims = ((lower.contains("hardcoded")
                || lower.contains("string literal")
                || lower.contains("named constant")
                || lower.contains("static final")
                || lower.contains("application-safe")
                || lower.contains("app constant")
                || lower.contains("literal/constant"))
                && !lower.contains("not hardcoded")
                && !lower.contains("non-hardcoded")
                && !lower.contains("non-literal")
                && !lower.contains("not a literal"))
                || sqlConcatUsesOnlyStringLiterals(structuralSource);
        return originTag || literalOrConstantClaims;
    }

    private boolean sqlConcatUsesMutableOrExternalOperands(String code) {
        if (code == null || code.isBlank()) {
            return false;
        }
        String lower = code.toLowerCase(Locale.ROOT);
        // Do NOT treat ResultSet/rs.getString as mutable SQL operands — that is result reading,
        // not a source feeding the concatenated query text.
        boolean configOrRequestGetString = Pattern.compile(
                "(?is)\\b(?:json(?:object|node)?|objectnode|bundle|properties|props|config(?:uration)?|"
                        + "settings|request|req|params?)\\s*\\.\\s*getstring\\s*\\(")
                .matcher(code).find();
        return lower.contains("json.get")
                || configOrRequestGetString
                || lower.contains("getnativename")
                || lower.contains("getparameter(")
                || lower.contains("getoriginalfilename")
                || lower.contains("request.")
                || lower.contains("req.")
                || lower.contains("$_get")
                || lower.contains("$_post")
                || Pattern.compile("(?is)\\b(?:this|self)\\s*\\.\\s*[A-Za-z_]").matcher(code).find()
                || Pattern.compile("(?is)[\"'][^\"']*\\b(?:" + SQL_KEYWORD_REGEX + ")\\b[^\"']*[\"']\\s*[+.]\\s*"
                        + "(?:field|tableName|table_name|column|columnName|nativeName)\\b")
                .matcher(code).find();
    }

    private boolean sqlConcatUsesOnlyStringLiterals(String code) {
        if (code == null || code.isBlank()) {
            return false;
        }
        // "SELECT ..." + "users" / "CREATE INDEX " + "idx" — only quoted literals around +.
        return Pattern.compile(
                "(?is)[\"'][^\"']*\\b(?:" + SQL_KEYWORD_REGEX + ")\\b[^\"']*[\"']\\s*[+.]\\s*[\"']")
                .matcher(code).find()
                && !Pattern.compile(
                "(?is)[\"'][^\"']*\\b(?:" + SQL_KEYWORD_REGEX + ")\\b[^\"']*[\"']\\s*[+.]\\s*\\$?[A-Za-z_$]")
                .matcher(code).find();
    }

    /**
     * Positive SQL-safety evidence only. Negations such as "not parameterized" / "without prepared statement"
     * must not count as neutralizers.
     */
    private boolean containsSqlNeutralizerEvidence(String lower) {
        if (lower == null || lower.isBlank()) {
            return false;
        }
        boolean positiveParameterized = lower.contains("parameterized")
                || lower.contains("prepared statement")
                || lower.contains("prepared query")
                || lower.contains("setparameter")
                || lower.contains("placeholders")
                || lower.contains("bind_param")
                || lower.contains("bindvalue")
                || lower.contains("bindparam")
                || lower.contains("exec_params")
                || lower.contains("addwithvalue")
                || lower.contains("preparestatement")
                || lower.contains("pdo->prepare")
                || lower.contains("pdo::prepare")
                || lower.contains("mysqli_prepare")
                || lower.contains("bindparams")
                || lower.contains("db.querycontext");
        boolean negatedParameterized = lower.contains("without parameter")
                || lower.contains("not parameter")
                || lower.contains("no parameter")
                || lower.contains("unparameterized")
                || lower.contains("not prepared")
                || lower.contains("without prepared");
        boolean claimsParameterized = positiveParameterized && !negatedParameterized;
        boolean knexIdentifierBinding = lower.contains("??")
                && (lower.contains("knex.raw") || lower.contains("knex") && lower.contains(".raw(")
                || lower.contains("identifier placeholder"));
        boolean claimsAllowlist = (lower.contains("allowlist") || lower.contains("whitelist") || lower.contains("white list"))
                && !lower.contains("without allowlist")
                && !lower.contains("no allowlist")
                && !lower.contains("without whitelist");
        return claimsParameterized || knexIdentifierBinding || claimsAllowlist
                || lower.contains("ispropertymapped")
                || lower.contains("ispropertyenabled");
    }

    private static final String SQL_KEYWORD_REGEX =
            "select|insert|update|delete|where|from|create|drop|alter|merge|call|with|exec|truncate|index";

    private boolean containsHardcodedSqlOnlyEvidence(String lower, String code) {
        // Origin-tag / call-site literals are NOT proof the SQL text is hardcoded when the method
        // body concatenates identifiers into the query — handled separately by normalization.
        if (hasStructuralSqlStringConcatEvidence(code)) {
            return false;
        }
        // Positive hardcoded/literal claims only — exclude "not hardcoded" / "non-hardcoded" / "not a literal".
        boolean claimsHardcoded = (lower.contains("hardcoded")
                && !lower.contains("not hardcoded")
                && !lower.contains("non-hardcoded")
                && !lower.contains("non hardcoded")
                && !lower.contains("not a hardcoded"))
                || (lower.contains("string literal")
                && !lower.contains("not a string literal")
                && !lower.contains("not string literal")
                && !lower.contains("non-literal")
                && !lower.contains("non literal"))
                || lower.contains("named constant")
                || lower.contains("literal sql");
        // all-callsites-pass-literal only counts when there is no structural concat (checked above).
        if (claimsHardcoded || lower.contains("all-callsites-pass-literal")) {
            return true;
        }
        // Pure literal SQL in the extract with no identifier concatenation.
        String compact = Optional.ofNullable(code).orElse("").replaceAll("\\s+", " ");
        return Pattern.compile("(?is)[\"']\\s*(select|insert|update|delete|create|drop|alter)\\b[^\"']*[\"']")
                .matcher(compact).find()
                && !hasStructuralSqlStringConcatEvidence(code);
    }

    private boolean hasStructuralSqlStringConcatEvidence(String code) {
        if (code == null || code.isBlank()) {
            return false;
        }
        boolean hasSqlKeyword = Pattern.compile("(?is)\\b(?:" + SQL_KEYWORD_REGEX + ")\\b")
                .matcher(code).find();
        // Java/JS/C#/Kotlin '+' concat; PHP '.' concat — require identifier after operator.
        boolean directLiteralPlusId = Pattern.compile(
                "(?is)[\"'][^\"']*\\b(?:" + SQL_KEYWORD_REGEX + ")\\b[^\"']*[\"']\\s*[+.]\\s*\\$?[A-Za-z_$]")
                .matcher(code).find()
                || Pattern.compile(
                "(?is)\\$?[A-Za-z_$][\\w$]*\\s*[+.]\\s*[\"'][^\"']*\\b(?:" + SQL_KEYWORD_REGEX + ")\\b")
                .matcher(code).find()
                // format / sprintf families
                || Pattern.compile(
                "(?is)\\b(?:string\\.format|messageformat\\.format|str\\.format|fmt\\.sprintf|sprintf|printf|"
                        + "strings\\.replace)\\s*\\(\\s*[\"'][^\"']*"
                        + "\\b(?:" + SQL_KEYWORD_REGEX + ")\\b[^\"']*[\"']\\s*,")
                .matcher(code).find()
                || Pattern.compile(
                "(?is)\\.append\\s*\\(\\s*[\"'][^\"']*\\b(?:" + SQL_KEYWORD_REGEX + ")\\b")
                .matcher(code).find()
                || Pattern.compile(
                "(?is)\\b(?:query|sql|statement|sb|builder|indexname)[\\w$]*\\.append\\s*\\(\\s*\\$?[A-Za-z_$]")
                .matcher(code).find()
                // Python f-string / %-format with SQL keyword
                || Pattern.compile(
                "(?is)f[\"'][^\"']*\\b(?:" + SQL_KEYWORD_REGEX + ")\\b[^\"']*\\{")
                .matcher(code).find()
                || Pattern.compile(
                "(?is)[\"'][^\"']*\\b(?:" + SQL_KEYWORD_REGEX + ")\\b[^\"']*%[sd]\\b[^\"']*[\"']\\s*%")
                .matcher(code).find()
                // JS/TS template literals
                || Pattern.compile(
                "(?is)`[^`]*\\b(?:" + SQL_KEYWORD_REGEX + ")\\b[^`]*\\$\\{")
                .matcher(code).find()
                // C# interpolated strings
                || Pattern.compile(
                "(?is)\\$\"[^\"]*\\b(?:" + SQL_KEYWORD_REGEX + ")\\b[^\"]*\\{")
                .matcher(code).find()
                // Ruby "#{...}" interpolation
                || Pattern.compile(
                "(?is)[\"'][^\"']*\\b(?:" + SQL_KEYWORD_REGEX + ")\\b[^\"']*#\\{")
                .matcher(code).find()
                // PHP "SELECT ... $var" / "SELECT ... {$var}"
                || Pattern.compile(
                "(?is)\"[^\"]*\\b(?:" + SQL_KEYWORD_REGEX + ")\\b[^\"]*(?:\\{\\s*\\$[A-Za-z_]|\\$[A-Za-z_])")
                .matcher(code).find();
        if (directLiteralPlusId) {
            return true;
        }
        // Multi-line sink("SELECT..." + / . / interpolation ... identifier) across languages.
        boolean sqlExecWithIdentifierConcat = hasSqlKeyword && Pattern.compile(
                "(?is)\\b" + SQL_EXEC_API_REGEX + "[\\s\\S]{0,1200}?"
                        + "(?:[+.]\\s*\\$?[A-Za-z_$][\\w$]*|\\$\\{[\\w$]+\\}|#\\{[\\w$@]+\\}|f[\"'`])")
                .matcher(code).find();
        return sqlExecWithIdentifierConcat;
    }

    /**
     * Knex {@code ??} binds SQL identifiers (table/index/column names). That is parameterization,
     * not string-concatenated injection.
     */
    static boolean hasKnexParameterizedIdentifierBinding(String code) {
        if (code == null || code.isBlank()) {
            return false;
        }
        boolean knexRaw = Pattern.compile("(?is)\\b(?:knex|db\\.connection|this\\.connection)\\s*\\.\\s*raw\\s*\\(")
                .matcher(code).find()
                || Pattern.compile("(?is)\\.raw\\s*\\(").matcher(code).find() && code.toLowerCase(Locale.ROOT).contains("knex");
        boolean identifierPlaceholder = code.contains("??");
        return knexRaw && identifierPlaceholder;
    }

    private boolean containsUntrustedSqlSourceEvidence(String lower) {
        return lower.contains("gui_input")
                || lower.contains("gui input")
                || lower.contains("gui field")
                || lower.contains("gui component")
                || lower.contains("jtextfield")
                || lower.contains("jcombobox")
                || lower.contains("text field")
                || lower.contains("desktop gui")
                || lower.contains("http_request")
                || lower.contains("http request")
                || lower.contains("request parameter")
                || lower.contains("request.getparameter")
                || lower.contains("getparameter(")
                || lower.contains("request.get")
                || lower.contains("request.post")
                || lower.contains("request.args")
                || lower.contains("request.query")
                || lower.contains("req.query")
                || lower.contains("req.body")
                || lower.contains("req.params")
                || lower.contains("$_get")
                || lower.contains("$_post")
                || lower.contains("$_request")
                || lower.contains("params[")
                || lower.contains("form field")
                || lower.contains("file_untrusted")
                || lower.contains("url_fragment")
                || lower.contains("user input")
                || lower.contains("user-controlled")
                || lower.contains("attacker-controlled")
                || lower.contains("external input")
                || lower.contains("unsanitized user")
                || lower.contains("not hardcoded")
                || lower.contains("non-hardcoded")
                || lower.contains("not a literal")
                || lower.contains("not literal");
    }

    private boolean containsRawSqlConstructionEvidence(String lower) {
        return lower.contains("does not explicitly validate or sanitize")
                || lower.contains("does not validate")
                || lower.contains("doesn't validate")
                || lower.contains("no validation")
                || lower.contains("not validate")
                || lower.contains("without validation")
                || lower.contains("without sanitization")
                || lower.contains("without parameterization")
                || lower.contains("unsanitized")
                || lower.contains("unvalidated")
                || lower.contains("raw sql")
                || lower.contains("dynamic sql")
                || lower.contains("string concatenation")
                || lower.contains("concatenated")
                || lower.contains("concatenate")
                || lower.contains("string/raw text")
                || lower.contains("string value")
                || lower.contains("used in the sql query")
                || lower.contains("using it in the sql query")
                || lower.contains("sql query without parameterization")
                || lower.contains("interpolat")
                || lower.contains("f-string")
                || lower.contains("template literal")
                || lower.contains("string interpolation")
                || lower.contains("sprintf")
                || lower.contains("fmt.sprintf");
    }

    private boolean isHttpHeaderInjectionFinding(Item item, SastRuleMetadata metadata) {
        String combined = (Optional.ofNullable(item.getId()).orElse("")
                + " " + Optional.ofNullable(item.getTitle()).orElse("")
                + " " + Optional.ofNullable(item.getDescription()).orElse("")
                + " " + Optional.ofNullable(item.getCodeExtract()).orElse(""))
                .toLowerCase(Locale.ROOT);
        if (combined.contains("http_response_splitting")
                || combined.contains("response splitting")
                || combined.contains("header injection")
                || combined.contains("crlf")
                || combined.contains("addheader")
                || combined.contains("setheader")
                || combined.contains("sendredirect")
                || (combined.contains("location") && combined.contains("header"))
                || (combined.contains("unsanitized user input in http response"))) {
            return true;
        }
        if (metadata != null && metadata.cweIds() != null) {
            return metadata.cweIds().stream().anyMatch(cwe ->
                    "113".equals(cwe) || "CWE-113".equalsIgnoreCase(cwe)
                            || "93".equals(cwe) || "CWE-93".equalsIgnoreCase(cwe));
        }
        return false;
    }

    private boolean citesWeakHeaderNeutralizerOnly(String falsePositiveEvidence, String reasoning) {
        String combined = (Optional.ofNullable(falsePositiveEvidence).orElse("")
                + " " + Optional.ofNullable(reasoning).orElse("")).toLowerCase(Locale.ROOT);
        if (combined.isBlank()) {
            return false;
        }
        boolean citesWeak = combined.contains("regex")
                || combined.contains("regex pattern")
                || combined.contains("matcher.group")
                || combined.contains("matcher")
                || combined.contains("capture group")
                || combined.contains("group(1)")
                || combined.contains("urldecoder")
                || combined.contains("url decode")
                || combined.contains("url decoding")
                || combined.contains("urldecoder.decode")
                || combined.contains("removes '..'")
                || combined.contains("remove '..'")
                || combined.contains("removing '..'")
                || combined.contains("invalid '..'")
                || combined.contains("path traversal")
                || combined.contains("controlled subset")
                || combined.contains("single group");
        boolean citesRealNeutralizer =
                (combined.contains("strip") || combined.contains("remove") || combined.contains("encode")
                        || combined.contains("sanitize") || combined.contains("neutral"))
                        && (combined.contains("crlf") || combined.contains("cr/lf")
                        || combined.contains("newline") || combined.contains("line break")
                        || combined.contains("\\r") || combined.contains("\\n"))
                || combined.contains("allowlist")
                || combined.contains("white list")
                || combined.contains("whitelist")
                || combined.contains("encodeheader")
                || combined.contains("httpheaders.encode");
        // Validator often claims "no evidence of CRLF" without proving a neutralizer — treat as weak.
        boolean absenceClaim = combined.contains("no evidence of unsanitized crlf")
                || combined.contains("no evidence of crlf")
                || combined.contains("there is no evidence of unsanitized crlf")
                || combined.contains("not vulnerable to http response splitting")
                || combined.contains("limits the input")
                || ((combined.contains("crlf") || combined.contains("cr/lf"))
                    && (combined.contains("no evidence") || combined.contains("not vulnerable")));
        return (citesWeak || absenceClaim) && !citesRealNeutralizer;
    }

    private boolean isMissingDatabaseAuthenticationFinding(Item item, SastRuleMetadata metadata) {
        String combined = (Optional.ofNullable(item.getId()).orElse("")
                + " " + Optional.ofNullable(item.getTitle()).orElse(""))
                .toLowerCase(Locale.ROOT);
        if (combined.contains("missing_database_authentication")
                || combined.contains("missing authentication for database")
                || combined.contains("missing database authentication")) {
            return true;
        }
        return metadata != null
                && metadata.cweIds() != null
                && metadata.cweIds().stream().anyMatch(cwe ->
                "306".equals(cwe) || "CWE-306".equalsIgnoreCase(cwe));
    }

    /**
     * Language-agnostic signal that DB/service credentials are explicitly null/empty near the finding.
     * Does not infer FALSE_POSITIVE from argument count alone.
     */
    private boolean hasProvenEmptyDatabaseCredentialsEvidence(Item item, CodeContextExtractor.CodeContext context,
                                                              String falsePositiveEvidence, String reasoning) {
        String idTitle = (Optional.ofNullable(item.getId()).orElse("")
                + " " + Optional.ofNullable(item.getTitle()).orElse("")).toLowerCase(Locale.ROOT);
        if (!(idTitle.contains("missing_database_authentication")
                || idTitle.contains("missing authentication for database")
                || idTitle.contains("missing database authentication")
                || idTitle.contains("missing authentication"))) {
            return false;
        }
        String combined = Optional.ofNullable(item.getCodeExtract()).orElse("");
        if (context != null) {
            combined = combined + "\n" + Optional.ofNullable(context.functionBody()).orElse("")
                    + "\n" + Optional.ofNullable(context.localSnippet()).orElse("")
                    + "\n" + Optional.ofNullable(context.definitionContext()).orElse("");
        }
        combined = combined + "\n" + Optional.ofNullable(falsePositiveEvidence).orElse("")
                + "\n" + Optional.ofNullable(reasoning).orElse("");
        return Pattern.compile(
                "(?is)\\b(?:password|passwd|pwd|pass|secret|token|api[_-]?key|credential|credentials)"
                        + "\\b\\s*[:=]\\s*(?:null|none|undefined|nil|\"\"|'')")
                .matcher(combined).find()
                || Pattern.compile(
                "(?is)\\b(?:password|passwd|pwd|pass|secret|token)\\b\\s*==\\s*(?:null|none|undefined|nil|\"\"|'')")
                .matcher(combined).find()
                || Pattern.compile("(?is)\\b(?:password|passwd|pwd)\\s*=\\s*new\\s+string\\s*\\(\\s*\\)")
                .matcher(combined).find();
    }

    private boolean mentionsSqlExecution(String text) {
        String lower = Optional.ofNullable(text).orElse("").toLowerCase(Locale.ROOT);
        return lower.contains("sql")
                || lower.contains("query")
                || lower.contains("execute")
                || lower.contains("jdbc")
                || lower.contains("hibernate")
                || lower.contains("jpa")
                || lower.contains("where ")
                || lower.contains("select ")
                || lower.contains("insert ")
                || lower.contains("update ")
                || lower.contains("delete ")
                || lower.contains("create index")
                || lower.contains("create table")
                || lower.contains("drop table")
                || lower.contains("alter table");
    }

    private boolean hasWeakHashPasswordEvidence(Item item, String falsePositiveEvidence, String reasoning) {
        String combined = Optional.ofNullable(item.getId()).orElse("")
                + " " + Optional.ofNullable(item.getTitle()).orElse("")
                + " " + Optional.ofNullable(item.getDescription()).orElse("")
                + " " + Optional.ofNullable(item.getCodeExtract()).orElse("")
                + " " + Optional.ofNullable(falsePositiveEvidence).orElse("")
                + " " + Optional.ofNullable(reasoning).orElse("");
        return isWeakHashFinding(item, combined)
                && PASSWORD_HASH_PURPOSE_PATTERN.matcher(combined).find()
                && !combined.toLowerCase(Locale.ROOT).contains("hmac");
    }

    private boolean isWeakHashFinding(Item item, String combinedEvidence) {
        String combined = Optional.ofNullable(combinedEvidence).orElse("").toLowerCase(Locale.ROOT);
        if (combined.contains("weak_hash")
                || combined.contains("weak hash")
                || combined.contains("weak hashing")
                || WEAK_HASH_EVIDENCE_PATTERN.matcher(combinedEvidence).find()) {
            return true;
        }
        List<String> cweIds = item.getCweIds();
        return cweIds != null
                && cweIds.stream().anyMatch(cwe -> "327".equals(cwe)
                || "328".equals(cwe)
                || "916".equals(cwe)
                || "CWE-327".equalsIgnoreCase(cwe)
                || "CWE-328".equalsIgnoreCase(cwe)
                || "CWE-916".equalsIgnoreCase(cwe));
    }

    private boolean hasLocalOnlyNonSensitiveLeakEvidence(Item item, String falsePositiveEvidence, String reasoning) {
        if (!isInformationLeakFinding(item)) {
            return false;
        }
        String combined = Optional.ofNullable(item.getCodeExtract()).orElse("")
                + " " + Optional.ofNullable(item.getDescription()).orElse("")
                + " " + Optional.ofNullable(falsePositiveEvidence).orElse("")
                + " " + Optional.ofNullable(reasoning).orElse("");
        String lower = combined.toLowerCase(Locale.ROOT);
        return containsLocalOnlyConsoleExposureEvidence(lower)
                && !containsConcreteSensitiveLeakEvidence(lower)
                && !containsExternalLeakExposureEvidence(lower);
    }

    private boolean isInformationLeakFinding(Item item) {
        String combined = (Optional.ofNullable(item.getId()).orElse("")
                + " " + Optional.ofNullable(item.getTitle()).orElse("")
                + " " + Optional.ofNullable(item.getDescription()).orElse(""))
                .toLowerCase(Locale.ROOT);
        if (combined.contains("information_leakage")
                || combined.contains("information leak")
                || combined.contains("sensitive information")
                || combined.contains("exception_leak")
                || combined.contains("logger_leak")
                || combined.contains("exception message")
                || combined.contains("printstacktrace")) {
            return true;
        }
        List<String> cweIds = item.getCweIds();
        return cweIds != null
                && cweIds.stream().anyMatch(cwe -> "209".equals(cwe)
                || "532".equals(cwe)
                || "CWE-209".equalsIgnoreCase(cwe)
                || "CWE-532".equalsIgnoreCase(cwe));
    }

    private boolean containsLocalOnlyConsoleExposureEvidence(String lower) {
        boolean localSink = lower.contains("printstacktrace")
                || lower.contains("system.err")
                || lower.contains("system.out")
                || lower.contains("stderr")
                || lower.contains("stdout")
                || lower.contains("console output")
                || lower.contains("local console");
        boolean localContext = lower.contains("desktop")
                || lower.contains("gui application")
                || lower.contains("swing")
                || lower.contains("javafx")
                || lower.contains("awt")
                || lower.contains("cli")
                || lower.contains("local")
                || lower.contains("not logged")
                || lower.contains("not sent")
                || lower.contains("no external")
                || lower.contains("not exposed")
                || lower.contains("not returned");
        return localSink && localContext;
    }

    private boolean containsConcreteSensitiveLeakEvidence(String lower) {
        if (lower.contains("no concrete secret")
                || lower.contains("without concrete secret")
                || lower.contains("no secrets")
                || lower.contains("no credentials")
                || lower.contains("no tokens")
                || lower.contains("no sensitive")
                || lower.contains("does not expose sensitive")
                || lower.contains("doesn't expose sensitive")) {
            return false;
        }
        return lower.contains("password")
                || lower.contains("passwd")
                || lower.contains("token")
                || lower.contains("secret")
                || lower.contains("api key")
                || lower.contains("apikey")
                || lower.contains("authorization")
                || lower.contains("cookie")
                || lower.contains("session id")
                || lower.contains("connection string")
                || lower.contains("jdbc:")
                || lower.contains("private key")
                || lower.contains("access key")
                || lower.contains("credit card")
                || lower.contains("ssn")
                || lower.contains("personal data")
                || lower.contains("pii");
    }

    private boolean containsExternalLeakExposureEvidence(String lower) {
        if (lower.contains("not sent to external")
                || lower.contains("not logged or sent")
                || lower.contains("no external")
                || lower.contains("not exposed")
                || lower.contains("not returned")) {
            return lower.contains("http response")
                    || lower.contains("api response")
                    || lower.contains("returned to client")
                    || lower.contains("sent to client")
                    || lower.contains("shown to user")
                    || lower.contains("displayed to user")
                    || lower.contains("joptionpane.showmessagedialog");
        }
        return lower.contains("http response")
                || lower.contains("api response")
                || lower.contains("returned to client")
                || lower.contains("sent to client")
                || lower.contains("shown to user")
                || lower.contains("displayed to user")
                || lower.contains("joptionpane.showmessagedialog")
                || lower.contains("server log")
                || lower.contains("shared log")
                || lower.contains("centralized log")
                || lower.contains("file log")
                || lower.contains("telemetry")
                || lower.contains("sentry")
                || lower.contains("external system")
                || lower.contains("remote attacker");
    }

    /**
     * Returns true when the false_positive_evidence or reasoning explicitly cites an in-function
     * sandbox, allowlist, restriction, or security guard — proof that the function itself prevents
     * untrusted input from being executed, regardless of who calls it.
     */
    private boolean containsSandboxingEvidence(String falsePositiveEvidence, String reasoning) {
        String combined = (Optional.ofNullable(falsePositiveEvidence).orElse("")
                + " " + Optional.ofNullable(reasoning).orElse("")).toLowerCase(Locale.ROOT);
        return combined.contains("allowlist")
                || combined.contains("allow list")
                || combined.contains("allow-list")
                || combined.contains("whitelist")
                || combined.contains("sandbox")
                || combined.contains("security manager")
                || combined.contains("securitymanager")
                || combined.contains("blocklist")
                || combined.contains("denylist")
                || combined.contains("elresolver")
                || combined.contains("reflectionblocker")
                || combined.contains("reflection blocker")
                || combined.contains("pattern.matches")
                || combined.contains("pattern match")
                || combined.contains("input validation")
                || combined.contains("input restriction")
                || combined.contains("reject")
                || combined.contains("forbidden")
                || combined.contains("not permitted")
                || combined.contains("access control")
                || combined.contains("throws.*exception.*illegal")
                || combined.contains("throws.*securityexception");
    }

    private boolean isHtmlInjectionSink(Item item) {
        String combined = (Optional.ofNullable(item.getCodeExtract()).orElse("")
                + " " + Optional.ofNullable(item.getDescription()).orElse("")
                + " " + Optional.ofNullable(item.getTitle()).orElse("")).toLowerCase(Locale.ROOT);
        return combined.contains("innerhtml")
                || combined.contains("insertadjacenthtml")
                || combined.contains("outerhtml")
                || combined.contains("dangerouslysetinnerhtml")
                || combined.contains("mark_safe")
                || combined.contains("v-html");
    }

    private boolean reliesOnTrustedServerResponseReasoning(String falsePositiveEvidence, String reasoning) {
        String combined = (Optional.ofNullable(falsePositiveEvidence).orElse("")
                + " " + Optional.ofNullable(reasoning).orElse("")).toLowerCase(Locale.ROOT);
        boolean mentionsServerResponse = combined.contains("server response")
                || combined.contains("server-rendered")
                || combined.contains("server rendered")
                || combined.contains("json response")
                || combined.contains("backend")
                || combined.contains("api response")
                || combined.contains("fetch response")
                || combined.contains("data.message")
                || combined.contains("data.error")
                || combined.contains("response is")
                || combined.contains("response data");
        boolean claimsTrust = combined.contains("not attacker-controlled")
                || combined.contains("not attacker controlled")
                || combined.contains("not directly attacker-controlled")
                || combined.contains("not directly attacker controlled")
                || combined.contains("trusted")
                || combined.contains("safe")
                || combined.contains("unlikely to be exploited")
                || combined.contains("unlikely to be exploitable");
        return mentionsServerResponse && claimsTrust;
    }

    private boolean containsHtmlNeutralizationEvidence(String falsePositiveEvidence, String reasoning) {
        String combined = (Optional.ofNullable(falsePositiveEvidence).orElse("")
                + " " + Optional.ofNullable(reasoning).orElse("")).toLowerCase(Locale.ROOT);
        return combined.contains("dompurify")
                || combined.contains("sanitize")
                || combined.contains("sanitized")
                || combined.contains("escaped")
                || combined.contains("escape(")
                || combined.contains("htmlspecialchars")
                || combined.contains("textcontent")
                || combined.contains("innertext")
                || combined.contains("createtextnode")
                || combined.contains("create text node")
                || combined.contains("format_html")
                || combined.contains("flatatt")
                || combined.contains("h(");
    }

    private ValidatorVerdict normalizeValidatorFalsePositive(Item item, CodeContextExtractor.CodeContext context,
                                                             SastRuleMetadata metadata, String verdict, double confidence,
                                                             String explanation, String itemRef) {
        if (!"FALSE_POSITIVE".equals(verdict)) {
            return new ValidatorVerdict(verdict, confidence, explanation);
        }
        if (citesProposedRemediationAsAppliedSafetyEvidence(explanation)) {
            double normalizedConfidence = Math.min(confidence, 0.75d);
            String normalizedExplanation = appendNormalizationReason(explanation,
                    "Proposed remediation code is not applied code and cannot prove that the current finding "
                            + "is neutralized. Existing repository code must contain the sanitizer, escaping, "
                            + "text-only sink, allowlist, framework guarantee, or trusted-source proof.");
            log.warn("[SastVerification] Validator used proposed remediation as false-positive evidence for {}; "
                    + "normalizing to UNCERTAIN", itemRef);
            return new ValidatorVerdict("UNCERTAIN", normalizedConfidence, normalizedExplanation);
        }
        if (hasNumericSqlParameterEvidence(item, context, "", explanation)) {
            return new ValidatorVerdict(verdict, Math.max(confidence, 0.85d), explanation);
        }
        if (isRegexDosFinding(item, metadata) && hasRegexEscapeSafetyEvidence(item, explanation)) {
            return new ValidatorVerdict(verdict, Math.max(confidence, 0.85d), explanation);
        }
        if (isOpenRedirectFinding(item, metadata) && hasOpenRedirectSafetyEvidence(item, explanation)) {
            return new ValidatorVerdict(verdict, Math.max(confidence, 0.85d), explanation);
        }
        if (isPathTraversalFinding(item, metadata) && hasMultipartTempPathEvidence(item, context, explanation)) {
            return new ValidatorVerdict(verdict, Math.max(confidence, 0.90d), explanation);
        }
        if (hasLocalOnlyNonSensitiveLeakEvidence(item, "", explanation)) {
            return new ValidatorVerdict(verdict, Math.max(confidence, 0.85d), explanation);
        }
        // CWE-330/338: non-security PRNG use (sleep/jitter/fake data) is valid FP without sanitizer evidence.
        if (isInsufficientRandomFinding(item, metadata)
                && hasNonSecurityRandomUseEvidence(item, context, explanation)) {
            return new ValidatorVerdict(verdict, Math.max(confidence, 0.85d), explanation);
        }
        // Weak hash for cache/fingerprint/checksum is valid FP without sanitizer evidence.
        if (isWeakHashFinding(item, Optional.ofNullable(item.getCodeExtract()).orElse(""))
                && hasNonSecurityWeakHashEvidence(item, context, null)) {
            return new ValidatorVerdict(verdict, Math.max(confidence, 0.85d), explanation);
        }
        // HMAC-SHA1/MD5 required by a protocol (OAuth 1.0) is valid FP without sanitizer evidence.
        if (isWeakHashFinding(item, Optional.ofNullable(item.getCodeExtract()).orElse(""))
                && looksLikeProtocolHmac(Optional.ofNullable(item.getCodeExtract()).orElse("")
                + " " + Optional.ofNullable(explanation).orElse(""))) {
            return new ValidatorVerdict(verdict, Math.max(confidence, 0.85d), explanation);
        }
        // JWT claim-peek + verified auth path is valid FP without sanitizer evidence.
        if (isJwtVerificationBypassFinding(item, metadata)
                && looksLikeJwtClaimPeekWithVerifiedAuthPath(item, context)) {
            return new ValidatorVerdict(verdict, Math.max(confidence, 0.85d), explanation);
        }
        // CWE-94/95: if the model already chose FALSE_POSITIVE for setattr/attribute wiring (no exec sink,
        // no name-controlled mass assignment), accept it without requiring a sanitizer citation.
        if (hasNonExecutionCodeInjectionWiringEvidence(item, context)) {
            return new ValidatorVerdict(verdict, Math.max(confidence, 0.85d), explanation);
        }
        // Exception/log leak: generic / same-user validation feedback is valid FP without sanitizer evidence.
        if (isLoggingOrExceptionLeakFinding(item, metadata)
                && (LoggingEvidenceBuilder.looksLikeSameUserValidationFeedback(
                        Optional.ofNullable(item.getCodeExtract()).orElse(""))
                || (LoggingEvidenceBuilder.hasNoObviousSecretContent(
                        Optional.ofNullable(item.getCodeExtract()).orElse(""))
                && (LoggingEvidenceBuilder.looksLikeGenericValidationException(
                        Optional.ofNullable(item.getCodeExtract()).orElse(""))
                || LoggingEvidenceBuilder.hasNoObviousSecretContent(explanation)
                        && explanation != null
                        && explanation.toLowerCase(Locale.ROOT).contains("validation"))))) {
            return new ValidatorVerdict(verdict, Math.max(confidence, 0.85d), explanation);
        }
        if (citesWeakHeaderNeutralizerOnly(explanation, "")
                && isHttpHeaderInjectionFinding(item, null)) {
            double normalizedConfidence = Math.min(confidence, 0.75d);
            String normalizedExplanation = appendNormalizationReason(explanation,
                    "Regex/URL-decode/path-'..' reasoning is not positive safety evidence for HTTP header "
                            + "injection or response splitting.");
            log.warn("[SastVerification] Validator cited weak header neutralizer as safety evidence for {}; "
                    + "normalizing to UNCERTAIN", itemRef);
            return new ValidatorVerdict("UNCERTAIN", normalizedConfidence, normalizedExplanation);
        }
        
        // Accept FALSE_POSITIVE if there is positive safety evidence, even if source trace is missing.
        // For Path Traversal: safe construction patterns (fixed base dir, CLI tool, etc.) are sufficient.
        // For other vulnerabilities: sanitizers, escaping, framework guarantees, etc. are sufficient.
        if (containsPositiveSafetyEvidence(item, explanation)) {
            // Minor confidence reduction if source trace is missing, but still accept as FALSE_POSITIVE
            if (mentionsMissingSourceOrNeutralizationTrace(explanation)) {
                double adjustedConfidence = Math.max(0.75d, Math.min(confidence, 0.85d));
                log.debug("[SastVerification] Accepting FALSE_POSITIVE for {} with positive safety evidence, "
                        + "despite missing source trace (confidence adjusted to {})", itemRef, adjustedConfidence);
                return new ValidatorVerdict(verdict, adjustedConfidence, explanation);
            }
            return new ValidatorVerdict(verdict, confidence, explanation);
        }

        double normalizedConfidence = Math.min(confidence, 0.75d);
        String normalizedExplanation = appendNormalizationReason(explanation,
                "False-positive verdict requires positive safety evidence: sanitizer, escaping, text-only sink, "
                        + "allowlist, framework guarantee, numeric SQL parameter, local-only non-sensitive log exposure, "
                        + "regex metacharacter escaping / literal quoting, same-origin/relative-only redirect construction, "
                        + "or a proven trusted source. Source trace or neutralization proof is missing, so the finding "
                        + "remains UNCERTAIN.");
        log.warn("[SastVerification] Validator marked FALSE_POSITIVE for {} without positive safety evidence; "
                + "normalizing to UNCERTAIN", itemRef);
        return new ValidatorVerdict("UNCERTAIN", normalizedConfidence, normalizedExplanation);
    }

    private boolean containsPositiveSafetyEvidence(Item item, String explanation) {
        String explanationLower = Optional.ofNullable(explanation).orElse("").toLowerCase(Locale.ROOT);
        String codeLower = Optional.ofNullable(item.getCodeExtract()).orElse("").toLowerCase(Locale.ROOT);
        String combined = explanationLower + " " + codeLower;

        return containsHtmlNeutralizationEvidence("", combined)
                || containsSandboxingEvidence("", combined)
                || containsFrameworkSafetyGuarantee(combined)
                || hasNumericSqlParameterEvidence(item, "", combined)
                || hasLocalOnlyNonSensitiveLeakEvidence(item, "", combined)
                || (isRegexDosFinding(item, null) && hasRegexEscapeSafetyEvidence(item, explanation))
                || (isOpenRedirectFinding(item, null) && hasOpenRedirectSafetyEvidence(item, explanation))
                || (isPathTraversalFinding(item, null) && (
                isMultipartTempPathPresent(item.getCodeExtract(), explanation)
                        || (doesSinkUseParserTempPath(item.getCodeExtract())
                        && isMultipartTempPathMentioned(explanation))
                        || hasPathTraversalSafetyEvidence(item, explanation)))
                // Trusted-source claims must come from the reviewer explanation, not Java keywords in code
                // (e.g. handleRequestInternal / static / config field names).
                || containsTrustedSourceEvidence(explanationLower)
                || containsTextOnlySinkEvidence(combined)
                || hasKnexParameterizedIdentifierBinding(Optional.ofNullable(item.getCodeExtract()).orElse(""))
                || looksLikeProtocolHmac(combined);
    }

    private boolean isRegexDosFinding(Item item, SastRuleMetadata metadata) {
        if (metadata != null && metadata.family() == VulnerabilityFamily.REGEX_DOS) {
            return true;
        }
        if (item == null) {
            return false;
        }
        List<String> cweIds = item.getCweIds();
        if (cweIds != null && cweIds.stream().anyMatch(cwe -> {
            String normalized = Optional.ofNullable(cwe).orElse("").toUpperCase(Locale.ROOT).replace("CWE-", "").trim();
            return "1333".equals(normalized) || "1287".equals(normalized) || "625".equals(normalized);
        })) {
            return true;
        }
        String combined = (Optional.ofNullable(item.getId()).orElse("")
                + " " + Optional.ofNullable(item.getTitle()).orElse("")).toLowerCase(Locale.ROOT);
        return combined.contains("regex") || combined.contains("regexp") || combined.contains("redos");
    }

    private boolean hasRegexEscapeSafetyEvidence(Item item, String... texts) {
        return RegexEscapeEvidence.present(item == null ? null : item.getCodeExtract(), texts);
    }

    private boolean isOpenRedirectFinding(Item item, SastRuleMetadata metadata) {
        if (metadata != null && metadata.family() == VulnerabilityFamily.OPEN_REDIRECT) {
            return true;
        }
        if (item == null) {
            return false;
        }
        List<String> cweIds = item.getCweIds();
        if (cweIds != null && cweIds.stream().anyMatch(cwe -> {
            String normalized = Optional.ofNullable(cwe).orElse("").toUpperCase(Locale.ROOT).replace("CWE-", "").trim();
            return "601".equals(normalized);
        })) {
            return true;
        }
        String combined = (Optional.ofNullable(item.getId()).orElse("")
                + " " + Optional.ofNullable(item.getTitle()).orElse("")).toLowerCase(Locale.ROOT);
        return combined.contains("open redirect") || combined.contains("open_redirect");
    }

    private boolean isPathTraversalFinding(Item item, SastRuleMetadata metadata) {
        if (metadata != null && metadata.family() == VulnerabilityFamily.PATH_TRAVERSAL) {
            return true;
        }
        if (item == null) {
            return false;
        }
        List<String> cweIds = item.getCweIds();
        if (cweIds != null && cweIds.stream().anyMatch(cwe -> {
            String normalized = Optional.ofNullable(cwe).orElse("").toUpperCase(Locale.ROOT).replace("CWE-", "").trim();
            return "22".equals(normalized) || "73".equals(normalized) || "98".equals(normalized)
                    || "23".equals(normalized) || "36".equals(normalized);
        })) {
            return true;
        }
        String combined = (Optional.ofNullable(item.getId()).orElse("")
                + " " + Optional.ofNullable(item.getTitle()).orElse("")).toLowerCase(Locale.ROOT);
        return combined.contains("path traversal") || combined.contains("path_traversal")
                || combined.contains("directory traversal");
    }

    private boolean hasMultipartTempPathEvidence(Item item, CodeContextExtractor.CodeContext context,
                                                String... texts) {
        List<String> extra = new ArrayList<>();
        if (context != null) {
            extra.add(context.functionBody());
            extra.add(context.localSnippet());
            extra.add(context.definitionContext());
            extra.add(context.callerContext());
            extra.add(context.crossFileCallerContext());
            extra.add(context.frameworkContext());
            if (context.relatedFiles() != null) {
                for (CodeContextExtractor.RelatedSnippet related : context.relatedFiles()) {
                    if (related != null) {
                        extra.add(related.snippet());
                    }
                }
            }
        }
        if (texts != null) {
            extra.addAll(Arrays.asList(texts));
        }
        return isMultipartTempPathPresent(
                item == null ? null : item.getCodeExtract(), extra.toArray(String[]::new));
    }

    /**
     * Helper methods for multipart temp path evidence detection.
     */
    private static boolean isMultipartTempPathPresent(String codeExtract, String... texts) {
        String combined = (codeExtract != null ? codeExtract : "") + " "
                + String.join(" ", texts != null ? texts : new String[0]);
        String lower = combined.toLowerCase(Locale.ROOT);
        
        return lower.contains("tmpworkingdirectory")
                || lower.contains("tmp working directory")
                || lower.contains("parser temp")
                || lower.contains("multipart parser temp")
                || lower.contains("file.tmpworkingdirectory")
                || (lower.contains("file.path") && (lower.contains("formidable") || lower.contains("busboy") || lower.contains("multer")))
                || (lower.contains("file.filepath") && (lower.contains("formidable") || lower.contains("busboy") || lower.contains("multer")))
                || lower.contains("multipart parser temp path")
                || lower.contains("framework-controlled temp");
    }
    
    private static boolean doesSinkUseParserTempPath(String codeExtract) {
        if (codeExtract == null) return false;
        String lower = codeExtract.toLowerCase(Locale.ROOT);
        
        return lower.contains("file.path")
                || lower.contains("file.filepath")
                || lower.contains("file.tmpworkingdirectory")
                || lower.contains("tmpworkingdirectory");
    }
    
    private static boolean isMultipartTempPathMentioned(String text) {
        if (text == null) return false;
        String lower = text.toLowerCase(Locale.ROOT);
        
        return lower.contains("multipart")
                || lower.contains("parser temp")
                || lower.contains("temp path")
                || lower.contains("tmpworkingdirectory");
    }

    private boolean hasPathTraversalSafetyEvidence(Item item, String... texts) {
        String code = Optional.ofNullable(item).map(Item::getCodeExtract).orElse("").toLowerCase(Locale.ROOT);
        String combined = code + " " + String.join(" ", Optional.ofNullable(texts).orElse(new String[0])).toLowerCase(Locale.ROOT);
        
        // CLI tool / developer context patterns
        boolean isCliToolContext = combined.contains("cli argument")
                || combined.contains("command-line argument")
                || combined.contains("developer running the tool")
                || combined.contains("developer-controlled")
                || combined.contains("developer controlled")
                || combined.contains("cli tool")
                || combined.contains("build script")
                || combined.contains("code generator")
                || combined.contains("developer tool")
                || combined.contains("developer prompt")
                || combined.contains("inquirer")
                || combined.contains("prompts answers");
        
        // Config file origins
        boolean isConfigFileOrigin = combined.contains("tsconfig")
                || combined.contains("package.json")
                || combined.contains("webpack.config")
                || combined.contains("vite.config")
                || combined.contains(".env")
                || combined.contains("configuration file")
                || combined.contains("config file")
                || combined.contains("from config")
                || (combined.contains("outdir") && combined.contains("config"))
                || (combined.contains("rootdir") && combined.contains("config"));
        
        // Directory listing from fixed base
        boolean isDirectoryListing = (combined.contains("readdirSync") || combined.contains("listdir") 
                || combined.contains("readdir") || combined.contains("directory listing"))
                && (combined.contains("fixed") || combined.contains("base dir") 
                    || combined.contains("application-controlled"));
        
        // Test file context
        boolean isTestContext = combined.contains("test file")
                || combined.contains("test fixture")
                || combined.contains("*.test.*")
                || combined.contains("*.spec.*")
                || combined.contains("__tests__")
                || combined.contains("hardcoded path") && combined.contains("test");
        
        // process.cwd() patterns
        boolean hasProcessCwd = combined.contains("process.cwd()")
                || combined.contains("process.cwd")
                || (combined.contains("cwd") && combined.contains("process"));
        
        // Fixed base directory patterns
        boolean hasFixedBaseDir = combined.contains("fixed base dir")
                || combined.contains("fixed directory")
                || combined.contains("fixed base")
                || combined.contains("predefined dir")
                || combined.contains("hardcoded base")
                || combined.contains("literal base")
                || combined.contains("constant base")
                || code.contains("__dirname")
                || code.contains("packages_dir")
                || code.contains("extensionsdir")
                || code.contains("appdir")
                || code.contains("distdir")
                || code.contains("runtimedir")
                || code.contains("basedir")
                || code.contains("rootdir")
                || (combined.contains("path.join") && (combined.contains("literal") || combined.contains("constant")));
        
        // Package resolution utilities (developer tools)
        boolean hasPkgResolution = combined.contains("pkgup")
                || combined.contains("findup")
                || combined.contains("find-up")
                || combined.contains("pkg-up")
                || combined.contains("resolve-from")
                || combined.contains("package.json");
        
        // globSync with fixed patterns
        boolean hasGlobSyncFixed = (combined.contains("globsync") || combined.contains("glob.sync"))
                && (combined.contains("fixed pattern") || combined.contains("fixed base") 
                    || combined.contains("predefined"));
        
        // Path construction safety
        boolean hasSafePathConstruction = combined.contains("safe path construction")
                || combined.contains("safe join")
                || combined.contains("canonical path")
                || combined.contains("realpath")
                || combined.contains("getcanonicalpath")
                || combined.contains("filepath.clean")
                || combined.contains("path.getfullpath")
                || combined.contains("resolve()")
                || (combined.contains("path.join") && combined.contains("safe"));
        
        // Multipart temp path (already handled separately but include for completeness)
        boolean hasMultipartTemp = combined.contains("multipart")
                || combined.contains("tmpworkingdirectory")
                || combined.contains("tmp working directory")
                || combined.contains("parser temp")
                || combined.contains("formidable")
                || combined.contains("busboy")
                || combined.contains("multer");
        
        // No web/HTTP exposure
        boolean noWebExposure = !combined.contains("http")
                && !combined.contains("web")
                && !combined.contains("request")
                && !combined.contains("upload")
                && !combined.contains("api");
        
        return (isCliToolContext && (hasProcessCwd || hasFixedBaseDir || hasPkgResolution))
                || (hasFixedBaseDir && !combined.contains("user-controlled") && !combined.contains("untrusted"))
                || (hasPkgResolution && noWebExposure)
                || hasGlobSyncFixed
                || hasSafePathConstruction
                || hasMultipartTemp
                || isConfigFileOrigin
                || isDirectoryListing
                || (isTestContext && noWebExposure);
    }

    private boolean hasOpenRedirectSafetyEvidence(Item item, String... texts) {
        return OpenRedirectSafetyEvidence.present(item == null ? null : item.getCodeExtract(), texts);
    }

    private boolean containsFrameworkSafetyGuarantee(String combined) {
        return combined.contains("ispropertymapped")
                || combined.contains("ispropertyenabled")
                || combined.contains("setparameter")
                || combined.contains("parameterized")
                || combined.contains("prepared statement")
                || combined.contains("prepared query")
                || combined.contains("twig")
                || combined.contains("auto-escaping")
                || combined.contains("auto escaping")
                || combined.contains("symfony collection")
                || combined.contains("data-prototype")
                || combined.contains("csrf")
                || combined.contains("method 'get'")
                || combined.contains("method => 'get'")
                || combined.contains("read-only get");
    }

    private boolean containsTrustedSourceEvidence(String combined) {
        if (combined == null || combined.isBlank()) {
            return false;
        }
        return combined.contains("hardcoded")
                || combined.contains("string literal")
                || combined.contains("named constant")
                || combined.contains("compile-time constant")
                || combined.contains("operator-controlled")
                || combined.contains("operator controlled")
                || combined.contains("environment variable")
                || combined.contains("from config")
                || combined.contains("config_file")
                || combined.contains("configuration file")
                || combined.contains("server-rendered")
                || combined.contains("server rendered")
                || combined.contains("not user-controlled")
                || combined.contains("not user controlled")
                || combined.contains("not attacker-controlled")
                || combined.contains("not attacker controlled")
                || combined.contains("trusted source")
                || combined.contains("trusted origin")
                || combined.contains("trusted path")
                || combined.contains("internal_call")
                || combined.contains("cache key")
                || combined.contains("etag")
                || combined.contains("hmac-sha1")
                || combined.contains("third-party api")
                || combined.contains("required by")
                || combined.contains("gravatar")
                || combined.contains("random_bytes")
                || combined.contains("password_hash")
                || combined.contains("browser developer tools")
                || combined.contains("browser dev tools")
                || combined.contains("not stored server-side")
                || combined.contains("not stored server side")
                || combined.contains("no credentials")
                || combined.contains("no tokens")
                || combined.contains("no secrets")
                // Developer tool / CLI context patterns
                || combined.contains("developer-controlled")
                || combined.contains("developer controlled")
                || combined.contains("developer running the tool")
                || combined.contains("cli tool")
                || combined.contains("cli argument")
                || combined.contains("command-line argument")
                || combined.contains("build tool")
                || combined.contains("build script")
                || combined.contains("code generator")
                || combined.contains("developer tool")
                // Path-specific patterns
                || combined.contains("fixed base dir")
                || combined.contains("fixed directory")
                || combined.contains("predefined dir")
                || combined.contains("fixed path")
                || combined.contains("safe path construction")
                || combined.contains("safe join")
                || combined.contains("multipart parser temp path")
                || combined.contains("framework-controlled temp")
                || combined.contains("parser temp path")
                || combined.contains("temporary directory")
                || combined.contains("directory listing from fixed base")
                || combined.contains("application-controlled")
                // Config file patterns
                || combined.contains("tsconfig")
                || combined.contains("package.json")
                || combined.contains("webpack.config")
                || combined.contains("vite.config")
                || combined.contains("operator-controlled")
                // Test context patterns
                || combined.contains("test fixture")
                || combined.contains("test file")
                || combined.contains("test context");
    }

    private boolean citesProposedRemediationAsAppliedSafetyEvidence(String explanation) {
        String combined = Optional.ofNullable(explanation).orElse("").toLowerCase(Locale.ROOT);
        boolean mentionsProposedFix = combined.contains("remediation code")
                || combined.contains("proposed remediation")
                || combined.contains("recommendation")
                || combined.contains("recommended fix")
                || combined.contains("suggested fix")
                || combined.contains("would be sanitized")
                || combined.contains("would sanitize")
                || combined.contains("should sanitize");
        boolean citesSafetyMechanism = combined.contains("sanitize")
                || combined.contains("sanitizehtml")
                || combined.contains("sanitizer")
                || combined.contains("escaped")
                || combined.contains("escaping")
                || combined.contains("textcontent")
                || combined.contains("text-only")
                || combined.contains("allowlist")
                || combined.contains("neutralized");
        boolean treatsAsApplied = combined.contains("indicating that a sanitizer is in place")
                || combined.contains("given the presence of a sanitizer")
                || combined.contains("sanitizer is in place")
                || combined.contains("input is neutralized")
                || combined.contains("is neutralized")
                || combined.contains("there is no evidence of a bypass");
        return mentionsProposedFix && (citesSafetyMechanism || treatsAsApplied);
    }

    private boolean containsTextOnlySinkEvidence(String combined) {
        return combined.contains("textcontent")
                || combined.contains("innertext")
                || combined.contains("createtextnode")
                || combined.contains("create text node")
                || combined.contains("text-only")
                || combined.contains("text only")
                || combined.contains("not html")
                || combined.contains("does not execute html");
    }

    private boolean mentionsMissingSourceOrNeutralizationTrace(String explanation) {
        String combined = Optional.ofNullable(explanation).orElse("").toLowerCase(Locale.ROOT);
        return combined.contains("fetchwitherrorhandling function is not shown")
                || combined.contains("not shown")
                || combined.contains("origin is unclear")
                || combined.contains("source is unclear")
                || combined.contains("origin of")
                || combined.contains("requires further investigation")
                || combined.contains("further investigation is needed")
                || combined.contains("cannot determine")
                || combined.contains("could potentially")
                || combined.contains("no explicit evidence")
                || combined.contains("no evidence that the response is unsanitized")
                || combined.contains("no evidence the response is unsanitized")
                || combined.contains("no evidence that the response is sanitized")
                || combined.contains("no evidence the response is sanitized")
                || combined.contains("no evidence of sanitization")
                || combined.contains("no evidence of escaping")
                || combined.contains("neutralization proof is missing");
    }

    private String appendNormalizationReason(String reasoning, String reasonToAppend) {
        String trimmedReasoning = reasoning == null ? "" : reasoning.trim();
        if (trimmedReasoning.isBlank()) {
            return reasonToAppend;
        }
        if (trimmedReasoning.endsWith(".")) {
            return trimmedReasoning + " " + reasonToAppend;
        }
        return trimmedReasoning + ". " + reasonToAppend;
    }

    private String formatRecommendation(String recommendation, String remediationCode) {
        String trimmedRecommendation = recommendation == null ? "" : recommendation.trim();
        String trimmedCode = remediationCode == null ? "" : remediationCode.trim();
        if (trimmedCode.isBlank()) {
            return trimmedRecommendation;
        }
        if (trimmedCode.startsWith("Cannot provide a safe code snippet:")) {
            return trimmedRecommendation + "\n\nRemediation code:\n" + trimmedCode;
        }
        return trimmedRecommendation + "\n\nRemediation code:\n```\n" + trimmedCode + "\n```";
    }

    private String extractJson(String content) {
        if (content == null) return "{}";
        content = content.trim();

        if (content.startsWith("```json")) {
            content = content.substring(7);
        } else if (content.startsWith("```")) {
            content = content.substring(3);
        }
        if (content.endsWith("```")) {
            content = content.substring(0, content.length() - 3);
        }
        return content.trim();
    }

    private String truncateForLog(String value, int maxLength) {
        if (value == null || value.length() <= maxLength) {
            return value;
        }
        return value.substring(0, maxLength) + "...";
    }

    /**
     * Thread-safe rate limiting using sliding window approach.
     * Allows burst of up to semaphore permits, then enforces rateLimitMs spacing.
     * 
     * Example: 3 permits, 2000ms rate limit:
     * - First 3 calls: immediate
     * - 4th call: waits until 2000ms elapsed since 1st call
     * - This gives ~1.5 req/sec sustained rate with burst capability
     */
    private void rateLimitPause() {
        try {
            rateLimitSemaphore.acquire();
            try {
                long now = System.currentTimeMillis();
                
                // Clean up old entries (older than rateLimitMs)
                while (!recentCallTimes.isEmpty() && 
                       now - recentCallTimes.peek() >= rateLimitMs) {
                    recentCallTimes.poll();
                }
                
                // If we've made a call recently, wait
                if (!recentCallTimes.isEmpty()) {
                    Long oldestCall = recentCallTimes.peek();
                    if (oldestCall != null) {
                        long timeSinceOldest = now - oldestCall;
                        if (timeSinceOldest < rateLimitMs) {
                            long sleepTime = rateLimitMs - timeSinceOldest;
                            Thread.sleep(sleepTime);
                        }
                    }
                }
                
                // Record this call
                recentCallTimes.offer(System.currentTimeMillis());
            } finally {
                rateLimitSemaphore.release();
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.warn("[SastVerification] Rate limit interrupted");
        }
    }

    /**
     * Thread-safe summary for concurrent verification.
     */
    private static class ConcurrentVerificationSummary {
        private final AtomicInteger totalFindings = new AtomicInteger();
        private final AtomicInteger llmRequests = new AtomicInteger();
        private final AtomicInteger validVerdicts = new AtomicInteger();
        private final AtomicInteger notVerified = new AtomicInteger();
        private final AtomicInteger cacheHits = new AtomicInteger();
        private final AtomicInteger normalizedVerdicts = new AtomicInteger();
        private final AtomicInteger jsonRepairAttempts = new AtomicInteger();
        private final AtomicInteger jsonRepairSuccesses = new AtomicInteger();
        private final AtomicInteger duplicateActionsSkipped = new AtomicInteger();
        private final AtomicInteger queryExpansionsUsed = new AtomicInteger();
        private final AtomicInteger validationOverrides = new AtomicInteger();
        private final AtomicInteger remediationCorrections = new AtomicInteger();
        private final ConcurrentHashMap<ParseFailureReason, AtomicInteger> failureReasons = new ConcurrentHashMap<>();

        private synchronized void addFailure(ParseFailureReason reason) {
            if (reason != null) {
                failureReasons.computeIfAbsent(reason, k -> new AtomicInteger()).incrementAndGet();
            }
        }

        private VerificationSummary toVerificationSummary() {
            VerificationSummary summary = new VerificationSummary();
            summary.totalFindings = totalFindings.get();
            summary.llmRequests = llmRequests.get();
            summary.validVerdicts = validVerdicts.get();
            summary.notVerified = notVerified.get();
            summary.cacheHits = cacheHits.get();
            summary.normalizedVerdicts = normalizedVerdicts.get();
            summary.jsonRepairAttempts = jsonRepairAttempts.get();
            summary.jsonRepairSuccesses = jsonRepairSuccesses.get();
            summary.duplicateActionsSkipped = duplicateActionsSkipped.get();
            summary.queryExpansionsUsed = queryExpansionsUsed.get();
            summary.validationOverrides = validationOverrides.get();
            summary.remediationCorrections = remediationCorrections.get();
            failureReasons.forEach((reason, count) -> 
                summary.failureReasons.put(reason, count.get()));
            return summary;
        }
    }

    private static class VerificationSummary {
        private int totalFindings;
        private int llmRequests;
        private int validVerdicts;
        private int notVerified;
        private int cacheHits;
        private int normalizedVerdicts;
        private int jsonRepairAttempts;
        private int jsonRepairSuccesses;
        private int duplicateActionsSkipped;
        private int queryExpansionsUsed;
        private int validationOverrides;
        private int remediationCorrections;
        private final Map<ParseFailureReason, Integer> failureReasons = new EnumMap<>(ParseFailureReason.class);

        private void add(VerificationSummary other) {
            this.totalFindings += other.totalFindings;
            this.llmRequests += other.llmRequests;
            this.validVerdicts += other.validVerdicts;
            this.notVerified += other.notVerified;
            this.cacheHits += other.cacheHits;
            this.normalizedVerdicts += other.normalizedVerdicts;
            this.jsonRepairAttempts += other.jsonRepairAttempts;
            this.jsonRepairSuccesses += other.jsonRepairSuccesses;
            this.duplicateActionsSkipped += other.duplicateActionsSkipped;
            this.queryExpansionsUsed += other.queryExpansionsUsed;
            this.validationOverrides += other.validationOverrides;
            this.remediationCorrections += other.remediationCorrections;
            other.failureReasons.forEach((reason, count) ->
                    this.failureReasons.merge(reason, count, Integer::sum));
        }

        private void addFailure(ParseFailureReason failureReason) {
            if (failureReason != null) {
                failureReasons.merge(failureReason, 1, Integer::sum);
            }
        }

        private String formatFailureReasons() {
            if (failureReasons.isEmpty()) {
                return "{}";
            }
            StringJoiner joiner = new StringJoiner(", ", "{", "}");
            failureReasons.forEach((reason, count) -> joiner.add(reason.logLabel() + "=" + count));
            return joiner.toString();
        }
    }

    private enum ParseFailureReason {
        EMPTY_RESPONSE("empty_response"),
        INVALID_JSON("invalid_json"),
        MISSING_ACTION("missing_action"),
        MISSING_VERDICT("missing_verdict"),
        MISSING_CONFIDENCE("missing_confidence"),
        MISSING_REASONING("missing_reasoning"),
        MISSING_EXECUTION_CONTEXT("missing_execution_context"),
        MISSING_INPUT_SOURCE("missing_input_source"),
        INVALID_STAGE2_MISMATCH("invalid_stage2_mismatch");

        private final String logLabel;

        ParseFailureReason(String logLabel) {
            this.logLabel = logLabel;
        }

        private String logLabel() {
            return logLabel;
        }
    }

    private record VerificationResult(boolean verified,
                                      ParseFailureReason failureReason,
                                      boolean normalized,
                                      int llmRequests,
                                      int jsonRepairAttempts,
                                      int jsonRepairSuccesses,
                                      int duplicateActionsSkipped,
                                      int queryExpansionsUsed,
                                      int validationOverrides,
                                      int remediationCorrections) {
        private static VerificationResult verified(boolean normalized) {
            return new VerificationResult(true, null, normalized, 0, 0, 0, 0, 0, 0, 0);
        }

        private static VerificationResult failed(ParseFailureReason failureReason) {
            return new VerificationResult(false, failureReason, false, 0, 0, 0, 0, 0, 0, 0);
        }

        private static VerificationResult verified(boolean normalized,
                                                   int llmRequests,
                                                   int jsonRepairAttempts,
                                                   int jsonRepairSuccesses,
                                                   int duplicateActionsSkipped,
                                                   int queryExpansionsUsed) {
            return new VerificationResult(true, null, normalized, llmRequests, jsonRepairAttempts,
                    jsonRepairSuccesses, duplicateActionsSkipped, queryExpansionsUsed, 0, 0);
        }

        private static VerificationResult failed(ParseFailureReason failureReason,
                                                 int llmRequests,
                                                 int jsonRepairAttempts,
                                                 int jsonRepairSuccesses,
                                                 int duplicateActionsSkipped,
                                                 int queryExpansionsUsed) {
            return new VerificationResult(false, failureReason, false, llmRequests, jsonRepairAttempts,
                    jsonRepairSuccesses, duplicateActionsSkipped, queryExpansionsUsed, 0, 0);
        }

        private VerificationResult withMetrics(int llmRequests,
                                               int jsonRepairAttempts,
                                               int jsonRepairSuccesses,
                                               int duplicateActionsSkipped,
                                               int queryExpansionsUsed) {
            return new VerificationResult(verified, failureReason, normalized, llmRequests, jsonRepairAttempts,
                    jsonRepairSuccesses, duplicateActionsSkipped, queryExpansionsUsed,
                    validationOverrides, remediationCorrections);
        }

        private VerificationResult withValidation(int validationOverrides, int remediationCorrections) {
            return new VerificationResult(verified, failureReason, normalized, llmRequests, jsonRepairAttempts,
                    jsonRepairSuccesses, duplicateActionsSkipped, queryExpansionsUsed,
                    validationOverrides, remediationCorrections);
        }
    }

    private record FindingContext(boolean nonProductionPath, String pathEvidence, String ruleCategory) {}

    private record ParsedVerdict(
            String verdict,
            double confidence,
            String reasoning,
            String recommendation,
            String remediationCode,
            String falsePositiveEvidence
    ) {}

    private record MinimalVerdict(String verdict, double confidence, String reasoning) {}

    private record ValidatorVerdict(String verdict, double confidence, String explanation) {}

    private record StageOneParse(MinimalVerdict verdict, ParseFailureReason failureReason) {}

    private record CachedVerdict(String verdict, double confidence, String reasoning, String recommendation) {}

    private record ActionExecution(String observation, boolean queryExpansionUsed) {
        private static ActionExecution of(String observation, boolean queryExpansionUsed) {
            return new ActionExecution(observation, queryExpansionUsed);
        }
    }

    private void invokeCallback(Consumer<Item> callback, Item item) {
        if (callback == null) return;
        try {
            callback.accept(item);
        } catch (Exception e) {
            log.warn("[SastVerification] Intermediate persistence callback failed for {}: {}",
                    formatItemRef(item), e.getMessage());
        }
    }
}
