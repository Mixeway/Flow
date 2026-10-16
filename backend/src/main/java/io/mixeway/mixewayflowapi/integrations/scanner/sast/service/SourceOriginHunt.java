package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Second investigation pass used only when the main ReAct review did not establish
 * who produces the value that reaches the sink. The pass searches for the writer;
 * it does not replace the verdict by itself.
 */
final class SourceOriginHunt {

    /** Local read, assignment, caller, framework binding, config file, then who writes that key. */
    static final int MAX_TOOL_CALLS = 15;

    static final String FORCE_FINAL =
            "Stop searching and respond NOW with the final JSON object "
                    + "(\"action\":\"final\" plus origin_found, input_source, writer, "
                    + "neutralizer_on_path, in_repo_callers, and trace). Do not request any tool.";

    /** Ceiling for a FALSE_POSITIVE that rests on the absence of a caller rather than on a traced safe value. */
    static final double NO_CALLER_FP_MAX_CONFIDENCE = 0.6d;

    /** The hunt must have searched at least this often before "nothing found" counts as evidence. */
    static final int MIN_SEARCHES_FOR_NO_CALLER = 2;

    private static final Set<String> VENDORED_SEGMENTS = Set.of(
            "build", "dist", "vendor", "vendors", "third_party", "third-party", "thirdparty",
            "node_modules", "bower_components", "external", "externals",
            "demo", "demos", "example", "examples", "sample", "samples");

    private static final int MAX_PRIOR_REASONING = 900;
    private static final int MAX_SYMBOLS = 8;

    private static final Set<VulnerabilityFamily> FAMILIES = Set.of(
            VulnerabilityFamily.XSS,
            VulnerabilityFamily.OPEN_REDIRECT,
            VulnerabilityFamily.SSRF,
            VulnerabilityFamily.PATH_TRAVERSAL,
            VulnerabilityFamily.COMMAND_INJECTION,
            VulnerabilityFamily.SQL_INJECTION,
            VulnerabilityFamily.DESERIALIZATION,
            VulnerabilityFamily.TRUST_BOUNDARY,
            VulnerabilityFamily.XXE);

    /** Origins the first pass already named as a concrete channel. A DOM read is not one of these. */
    private static final Set<String> CONCRETE_SOURCES = Set.of(
            "http_request",
            "database",
            "file_untrusted",
            "multipart_parser_temp_path",
            "url_fragment",
            "gui_input",
            "cli_argument_developer",
            "internal_call",
            "config_file",
            "environment_variable");

    private static final Pattern DOTTED_NAME = Pattern.compile(
            "\\b[A-Za-z_$][\\w$]*(?:\\.[A-Za-z_$][\\w$]*)+");
    private static final Pattern CALL_NAME = Pattern.compile("\\b([A-Za-z_$][\\w$]*)\\s*\\(");
    private static final Set<String> SKIP_NAMES = Set.of(
            "if", "for", "while", "switch", "catch", "function", "return", "new", "var", "let", "const",
            "typeof", "instanceof", "await", "async", "else", "try", "do", "case");

    private SourceOriginHunt() {
    }

    static boolean shouldHunt(SastRuleMetadata metadata, boolean codeInjection, String inputSource, String verdict) {
        return shouldHunt(metadata, codeInjection, inputSource, verdict, null);
    }

    /**
     * {@code codeContext} is the flagged snippet plus the first-pass reasoning. A framework
     * binding such as {@code settings.NAME} or {@code @Value} is not a finished source even
     * when the first pass already labeled it {@code config_file} or {@code environment_variable}.
     */
    static boolean shouldHunt(SastRuleMetadata metadata, boolean codeInjection, String inputSource, String verdict,
                              String codeContext) {
        if (metadata == null || !metadata.requiresTaint() || codeInjection || metadata.family() == null) {
            return false;
        }
        if (!FAMILIES.contains(metadata.family())) {
            return false;
        }
        String source = inputSource == null ? "" : inputSource.trim().toLowerCase(Locale.ROOT);
        boolean xssLike = metadata.family() == VulnerabilityFamily.XSS
                || metadata.family() == VulnerabilityFamily.OPEN_REDIRECT;
        if (xssLike && ("dom_content".equals(source) || "gui_input".equals(source))) {
            return true;
        }
        if (configIndirection(source, codeContext)) {
            return true;
        }
        if (CONCRETE_SOURCES.contains(source)) {
            return false;
        }
        return source.isBlank() || "unknown".equals(source);
    }

    static boolean configIndirection(String inputSource, String codeContext) {
        String source = inputSource == null ? "" : inputSource.trim().toLowerCase(Locale.ROOT);
        if (!"config_file".equals(source) && !"environment_variable".equals(source)) {
            return false;
        }
        if (codeContext == null || codeContext.isBlank()) {
            return false;
        }
        String lower = codeContext.toLowerCase(Locale.ROOT);
        return lower.contains("settings.")
                || lower.contains("@value")
                || lower.contains("${")
                || lower.contains("process.env")
                || lower.contains("os.environ")
                || lower.contains("os.getenv")
                || lower.contains("system.getenv")
                || lower.contains("getenv(")
                || lower.contains("environment.getproperty")
                || lower.contains("dotenv")
                || lower.contains("iconfiguration")
                || lower.contains("configprovider")
                || lower.contains("env.fetch")
                || lower.contains("env[");
    }

    static boolean productiveObservation(String observation) {
        if (observation == null || observation.isBlank()) {
            return false;
        }
        return !observation.startsWith("No matches")
                && !observation.startsWith("No results")
                && !observation.startsWith("Unknown action")
                && !observation.startsWith("Search failed")
                && !observation.startsWith("Repository directory")
                && !observation.startsWith("File not found")
                && !observation.startsWith("Invalid file path")
                && !observation.startsWith("Access denied")
                && !observation.startsWith("Tool execution error");
    }

    static boolean traceIsUseful(boolean originFound, String trace, String writer, int productiveObservations) {
        boolean hasTrace = trace != null && !trace.isBlank();
        boolean hasWriter = writer != null && !writer.isBlank()
                && !"none".equalsIgnoreCase(writer.trim())
                && !"unknown".equalsIgnoreCase(writer.trim());
        return hasWriter && hasTrace && (originFound || productiveObservations > 0);
    }

    /**
     * Copied third-party code or build/demo output: no in-repo caller means the sink is not
     * reached by this project. A first-party library is excluded because its callers live elsewhere.
     */
    static boolean isVendoredOrDemoPath(String filename) {
        if (filename == null || filename.isBlank()) {
            return false;
        }
        String path = filename.replace('\\', '/').toLowerCase(Locale.ROOT);
        if (path.endsWith(".min.js")) {
            return true;
        }
        String[] segments = path.split("/");
        for (int i = 0; i < segments.length - 1; i++) {
            if (VENDORED_SEGMENTS.contains(segments[i])) {
                return true;
            }
        }
        return false;
    }

    static boolean shouldReviseWithoutCaller(String verdict, boolean originFound, String writer,
                                             int searches, String filename) {
        boolean noWriter = writer == null || writer.isBlank()
                || "none".equalsIgnoreCase(writer.trim())
                || "unknown".equalsIgnoreCase(writer.trim());
        return "UNCERTAIN".equals(verdict)
                && !originFound
                && noWriter
                && searches >= MIN_SEARCHES_FOR_NO_CALLER
                && isVendoredOrDemoPath(filename);
    }

    static String noCallerRevisionPrompt(String filename, String callers, String trace) {
        String callerText = callers == null || callers.isBlank() ? "none reported" : callers.trim();
        StringBuilder sb = new StringBuilder();
        sb.append("A follow-up search looked for the code that supplies the value reaching the sink and found no writer.\n");
        sb.append("File: ").append(filename == null ? "" : filename)
                .append(" (vendored third-party code or build/demo output, not first-party application code).\n");
        sb.append("In-repo callers of the enclosing function: ").append(callerText).append('\n');
        if (trace != null && !trace.isBlank()) {
            sb.append("Search notes: ").append(trace.trim()).append('\n');
        }
        sb.append('\n');
        sb.append("Decide between FALSE_POSITIVE and UNCERTAIN only. Do not return TRUE_POSITIVE: no attacker-controlled ")
                .append("input was traced to this sink.\n");
        sb.append("Return FALSE_POSITIVE when no in-repo caller exists, or every caller passes a constant or ")
                .append("project-controlled value. Confidence must not exceed ").append(NO_CALLER_FP_MAX_CONFIDENCE)
                .append(". In false_positive_evidence name the file kind (vendored library, demo, build output) ")
                .append("and that no caller in this repository passes untrusted data.\n");
        sb.append("Keep UNCERTAIN when a caller exists and its argument was not shown to be constant.\n");
        sb.append("Reasoning must describe the code for a developer and must not mention this follow-up search, ")
                .append("tool calls, or that an earlier review was inconclusive.\n");
        sb.append("Return ONLY one JSON object with action \"final\" and the fields execution_context, input_source, ")
                .append("verdict, confidence, reasoning, recommendation, remediation_code, false_positive_evidence.");
        return sb.toString();
    }

    static String systemPrompt() {
        return "You trace the origin of the single value that reaches a security sink. "
                + "You do not decide whether the finding is exploitable in this step. "
                + "Use search_repo and read_file. A value read from a dialog, editor data object, "
                + "or DOM property is an intermediate, not the source, until you find the writer. "
                + "A validator or sanitizer defined in another file counts only when this call path invokes it. "
                + "Respond with ONLY one JSON object.";
    }

    static String userPrompt(Item item, SastRuleMetadata metadata, String inputSource, String verdict, String reasoning) {
        String source = inputSource == null || inputSource.isBlank() ? "unknown" : inputSource.trim();
        String family = metadata != null && metadata.family() != null ? metadata.family().name() : "unknown";
        StringBuilder sb = new StringBuilder();
        sb.append("The first review did not establish who produces the value that reaches the sink.\n");
        sb.append("Prior input_source: ").append(source).append('\n');
        sb.append("Prior verdict: ").append(verdict == null ? "unknown" : verdict).append('\n');
        sb.append("Family: ").append(family).append("\n\n");
        if (item != null) {
            sb.append("File: ").append(item.getFilename() == null ? "" : item.getFilename())
                    .append(':').append(item.getLineNumber()).append('\n');
            sb.append("Flagged code: ").append(item.getCodeExtract() == null ? "" : item.getCodeExtract()).append("\n\n");
        }
        List<String> symbols = candidateSymbols(item == null ? null : item.getCodeExtract());
        if (!symbols.isEmpty()) {
            sb.append("Symbols visible at the sink (search these, not placeholder names): ")
                    .append(String.join(", ", symbols)).append("\n\n");
        }
        String prior = reasoning == null ? "" : reasoning.trim();
        if (prior.length() > MAX_PRIOR_REASONING) {
            prior = prior.substring(0, MAX_PRIOR_REASONING);
        }
        if (!prior.isBlank()) {
            sb.append("Prior reasoning (may have stopped too early):\n").append(prior).append("\n\n");
        }
        sb.append("Search in this order:\n");
        sb.append("1. read_file on the finding file around the flagged line.\n");
        sb.append("2. search_repo for assignments of the sink identifier (`name =`, `.name =`, `name:`).\n");
        sb.append("3. search_repo for callers of the enclosing function.\n");
        if (metadata != null && (metadata.family() == VulnerabilityFamily.XSS
                || metadata.family() == VulnerabilityFamily.OPEN_REDIRECT)) {
            sb.append("4. For a URL or HTML value, search for a protocol or markup check ")
                    .append("(javascript:, isUrlValid, DOMPurify, sanitize) and read whether THIS path calls it. ")
                    .append("A check in a sibling plugin that is not called here is not on this path.\n");
        }
        if (configIndirection(source, codeContext(item, reasoning))) {
            sb.append("4. This value is a framework setting or environment binding. The property name is not the file. ")
                    .append("Search that key in the conventional config files: application.yml, application.yaml, ")
                    .append("application.properties, settings.py, .env, appsettings.json. ")
                    .append("Then search who assigns the key: an operator config write, an admin or user UI, or a database. ")
                    .append("A settings. or @Value prefix alone does not show the writer.\n");
        }
        sb.append("Prefer the finding's directory before a repo-wide search.\n\n");
        sb.append("Each response is EXACTLY one JSON object.\n");
        sb.append("Investigation: {\"thought\":\"why\",\"action\":\"search_repo\",\"pattern\":\"regex or text\",\"path_glob\":\"optional glob\"}\n");
        sb.append("or {\"thought\":\"why\",\"action\":\"read_file\",\"path\":\"repo-relative/path\",\"start_line\":1,\"end_line\":80}\n");
        sb.append("When the writer is found, or after the searches above are exhausted:\n");
        sb.append("{\"action\":\"final\",\"origin_found\":true,\"input_source\":\"http_request|database|file_untrusted|")
                .append("gui_input|dom_content|url_fragment|internal_call|config_file|environment_variable|unknown\",")
                .append("\"writer\":\"path:line symbol, or empty\",\"neutralizer_on_path\":\"none, or the function ")
                .append("and whether this path calls it\",\"in_repo_callers\":\"none, or path:line of each caller ")
                .append("of the enclosing function\",\"trace\":\"2-4 sentences naming the writer and the sink. ")
                .append("No review machinery.\"}\n");
        return sb.toString();
    }

    static String formatReport(boolean originFound, String writer, String neutralizer, String trace) {
        StringBuilder sb = new StringBuilder();
        sb.append("Origin found: ").append(originFound ? "yes" : "no").append('\n');
        if (writer != null && !writer.isBlank()) {
            sb.append("Writer: ").append(writer.trim()).append('\n');
        }
        if (neutralizer != null && !neutralizer.isBlank()) {
            sb.append("Neutralizer on this path: ").append(neutralizer.trim()).append('\n');
        }
        if (trace != null && !trace.isBlank()) {
            sb.append("Trace: ").append(trace.trim()).append('\n');
        }
        return sb.toString();
    }

    static String revisionPrompt(String currentVerdict, String inputSource, String report) {
        String source = inputSource == null || inputSource.isBlank() ? "unknown" : inputSource.trim();
        return "A follow-up search traced the value that reaches the sink, because the first review left the "
                + "origin unresolved (input_source=" + source + ", verdict=" + currentVerdict + ").\n\n"
                + report + "\n"
                + "Re-evaluate the verdict using this trace. Change it only when the trace shows a different "
                + "controller of the value, or a neutralizer that this path does or does not call. "
                + "A validator that exists in another file but is not called on this value does not make the finding safe. "
                + "If the trace still does not identify a writer, keep the previous verdict. "
                + "Reasoning must describe the code path for a developer and must not mention this follow-up search, "
                + "tool calls, or that an earlier review was inconclusive.\n"
                + "Return ONLY one JSON object with action \"final\" and the fields execution_context, input_source, "
                + "verdict, confidence, reasoning, recommendation, remediation_code, false_positive_evidence.";
    }

    private static String codeContext(Item item, String reasoning) {
        String extract = item == null || item.getCodeExtract() == null ? "" : item.getCodeExtract();
        String prior = reasoning == null ? "" : reasoning;
        return extract + "\n" + prior;
    }

    static List<String> candidateSymbols(String codeExtract) {
        if (codeExtract == null || codeExtract.isBlank()) {
            return List.of();
        }
        Set<String> symbols = new LinkedHashSet<>();
        Matcher dotted = DOTTED_NAME.matcher(codeExtract);
        while (dotted.find() && symbols.size() < MAX_SYMBOLS) {
            symbols.add(dotted.group());
        }
        Matcher calls = CALL_NAME.matcher(codeExtract);
        while (calls.find() && symbols.size() < MAX_SYMBOLS) {
            String name = calls.group(1);
            if (!SKIP_NAMES.contains(name)) {
                symbols.add(name);
            }
        }
        return new ArrayList<>(symbols);
    }
}
