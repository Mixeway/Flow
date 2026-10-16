package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtVerificationRemediationTest {

    @Test
    void bareJwtDecodeWithoutKeyIsWeak() {
        assertTrue(JwtVerificationRemediation.looksLikeWeakRemediation(
                "payload = jwt.decode(token)"));
    }

    @Test
    void removeVerifySignatureOnlyIsWeak() {
        assertTrue(JwtVerificationRemediation.looksLikeWeakRecommendation(
                "Enable signature verification by removing the options={\"verify_signature\": False} parameter."));
    }

    @Test
    void decodeWithKeyAndAlgorithmsButWithoutExplicitVerifyTrueIsWeak() {
        assertTrue(JwtVerificationRemediation.looksLikeWeakRemediation("""
                payload = jwt.decode(
                    token,
                    key=JWT_SECRET,
                    algorithms=["HS256"],
                )
                """));
    }

    @Test
    void decodeWithKeyAlgorithmsAndVerifySignatureTrueIsNotWeak() {
        assertFalse(JwtVerificationRemediation.looksLikeWeakRemediation("""
                payload = jwt.decode(
                    token,
                    key=JWT_SECRET,
                    algorithms=["HS256"],
                    options={"verify_signature": True},
                )
                """));
    }

    @Test
    void extractsTokenVariableFromFlaggedExtract() {
        assertEquals("token", JwtVerificationRemediation.extractTokenVariable(
                "payload = jwt.decode(token, options={\"verify_signature\": False})"));
    }

    @Test
    void pythonRemediationIncludesKeyAlgorithmsAndExplicitVerifyTrue() {
        String fix = JwtVerificationRemediation.remediationCode("python",
                "payload = jwt.decode(token, options={\"verify_signature\": False})");
        assertTrue(fix.contains("key=JWT_SECRET"));
        assertTrue(fix.contains("algorithms="));
        assertTrue(fix.contains("\"verify_signature\": True"));
        assertTrue(fix.contains("token"));
        assertFalse(JwtVerificationRemediation.looksLikeWeakRemediation(fix));
    }

    @Test
    void javascriptRemediationUsesJwtVerify() {
        String fix = JwtVerificationRemediation.remediationCode("javascript",
                "const payload = jwt.decode(token, { complete: true });");
        assertTrue(fix.contains("jwt.verify"));
        assertTrue(fix.contains("algorithms"));
        assertFalse(JwtVerificationRemediation.looksLikeWeakRemediation(fix));
    }

    @Test
    void rubyRemediationPassesExplicitTrueVerifyArg() {
        String fix = JwtVerificationRemediation.remediationCode("ruby",
                "payload = JWT.decode(token, nil, false, algorithm: 'none')");
        assertTrue(fix.contains(", true,"));
        assertTrue(fix.contains("algorithm:"));
        assertFalse(JwtVerificationRemediation.looksLikeWeakRemediation(fix));
    }

    @Test
    void javaRemediationUsesParseClaimsJws() {
        String fix = JwtVerificationRemediation.remediationCode("java",
                "Jwts.parser().parseClaimsJwt(token);");
        assertTrue(fix.contains("parseClaimsJws"));
        assertTrue(fix.contains("setSigningKey"));
        assertFalse(JwtVerificationRemediation.looksLikeWeakRemediation(fix));
    }

    @Test
    void csharpRemediationRequiresSignedTokens() {
        String fix = JwtVerificationRemediation.remediationCode("csharp",
                "handler.ReadJwtToken(token);");
        assertTrue(fix.contains("RequireSignedTokens = true"));
        assertTrue(fix.contains("ValidateToken"));
        assertFalse(JwtVerificationRemediation.looksLikeWeakRemediation(fix));
    }

    @Test
    void phpAndGoRemediationsAreStrong() {
        assertFalse(JwtVerificationRemediation.looksLikeWeakRemediation(
                JwtVerificationRemediation.remediationCode("php", "JWT::decode($token, null);")));
        assertFalse(JwtVerificationRemediation.looksLikeWeakRemediation(
                JwtVerificationRemediation.remediationCode("go", "jwt.ParseUnverified(token, &claims)")));
    }
}
