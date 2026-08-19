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
 * Regression: CreateIndexTransform-style findings must not get
 * origin-tag all-callsites-pass-literal-arg when SQL/DDL is built locally from fields.
 */
class SqlLocalConcatOriginTagTest {

    private final CodeContextExtractor extractor = new CodeContextExtractor(new SinkArgumentParser());

    @TempDir
    Path repo;

    @Test
    void detectsLocalCreateIndexConcatFromIdentifiers() {
        String body = """
                String tableName = item.getLayer().getResource().getNativeName();
                String indexName = tableName + "_" + field;
                String sql = "CREATE INDEX " + indexName + " ON " + tableName + " (" + field + ")";
                stmt.execute(sql);
                """;
        assertTrue(extractor.sqlBuiltLocallyFromIdentifierOperands(body));
    }

    @Test
    void pureLiteralSqlIsNotLocalIdentifierBuild() {
        assertFalse(extractor.sqlBuiltLocallyFromIdentifierOperands(
                "stmt.execute(\"SELECT 1 FROM dual\");"));
    }

    @Test
    void resultSetGetStringIsNotMutableSqlOperand() {
        String body = """
                try (ResultSet rs = stmt.executeQuery("SELECT * FROM geometry_columns "
                        + " WHERE f_table_name='" + unqualifiedTableName + "'")) {
                    while (rs.next()) {
                        spatialColumns.add(rs.getString("f_geometry_column"));
                    }
                }
                """;
        assertFalse(extractor.sqlConcatUsesMutableOrExternalOperands(body),
                "ResultSet.getString must not suppress trusted-source SQL concat risky-scheme scoring");
    }

    @Test
    void jsonGetStringIsMutableSqlOperand() {
        assertTrue(extractor.sqlConcatUsesMutableOrExternalOperands(
                "String sql = \"SELECT * FROM \" + json.getString(\"table\");"));
    }

    @Test
    void parameterSqlConcatWithLiteralCallSitesStillEmitsOriginTagForRiskyScheme() throws Exception {
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
        Files.writeString(pkg.resolve("ReportJobs.java"), """
                package app.sql;
                public class ReportJobs {
                    void jobs(ReportDao dao) throws Exception {
                        dao.runQuery("users");
                        dao.runQuery("orders");
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
        assertTrue(callers.contains("origin-tag: all-callsites-pass-literal-arg=true"),
                "Literal param call sites should emit origin-tag for risky-scheme scoring:\n" + callers);
        assertFalse(extractor.sqlConcatUsesMutableOrExternalOperands(
                (ctx.functionBody() == null ? "" : ctx.functionBody())));
    }

    @Test
    void createIndexTransformDoesNotEmitLiteralOriginTagDespiteLiteralCtorCallSites() throws Exception {
        Path pkg = repo.resolve("org/geoserver/importer/transform");
        Files.createDirectories(pkg);
        Path transform = pkg.resolve("CreateIndexTransform.java");
        Files.writeString(transform, CREATE_INDEX_TRANSFORM, StandardCharsets.UTF_8);

        Path usage = pkg.resolve("TransformExamples.java");
        Files.writeString(usage, """
                package org.geoserver.importer.transform;
                public class TransformExamples {
                    void demo() {
                        new CreateIndexTransform("STATE_NAME");
                        new CreateIndexTransform("the_geom");
                    }
                }
                """, StandardCharsets.UTF_8);

        Item item = new Item();
        item.setFullFilename("org/geoserver/importer/transform/CreateIndexTransform.java");
        item.setFilename("CreateIndexTransform.java");
        item.setLineNumber(sinkLine(CREATE_INDEX_TRANSFORM));
        item.setCodeExtract("stmt.execute(sql);");

        CodeContextExtractor.CodeContext ctx = extractor.extractLocal(repo.toString(), item);
        String callers = (ctx.callerContext() == null ? "" : ctx.callerContext())
                + "\n" + (ctx.crossFileCallerContext() == null ? "" : ctx.crossFileCallerContext());

        assertTrue(callers.contains("CreateIndexTransform") || callers.contains("STATE_NAME")
                        || callers.contains("the_geom") || callers.contains("createIndex"),
                "Expected constructor or same-file caller evidence:\n" + callers);
        assertFalse(callers.contains("origin-tag: all-callsites-pass-literal-arg=true"),
                "Local CREATE INDEX concat must suppress literal origin-tag:\n" + callers);
        assertTrue(extractor.sqlBuiltLocallyFromIdentifierOperands(
                (ctx.functionBody() == null ? "" : ctx.functionBody()) + "\n" + item.getCodeExtract()));
    }

    private static int sinkLine(String source) {
        String[] lines = source.split("\n", -1);
        for (int i = 0; i < lines.length; i++) {
            if (lines[i].contains("stmt.execute(sql)")) {
                return i + 1;
            }
        }
        throw new IllegalStateException("fixture missing sink line");
    }

    private static final String CREATE_INDEX_TRANSFORM = """
            package org.geoserver.importer.transform;

            public class CreateIndexTransform {
                private String field;

                public CreateIndexTransform(String field) {
                    this.field = field;
                }

                private void createIndex(ImportTask item, JDBCDataStore store) throws Exception {
                    Connection conn = store.getConnection(Transaction.AUTO_COMMIT);
                    Statement stmt = conn.createStatement();
                    String tableName = item.getLayer().getResource().getNativeName();
                    String indexName = tableName + "_" + field;
                    String sql = "CREATE INDEX " + indexName + " ON " + tableName + " (" + field + ")";
                    stmt.execute(sql);
                }

                interface ImportTask {
                    Layer getLayer();
                }
                interface Layer {
                    Resource getResource();
                }
                interface Resource {
                    String getNativeName();
                }
                interface JDBCDataStore {
                    Connection getConnection(Object tx);
                }
                interface Connection {
                    Statement createStatement();
                }
                interface Statement {
                    void execute(String sql);
                }
                enum Transaction { AUTO_COMMIT }
            }
            """;
}
