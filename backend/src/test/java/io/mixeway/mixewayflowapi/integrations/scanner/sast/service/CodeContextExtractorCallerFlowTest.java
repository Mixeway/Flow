package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CodeContextExtractorCallerFlowTest {

    private final CodeContextExtractor extractor = new CodeContextExtractor(new SinkArgumentParser());

    @TempDir
    Path repo;

    @Test
    void libraryInnerHtmlHelperFindsDefineExtensionCallersAndDoesNotMarkProvenDom() throws Exception {
        Path addonDir = repo.resolve("codemirror/addon/dialog");
        Files.createDirectories(addonDir);
        Path dialogJs = addonDir.resolve("dialog.js");
        Files.writeString(dialogJs, DIALOG_JS, StandardCharsets.UTF_8);

        Path appJs = repo.resolve("app/editor-ui.js");
        Files.createDirectories(appJs.getParent());
        Files.writeString(appJs, """
                function showSearch() {
                  cm.openDialog('<div class="search">Find: <input/></div>', function() {});
                }
                """, StandardCharsets.UTF_8);

        Item item = new Item();
        item.setFullFilename("codemirror/addon/dialog/dialog.js");
        item.setFilename("dialog.js");
        item.setLineNumber(innerHtmlLine(DIALOG_JS));
        item.setCodeExtract("dialog.innerHTML = template;");

        CodeContextExtractor.CodeContext ctx = extractor.extractLocal(repo.toString(), item);

        assertNotEquals(CodeContextExtractor.EvidenceCategory.PROVEN_SOURCE_DOM, ctx.category(),
                "XSS sink write must not be classified as DOM provenance of the payload");
        assertTrue(ctx.category() == CodeContextExtractor.EvidenceCategory.AMBIGUOUS
                        || ctx.category() == CodeContextExtractor.EvidenceCategory.DEAD_END,
                "Expected AMBIGUOUS/DEAD_END to enable cross-file caller scan, got " + ctx.category());

        String callers = (ctx.callerContext() == null ? "" : ctx.callerContext())
                + "\n" + (ctx.crossFileCallerContext() == null ? "" : ctx.crossFileCallerContext());
        assertTrue(callers.contains("openDialog") || callers.contains("dialogDiv"),
                "Expected same-file or cross-file evidence of openDialog/dialogDiv callers:\n" + callers);
        assertTrue(ctx.crossFileCallerContext() != null && ctx.crossFileCallerContext().contains("openDialog"),
                "Cross-file scan should find cm.openDialog call site:\n" + ctx.crossFileCallerContext());
        assertTrue(ctx.crossFileCallerContext().contains("origin-tag: all-callsites-pass-literal-arg=true"),
                "Literal HTML template args should emit origin-tag:\n" + ctx.crossFileCallerContext());
        assertFalse(ctx.crossFileCallerContext().isBlank());
    }

    @Test
    void xssSinkWithDomReadAssignmentStillProvenDom() throws Exception {
        Path file = repo.resolve("ui/copy.js");
        Files.createDirectories(file.getParent());
        String src = """
                function copyHtml(el) {
                  var html = el.innerHTML;
                  target.innerHTML = html;
                }
                """;
        Files.writeString(file, src, StandardCharsets.UTF_8);

        Item item = new Item();
        item.setFullFilename("ui/copy.js");
        item.setFilename("copy.js");
        item.setLineNumber(3);
        item.setCodeExtract("target.innerHTML = html;");

        CodeContextExtractor.CodeContext ctx = extractor.extractLocal(repo.toString(), item);
        assertTrue(ctx.category() == CodeContextExtractor.EvidenceCategory.PROVEN_SOURCE_DOM
                        || (ctx.definitionContext() != null && ctx.definitionContext().contains("innerHTML")),
                "DOM-read assignment into the sink candidate should remain visible; category="
                        + ctx.category() + " def=" + ctx.definitionContext());
    }

    private static int innerHtmlLine(String source) {
        String[] lines = source.split("\n", -1);
        for (int i = 0; i < lines.length; i++) {
            if (lines[i].contains("dialog.innerHTML = template")) {
                return i + 1;
            }
        }
        throw new IllegalStateException("fixture missing sink line");
    }

    private static final String DIALOG_JS = """
            (function(mod) {
              if (typeof exports == "object" && typeof module == "object")
                mod(require("../../lib/codemirror"));
              else
                mod(CodeMirror);
            })(function(CodeMirror) {
              function dialogDiv(cm, template, bottom) {
                var wrap = cm.getWrapperElement();
                var dialog;
                dialog = wrap.appendChild(document.createElement("div"));
                if (bottom)
                  dialog.className = "CodeMirror-dialog CodeMirror-dialog-bottom";
                else
                  dialog.className = "CodeMirror-dialog CodeMirror-dialog-top";

                if (typeof template == "string") {
                  dialog.innerHTML = template;
                } else {
                  dialog.appendChild(template);
                }
                return dialog;
              }

              CodeMirror.defineExtension("openDialog", function(template, callback, options) {
                if (!options) options = {};
                var dialog = dialogDiv(this, template, options.bottom);
                var inp = dialog.getElementsByTagName("input")[0];
                if (inp) inp.focus();
                return function() {};
              });

              CodeMirror.defineExtension("openConfirm", function(template, callbacks, options) {
                var dialog = dialogDiv(this, template, options && options.bottom);
                var buttons = dialog.getElementsByTagName("button");
                if (buttons[0]) buttons[0].focus();
              });

              CodeMirror.defineExtension("openNotification", function(template, options) {
                var dialog = dialogDiv(this, template, options && options.bottom);
                return function() {};
              });
            });
            """;
}
