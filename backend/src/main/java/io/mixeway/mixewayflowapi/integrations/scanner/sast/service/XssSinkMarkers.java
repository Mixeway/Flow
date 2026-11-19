package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import java.util.Locale;
import java.util.regex.Pattern;

/**
 * Canonical XSS sink / raw-HTML trust markers shared by context extraction, prompts, and gates.
 * Keep JS DOM sinks and server-side "skip escaping" markers in one place so recognition stays aligned.
 */
final class XssSinkMarkers {

    private XssSinkMarkers() {
    }

    /** LHS / write forms that emit HTML in the browser. */
    static final Pattern JS_HTML_WRITE = Pattern.compile(
            "(?:\\.innerHTML|\\.outerHTML)\\s*\\+?=|\\.insertAdjacentHTML\\s*\\(|document\\.write(?:ln)?\\s*\\("
                    + "|dangerouslySetInnerHTML|\\bv-html\\b|\\.html\\s*\\(\\s*[^)\\s]",
            Pattern.CASE_INSENSITIVE);

    /**
     * Trust / raw markers that skip framework auto-escaping (server templates and HTML helpers).
     * Presence alone is not a verdict — judge whether the value is untrusted.
     */
    static final Pattern SERVER_RAW_HTML = Pattern.compile(
            "\\bmark_safe\\b|\\bhtml_safe\\b|\\bHtml\\.Raw\\b|\\bIHtmlContent\\b|\\btemplate\\.HTML\\b"
                    + "|\\|\\s*safe\\b|\\|\\s*raw\\b|\\{!!|!!\\}|th:utext|\\[\\(|bypassSecurityTrustHtml"
                    + "|\\bSafeHtml\\b|\\bcontent_tag\\b|\\braw\\s*\\(|\\bMarkup\\s*\\(",
            Pattern.CASE_INSENSITIVE);

    /** Combined: any dangerous HTML emission or raw-trust marker worth treating as an XSS sink candidate. */
    static final Pattern ANY_XSS_SINK = Pattern.compile(
            JS_HTML_WRITE.pattern() + "|" + SERVER_RAW_HTML.pattern()
                    + "|\\becho\\s|\\bResponse\\.Write\\b|\\bResponse\\.WriteLine\\b|\\bprint\\s*\\(",
            Pattern.CASE_INSENSITIVE);

    /** Framework constructs that HTML-escape by default (independent of custom helpers). */
    static final Pattern FRAMEWORK_ESCAPE = Pattern.compile(
            "th:text\\b|\\[\\[|\\bc:out\\b|fn:escapeXml|escapeXml\\s*=\\s*[\"']?true"
                    + "|html/template|HTMLEscape|htmlspecialchars|htmlentities|ERB::Util\\.html_escape"
                    + "|\\|\\s*e\\b|\\|\\s*escape\\b|bleach\\.clean|DOMPurify\\.sanitize"
                    + "|AntiXss|HtmlEncoder|owasp\\.encoder|Encoder\\.forHtml"
                    + "|auto-?escap|autoescap",
            Pattern.CASE_INSENSITIVE);

    static boolean looksLikeXssSink(String text) {
        if (text == null || text.isBlank()) {
            return false;
        }
        return ANY_XSS_SINK.matcher(text).find()
                || text.toLowerCase(Locale.ROOT).contains("innerhtml")
                || text.toLowerCase(Locale.ROOT).contains("dangerouslysetinnerhtml");
    }

    static boolean hasFrameworkEscaping(String text) {
        return text != null && !text.isBlank() && FRAMEWORK_ESCAPE.matcher(text).find();
    }

    static boolean hasRawHtmlMarker(String text) {
        return text != null && !text.isBlank() && SERVER_RAW_HTML.matcher(text).find();
    }

    static boolean hasJsHtmlWrite(String text) {
        return text != null && !text.isBlank() && JS_HTML_WRITE.matcher(text).find();
    }
}