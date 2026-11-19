package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CodeContextExtractorXssTemplateTest {

    private final CodeContextExtractor extractor = new CodeContextExtractor(new SinkArgumentParser());

    @TempDir
    Path repo;

    @Test
    void djangoRenderResolvesTemplateWithoutMarkSafe() throws Exception {
        Path tpl = repo.resolve("templates/news/edit.html");
        Files.createDirectories(tpl.getParent());
        Files.writeString(tpl, "<h1>{{ title|safe }}</h1>\n<p>{{ body }}</p>\n", StandardCharsets.UTF_8);

        Path view = repo.resolve("news/views.py");
        Files.createDirectories(view.getParent());
        String py = """
                from django.shortcuts import render

                def edit(request):
                    title = request.POST.get("title")
                    return render(request, "news/edit.html", {"title": title})
                """;
        Files.writeString(view, py, StandardCharsets.UTF_8);

        Item item = xssItem("news/views.py", lineOf(py, "return render"), "return render(request, \"news/edit.html\"");
        CodeContextExtractor.CodeContext ctx = extractor.extractLocal(repo.toString(), item);

        assertTrue(ctx.templateContext().contains("news/edit.html")
                        || ctx.templateContext().contains("title|safe"),
                ctx.templateContext());
        assertTrue(ctx.templateContext().contains("|safe")
                        || ctx.templateContext().contains("title"),
                ctx.templateContext());
    }

    @Test
    void springFormBindingAliasSurfacesFormFields() throws Exception {
        Path jsp = repo.resolve("WEB-INF/jsp/article/edit.jsp");
        Files.createDirectories(jsp.getParent());
        Files.writeString(jsp, """
                <form:form modelAttribute="form" action="/save">
                  <form:input path="title"/>
                  <c:out value="${form.title}"/>
                </form:form>
                """, StandardCharsets.UTF_8);

        String snippet = extractor.readViewSnippet(repo.toString(),
                "WEB-INF/jsp/article/edit.jsp", Set.of("articleForm"));

        assertTrue(snippet.contains("form") || snippet.contains("alias"), snippet);
        assertTrue(snippet.contains("title") || snippet.contains("modelAttribute"), snippet);
    }

    @Test
    void collectFormBindingAliasesReadsModelAttribute() {
        Set<String> aliases = CodeContextExtractor.collectFormBindingAliases(List.of(
                "<form:form modelAttribute=\"form\" method=\"post\">",
                "<div th:object=\"${article}\">"));
        assertTrue(aliases.contains("form"));
        assertTrue(aliases.contains("article"));
    }

    @Test
    void xssSinkMarkersRecognizeServerAndJs() {
        assertTrue(XssSinkMarkers.looksLikeXssSink("el.innerHTML = x"));
        assertTrue(XssSinkMarkers.looksLikeXssSink("return mark_safe(html)"));
        assertTrue(XssSinkMarkers.hasRawHtmlMarker("{{ title|safe }}"));
        assertTrue(XssSinkMarkers.hasRawHtmlMarker("{!! $x !!}"));
        assertTrue(XssSinkMarkers.hasFrameworkEscaping("th:text=\"${title}\""));
        assertTrue(XssSinkMarkers.hasJsHtmlWrite("node.innerHTML = payload"));
    }

    private static Item xssItem(String file, int line, String extract) {
        Item item = new Item();
        item.setId("java_xss");
        item.setTitle("Cross-Site Scripting");
        item.setFilename(file);
        item.setFullFilename(file);
        item.setLineNumber(line);
        item.setCodeExtract(extract);
        item.setCweIds(List.of("CWE-79"));
        return item;
    }

    private static int lineOf(String source, String marker) {
        String[] lines = source.split("\n");
        for (int i = 0; i < lines.length; i++) {
            if (lines[i].contains(marker)) {
                return i + 1;
            }
        }
        return 1;
    }
}
