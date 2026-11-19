package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Regression for the origin-tag "all-callsites-pass-literal-arg" claim: it must reflect EVERY call
 * site of the enclosing function, not just the first N discovered within the rendering cap
 * (MAX_CALLER_SITES same-file / MAX_REPO_CALLER_SITES cross-file). Before this fix, a function with
 * more call sites than the cap could get a false "all literal" tag if the first few (in file order)
 * happened to pass literals while a later, untruncated call site passed tainted input.
 */
class CallSiteCapCompletenessTest {

    private final CodeContextExtractor extractor = new CodeContextExtractor(new SinkArgumentParser());

    @TempDir
    Path repo;

    @Test
    void sameFileOriginTagIsFalseWhenATaintedCallSiteExistsBeyondTheRenderCap() throws Exception {
        // 5 call sites in the same file (more than MAX_CALLER_SITES = 3): the first 4 pass literals,
        // the 5th (last, beyond where a naive cap-then-judge approach would stop) passes a parameter
        // sourced from an HTTP request. The tag must be false because NOT all call sites are literal.
        Path pkg = repo.resolve("app/sql");
        Files.createDirectories(pkg);
        Files.writeString(pkg.resolve("Runner.java"), """
                package app.sql;
                import javax.servlet.http.HttpServletRequest;
                public class Runner {
                    void run(String table) throws Exception {
                        String sql = "SELECT * FROM " + table;
                        stmt.execute(sql);
                    }
                    void caller1() throws Exception { run("users"); }
                    void caller2() throws Exception { run("orders"); }
                    void caller3() throws Exception { run("accounts"); }
                    void caller4() throws Exception { run("invoices"); }
                    void caller5(HttpServletRequest request) throws Exception {
                        run(request.getParameter("table"));
                    }
                    Statement stmt;
                    interface Statement { void execute(String sql) throws Exception; }
                }
                """, StandardCharsets.UTF_8);

        Item item = new Item();
        item.setFullFilename("app/sql/Runner.java");
        item.setFilename("Runner.java");
        item.setLineNumber(6);
        item.setCodeExtract("stmt.execute(sql);");

        CodeContextExtractor.CodeContext ctx = extractor.extractLocal(repo.toString(), item);
        String callers = (ctx.callerContext() == null ? "" : ctx.callerContext())
                + "\n" + (ctx.crossFileCallerContext() == null ? "" : ctx.crossFileCallerContext());

        assertFalse(callers.contains("origin-tag: all-callsites-pass-literal-arg=true"),
                "A tainted call site beyond the render cap must still suppress the all-literal "
                        + "origin-tag:\n" + callers);
    }

    @Test
    void crossFileOriginTagIsFalseWhenATaintedCallSiteExistsBeyondTheRenderCap() throws Exception {
        // One file importing the module with MANY literal call sites (> MAX_REPO_CALLER_SITES = 12)
        // plus one file (scanned after it in the fallback pass) with a single tainted call site.
        // The tag must be false even though far more than 12 literal call sites exist.
        Path pkg = repo.resolve("app/sql");
        Files.createDirectories(pkg);
        Files.writeString(pkg.resolve("ReportDao.java"), """
                package app.sql;
                public class ReportDao {
                    void runQuery(String table) throws Exception {
                        String sql = "SELECT * FROM " + table;
                        stmt.execute(sql);
                    }
                    Statement stmt;
                    interface Statement { void execute(String sql) throws Exception; }
                }
                """, StandardCharsets.UTF_8);

        StringBuilder manyLiteralCallers = new StringBuilder();
        manyLiteralCallers.append("package app.sql;\n");
        manyLiteralCallers.append("import app.sql.ReportDao;\n");
        manyLiteralCallers.append("public class ReportJobsLiteral {\n");
        manyLiteralCallers.append("    void jobs(ReportDao dao) throws Exception {\n");
        for (int i = 0; i < 20; i++) {
            manyLiteralCallers.append("        dao.runQuery(\"table_").append(i).append("\");\n");
        }
        manyLiteralCallers.append("    }\n");
        manyLiteralCallers.append("}\n");
        Files.writeString(pkg.resolve("ReportJobsLiteral.java"), manyLiteralCallers.toString(),
                StandardCharsets.UTF_8);

        Path otherPkg = repo.resolve("app/web");
        Files.createDirectories(otherPkg);
        Files.writeString(otherPkg.resolve("ReportController.java"), """
                package app.web;
                import app.sql.ReportDao;
                import javax.servlet.http.HttpServletRequest;
                public class ReportController {
                    void handle(ReportDao dao, HttpServletRequest request) throws Exception {
                        dao.runQuery(request.getParameter("table"));
                    }
                }
                """, StandardCharsets.UTF_8);

        Item item = new Item();
        item.setFullFilename("app/sql/ReportDao.java");
        item.setFilename("ReportDao.java");
        item.setLineNumber(5);
        item.setCodeExtract("stmt.execute(sql);");

        CodeContextExtractor.CodeContext ctx = extractor.extractLocal(repo.toString(), item);
        String callers = (ctx.callerContext() == null ? "" : ctx.callerContext())
                + "\n" + (ctx.crossFileCallerContext() == null ? "" : ctx.crossFileCallerContext());

        assertFalse(callers.contains("origin-tag: all-callsites-pass-literal-arg=true"),
                "A tainted cross-file call site must suppress the all-literal origin-tag even when "
                        + "more than MAX_REPO_CALLER_SITES literal call sites also exist:\n" + callers);
    }

    @Test
    void allLiteralAcrossManyCallSitesStillEmitsOriginTag() throws Exception {
        // Sanity check: when EVERY call site (more than the render cap) is genuinely literal, the
        // tag must still be emitted — this fix must not make the tag impossible to reach.
        Path pkg = repo.resolve("app/sql2");
        Files.createDirectories(pkg);
        Files.writeString(pkg.resolve("Runner2.java"), """
                package app.sql2;
                public class Runner2 {
                    void run(String table) throws Exception {
                        String sql = "SELECT * FROM " + table;
                        stmt.execute(sql);
                    }
                    void caller1() throws Exception { run("users"); }
                    void caller2() throws Exception { run("orders"); }
                    void caller3() throws Exception { run("accounts"); }
                    void caller4() throws Exception { run("invoices"); }
                    void caller5() throws Exception { run("payments"); }
                    Statement stmt;
                    interface Statement { void execute(String sql) throws Exception; }
                }
                """, StandardCharsets.UTF_8);

        Item item = new Item();
        item.setFullFilename("app/sql2/Runner2.java");
        item.setFilename("Runner2.java");
        item.setLineNumber(5);
        item.setCodeExtract("stmt.execute(sql);");

        CodeContextExtractor.CodeContext ctx = extractor.extractLocal(repo.toString(), item);
        String callers = (ctx.callerContext() == null ? "" : ctx.callerContext())
                + "\n" + (ctx.crossFileCallerContext() == null ? "" : ctx.crossFileCallerContext());

        assertTrue(callers.contains("origin-tag: all-callsites-pass-literal-arg=true"),
                "All-literal call sites (even beyond the render cap) should still emit the origin-tag:\n"
                        + callers);
    }
}
