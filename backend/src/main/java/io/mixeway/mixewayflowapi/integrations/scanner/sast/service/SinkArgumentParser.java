package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import org.springframework.stereotype.Component;

import java.util.*;
import java.util.regex.Pattern;

/**
 * Parses the flagged code extract to identify the primary tainted variable and
 * determine whether the data source is immediately obvious — either provably safe
 * (string/number literal or constant) or provably untrusted (an HTTP request
 * accessor is directly visible in the extract). This drives early-exit evidence
 * classification and cross-file tracing decisions in {@link CodeContextExtractor}.
 *
 * <p>Covered languages and frameworks:
 * <ul>
 *   <li>Python — Django (request.GET/POST/FILES/…), Flask (request.form/args/…), FastAPI</li>
 *   <li>Java — Spring MVC (@RequestParam, @PathVariable, @RequestBody, @RequestHeader, @RequestPart,
 *       @CookieValue, HttpServletRequest, MultipartFile)</li>
 *   <li>JavaScript/TypeScript — Express (req.query/body/params/…), Koa (ctx.query/body/…),
 *       Fastify (request.query/body/…), NestJS (@Body, @Param, @Query, @Headers, @UploadedFile),
 *       browser (location.search/hash, URLSearchParams, document.cookie, postMessage, fetch, XHR)</li>
 *   <li>Go — net/http (r.FormValue, r.URL.Query, r.Header.Get, r.Body),
 *       Gin (c.Query, c.Param, c.PostForm, c.GetHeader),
 *       Echo (c.QueryParam, c.FormValue, c.Param),
 *       Chi (chi.URLParam), Fiber (c.Params, c.Query, c.FormValue)</li>
 *   <li>PHP — $_GET, $_POST, $_REQUEST, $_FILES, $_COOKIE, $_SERVER, filter_input</li>
 *   <li>Ruby/Rails — params[:, request.params, request.body.read</li>
 *   <li>C#/.NET — Request.QueryString, Request.Form, Request.Body, [FromBody], [FromQuery],
 *       [FromRoute], [FromForm], IFormFile, HttpContext.Request</li>
 *   <li>Rust — actix-web (web::Query, web::Path, web::Form, web::Bytes),
 *       axum (extract::Query, extract::Path, extract::Form, extract::Json)</li>
 * </ul>
 */
@Component
public class SinkArgumentParser {

    private static final Pattern IMMEDIATE_HTTP_PATTERN = Pattern.compile(
            // ── Python: Django ──────────────────────────────────────────────────────────
            "\\brequest\\.(GET|POST|FILES|COOKIES|META|headers|body|json|data)\\b"
            // Python: Flask / FastAPI
            + "|\\brequest\\.(form|args|values|stream|files|files|get_json|get_data)\\b"
            // ── Java: Spring annotations ────────────────────────────────────────────────
            + "|@(RequestParam|PathVariable|RequestBody|RequestHeader|RequestPart"
            +   "|CookieValue|MatrixVariable|ModelAttribute)\\b"
            // Java: Servlet API
            + "|\\bHttpServletRequest\\b|\\bMultipartFile\\b|\\bMultipartHttpServletRequest\\b"
            + "|\\bgetParameter\\s*\\(|\\bgetHeader\\s*\\(|\\bgetQueryString\\s*\\("
            + "|\\bgetInputStream\\s*\\(|\\bgetPart\\s*\\(|\\bgetParts\\s*\\("
            // ── JavaScript / TypeScript: Express ────────────────────────────────────────
            + "|\\breq\\.(query|body|params|headers|cookies|file|files)\\b"
            // JS/TS: Fastify
            + "|\\brequest\\.(query|body|params|headers|cookies)\\b"
            // JS/TS: Koa
            + "|\\bctx\\.(query|body|params|headers|cookies|request\\.body|request\\.query)\\b"
            // JS/TS: NestJS decorators
            + "|@(Body|Param|Query|Headers|UploadedFile|UploadedFiles)\\s*\\("
            // JS: browser sources
            + "|\\blocation\\.(search|hash|href|pathname)\\b"
            + "|\\bwindow\\.location\\b|\\bdocument\\.location\\b"
            + "|\\bnew\\s+URLSearchParams\\b|\\bsearchParams\\.get\\s*\\("
            + "|\\bdocument\\.cookie\\b"
            + "|\\bevent\\.detail\\b|\\bevent\\.data\\b|\\bpostMessage\\b"
            + "|\\baddEventListener\\s*\\(\\s*[\"']message"
            + "|\\bfetch\\s*\\(|\\$\\.ajax\\b|\\bXMLHttpRequest\\b|\\bFormData\\b|\\.files\\b"
            // ── Go: net/http ─────────────────────────────────────────────────────────────
            + "|\\br\\.FormValue\\s*\\(|\\br\\.PostFormValue\\s*\\("
            + "|\\br\\.URL\\.Query\\s*\\(|\\br\\.URL\\.RawQuery\\b"
            + "|\\br\\.Header\\.Get\\s*\\(|\\br\\.Body\\b"
            + "|\\br\\.MultipartForm\\b|\\br\\.ParseForm\\s*\\("
            // Go: Gin
            + "|\\bc\\.Query\\s*\\(|\\bc\\.Param\\s*\\(|\\bc\\.PostForm\\s*\\("
            + "|\\bc\\.GetHeader\\s*\\(|\\bc\\.GetRawData\\s*\\("
            + "|\\bc\\.ShouldBind\\b|\\bc\\.BindJSON\\b|\\bc\\.BindQuery\\b"
            // Go: Echo
            + "|\\bc\\.QueryParam\\s*\\(|\\bc\\.FormValue\\s*\\("
            + "|\\bc\\.PathParam\\s*\\(|\\bc\\.Bind\\s*\\("
            // Go: Chi
            + "|\\bchi\\.URLParam\\s*\\("
            // Go: Fiber
            + "|\\bc\\.Params\\s*\\(|\\bc\\.Query\\s*\\(|\\bc\\.FormValue\\s*\\("
            + "|\\bc\\.Body\\s*\\(|\\bc\\.Get\\s*\\("
            // ── PHP ──────────────────────────────────────────────────────────────────────
            + "|\\$_(GET|POST|REQUEST|FILES|COOKIE|SERVER)\\b"
            + "|\\bfilter_input\\s*\\(|\\bfilter_input_array\\s*\\("
            + "|\\$_REQUEST\\[|htmlspecialchars_decode\\s*\\("
            // ── Ruby / Rails ─────────────────────────────────────────────────────────────
            + "|\\bparams\\[|\\brequest\\.params\\b|\\brequest\\.body\\.read\\b"
            + "|\\bparams\\.require\\s*\\(|\\bparams\\.permit\\s*\\("
            // ── C# / .NET ─────────────────────────────────────────────────────────────────
            + "|\\bRequest\\.(QueryString|Form|Params|InputStream|Headers|Cookies)\\b"
            + "|\\bHttpContext\\.Request\\b|\\bIFormFile\\b"
            + "|\\[From(Body|Query|Route|Form|Header|Services)\\]"
            + "|\\bRequest\\.Body\\b|\\bRequest\\.Query\\b|\\bRequest\\.Form\\b"
            // ── Rust: actix-web ───────────────────────────────────────────────────────────
            + "|\\bweb::(Query|Path|Form|Bytes|Json)\\b"
            + "|\\bHttpRequest\\b|\\bweb::Data\\b"
            // Rust: axum / rocket
            + "|\\bextract::(Query|Path|Form|Json|Bytes|Multipart)\\b"
            + "|\\bForm\\s*<|\\bQuery\\s*<|\\bPath\\s*<|\\bJson\\s*<"
            + "|\\brocket::request\\b|\\bData\\s*<",
            Pattern.CASE_INSENSITIVE);

    /**
     * Matches values that are obviously safe regardless of execution context:
     * string/number literals and common boolean/null constants. Only matches when
     * the entire extract (trimmed) is the literal — not when a literal is embedded
     * in a larger expression.
     */
    private static final Pattern SAFE_LITERAL_PATTERN = Pattern.compile(
            "^['\"].*['\"]$"                        // single/double-quoted string literal
            + "|^`[^`]*`$"                           // Go/JS template/backtick literal
            + "|^[0-9]+(\\.[0-9]+)?$"               // integer or float
            + "|^(None|null|True|False|true|false|nil|undefined|NaN)$",
            Pattern.CASE_INSENSITIVE);

    /**
     * Sink function/property names — appear in the flagged extract but are NOT
     * candidates for taint tracing (they are the receiving end of the data flow).
     * Stored lowercase for case-insensitive lookup.
     */
    private static final Set<String> KNOWN_SINK_NAMES = Set.of(
            // Python
            "mark_safe", "render_to_string", "format_html", "eval", "exec",
            "subprocess", "popen", "call", "check_output", "run",
            "open", "write", "send", "redirect",
            // Deserialization sinks (payload arg is the taint candidate, not the API)
            "pickle", "loads", "load", "yaml", "marshal", "unserialize",
            "jsonpickle", "readobject", "objectinputstream", "binaryformatter",
            // Path / filesystem sinks (path arg is the taint candidate)
            "unlink", "rmdir", "rmtree", "remove", "removeall", "delete", "deleteifexists",
            "write_text", "write_bytes", "read_text", "read_bytes", "mkdir", "mkdirall",
            "makedirs", "rename", "replace", "move", "copy", "copy2", "copyfile", "copytree",
            "pathlib", "files", "paths", "fileutils", "filepath", "ioutil",
            "fileinputstream", "fileoutputstream", "filereader", "filewriter",
            "randomaccessfile", "filestream", "streamreader", "streamwriter",
            "readallbytes", "readalltext", "writealltext", "writeallbytes",
            "newinputstream", "newoutputstream", "newbufferedreader", "newbufferedwriter",
            "readfile", "writefile", "openfile", "create", "opendirectory",
            "move_uploaded_file", "file_get_contents", "file_put_contents",
            "remove_file", "create_dir", "create_dir_all",
            // Django/Jinja/Rails/Twig template
            "safe", "autoescape", "html_safe", "raw",
            // JS / browser / Angular
            "innerhtml", "outerhtml", "innertext", "insertadjacenthtml",
            "dangerouslysetinnerhtml", "v_html", "bypasssecuritytrusthtml",
            "document", "window",
            // SQL
            "execute", "executequery", "executeupdate", "executescript",
            "rawquery", "rawupdate", "createnativequery", "createquery",
            "preparestatement", "preparecall", "nativequery", "queryrow", "querycontext",
            // OS / shell / RCE
            "system", "execfile", "runtime", "getruntime", "processbuilder",
            "child_process", "spawn", "passthru", "shell_exec", "proc_open",
            "open3", "backticks", "command",
            // HTTP / XSS receivers
            "render", "format", "join", "path", "jdbctemplate", "entitymanager",
            "echo", "print", "printf", "writeln",
            // Go
            "fprintf", "fprintln", "fprint", "sprintf",
            // .NET
            "response", "binarywrite", "sqlcommand", "commandtext", "htmlraw",
            // Misc
            "loadclass", "forname",
            // Trust-boundary / request-attribute sinks (VALUE arg is the taint candidate)
            "setattribute", "setattributeNS", "setattr");

    /**
     * Common framework context receivers and language built-ins — they appear in
     * almost every extract but are almost never the actual tainted value.
     * Stored lowercase for case-insensitive lookup.
     */
    private static final Set<String> FRAMEWORK_HELPERS = Set.of(
            // Universal
            "request", "response", "self", "this", "cls", "kwargs", "args",
            "settings", "config", "logger", "log", "app", "db", "session",
            "os", "sys", "io", "re", "json", "cursor", "connection",
            // Go
            "ctx", "c", "w", "r",
            // Java
            "model", "req", "resp", "bindingresult", "exchange",
            "httpservletrequest", "httpservletresponse",
            // .NET
            "context", "httpcontext", "controller",
            // Ruby
            "params", "flash", "current_user",
            // JS
            "res", "next", "router", "middleware");

    private static final Set<String> IGNORED_TOKENS = Set.of(
            "self", "this", "true", "false", "none", "null", "nil", "undefined",
            "return", "if", "else", "elif", "for", "while", "def", "class",
            "const", "let", "var", "new", "import", "from", "as", "in", "is",
            "and", "or", "not", "await", "async", "yield", "try", "except",
            "catch", "finally", "with", "public", "private", "protected",
            "static", "final", "void", "int", "str", "string", "bool",
            "boolean", "float", "double", "long", "short", "byte", "char",
            "list", "dict", "set", "map", "interface", "struct", "type",
            "package", "func", "fn", "fun", "val");

    private static final Pattern IDENTIFIER_PATTERN = Pattern.compile("[A-Za-z_][A-Za-z0-9_]*");

    /** Optional PHP/Ruby sigil + dotted identifier (payload/query/command carrier). */
    private static final String ID =
            "[$@]?([A-Za-z_][A-Za-z0-9_]*(?:\\.[A-Za-z_][A-Za-z0-9_]*)*)";

    /**
     * Matches the inner argument of a safe-marking sink call like {@code mark_safe(expr)},
     * {@code innerHTML = expr}, etc. Used to extract the actual tainted expression
     * rather than the sink function name itself.
     */
    private static final Pattern SAFE_SINK_INNER_ARG = Pattern.compile(
            "mark_safe\\s*\\(\\s*([^)]+?)\\s*\\)"
            + "|format_html\\s*\\(\\s*([^,)]+?)\\s*[,)]"
            + "|html_safe\\s*\\(\\s*([^)]+?)\\s*\\)",
            Pattern.CASE_INSENSITIVE);

    /**
     * Captures the HTML/payload expression for XSS sinks across browser and server stacks.
     */
    private static final Pattern XSS_SINK_ARG_PATTERN = Pattern.compile(
            // Browser / SPA
            "(?:\\.innerHTML|\\.outerHTML|\\.insertAdjacentHTML)\\s*=\\s*" + ID
            + "|dangerouslySetInnerHTML\\s*=\\s*\\{\\s*(?:__html\\s*:\\s*)?" + ID
            + "|\\[(?:innerHTML|innerHtml)\\]\\s*=\\s*" + ID
            + "|\\bv-html\\s*=\\s*[\"']?" + ID
            + "|\\b(?:document\\.write|document\\.writeln|res\\.send|res\\.write|response\\.write|"
                    + "Response\\.Write|HttpResponse\\.Write)\\s*\\(\\s*" + ID
            // Python / Java helpers
            + "|\\b(?:mark_safe|format_html|HtmlUtils\\.htmlUnescape|bypassSecurityTrustHtml|"
                    + "getWriter\\(\\)\\.print|getWriter\\(\\)\\.write)\\s*\\(\\s*" + ID
            // PHP echo/print
            + "|\\b(?:echo|print|printf)\\s+" + ID
            // Rails / helpers (raw(x), x.html_safe)
            + "|\\b(?:raw|content_tag)\\s*\\(\\s*" + ID
            + "|\\b([A-Za-z_][A-Za-z0-9_]*)\\.html_safe\\b"
            // .NET
            + "|Html\\.Raw\\s*\\(\\s*" + ID
            + "|\\b(?:WriteLiteral|HtmlString)\\s*\\(\\s*" + ID
            // Go templates / writers
            + "|template\\.HTML\\s*\\(\\s*" + ID
            + "|\\bw\\.Write\\s*\\(\\s*(?:\\[\\]byte\\s*\\(\\s*)?" + ID,
            Pattern.CASE_INSENSITIVE);

    /**
     * Captures the command/argv expression for RCE sinks across major languages.
     */
    private static final Pattern COMMAND_SINK_ARG_PATTERN = Pattern.compile(
            // Java / Kotlin
            "\\b(?:Runtime\\.getRuntime\\s*\\(\\s*\\)\\s*\\.\\s*exec|ProcessBuilder)\\s*\\(\\s*" + ID
            + "|\\bnew\\s+ProcessBuilder\\s*\\(\\s*" + ID
            // Python — subprocess.X(...) positional, from-import run(...), and kwargs args=/cmd=
            + "|\\b(?:subprocess\\.(?:run|call|Popen|check_output|check_call)|os\\.system|os\\.popen)\\s*\\(\\s*" + ID
            + "|\\b(?:subprocess\\.(?:run|call|Popen|check_output|check_call)|(?<!\\.)\\brun)\\s*\\([^\\)]*\\b(?:args|cmd)\\s*=\\s*" + ID
            + "|\\b(?<!\\.)\\brun\\s*\\(\\s*" + ID
            // Node
            + "|\\bchild_process\\.(?:exec|execSync|spawn|spawnSync)\\s*\\(\\s*" + ID
            // PHP
            + "|\\b(?:passthru|shell_exec|proc_open|exec|system|popen)\\s*\\(\\s*" + ID
            // Go
            + "|\\bexec\\.Command(?:Context)?\\s*\\(\\s*" + ID
            // .NET
            + "|\\bProcess\\.Start\\s*\\(\\s*" + ID
            + "|\\bnew\\s+ProcessStartInfo\\s*\\(\\s*" + ID
            // Ruby
            + "|\\b(?:system|exec|spawn|Open3\\.(?:capture2|capture3|popen3))\\s*\\(\\s*" + ID
            + "|\\b%x\\s*\\{\\s*" + ID
            // Rust
            + "|\\bCommand\\s*::\\s*new\\s*\\(\\s*" + ID
            + "|\\.args\\s*\\(\\s*" + ID
            // Perl
            + "|\\bsystem\\s*\\(\\s*" + ID,
            Pattern.CASE_INSENSITIVE);

    /**
     * Matches dotted attribute access chains like {@code instance.glossary},
     * {@code self.instance.field}, {@code serializer.data}. The full chain is
     * a better taint candidate than just the root identifier.
     */
    private static final Pattern DOTTED_ACCESS_PATTERN = Pattern.compile(
            "\\b([A-Za-z_][A-Za-z0-9_]*(?:\\.[A-Za-z_][A-Za-z0-9_]*)+)\\b");

    /**
     * Captures the SQL/query argument expression of common sink APIs across languages.
     */
    private static final Pattern SQL_SINK_ARG_PATTERN = Pattern.compile(
            // Java / JDBC / JPA / Spring
            "\\b(?:createNativeQuery|createQuery|prepareStatement|prepareCall|"
                    + "execute(?:Query|Update|Script)?|jdbcTemplate\\.(?:query|queryForObject|queryForList|update|execute)|"
                    + "namedParameterJdbcTemplate\\.(?:query|update)|"
                    + "session\\.(?:createSQLQuery|createNativeQuery|createQuery)|"
                    + "entityManager\\.(?:createNativeQuery|createQuery))\\s*\\(\\s*" + ID
            // Python
            + "|\\b(?:cursor\\.execute|connection\\.execute|session\\.execute|sqlalchemy\\.text|"
                    + "engine\\.execute|raw\\()\\s*\\(\\s*" + ID
            // Node
            + "|\\b(?:sequelize\\.query|knex\\.raw|db\\.raw|pool\\.query|client\\.query|"
                    + "connection\\.query)\\s*\\(\\s*" + ID
            // PHP
            + "|\\b(?:mysqli_query|mysqli_real_query|pg_query|mysql_query)\\s*\\(\\s*" + ID
            + "|\\$(?:pdo|db|conn|wpdb)->(?:query|exec|get_results|get_var)\\s*\\(\\s*" + ID
            + "|->query\\s*\\(\\s*" + ID
            // Go
            + "|\\b(?:db|tx|conn)\\.(?:Query|QueryContext|QueryRow|QueryRowContext|Exec|ExecContext)\\s*\\(\\s*" + ID
            // Ruby / Rails
            + "|\\b(?:find_by_sql|execute|exec_query|select_all|where)\\s*\\(\\s*" + ID
            + "|\\bActiveRecord\\s*::\\s*Base\\.connection\\.execute\\s*\\(\\s*" + ID
            // .NET
            + "|\\b(?:SqlCommand|ExecuteReader|ExecuteNonQuery|ExecuteScalar|FromSqlRaw|FromSqlInterpolated|"
                    + "Database\\.ExecuteSqlRaw|Database\\.SqlQueryRaw)\\s*\\(\\s*" + ID
            // Rust
            + "|\\bsqlx\\s*::\\s*query(?:_as)?\\s*\\(\\s*" + ID
            + "|\\bdiesel\\s*::\\s*sql_query\\s*\\(\\s*" + ID
            // Generic
            + "|\\b(?:RawSQL|SqlQuery|executeSql|executescript)\\s*\\(\\s*" + ID,
            Pattern.CASE_INSENSITIVE);

    /** Leaves that are sink APIs, not taint carriers (used to filter dotted chains). */
    private static final Set<String> SINK_LEAVES = Set.of(
            "loads", "load", "decode", "unserialize", "readobject",
            "exec", "execute", "executequery", "executeupdate", "query", "queryrow",
            "innerhtml", "outerhtml", "insertadjacenthtml", "write", "writeln",
            "send", "system", "popen", "spawn", "html_safe", "raw", "echo", "print",
            "unlink", "rmdir", "rmtree", "remove", "removeall", "delete", "deleteifexists",
            "write_text", "write_bytes", "read_text", "read_bytes", "mkdir", "mkdirall", "makedirs",
            "rename", "replace", "move", "copy", "copy2", "copyfile", "copytree",
            "readallbytes", "readalltext", "writealltext", "writeallbytes",
            "newinputstream", "newoutputstream", "readfile", "writefile", "openfile",
            "remove_file", "create_dir",
            "setattribute", "setattr");

    /**
     * Captures the serialized-payload argument of unsafe deserialization APIs so taint
     * tracing follows {@code data} in {@code pickle.loads(data)} rather than {@code pickle.loads}.
     */
    private static final Pattern DESER_SINK_ARG_PATTERN = Pattern.compile(
            "\\b(?:pickle\\.loads?|yaml\\.load|marshal\\.loads?|jsonpickle\\.decode|"
                    + "unserialize|ObjectInputStream|BinaryFormatter|"
                    + "readObject|serde_json\\s*::\\s*from_str|gob\\.NewDecoder)\\s*\\(\\s*" + ID,
            Pattern.CASE_INSENSITIVE);

    /** Leaf method names that are deserialization sinks, not taint carriers. */
    private static final Set<String> DESER_SINK_LEAVES = Set.of(
            "loads", "load", "decode", "unserialize", "readobject");

    /**
     * Captures the path expression for filesystem sinks across languages so taint tracing
     * follows {@code shadow_file} in {@code Path(shadow_file).unlink()} / {@code Files.delete(path)}
     * rather than the sink API name.
     */
    private static final Pattern PATH_SINK_ARG_PATTERN = Pattern.compile(
            // Python pathlib.Path(x).unlink() / Path(x).write_text(...)
            "\\b(?:pathlib\\.)?Path\\s*\\(\\s*" + ID + "\\s*\\)\\s*\\.\\s*"
                    + "(?:unlink|rmdir|mkdir|open|write_text|write_bytes|read_text|read_bytes|"
                    + "rename|replace|chmod|touch|symlink_to|hardlink_to)\\b"
            + "|\\b(?:pathlib\\.)?Path\\s*\\(\\s*" + ID + "\\s*[,)]"
            + "|\\bos\\.(?:remove|unlink|rmdir|mkdir|makedirs|rename|replace|open)\\s*\\(\\s*" + ID
            + "|\\bshutil\\.(?:rmtree|move|copy|copy2|copyfile|copytree)\\s*\\(\\s*" + ID
            + "|\\bopen\\s*\\(\\s*" + ID
            // Node / JS
            + "|\\bfs(?:promises)?\\.(?:unlink|rm|rmdir|writeFile|writeFileSync|readFile|readFileSync|"
                    + "appendFile|appendFileSync|mkdir|mkdirSync|rename|renameSync|chmod|copyFile|"
                    + "copyFileSync|createReadStream|createWriteStream)\\s*\\(\\s*" + ID
            + "|\\bpath\\.(?:join|resolve|normalize)\\s*\\(\\s*" + ID
            + "|\\bfse?\\.(?:copy|copySync|move|moveSync|remove|removeSync|outputFile)\\s*\\(\\s*" + ID
            // Java / Kotlin NIO + IO
            + "|\\b(?:Paths\\.get|Path\\.of|Files\\.(?:delete|deleteIfExists|write|readAllBytes|readString|"
                    + "readAllLines|newInputStream|newOutputStream|newBufferedReader|newBufferedWriter|"
                    + "copy|move|createFile|createDirectory|createDirectories)|"
                    + "new\\s+File(?:InputStream|OutputStream|Reader|Writer)?|"
                    + "new\\s+RandomAccessFile|"
                    + "FileUtils\\.(?:readFileToString|writeStringToFile|copyFile|forceDelete|deleteQuietly|"
                    + "moveFile|openInputStream))\\s*\\(\\s*" + ID
            // .NET
            + "|\\b(?:File\\.(?:Delete|WriteAllText|WriteAllBytes|WriteAllLines|ReadAllText|ReadAllBytes|"
                    + "Open|OpenRead|OpenWrite|Move|Copy|AppendAllText|Exists)|"
                    + "Directory\\.(?:Delete|Move|CreateDirectory|Exists)|"
                    + "Path\\.(?:Combine|GetFullPath|GetFileName)|"
                    + "new\\s+FileStream|new\\s+StreamReader|new\\s+StreamWriter)\\s*\\(\\s*" + ID
            // Go
            + "|\\bos\\.(?:Remove|RemoveAll|Open|OpenFile|Create|Mkdir|MkdirAll|Rename|ReadFile|WriteFile)\\s*\\(\\s*" + ID
            + "|\\bioutil\\.(?:WriteFile|ReadFile|ReadDir)\\s*\\(\\s*" + ID
            + "|\\bfilepath\\.(?:Join|Clean|Abs|Rel|Walk)\\s*\\(\\s*" + ID
            // PHP
            + "|\\b(?:unlink|rmdir|fopen|file_get_contents|file_put_contents|readfile|mkdir|rename|copy|"
                    + "move_uploaded_file|scandir|opendir|glob|include|require|include_once|require_once)"
                    + "\\s*\\(\\s*" + ID
            // Ruby
            + "|\\b(?:File\\.(?:delete|unlink|read|write|open|rename|binread|binwrite)|"
                    + "FileUtils\\.(?:rm_rf|rm_r|mv|cp|cp_r|makedirs)|"
                    + "IO\\.(?:read|write|foreach)|Dir\\.(?:delete|rmdir|mkdir))\\s*\\(\\s*" + ID
            // Rust
            + "|\\b(?:std::fs::|tokio::fs::|fs::)(?:read|read_to_string|write|copy|rename|remove_file|"
                    + "remove_dir|remove_dir_all|create_dir|create_dir_all|OpenOptions)\\s*\\(\\s*" + ID
            + "|\\bFile\\s*::\\s*(?:open|create)\\s*\\(\\s*" + ID
            // Generic receiver.unlink() / .delete() where receiver is the path carrier
            + "|\\b" + ID + "\\s*\\.\\s*(?:unlink|rmdir|delete|deleteIfExists)\\s*\\(",
            Pattern.CASE_INSENSITIVE);

    /**
     * Captures the object argument of {@code pickle.dump}/{@code pickle.dumps}.
     * Serialize-only extracts are not CWE-502 load sinks; still identify the payload leaf.
     */
    private static final Pattern PICKLE_DUMP_ARG_PATTERN = Pattern.compile(
            "\\bpickle\\.dumps?\\s*\\(\\s*" + ID,
            Pattern.CASE_INSENSITIVE);

    /**
     * Captures the VALUE argument of trust-boundary sinks such as
     * {@code request.setAttribute(key, value)} / {@code session.setAttribute(key, value)} /
     * {@code attributes.put(key, value)} so taint tracing follows the stored value, not the key.
     */
    private static final Pattern ATTR_SINK_ARG_PATTERN = Pattern.compile(
            "\\b(?:request|req|session|httpSession|httpServletRequest)\\s*\\.\\s*setAttribute\\s*\\(\\s*[^,]+?,\\s*"
                    + ID + "(?:\\s*\\(\\s*\\))?"
            + "|\\.getSession\\s*\\(\\s*\\)\\s*\\.\\s*setAttribute\\s*\\(\\s*[^,]+?,\\s*"
                    + ID + "(?:\\s*\\(\\s*\\))?"
            + "|\\b(?:attributes|attr|requestAttributes)\\s*\\.\\s*put\\s*\\(\\s*[^,]+?,\\s*"
                    + ID + "(?:\\s*\\(\\s*\\))?"
            + "|\\bsetattr\\s*\\(\\s*[^,]+?,\\s*[^,]+?,\\s*" + ID,
            Pattern.CASE_INSENSITIVE);

    /**
     * Result of parsing a single flagged code extract.
     *
     * @param immediatelySafe      the extract is a string/number literal or null/boolean constant
     * @param immediatelyUntrusted an HTTP request accessor is directly visible in the extract
     * @param primaryCandidate     the most likely tainted identifier (first non-helper token), or null
     * @param allCandidates        all candidate identifiers in order of appearance, excluding sinks and framework helpers
     */
    public record SinkAnalysis(
            boolean immediatelySafe,
            boolean immediatelyUntrusted,
            String primaryCandidate,
            List<String> allCandidates
    ) {}

    /**
     * Analyses the flagged code extract and returns a {@link SinkAnalysis}.
     * Never throws; returns a conservative (not safe, not untrusted) result on any error.
     */
    public SinkAnalysis analyze(String codeExtract) {
        if (codeExtract == null || codeExtract.isBlank()) {
            return new SinkAnalysis(false, false, null, List.of());
        }

        boolean immediatelyUntrusted = IMMEDIATE_HTTP_PATTERN.matcher(codeExtract).find();
        String trimmed = codeExtract.trim();
        boolean immediatelySafe = !immediatelyUntrusted && SAFE_LITERAL_PATTERN.matcher(trimmed).matches();

        // Extract payload/query/command/path/attribute args from known sinks before generic token scraping
        String innerArg = extractSafeSinkInnerArg(codeExtract);
        String sqlArg = extractNamedSinkArg(SQL_SINK_ARG_PATTERN, codeExtract);
        String deserArg = extractNamedSinkArg(DESER_SINK_ARG_PATTERN, codeExtract);
        String xssArg = extractNamedSinkArg(XSS_SINK_ARG_PATTERN, codeExtract);
        String cmdArg = extractNamedSinkArg(COMMAND_SINK_ARG_PATTERN, codeExtract);
        String pathArg = extractNamedSinkArg(PATH_SINK_ARG_PATTERN, codeExtract);
        String attrArg = extractNamedSinkArg(ATTR_SINK_ARG_PATTERN, codeExtract);
        String pickleDumpArg = extractNamedSinkArg(PICKLE_DUMP_ARG_PATTERN, codeExtract);
        String preferredArg = firstNonNull(attrArg, xssArg, cmdArg, pathArg, deserArg, sqlArg);
        String extractLower = codeExtract.toLowerCase(Locale.ROOT);
        // Pickle dump/dumps alone: not a load sink. Prefer payload leaf (_data) over self._data chain.
        boolean pickleSerializeOnly = pickleDumpArg != null
                && deserArg == null
                && !extractLower.contains("pickle.loads")
                && !extractLower.contains("pickle.load(");
        if (preferredArg == null && pickleSerializeOnly) {
            preferredArg = leafIdentifier(pickleDumpArg);
            if (preferredArg == null) {
                preferredArg = pickleDumpArg;
            }
        }

        // Peel wrapper calls so primary is the payload, not the helper:
        // el.innerHTML = i18n.t(el.innerHTML) → el.innerHTML
        // cursor.execute(build(q)) → q
        String xssRhs = extractXssAssignmentRhs(codeExtract);
        if (xssRhs != null) {
            String unwrapped = unwrapPayloadExpression(xssRhs);
            if (unwrapped != null) {
                preferredArg = unwrapped;
            }
        } else if (preferredArg != null) {
            preferredArg = unwrapAroundCandidate(preferredArg, codeExtract);
        } else if (innerArg != null) {
            String unwrapped = unwrapPayloadExpression(innerArg);
            if (unwrapped != null) {
                preferredArg = unwrapped;
            }
        }

        // Collect dotted access from the payload expression when known, else full extract
        String dottedSource = preferredArg != null ? preferredArg
                : (innerArg != null ? innerArg : codeExtract);
        List<String> dottedCandidates = extractDottedAccess(dottedSource);
        if (pickleSerializeOnly) {
            dottedCandidates.removeIf(c -> {
                String lower = c.toLowerCase(Locale.ROOT);
                return lower.startsWith("self.") || lower.startsWith("this.");
            });
        }

        List<String> candidates = new ArrayList<>();
        if (preferredArg != null) {
            candidates.add(preferredArg);
        }
        if (innerArg != null) {
            String leaf = leafIdentifier(innerArg);
            if (leaf != null && !candidates.contains(leaf)) {
                candidates.add(leaf);
            }
        }
        candidates.addAll(dottedCandidates);
        var matcher = IDENTIFIER_PATTERN.matcher(codeExtract);
        while (matcher.find() && candidates.size() < 12) {
            String token = matcher.group();
            if (token.length() < 2) continue;
            String lower = token.toLowerCase(Locale.ROOT);
            if (IGNORED_TOKENS.contains(lower)) continue;
            if (KNOWN_SINK_NAMES.contains(lower)) continue;
            if (!candidates.contains(token)) {
                candidates.add(token);
            }
        }

        // Primary: dedicated sink-arg extractors first, then dotted access, then identifiers
        String primary = preferredArg;
        if (primary == null && innerArg != null) {
            primary = leafIdentifier(innerArg);
        }
        if (primary == null && !dottedCandidates.isEmpty()) {
            primary = dottedCandidates.get(0);
        }
        if (primary == null) {
            primary = candidates.stream()
                    .filter(c -> !FRAMEWORK_HELPERS.contains(c.toLowerCase(Locale.ROOT)))
                    .findFirst()
                    .orElse(candidates.isEmpty() ? null : candidates.get(0));
        }

        return new SinkAnalysis(immediatelySafe, immediatelyUntrusted, primary, List.copyOf(candidates));
    }

    private String extractNamedSinkArg(Pattern pattern, String codeExtract) {
        var matcher = pattern.matcher(codeExtract);
        if (!matcher.find()) {
            return null;
        }
        for (int g = 1; g <= matcher.groupCount(); g++) {
            String group = matcher.group(g);
            if (group != null && !group.isBlank()) {
                String token = group.trim();
                String lower = token.toLowerCase(Locale.ROOT);
                if (IGNORED_TOKENS.contains(lower) || KNOWN_SINK_NAMES.contains(lower)
                        || FRAMEWORK_HELPERS.contains(lower)) {
                    continue;
                }
                return token;
            }
        }
        return null;
    }

    private String extractSafeSinkInnerArg(String codeExtract) {
        var matcher = SAFE_SINK_INNER_ARG.matcher(codeExtract);
        if (matcher.find()) {
            for (int g = 1; g <= matcher.groupCount(); g++) {
                String group = matcher.group(g);
                if (group != null && !group.isBlank()) {
                    return group.trim();
                }
            }
        }
        return null;
    }

    private List<String> extractDottedAccess(String text) {
        List<String> result = new ArrayList<>();
        var matcher = DOTTED_ACCESS_PATTERN.matcher(text);
        while (matcher.find() && result.size() < 5) {
            String chain = matcher.group(1);
            String[] parts = chain.split("\\.");
            String rootLower = parts[0].toLowerCase(Locale.ROOT);
            String leafLower = parts[parts.length - 1].toLowerCase(Locale.ROOT);
            if (KNOWN_SINK_NAMES.contains(rootLower)) continue;
            // Skip sink APIs themselves (pickle.loads, el.innerHTML) — payload arg is traced separately
            if (SINK_LEAVES.contains(leafLower) || DESER_SINK_LEAVES.contains(leafLower)
                    || KNOWN_SINK_NAMES.contains(leafLower)) {
                continue;
            }
            if (!result.contains(chain)) {
                result.add(chain);
            }
        }
        return result;
    }

    private static String firstNonNull(String... values) {
        if (values == null) {
            return null;
        }
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return null;
    }

    private String leafIdentifier(String expression) {
        if (expression == null || expression.isBlank()) {
            return null;
        }
        var matcher = IDENTIFIER_PATTERN.matcher(expression);
        String last = null;
        while (matcher.find()) {
            String token = matcher.group();
            String lower = token.toLowerCase(Locale.ROOT);
            if (IGNORED_TOKENS.contains(lower) || KNOWN_SINK_NAMES.contains(lower)
                    || FRAMEWORK_HELPERS.contains(lower)) {
                continue;
            }
            last = token;
        }
        return last;
    }

    /**
     * RHS of browser XSS assignment sinks ({@code .innerHTML = …} / {@code .outerHTML = …}).
     */
    private String extractXssAssignmentRhs(String codeExtract) {
        if (codeExtract == null || codeExtract.isBlank()) {
            return null;
        }
        var matcher = Pattern.compile(
                "(?:\\.innerHTML|\\.outerHTML)\\s*=\\s*(.+)",
                Pattern.CASE_INSENSITIVE | Pattern.DOTALL).matcher(codeExtract.trim());
        if (!matcher.find()) {
            return null;
        }
        String rhs = matcher.group(1).trim();
        if (rhs.endsWith(";")) {
            rhs = rhs.substring(0, rhs.length() - 1).trim();
        }
        return rhs.isBlank() ? null : rhs;
    }

    /**
     * When {@code preferred} appears as a call in {@code extract}, unwrap to the first
     * non-literal argument; otherwise return {@code preferred} unchanged.
     */
    private String unwrapAroundCandidate(String preferred, String extract) {
        if (preferred == null || preferred.isBlank() || extract == null) {
            return preferred;
        }
        var matcher = Pattern.compile(Pattern.quote(preferred) + "\\s*\\(").matcher(extract);
        if (!matcher.find()) {
            return preferred;
        }
        int open = matcher.end() - 1;
        int close = findMatchingParen(extract, open);
        if (close < 0) {
            return preferred;
        }
        String callExpr = extract.substring(matcher.start(), close + 1);
        String unwrapped = unwrapPayloadExpression(callExpr);
        return unwrapped != null ? unwrapped : preferred;
    }

    /**
     * Peel {@code helper(payload)} / {@code obj.method(payload, …)} up to two hops so taint
     * tracing follows the payload operand rather than the wrapper callee.
     * Zero-arg calls ({@code cfg.getId()}) keep the callee as the candidate.
     */
    private String unwrapPayloadExpression(String expr) {
        if (expr == null || expr.isBlank()) {
            return null;
        }
        String current = expr.trim();
        if (current.endsWith(";")) {
            current = current.substring(0, current.length() - 1).trim();
        }
        String fallbackCallee = null;
        for (int hop = 0; hop < 2; hop++) {
            CallParts call = tryParseCall(current);
            if (call == null) {
                break;
            }
            fallbackCallee = call.callee;
            String arg = firstNonLiteralArg(call.argsRaw);
            if (arg == null || arg.isBlank()) {
                return toTaintCandidate(call.callee);
            }
            current = arg.trim();
        }
        String candidate = toTaintCandidate(current);
        if (candidate != null) {
            return candidate;
        }
        return fallbackCallee != null ? toTaintCandidate(fallbackCallee) : null;
    }

    private CallParts tryParseCall(String expr) {
        if (expr == null || expr.isBlank()) {
            return null;
        }
        String trimmed = expr.trim();
        var matcher = Pattern.compile(
                "^([$@]?[A-Za-z_][A-Za-z0-9_]*(?:\\.[A-Za-z_][A-Za-z0-9_]*)*)\\s*\\(")
                .matcher(trimmed);
        if (!matcher.find()) {
            return null;
        }
        int open = matcher.end() - 1;
        int close = findMatchingParen(trimmed, open);
        if (close < 0) {
            return null;
        }
        String after = trimmed.substring(close + 1).trim();
        if (!after.isEmpty()) {
            // foo(x).bar / chained — not a simple wrapper call
            return null;
        }
        return new CallParts(matcher.group(1), trimmed.substring(open + 1, close));
    }

    private static int findMatchingParen(String text, int openIdx) {
        if (text == null || openIdx < 0 || openIdx >= text.length() || text.charAt(openIdx) != '(') {
            return -1;
        }
        int depth = 0;
        boolean inSingle = false;
        boolean inDouble = false;
        boolean inBacktick = false;
        boolean escape = false;
        for (int i = openIdx; i < text.length(); i++) {
            char c = text.charAt(i);
            if (escape) {
                escape = false;
                continue;
            }
            if (c == '\\' && (inSingle || inDouble || inBacktick)) {
                escape = true;
                continue;
            }
            if (!inDouble && !inBacktick && c == '\'') {
                inSingle = !inSingle;
                continue;
            }
            if (!inSingle && !inBacktick && c == '"') {
                inDouble = !inDouble;
                continue;
            }
            if (!inSingle && !inDouble && c == '`') {
                inBacktick = !inBacktick;
                continue;
            }
            if (inSingle || inDouble || inBacktick) {
                continue;
            }
            if (c == '(') {
                depth++;
            } else if (c == ')') {
                depth--;
                if (depth == 0) {
                    return i;
                }
            }
        }
        return -1;
    }

    private String firstNonLiteralArg(String argsRaw) {
        if (argsRaw == null || argsRaw.isBlank()) {
            return null;
        }
        for (String arg : splitTopLevelArgs(argsRaw)) {
            String trimmed = arg.trim();
            if (trimmed.isEmpty()) {
                continue;
            }
            if (SAFE_LITERAL_PATTERN.matcher(trimmed).matches()) {
                continue;
            }
            return trimmed;
        }
        return null;
    }

    private List<String> splitTopLevelArgs(String argsRaw) {
        List<String> args = new ArrayList<>();
        if (argsRaw == null || argsRaw.isBlank()) {
            return args;
        }
        StringBuilder current = new StringBuilder();
        int depth = 0;
        boolean inSingle = false;
        boolean inDouble = false;
        boolean inBacktick = false;
        boolean escape = false;
        for (int i = 0; i < argsRaw.length(); i++) {
            char c = argsRaw.charAt(i);
            if (escape) {
                current.append(c);
                escape = false;
                continue;
            }
            if (c == '\\' && (inSingle || inDouble || inBacktick)) {
                current.append(c);
                escape = true;
                continue;
            }
            if (!inDouble && !inBacktick && c == '\'') {
                inSingle = !inSingle;
                current.append(c);
                continue;
            }
            if (!inSingle && !inBacktick && c == '"') {
                inDouble = !inDouble;
                current.append(c);
                continue;
            }
            if (!inSingle && !inDouble && c == '`') {
                inBacktick = !inBacktick;
                current.append(c);
                continue;
            }
            if (!inSingle && !inDouble && !inBacktick) {
                if (c == '(' || c == '[' || c == '{') {
                    depth++;
                    current.append(c);
                    continue;
                }
                if (c == ')' || c == ']' || c == '}') {
                    depth = Math.max(0, depth - 1);
                    current.append(c);
                    continue;
                }
                if (c == ',' && depth == 0) {
                    args.add(current.toString());
                    current.setLength(0);
                    continue;
                }
            }
            current.append(c);
        }
        if (!current.isEmpty() || !args.isEmpty()) {
            args.add(current.toString());
        }
        return args;
    }

    /**
     * Normalize an expression to a taint-tracking candidate. Allows DOM property chains
     * such as {@code document.body.innerHTML} (leaf may be a sink name when it is the payload).
     */
    private String toTaintCandidate(String expr) {
        if (expr == null || expr.isBlank()) {
            return null;
        }
        String trimmed = expr.trim();
        if (trimmed.endsWith(";")) {
            trimmed = trimmed.substring(0, trimmed.length() - 1).trim();
        }
        if (CLEAN_TAINT_CANDIDATE.matcher(trimmed).matches()) {
            String lower = trimmed.toLowerCase(Locale.ROOT);
            if (IGNORED_TOKENS.contains(lower) || FRAMEWORK_HELPERS.contains(lower)) {
                return null;
            }
            return trimmed;
        }
        var dotted = DOTTED_ACCESS_PATTERN.matcher(trimmed);
        if (dotted.find()) {
            return dotted.group(1);
        }
        return leafIdentifier(trimmed);
    }

    private static final Pattern CLEAN_TAINT_CANDIDATE = Pattern.compile(
            "^[$@]?[A-Za-z_][A-Za-z0-9_]*(?:\\.[A-Za-z_][A-Za-z0-9_]*)*$");

    private record CallParts(String callee, String argsRaw) {}
}
