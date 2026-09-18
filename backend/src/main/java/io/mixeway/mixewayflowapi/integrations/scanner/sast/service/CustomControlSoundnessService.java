package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import com.fasterxml.jackson.core.json.JsonReadFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import io.mixeway.mixewayflowapi.integrations.llm.service.LlmApiClient;
import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Discovers custom validators/sanitizers by LLM semantics (not name regex) and audits
 * whether each control is actually complete for the finding's CWE.
 */
@Service
@Log4j2
@RequiredArgsConstructor
public class CustomControlSoundnessService {

    private static final int MAX_AUDIT_ROUNDS = 5;
    private static final int MAX_AUDIT_TOOLS = 6;
    private static final int MAX_TOOL_RESULT_CHARS = 4000;
    private static final int MAX_CONTEXT_CHARS = 8000;

    private static final String DISCOVERY_SYSTEM_PROMPT =
            "You identify CUSTOM application security controls on a source-to-sink path. "
                    + "A custom control is code authored in THIS repository (or a library call with application-specific "
                    + "options) that rejects, constrains, encodes, or rewrites the value reaching the sink. "
                    + "Judge by behaviour and position, never by the identifier. Names such as Validator, Sanitizer, "
                    + "isValid, clean, or escape are neither required nor sufficient. Do not search for those words. "
                    + "Do NOT report framework-native / standard-library APIs: JDBC PreparedStatement and bound "
                    + "placeholders, ProcessBuilder/exec argument arrays, html/template auto-escape, "
                    + "htmlspecialchars/html.escape with defaults, DOMPurify.sanitize with tight defaults, ORM bind APIs. "
                    + "Those are handled by the main SAST reviewer, not this module. "
                    + "Do not issue a finding verdict (TRUE_POSITIVE/FALSE_POSITIVE). "
                    + "Length/null/blank/email checks that do not address this CWE should be omitted. "
                    + "Return ONLY valid JSON.";

    private static final String AUDIT_SYSTEM_PROMPT =
            "You audit whether CUSTOM application validators/sanitizers actually neutralize THIS vulnerability class. "
                    + "Read the callee body with tools. A helper name is never proof of safety. "
                    + "Only application-authored helpers and library calls with application-specific options are in scope. "
                    + "If a candidate is actually a stock framework API (PreparedStatement, DOMPurify defaults, "
                    + "ProcessBuilder, auto-escape), classify FRAMEWORK_NATIVE and do not treat it as the subject of this audit. "
                    + "Custom application code is SOUND only when the body closes every bypass class in the catalog. "
                    + "Character/tag blocklists, strip/replace filters, and relaxed library options are UNSOUND or INCOMPLETE. "
                    + "If the body is not in the repository, return BODY_UNAVAILABLE. "
                    + "Do not invent completeness. Return ONLY valid JSON.";

    private final LlmApiClient llmApiClient;
    private final CodeSearchService codeSearchService;
    private final ObjectMapper objectMapper = JsonMapper.builder()
            .enable(JsonReadFeature.ALLOW_BACKSLASH_ESCAPING_ANY_CHARACTER)
            .build();
    private final ConcurrentHashMap<String, ControlSoundness> soundnessCache = new ConcurrentHashMap<>();

    public ControlAuditReport evaluate(Item item,
                                       String repoDir,
                                       CodeContextExtractor.CodeContext context,
                                       SastRuleMetadata metadata,
                                       List<Map<String, Object>> analyzerMessages,
                                       String itemRef,
                                       Runnable beforeLlmCall) {
        if (!CweBypassCatalog.appliesTo(metadata)) {
            return ControlAuditReport.skipped();
        }
        // Analyzer already treated the finding as exploitable. This module exists to stop
        // FALSE_POSITIVE from leaky custom helpers, not to second-guess TRUE_POSITIVE.
        if ("TRUE_POSITIVE".equals(item.getAiVerdict())) {
            return ControlAuditReport.skipped();
        }
        int llmRequests = 0;
        List<SecurityControl> candidates;
        try {
            beforeLlm(beforeLlmCall);
            String discoveryJson = requestJson(DISCOVERY_SYSTEM_PROMPT, buildDiscoveryPrompt(
                    item, context, metadata, analyzerMessages));
            llmRequests++;
            candidates = parseDiscovery(discoveryJson);
        } catch (Exception e) {
            log.warn("[ControlSoundness] Discovery failed for {}: {}", itemRef, e.getMessage());
            return ControlAuditReport.noneFound(llmRequests);
        }
        if (candidates.isEmpty()) {
            log.info("[ControlSoundness] No controls identified for {}", itemRef);
            return ControlAuditReport.noneFound(llmRequests);
        }
        log.info("[ControlSoundness] {} candidate control(s) for {}: {}",
                candidates.size(), itemRef, candidates.stream().map(SecurityControl::label).toList());

        List<ControlSoundness> results = new ArrayList<>();
        List<SecurityControl> needsAudit = new ArrayList<>();
        for (SecurityControl candidate : candidates) {
            String cacheKey = cacheKey(repoDir, candidate, metadata);
            ControlSoundness cached = soundnessCache.get(cacheKey);
            if (cached != null) {
                results.add(cached);
            } else {
                needsAudit.add(candidate);
            }
        }
        if (!needsAudit.isEmpty()) {
            AuditOutcome audit = runAudit(item, repoDir, context, metadata, needsAudit,
                    analyzerMessages, itemRef, beforeLlmCall);
            llmRequests += audit.llmRequests();
            for (ControlSoundness result : audit.results()) {
                results.add(result);
                if (result.control() != null && shouldCache(result)) {
                    soundnessCache.put(cacheKey(repoDir, result.control(), metadata), result);
                }
            }
            if (audit.results().size() < needsAudit.size()) {
                Set<String> audited = new HashSet<>();
                for (ControlSoundness result : audit.results()) {
                    if (result.control() != null) {
                        audited.add(result.control().label());
                    }
                }
                for (SecurityControl leftover : needsAudit) {
                    if (!audited.contains(leftover.label())) {
                        results.add(ControlSoundness.inconclusive(
                                leftover, "Soundness audit did not return a result for this control."));
                    }
                }
            }
        }
        return new ControlAuditReport(true, List.copyOf(candidates), List.copyOf(results), llmRequests);
    }

    private AuditOutcome runAudit(Item item,
                                  String repoDir,
                                  CodeContextExtractor.CodeContext context,
                                  SastRuleMetadata metadata,
                                  List<SecurityControl> candidates,
                                  List<Map<String, Object>> analyzerMessages,
                                  String itemRef,
                                  Runnable beforeLlmCall) {
        int llmRequests = 0;
        if (calleeBodyAlreadyInContext(candidates, context, analyzerMessages)) {
            beforeLlm(beforeLlmCall);
            String singleShot = requestJson(AUDIT_SYSTEM_PROMPT,
                    buildAuditPrompt(item, context, metadata, candidates)
                            + "The callee body is already in the context/tool observations above. "
                            + "Return action=final JSON now. Do not request tools.\n");
            llmRequests++;
            List<ControlSoundness> parsed = parseAuditFinal(singleShot, candidates);
            if (!parsed.isEmpty()) {
                return new AuditOutcome(parsed, llmRequests);
            }
            if (singleShot == null || singleShot.isBlank()) {
                log.warn("[ControlSoundness] Empty single-shot audit for {} — not starting a second ReAct loop", itemRef);
                return new AuditOutcome(inconclusiveAll(candidates,
                        "Audit LLM returned an empty response after the analyzer already inspected the helper."),
                        llmRequests);
            }
        }

        List<Map<String, Object>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", AUDIT_SYSTEM_PROMPT));
        messages.add(Map.of("role", "user", "content", buildAuditPrompt(item, context, metadata, candidates)));

        int toolBudget = MAX_AUDIT_TOOLS;
        Set<String> seenActions = new HashSet<>();
        for (int round = 0; round <= MAX_AUDIT_ROUNDS; round++) {
            boolean lastRound = round == MAX_AUDIT_ROUNDS || toolBudget <= 0;
            List<Map<String, Object>> requestMessages = messages;
            if (lastRound) {
                requestMessages = new ArrayList<>(messages);
                requestMessages.add(Map.of("role", "user", "content",
                        "Stop investigating. Return the final JSON now with action=final and a results array. "
                                + "Do not request tools."));
            }
            beforeLlm(beforeLlmCall);
            LlmApiClient.LlmResponse response = llmApiClient.chatCompletion(requestMessages, false);
            llmRequests++;
            if (response.isEmpty()) {
                log.warn("[ControlSoundness] Empty audit response for {} round {} — treating as inconclusive, not missing body",
                        itemRef, round);
                break;
            }
            JsonNode node = tryParseJson(response.content());
            String action = node != null ? node.path("action").asText("") : "";
            if (!lastRound && ("search_repo".equals(action) || "read_file".equals(action))) {
                String actionKey = actionKey(action, node);
                if (!seenActions.add(actionKey)) {
                    messages.add(Map.of("role", "assistant", "content", response.content()));
                    messages.add(Map.of("role", "user", "content",
                            "TOOL RESULT (" + action + "):\nDuplicate action skipped. Read a different span or finalize."));
                    continue;
                }
                String observation = executeTool(action, node, repoDir, itemRef);
                messages.add(Map.of("role", "assistant", "content", response.content()));
                messages.add(Map.of("role", "user", "content", "TOOL RESULT (" + action + "):\n" + observation));
                toolBudget--;
                continue;
            }
            List<ControlSoundness> parsed = parseAuditFinal(response.content(), candidates);
            if (!parsed.isEmpty()) {
                return new AuditOutcome(parsed, llmRequests);
            }
            messages.add(Map.of("role", "assistant", "content", response.content()));
            messages.add(Map.of("role", "user", "content",
                    "Could not parse results. Return one JSON object with action=final and results[]."));
        }
        return new AuditOutcome(inconclusiveAll(candidates, "Audit loop ended without a usable JSON result."),
                llmRequests);
    }

    private static List<ControlSoundness> inconclusiveAll(List<SecurityControl> candidates, String reason) {
        List<ControlSoundness> fallback = new ArrayList<>();
        for (SecurityControl candidate : candidates) {
            fallback.add(ControlSoundness.inconclusive(candidate, reason));
        }
        return fallback;
    }

    private boolean calleeBodyAlreadyInContext(List<SecurityControl> candidates,
                                               CodeContextExtractor.CodeContext context,
                                               List<Map<String, Object>> analyzerMessages) {
        String haystack = (codeContextBlock(context, null) + toolResultsBlock(analyzerMessages)).toLowerCase(Locale.ROOT);
        if (haystack.isBlank()) {
            return false;
        }
        for (SecurityControl candidate : candidates) {
            String id = candidate.label() == null ? "" : candidate.label().toLowerCase(Locale.ROOT);
            if (!id.isBlank() && haystack.contains(id) && haystack.length() > 400) {
                return true;
            }
            String path = candidate.pathHint() == null ? "" : candidate.pathHint().replace('\\', '/');
            int slash = path.lastIndexOf('/');
            String file = slash >= 0 ? path.substring(slash + 1) : path;
            if (!file.isBlank() && haystack.contains(file.toLowerCase(Locale.ROOT))) {
                return true;
            }
        }
        return false;
    }

    private boolean shouldCache(ControlSoundness result) {
        return result != null
                && result.verdict() != ControlSoundness.Verdict.AUDIT_INCONCLUSIVE
                && result.verdict() != ControlSoundness.Verdict.BODY_UNAVAILABLE;
    }

    private String buildDiscoveryPrompt(Item item,
                                        CodeContextExtractor.CodeContext context,
                                        SastRuleMetadata metadata,
                                        List<Map<String, Object>> analyzerMessages) {
        StringBuilder sb = new StringBuilder();
        sb.append("Find every CUSTOM security control on the path of the flagged value to the sink.\n");
        sb.append("Vulnerability class: ").append(CweBypassCatalog.familyLabel(metadata)).append('\n');
        if (item.getCweIds() != null && !item.getCweIds().isEmpty()) {
            sb.append("CWE: CWE-").append(String.join(", CWE-", item.getCweIds())).append('\n');
        }
        sb.append("File: ").append(item.getFilename()).append(':').append(item.getLineNumber()).append('\n');
        sb.append("Flagged code: `").append(nullToEmpty(item.getCodeExtract())).append("`\n");
        sb.append("Analyzer verdict (not binding): ").append(nullToEmpty(item.getAiVerdict()))
                .append(" — ").append(truncate(nullToEmpty(item.getAiReasoning()), 800)).append("\n\n");
        sb.append("In scope: helpers/filters/guards whose BODY is in this repository, inline if/switch allowlists, ");
        sb.append("and library sanitizers called with application-specific options (relaxed safelist, extra tags). ");
        sb.append("Judge by what the code does, not by names. Examples: prepare(), normalize(), wrap(), toSafe(), ");
        sb.append("assertFormat(), filter(), parseId(), a switch default-deny, an if that rejects metacharacters. ");
        sb.append("If the sink argument is concatenated from several fragments, emit one control per fragment ");
        sb.append("(column catalog, quote helper, computed-expression regex, shell metachar denylist) — do not ");
        sb.append("collapse them into a single allowlist.\n");
        sb.append("Out of scope — do not report: PreparedStatement / bound placeholders, ProcessBuilder argument arrays, ");
        sb.append("html/template auto-escape, htmlspecialchars/html.escape defaults, DOMPurify.sanitize with tight defaults, ");
        sb.append("ORM bind APIs, ordinary getters, loggers.\n\n");
        sb.append(codeContextBlock(context, item));
        sb.append(toolResultsBlock(analyzerMessages));
        sb.append("Return JSON:\n");
        sb.append("{\"controls\":[{\"kind\":\"REJECTOR|TRANSFORMER|ALLOWLIST|ENCODER|TYPE_COERCION|INLINE_GUARD|UNKNOWN\",");
        sb.append("\"origin\":\"CUSTOM_APPLICATION|CONFIGURED_LIBRARY\",");
        sb.append("\"identifier\":\"name or anonymous\",\"evidence\":\"short code citation\",");
        sb.append("\"rationale\":\"why this is a custom control\",\"callee_hint\":\"function to inspect\",");
        sb.append("\"path_hint\":\"repo-relative path or empty\",\"start_line\":0,\"end_line\":0,");
        sb.append("\"on_sink_variable\":true,\"claimed_cwe_intent\":\"SQL_INJECTION|COMMAND_INJECTION|XSS|PATH_TRAVERSAL|");
        sb.append("SSRF|OPEN_REDIRECT|UNCLEAR\"}]}\n");
        sb.append("If none, return {\"controls\":[]}.\n");
        return sb.toString();
    }

    private String buildAuditPrompt(Item item,
                                    CodeContextExtractor.CodeContext context,
                                    SastRuleMetadata metadata,
                                    List<SecurityControl> candidates) {
        StringBuilder sb = new StringBuilder();
        sb.append("Audit each CUSTOM candidate control for ").append(CweBypassCatalog.familyLabel(metadata)).append(".\n");
        sb.append("Do not spend tools on framework-native APIs. If a candidate turns out to be stock framework, ");
        sb.append("mark FRAMEWORK_NATIVE and skip completeness claims for it. ");
        sb.append("SOUND on one candidate does not make a sibling UNSOUND. ");
        sb.append("A keyword denylist or regex that still admits SELECT / $() / unquoted handlers is UNSOUND, ");
        sb.append("even when a neighbouring identifier allowlist is SOUND.\n");
        sb.append("File: ").append(item.getFilename()).append(':').append(item.getLineNumber()).append('\n');
        sb.append("Flagged code: `").append(nullToEmpty(item.getCodeExtract())).append("`\n\n");
        sb.append(CweBypassCatalog.promptBlock(metadata));
        sb.append("## Candidates to audit\n");
        for (SecurityControl candidate : candidates) {
            sb.append("- ").append(candidate.label())
                    .append(" kind=").append(candidate.kind())
                    .append(" on_sink_variable=").append(candidate.onSinkVariable())
                    .append(" intent=").append(nullToEmpty(candidate.claimedCweIntent())).append('\n');
            sb.append("  rationale: ").append(nullToEmpty(candidate.rationale())).append('\n');
            sb.append("  evidence: ").append(nullToEmpty(candidate.evidence())).append('\n');
            if (candidate.pathHint() != null && !candidate.pathHint().isBlank()) {
                sb.append("  hinted path: ").append(candidate.pathHint());
                if (candidate.startLine() > 0) {
                    sb.append(':').append(candidate.startLine());
                    if (candidate.endLine() > 0) {
                        sb.append('-').append(candidate.endLine());
                    }
                }
                sb.append('\n');
            }
        }
        sb.append('\n');
        sb.append(codeContextBlock(context, item));
        sb.append("Use read_file / search_repo to open the callee BODY of each candidate. ");
        sb.append("Search for the identifier already listed above — never search for Validator/Sanitizer/isValid as a pattern.\n");
        sb.append("Available actions:\n");
        sb.append("{\"thought\":\"...\",\"action\":\"search_repo\",\"pattern\":\"identifier\",\"path_glob\":\"optional\"}\n");
        sb.append("{\"thought\":\"...\",\"action\":\"read_file\",\"path\":\"repo-relative/path\",\"start_line\":1,\"end_line\":80}\n");
        sb.append("Final:\n");
        sb.append("{\"action\":\"final\",\"results\":[{\"identifier\":\"must match a candidate\",");
        sb.append("\"classification\":\"FRAMEWORK_NATIVE|CONFIGURED_LIBRARY|CUSTOM_APPLICATION\",");
        sb.append("\"verdict\":\"SOUND|UNSOUND|INCOMPLETE|MISAPPLIED|WRONG_CWE|BODY_UNAVAILABLE\",");
        sb.append("\"bypass_classes\":[\"QUOTE_BLACKLIST\"],\"residual_payload_sketch\":\"bypass class, not an exploit\",");
        sb.append("\"confidence\":0.0,\"cited_body\":\"short quote from the body\",\"applies_to_this_cwe\":true,");
        sb.append("\"on_sink_variable\":true,\"reasoning\":\"2-4 sentences\"}]}\n");
        return sb.toString();
    }

    List<SecurityControl> parseDiscovery(String raw) {
        JsonNode node = tryParseJson(raw);
        if (node == null) {
            return List.of();
        }
        JsonNode array = node.path("controls");
        if (!array.isArray()) {
            return List.of();
        }
        List<SecurityControl> controls = new ArrayList<>();
        for (JsonNode entry : array) {
            if (entry == null || !entry.isObject()) {
                continue;
            }
            String identifier = text(entry, "identifier");
            String calleeHint = text(entry, "callee_hint");
            if (identifier.isBlank() && calleeHint.isBlank() && text(entry, "evidence").isBlank()) {
                continue;
            }
            controls.add(new SecurityControl(
                    parseKind(text(entry, "kind")),
                    parseOrigin(text(entry, "origin")),
                    identifier.isBlank() ? calleeHint : identifier,
                    text(entry, "evidence"),
                    text(entry, "rationale"),
                    calleeHint,
                    text(entry, "path_hint"),
                    entry.path("start_line").asInt(0),
                    entry.path("end_line").asInt(0),
                    entry.path("on_sink_variable").asBoolean(true),
                    text(entry, "claimed_cwe_intent")));
        }
        return controls.stream().filter(SecurityControl::isCustom).toList();
    }

    List<ControlSoundness> parseAuditFinal(String raw, List<SecurityControl> candidates) {
        JsonNode node = tryParseJson(raw);
        if (node == null) {
            return List.of();
        }
        JsonNode array = node.path("results");
        if (!array.isArray() && "final".equals(node.path("action").asText()) && node.has("verdict")) {
            ControlSoundness single = parseOneResult(node, candidates);
            return single == null ? List.of() : List.of(single);
        }
        if (!array.isArray()) {
            return List.of();
        }
        List<ControlSoundness> results = new ArrayList<>();
        for (JsonNode entry : array) {
            ControlSoundness parsed = parseOneResult(entry, candidates);
            if (parsed != null) {
                results.add(parsed);
            }
        }
        return results;
    }

    private ControlSoundness parseOneResult(JsonNode entry, List<SecurityControl> candidates) {
        if (entry == null || !entry.isObject()) {
            return null;
        }
        String identifier = text(entry, "identifier");
        SecurityControl matched = matchCandidate(identifier, candidates);
        if (matched == null && candidates != null && candidates.size() == 1) {
            matched = candidates.get(0);
        }
        if (matched == null) {
            matched = new SecurityControl(
                    SecurityControl.Kind.UNKNOWN, SecurityControl.Origin.CUSTOM_APPLICATION,
                    identifier, "", "", identifier, "", 0, 0,
                    entry.path("on_sink_variable").asBoolean(true), "");
        }
        String verdictText = text(entry, "verdict").toUpperCase(Locale.ROOT);
        ControlSoundness.Verdict verdict;
        try {
            verdict = ControlSoundness.Verdict.valueOf(verdictText);
        } catch (Exception e) {
            return null;
        }
        String classificationText = text(entry, "classification").toUpperCase(Locale.ROOT);
        ControlSoundness.Classification classification;
        try {
            classification = classificationText.isBlank()
                    ? ControlSoundness.Classification.CUSTOM_APPLICATION
                    : ControlSoundness.Classification.valueOf(classificationText);
        } catch (Exception e) {
            classification = ControlSoundness.Classification.UNKNOWN;
        }
        List<String> bypass = new ArrayList<>();
        JsonNode bypassNode = entry.path("bypass_classes");
        if (bypassNode.isArray()) {
            for (JsonNode value : bypassNode) {
                if (value != null && !value.asText("").isBlank()) {
                    bypass.add(value.asText().trim());
                }
            }
        }
        double confidence = entry.path("confidence").asDouble(0.5d);
        confidence = Math.max(0.0d, Math.min(1.0d, confidence));
        return new ControlSoundness(
                matched,
                classification,
                verdict,
                List.copyOf(bypass),
                text(entry, "residual_payload_sketch"),
                confidence,
                text(entry, "cited_body"),
                text(entry, "reasoning"),
                entry.path("applies_to_this_cwe").asBoolean(true),
                entry.path("on_sink_variable").asBoolean(matched.onSinkVariable()));
    }

    private SecurityControl matchCandidate(String identifier, List<SecurityControl> candidates) {
        if (identifier == null || identifier.isBlank() || candidates == null) {
            return null;
        }
        String needle = identifier.trim();
        for (SecurityControl candidate : candidates) {
            if (needle.equalsIgnoreCase(candidate.label())
                    || needle.equalsIgnoreCase(candidate.identifier())
                    || needle.equalsIgnoreCase(candidate.calleeHint())) {
                return candidate;
            }
        }
        return null;
    }

    private SecurityControl.Kind parseKind(String raw) {
        if (raw == null || raw.isBlank()) {
            return SecurityControl.Kind.UNKNOWN;
        }
        try {
            return SecurityControl.Kind.valueOf(raw.trim().toUpperCase(Locale.ROOT));
        } catch (Exception e) {
            return SecurityControl.Kind.UNKNOWN;
        }
    }

    private SecurityControl.Origin parseOrigin(String raw) {
        if (raw == null || raw.isBlank()) {
            return SecurityControl.Origin.CUSTOM_APPLICATION;
        }
        try {
            return SecurityControl.Origin.valueOf(raw.trim().toUpperCase(Locale.ROOT));
        } catch (Exception e) {
            return SecurityControl.Origin.CUSTOM_APPLICATION;
        }
    }

    private String executeTool(String action, JsonNode node, String repoDir, String itemRef) {
        try {
            if ("search_repo".equals(action)) {
                String pattern = node.path("pattern").asText("");
                String pathGlob = node.path("path_glob").asText("");
                log.info("[ControlSoundness] search_repo(pattern='{}') for {}", truncate(pattern, 80), itemRef);
                return truncate(codeSearchService.searchRepo(repoDir, pattern, pathGlob), MAX_TOOL_RESULT_CHARS);
            }
            if ("read_file".equals(action)) {
                String path = node.path("path").asText("");
                int startLine = node.path("start_line").asInt(0);
                int endLine = node.path("end_line").asInt(0);
                log.info("[ControlSoundness] read_file(path='{}', {}-{}) for {}", path, startLine, endLine, itemRef);
                return truncate(codeSearchService.readFile(repoDir, path, startLine, endLine), MAX_TOOL_RESULT_CHARS);
            }
            return "Unknown action: " + action;
        } catch (Exception e) {
            return "Tool execution error: " + e.getMessage();
        }
    }

    private String requestJson(String systemPrompt, String userPrompt) {
        LlmApiClient.LlmResponse response = llmApiClient.chatCompletion(systemPrompt, userPrompt);
        return response == null ? "" : response.content();
    }

    private String codeContextBlock(CodeContextExtractor.CodeContext context, Item item) {
        StringBuilder sb = new StringBuilder();
        sb.append("## Code context\n");
        appendSnippet(sb, "Flagged extract", item == null ? "" : item.getCodeExtract());
        if (context == null) {
            return sb.toString();
        }
        appendSnippet(sb, "Function body", context.functionBody());
        appendSnippet(sb, "Local snippet", context.localSnippet());
        appendSnippet(sb, "Definition", context.definitionContext());
        appendSnippet(sb, "Callers", context.callerContext());
        appendSnippet(sb, "Cross-file callers", context.crossFileCallerContext());
        return truncate(sb.toString(), MAX_CONTEXT_CHARS);
    }

    private void appendSnippet(StringBuilder sb, String title, String snippet) {
        if (snippet == null || snippet.isBlank()) {
            return;
        }
        sb.append("### ").append(title).append('\n');
        sb.append("```\n").append(snippet).append("\n```\n\n");
    }

    private String toolResultsBlock(List<Map<String, Object>> analyzerMessages) {
        if (analyzerMessages == null || analyzerMessages.isEmpty()) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        sb.append("## Analyzer tool observations (may already include callee snippets)\n");
        int count = 0;
        for (Map<String, Object> message : analyzerMessages) {
            if (count >= 6) {
                break;
            }
            Object role = message.get("role");
            Object content = message.get("content");
            if (!"user".equals(role) || content == null) {
                continue;
            }
            String text = content.toString();
            if (!text.startsWith("TOOL RESULT")) {
                continue;
            }
            count++;
            sb.append(truncate(text, 1200)).append("\n\n");
        }
        return sb.toString();
    }

    private JsonNode tryParseJson(String content) {
        try {
            return objectMapper.readTree(extractJson(content));
        } catch (Exception e) {
            return null;
        }
    }

    private String extractJson(String content) {
        if (content == null) {
            return "{}";
        }
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

    private String text(JsonNode node, String field) {
        if (node == null || !node.hasNonNull(field)) {
            return "";
        }
        return node.get(field).asText("").trim();
    }

    private String cacheKey(String repoDir, SecurityControl control, SastRuleMetadata metadata) {
        String family = metadata == null || metadata.family() == null ? "unknown" : metadata.family().name();
        String id = control == null ? "" : control.label();
        String path = control == null ? "" : nullToEmpty(control.pathHint());
        return family + "|" + nullToEmpty(repoDir) + "|" + path + "|" + id;
    }

    private String actionKey(String action, JsonNode node) {
        if ("search_repo".equals(action)) {
            return "search_repo|" + node.path("pattern").asText("").trim().toLowerCase(Locale.ROOT)
                    + "|" + node.path("path_glob").asText("").trim().toLowerCase(Locale.ROOT);
        }
        return "read_file|" + node.path("path").asText("").trim().toLowerCase(Locale.ROOT)
                + "|" + node.path("start_line").asInt(0) + "|" + node.path("end_line").asInt(0);
    }

    private void beforeLlm(Runnable beforeLlmCall) {
        if (beforeLlmCall != null) {
            beforeLlmCall.run();
        }
    }

    private static String nullToEmpty(String value) {
        return value == null ? "" : value;
    }

    private static String truncate(String value, int max) {
        if (value == null || value.length() <= max) {
            return value;
        }
        return value.substring(0, max) + "...";
    }

    private record AuditOutcome(List<ControlSoundness> results, int llmRequests) {
    }
}
