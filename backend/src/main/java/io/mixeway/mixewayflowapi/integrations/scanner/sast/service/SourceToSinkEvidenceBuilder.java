package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Component
@Order(900)
public class SourceToSinkEvidenceBuilder implements SastEvidenceBuilder {

    @Override
    public boolean supports(SastRuleMetadata metadata) {
        // Any rule marked requiresTaint uses structured source→sink evidence.
        // Specialized builders (logging/crypto/cookie) have lower @Order and win first.
        return metadata != null && metadata.requiresTaint();
    }

    @Override
    public FindingEvidence build(Item item, CodeContextExtractor.CodeContext context, SastRuleMetadata metadata) {
        String combined = combinedText(item, context);
        String codeExtract = item == null || item.getCodeExtract() == null ? "" : item.getCodeExtract();
        String language = detectLanguage(item, context);
        String source = detectSource(combined, metadata.family());
        String sink = detectSink(metadata.family(), codeExtract, combined, item);
        List<String> sanitizers = detectSanitizers(combined);
        List<String> gaps = new ArrayList<>();
        if ("unknown".equals(source) && !"attribute_assignment".equals(sink)) {
            gaps.add("no attacker-controlled source found in supplied context");
        }
        if ("unknown".equals(sink)) {
            gaps.add("sink API could not be classified from code extract");
        }
        if (sanitizers.isEmpty() && !"attribute_assignment".equals(sink)) {
            gaps.add("no sanitizer or allowlist evidence found in supplied context");
        }
        if (metadata.family() == VulnerabilityFamily.DESERIALIZATION
                && (source.startsWith("file_content") || "file_or_stream".equals(source)
                || "cache_or_store_get".equals(source))) {
            gaps.removeIf(g -> g.contains("no attacker-controlled source"));
            if (source.equals("file_content_via_env_or_config_path")) {
                gaps.add("path comes from env/config — still need evidence who can WRITE the file bytes "
                        + "(user-influenced => untrusted; app/operator-only static artifact => trusted)");
            } else if ("cache_or_store_get".equals(source)) {
                gaps.add("observed store/cache .get(...) reaches deserializer; who writes/sets that key is not shown "
                        + "— do not invent a file path or attacker influence");
            } else if (!hasDeserializationAllowlist(combined)) {
                gaps.add("file/stream bytes reach unsafe deserialization; prove whether content is attacker-influenced");
            }
        }

        TaintTrace trace = new TaintTrace(
                true,
                source,
                sink,
                buildSteps(source, sink, codeExtract),
                sanitizers,
                gaps,
                confidence(source, sink, gaps));

        List<String> policyNotes = new ArrayList<>(List.of(
                "TRUE_POSITIVE requires a plausible attacker-controlled source reaching the vulnerable sink without adequate neutralization.",
                "FALSE_POSITIVE requires positive evidence of sanitization, allowlisting, safe framework binding, or non-attacker-controlled data.",
                "If source or sink is missing from context, prefer UNCERTAIN unless surrounding code proves safety."));
        
        if (metadata.family() == VulnerabilityFamily.SQL_INJECTION) {
            policyNotes.add("SQL injection CRITICAL RULE: If ALL concatenated values in the SQL query are primitive numeric types "
                    + "(int, Integer, long, Long, short, double, float, etc.) as proven by function signature or variable declaration, "
                    + "mark FALSE_POSITIVE with high confidence (>=0.85). Numeric primitives cannot inject SQL syntax. "
                    + "If ANY String/Object is concatenated, evaluate normally for sanitization/parameterization.");
            policyNotes.add("A variable containing SQL is not automatically exploitable. Prefer FALSE_POSITIVE when the SQL text "
                    + "is a string literal/constant or is built only from parameterized binders/ORM APIs. Prefer UNCERTAIN when "
                    + "the SQL argument origin is not proven by call sites or definitions.");
            policyNotes.add("Config/query loaders (getSqlString/getQuery/etc.) are not automatically trusted — trace where "
                    + "their SQL text originates before marking FALSE_POSITIVE.");
            policyNotes.add("If SQL/DDL is built locally via concatenation of instance fields, getters, JSON, or resource "
                    + "names (e.g. CREATE INDEX \" + field), call-site literals of the constructor/enclosing function "
                    + "do not prove safety — chase those operands, not only call sites.");
            policyNotes.add("RISKY SCHEME: trusted/literal/constant operands + string-concatenated SQL => "
                    + "TRUE_POSITIVE with confidence ~0.55 (not FALSE_POSITIVE). High-confidence TRUE_POSITIVE "
                    + "only when operands are untrusted/unknown non-literals.");
        }
        if (metadata.family() == VulnerabilityFamily.COMMAND_INJECTION
                && "attribute_assignment".equals(sink)) {
            policyNotes.add("Bearer labeled this as code generation/injection, but the shown sink is attribute "
                    + "wiring (setattr / __set__ / contribute_to_class), not eval/exec/compile.");
            policyNotes.add("Judge the ATTRIBUTE NAME argument, not the assigned VALUE. "
                    + "Literal / self.field / cls._meta.x / contribute_to_class field id + no exec sink "
                    + "=> FALSE_POSITIVE even if VALUE is HTTP/GraphQL/DB.");
            policyNotes.add("TRUE_POSITIVE only if NAME is attacker-controlled (mass assignment) or a real "
                    + "eval/exec/compile/Function sink is shown. Unclear VALUE origin is not UNCERTAIN.");
        } else if (metadata.family() == VulnerabilityFamily.COMMAND_INJECTION) {
            policyNotes.add("Command injection via settings.NAME (e.g. PRE_CONSUME_SCRIPT / POST_CONSUME_SCRIPT): "
                    + "seeing settings.X only proves a config indirection — NOT that the value is trusted. "
                    + "Trace where that setting is assigned (settings.py, env mapping, admin UI, DB).");
            policyNotes.add("Decision: (A) setting value proven from operator env/hardcoded deploy config only "
                    + "=> FALSE_POSITIVE / config_file|environment_variable; (B) setting writable via user/admin UI "
                    + "or other untrusted channel => TRUE_POSITIVE; (C) settings.X visible but value origin not found "
                    + "=> UNCERTAIN — do not invent trust from the settings. prefix alone.");
        }
        if (metadata.family() == VulnerabilityFamily.DESERIALIZATION) {
            policyNotes.add("CRITICAL: Cite only channels observed in code. Store/cache .get is not a file read; "
                    + "do not invent filesystem paths, uploads, or attacker influence.");
            policyNotes.add("If code shows file/stream read: path origin ≠ bytes origin; verdict depends on who "
                    + "writes those file bytes. If code shows store/cache .get: verdict depends on who set/dumps "
                    + "that key. If writer trust is not shown => UNCERTAIN.");
            policyNotes.add("Decision rule: (A) code proves attacker-influenced bytes reach unsafe deser => TP; "
                    + "(B) code proves app/operator-only writer => FP; (C) read/get shown but writer unknown => "
                    + "UNCERTAIN — do not guess.");
        }
        if (metadata.family() == VulnerabilityFamily.TRUST_BOUNDARY) {
            policyNotes.add("Trust-boundary (CWE-501 / setAttribute/session put): trace the VALUE stored into "
                    + "request/session/attributes — not the attribute key, and not nearby headers unless the VALUE "
                    + "is derived from them.");
            policyNotes.add("Decision: (A) VALUE from attacker-controlled channel (HTTP/header/body/param/DB user data) "
                    + "crosses into trusted request/session state without validation => TRUE_POSITIVE; "
                    + "(B) VALUE is operator/admin security-service config id (SecurityNamedServiceConfig / "
                    + "initializeFromConfig / clone) or other internal marker => FALSE_POSITIVE / "
                    + "config_file|internal_call; (C) config object visible but id writers not found => UNCERTAIN.");
        }
        if (metadata.family() == VulnerabilityFamily.OPEN_REDIRECT) {
            policyNotes.add("Open redirect FALSE_POSITIVE when redirect target is built from current page URL "
                    + "(new URL(window.location.href|location.href)) and only searchParams/query params are mutated, "
                    + "or the redirect is a relative-only string literal (/path, ./x, #hash). "
                    + "Query values cannot change the redirect host.");
            policyNotes.add("TRUE_POSITIVE only when attacker-controlled full URL/host reaches location.href / "
                    + "assign/replace / sendRedirect without same-origin or allowlist validation.");
        }
        if (metadata.family() == VulnerabilityFamily.PATH_TRAVERSAL) {
            policyNotes.add("Path traversal via object/model fields works the same in every language "
                    + "(Python self.input_doc.original_file / document.source_path, Java doc.getSourcePath(), "
                    + "JS file.originalFilename, Go doc.SourcePath, C# doc.SourcePath, PHP $doc->filename, "
                    + "Ruby document.source_path, Rust doc.source_path): param typing / ORM/getter access only "
                    + "proves indirection — NOT trust. Search property/getter definition and who sets filename/path.");
            policyNotes.add("Decision: (A) path proven from user upload / consume/watch dir / HTTP filename "
                    + "without language-appropriate canonicalization "
                    + "(Path.resolve/realpath/getCanonicalPath/filepath.Clean/Path.GetFullPath + prefix allowlist) "
                    + "=> TRUE_POSITIVE / file_untrusted|http_request; "
                    + "(B) path proven under fixed media/base dir via safe join/resolve, or operator-only static "
                    + "path => FALSE_POSITIVE; "
                    + "(C) local alias/source/dest args traced to model path property but component origin not found "
                    + "=> UNCERTAIN — do not invent trust from property naming alone.");
        }

        String key = metadata.family() == VulnerabilityFamily.SQL_INJECTION
                ? sqlConsistencyKey(metadata, item, sink)
                : consistencyKey(metadata, item, source, sink);

        return new FindingEvidence(
                true,
                metadata,
                ExecutionContext.UNKNOWN,
                "Source-to-sink finding classified by source, sink, sanitizer evidence, and trace gaps.",
                FindingEvidence.attributes(
                        "language_hint", language,
                        "source_category", category(source),
                        "sink_category", category(sink),
                        "sanitizer_evidence", sanitizers.isEmpty() ? "none" : String.join(", ", sanitizers)),
                trace,
                policyNotes,
                key);
    }

    private String detectSource(String combined, VulnerabilityFamily family) {
        String lower = combined.toLowerCase(Locale.ROOT);
        boolean fileBytes = hasFileBytesProvenance(lower);
        boolean storeGet = hasStoreGetProvenance(lower);
        boolean envOrConfigPath = hasEnvOrConfigPath(lower);

        // Label only what the code shows. Store/cache get is not a file.
        if (family == VulnerabilityFamily.DESERIALIZATION && fileBytes) {
            return envOrConfigPath ? "file_content_via_env_or_config_path" : "file_content";
        }
        if (family == VulnerabilityFamily.DESERIALIZATION && storeGet) {
            return "cache_or_store_get";
        }

        // Trust-boundary: prefer config/object provenance of the VALUE over nearby HTTP accessors
        // (e.g. getHeader in the same method that does not flow into setAttribute).
        // Do not treat Python setattr (often Bearer "code generation") as Java session setAttribute.
        if (family == VulnerabilityFamily.TRUST_BOUNDARY || lower.contains("setattribute(")) {
            if (hasSecurityConfigProvenance(lower)) {
                return "security_config_or_named_service";
            }
            if (hasInternalMarkerProvenance(lower) && !hasDirectHttpValueIntoAttribute(lower)) {
                return "internal_call";
            }
        }

        if (lower.contains("@requestparam") || lower.contains("getparameter(")) {
            return "http_request_parameter";
        }
        if (lower.contains("@pathvariable") || lower.contains("getpathinfo(") || lower.contains("getrequesturi(")) {
            return "http_path_or_route_parameter";
        }
        if (lower.contains("getheader(") || lower.contains("headers") || lower.contains("@requestheader")) {
            return "http_header";
        }
        if (lower.contains("requestbody") || lower.contains("@requestbody") || lower.contains("getinputstream(")) {
            return "http_request_body";
        }
        if (lower.contains("req.query") || lower.contains("req.params") || lower.contains("req.body")
                || lower.contains("req.headers") || lower.contains("ctx.query") || lower.contains("ctx.params")) {
            return "node_http_request";
        }
        if (lower.contains("request.args") || lower.contains("request.form") || lower.contains("request.json")
                || lower.contains("request.get_json") || lower.contains("request.get(")
                || lower.contains("request.get[") || lower.contains("request.post[")) {
            return "python_http_request";
        }
        if (lower.contains("$_get") || lower.contains("$_post") || lower.contains("$_request")
                || lower.contains("$_cookie") || lower.contains("$_server")) {
            return "php_superglobal";
        }
        if (lower.contains("params[") || lower.contains("request.params") || lower.contains("request.query_parameters")) {
            return "ruby_http_params";
        }
        if (lower.contains("r.url.query()") || lower.contains("r.formvalue(")
                || lower.contains("r.header.get(") || lower.contains("c.query(") || lower.contains("c.param(")) {
            return "go_http_request";
        }
        if (lower.contains("request.query[") || lower.contains("request.form[")
                || lower.contains("request.headers[") || lower.contains("routevalues[")
                || lower.contains("[frombody]") || lower.contains("[fromquery]")
                || lower.contains("[fromroute]") || lower.contains("[fromform]")
                || lower.contains("httpcontext.request")) {
            return "dotnet_http_request";
        }
        // Rust: actix-web / axum / rocket
        if (lower.contains("web::query") || lower.contains("web::path") || lower.contains("web::form")
                || lower.contains("web::json") || lower.contains("extract::query")
                || lower.contains("extract::path") || lower.contains("extract::form")
                || lower.contains("extract::json") || lower.contains("rocket::request")
                || lower.contains("form<") || lower.contains("query<")) {
            return "rust_http_request";
        }
        // Go extras (Gin/Echo/Fiber/Chi beyond earlier checks)
        if (lower.contains("c.query(") || lower.contains("c.param(") || lower.contains("c.postform(")
                || lower.contains("c.queryparam(") || lower.contains("c.formvalue(")
                || lower.contains("c.body(") || lower.contains("chi.urlparam(")
                || lower.contains("c.params(") || lower.contains("shouldbind")
                || lower.contains("bindjson") || lower.contains("gin.context")) {
            return "go_http_request";
        }
        if (lower.contains("queryselector") || lower.contains("getelementbyid")
                || lower.contains(".textcontent") || lower.contains(".innertext")
                || lower.contains(".dataset")
                || (lower.contains("this.") && lower.contains("target"))) {
            return "dom_content";
        }
        if (lower.contains("jtextfield") || lower.contains("jpasswordfield") || lower.contains("gettext()")
                || lower.contains("textfield") || lower.contains("swing.") || lower.contains("javafx")
                || lower.contains("textbox") || lower.contains("textbox.") || lower.contains("winforms")
                || lower.contains("system.windows.forms") || lower.contains("wpf")
                || lower.contains("qlineedit") || lower.contains("qtextedit") || lower.contains(".text()")
                || lower.contains("tkinter") || lower.contains("entry.get(")) {
            return "gui_input";
        }
        if (lower.contains(".objects.") || lower.contains("repository.") || lower.contains("findall")
                || lower.contains("findby") || lower.contains("get_queryset") || lower.contains("queryset")
                || lower.contains("entitymanager.find") || lower.contains("session.get(")
                || lower.contains("->getname(") || lower.contains("->getdescription(")
                || lower.contains(".getname(") || lower.contains(".getdescription(")
                || lower.contains(".getcomment(") || lower.contains(".gettitle(")
                || lower.contains(".getcontent(") || lower.contains(".getbody(")
                || lower.contains("activerecord") || lower.contains("find_by") || lower.contains(".where(")
                || lower.contains("gorm.") || lower.contains("db.first(") || lower.contains("db.find(")
                || lower.contains("eloquent") || lower.contains("::query()->")) {
            return "database_or_persisted_entity";
        }
        if (lower.contains("multipartfile") || lower.contains("uploadedfile") || lower.contains("request.files")
                || lower.contains("$_files") || lower.contains("formdata") || lower.contains("getoriginalfilename")
                || lower.contains("originalfilename") || lower.contains("iformfile")
                || lower.contains("move_uploaded_file") || lower.contains("actiondispatch::http::uploadedfile")
                || (lower.contains("params[:") && lower.contains("tempfile"))
                || lower.contains("c.formfile(") || lower.contains("multipart.file")
                || lower.contains("consumabledocument") || lower.contains("namedtemporaryfile")) {
            return "file_upload";
        }
        if (lower.contains("data.message") || lower.contains("data.error") || lower.contains("result.message")
                || lower.contains("response.json") || lower.contains("axios.") || lower.contains("fetch(")
                || lower.contains("http.get(") || lower.contains("ureq.") || lower.contains("reqwest::")) {
            return "http_response_or_api_data";
        }
        if (fileBytes) {
            return "file_or_stream";
        }
        if (envOrConfigPath) {
            return "environment_or_system_property";
        }
        if (lower.contains("args[") || lower.contains("argv") || lower.contains("scanner(")
                || lower.contains("process.argv") || lower.contains("flag.") || lower.contains("cobra.command")) {
            return "cli_input";
        }
        return "unknown";
    }

    private boolean hasFileBytesProvenance(String lower) {
        boolean readApi = lower.contains(".read(") || lower.contains(".read()")
                || lower.contains("read_bytes(") || lower.contains("readallbytes(")
                || lower.contains("files.readallbytes") || lower.contains("files.readstring")
                || lower.contains("ioutil.readfile") || lower.contains("os.readfile")
                || lower.contains("fs.readfilesync") || lower.contains("fs.readfile(")
                || lower.contains("file_get_contents(") || lower.contains("fileinputstream")
                || lower.contains(".readlines(") || lower.contains("bufferedreader");
        boolean openWithRead = (lower.contains("with open(") || lower.contains("open("))
                && (readApi || lower.contains("pickle") || lower.contains("yaml.load")
                || lower.contains("marshal.load") || lower.contains("objectinputstream"));
        return readApi || openWithRead;
    }

    /** True only when code shows a cache/backend/store {@code .get(} — not a filesystem read. */
    private boolean hasStoreGetProvenance(String lower) {
        return lower.contains("backend.get(") || lower.contains("cache.get(")
                || lower.contains("redis.get(") || lower.contains("memcache.get(")
                || lower.contains("_backend.get(") || lower.contains(".store.get(");
    }

    private boolean hasEnvOrConfigPath(String lower) {
        return lower.contains("environment.getproperty") || lower.contains("system.getenv(")
                || lower.contains("system.getproperty(") || lower.contains("os.environ")
                || lower.contains("os.getenv(") || lower.contains("getenv(")
                || lower.contains("environ.get(") || lower.contains("process.env")
                || lower.contains("settings.") || lower.contains("dotenv");
    }

    /** Operator/admin security filter config objects feeding request attribute values. */
    private boolean hasSecurityConfigProvenance(String lower) {
        return lower.contains("securitynamedserviceconfig")
                || lower.contains("initializefromconfig")
                || lower.contains("geoserverjwtheadersfilterconfig")
                || (lower.contains("filterconfig") && (lower.contains("getid(") || lower.contains(".clone(")))
                || (lower.contains("setattribute(") && lower.contains("getid(")
                && (lower.contains("clone(") || lower.contains("initializefromconfig")));
    }

    private boolean hasInternalMarkerProvenance(String lower) {
        return lower.contains("http_attribute_config_id")
                || lower.contains("configid")
                || lower.contains("config_id")
                || (lower.contains("getid(") && lower.contains("setattribute("));
    }

    /**
     * True only when an HTTP accessor appears to feed the attribute VALUE expression itself
     * (not merely coexist in the same method/file).
     */
    private boolean hasDirectHttpValueIntoAttribute(String lower) {
        // Heuristic: setAttribute(..., request.getX / getParameter / getHeader(...))
        return lower.contains("setattribute(")
                && (lower.contains("setattribute(") && (
                lower.matches("(?s).*setattribute\\s*\\([^,]+,\\s*[^)]*get(parameter|header|querystring|cookies?|attribute)\\s*\\(.*")
                        || lower.matches("(?s).*setattribute\\s*\\([^,]+,\\s*[^)]*request\\.(get|parameter|header).*")
                        || lower.matches("(?s).*setattribute\\s*\\([^,]+,\\s*[^)]*@request(param|body|header).*")));
    }

    private boolean hasDeserializationAllowlist(String combined) {
        String lower = combined.toLowerCase(Locale.ROOT);
        return lower.contains("yaml.safe_load") || lower.contains("safeloader")
                || lower.contains("objectinputfilter") || lower.contains("allowlist")
                || lower.contains("whitelist") || lower.contains("json.loads")
                || lower.contains("hmac") || lower.contains("signature")
                || lower.contains("verify(") || lower.contains("safe_load");
    }

    private String detectSink(VulnerabilityFamily family, String codeExtract, String combined, Item item) {
        String lower = (codeExtract + "\n" + combined).toLowerCase(Locale.ROOT);
        if (CodeInjectionSinkEvidence.isCodeInjectionFinding(item)
                && CodeInjectionSinkEvidence.isNonExecutionAttributeAssignment(item, combined)
                && !CodeInjectionSinkEvidence.hasRealExecutionSink(codeExtract + "\n" + combined)) {
            return "attribute_assignment";
        }
        if (family == VulnerabilityFamily.SQL_INJECTION || lower.contains("createquery(")
                || lower.contains("createnativequery(") || lower.contains("createstatement(")
                || lower.contains("executequery(") || lower.contains("executestatement(")
                || lower.contains("cursor.execute(") || lower.contains("connection.execute(")
                || lower.contains("session.execute(") || lower.contains("sqlalchemy.text(")
                || lower.contains("db.query(") || lower.contains("client.query(")
                || lower.contains("pool.query(") || lower.contains("connection.query(")
                || lower.contains("sequelize.query(")
                || lower.contains("knex.raw(") || lower.contains("find_by_sql")
                || lower.contains("db::select(") || lower.contains("database.query(")
                || lower.contains("sqlx.query(") || lower.contains("queryrow(")
                || lower.contains("querycontext(") || lower.contains("execcontext(")
                || lower.contains("mysqli_query(") || lower.contains("pg_query(")
                || lower.contains("fromsqlraw(") || lower.contains("executesqlraw(")
                || lower.contains("diesel::sql_query") || lower.contains("activerecord")) {
            return "sql_query_execution";
        }
        if (family == VulnerabilityFamily.COMMAND_INJECTION || lower.contains("runtime.getruntime().exec")
                || lower.contains("processbuilder(") || lower.contains("child_process.exec")
                || lower.contains("child_process.spawn") || lower.contains("passthru(")
                || lower.contains("shell_exec(") || lower.contains("proc_open(")
                || lower.contains("subprocess.") || lower.contains("os.system(")
                || lower.contains("popen(") || lower.contains("exec.command(")
                || lower.contains("exec.commandcontext(") || lower.contains("process.start(")
                || lower.contains("open3.") || lower.contains("command::new")
                || lower.contains("cmd /c") || lower.contains("powershell")) {
            return "os_command_execution";
        }
        if (family == VulnerabilityFamily.PATH_TRAVERSAL || lower.contains("new file(")
                || lower.contains("paths.get(") || lower.contains("path.of(")
                || lower.contains("files.delete") || lower.contains("files.copy")
                || lower.contains("files.move") || lower.contains("files.write")
                || lower.contains("files.readallbytes") || lower.contains("files.newinputstream")
                || lower.contains("fileinputstream") || lower.contains("fileoutputstream")
                || lower.contains("fs.readfile") || lower.contains("fs.writefile")
                || lower.contains("fs.unlink") || lower.contains("fs.copyfile")
                || lower.contains("path.join(") || lower.contains("path.resolve(")
                || lower.contains("pathlib.path(") || lower.contains(".unlink(")
                || lower.contains("os.remove(") || lower.contains("os.unlink(")
                || lower.contains("os.removeall(") || lower.contains("os.readfile")
                || lower.contains("os.writefile") || lower.contains("shutil.rmtree(")
                || lower.contains("shutil.copy(") || lower.contains("shutil.move(")
                || lower.contains("file_get_contents(") || lower.contains("file_put_contents(")
                || lower.contains("move_uploaded_file(") || lower.contains("fopen(")
                || lower.contains("ioutil.readfile(") || lower.contains("ioutil.writefile(")
                || lower.contains("filepath.join(") || lower.contains("os.open(")
                || lower.contains("storage::get(") || lower.contains("system.io.file.")
                || lower.contains("file.delete(") || lower.contains("file.copy(")
                || lower.contains("file.writeall") || lower.contains("path.combine(")
                || lower.contains("new filestream") || lower.contains("fileutils.")
                || lower.contains("std::fs::") || lower.contains("tokio::fs::")
                || lower.contains("fs::read") || lower.contains("fs::write")
                || lower.contains("file::open") || lower.contains("file::create")) {
            return "filesystem_path_access";
        }
        if (family == VulnerabilityFamily.XSS || lower.contains("innerhtml")
                || lower.contains("document.write") || lower.contains("response.getwriter(")
                || lower.contains("dangerouslysetinnerhtml") || lower.contains("res.send(")
                || lower.contains("res.write(") || lower.contains("render_template_string(")
                || lower.contains("mark_safe(") || lower.contains("html_safe")
                || lower.contains("content_tag(")
                || lower.contains("response.write(") || lower.contains("html.raw(")
                || lower.contains("template.html(") || lower.contains("|raw")
                || lower.contains("echo ") || lower.contains("writeline(")
                || lower.contains("[innerhtml]")) {
            return "html_or_http_response";
        }
        if (family == VulnerabilityFamily.SSRF || lower.contains("resttemplate")
                || lower.contains("webclient") || lower.contains("url(") || lower.contains("httpclient")
                || lower.contains("fetch(") || lower.contains("axios.") || lower.contains("got(")
                || lower.contains("http.request(") || lower.contains("https.request(")
                || lower.contains("requests.get(")
                || lower.contains("requests.post(") || lower.contains("urllib.request")
                || lower.contains("http.get(") || lower.contains("http.post(")
                || lower.contains("net/http") || lower.contains("curl_exec(")) {
            return "server_side_http_request";
        }
        if (family == VulnerabilityFamily.OPEN_REDIRECT || lower.contains("sendredirect(")
                || lower.contains("redirect:") || lower.contains("res.redirect(")
                || lower.contains("response.redirect(") || lower.contains("redirect_to ")
                || lower.contains("return redirect(") || lower.contains("http.redirect(")
                || lower.contains("location.href") || lower.contains("location.assign(")
                || lower.contains("location.replace(")) {
            return "redirect_target";
        }
        if (family == VulnerabilityFamily.XXE || lower.contains("documentbuilderfactory")
                || lower.contains("saxparserfactory") || lower.contains("xmlreader")
                || lower.contains("etree.parse(") || lower.contains("lxml.")
                || lower.contains("simplexml_load") || lower.contains("domdocument")
                || lower.contains("xmlreadersettings")) {
            return "xml_parser";
        }
        if (family == VulnerabilityFamily.DESERIALIZATION || lower.contains("objectinputstream")
                || lower.contains("readobject(") || lower.contains("pickle.loads")
                || lower.contains("yaml.load(") || lower.contains("marshal.load")
                || lower.contains("unserialize(") || lower.contains("binaryformatter")
                || lower.contains("typenamehandling") || lower.contains("jsonpickle.decode")
                || lower.contains("objectinputstream") || lower.contains("gob.newdecoder")) {
            return "deserialization_api";
        }
        if (family == VulnerabilityFamily.TRUST_BOUNDARY || lower.contains("setattribute(")
                || lower.contains("attributes.put(")) {
            return "request_or_session_attribute_store";
        }
        if (lower.contains("string.format(") || lower.contains("messageformat")
                || lower.contains("formatter.format(") || lower.contains("printf(")
                || lower.contains("sprintf(") || lower.contains("fmt.sprintf(")) {
            return "format_string_template";
        }
        return "unknown";
    }

    private List<String> detectSanitizers(String combined) {
        List<String> sanitizers = new ArrayList<>();
        String lower = combined.toLowerCase(Locale.ROOT);
        if (lower.contains("sanitize") || lower.contains("clean(")) {
            sanitizers.add("sanitizer_call");
        }
        if (lower.contains("escape") || lower.contains("encodeforhtml") || lower.contains("htmlutils.htmlescape")
                || lower.contains("html.escape") || lower.contains("dompurify.sanitize")
                || lower.contains("bleach.clean") || lower.contains("owasp.encoder")
                || lower.contains("esapi.encoder")) {
            sanitizers.add("escaping_or_output_encoding");
        }
        if (lower.contains("allowlist") || lower.contains("whitelist") || lower.contains("matches(")
                || lower.contains("regexp.") || lower.contains("pattern.compile")
                || lower.contains("validator.") || lower.contains("joi.") || lower.contains("zod.")) {
            sanitizers.add("allowlist_or_pattern_validation");
        }
        if (lower.contains("preparedstatement") || lower.contains("setparameter(")
                || lower.contains("bindparam") || lower.contains("parameterized")
                || lower.contains("namedparameterjdbctemplate") || lower.contains("querybuilder")
                || lower.contains("where(")) {
            sanitizers.add("parameterized_query_candidate");
        }
        if (lower.contains("normalize()") || lower.contains("canonical")
                || lower.contains("realpath(") || lower.contains("getcanonicalpath")
                || lower.contains("torealpath") || lower.contains("filepath.clean(")
                || lower.contains("filepath.abs(") || lower.contains("path.resolve(")
                || lower.contains("path.normalize(") || lower.contains("path.getfullpath")
                || lower.contains("secure_filename(") || lower.contains("os.path.commonpath")
                || lower.contains("startswith(") || lower.contains("hasprefix(")
                || lower.contains("stripprefix(")) {
            sanitizers.add("path_normalization_candidate");
        }
        if ((lower.contains("new url(window.location") || lower.contains("new url(location.href")
                || lower.contains("new url(location)"))
                && lower.contains("searchparams.")) {
            sanitizers.add("same_origin_searchparams_only");
        }
        return sanitizers;
    }

    private List<String> buildSteps(String source, String sink, String codeExtract) {
        List<String> steps = new ArrayList<>();
        if (!"unknown".equals(source)) {
            steps.add(source);
        }
        if (codeExtract != null && !codeExtract.isBlank()) {
            steps.add(clip(codeExtract));
        }
        if (!"unknown".equals(sink)) {
            steps.add(sink);
        }
        return steps;
    }

    private double confidence(String source, String sink, List<String> gaps) {
        if (!"unknown".equals(source) && !"unknown".equals(sink) && gaps.size() <= 1) {
            return 0.75d;
        }
        if (!"unknown".equals(source) || !"unknown".equals(sink)) {
            return 0.45d;
        }
        return 0.25d;
    }

    private String category(String value) {
        return value == null || value.isBlank() ? "unknown" : value;
    }

    private String consistencyKey(SastRuleMetadata metadata, Item item, String source, String sink) {
        String file = item == null ? "" : java.util.Optional.ofNullable(item.getFilename())
                .orElse(java.util.Optional.ofNullable(item.getFullFilename()).orElse(""));
        String rule = metadata.ruleId() == null ? metadata.family().name() : metadata.ruleId();
        return String.join("|", rule, file, source, sink);
    }

    /**
     * SQL siblings in one file often differ only by local parameter names; normalize the sink
     * primitive so consistency alignment can reconcile FP/UNCERTAIN conflicts.
     */
    private String sqlConsistencyKey(SastRuleMetadata metadata, Item item, String sink) {
        String file = item == null ? "" : java.util.Optional.ofNullable(item.getFilename())
                .orElse(java.util.Optional.ofNullable(item.getFullFilename()).orElse(""));
        String rule = metadata.ruleId() == null ? metadata.family().name() : metadata.ruleId();
        String extract = item == null || item.getCodeExtract() == null ? "" : item.getCodeExtract().toLowerCase(Locale.ROOT);
        String primitive;
        if (extract.contains("preparestatement")) {
            primitive = "prepareStatement";
        } else if (extract.contains("preparecall")) {
            primitive = "prepareCall";
        } else if (extract.contains("createnativequery") || extract.contains("createquery")) {
            primitive = "createQuery";
        } else if (extract.contains("executequery") || extract.contains("executeupdate") || extract.contains(".execute(")) {
            primitive = "execute";
        } else {
            primitive = category(sink);
        }
        return String.join("|", rule, file, primitive);
    }

    private String combinedText(Item item, CodeContextExtractor.CodeContext context) {
        String related = "";
        if (context != null && context.relatedFiles() != null && !context.relatedFiles().isEmpty()) {
            StringBuilder rb = new StringBuilder();
            for (CodeContextExtractor.RelatedSnippet snippet : context.relatedFiles()) {
                if (snippet == null) continue;
                rb.append(snippet.filename() == null ? "" : snippet.filename()).append('\n');
                rb.append(snippet.snippet() == null ? "" : snippet.snippet()).append('\n');
            }
            related = rb.toString();
        }
        return String.join("\n",
                item == null || item.getTitle() == null ? "" : item.getTitle(),
                item == null || item.getDescription() == null ? "" : item.getDescription(),
                item == null || item.getCodeExtract() == null ? "" : item.getCodeExtract(),
                context == null || context.functionBody() == null ? "" : context.functionBody(),
                context == null || context.localSnippet() == null ? "" : context.localSnippet(),
                context == null || context.definitionContext() == null ? "" : context.definitionContext(),
                context == null || context.callerContext() == null ? "" : context.callerContext(),
                context == null || context.crossFileCallerContext() == null ? "" : context.crossFileCallerContext(),
                context == null || context.frameworkContext() == null ? "" : context.frameworkContext(),
                context == null || context.templateContext() == null ? "" : context.templateContext(),
                related);
    }

    private String detectLanguage(Item item, CodeContextExtractor.CodeContext context) {
        if (context != null && context.language() != null && !context.language().isBlank()) {
            return context.language();
        }
        String file = item == null ? "" : java.util.Optional.ofNullable(item.getFilename())
                .orElse(java.util.Optional.ofNullable(item.getFullFilename()).orElse(""));
        String lower = file.toLowerCase(Locale.ROOT);
        if (lower.endsWith(".java") || lower.endsWith(".kt")) return "jvm";
        if (lower.endsWith(".js") || lower.endsWith(".jsx") || lower.endsWith(".ts") || lower.endsWith(".tsx")) return "javascript";
        if (lower.endsWith(".py")) return "python";
        if (lower.endsWith(".php")) return "php";
        if (lower.endsWith(".rb")) return "ruby";
        if (lower.endsWith(".go")) return "go";
        if (lower.endsWith(".cs")) return "dotnet";
        return "unknown";
    }

    private String clip(String value) {
        String normalized = value.replaceAll("\\s+", " ").trim();
        return normalized.length() <= 160 ? normalized : normalized.substring(0, 160) + "...";
    }
}
