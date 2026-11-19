package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ImmediateUntrustedSourceTest {

    private final SinkArgumentParser parser = new SinkArgumentParser();

    @ParameterizedTest
    @ValueSource(strings = {
            "'delete from t where id = '.$_GET['id']",
            "'delete from t where id = '.$_POST['id']",
            "'delete from t where id = '.$_COOKIE['sid']",
            "'delete from t where id = '.$_REQUEST['q']",
            "'delete from t where id = '.$_SERVER['HTTP_X']",
            "String sql = \"SELECT * FROM t WHERE x=\" + request.getHeader(\"X-Id\");",
            "@RequestHeader String auth",
            "@CookieValue String sid",
            "db.query(\"SELECT \" + req.headers['x-user'])",
            "db.query(\"SELECT \" + req.cookies.session)",
            "db.query(\"SELECT \" + request.COOKIES['a'])",
            "innerHTML = document.cookie"
    })
    void detectsImmediateHttpSources(String code) {
        assertTrue(parser.hasImmediateUntrustedSource(code), code);
    }

    @Test
    void rejectsTrustedLiteralsAndAppFields() {
        assertFalse(parser.hasImmediateUntrustedSource("stmt.execute(\"SELECT 1\")"));
        assertFalse(parser.hasImmediateUntrustedSource("String sql = \"CREATE INDEX \" + this.field;"));
        assertFalse(parser.hasImmediateUntrustedSource(null));
        assertFalse(parser.hasImmediateUntrustedSource("   "));
    }

    @Test
    void mutableSqlOperandsIncludeImmediateHttp() {
        CodeContextExtractor extractor = new CodeContextExtractor(parser);
        assertTrue(extractor.sqlConcatUsesMutableOrExternalOperands(
                "'delete from t where id = '.$_COOKIE['sid']"));
        assertTrue(extractor.sqlConcatUsesMutableOrExternalOperands(
                "String sql = \"SELECT * FROM t WHERE x=\" + request.getHeader(\"X-Id\");"));
        assertTrue(extractor.sqlConcatUsesMutableOrExternalOperands(
                "db.query('SELECT ' + req.cookies.session)"));
    }
}
