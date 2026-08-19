package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.BearerScanDataflow;
import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Stream;

@Component
@Log4j2
@RequiredArgsConstructor
public class CodeContextExtractor {

    private final SinkArgumentParser sinkArgumentParser;

    private static final int FILE_HEADER_LINES = 80;
    private static final int MAX_FUNCTION_LINES = 200;
    private static final int FALLBACK_CONTEXT_LINES = 80;
    private static final int LOCAL_SNIPPET_LINES = 120;
    private static final int LOCAL_SNIPPET_LINES_JS_TS = 180;
    private static final int MAX_RELATED_FILES = 3;
    private static final int RELATED_SNIPPET_LINES = 50;
    private static final int MAX_DEFINITION_LINES = 15;
    /** Higher budget when tracing classic taint sinks (SQLi/XSS/RCE/deser). */
    private static final int MAX_DEFINITION_LINES_TAINT = 30;
    private static final int MAX_TAINT_HOPS = 5;
    private static final int MAX_TRACKED_IDENTIFIERS = 12;
    private static final int MAX_CALLER_SITES = 3;
    private static final int CALLER_WINDOW_LINES = 9;
    private static final int MAX_REPO_CALLER_SITES = 12;
    /** Max files scanned in the broader repo fallback pass (after same-package and import passes). */
    private static final int MAX_REPO_CALLER_FILES = 400;
    /** Max files with matching imports scanned in the import pass. */
    private static final int MAX_IMPORT_PASS_FILES = 200;
    private static final long MAX_REPO_SOURCE_BYTES = 1024L * 1024L;
    private static final int MAX_TEMPLATE_LINES = 40;
    private static final int MAX_FRAMEWORK_HINTS = 12;

    private static final Pattern SAFE_SINK_PATTERN = Pattern.compile(
            "mark_safe|innerHTML|dangerouslySetInnerHTML|v-html|bypassSecurityTrustHtml|SafeHtml",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern RENDER_PATTERN = Pattern.compile(
            "render_to_string|render_template|template\\.render|HtmlRenderer|\\.render\\(",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern TEMPLATE_LITERAL_PATTERN = Pattern.compile(
            "(?:template|form_template|template_name|cell_template_name)\\s*=\\s*[\"']([^\"']+)[\"']",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern RENDER_TO_STRING_LITERAL = Pattern.compile(
            "render_to_string\\s*\\(\\s*[\"']([^\"']+)[\"']",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern RENDER_LITERAL = Pattern.compile(
            "render\\s*\\(\\s*[\"']([^\"']+)[\"']",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern HTTP_SOURCE_PATTERN = Pattern.compile(
            // Python: Django / Flask / FastAPI
            "\\brequest\\.(GET|POST|FILES|COOKIES|META|headers|body|json|data|form|args|values|stream)\\b"
                    // Node.js / Express / Fastify / Koa
                    + "|\\breq\\.(query|body|params|headers|cookies|file|files)\\b"
                    + "|\\bctx\\.(query|body|params|headers|cookies)\\b"
                    // Browser / JS events
                    + "|\\bevent\\.detail\\b|\\bpostMessage\\b|addEventListener\\s*\\(\\s*[\"']message"
                    + "|\\blocation\\.(search|hash|href)\\b|\\bURLSearchParams\\b|\\bdocument\\.cookie\\b"
                    + "|\\bfetch\\s*\\(|\\$\\.ajax\\b|\\bXMLHttpRequest\\b|\\bFormData\\b|\\.files\\b"
                    // PHP: superglobals
                    + "|\\$_(GET|POST|REQUEST|FILES|COOKIE|SERVER)\\b"
                    + "|\\bfilter_input\\s*\\("
                    // Java Spring: annotations and servlet API
                    + "|@(RequestParam|PathVariable|RequestBody|RequestHeader|RequestPart|CookieValue)\\b"
                    + "|\\bgetParameter\\s*\\(|\\bgetHeader\\s*\\(|\\bgetInputStream\\s*\\(|\\bgetPart\\s*\\("
                    + "|\\bHttpServletRequest\\b|\\bMultipartFile\\b"
                    // Go: net/http, Gin, Echo
                    + "|\\br\\.FormValue\\s*\\(|\\br\\.URL\\.Query\\s*\\(|\\br\\.Header\\.Get\\s*\\(|\\br\\.Body\\b"
                    + "|\\bc\\.Query\\s*\\(|\\bc\\.Param\\s*\\(|\\bc\\.PostForm\\s*\\(|\\bc\\.QueryParam\\s*\\("
                    // Ruby/Rails
                    + "|\\bparams\\[|\\brequest\\.params\\b"
                    // C# / ASP.NET
                    + "|\\bRequest\\.(QueryString|Form|Params|Body|Query)\\b"
                    + "|\\[From(Body|Query|Route|Form|Header)\\]",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern HTTP_RESPONSE_PATTERN = Pattern.compile(
            "\\bresponse\\.json\\s*\\("
                    + "|\\bresponse\\.text\\s*\\("
                    + "|\\.then\\s*\\(\\s*(?:\\([^)]*\\)|[A-Za-z_][A-Za-z0-9_]*)\\s*=>"
                    + "|\\bdata\\.(message|error|html|content|body|description)\\b"
                    + "|\\bresult\\.(message|error|html|content|body|description)\\b"
                    + "|\\$this->json\\s*\\("
                    + "|\\bJsonResponse\\b",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern PERSISTED_DATA_PATTERN = Pattern.compile(
            "\\b(models\\.(CharField|TextField|URLField|FileField|ImageField|JSONField)|"
                    + "ForeignKey\\(|ManyToManyField\\(|get_for_site\\(|\\.objects\\.|queryset|save\\()",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern ENTITY_USER_CONTENT_PATTERN = Pattern.compile(
            "->get(Name|Description|Comment|Title|Label|Html|Body|Content)\\s*\\("
                    + "|\\.get(Name|Description|Comment|Title|Label|Html|Body|Content)\\s*\\(",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern UPLOAD_FILENAME_PATTERN = Pattern.compile(
            "\\b(upload_to|get_upload_to|filename|FileField|ImageField|request\\.FILES)\\b",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern NEUTRALIZER_PATTERN = Pattern.compile(
            "\\b(format_html|escape|escapejs|urlencode|flatatt|sanitizeHtml|DOMPurify|htmlspecialchars|"
                    + "url_has_allowed_host_and_scheme|is_safe_url|get_valid_filename|get_valid_name|safe_join)\\b",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern DOM_SOURCE_PATTERN = Pattern.compile(
            "\\bquerySelector(All)?\\s*\\("
                    + "|\\bgetElementById\\s*\\("
                    + "|\\bgetElementsByClassName\\s*\\("
                    + "|\\bgetElementsByTagName\\s*\\("
                    // Property reads only — writes (innerHTML = …) are XSS sinks, not sources.
                    + "|\\.textContent\\b(?!\\s*=)|\\.innerText\\b(?!\\s*=)"
                    + "|\\.innerHTML\\b(?!\\s*=)|\\.outerHTML\\b(?!\\s*=)"
                    + "|\\.dataset\\b|\\.getAttribute\\s*\\("
                    + "|\\bthis\\.element\\b"
                    + "|\\.closest\\s*\\("
                    + "|\\bthis\\.[a-zA-Z]+Target\\b"
                    + "|\\bthis\\.[a-zA-Z]+Targets\\b",
            Pattern.CASE_INSENSITIVE);
    /** LHS/write forms that are XSS sinks; nearby DOM APIs must not be treated as payload provenance. */
    private static final Pattern XSS_SINK_WRITE_PATTERN = Pattern.compile(
            "(?:\\.innerHTML|\\.outerHTML)\\s*=|\\.insertAdjacentHTML\\s*\\(",
            Pattern.CASE_INSENSITIVE);
    /** CodeMirror / editor extension registration: {@code Foo.defineExtension("openDialog", function...)}. */
    private static final Pattern JS_EXTENSION_FUNC_PATTERN = Pattern.compile(
            "\\.define(?:Doc)?Extension\\s*\\(\\s*[\"']([A-Za-z_][A-Za-z0-9_]*)[\"']");
    private static final Pattern LITERAL_HTML_ARG_PATTERN = Pattern.compile(
            "[\"'`]\\s*<\\s*[a-zA-Z][^\"'`]{0,200}[\"'`]");
    private static final Pattern STIMULUS_CONTROLLER_PATTERN = Pattern.compile(
            "@hotwired/stimulus|extends\\s+Controller",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern STIMULUS_STATIC_VALUES_PATTERN = Pattern.compile(
            "static\\s+values\\s*=\\s*\\{",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern STIMULUS_STATIC_TARGETS_PATTERN = Pattern.compile(
            "static\\s+targets\\s*=\\s*\\[",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern CATCH_LOGGER_PATTERN = Pattern.compile(
            "catch\\s*\\([^)]*\\)[\\s\\S]{0,220}?console\\.(error|warn|log|info)\\s*\\(",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern APIPLATFORM_FILTER_PATTERN = Pattern.compile(
            "ApiPlatform\\\\|AbstractFilter|filterProperty\\s*\\(",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern DOCTRINE_SET_PARAMETER_PATTERN = Pattern.compile(
            "->\\s*setParameter\\s*\\(",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern SYMFONY_PROTOTYPE_PATTERN = Pattern.compile(
            "prototype|data-prototype|collection_type|CollectionType"
                    + "|\\.dataset\\.prototype\\b",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern SYMFONY_FILTER_TYPE_PATTERN = Pattern.compile(
            "FilterType|AbstractType.*filter|TextFilterType|DateFilterType|ChoiceFilterType"
                    + "|NumberFilterType|EntityFilterType",
            Pattern.CASE_INSENSITIVE);

    private static final Pattern DJANGO_MARK_SAFE_INSTANCE_PATTERN = Pattern.compile(
            "mark_safe\\s*\\(.*\\b(instance|self\\.instance|self\\.object)\\b",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern DJANGO_MARK_SAFE_RENDER_PATTERN = Pattern.compile(
            "mark_safe\\s*\\(.*\\b(render_to_string|render|template\\.render)\\s*\\(",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern DJANGO_SAFE_RENDERER_PATTERN = Pattern.compile(
            "\\b(render_to_string|format_html|flatatt|escape|conditional_escape|escapejs)\\s*\\(",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern DJANGO_JSON_RENDERER_PATTERN = Pattern.compile(
            "\\bJSONRenderer\\s*\\(\\s*\\)\\s*\\.\\s*render\\s*\\(",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern DJANGO_TEMPLATETAG_PATTERN = Pattern.compile(
            "@register\\.(simple_tag|inclusion_tag|filter|tag)|templatetags/",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern DJANGO_MODEL_FIELD_ACCESS_PATTERN = Pattern.compile(
            "\\b(instance|self\\.instance|self\\.object)\\.(\\w+)",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern DJANGO_SERIALIZER_DATA_PATTERN = Pattern.compile(
            "\\bserializer\\.data\\b|\\bJSONRenderer\\s*\\(\\s*\\)\\s*\\.\\s*render\\s*\\(",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern DJANGO_CASCADE_PLUGIN_PATTERN = Pattern.compile(
            "CascadePluginBase|CascadePlugin|cmsplugin_cascade|glossary\\[",
            Pattern.CASE_INSENSITIVE);

    /**
     * Patterns that indicate the value comes from a trusted internal source: Django/app settings,
     * environment variables, or an operator-defined constant. Presence of these in the definition
     * context is a signal toward PROVEN_SOURCE_TRUSTED rather than AMBIGUOUS.
     * <p>Not applied for unsafe deserialization sinks when file bytes are also in play — an env
     * var that only supplies a path does not prove the serialized payload is trusted.
     */
    private static final Pattern TRUSTED_SOURCE_PATTERN = Pattern.compile(
            "\\bsettings\\.[A-Z_]{2,}\\b"
            + "|\\bos\\.environ\\b|\\bgetenv\\s*\\("
            + "|\\bos\\.getenv\\s*\\("
            + "|=[\\s\"']*[A-Z][A-Z0-9_]{3,}[\"'\\s]*$",
            Pattern.MULTILINE);

    /** Unsafe deserialization sinks where path-from-env must not short-circuit as trusted. */
    private static final Pattern DESERIALIZATION_SINK_PATTERN = Pattern.compile(
            "\\bpickle\\.loads?\\s*\\(|\\byaml\\.load\\s*\\(|\\bmarshal\\.loads?\\s*\\("
                    + "|\\bunserialize\\s*\\(|\\bObjectInputStream\\b|\\breadObject\\s*\\("
                    + "|\\bBinaryFormatter\\b|\\bjsonpickle\\.decode\\s*\\(",
            Pattern.CASE_INSENSITIVE);

    /**
     * File/stream byte reads that feed deserialization payloads. Presence near a deser sink means
     * the relevant source is content trust (who wrote the bytes), not the path variable's origin.
     * Not used for cache/backend {@code .get} — that is a separate store channel.
     */
    private static final Pattern FILE_BYTES_SOURCE_PATTERN = Pattern.compile(
            "\\bwith\\s+open\\s*\\(|\\.read\\s*\\(|\\.read_bytes\\s*\\(|readAllBytes\\s*\\("
                    + "|Files\\.readAllBytes|Files\\.readString|file_get_contents\\s*\\("
                    + "|FileInputStream|BufferedReader|fs\\.readFile|ioutil\\.ReadFile|os\\.ReadFile",
            Pattern.CASE_INSENSITIVE);

    /**
     * Cache/backend store reads feeding a deserializer. Not a file — writer trust is about who
     * {@code set}/dumps into that store/key, not about filesystem paths.
     */
    private static final Pattern STORE_CACHE_READ_PATTERN = Pattern.compile(
            "(?:self|this)\\s*\\.\\s*\\w*(?:backend|cache|redis|memcache|store)\\w*\\s*\\.\\s*get\\s*\\("
                    + "|\\b\\w*(?:backend|cache|redis|memcache|store)\\w*\\s*\\.\\s*get\\s*\\(",
            Pattern.CASE_INSENSITIVE);

    /**
     * Cache/store reads like {@code data = self._backend.get(key)} or {@code cache.get(k)}.
     * Receiver and key are handles/lookups, not taint carriers to chase in multi-hop follow.
     */
    private static final Pattern STORE_GET_ASSIGNMENT = Pattern.compile(
            "=\\s*(?:(?:self|this)\\s*\\.\\s*[A-Za-z_][A-Za-z0-9_]*|"
                    + "[A-Za-z_][A-Za-z0-9_]*(?:backend|cache|redis|memcache|memcached|store|client)[A-Za-z0-9_]*)"
                    + "\\s*\\.\\s*get\\s*\\(",
            Pattern.CASE_INSENSITIVE);

    /** {@code self.input_doc.original_file} — nested attribute chain on self/this. */
    private static final Pattern PATH_OBJECT_FIELD_PATTERN = Pattern.compile(
            "\\b(?:self|this)\\s*\\.\\s*[A-Za-z_][A-Za-z0-9_]*\\s*\\.\\s*[A-Za-z_][A-Za-z0-9_]*");

    /**
     * Model/DTO path properties across languages, e.g. {@code document.source_path},
     * {@code doc.getSourcePath()}, {@code bundle.AbsoluteFilePath}, {@code file.originalFilename}.
     * Leaf names are path-ish so we do not match {@code os.path.join}.
     */
    private static final Pattern PATH_MODEL_PATH_FIELD_PATTERN = Pattern.compile(
            "\\b([A-Za-z_][A-Za-z0-9_]*)\\s*\\.\\s*"
                    + "(?:get)?"
                    + "(source_?path|archive_?path|thumbnail_?path|absolute_?file_?path|file_?path|"
                    + "filepath|filename|file_?name|archive_?filename|original_?filename|original_?file|"
                    + "upload_?path|tmp_?path|temp_?path|media_?path|storage_?path|full_?path|"
                    + "absolute_?path|relative_?path|content_?path|working_?path)\\s*(?:\\(\\s*\\))?",
            Pattern.CASE_INSENSITIVE);

    private static final Pattern PYTHON_FUNC_PATTERN = Pattern.compile(
            "^(\\s*)(def |class |async def )", Pattern.MULTILINE);
    private static final Pattern BRACE_FUNC_PATTERN = Pattern.compile(
            "^\\s*(public |private |protected |static |async |export |function |def |class |override )",
            Pattern.MULTILINE);
    private static final Pattern IMPORT_PATTERN = Pattern.compile(
            "^\\s*(import |from |require\\(|#include |using |package )", Pattern.MULTILINE);
    private static final Pattern IDENTIFIER_PATTERN = Pattern.compile("[A-Za-z_][A-Za-z0-9_]*");
    private static final Pattern FUNC_NAME_KEYWORD = Pattern.compile(
            "(?:async\\s+)?(?:def|function|fn|func|sub)\\s+([A-Za-z_][A-Za-z0-9_]*)");
    private static final Pattern FUNC_NAME_ASSIGN = Pattern.compile(
            "(?:const|let|var)\\s+([A-Za-z_][A-Za-z0-9_]*)\\s*=");
    private static final Pattern FUNC_NAME_BEFORE_PAREN = Pattern.compile(
            "([A-Za-z_][A-Za-z0-9_]*)\\s*\\(");

    /**
     * Tokens that are language keywords, common receivers, HTML tag/attribute names, or literals —
     * never useful to trace as a data source, so they are excluded from the definition-finder.
     * Kept language-agnostic (a union across common languages) on purpose. HTML tag and attribute
     * names are included to prevent noisy matches when the flagged code extract contains embedded
     * HTML (e.g. PHP templates, JSX, template literals).
     */
    private static final Set<String> IGNORED_IDENTIFIERS = Set.of(
            // language keywords
            "self", "this", "true", "false", "none", "null", "nil", "undefined",
            "return", "if", "else", "elif", "for", "while", "def", "class", "function",
            "const", "let", "var", "new", "import", "from", "as", "in", "is", "and", "or",
            "not", "await", "async", "yield", "try", "except", "catch", "finally", "with",
            "public", "private", "protected", "static", "final", "void", "int", "str",
            "string", "bool", "boolean", "float", "double", "list", "dict", "set", "map",
            // HTML tags — appear in PHP/JSX/template flagged extracts but are never tainted variables
            "div", "span", "p", "a", "b", "i", "ul", "li", "ol", "table", "tr", "td", "th",
            "form", "input", "button", "select", "option", "textarea", "label", "img", "link",
            "script", "style", "html", "head", "body", "header", "footer", "section", "article",
            "nav", "main", "aside", "h1", "h2", "h3", "h4", "h5", "h6", "pre", "code",
            "strong", "em", "br", "hr", "meta", "title", "canvas", "svg",
            // HTML attributes — appear in flagged extracts alongside variable names
            "align", "center", "id", "href", "src", "alt", "type", "name", "value",
            "width", "height", "onclick", "onload", "onerror", "action", "method",
            "placeholder", "disabled", "checked", "selected", "readonly", "required",
            "colspan", "rowspan", "border", "cellpadding", "cellspacing",
            // PHP built-ins that are not tainted variables
            "echo", "print", "isset", "empty", "unset", "array", "include", "require");

    private static final Set<String> SKIP_DIRS = Set.of(
            ".git", ".hg", ".svn", "node_modules", "dist", "build", "out",
            ".venv", "venv", "env", "__pycache__", "target", ".idea", ".gradle",
            "coverage", ".tox", "site-packages", "vendor", ".next", ".cache");

    private static final Set<String> SOURCE_EXT = Set.of(
            "py", "java", "js", "jsx", "ts", "tsx", "mjs", "cjs", "rb", "go", "php",
            "cs", "rs", "swift", "kt", "kts", "scala", "groovy", "c", "cc", "cpp",
            "cxx", "h", "hh", "hpp", "m", "mm", "vue", "svelte", "html", "erb",
            "ejs", "tpl", "twig", "pl", "pm", "sh", "bash");

    /**
     * Classification of how much direct evidence is available for the origin of the
     * flagged value. Drives which context sections are included in the LLM prompt
     * and whether pre-generated ReAct search suggestions are added.
     */
    public enum EvidenceCategory {
        /** An HTTP/form/file/socket source is directly visible in the flagged extract or the same function. */
        PROVEN_SOURCE_UNTRUSTED,
        /** An internal/config/constant source is proven — strong FALSE_POSITIVE signal. */
        PROVEN_SOURCE_TRUSTED,
        /** The flagged value originates from DOM content (querySelector, targets, dataset, etc.). */
        PROVEN_SOURCE_DOM,
        /** A complete sanitizer/neutralizer is visible between the source and sink. */
        NEUTRALIZED,
        /** Source is partially visible but origin is ambiguous — callers or related files may resolve it. */
        AMBIGUOUS,
        /** Flagged value comes from a function parameter with no or very few local call sites found. */
        DEAD_END
    }

    public record CodeContext(
            String functionBody,
            String fileImports,
            String fileHeader,
            String localSnippet,
            List<RelatedSnippet> relatedFiles,
            String definitionContext,
            String callerContext,
            String crossFileCallerContext,
            String frameworkContext,
            String templateContext,
            String language,
            EvidenceCategory category,
            List<String> reactSuggestions
    ) {}

    public record RelatedSnippet(String filename, String snippet) {}

    public CodeContext extractLocal(String repoDir, Item item) {
        String filename = item.getFullFilename() != null ? item.getFullFilename() : item.getFilename();
        if (filename == null) {
            return new CodeContext("", "", "", "", List.of(), "", "", "", "", "", "unknown",
                    EvidenceCategory.AMBIGUOUS, List.of());
        }

        SinkArgumentParser.SinkAnalysis sinkAnalysis = sinkArgumentParser.analyze(item.getCodeExtract());

        Path filePath = Path.of(repoDir, filename);
        List<String> lines;
        try {
            lines = Files.readAllLines(filePath, StandardCharsets.UTF_8);
        } catch (IOException e) {
            log.debug("[CodeContextExtractor] Cannot read file {}: {}", filePath, e.getMessage());
            return new CodeContext(
                    item.getCodeExtract() != null ? item.getCodeExtract() : "",
                    "", "", "", List.of(), "", "", "", "", "", detectLanguage(filename),
                    EvidenceCategory.AMBIGUOUS, List.of());
        }

        String language = detectLanguage(filename);
        String imports = extractImports(lines);
        String fileHeader = extractFileHeader(lines, item.getLineNumber());
        String functionBody = extractFunction(lines, item.getLineNumber(), language);
        int localContextLines = isJavaScriptLike(language) ? LOCAL_SNIPPET_LINES_JS_TS : LOCAL_SNIPPET_LINES;
        String localSnippet = contextAround(lines, Math.max(0, item.getLineNumber() - 1), localContextLines);
        String definitionContext = extractDefinitionContext(lines, item, sinkAnalysis);
        String callerContext = extractCallerContext(lines, item, language);
        String frameworkContext = extractFrameworkContext(filename, lines, item, functionBody, localSnippet);
        String templateContext = extractTemplateContext(repoDir, filename, lines, item, functionBody);

        // Determine evidence category before deciding whether to scan cross-file callers
        EvidenceCategory category = determineEvidenceCategory(
                sinkAnalysis, definitionContext, functionBody, item.getCodeExtract(), localSnippet);

        // Cross-file caller scan is expensive — only run it when local evidence is inconclusive
        String crossFileCallerContext = "";
        if (category == EvidenceCategory.AMBIGUOUS || category == EvidenceCategory.DEAD_END) {
            crossFileCallerContext = extractRankedCrossFileCallerContext(
                    repoDir, filename, lines, item, language, imports);
        }

        List<String> reactSuggestions = generateReactSuggestions(category, sinkAnalysis, item, language, lines);

        log.debug("[CodeContextExtractor] Evidence category for {} line {}: {}",
                filename, item.getLineNumber(), category);

        return new CodeContext(functionBody, imports, fileHeader, localSnippet, List.of(),
                definitionContext, callerContext, crossFileCallerContext, frameworkContext, templateContext,
                language, category, reactSuggestions);
    }

    public CodeContext extractWithDataflow(String repoDir, Item item, BearerScanDataflow dataflow) {
        CodeContext local = extractLocal(repoDir, item);

        if (dataflow == null || dataflow.getDataTypes() == null) {
            return local;
        }

        String findingFile = item.getFullFilename() != null ? item.getFullFilename() : item.getFilename();
        if (findingFile == null) {
            return local;
        }

        // Preserve the Bearer dataflow line number per related file so we can read a snippet around
        // the actual relevant location instead of the top of the file. First location per file wins.
        Map<String, Integer> relatedFileLines = new LinkedHashMap<>();
        for (BearerScanDataflow.DataType dataType : dataflow.getDataTypes()) {
            if (dataType.getDetectors() == null) continue;
            for (BearerScanDataflow.Detector detector : dataType.getDetectors()) {
                if (detector.getLocations() == null) continue;
                for (BearerScanDataflow.Location loc : detector.getLocations()) {
                    String locFile = loc.getFullFilename() != null ? loc.getFullFilename() : loc.getFilename();
                    if (locFile == null || locFile.equals(findingFile)) continue;

                    if (isImportedBy(local.fileImports, locFile)) {
                        relatedFileLines.putIfAbsent(locFile, Math.max(1, loc.getStartLineNumber()));
                    }
                }
            }
        }

        List<RelatedSnippet> relatedSnippets = new ArrayList<>();
        int count = 0;
        for (Map.Entry<String, Integer> related : relatedFileLines.entrySet()) {
            if (count >= MAX_RELATED_FILES) break;
            String snippet = readSnippetAround(repoDir, related.getKey(), related.getValue(), RELATED_SNIPPET_LINES);
            if (!snippet.isBlank()) {
                relatedSnippets.add(new RelatedSnippet(related.getKey(), snippet));
                count++;
            }
        }

        return new CodeContext(local.functionBody, local.fileImports, local.fileHeader, local.localSnippet,
                relatedSnippets, local.definitionContext, local.callerContext, local.crossFileCallerContext,
                local.frameworkContext, local.templateContext, local.language,
                local.category, local.reactSuggestions);
    }

    /**
     * Language-agnostic best-effort tracer: for every identifier referenced by the flagged code,
     * collect the lines in the same file that declare or assign it (e.g. {@code body = RichTextField()},
     * {@code self.source = ...}, {@code x: SomeType}). This surfaces where a value originates so the
     * model can classify the input source instead of answering "unknown". Falls back to an empty
     * string when nothing is found; never throws.
     */
    private String extractDefinitionContext(List<String> lines, Item item,
                                            SinkArgumentParser.SinkAnalysis sinkAnalysis) {
        String flagged = item.getCodeExtract();
        if (flagged == null || flagged.isBlank() || lines.isEmpty()) {
            return "";
        }

        LinkedHashSet<String> identifiers = new LinkedHashSet<>();
        if (sinkAnalysis != null && sinkAnalysis.primaryCandidate() != null
                && !sinkAnalysis.primaryCandidate().isBlank()) {
            identifiers.add(sinkAnalysis.primaryCandidate());
            // Prefer the leaf of dotted chains for assignment tracing (sqlQueries.getSqlString → getSqlString
            // is a method; for "insertSqlStatement" keep as-is; for "obj.field" also track "field").
            // Also track the root object (filterConfig.getId → filterConfig) so config/object provenance
            // can be followed across initializeFromConfig / clone / field assignment.
            String primary = sinkAnalysis.primaryCandidate();
            int firstDot = primary.indexOf('.');
            int lastDot = primary.lastIndexOf('.');
            if (firstDot > 0) {
                identifiers.add(primary.substring(0, firstDot));
            }
            if (lastDot > 0 && lastDot < primary.length() - 1) {
                identifiers.add(primary.substring(lastDot + 1));
            }
        }
        identifiers.addAll(extractIdentifiers(flagged));
        if (identifiers.isEmpty()) {
            return "";
        }

        String language = detectLanguage(Optional.ofNullable(item.getFullFilename())
                .orElse(Optional.ofNullable(item.getFilename()).orElse("")));
        List<String> stimulusSyntheticDefinitions = isJavaScriptLike(language)
                ? extractStimulusSyntheticDefinitions(lines, identifiers)
                : List.of();

        List<Pattern> definitionPatterns = new ArrayList<>();
        for (String id : identifiers) {
            String q = Pattern.quote(id);
            // assignment target (id = , not ==), type annotation (id:), attribute assignment
            // (self.id = / this.id =), or Ruby-style @id
            definitionPatterns.add(Pattern.compile(
                    "(^|[^\\w.])" + q + "\\s*(=(?!=)|:)"
                    + "|\\b(self|this)\\s*\\.\\s*" + q + "\\s*=(?!=)"
                    + "|@" + q + "\\b"));
            
            // For dotted identifiers (e.g. file.filepath), also track the root object and setter patterns
            if (id.contains(".")) {
                String[] parts = id.split("\\.", 2);
                if (parts.length == 2) {
                    String objectName = parts[0];
                    String fieldName = parts[1];
                    String qObj = Pattern.quote(objectName);
                    String qField = Pattern.quote(fieldName);
                    
                    // Object assignment: file =
                    definitionPatterns.add(Pattern.compile("(^|[^\\w.])" + qObj + "\\s*=(?!=)"));
                    
                    // Field assignment on object: file.filepath =
                    definitionPatterns.add(Pattern.compile("\\b" + qObj + "\\." + qField + "\\s*=(?!=)"));
                    
                    // Setter method: setFilepath(
                    String setterPattern = "set" + Character.toUpperCase(fieldName.charAt(0)) 
                            + (fieldName.length() > 1 ? fieldName.substring(1) : "");
                    definitionPatterns.add(Pattern.compile("\\b" + setterPattern + "\\s*\\("));
                    
                    // Constructor with field parameter: new ... (filepath: or {filepath:
                    definitionPatterns.add(Pattern.compile(qField + "\\s*:"));
                }
            }
        }

        int targetIdx = item.getLineNumber() - 1;
        StringBuilder sb = new StringBuilder();
        int syntheticCount = 0;
        for (String synthetic : stimulusSyntheticDefinitions) {
            sb.append("stimulus| ").append(synthetic).append('\n');
            syntheticCount++;
        }
        // Prefer definition lines near the finding, then fall back to file order.
        List<Integer> scanOrder = new ArrayList<>();
        for (int distance = 1; distance < lines.size(); distance++) {
            int before = targetIdx - distance;
            int after = targetIdx + distance;
            if (before >= 0) {
                scanOrder.add(before);
            }
            if (after < lines.size()) {
                scanOrder.add(after);
            }
        }
        boolean taintLikeFinding = looksLikeClassicTaintSink(flagged);
        boolean deserFinding = DESERIALIZATION_SINK_PATTERN.matcher(flagged).find();
        boolean pathFinding = looksLikePathSink(flagged.toLowerCase(Locale.ROOT));
        int definitionBudget = taintLikeFinding ? MAX_DEFINITION_LINES_TAINT : MAX_DEFINITION_LINES;
        int found = 0;
        Set<Integer> seenLines = new HashSet<>();
        Set<String> followIdentifiers = new LinkedHashSet<>();
        for (int i : scanOrder) {
            if (found >= definitionBudget) break;
            if (i == targetIdx || !seenLines.add(i)) continue;
            String line = lines.get(i);
            if (line.isBlank()) continue;
            for (Pattern p : definitionPatterns) {
                if (p.matcher(line).find()) {
                    sb.append(i + 1).append("| ").append(line).append('\n');
                    found++;
                    collectFollowIdentifiers(line, followIdentifiers);
                    break;
                }
            }
        }
        // Multi-hop: alias / concat operands / callee args / open(path) / env carriers
        int maxHops = taintLikeFinding ? MAX_TAINT_HOPS : 3;
        for (int hop = 0; hop < maxHops && !followIdentifiers.isEmpty() && found < definitionBudget; hop++) {
            Set<String> nextHop = new LinkedHashSet<>();
            List<Pattern> followPatterns = new ArrayList<>();
            for (String id : followIdentifiers) {
                String q = Pattern.quote(id);
                followPatterns.add(Pattern.compile(
                        "(^|[^\\w.])" + q + "\\s*(=(?!=)|:)"
                        + "|\\b(self|this)\\s*\\.\\s*" + q + "\\s*=(?!=)"
                        + "|\\bwith\\s+open\\s*\\([^)]*\\)\\s+as\\s+" + q + "\\b"
                        + "|\\bopen\\s*\\(\\s*" + q + "\\b"
                        + "|\\b(?:String|str)\\s+" + q + "\\b"
                        + "|\\([^)]*\\b(?:String|str|char\\s*\\*|CharSequence)\\s+" + q + "\\b"));
            }
            for (int i : scanOrder) {
                if (found >= definitionBudget) break;
                if (i == targetIdx || seenLines.contains(i)) continue;
                String line = lines.get(i);
                if (line.isBlank()) continue;
                for (Pattern p : followPatterns) {
                    if (p.matcher(line).find()) {
                        sb.append(i + 1).append("| ").append(line).append('\n');
                        seenLines.add(i);
                        found++;
                        collectFollowIdentifiers(line, nextHop);
                        break;
                    }
                }
            }
            followIdentifiers = nextHop;
        }
        if (deserFinding && found < definitionBudget) {
            found += appendNearbyProvenanceLines(lines, targetIdx, seenLines, sb,
                    definitionBudget - found);
        }
        if (deserFinding && found > 0) {
            String defSoFar = sb.toString();
            boolean sawFileRead = FILE_BYTES_SOURCE_PATTERN.matcher(defSoFar).find()
                    || FILE_BYTES_SOURCE_PATTERN.matcher(flagged).find();
            boolean sawStoreRead = STORE_CACHE_READ_PATTERN.matcher(defSoFar).find()
                    || STORE_CACHE_READ_PATTERN.matcher(flagged).find()
                    || STORE_GET_ASSIGNMENT.matcher(defSoFar).find();
            if (sawStoreRead && !sawFileRead) {
                sb.append("provenance| Observed in code: store/cache .get(...) reaches deserialization. "
                        + "Do not invent a file path. Next fact to find: who writes/sets that same store key "
                        + "(or leave writer trust unknown).\n");
            } else if (sawFileRead) {
                sb.append("provenance| Observed in code: file/stream read reaches deserialization. "
                        + "Trace (1) path origin, (2) who WRITES/updates that file, (3) deserializer. "
                        + "Do not invent writer trust either way.\n");
            } else {
                sb.append("provenance| Deserialization sink observed; payload origin not yet shown in code. "
                        + "Trace only assignments/reads present in the repo — do not invent file/upload/store.\n");
            }
        }
        if (pathFinding && found > 0) {
            String defSoFar = sb.toString();
            String pathHaystack = defSoFar + "\n" + flagged;
            boolean sawObjectField = PATH_OBJECT_FIELD_PATTERN.matcher(pathHaystack).find()
                    || PATH_MODEL_PATH_FIELD_PATTERN.matcher(pathHaystack).find();
            if (sawObjectField) {
                sb.append("provenance| Path built from object/model field (e.g. self.input_doc.original_file "
                        + "or document.source_path). Param typing / ORM attribute access is not trust. Next: "
                        + "(1) @property/field definition (source_path/filename/...), (2) who sets the stored "
                        + "filename/path components, (3) user/upload influence, (4) base-dir resolve/allowlist "
                        + "before copy/unlink/open.\n");
            } else {
                sb.append("provenance| Filesystem sink observed. Trace path variable assignment to its origin "
                        + "(HTTP/upload/cli/config/static). Do not stop at an intermediate local alias; "
                        + "if args are source/dest, find callers.\n");
            }
        }
        boolean trustBoundaryFinding = looksLikeTrustBoundarySink(flagged.toLowerCase(Locale.ROOT));
        if (trustBoundaryFinding && found > 0) {
            sb.append("provenance| Trust-boundary sink (setAttribute/put). Trace the VALUE argument only — "
                    + "not nearby headers unless that value is derived from them. Next: "
                    + "(1) object/field/getter providing the value, (2) initializeFromConfig/clone/constructor, "
                    + "(3) who writes SecurityNamedServiceConfig/filter config id fields, "
                    + "(4) classify config_file|internal_call vs http_request.\n");
        }

        // Method / callback parameter patterns — include JVM/C# signatures (common SQLi/RCE gap)
        if (isJavaScriptLike(language) || "php".equals(language) || "python".equals(language)
                || "java".equals(language) || "kotlin".equals(language) || "csharp".equals(language)
                || "go".equals(language) || "ruby".equals(language) || "rust".equals(language)) {
            for (String id : identifiers) {
                String q = Pattern.quote(id);
                Pattern paramPattern = Pattern.compile(
                        "catch\\s*\\(\\s*" + q + "\\b"
                        + "|\\b" + q + "\\s*=>\\s*[{(]?"
                        + "|\\(\\s*" + q + "\\s*\\)\\s*=>"
                        + "|function\\s*\\([^)]*\\b" + q + "\\b"
                        + "|for\\s*\\(\\s*(?:const|let|var)\\s+" + q + "\\b"
                        + "|for\\s*\\(\\s*(?:const|let|var)\\s+\\[?[^\\]]*\\b" + q + "\\b"
                        + "|\\.\\s*(?:then|catch|finally)\\s*\\(\\s*(?:async\\s+)?(?:\\(\\s*)?" + q + "\\b"
                        // JVM / C# / Go / Kotlin method parameters
                        + "|\\([^)]*\\b(?:String|CharSequence|str|string|StringBuilder|&str)\\s+" + q + "\\b"
                        + "|\\([^)]*\\b" + q + "\\s*:\\s*(?:String|str|string|&str)\\b"
                        + "|\\([^)]*\\b" + q + "\\s+string\\b"
                        // Ruby: def foo(sql), def foo(sql:)
                        + "|\\bdef\\s+\\w+\\s*\\([^)]*\\b" + q + "\\b"
                        // Rust: fn foo(sql: &str), fn foo(cmd: String)
                        + "|\\bfn\\s+\\w+\\s*\\([^)]*\\b" + q + "\\s*:"
                        // PHP typed: function foo(string $sql)
                        + "|function\\s+\\w+\\s*\\([^)]*\\$" + q + "\\b"
                );
                for (int i = 0; i < lines.size() && found < definitionBudget; i++) {
                    if (i == targetIdx || seenLines.contains(i)) continue;
                    String line = lines.get(i);
                    if (line.isBlank()) continue;
                    if (paramPattern.matcher(line).find()) {
                        sb.append(i + 1).append("| ").append(line).append('\n');
                        seenLines.add(i);
                        found++;
                        break;
                    }
                }
            }
        }

        if (found == 0 && syntheticCount == 0) {
            return "";
        }
        return sb.toString().trim();
    }

    /**
     * Collects RHS identifiers, concat/format operands, callee args, and open()/env carriers
     * so multi-hop definition tracing can continue beyond a single alias hop.
     */
    private void collectFollowIdentifiers(String line, Set<String> into) {
        if (line == null || into == null) {
            return;
        }
        // Stop at store/cache .get(...): do not follow receiver or key identifiers.
        if (STORE_GET_ASSIGNMENT.matcher(line).find()) {
            return;
        }
        var simpleRhs = Pattern.compile("=\\s*([A-Za-z_][A-Za-z0-9_]*)\\b").matcher(line);
        if (simpleRhs.find()) {
            addFollowIdentifier(into, simpleRhs.group(1));
        }
        // sql = buildQuery(x) / html = obj.render(msg) — follow the callee name for ReAct/body search
        var callee = Pattern.compile(
                "=\\s*([A-Za-z_][A-Za-z0-9_]*(?:\\.[A-Za-z_][A-Za-z0-9_]*)*)\\s*\\(",
                Pattern.CASE_INSENSITIVE).matcher(line);
        if (callee.find()) {
            addFollowIdentifier(into, callee.group(1));
            String chain = callee.group(1);
            if (chain.contains(".")) {
                addFollowIdentifier(into, chain.substring(chain.lastIndexOf('.') + 1));
            }
        }
        // RHS operands after assignment: concat/append/format/interpolation identifiers
        int eq = line.indexOf('=');
        if (eq >= 0 && !line.contains("==") && !line.contains("!=") && !line.contains("<=") && !line.contains(">=")) {
            String rhs = line.substring(eq + 1);
            var rhsId = Pattern.compile("\\b([A-Za-z_][A-Za-z0-9_]*)\\b").matcher(rhs);
            int count = 0;
            while (rhsId.find() && count < 6 && into.size() < MAX_TRACKED_IDENTIFIERS) {
                addFollowIdentifier(into, rhsId.group(1));
                count++;
            }
            var templateId = Pattern.compile("\\$\\{\\s*([A-Za-z_][A-Za-z0-9_]*)|\\{([A-Za-z_][A-Za-z0-9_]*)\\}")
                    .matcher(rhs);
            while (templateId.find() && into.size() < MAX_TRACKED_IDENTIFIERS) {
                addFollowIdentifier(into,
                        templateId.group(1) != null ? templateId.group(1) : templateId.group(2));
            }
        }
        // Call arguments: foo(a, b) on RHS — follow first few identifier args
        var callArgs = Pattern.compile(
                "=\\s*[A-Za-z_][A-Za-z0-9_]*(?:\\.[A-Za-z_][A-Za-z0-9_]*)*\\s*\\(([^)]*)\\)")
                .matcher(line);
        if (callArgs.find()) {
            var argId = Pattern.compile("\\b([A-Za-z_][A-Za-z0-9_]*)\\b").matcher(callArgs.group(1));
            int count = 0;
            while (argId.find() && count < 4 && into.size() < MAX_TRACKED_IDENTIFIERS) {
                addFollowIdentifier(into, argId.group(1));
                count++;
            }
        }
        // data = f.read() / path.read_bytes()
        var attrRead = Pattern.compile(
                "=\\s*([A-Za-z_][A-Za-z0-9_]*)\\s*\\.\\s*(read|read_bytes|readlines|getText|getParameter)\\s*\\(",
                Pattern.CASE_INSENSITIVE).matcher(line);
        if (attrRead.find()) {
            addFollowIdentifier(into, attrRead.group(1));
        }
        // with open(path) as f  /  open(path, "rb")
        var openArg = Pattern.compile(
                "\\bopen\\s*\\(\\s*([A-Za-z_][A-Za-z0-9_]*)\\b",
                Pattern.CASE_INSENSITIVE).matcher(line);
        if (openArg.find()) {
            addFollowIdentifier(into, openArg.group(1));
        }
        // path = os.environ[...] / os.getenv(...) / environ.get(...)
        var envCarrier = Pattern.compile(
                "\\b(os\\.environ|os\\.getenv|getenv|environ\\.get|process\\.env|System\\.getenv|"
                        + "Environment\\.getProperty)\\b",
                Pattern.CASE_INSENSITIVE).matcher(line);
        if (envCarrier.find()) {
            var lhs = Pattern.compile("^\\s*([A-Za-z_][A-Za-z0-9_]*)\\s*=").matcher(line);
            if (lhs.find()) {
                addFollowIdentifier(into, lhs.group(1));
            }
        }
    }

    private void addFollowIdentifier(Set<String> into, String id) {
        if (id == null || id.isBlank() || into == null) {
            return;
        }
        if (IGNORED_IDENTIFIERS.contains(id.toLowerCase(Locale.ROOT))) {
            return;
        }
        into.add(id);
    }

    private boolean looksLikeClassicTaintSink(String codeExtract) {
        if (codeExtract == null || codeExtract.isBlank()) {
            return false;
        }
        String lower = codeExtract.toLowerCase(Locale.ROOT);
        return DESERIALIZATION_SINK_PATTERN.matcher(codeExtract).find()
                || looksLikeXssSink(lower) || looksLikeCommandSink(lower) || looksLikeSqlSink(lower)
                || looksLikePathSink(lower) || looksLikeTrustBoundarySink(lower)
                || looksLikeFormatStringSink(lower);
    }

    /** Request/session attribute stores and similar trust-boundary crossings. */
    private boolean looksLikeTrustBoundarySink(String lower) {
        return lower.contains(".setattribute(") || lower.contains("setattr(")
                || lower.contains("attributes.put(") || lower.contains("requestattributes.put(")
                || lower.contains("httpsession") && lower.contains("setattribute");
    }

    private boolean looksLikeFormatStringSink(String lower) {
        return lower.contains("string.format(") || lower.contains("messageformat")
                || lower.contains("formatter.format(") || lower.contains("printf(")
                || lower.contains("sprintf(") || lower.contains("fmt.sprintf(")
                || lower.contains("logger.printf(") || lower.contains("% formatting");
    }

    private boolean looksLikePathSink(String lower) {
        boolean pathCtorWithFsOp = (lower.contains("path(") || lower.contains("pathlib.path("))
                && (lower.contains("unlink") || lower.contains("rmdir") || lower.contains("write_text")
                || lower.contains("write_bytes") || lower.contains("read_text") || lower.contains("read_bytes")
                || lower.contains("mkdir") || lower.contains("rename") || lower.contains("replace")
                || lower.contains(".open("));
        return pathCtorWithFsOp
                // Python
                || lower.contains(".unlink(") || lower.contains(".rmdir(")
                || lower.contains("os.remove(") || lower.contains("os.unlink(")
                || lower.contains("os.rmdir(") || lower.contains("os.removeall(")
                || lower.contains("shutil.rmtree(") || lower.contains("shutil.move(")
                || lower.contains("shutil.copy(") || lower.contains("shutil.copy2(")
                || lower.contains("shutil.copyfile(") || lower.contains("shutil.copytree(")
                // Java / Kotlin NIO + IO
                || lower.contains("paths.get(") || lower.contains("path.of(")
                || lower.contains("files.delete") || lower.contains("files.write")
                || lower.contains("files.readallbytes") || lower.contains("files.readstring")
                || lower.contains("files.copy(") || lower.contains("files.move(")
                || lower.contains("files.newinputstream") || lower.contains("files.newoutputstream")
                || lower.contains("files.newbufferedreader") || lower.contains("files.newbufferedwriter")
                || lower.contains("new file(") || lower.contains("file.delete(")
                || lower.contains("new fileinputstream") || lower.contains("new fileoutputstream")
                || lower.contains("new filereader") || lower.contains("new filewriter")
                || lower.contains("new randomaccessfile") || lower.contains("fileutils.")
                // Node / JS
                || lower.contains("fs.unlink") || lower.contains("fs.rm(")
                || lower.contains("fs.writefile") || lower.contains("fs.readfile")
                || lower.contains("fs.appendfile") || lower.contains("fs.mkdir")
                || lower.contains("fs.rename") || lower.contains("fs.copyfile")
                || lower.contains("fspromises.") || lower.contains("fs.promises.")
                || lower.contains("path.join(") || lower.contains("path.resolve(")
                // PHP
                || lower.contains("file_get_contents(") || lower.contains("file_put_contents(")
                || lower.contains("fopen(") || lower.contains("move_uploaded_file(")
                || lower.contains("readfile(") || lower.contains("unlink(") || lower.contains("rmdir(")
                // Go
                || lower.contains("ioutil.readfile") || lower.contains("ioutil.writefile")
                || lower.contains("os.readfile") || lower.contains("os.writefile")
                || lower.contains("os.open(") || lower.contains("os.openfile")
                || lower.contains("os.create(") || lower.contains("os.remove(")
                || lower.contains("os.removeall(") || lower.contains("filepath.join(")
                // .NET
                || lower.contains("file.delete(") || lower.contains("file.writeall")
                || lower.contains("file.readall") || lower.contains("file.open(")
                || lower.contains("file.copy(") || lower.contains("file.move(")
                || lower.contains("file.openread(") || lower.contains("file.openwrite(")
                || lower.contains("directory.delete(") || lower.contains("path.combine(")
                || lower.contains("new filestream") || lower.contains("new streamreader")
                || lower.contains("new streamwriter")
                // Ruby
                || lower.contains("file.delete") || lower.contains("file.unlink")
                || lower.contains("fileutils.rm") || lower.contains("fileutils.mv")
                || lower.contains("fileutils.cp") || lower.contains("io.read(")
                || lower.contains("io.write(")
                // Rust
                || lower.contains("std::fs::") || lower.contains("tokio::fs::")
                || lower.contains("fs::read") || lower.contains("fs::write")
                || lower.contains("fs::remove_file") || lower.contains("fs::copy")
                || lower.contains("file::open") || lower.contains("file::create");
    }

    private boolean looksLikeXssSink(String lower) {
        return lower.contains("innerhtml") || lower.contains("outerhtml")
                || lower.contains("insertadjacenthtml") || lower.contains("dangerouslysetinnerhtml")
                || lower.contains("document.write") || lower.contains("mark_safe")
                || lower.contains("v-html") || lower.contains("bypasssecuritytrusthtml")
                || lower.contains("html_safe") || lower.contains("html.raw")
                || lower.contains("template.html") || lower.contains("|raw")
                || lower.contains("content_tag") || lower.contains("writeline(")
                || lower.contains("echo ") || lower.contains("response.write");
    }

    private boolean looksLikeCommandSink(String lower) {
        return lower.contains("runtime.getruntime") || lower.contains("processbuilder")
                || lower.contains("subprocess.") || lower.contains("os.system")
                || lower.contains("child_process") || lower.contains("shell_exec")
                || lower.contains("passthru") || lower.contains("exec.command")
                || lower.contains("proc_open") || lower.contains("process.start")
                || lower.contains("open3.") || lower.contains("command::new")
                || lower.contains("processstartinfo") || lower.contains("%x{")
                || lower.contains("run(args=") || lower.contains("run(cmd=");
    }

    private boolean looksLikeSqlSink(String lower) {
        return lower.contains("createnativequery") || lower.contains("createquery")
                || lower.contains("preparestatement") || lower.contains("executequery")
                || lower.contains("cursor.execute") || lower.contains("jdbctemplate")
                || lower.contains("sequelize.query") || lower.contains("knex.raw")
                || lower.contains("createquery(") || lower.contains("executescript")
                || lower.contains("mysqli_query") || lower.contains("pg_query")
                || lower.contains("queryrow") || lower.contains("querycontext")
                || lower.contains("find_by_sql") || lower.contains("fromsqlraw")
                || lower.contains("executesqlraw") || lower.contains("sqlx::query")
                || lower.contains("diesel::sql_query");
    }

    /**
     * Family-specific origin playbooks for SQLi / XSS / RCE so ReAct spends budget on likely sources
     * instead of only {@code var=} searches that miss HTTP/GUI/DB provenance.
     * Patterns intentionally span JS/TS, Python, Java/Kotlin, PHP, Go, Ruby, C#, Rust.
     */
    private void appendClassicTaintOriginSuggestions(List<String> suggestions, String extract, String nearby,
                                                     String sameFileGlob, String ext, String primary) {
        appendClassicTaintOriginSuggestions(suggestions, extract, nearby, sameFileGlob, ext, primary, null);
    }

    private void appendClassicTaintOriginSuggestions(List<String> suggestions, String extract, String nearby,
                                                     String sameFileGlob, String ext, String primary,
                                                     String language) {
        String haystack = ((extract == null ? "" : extract) + "\n" + (nearby == null ? "" : nearby))
                .toLowerCase(Locale.ROOT);
        String lang = language != null ? language : languageFromGlob(ext);
        String glob = sameFileGlob != null ? sameFileGlob : (ext != null ? ext : languageGlob(lang));
        String httpAccessors = "request\\.|req\\.|@RequestParam|@RequestBody|getParameter|params\\[|"
                + "\\$_GET|\\$_POST|\\$_REQUEST|c\\.Query|c\\.Param|c\\.PostForm|FormValue|"
                + "chi\\.URLParam|\\[FromBody\\]|\\[FromQuery\\]|web::Query|extract::Query|"
                + "HttpContext\\.Request|Request\\.Query|Request\\.Form";
        if (looksLikeSqlSink(haystack)) {
            suggestions.add(String.format(
                    "SQL origin HTTP params: search_repo pattern=\"\\b(%s)\" path_glob=\"%s\"",
                    httpAccessors, glob));
            suggestions.add(String.format(
                    "SQL string builders: search_repo pattern=\"\\b(%s)\\s*(\\+|\\.|append|format|fmt\\.Sprintf|"
                            + "f[\\\"']|<<)\" path_glob=\"%s\"",
                    primary != null ? Pattern.quote(primary) : "(sql|query|stmt)", glob));
            suggestions.add(String.format(
                    "SQL ORM/raw helpers: search_repo pattern=\"\\b(find_by_sql|FromSqlRaw|sqlx::query|"
                            + "diesel::sql_query|sequelize\\.query|knex\\.raw|mysqli_query|QueryRow)\" path_glob=\"%s\"",
                    ext));
            suggestions.add(
                    "SQLi: classify input_source from the first untrusted operand reaching dynamic SQL "
                            + "(http_request/database/gui_input); unknown only if no operand origin is findable.");
        }
        if (looksLikeXssSink(haystack)) {
            suggestions.add(String.format(
                    "XSS HTML payload origin: search_repo pattern=\"\\b(%s)\\s*=\" path_glob=\"%s\"",
                    primary != null ? Pattern.quote(primary) : "(html|markup|content|body|message)", glob));
            suggestions.add(String.format(
                    "XSS untrusted sources: search_repo pattern=\"\\b(%s|location\\.|innerHTML|textContent|"
                            + "dataset|html_safe|Html\\.Raw|template\\.HTML|mark_safe)\" path_glob=\"%s\"",
                    httpAccessors, glob));
            suggestions.add(String.format(
                    "Server XSS sinks: search_repo pattern=\"\\b(echo|print|Html\\.Raw|html_safe|raw\\(|"
                            + "content_tag|template\\.HTML|Response\\.Write|\\|[ ]*raw)\" path_glob=\"%s\"",
                    ext));
            suggestions.add(
                    "XSS: prefer input_source=http_request/dom_content/database when those reach the HTML sink; "
                            + "do not leave unknown if a concrete accessor is visible.");
        }
        if (looksLikeCommandSink(haystack)) {
            suggestions.add(String.format(
                    "RCE command origin: search_repo pattern=\"\\b(%s)\\s*=\" path_glob=\"%s\"",
                    primary != null ? Pattern.quote(primary) : "(cmd|command|args|argv|shell)", glob));
            suggestions.add(String.format(
                    "RCE untrusted sources: search_repo pattern=\"\\b(%s|JTextField|getText\\(|argv|"
                            + "process\\.argv|os\\.Args|std::env::args|ARGV)\" path_glob=\"%s\"",
                    httpAccessors, glob));
            suggestions.add(String.format(
                    "RCE exec APIs: search_repo pattern=\"\\b(Runtime\\.getRuntime|ProcessBuilder|"
                            + "subprocess\\.|child_process|shell_exec|passthru|exec\\.Command|Process\\.Start|"
                            + "Open3\\.|Command::new|system\\()\" path_glob=\"%s\"",
                    ext));
            suggestions.add(String.format(
                    "Config/script setting origin: search_repo pattern=\"\\b(PRE_CONSUME_SCRIPT|POST_CONSUME_SCRIPT|"
                            + "CONSUME_SCRIPT|[A-Z_]*SCRIPT)\\s*=\" path_glob=\"%s\"",
                    ext.contains("py") || "*.py".equals(ext) ? "*.py" : ext));
            suggestions.add(
                    "Command injection: trace argv (not Runtime/subprocess). settings.X alone is not trust — "
                            + "find where the setting value is assigned. Operator env/hardcoded => FP; "
                            + "user/admin-writable => TP; origin not found => UNCERTAIN.");
        }
        if (looksLikePathSink(haystack)) {
            String repoGlob = ext != null ? ext : languageGlob(lang);
            suggestions.add(String.format(
                    "Path variable origin: search_repo pattern=\"\\b(%s)\\s*[=:]\" path_glob=\"%s\"",
                    primary != null ? Pattern.quote(primary)
                            : "(path|filePath|filepath|filename|fileName|source|dest|target)",
                    glob));
            suggestions.add(String.format(
                    "Path object/model field chase: search_repo pattern=\"\\b(original_?file|original_?filename|"
                            + "filename|fileName|filepath|filePath|file_path|upload_?path|tmp_?path|source_?path|"
                            + "archive_?path|thumbnail_?path|absolute_?file_?path|getSourcePath|getFilename|"
                            + "getOriginalFilename|AbsoluteFilePath)\\b\" path_glob=\"%s\"",
                    repoGlob));
            suggestions.add(String.format(
                    "Path getter/property definition: search_repo pattern=\"\\b(def\\s+\\w*path\\w*|"
                            + "@property|getSourcePath|getArchivePath|getThumbnailPath|getFileName|"
                            + "getOriginalFilename|func\\s+\\(\\w+\\)\\s+\\w*Path|fn\\s+\\w*path)\\b\" "
                            + "path_glob=\"%s\"",
                    repoGlob));
            suggestions.add(String.format(
                    "Path carrier / upload types: search_repo pattern=\"\\b(ConsumableDocument|UploadedFile|"
                            + "MultipartFile|IFormFile|NamedTemporaryFile|tempfile|FormData|c\\.FormFile|"
                            + "UploadedFileInterface|ActionDispatch::Http::UploadedFile|"
                            + "std::fs::File|tokio::fs)\\b\" path_glob=\"%s\"",
                    repoGlob));
            suggestions.add(String.format(
                    "Path untrusted sources: search_repo pattern=\"\\b(%s|request\\.FILES|\\$_FILES|"
                            + "UploadedFile|MultipartFile|IFormFile|getOriginalFilename|original_filename|"
                            + "originalFilename|original_file|c\\.FormFile|params\\[:file\\])\" path_glob=\"%s\"",
                    httpAccessors, glob));
            suggestions.add(String.format(
                    "Path join/canonical checks: search_repo pattern=\"\\b(resolve|realpath|RealPath|"
                            + "getCanonicalPath|toRealPath|Normalize|filepath\\.Clean|filepath\\.Abs|"
                            + "path\\.resolve|path\\.normalize|secure_filename|os\\.path\\.commonpath|"
                            + "Path\\.GetFullPath|startsWith|StartsWith|hasPrefix|stripPrefix)\\b\" "
                            + "path_glob=\"%s\"",
                    glob));
            appendLanguagePathApiSuggestions(suggestions, lang, repoGlob);
            appendObjectFieldChainSuggestions(suggestions, haystack, repoGlob);
            suggestions.add(
                    "Path traversal (any language): constructor/plugin param, ORM/model attribute, or "
                            + "getter (getSourcePath/source_path) is not trust — chase field/property definition "
                            + "and who sets filename/path components. User/upload/HTTP path without base-dir "
                            + "canonicalization (resolve/realpath/GetFullPath/filepath.Clean + prefix allowlist) "
                            + "=> TP; proven static/operator path or confined join => FP; origin still unknown "
                            + "=> UNCERTAIN.");
        }
    }

    /** Language-specific filesystem API searches for path-traversal ReAct. */
    private void appendLanguagePathApiSuggestions(List<String> suggestions, String language, String ext) {
        if (suggestions == null) {
            return;
        }
        String glob = ext != null ? ext : languageGlob(language);
        String lang = language == null ? "" : language;
        switch (lang) {
            case "python" -> suggestions.add(String.format(
                    "Python FS sinks: search_repo pattern=\"\\b(pathlib\\.Path|shutil\\.(copy|move|rmtree)|"
                            + "os\\.(remove|unlink|open)|open\\s*\\()\" path_glob=\"%s\"", glob));
            case "java", "kotlin" -> suggestions.add(String.format(
                    "JVM FS sinks: search_repo pattern=\"\\b(Paths\\.get|Path\\.of|Files\\.(delete|copy|move|write|"
                            + "newInputStream)|new\\s+File(InputStream|OutputStream|Reader|Writer)?|"
                            + "FileUtils\\.)\" path_glob=\"%s\"", glob));
            case "javascript", "typescript" -> suggestions.add(String.format(
                    "Node FS sinks: search_repo pattern=\"\\b(fs(?:promises)?\\.(unlink|rm|writeFile|readFile|"
                            + "copyFile|mkdir)|path\\.(join|resolve)|fse\\.)\" path_glob=\"%s\"", glob));
            case "go" -> suggestions.add(String.format(
                    "Go FS sinks: search_repo pattern=\"\\b(os\\.(Open|OpenFile|Create|Remove|RemoveAll|"
                            + "ReadFile|WriteFile)|ioutil\\.(ReadFile|WriteFile)|filepath\\.(Join|Clean|Abs))\" "
                            + "path_glob=\"%s\"", glob));
            case "php" -> suggestions.add(String.format(
                    "PHP FS sinks: search_repo pattern=\"\\b(fopen|file_get_contents|file_put_contents|unlink|"
                            + "rmdir|move_uploaded_file|include|require|copy|rename)\\s*\\(\" path_glob=\"%s\"",
                    glob));
            case "csharp" -> suggestions.add(String.format(
                    "NET FS sinks: search_repo pattern=\"\\b(File\\.(Delete|Copy|Move|Open|WriteAll|ReadAll)|"
                            + "Directory\\.(Delete|Move)|Path\\.(Combine|GetFullPath)|new\\s+FileStream)\" "
                            + "path_glob=\"%s\"", glob));
            case "ruby" -> suggestions.add(String.format(
                    "Ruby FS sinks: search_repo pattern=\"\\b(File\\.(delete|unlink|open|read|write)|"
                            + "FileUtils\\.(rm_r|rm_rf|mv|cp)|IO\\.(read|write)|open\\s*\\()\" path_glob=\"%s\"",
                    glob));
            case "rust" -> suggestions.add(String.format(
                    "Rust FS sinks: search_repo pattern=\"\\b(std::fs::|tokio::fs::|fs::(read|write|copy|"
                            + "remove_file|create_dir)|File::(open|create))\" path_glob=\"%s\"", glob));
            default -> suggestions.add(String.format(
                    "FS sinks (generic): search_repo pattern=\"\\b(Files\\.|fs\\.|os\\.(Open|Remove)|"
                            + "File\\.(Delete|Open)|pathlib|shutil|file_get_contents|std::fs)\" path_glob=\"%s\"",
                    glob));
        }
    }

    /**
     * ReAct seeds for CWE-501 / setAttribute-style sinks: chase VALUE → object/getter → config loaders
     * → field writers, without treating nearby HTTP headers as the value source by default.
     */
    private void appendTrustBoundarySuggestions(List<String> suggestions, String extract, String nearby,
                                                String sameFileGlob, String ext, String primary) {
        if (suggestions == null) {
            return;
        }
        String haystack = ((extract == null ? "" : extract) + "\n" + (nearby == null ? "" : nearby));
        if (!looksLikeTrustBoundarySink(haystack.toLowerCase(Locale.ROOT))
                && (primary == null || !primary.toLowerCase(Locale.ROOT).contains("getid"))) {
            return;
        }
        String glob = sameFileGlob != null ? sameFileGlob : (ext != null ? ext : "*.java");
        String root = primary;
        String leaf = primary;
        if (primary != null && primary.contains(".")) {
            root = primary.substring(0, primary.indexOf('.'));
            leaf = primary.substring(primary.lastIndexOf('.') + 1);
        }
        if (root != null && !root.isBlank()) {
            suggestions.add(String.format(
                    "Trust-boundary VALUE carrier '%s': search_repo pattern=\"\\b%s\\s*=\" path_glob=\"%s\"",
                    root, Pattern.quote(root), glob));
            suggestions.add(String.format(
                    "Config/object init for '%s': search_repo pattern=\"\\b(initializeFromConfig|clone\\s*\\(|"
                            + "new\\s+\\w*%s\\w*|setFilterConfig)\\b\" path_glob=\"%s\"",
                    root, Pattern.quote(capitalizeAscii(root)), ext != null ? ext : glob));
        }
        if (leaf != null && !leaf.isBlank()) {
            String field = leaf.replaceAll("(?i)^get", "");
            if (field.isBlank()) {
                field = leaf;
            }
            suggestions.add(String.format(
                    "Getter/field '%s' definition/writers: search_repo pattern=\"\\b(get%s\\s*\\(|set%s\\s*\\(|"
                            + "%s\\s*=)\" path_glob=\"%s\"",
                    leaf, Pattern.quote(capitalizeAscii(field)), Pattern.quote(capitalizeAscii(field)),
                    Pattern.quote(field), ext != null ? ext : glob));
        }
        suggestions.add(String.format(
                "SecurityNamedServiceConfig / filter config id origin: search_repo pattern=\""
                        + "\\b(SecurityNamedServiceConfig|FilterConfig|getId\\s*\\(|setId\\s*\\(|\\.id\\s*=)\" "
                        + "path_glob=\"%s\"",
                ext != null ? ext : glob));
        suggestions.add(
                "CWE-501: classify input_source from the setAttribute/put VALUE only. "
                        + "Nearby getHeader is NOT the source unless that VALUE is derived from it. "
                        + "Operator/admin security config id => config_file|internal_call + FALSE_POSITIVE; "
                        + "attacker-controlled value crossing into trusted request/session state => TRUE_POSITIVE; "
                        + "writers of config id not found => UNCERTAIN.");
    }

    private String languageFromGlob(String extOrGlob) {
        if (extOrGlob == null) {
            return "";
        }
        String e = extOrGlob.toLowerCase(Locale.ROOT);
        if (e.contains(".py")) return "python";
        if (e.contains(".java")) return "java";
        if (e.contains(".kt")) return "kotlin";
        if (e.contains(".ts") || e.contains(".tsx")) return "typescript";
        if (e.contains(".js") || e.contains(".jsx") || e.contains(".mjs")) return "javascript";
        if (e.contains(".go")) return "go";
        if (e.contains(".php")) return "php";
        if (e.contains(".cs")) return "csharp";
        if (e.contains(".rb")) return "ruby";
        if (e.contains(".rs")) return "rust";
        return "";
    }

    /**
     * When a path is built from {@code self.input_doc.original_file} or {@code document.source_path}
     * chains, push ReAct searches for each attribute — same-file param typing alone is insufficient.
     */
    private void appendObjectFieldChainSuggestions(List<String> suggestions, String haystack, String ext) {
        if (suggestions == null || haystack == null || haystack.isBlank()) {
            return;
        }
        Set<String> seen = new LinkedHashSet<>();
        var nested = Pattern.compile(
                "\\b(?:self|this)\\s*\\.\\s*([A-Za-z_][A-Za-z0-9_]*)\\s*\\.\\s*([A-Za-z_][A-Za-z0-9_]*)")
                .matcher(haystack);
        while (nested.find() && seen.size() < 6) {
            addPathFieldSearchSuggestion(suggestions, seen, nested.group(1), nested.group(2), ext);
        }
        var modelPath = PATH_MODEL_PATH_FIELD_PATTERN.matcher(haystack);
        while (modelPath.find() && seen.size() < 8) {
            addPathFieldSearchSuggestion(suggestions, seen, modelPath.group(1), modelPath.group(2), ext);
        }
    }

    private void addPathFieldSearchSuggestion(List<String> suggestions, Set<String> seen,
                                              String obj, String field, String ext) {
        if (obj == null || field == null || seen == null || suggestions == null) {
            return;
        }
        String root = obj.toLowerCase(Locale.ROOT);
        if (IGNORED_IDENTIFIERS.contains(root)
                || Set.of("os", "sys", "pathlib", "shutil", "path", "fs", "files", "paths",
                "io", "re", "json", "logging", "settings", "django", "system", "java", "nio",
                "fileutils", "commons", "apache", "std", "tokio", "filepath", "ioutil",
                "directory", "nodejs").contains(root)) {
            return;
        }
        String key = obj + "." + field;
        if (!seen.add(key)) {
            return;
        }
        String fieldLeaf = field.replaceAll("(?i)^get", "");
        suggestions.add(String.format(
                "Object-field '%s.%s' assignment/property: search_repo pattern=\"\\b(def\\s+%s\\b|"
                        + "func\\s+\\(\\w+\\)\\s+%s\\b|fn\\s+%s\\b|get%s\\s*\\(|%s\\s*[=:])\" path_glob=\"%s\"",
                obj, field,
                Pattern.quote(field), Pattern.quote(field), Pattern.quote(field),
                Pattern.quote(capitalizeAscii(fieldLeaf)), Pattern.quote(field), ext));
        suggestions.add(String.format(
                "Object '%s' construction/type: search_repo pattern=\"\\b(class\\s+\\w*%s\\w*|"
                        + "struct\\s+\\w*%s\\w*|type\\s+\\w*%s\\w*|%s\\s*[:=])\" path_glob=\"%s\"",
                obj, Pattern.quote(capitalizeAscii(obj)), Pattern.quote(capitalizeAscii(obj)),
                Pattern.quote(capitalizeAscii(obj)), Pattern.quote(obj), ext));
    }

    private String capitalizeAscii(String value) {
        if (value == null || value.isBlank()) {
            return "";
        }
        return Character.toUpperCase(value.charAt(0)) + value.substring(1);
    }

    /**
     * Pulls nearby open/read/env lines around a deserialization sink so provenance is visible even
     * when the payload variable was not assigned with a simple identifier RHS.
     */
    private int appendNearbyProvenanceLines(List<String> lines, int targetIdx, Set<Integer> seenLines,
                                            StringBuilder sb, int budget) {
        if (budget <= 0 || lines == null || lines.isEmpty()) {
            return 0;
        }
        Pattern provenance = Pattern.compile(
                "\\b(open|read_bytes|readAllBytes|file_get_contents|os\\.environ|os\\.getenv|getenv|"
                        + "environ\\.get|process\\.env|System\\.getenv|settings\\.[A-Z_]+)\\b"
                        + "|\\.read\\s*\\("
                        // Observed store/cache get/set near deser — include as code facts, not file guesses
                        + "|\\w*(?:backend|cache|redis|memcache|store)\\w*\\s*\\.\\s*(?:get|set)\\s*\\(",
                Pattern.CASE_INSENSITIVE);
        int added = 0;
        for (int distance = 1; distance <= 40 && added < budget; distance++) {
            for (int idx : new int[]{targetIdx - distance, targetIdx + distance}) {
                if (idx < 0 || idx >= lines.size() || idx == targetIdx || seenLines.contains(idx)) {
                    continue;
                }
                String line = lines.get(idx);
                if (line == null || line.isBlank()) {
                    continue;
                }
                if (provenance.matcher(line).find()) {
                    sb.append(idx + 1).append("| ").append(line).append('\n');
                    seenLines.add(idx);
                    added++;
                    if (added >= budget) {
                        break;
                    }
                }
            }
        }
        return added;
    }

    private List<String> extractStimulusSyntheticDefinitions(List<String> lines, Set<String> identifiers) {
        String text = String.join("\n", lines);
        if (!STIMULUS_CONTROLLER_PATTERN.matcher(text).find()) {
            return List.of();
        }

        boolean hasValues = STIMULUS_STATIC_VALUES_PATTERN.matcher(text).find();
        boolean hasTargets = STIMULUS_STATIC_TARGETS_PATTERN.matcher(text).find();
        if (!hasValues && !hasTargets) {
            return List.of();
        }

        Set<String> declaredValues = new LinkedHashSet<>();
        if (hasValues) {
            declaredValues = extractStimulusStaticKeys(lines, STIMULUS_STATIC_VALUES_PATTERN, '{', '}');
        }

        Set<String> declaredTargets = new LinkedHashSet<>();
        if (hasTargets) {
            declaredTargets = extractStimulusStaticKeys(lines, STIMULUS_STATIC_TARGETS_PATTERN, '[', ']');
        }

        List<String> synthetic = new ArrayList<>();
        for (String identifier : identifiers) {
            if (identifier.endsWith("Value") && identifier.length() > "Value".length()) {
                String base = identifier.substring(0, identifier.length() - "Value".length());
                if (declaredValues.contains(base)) {
                    synthetic.add(String.format(
                            "this.%s derives from Stimulus static values key '%s' (template attribute candidate: data-*-"
                                    + "%s-value)",
                            identifier, base, toKebabCase(base)));
                }
            }
            if (identifier.endsWith("Target") && identifier.length() > "Target".length()) {
                String base = identifier.substring(0, identifier.length() - "Target".length());
                if (declaredTargets.contains(base)) {
                    synthetic.add(String.format(
                            "this.%s derives from Stimulus static targets key '%s' "
                                    + "(DOM element with data-*-target=\"%s\")",
                            identifier, base, base));
                }
            }
            if (identifier.endsWith("Targets") && identifier.length() > "Targets".length()) {
                String base = identifier.substring(0, identifier.length() - "Targets".length());
                if (declaredTargets.contains(base)) {
                    synthetic.add(String.format(
                            "this.%sTargets derives from Stimulus static targets key '%s' "
                                    + "(array of DOM elements with data-*-target=\"%s\")",
                            base, base, base));
                }
            }
        }
        return synthetic;
    }

    private Set<String> extractStimulusStaticKeys(List<String> lines, Pattern startPattern,
                                                   char openChar, char closeChar) {
        int startIdx = -1;
        for (int i = 0; i < lines.size(); i++) {
            if (startPattern.matcher(lines.get(i)).find()) {
                startIdx = i;
                break;
            }
        }
        if (startIdx < 0) {
            return Set.of();
        }

        Set<String> keys = new LinkedHashSet<>();
        if (openChar == '[') {
            Pattern stringPattern = Pattern.compile("['\"]([A-Za-z_][A-Za-z0-9_]*)['\"]");
            int depth = 0;
            boolean opened = false;
            for (int i = startIdx; i < lines.size(); i++) {
                String line = lines.get(i);
                for (char c : line.toCharArray()) {
                    if (c == openChar) { depth++; opened = true; }
                    else if (c == closeChar) { depth--; }
                }
                var matcher = stringPattern.matcher(line);
                while (matcher.find()) {
                    keys.add(matcher.group(1));
                }
                if (opened && depth <= 0) break;
            }
        } else {
            Pattern keyPattern = Pattern.compile("\\b([A-Za-z_][A-Za-z0-9_]*)\\s*:");
            int depth = 0;
            boolean opened = false;
            for (int i = startIdx; i < lines.size(); i++) {
                String line = lines.get(i);
                for (char c : line.toCharArray()) {
                    if (c == openChar) { depth++; opened = true; }
                    else if (c == closeChar) { depth--; }
                }
                var matcher = keyPattern.matcher(line);
                while (matcher.find()) {
                    keys.add(matcher.group(1));
                }
                if (opened && depth <= 0) break;
            }
        }
        return keys;
    }

    private Set<String> extractIdentifiers(String code) {
        Set<String> identifiers = new LinkedHashSet<>();
        var matcher = IDENTIFIER_PATTERN.matcher(code);
        while (matcher.find() && identifiers.size() < MAX_TRACKED_IDENTIFIERS) {
            String token = matcher.group();
            if (token.length() < 2) continue;
            if (IGNORED_IDENTIFIERS.contains(token.toLowerCase(Locale.ROOT))) continue;
            identifiers.add(token);
        }
        return identifiers;
    }

    /**
     * Language-agnostic best-effort caller finder. Bearer's per-finding source is almost always the
     * sink line itself, so the origin of a value that arrives as a function parameter is not in the
     * shown code. This locates the function enclosing the finding, then surfaces the sites in the same
     * file that call it (with a small surrounding window) so the model can see what arguments — and
     * therefore what data — reach that parameter. Falls back to an empty string; never throws.
     */
    private String extractCallerContext(List<String> lines, Item item, String language) {
        if (lines.isEmpty()) {
            return "";
        }
        int targetIdx = Math.min(Math.max(0, item.getLineNumber() - 1), lines.size() - 1);
        int funcStart = findFunctionStart(lines, targetIdx, language);
        if (funcStart < 0) {
            return "";
        }

        String funcName = extractFunctionName(lines.get(funcStart));
        if (funcName == null || funcName.length() < 2
                || IGNORED_IDENTIFIERS.contains(funcName.toLowerCase(Locale.ROOT))) {
            return "";
        }

        String filename = item.getFullFilename() != null ? item.getFullFilename() : item.getFilename();
        List<String> searchSymbols = resolveCallerSearchSymbols(lines, funcStart, funcName, filename, language);
        List<Pattern> callPatterns = searchSymbols.stream().map(this::callSitePattern).toList();

        StringBuilder sb = new StringBuilder();
        List<String> callSiteArgs = new ArrayList<>();
        int sites = 0;
        for (int i = 0; i < lines.size() && sites < MAX_CALLER_SITES; i++) {
            if (i == funcStart) continue;
            String line = lines.get(i);
            if (line.isBlank() || searchSymbols.stream().anyMatch(sym -> looksLikeDefinitionOf(line, sym))) {
                continue;
            }
            if (callPatterns.stream().anyMatch(p -> p.matcher(line).find())) {
                sb.append("// call site at line ").append(i + 1).append(":\n");
                appendWindow(sb, lines, i);
                sb.append('\n');
                int from = Math.max(0, i - 1);
                int to = Math.min(lines.size(), i + 3);
                callSiteArgs.add(String.join("\n", lines.subList(from, to)));
                sites++;
            }
        }
        String localCode = extractFunction(lines, item.getLineNumber(), language);
        if (item.getCodeExtract() != null) {
            localCode = localCode + "\n" + item.getCodeExtract();
        }
        if (shouldEmitLiteralCallsiteOriginTag(callSiteArgs, localCode)) {
            sb.append("// [origin-tag: all-callsites-pass-literal-arg=true]\n");
        }
        return sb.toString().trim();
    }

    /**
     * Ranked cross-file caller search. Files that explicitly import the finding's module are visited
     * first (priority 0), then files in the same package/directory (priority 1), and finally the
     * rest of the repository (priority 2, capped). Annotates each call site with its priority label
     * so the model immediately knows which callers are the most authoritative.
     *
     * <p>Only called when the evidence category is AMBIGUOUS or DEAD_END; skipped entirely for
     * categories where local evidence is already sufficient.
     */
    private String extractRankedCrossFileCallerContext(String repoDir, String filename,
                                                       List<String> lines, Item item,
                                                       String language, String fileImports) {
        if (repoDir == null || repoDir.isBlank() || filename == null || lines.isEmpty()) {
            return "";
        }

        int targetIdx = Math.min(Math.max(0, item.getLineNumber() - 1), lines.size() - 1);
        int funcStart = findFunctionStart(lines, targetIdx, language);
        if (funcStart < 0) {
            return "";
        }

        String funcName = extractFunctionName(lines.get(funcStart));
        if (funcName == null || funcName.length() < 3
                || IGNORED_IDENTIFIERS.contains(funcName.toLowerCase(Locale.ROOT))) {
            return "";
        }

        List<String> searchSymbols = resolveCallerSearchSymbols(lines, funcStart, funcName, filename, language);
        List<Pattern> callPatterns = searchSymbols.stream().map(this::callSitePattern).toList();
        Path base;
        try {
            base = Path.of(repoDir).toRealPath();
        } catch (IOException e) {
            return "";
        }

        String normalizedFindingFile = filename.replace('\\', '/');
        List<String> moduleNames = deriveModuleNames(filename);
        Path findingDir = Path.of(normalizedFindingFile).getParent();

        record CandidateFile(String rel, List<String> candidateLines, int priority) {}

        // ── Phase 1: same-package directory (always fully scanned, no file limit) ──────
        // Callers in the same directory are the most likely source of context and must
        // never be excluded by the global file budget.
        List<CandidateFile> candidates = new ArrayList<>();
        if (findingDir != null) {
            Path samePackageDir = base.resolve(findingDir.toString());
            if (Files.isDirectory(samePackageDir)) {
                try (Stream<Path> dirStream = Files.list(samePackageDir)) {
                    dirStream.filter(p -> !Files.isDirectory(p))
                             .filter(this::isSource)
                             .forEach(p -> {
                                 String rel = base.relativize(p).toString().replace('\\', '/');
                                 if (rel.equals(normalizedFindingFile)) return;
                                 try {
                                     if (Files.size(p) > MAX_REPO_SOURCE_BYTES) return;
                                     List<String> cLines = Files.readAllLines(p, StandardCharsets.UTF_8);
                                     candidates.add(new CandidateFile(rel, cLines, 1));
                                 } catch (IOException ignored) {}
                             });
                } catch (IOException e) {
                    log.debug("[CodeContextExtractor] Cannot list same-package dir for {}: {}", filename, e.getMessage());
                }
            }
        }

        // ── Phase 2: files that import the module (bounded, cross-directory) ────────────
        Set<String> alreadyAdded = candidates.stream()
                .map(CandidateFile::rel)
                .collect(java.util.stream.Collectors.toCollection(java.util.LinkedHashSet::new));
        int importPassCount = 0;
        try (Stream<Path> walk = Files.walk(base)) {
            for (Path p : (Iterable<Path>) walk
                    .filter(f -> !Files.isDirectory(f))
                    .filter(f -> !isSkipped(base, f))
                    .filter(this::isSource)::iterator) {
                if (importPassCount >= MAX_IMPORT_PASS_FILES) break;
                String rel = base.relativize(p).toString().replace('\\', '/');
                if (rel.equals(normalizedFindingFile) || alreadyAdded.contains(rel)) continue;
                try {
                    if (Files.size(p) > MAX_REPO_SOURCE_BYTES) continue;
                    List<String> cLines = Files.readAllLines(p, StandardCharsets.UTF_8);
                    String cImports = extractImports(cLines);
                    if (moduleNames.stream().anyMatch(cImports::contains)) {
                        candidates.add(new CandidateFile(rel, cLines, 0));
                        alreadyAdded.add(rel);
                        // Count only files that actually import the module (budget for importers).
                        importPassCount++;
                    }
                } catch (IOException ignored) {}
            }
        } catch (IOException e) {
            log.debug("[CodeContextExtractor] Cannot scan imports pass for {}: {}", filename, e.getMessage());
        }

        // ── Phase 3: broad repo fallback (bounded, picks up cross-package callers) ──────
        int fallbackCount = 0;
        try (Stream<Path> walk = Files.walk(base)) {
            for (Path p : (Iterable<Path>) walk
                    .filter(f -> !Files.isDirectory(f))
                    .filter(f -> !isSkipped(base, f))
                    .filter(this::isSource)::iterator) {
                if (fallbackCount >= MAX_REPO_CALLER_FILES) break;
                String rel = base.relativize(p).toString().replace('\\', '/');
                if (rel.equals(normalizedFindingFile) || alreadyAdded.contains(rel)) {
                    fallbackCount++;
                    continue;
                }
                try {
                    if (Files.size(p) > MAX_REPO_SOURCE_BYTES) { fallbackCount++; continue; }
                    List<String> cLines = Files.readAllLines(p, StandardCharsets.UTF_8);
                    candidates.add(new CandidateFile(rel, cLines, 2));
                    alreadyAdded.add(rel);
                } catch (IOException ignored) {}
                fallbackCount++;
            }
        } catch (IOException e) {
            log.debug("[CodeContextExtractor] Cannot scan fallback pass for {}: {}", filename, e.getMessage());
        }

        // priority 0 (imports) → 1 (same-package) → 2 (fallback)
        candidates.sort(Comparator.comparingInt(CandidateFile::priority));

        StringBuilder sb = new StringBuilder();
        int sites = 0;
        // Track argument expressions at each call site to detect all-literals pattern
        List<String> callSiteArgs = new ArrayList<>();

        for (CandidateFile candidate : candidates) {
            if (sites >= MAX_REPO_CALLER_SITES) break;
            List<String> cLines = candidate.candidateLines();
            for (int i = 0; i < cLines.size() && sites < MAX_REPO_CALLER_SITES; i++) {
                String line = cLines.get(i);
                if (line.isBlank() || searchSymbols.stream().anyMatch(sym -> looksLikeDefinitionOf(line, sym))) {
                    continue;
                }
                if (callPatterns.stream().anyMatch(p -> p.matcher(line).find())) {
                    String label = candidate.priority() == 0 ? "[imports module] "
                            : candidate.priority() == 1 ? "[same package] " : "";
                    sb.append("// ").append(label).append("external call site in ")
                      .append(candidate.rel()).append(" at line ").append(i + 1).append(":\n");
                    appendWindow(sb, cLines, i);
                    sb.append('\n');
                    // Include nearby lines so multi-line call arguments can still look literal/constant.
                    int from = Math.max(0, i - 1);
                    int to = Math.min(cLines.size(), i + 3);
                    callSiteArgs.add(String.join("\n", cLines.subList(from, to)));
                    sites++;
                }
            }
        }

        // ── OriginTag: annotate when every discovered call site passes a string literal ──
        // This gives the LLM (and deterministic normalizer) a hard signal that the tainted
        // argument is config/code-backed, not attacker-controlled — but NOT when the sink SQL
        // is built locally from identifiers/fields (call-site ctor literals are then irrelevant).
        String localCode = extractFunction(lines, item.getLineNumber(), language);
        if (item.getCodeExtract() != null) {
            localCode = localCode + "\n" + item.getCodeExtract();
        }
        if (shouldEmitLiteralCallsiteOriginTag(callSiteArgs, localCode)) {
            sb.append("// [origin-tag: all-callsites-pass-literal-arg=true]\n");
        }

        return sb.toString().trim();
    }

    /**
     * Resolves symbols to search for callers of the finding's function. Always includes same-file
     * public/API callers of a leaf helper (e.g. {@code dialogDiv} ← {@code openDialog}), because
     * external code typically invokes the exported API, not the helper. Also adds the enclosing
     * class/module name for private helpers or helpers with no same-file call sites.
     */
    private List<String> resolveCallerSearchSymbols(List<String> lines, int funcStart, String funcName,
                                                    String filename, String language) {
        LinkedHashSet<String> symbols = new LinkedHashSet<>();
        if (funcName != null && !funcName.isBlank()) {
            symbols.add(funcName);
        }
        // Always hoist to same-file API wrappers — needed for JS helpers with local callers
        // (dialogDiv ← openDialog) and Java private helpers alike.
        symbols.addAll(findSameFileCallersOf(lines, funcStart, funcName, language));
        String signature = funcStart >= 0 && funcStart < lines.size() ? lines.get(funcStart) : "";
        boolean privateOrProtected = Pattern.compile("\\b(private|protected)\\b").matcher(signature).find();
        String className = classNameFromFilename(filename);
        if (privateOrProtected || countSameFileCallSites(lines, funcStart, funcName) == 0) {
            if (className != null && className.length() >= 3) {
                symbols.add(className);
            }
        }
        return List.copyOf(symbols);
    }

    private String classNameFromFilename(String filename) {
        if (filename == null || filename.isBlank()) {
            return null;
        }
        String normalized = filename.replace('\\', '/');
        int slash = normalized.lastIndexOf('/');
        String base = slash >= 0 ? normalized.substring(slash + 1) : normalized;
        int dot = base.lastIndexOf('.');
        return dot > 0 ? base.substring(0, dot) : base;
    }

    private int countSameFileCallSites(List<String> lines, int funcStart, String funcName) {
        if (funcName == null || funcName.length() < 2) {
            return 0;
        }
        Pattern callPattern = callSitePattern(funcName);
        int sites = 0;
        for (int i = 0; i < lines.size(); i++) {
            if (i == funcStart) continue;
            String line = lines.get(i);
            if (line.isBlank() || looksLikeDefinitionOf(line, funcName)) continue;
            if (callPattern.matcher(line).find()) {
                sites++;
            }
        }
        return sites;
    }

    private List<String> findSameFileCallersOf(List<String> lines, int helperFuncStart, String helperName,
                                               String language) {
        if (helperName == null || helperName.length() < 2 || lines.isEmpty()) {
            return List.of();
        }
        Pattern helperCall = callSitePattern(helperName);
        LinkedHashSet<String> callers = new LinkedHashSet<>();
        for (int i = 0; i < lines.size(); i++) {
            if (i == helperFuncStart) continue;
            String line = lines.get(i);
            if (!helperCall.matcher(line).find() || looksLikeDefinitionOf(line, helperName)) {
                continue;
            }
            int callerStart = findFunctionStart(lines, i, language == null ? "javascript" : language);
            if (callerStart < 0 || callerStart == helperFuncStart) {
                continue;
            }
            String callerName = extractFunctionName(lines.get(callerStart));
            String callerSig = lines.get(callerStart);
            if (callerName == null || callerName.equals(helperName)) {
                continue;
            }
            // Prefer public / package-visible API methods over other private helpers.
            if (!Pattern.compile("\\bprivate\\b").matcher(callerSig).find()) {
                callers.add(callerName);
            }
        }
        return List.copyOf(callers);
    }

    /**
     * Derives the module/class names by which the file containing the finding could be imported.
     * Used to rank cross-file callers: files whose import statements reference these names are
     * visited before files with no such import.
     */
    private List<String> deriveModuleNames(String filename) {
        if (filename == null) return List.of();
        String normalized = filename.replace('\\', '/');
        Path p = Path.of(normalized);
        String name = p.getFileName().toString();
        int dot = name.lastIndexOf('.');
        String baseName = dot > 0 ? name.substring(0, dot) : name;

        List<String> names = new ArrayList<>();
        names.add(baseName);

        Path parent = p.getParent();
        if (parent != null && !parent.toString().isEmpty()) {
            String dirPart = parent.toString().replace('\\', '/').replace('/', '.');
            names.add(dirPart + "." + baseName);
            String[] parts = dirPart.split("\\.");
            if (parts.length > 0) {
                names.add(parts[parts.length - 1] + "." + baseName);
            }
        }

        return List.copyOf(names);
    }

    /**
     * Checks whether the call-site line argument looks like a string literal or named constant.
     * Used to emit the origin-tag comment when all discovered call sites pass safe arguments.
     * Does NOT treat config loaders (e.g. getSqlString) as proven-safe — their input origin is unknown.
     */
    private static final Pattern LITERAL_SQL_ARG_PATTERN = Pattern.compile(
            "[\"']\\s*(?:SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|MERGE|CALL|WITH|EXEC)\\s",
            Pattern.CASE_INSENSITIVE);

    /** SQL/DDL keyword used when detecting locally built dynamic SQL from identifier operands. */
    private static final String LOCAL_SQL_KEYWORD_REGEX =
            "select|insert|update|delete|where|from|create|drop|alter|merge|call|with|exec|truncate|index";

    /**
     * True when every discovered call site looks literal/constant. Suppresses the tag when local
     * SQL/DDL is built from mutable/external operands (instance fields, JSON, resource names) —
     * ctor literals are misleading there. Parameter + literal call sites still emit the tag so
     * SQLi verification can score trusted-source string concat as a mid-confidence risky scheme.
     */
    private boolean shouldEmitLiteralCallsiteOriginTag(List<String> callSiteArgs, String localCode) {
        if (callSiteArgs == null || callSiteArgs.isEmpty()) {
            return false;
        }
        if (!callSiteArgs.stream().allMatch(this::argumentLooksLikeLiteral)) {
            return false;
        }
        return !sqlConcatUsesMutableOrExternalOperands(localCode);
    }

    /** Instance/JSON/HTTP/resource operands in a SQL build — not proven app-constant sources. */
    boolean sqlConcatUsesMutableOrExternalOperands(String code) {
        if (code == null || code.isBlank()) {
            return false;
        }
        String lower = code.toLowerCase(Locale.ROOT);
        // ResultSet/rs.getString is result reading, not a source into the SQL text.
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
                || Pattern.compile("(?is)\\b(?:this|self)\\s*\\.\\s*[A-Za-z_]").matcher(code).find()
                || Pattern.compile("(?is)[\"'][^\"']*\\b(?:" + LOCAL_SQL_KEYWORD_REGEX
                        + ")\\b[^\"']*[\"']\\s*[+.]\\s*(?:field|tableName|table_name|column|columnName|nativeName)\\b")
                .matcher(code).find();
    }

    /**
     * Detects SQL/DDL text built in the finding's method via concatenation/interpolation of
     * identifiers (instance fields, locals, getters) — not a pure literal query argument.
     */
    boolean sqlBuiltLocallyFromIdentifierOperands(String code) {
        if (code == null || code.isBlank()) {
            return false;
        }
        return Pattern.compile(
                "(?is)[\"'][^\"']*\\b(?:" + LOCAL_SQL_KEYWORD_REGEX + ")\\b[^\"']*[\"']\\s*[+.]\\s*\\$?[A-Za-z_$]")
                .matcher(code).find()
                || Pattern.compile(
                "(?is)\\$?[A-Za-z_$][\\w$]*\\s*[+.]\\s*[\"'][^\"']*\\b(?:" + LOCAL_SQL_KEYWORD_REGEX + ")\\b")
                .matcher(code).find()
                || Pattern.compile(
                "(?is)\\.append\\s*\\(\\s*[\"'][^\"']*\\b(?:" + LOCAL_SQL_KEYWORD_REGEX + ")\\b")
                .matcher(code).find()
                || Pattern.compile(
                "(?is)f[\"'][^\"']*\\b(?:" + LOCAL_SQL_KEYWORD_REGEX + ")\\b[^\"']*\\{")
                .matcher(code).find()
                || Pattern.compile(
                "(?is)`[^`]*\\b(?:" + LOCAL_SQL_KEYWORD_REGEX + ")\\b[^`]*\\$\\{")
                .matcher(code).find()
                || Pattern.compile(
                "(?is)\\$\"[^\"]*\\b(?:" + LOCAL_SQL_KEYWORD_REGEX + ")\\b[^\"]*\\{")
                .matcher(code).find();
    }

    private boolean argumentLooksLikeLiteral(String callSiteLine) {
        if (callSiteLine == null) return false;
        if (LITERAL_SQL_ARG_PATTERN.matcher(callSiteLine).find()) return true;
        // Hardcoded HTML markup passed to dialog/template APIs (e.g. openDialog("<div>..."))
        if (LITERAL_HTML_ARG_PATTERN.matcher(callSiteLine).find()) return true;
        // Quoted non-SQL string arg at the call (e.g. new CreateIndexTransform("the_geom"))
        if (Pattern.compile("\\(\\s*[\"'][^\"']+[\"']").matcher(callSiteLine).find()) return true;
        // ALL_CAPS constant (e.g. UPDATE_SQL, INSERT_QUERY)
        if (Pattern.compile("\\b[A-Z][A-Z0-9_]{3,}\\b").matcher(callSiteLine).find()) return true;
        return false;
    }

    /**
     * Determines how much direct evidence is available for the origin of the flagged value.
     * The result drives which context sections are included in the LLM prompt and whether the
     * expensive cross-file caller scan is performed at all.
     */
    private EvidenceCategory determineEvidenceCategory(
            SinkArgumentParser.SinkAnalysis sinkAnalysis,
            String definitionContext,
            String functionBody,
            String codeExtract,
            String localSnippet) {

        if (sinkAnalysis.immediatelySafe()) {
            return EvidenceCategory.PROVEN_SOURCE_TRUSTED;
        }

        if (sinkAnalysis.immediatelyUntrusted()) {
            return EvidenceCategory.PROVEN_SOURCE_UNTRUSTED;
        }

        String combined = (definitionContext == null ? "" : definitionContext)
                + "\n" + (functionBody == null ? "" : functionBody)
                + "\n" + (localSnippet == null ? "" : localSnippet)
                + "\n" + (codeExtract == null ? "" : codeExtract);

        boolean deserSink = DESERIALIZATION_SINK_PATTERN.matcher(combined).find();
        boolean fileBytes = FILE_BYTES_SOURCE_PATTERN.matcher(combined).find();
        boolean storeRead = STORE_CACHE_READ_PATTERN.matcher(combined).find();
        boolean envOrConfigPath = TRUSTED_SOURCE_PATTERN.matcher(combined).find();

        // Deserialization of file bytes OR cache/store bytes: handle/path origin ≠ content trust.
        // Keep AMBIGUOUS so ReAct traces who WRITES (file dump / cache.set), without inventing a file
        // when the channel is only backend/cache.get.
        if (deserSink && (fileBytes || storeRead)) {
            return EvidenceCategory.AMBIGUOUS;
        }

        // Django mark_safe + safe renderer in the same function — the renderer provides escaping.
        // Checked BEFORE untrusted-source patterns so that render_to_string/format_html/JSONRenderer
        // paired with mark_safe is classified as NEUTRALIZED, even via an intermediate variable.
        boolean hasMarkSafe = SAFE_SINK_PATTERN.matcher(combined).find();
        if (hasMarkSafe && DJANGO_SAFE_RENDERER_PATTERN.matcher(combined).find()) {
            return EvidenceCategory.NEUTRALIZED;
        }
        if (hasMarkSafe && DJANGO_JSON_RENDERER_PATTERN.matcher(combined).find()) {
            return EvidenceCategory.NEUTRALIZED;
        }

        if (HTTP_SOURCE_PATTERN.matcher(combined).find()) {
            return EvidenceCategory.PROVEN_SOURCE_UNTRUSTED;
        }

        // Django mark_safe wrapping model instance data — database content is untrusted
        // (only when NOT wrapped by a safe renderer, which is checked above)
        if (DJANGO_MARK_SAFE_INSTANCE_PATTERN.matcher(combined).find()
                || (DJANGO_MODEL_FIELD_ACCESS_PATTERN.matcher(combined).find()
                    && SAFE_SINK_PATTERN.matcher(combined).find())) {
            return EvidenceCategory.PROVEN_SOURCE_UNTRUSTED;
        }

        // Django serializer.data in raw mark_safe context (no renderer wrapping)
        if (DJANGO_SERIALIZER_DATA_PATTERN.matcher(combined).find()
                && SAFE_SINK_PATTERN.matcher(combined).find()) {
            return EvidenceCategory.PROVEN_SOURCE_UNTRUSTED;
        }

        if (DOM_SOURCE_PATTERN.matcher(combined).find()
                || sameLineDomRoundTrip(codeExtract, sinkAnalysis.primaryCandidate())) {
            boolean xssSinkWrite = codeExtract != null && XSS_SINK_WRITE_PATTERN.matcher(codeExtract).find();
            if (!xssSinkWrite) {
                return EvidenceCategory.PROVEN_SOURCE_DOM;
            }
            // Same-line self-DOM round-trip: el.innerHTML = f(el.innerHTML)
            if (sameLineDomRoundTrip(codeExtract, sinkAnalysis.primaryCandidate())) {
                return EvidenceCategory.PROVEN_SOURCE_DOM;
            }
            // XSS sink write: incidental DOM APIs in a large local snippet (getElementsByTagName after
            // creating a dialog, etc.) are NOT provenance of the HTML payload. Only treat as DOM
            // source when definition context assigns the sink candidate from a DOM read.
            if (definitionShowsDomReadOfCandidate(definitionContext, sinkAnalysis.primaryCandidate())) {
                return EvidenceCategory.PROVEN_SOURCE_DOM;
            }
        }

        if (NEUTRALIZER_PATTERN.matcher(combined).find()) {
            return EvidenceCategory.NEUTRALIZED;
        }

        // Deserialization / command sinks with only settings/env visible: do not early-exit as
        // PROVEN_SOURCE_TRUSTED — settings.X is an indirection; ReAct must chase the value origin.
        boolean commandSink = looksLikeCommandSink(combined.toLowerCase(Locale.ROOT));
        if ((deserSink || commandSink) && envOrConfigPath) {
            return EvidenceCategory.AMBIGUOUS;
        }

        if (envOrConfigPath) {
            return EvidenceCategory.PROVEN_SOURCE_TRUSTED;
        }

        if (definitionContext != null && !definitionContext.isBlank()) {
            return EvidenceCategory.AMBIGUOUS;
        }

        return EvidenceCategory.DEAD_END;
    }

    /**
     * True when the flagged extract writes a DOM HTML/text property and the primary
     * taint candidate is that same property read on the RHS (self-referential round-trip),
     * e.g. {@code document.body.innerHTML = translate(document.body.innerHTML)}.
     */
    private boolean sameLineDomRoundTrip(String codeExtract, String candidate) {
        if (codeExtract == null || codeExtract.isBlank()
                || candidate == null || candidate.isBlank()) {
            return false;
        }
        if (!candidate.matches("(?i)^(?:[$@]?[A-Za-z_][A-Za-z0-9_]*\\.)+(?:innerHTML|outerHTML|textContent|innerText)$")) {
            return false;
        }
        if (!XSS_SINK_WRITE_PATTERN.matcher(codeExtract).find()) {
            return false;
        }
        Pattern roundTrip = Pattern.compile(
                Pattern.quote(candidate) + "\\s*=\\s*.*" + Pattern.quote(candidate),
                Pattern.CASE_INSENSITIVE | Pattern.DOTALL);
        return roundTrip.matcher(codeExtract).find();
    }

    /**
     * True when {@code definitionContext} assigns {@code candidate} from a DOM read
     * (e.g. {@code html = el.innerHTML} / {@code x = document.querySelector(...)}).
     */
    private boolean definitionShowsDomReadOfCandidate(String definitionContext, String candidate) {
        if (definitionContext == null || definitionContext.isBlank()
                || candidate == null || candidate.isBlank()) {
            return false;
        }
        String simple = candidate.contains(".")
                ? candidate.substring(candidate.lastIndexOf('.') + 1)
                : candidate;
        if (simple.isBlank() || IGNORED_IDENTIFIERS.contains(simple.toLowerCase(Locale.ROOT))) {
            return false;
        }
        Pattern assignFromDom = Pattern.compile(
                "\\b" + Pattern.quote(simple) + "\\s*=\\s*[^\\n;]*"
                        + "(?:querySelector(?:All)?\\s*\\(|getElementById\\s*\\("
                        + "|getElementsBy(?:Class|Tag)Name\\s*\\("
                        + "|\\.textContent\\b(?!\\s*=)|\\.innerText\\b(?!\\s*=)"
                        + "|\\.innerHTML\\b(?!\\s*=)|\\.outerHTML\\b(?!\\s*=)"
                        + "|\\.dataset\\b|\\.getAttribute\\s*\\()",
                Pattern.CASE_INSENSITIVE);
        return assignFromDom.matcher(definitionContext).find();
    }

    /**
     * Generates pre-computed search suggestions for the ReAct loop. Only produced for
     * AMBIGUOUS and DEAD_END categories, where the origin of the flagged value is not yet clear
     * from local evidence. Providing concrete, targeted queries prevents the model from
     * spending tool budget on irrelevant exploration before finding the real source.
     */
    private List<String> generateReactSuggestions(EvidenceCategory category,
                                                   SinkArgumentParser.SinkAnalysis sinkAnalysis,
                                                   Item item, String language,
                                                   List<String> lines) {
        String ext = languageGlob(language);
        List<String> suggestions = new ArrayList<>();
        String sameFileGlob = exactFileGlob(item, ext);

        // Missing DB/service authentication: always suggest credential value tracing (language-agnostic).
        if (isMissingDatabaseAuthenticationFinding(item)) {
            int targetLine = Math.max(1, item.getLineNumber());
            if (sameFileGlob != null) {
                suggestions.add(String.format(
                        "Local-first: read_file path=\"%s\" start_line=%d end_line=%d",
                        normalizedFindingPath(item), Math.max(1, targetLine - 80), targetLine + 40));
            }
            suggestions.add(String.format(
                    "Credential assignments: search_repo pattern=\"\\b(password|passwd|pwd|user|username|token|secret|credentials?)\\s*[:=]\" path_glob=\"%s\"",
                    sameFileGlob != null ? sameFileGlob : ext));
            suggestions.add(String.format(
                    "Empty credential values: search_repo pattern=\"\\b(password|passwd|pwd|token|secret)\\b\\s*[:=]\\s*(null|None|undefined|nil|\\\"\\\"|'')\" path_glob=\"%s\"",
                    sameFileGlob != null ? sameFileGlob : ext));
            suggestions.add(
                    "Auth channel on connect: determine whether the DB/service connect call passes user/password, "
                            + "auth options, URL userinfo, token, IAM, or client cert — argument count alone is not enough.");
            return List.copyOf(suggestions);
        }

        if (category == EvidenceCategory.PROVEN_SOURCE_UNTRUSTED
                || category == EvidenceCategory.PROVEN_SOURCE_TRUSTED
                || category == EvidenceCategory.PROVEN_SOURCE_DOM
                || category == EvidenceCategory.NEUTRALIZED) {
            return List.of();
        }

        // Local-first strategy: inspect immediate context in current file before repo-wide search.
        int targetLine = Math.max(1, item.getLineNumber());
        int startLine = Math.max(1, targetLine - 70);
        int endLine = targetLine + 70;
        if (sameFileGlob != null) {
            suggestions.add(String.format(
                    "Local-first: read_file path=\"%s\" start_line=%d end_line=%d",
                    normalizedFindingPath(item), startLine, endLine));
        }

        if (sinkAnalysis.primaryCandidate() != null) {
            String var = sinkAnalysis.primaryCandidate();
            suggestions.add(String.format(
                    "To find where '%s' is assigned: search_repo pattern=\"%s\\s*=\" path_glob=\"%s\"",
                    var, var, sameFileGlob != null ? sameFileGlob : ext));
            appendFrameworkAwareSuggestions(suggestions, var, ext, language);
        }

        // Deserialization: chase path -> open/read -> payload even when only env/config path is local
        String extract = item.getCodeExtract() == null ? "" : item.getCodeExtract();
        int deserFrom = Math.max(0, targetLine - 30);
        int deserTo = Math.min(lines.size(), targetLine + 5);
        String nearby = deserFrom < deserTo ? String.join("\n", lines.subList(deserFrom, deserTo)) : "";
        if (DESERIALIZATION_SINK_PATTERN.matcher(extract).find()
                || DESERIALIZATION_SINK_PATTERN.matcher(nearby).find()) {
            boolean nearbyStore = STORE_CACHE_READ_PATTERN.matcher(nearby).find()
                    || STORE_CACHE_READ_PATTERN.matcher(extract).find()
                    || STORE_GET_ASSIGNMENT.matcher(nearby).find();
            boolean nearbyFile = FILE_BYTES_SOURCE_PATTERN.matcher(nearby).find()
                    || FILE_BYTES_SOURCE_PATTERN.matcher(extract).find();
            if (nearbyStore) {
                suggestions.add(String.format(
                        "Observed store/cache get: search writers with "
                                + "search_repo pattern=\"\\w*(?:backend|cache|redis|store)\\w*\\s*\\.\\s*set\\s*\\(\" "
                                + "path_glob=\"%s\"",
                        sameFileGlob != null ? sameFileGlob : ext));
                suggestions.add(String.format(
                        "Same-file pickle round-trip writer: search_repo pattern=\"\\bpickle\\.dumps?\\s*\\(\" "
                                + "path_glob=\"%s\"",
                        sameFileGlob != null ? sameFileGlob : ext));
                suggestions.add(
                        "CWE-502: base verdict only on code facts. Store/cache get ≠ file. "
                                + "TP only with proven attacker-influenced bytes; UNCERTAIN if writer not shown.");
            } else if (nearbyFile) {
                suggestions.add(String.format(
                        "Observed file/stream read: search_repo pattern=\"\\b(open|read_bytes|readAllBytes|"
                                + "file_get_contents)\\s*\\(\" path_glob=\"%s\"",
                        sameFileGlob != null ? sameFileGlob : ext));
                suggestions.add(String.format(
                        "Who WRITES that file: search_repo pattern=\"\\b(pickle\\.dump|joblib\\.dump|"
                                + "marshal\\.dump|yaml\\.dump|\\.write\\s*\\(|save\\s*\\(\" path_glob=\"%s\"",
                        ext));
                suggestions.add(String.format(
                        "Path origin: search_repo pattern=\"\\b(os\\.environ|os\\.getenv|"
                                + "getenv|environ\\.get|MODEL_FILE|settings\\.)\" path_glob=\"%s\"",
                        sameFileGlob != null ? sameFileGlob : ext));
                suggestions.add(
                        "CWE-502: TP only if shown file bytes are attacker-influenced; FP if app/operator-only "
                                + "artifact is proven; UNCERTAIN if writer trust is not in code.");
            } else {
                suggestions.add(String.format(
                        "Find payload assignment/read near sink: search_repo pattern=\"\\b(open|read_bytes|"
                                + "\\.get\\s*\\(|pickle\\.loads?)\" path_glob=\"%s\"",
                        sameFileGlob != null ? sameFileGlob : ext));
                suggestions.add(
                        "CWE-502: do not invent file/upload/store origin; only cite reads/writes found in code.");
            }
        }

        appendClassicTaintOriginSuggestions(suggestions, extract, nearby, sameFileGlob, ext,
                sinkAnalysis.primaryCandidate(), language);
        appendTrustBoundarySuggestions(suggestions, extract, nearby, sameFileGlob, ext,
                sinkAnalysis.primaryCandidate());

        if ("php".equals(language) && APIPLATFORM_FILTER_PATTERN.matcher(String.join("\n", lines)).find()) {
            suggestions.add(String.format(
                    "ApiPlatform filter source candidate: search_repo pattern=\"filterProperty\\s*\\(\" path_glob=\"%s\"",
                    sameFileGlob != null ? sameFileGlob : "*.php"));
            suggestions.add(
                    "ApiPlatform request linkage: search_repo pattern=\"request\\.query|filters\\[|\\$_GET|QueryParameter\" path_glob=\"*.php\"");
            suggestions.add(
                    "ApiPlatform value parameter trace: search_repo pattern=\"\\$value\\b\" path_glob=\"*.php\"");
        }

        if (category == EvidenceCategory.DEAD_END || category == EvidenceCategory.AMBIGUOUS) {
            int targetIdx = Math.min(Math.max(0, item.getLineNumber() - 1), lines.size() - 1);
            int funcStart = findFunctionStart(lines, targetIdx, language);
            if (funcStart >= 0) {
                String funcName = extractFunctionName(lines.get(funcStart));
                String filename = item.getFullFilename() != null ? item.getFullFilename() : item.getFilename();
                List<String> symbols = resolveCallerSearchSymbols(lines, funcStart, funcName, filename, language);
                for (String symbol : symbols) {
                    if (symbol == null || symbol.length() < 3) {
                        continue;
                    }
                    suggestions.add(String.format(
                            "Callers/API uses of '%s': search_repo pattern=\"%s\\(\" path_glob=\"%s\"",
                            symbol, symbol, sameFileGlob != null ? sameFileGlob : ext));
                    suggestions.add(String.format(
                            "Repository callers/constructors of '%s': search_repo pattern=\"(?:new\\s+)?%s\\(\" path_glob=\"%s\"",
                            symbol, symbol, ext));
                }
            }
        }

        if (isLoggerLeakFinding(item) && isJavaScriptLike(language)) {
            suggestions.add(String.format(
                    "Logger leak local scan: search_repo pattern=\"console\\.(log|error|warn|info)\\s*\\(\" path_glob=\"%s\"",
                    sameFileGlob != null ? sameFileGlob : "*.js"));
            String candidate = sinkAnalysis.primaryCandidate();
            if (candidate != null && !candidate.isBlank()) {
                suggestions.add(String.format(
                        "Logger variable origin: search_repo pattern=\"\\b%s\\s*=\" path_glob=\"%s\"",
                        candidate, sameFileGlob != null ? sameFileGlob : "*.js"));
                suggestions.add(String.format(
                        "Catch variable flow: search_repo pattern=\"catch\\s*\\(\\s*%s\\s*\\)\" path_glob=\"%s\"",
                        candidate, sameFileGlob != null ? sameFileGlob : "*.js"));
            } else {
                suggestions.add(String.format(
                        "Catch variable flow: search_repo pattern=\"catch\\s*\\((\\w+)\\)\" path_glob=\"%s\"",
                        sameFileGlob != null ? sameFileGlob : "*.js"));
            }
        }

        return List.copyOf(suggestions);
    }

    private void appendFrameworkAwareSuggestions(List<String> suggestions, String var, String ext, String language) {
        if (var == null || var.isBlank()) {
            return;
        }
        if (!"javascript".equals(language) && !"typescript".equals(language)) {
            return;
        }
        if (var.endsWith("Value") && var.length() > "Value".length()) {
            String base = var.substring(0, var.length() - "Value".length());
            String baseKebab = toKebabCase(base);
            suggestions.add(String.format(
                    "Stimulus fallback: search_repo pattern=\"static\\s+values\\s*=\\s*\\{\" path_glob=\"%s\"",
                    ext));
            suggestions.add(String.format(
                    "Stimulus fallback: search_repo pattern=\"\\b%s\\s*:\" path_glob=\"%s\"",
                    Pattern.quote(base), ext));
            suggestions.add(String.format(
                    "Stimulus fallback: search_repo pattern=\"data-.*%s.*-value\" path_glob=\"*.twig\"",
                    base.toLowerCase(Locale.ROOT)));
            suggestions.add(String.format(
                    "Stimulus fallback: search_repo pattern=\"data-.*%s.*-value\" path_glob=\"*.html\"",
                    base.toLowerCase(Locale.ROOT)));
            suggestions.add(String.format(
                    "Stimulus fallback: search_repo pattern=\"data-[a-z0-9_-]+-%s-value\" path_glob=\"*.twig\"",
                    baseKebab));
            suggestions.add(String.format(
                    "Stimulus fallback: search_repo pattern=\"data-[a-z0-9_-]+-%s-value\" path_glob=\"*.html\"",
                    baseKebab));
            suggestions.add(String.format(
                    "Stimulus fallback: search_repo pattern=\"data-.*%s.*-value\" path_glob=\"*\"",
                    base.toLowerCase(Locale.ROOT)));
            return;
        }
        if (var.endsWith("Target") && var.length() > "Target".length()) {
            String base = var.substring(0, var.length() - "Target".length());
            suggestions.add(String.format(
                    "Stimulus fallback: search_repo pattern=\"static\\s+targets\\s*=\\s*\\[\" path_glob=\"%s\"",
                    ext));
            suggestions.add(String.format(
                    "Stimulus fallback: search_repo pattern=\"\\b%s\\b\" path_glob=\"%s\"",
                    Pattern.quote(base), ext));
            suggestions.add(String.format(
                    "Stimulus fallback: search_repo pattern=\"data-.*target\" path_glob=\"*\""));
        }
    }

    /** Maps a language name to a glob pattern for file-scoped ReAct search suggestions. */
    private String languageGlob(String language) {
        return switch (language == null ? "" : language) {
            case "python" -> "*.py";
            case "java" -> "*.java";
            case "javascript" -> "*.js";
            case "typescript" -> "*.ts";
            case "ruby" -> "*.rb";
            case "go" -> "*.go";
            case "php" -> "*.php";
            case "csharp" -> "*.cs";
            case "rust" -> "*.rs";
            case "kotlin" -> "*.kt";
            default -> "*";
        };
    }

    private boolean isJavaScriptLike(String language) {
        return "javascript".equals(language) || "typescript".equals(language);
    }

    private boolean isMissingDatabaseAuthenticationFinding(Item item) {
        String combined = ((item.getId() != null ? item.getId() : "")
                + " " + (item.getTitle() != null ? item.getTitle() : "")).toLowerCase(Locale.ROOT);
        if (combined.contains("missing_database_authentication")
                || combined.contains("missing authentication for database")
                || combined.contains("missing database authentication")) {
            return true;
        }
        List<String> cwes = item.getCweIds();
        return cwes != null && cwes.stream().anyMatch(cwe ->
                "306".equals(cwe) || "CWE-306".equalsIgnoreCase(cwe));
    }

    private boolean isLoggerLeakFinding(Item item) {
        String id = Optional.ofNullable(item.getId()).orElse("").toLowerCase(Locale.ROOT);
        String title = Optional.ofNullable(item.getTitle()).orElse("").toLowerCase(Locale.ROOT);
        return id.contains("logger") || title.contains("logger")
                || title.contains("log message") || title.contains("information in logger");
    }

    private String toKebabCase(String input) {
        if (input == null || input.isBlank()) {
            return "";
        }
        return input.replaceAll("([a-z0-9])([A-Z])", "$1-$2").toLowerCase(Locale.ROOT);
    }

    private String normalizedFindingPath(Item item) {
        String raw = Optional.ofNullable(item.getFullFilename())
                .orElse(Optional.ofNullable(item.getFilename()).orElse(""));
        return raw.replace('\\', '/');
    }

    private String exactFileGlob(Item item, String fallbackGlob) {
        String normalized = normalizedFindingPath(item);
        if (normalized.isBlank()) {
            return fallbackGlob;
        }
        int slash = normalized.lastIndexOf('/');
        return slash >= 0 ? normalized.substring(slash + 1) : normalized;
    }

    /**
     * Matches call sites including dotted/receiver forms: {@code foo(}, {@code this.foo(},
     * {@code obj.foo(}, {@code Class.foo(}.
     */
    private Pattern callSitePattern(String funcName) {
        return Pattern.compile("(?:^|[^\\w$])(?:[\\w$]+\\.)*" + Pattern.quote(funcName) + "\\s*\\(");
    }

    private boolean looksLikeDefinitionOf(String line, String funcName) {
        String quoted = Pattern.quote(funcName);
        return Pattern.compile("(?:def|function|async\\s+def|fn|func)\\s+" + quoted + "\\b").matcher(line).find()
                || Pattern.compile("(?:const|let|var)\\s+" + quoted + "\\s*=").matcher(line).find()
                // CodeMirror.defineExtension("openDialog", function...)
                || Pattern.compile("\\.define(?:Doc)?Extension\\s*\\(\\s*[\"']" + quoted + "[\"']")
                        .matcher(line).find()
                // Java/C#/Go-style method signatures: modifiers/return type before the name
                || Pattern.compile(
                        "(?:public|private|protected|static|final|native|synchronized|abstract|default|"
                                + "override|async|export|internal|fun)\\b[^{;=]*\\b" + quoted + "\\s*\\(")
                        .matcher(line).find()
                || Pattern.compile(
                        "^\\s*(?:[\\w.<>,\\[\\]?|\\s]+\\s+)" + quoted + "\\s*\\([^;]*\\)\\s*(?:throws\\b|\\{|:)")
                        .matcher(line).find();
    }

    /**
     * Extracts short, evidence-oriented hints for framework conventions and common neutralizers. These
     * lines are not verdicts; they tell the LLM what contract it should apply when deciding whether a
     * parameter is likely request-controlled, persisted user data, sanitized, or internal.
     */
    private String extractFrameworkContext(String filename, List<String> lines, Item item,
                                           String functionBody, String localSnippet) {
        String language = detectLanguage(filename);
        String combined = String.join("\n",
                Optional.ofNullable(functionBody).orElse(""),
                Optional.ofNullable(localSnippet).orElse(""));
        String lowerPath = filename == null ? "" : filename.replace('\\', '/').toLowerCase(Locale.ROOT);

        List<String> hints = new ArrayList<>();
        addFrameworkHint(hints, lowerPath.contains("wagtail/") || lowerPath.contains("django/") || combined.contains("django."),
                "Django/Wagtail context: request.GET/POST/FILES, form data, upload filenames, and model fields may be user-controlled unless code shows an admin-only/internal contract.");
        addFrameworkHint(hints, HTTP_SOURCE_PATTERN.matcher(combined).find(),
                "HTTP/browser source evidence nearby: treat request data, AJAX/fetch responses, message events, FormData, and file inputs as untrusted when they flow into the sink.");
        addFrameworkHint(hints, HTTP_RESPONSE_PATTERN.matcher(combined).find(),
                "HTTP response evidence nearby: values from JSON/API responses are NOT automatically trusted. They can contain reflected or stored user-controlled content.");
        addFrameworkHint(hints, PERSISTED_DATA_PATTERN.matcher(combined).find(),
                "Persisted-data evidence nearby: database/model fields can contain user-submitted content; decide trust based on who can write the field, not on the fact that it came from the database.");
        addFrameworkHint(hints, ENTITY_USER_CONTENT_PATTERN.matcher(combined).find(),
                "Entity/model getter evidence nearby: fields like name/description/comment/title/content are often user-editable persisted data. Treat them as potentially untrusted for XSS unless escaped or sanitized.");
        addFrameworkHint(hints, UPLOAD_FILENAME_PATTERN.matcher(combined).find(),
                "Upload/path evidence nearby: framework-provided upload filenames should be considered untrusted until normalized with a safe filename/path API.");
        addFrameworkHint(hints, NEUTRALIZER_PATTERN.matcher(combined).find(),
                "Neutralizer evidence nearby: if the value is passed through a complete framework-native sanitizer/encoder/allowlist before the sink, prefer FALSE_POSITIVE over UNCERTAIN.");
        addFrameworkHint(hints, ("javascript".equals(language) || "typescript".equals(language))
                        && STIMULUS_CONTROLLER_PATTERN.matcher(combined).find()
                        && STIMULUS_STATIC_VALUES_PATTERN.matcher(combined).find(),
                "Stimulus convention evidence: `static values` typically generates runtime accessors like `this.fooValue`; if `fooValue` has no direct assignment, trace `foo` in `static values` and data attributes.");
        addFrameworkHint(hints, ("javascript".equals(language) || "typescript".equals(language))
                        && STIMULUS_CONTROLLER_PATTERN.matcher(combined).find()
                        && STIMULUS_STATIC_VALUES_PATTERN.matcher(combined).find(),
                "Stimulus source contract: if `this.fooValue` is used and `foo` exists in `static values`, treat `fooValue` as framework-populated from template `data-*-foo-value` unless code shows reassignment.");
        addFrameworkHint(hints, ("javascript".equals(language) || "typescript".equals(language))
                        && STIMULUS_CONTROLLER_PATTERN.matcher(combined).find()
                        && STIMULUS_STATIC_TARGETS_PATTERN.matcher(combined).find(),
                "Stimulus convention evidence: `static targets` typically generates `this.fooTarget`; prefer tracing declared targets over looking for direct `fooTarget =` assignments.");
        addFrameworkHint(hints, "php".equals(language) && APIPLATFORM_FILTER_PATTERN.matcher(combined).find(),
                "ApiPlatform/Symfony filter convention evidence: callback parameters (for example in `filterProperty`) are framework-populated request filter candidates; treat `$value` as request-derived candidate unless code proves internal-only origin.");
        addFrameworkHint(hints, "php".equals(language) && DOCTRINE_SET_PARAMETER_PATTERN.matcher(combined).find(),
                "Doctrine convention evidence: `setParameter(...)` indicates bound SQL values; verify whether dynamic field names are allowlisted before calling it exploitable.");
        addFrameworkHint(hints, ("javascript".equals(language) || "typescript".equals(language))
                        && isLoggerLeakFinding(item)
                        && CATCH_LOGGER_PATTERN.matcher(combined).find(),
                "Logger catch-path calibration: `catch(err)` values often come from runtime/library exceptions; do not assume attacker control unless request/response payload flow to `err` is shown.");
        addFrameworkHint(hints, ("javascript".equals(language) || "typescript".equals(language))
                        && SYMFONY_PROTOTYPE_PATTERN.matcher(combined).find(),
                "Symfony Collection Prototype evidence: HTML inserted via `data-prototype` or "
                        + "`dataset.prototype` is server-rendered by Twig with auto-escaping enabled. "
                        + "The inserted content is NOT attacker-controlled — it is a framework-generated "
                        + "form template. For XSS findings where the sink receives prototype content, "
                        + "prefer FALSE_POSITIVE. For dynamic regex using prototype-derived values, "
                        + "prefer FALSE_POSITIVE unless URL/user-input flows into the regex.");
        addFrameworkHint(hints, "php".equals(language)
                        && SYMFONY_FILTER_TYPE_PATTERN.matcher(combined).find(),
                "Symfony FilterType evidence: this form type is a read-only filter/search form using GET "
                        + "parameters. CSRF protection is not required for idempotent GET requests.");

        // Django mark_safe SAFE patterns — must come before unsafe patterns
        boolean hasSafeRenderer = "python".equals(language)
                && SAFE_SINK_PATTERN.matcher(combined).find()
                && DJANGO_SAFE_RENDERER_PATTERN.matcher(combined).find();
        boolean hasJsonRenderer = "python".equals(language)
                && SAFE_SINK_PATTERN.matcher(combined).find()
                && DJANGO_JSON_RENDERER_PATTERN.matcher(combined).find();
        addFrameworkHint(hints, hasSafeRenderer,
                "Django mark_safe + safe renderer: when `render_to_string`, `format_html`, `escape`, "
                        + "or `flatatt` appears in the same function as `mark_safe`, the renderer provides "
                        + "the escaping — even if assigned to an intermediate variable first. "
                        + "Django's `render_to_string` uses template auto-escaping (enabled by default), "
                        + "and `format_html` HTML-escapes all interpolated arguments. "
                        + "The `mark_safe` call only prevents double-escaping of already-safe output. "
                        + "This pattern is FALSE_POSITIVE for XSS unless you find evidence that the "
                        + "template disables auto-escaping (`{% autoescape off %}` or `|safe` filter). "
                        + "Do NOT mark TRUE_POSITIVE just because context variables come from the database — "
                        + "auto-escaping handles that.");
        addFrameworkHint(hints, hasJsonRenderer,
                "Django mark_safe + JSONRenderer: `JSONRenderer().render(serializer.data, ...)` in the "
                        + "same function as `mark_safe` outputs JSON-encoded data. JSONRenderer serializes "
                        + "Python objects to valid JSON, which inherently escapes characters within string values. "
                        + "This pattern is used in templatetags to embed data in `<script>` blocks. "
                        + "JSON encoding is a valid neutralizer for XSS when used in a JavaScript context. "
                        + "Prefer FALSE_POSITIVE unless you find evidence that the JSON output is inserted "
                        + "directly into an HTML body context (not inside `<script>` tags).");

        // Django mark_safe UNSAFE patterns (only when no safe renderer is present)
        addFrameworkHint(hints, "python".equals(language)
                        && DJANGO_MARK_SAFE_INSTANCE_PATTERN.matcher(combined).find()
                        && !hasSafeRenderer,
                "Django mark_safe + instance convention: `instance` / `self.instance` / `self.object` "
                        + "in Django forms, views, and CMS plugins refers to a database model object. "
                        + "Model fields (CharField, TextField, RichTextField, JSONField) store user-submitted "
                        + "content — classify input_source as `database`. The data is potentially untrusted "
                        + "because any user with write access to that model can inject arbitrary content.");
        addFrameworkHint(hints, "python".equals(language)
                        && DJANGO_MARK_SAFE_RENDER_PATTERN.matcher(combined).find()
                        && !hasSafeRenderer,
                "Django mark_safe + render/template.render convention: `mark_safe` wraps "
                        + "template-rendered output. If the template uses `|safe` filter or receives "
                        + "pre-rendered HTML, it can contain user-controlled content.");
        addFrameworkHint(hints, "python".equals(language)
                        && (lowerPath.contains("templatetags/") || DJANGO_TEMPLATETAG_PATTERN.matcher(combined).find()),
                "Django template tag convention: code in `templatetags/` is invoked by Django's template "
                        + "engine. Template tag parameters typically come from template context, which is "
                        + "populated by views. Trace the context variable (e.g. serializer.data, cart, object) "
                        + "to its source — if it comes from a serializer or model queryset, classify as `database`. "
                        + "If it comes from request.GET/POST, classify as `http_request`.");
        addFrameworkHint(hints, "python".equals(language)
                        && DJANGO_CASCADE_PLUGIN_PATTERN.matcher(combined).find(),
                "Django CMS Cascade plugin convention: `glossary` is a JSONField on the plugin model that "
                        + "stores CMS editor content. This data is entered by CMS editors (potentially trusted "
                        + "staff users) but stored in the database — classify input_source as `database`. "
                        + "If the CMS allows untrusted editors, the content is untrusted.");
        addFrameworkHint(hints, "python".equals(language)
                        && DJANGO_SERIALIZER_DATA_PATTERN.matcher(combined).find()
                        && !hasJsonRenderer,
                "Django REST Framework serializer.data convention: `serializer.data` contains serialized "
                        + "model data. The underlying data comes from database model fields which may store "
                        + "user-submitted content — classify input_source as `database`.");

        collectMatchingLines("HTTP/event/file input lines", HTTP_SOURCE_PATTERN, lines, hints);
        collectMatchingLines("Persisted/model lines", PERSISTED_DATA_PATTERN, lines, hints);
        collectMatchingLines("Neutralizer/guard lines", NEUTRALIZER_PATTERN, lines, hints);
        if ("javascript".equals(language) || "typescript".equals(language)) {
            collectMatchingLines("Stimulus values/targets lines", Pattern.compile("static\\s+(values|targets)\\s*=", Pattern.CASE_INSENSITIVE), lines, hints);
        }
        if ("php".equals(language)) {
            collectMatchingLines("ApiPlatform/Symfony filter lines", APIPLATFORM_FILTER_PATTERN, lines, hints);
            collectMatchingLines("Doctrine setParameter lines", DOCTRINE_SET_PARAMETER_PATTERN, lines, hints);
        }

        if (hints.isEmpty()) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        for (String hint : hints) {
            sb.append("- ").append(hint).append('\n');
        }
        return sb.toString().trim();
    }

    private void addFrameworkHint(List<String> hints, boolean condition, String hint) {
        if (condition && hints.size() < MAX_FRAMEWORK_HINTS) {
            hints.add(hint);
        }
    }

    private void collectMatchingLines(String label, Pattern pattern, List<String> lines, List<String> hints) {
        int found = 0;
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < lines.size() && found < 4; i++) {
            String line = lines.get(i);
            if (pattern.matcher(line).find()) {
                sb.append(i + 1).append("| ").append(line.trim()).append('\n');
                found++;
            }
        }
        if (found > 0 && hints.size() < MAX_FRAMEWORK_HINTS) {
            hints.add(label + ":\n" + sb.toString().trim());
        }
    }

    private int findFunctionStart(List<String> lines, int targetIdx, String language) {
        Pattern pattern = "python".equals(language) ? PYTHON_FUNC_PATTERN : BRACE_FUNC_PATTERN;
        for (int i = targetIdx; i >= 0; i--) {
            String line = lines.get(i);
            // CodeMirror-style: CodeMirror.defineExtension("openDialog", function(...) {
            if (!"python".equals(language) && JS_EXTENSION_FUNC_PATTERN.matcher(line).find()) {
                return i;
            }
            if (pattern.matcher(line).find()) {
                return i;
            }
        }
        return -1;
    }

    private String extractFunctionName(String signatureLine) {
        if (signatureLine == null) {
            return null;
        }
        var extension = JS_EXTENSION_FUNC_PATTERN.matcher(signatureLine);
        if (extension.find()) {
            return extension.group(1);
        }
        var keyword = FUNC_NAME_KEYWORD.matcher(signatureLine);
        if (keyword.find()) {
            return keyword.group(1);
        }
        var assign = FUNC_NAME_ASSIGN.matcher(signatureLine);
        if (assign.find()) {
            return assign.group(1);
        }
        var beforeParen = FUNC_NAME_BEFORE_PAREN.matcher(signatureLine);
        if (beforeParen.find()) {
            String name = beforeParen.group(1);
            if (!IGNORED_IDENTIFIERS.contains(name.toLowerCase(Locale.ROOT))) {
                return name;
            }
        }
        return null;
    }

    private void appendWindow(StringBuilder sb, List<String> lines, int centerIdx) {
        int half = CALLER_WINDOW_LINES / 2;
        int start = Math.max(0, centerIdx - half);
        int end = Math.min(lines.size() - 1, centerIdx + half);
        for (int i = start; i <= end; i++) {
            sb.append(i + 1).append("| ").append(lines.get(i)).append('\n');
        }
    }

    private boolean isSkipped(Path base, Path file) {
        Path rel = base.relativize(file);
        for (Path part : rel) {
            if (SKIP_DIRS.contains(part.toString())) {
                return true;
            }
        }
        return false;
    }

    private boolean isSource(Path p) {
        String name = p.getFileName().toString();
        int dot = name.lastIndexOf('.');
        if (dot < 0 || dot == name.length() - 1) {
            return false;
        }
        return SOURCE_EXT.contains(name.substring(dot + 1).toLowerCase(Locale.ROOT));
    }

    /**
     * Extracts the first N lines of the file (imports + class/module declaration).
     * Only included when the finding line is far enough from the top that the local snippet
     * would not already cover it — avoids redundant context in the prompt.
     */
    private String extractFileHeader(List<String> lines, int findingLine) {
        int headerEnd = Math.min(lines.size(), FILE_HEADER_LINES);
        if (findingLine <= headerEnd + 10) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < headerEnd; i++) {
            sb.append(i + 1).append("| ").append(lines.get(i)).append('\n');
        }
        return sb.toString().trim();
    }

    private String extractImports(List<String> lines) {
        StringBuilder sb = new StringBuilder();
        boolean foundNonImport = false;
        int blankLineCount = 0;

        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.isEmpty()) {
                blankLineCount++;
                if (foundNonImport || blankLineCount > 2) break;
                continue;
            }

            if (IMPORT_PATTERN.matcher(line).find()) {
                sb.append(line).append('\n');
                blankLineCount = 0;
            } else if (trimmed.startsWith("//") || trimmed.startsWith("#") || trimmed.startsWith("/*") || trimmed.startsWith("*")) {
                continue;
            } else if (trimmed.startsWith("package ")) {
                sb.append(line).append('\n');
            } else {
                foundNonImport = true;
                if (sb.isEmpty()) continue;
                break;
            }
        }
        return sb.toString().trim();
    }

    private String extractFunction(List<String> lines, int targetLine, String language) {
        if (lines.isEmpty() || targetLine < 1) {
            return "";
        }
        int targetIdx = Math.min(targetLine - 1, lines.size() - 1);

        if ("python".equals(language)) {
            return extractPythonFunction(lines, targetIdx);
        } else {
            return extractBraceFunction(lines, targetIdx);
        }
    }

    private String extractPythonFunction(List<String> lines, int targetIdx) {
        int funcStart = -1;
        int funcIndent = -1;

        for (int i = targetIdx; i >= 0; i--) {
            String line = lines.get(i);
            if (PYTHON_FUNC_PATTERN.matcher(line).find()) {
                funcStart = i;
                funcIndent = leadingSpaces(line);
                break;
            }
        }

        if (funcStart < 0) {
            return fallbackContext(lines, targetIdx);
        }

        while (funcStart > 0 && lines.get(funcStart - 1).trim().startsWith("@")) {
            funcStart--;
        }

        int funcEnd = lines.size() - 1;
        for (int i = funcStart + 1; i < lines.size(); i++) {
            String line = lines.get(i);
            if (line.trim().isEmpty()) continue;
            int indent = leadingSpaces(line);
            if (indent <= funcIndent && !line.trim().startsWith("#") && !line.trim().startsWith("@")) {
                funcEnd = i - 1;
                break;
            }
        }

        return buildSnippet(lines, funcStart, funcEnd, targetIdx);
    }

    private String extractBraceFunction(List<String> lines, int targetIdx) {
        int funcStart = -1;

        for (int i = targetIdx; i >= 0; i--) {
            String line = lines.get(i);
            if (BRACE_FUNC_PATTERN.matcher(line).find()) {
                funcStart = i;
                break;
            }
        }

        if (funcStart < 0) {
            return fallbackContext(lines, targetIdx);
        }

        while (funcStart > 0 && lines.get(funcStart - 1).trim().startsWith("@")) {
            funcStart--;
        }

        int braceDepth = 0;
        boolean foundOpen = false;
        int funcEnd = lines.size() - 1;

        for (int i = funcStart; i < lines.size(); i++) {
            String line = lines.get(i);
            for (char c : line.toCharArray()) {
                if (c == '{') {
                    braceDepth++;
                    foundOpen = true;
                } else if (c == '}') {
                    braceDepth--;
                    if (foundOpen && braceDepth == 0) {
                        funcEnd = i;
                        return buildSnippet(lines, funcStart, funcEnd, targetIdx);
                    }
                }
            }
        }

        return buildSnippet(lines, funcStart, funcEnd, targetIdx);
    }

    private String buildSnippet(List<String> lines, int start, int end, int targetIdx) {
        int length = end - start + 1;
        if (length > MAX_FUNCTION_LINES) {
            int half = MAX_FUNCTION_LINES / 2;
            int newStart = Math.max(start, targetIdx - half);
            int newEnd = Math.min(end, targetIdx + half);
            start = newStart;
            end = newEnd;
        }

        StringBuilder sb = new StringBuilder();
        for (int i = start; i <= end && i < lines.size(); i++) {
            sb.append(i + 1).append("| ").append(lines.get(i)).append('\n');
        }
        return sb.toString().trim();
    }

    private String fallbackContext(List<String> lines, int targetIdx) {
        return contextAround(lines, targetIdx, FALLBACK_CONTEXT_LINES * 2 + 1);
    }

    private String contextAround(List<String> lines, int targetIdx, int maxLines) {
        int half = maxLines / 2;
        int start = Math.max(0, targetIdx - half);
        int end = Math.min(lines.size() - 1, targetIdx + half);
        // If start was clamped to 0, redistribute unused lines after the finding
        if (start == 0) {
            end = Math.min(lines.size() - 1, maxLines - 1);
        }
        // If end was clamped to last line, redistribute unused lines before the finding
        if (end == lines.size() - 1) {
            start = Math.max(0, lines.size() - maxLines);
        }
        return buildSnippet(lines, start, end, targetIdx);
    }

    private String readSnippetAround(String repoDir, String filename, int aroundLine, int maxLines) {
        Path filePath = Path.of(repoDir, filename);
        try {
            List<String> lines = Files.readAllLines(filePath, StandardCharsets.UTF_8);
            int half = maxLines / 2;
            int start = Math.max(0, aroundLine - 1 - half);
            int end = Math.min(lines.size() - 1, start + maxLines - 1);

            StringBuilder sb = new StringBuilder();
            for (int i = start; i <= end; i++) {
                sb.append(i + 1).append("| ").append(lines.get(i)).append('\n');
            }
            return sb.toString().trim();
        } catch (IOException e) {
            log.debug("[CodeContextExtractor] Cannot read related file {}: {}", filePath, e.getMessage());
            return "";
        }
    }

    private boolean isImportedBy(String imports, String filename) {
        if (imports == null || imports.isBlank() || filename == null) return false;
        String baseName = Path.of(filename).getFileName().toString();
        int dotIdx = baseName.lastIndexOf('.');
        String moduleName = dotIdx > 0 ? baseName.substring(0, dotIdx) : baseName;
        String pathBased = filename.replace('/', '.').replace('\\', '.');
        if (dotIdx > 0) {
            pathBased = pathBased.substring(0, pathBased.lastIndexOf('.'));
        }
        return imports.contains(moduleName) || imports.contains(pathBased);
    }

    /**
     * When a finding wraps rendered template output in a "safe" HTML sink ({@code mark_safe},
     * {@code innerHTML}, etc.), auto-resolve the template/view file referenced in the same source
     * file and include a capped snippet. Only injects when exactly one unambiguous match is found.
     */
    private String extractTemplateContext(String repoDir, String sourceFile, List<String> lines,
                                          Item item, String functionBody) {
        if (functionBody == null || functionBody.isBlank() || lines.isEmpty()) {
            return "";
        }
        if (!SAFE_SINK_PATTERN.matcher(functionBody).find()) {
            return "";
        }

        String fileText = String.join("\n", lines);
        if (!RENDER_PATTERN.matcher(fileText).find()) {
            return "";
        }

        Set<String> templateRefs = collectTemplateReferences(fileText);
        if (templateRefs.isEmpty()) {
            return "";
        }

        Set<String> resolvedPaths = new LinkedHashSet<>();
        for (String templateRef : templateRefs) {
            resolveTemplateFile(repoDir, sourceFile, templateRef).ifPresent(resolvedPaths::add);
        }
        if (resolvedPaths.size() != 1) {
            if (resolvedPaths.size() > 1) {
                log.debug("[CodeContextExtractor] Ambiguous template resolution for {}: {}", sourceFile, resolvedPaths);
            }
            return "";
        }

        String relPath = resolvedPaths.iterator().next();
        String snippet = readTemplateSnippet(repoDir, relPath);
        if (snippet.isBlank()) {
            return "";
        }

        log.info("[CodeContextExtractor] Auto-resolved template for {}: {}", sourceFile, relPath);
        return relPath + ":\n" + snippet;
    }

    private Set<String> collectTemplateReferences(String fileText) {
        Set<String> refs = new LinkedHashSet<>();
        collectPatternMatches(TEMPLATE_LITERAL_PATTERN, fileText, refs);
        collectPatternMatches(RENDER_TO_STRING_LITERAL, fileText, refs);
        collectPatternMatches(RENDER_LITERAL, fileText, refs);
        return refs;
    }

    private void collectPatternMatches(Pattern pattern, String text, Set<String> refs) {
        var matcher = pattern.matcher(text);
        while (matcher.find()) {
            String ref = matcher.group(1).trim();
            if (!ref.isBlank() && looksLikeTemplatePath(ref)) {
                refs.add(ref);
            }
        }
    }

    private boolean looksLikeTemplatePath(String ref) {
        String lower = ref.toLowerCase(Locale.ROOT);
        return lower.endsWith(".html") || lower.endsWith(".htm") || lower.endsWith(".ejs")
                || lower.endsWith(".erb") || lower.endsWith(".hbs") || lower.endsWith(".mustache")
                || lower.endsWith(".jinja") || lower.endsWith(".j2") || lower.endsWith(".twig")
                || lower.endsWith(".tpl") || lower.contains("/");
    }

    /**
     * Resolves a template reference relative to the source file using common template directory
     * layouts ({@code templates/}, app-level template roots). Returns a repo-relative path.
     */
    private Optional<String> resolveTemplateFile(String repoDir, String sourceFile, String templateRef) {
        String normalizedRef = templateRef.replace('\\', '/').replaceAll("^/+", "");
        Path sourcePath = Path.of(sourceFile.replace('\\', '/'));
        Path sourceDir = sourcePath.getParent();
        if (sourceDir == null) {
            sourceDir = Path.of("");
        }

        List<Path> candidates = new ArrayList<>();
        Path current = sourceDir;
        for (int depth = 0; depth < 5; depth++) {
            candidates.add(current.resolve("templates").resolve(normalizedRef));
            candidates.add(current.resolve(normalizedRef));
            if (current.getParent() == null || current.toString().isEmpty()) {
                break;
            }
            current = current.getParent();
        }
        candidates.add(Path.of("templates").resolve(normalizedRef));

        Path repoRoot = Path.of(repoDir);
        Set<String> existing = new LinkedHashSet<>();
        for (Path candidate : candidates) {
            Path absolute = repoRoot.resolve(candidate).normalize();
            if (!absolute.startsWith(repoRoot)) {
                continue;
            }
            if (Files.isRegularFile(absolute)) {
                existing.add(repoRoot.relativize(absolute).toString().replace('\\', '/'));
            }
        }
        if (existing.size() == 1) {
            return Optional.of(existing.iterator().next());
        }
        return Optional.empty();
    }

    private String readTemplateSnippet(String repoDir, String relPath) {
        Path filePath = Path.of(repoDir, relPath);
        try {
            List<String> lines = Files.readAllLines(filePath, StandardCharsets.UTF_8);
            StringBuilder sb = new StringBuilder();
            int limit = Math.min(lines.size(), MAX_TEMPLATE_LINES);
            for (int i = 0; i < limit; i++) {
                sb.append(i + 1).append("| ").append(lines.get(i)).append('\n');
            }
            if (lines.size() > MAX_TEMPLATE_LINES) {
                sb.append("... (").append(lines.size() - MAX_TEMPLATE_LINES).append(" more lines truncated)");
            }
            return sb.toString().trim();
        } catch (IOException e) {
            log.debug("[CodeContextExtractor] Cannot read template {}: {}", filePath, e.getMessage());
            return "";
        }
    }

    private int leadingSpaces(String line) {
        int count = 0;
        for (char c : line.toCharArray()) {
            if (c == ' ') count++;
            else if (c == '\t') count += 4;
            else break;
        }
        return count;
    }

    String detectLanguage(String filename) {
        if (filename == null) return "unknown";
        String lower = filename.toLowerCase();
        if (lower.endsWith(".py")) return "python";
        if (lower.endsWith(".java")) return "java";
        if (lower.endsWith(".js") || lower.endsWith(".jsx")) return "javascript";
        if (lower.endsWith(".ts") || lower.endsWith(".tsx")) return "typescript";
        if (lower.endsWith(".rb")) return "ruby";
        if (lower.endsWith(".go")) return "go";
        if (lower.endsWith(".php")) return "php";
        if (lower.endsWith(".cs")) return "csharp";
        if (lower.endsWith(".rs")) return "rust";
        if (lower.endsWith(".swift")) return "swift";
        if (lower.endsWith(".kt") || lower.endsWith(".kts")) return "kotlin";
        return "unknown";
    }
}
