package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CryptoEvidenceBuilderTest {

    private final CryptoEvidenceBuilder builder = new CryptoEvidenceBuilder();

    @Test
    void asyncioSleepRandomRandintIsNonSecurity() {
        Item item = new Item();
        item.setTitle("Usage of weak Pseudo-Random Number Generator (PRNG)");
        item.setDescription("Do not use weak PRNG for tokens or keys.");
        item.setCodeExtract("await asyncio.sleep(random.randint(0, 5))");
        item.setFilename("saleor/asgi/usage_telemetry.py");

        FindingEvidence evidence = builder.build(item, null, randomMetadata());

        assertEquals("RANDOM", evidence.attributes().get("primitive"));
        assertEquals("non_security", evidence.attributes().get("security_purpose_hint"));
    }

    @Test
    void tokenGenerationRemainsSecuritySensitive() {
        Item item = new Item();
        item.setCodeExtract("session_token = ''.join(random.choice(alphabet) for _ in range(32))");
        item.setFilename("auth.py");

        FindingEvidence evidence = builder.build(item, null, randomMetadata());

        assertEquals("RANDOM", evidence.attributes().get("primitive"));
        assertEquals("security_sensitive", evidence.attributes().get("security_purpose_hint"));
    }

    @Test
    void bearerTokenBoilerplateDoesNotOverrideSleepJitter() {
        Item item = new Item();
        item.setTitle("Weak random used for security tokens");
        item.setDescription("Predictable tokens and session ids are insecure.");
        item.setCodeExtract("time.sleep(random.random() * jitter)");
        item.setFilename("worker.py");

        FindingEvidence evidence = builder.build(item, null, randomMetadata());

        assertEquals("non_security", evidence.attributes().get("security_purpose_hint"));
    }

    @Test
    void createFakeOrderRandomChoiceIsNonSecurityViaFilename() {
        Item item = new Item();
        item.setTitle("Usage of weak Pseudo-Random Number Generator (PRNG)");
        item.setDescription("Do not use weak PRNG for tokens or keys.");
        item.setCodeExtract("customer = random.choice(customers)");
        item.setFilename("saleor/core/utils/random_data.py");

        FindingEvidence evidence = builder.build(item, null, randomMetadata());

        assertEquals("RANDOM", evidence.attributes().get("primitive"));
        assertEquals("non_security", evidence.attributes().get("security_purpose_hint"));
        assertTrue(CryptoEvidenceBuilder.looksLikeNonSecurityRandomUse(
                item.getCodeExtract() + "\n" + item.getFilename()));
    }

    @Test
    void createFakeFunctionNameMarksNonSecurity() {
        assertTrue(CryptoEvidenceBuilder.looksLikeNonSecurityRandomUse(
                "def create_fake_order():\n    return random.randint(1, 10)"));
    }

    @Test
    void stripStringLiteralsDoesNotOverflowOnLargePythonFile() {
        StringBuilder source = new StringBuilder(400_000);
        source.append("def create_product_variants():\n");
        for (int i = 0; i < 8000; i++) {
            source.append("    name = \"value").append(i).append(" with 'quotes'\"\n");
            source.append("    label = 'item-").append(i).append(" with \"quotes\"'\n");
        }
        source.append("    quantity = random.randint(100, 500)\n");
        String stripped = CryptoEvidenceBuilder.stripStringLiterals(source.toString());
        assertTrue(stripped.contains("name = \"\""));
        assertTrue(CryptoEvidenceBuilder.looksLikeNonSecurityRandomUse(
                source + "\nsaleor/core/utils/random_data.py"));
    }

    @Test
    void md5CacheKeyIsPossiblyNonSecurity() {
        Item item = new Item();
        item.setTitle("Usage of weak hashing library (MDx)");
        item.setCodeExtract("""
                def create_app_cache_key_from_token(token: str) -> str:
                    return f"AppByTokenLoader:{hashlib.md5(token.encode('utf-8')).hexdigest()}"
                """);
        item.setFilename("app/graphql/app/dataloaders/app.py");

        FindingEvidence evidence = builder.build(item, null, hashMetadata());

        assertEquals("MD5/SHA1", evidence.attributes().get("primitive"));
        assertEquals("possibly_non_security", evidence.attributes().get("security_purpose_hint"));
    }

    @Test
    void md5QueryFingerprintIsPossiblyNonSecurity() {
        Item item = new Item();
        item.setCodeExtract("""
                def query_fingerprint(document):
                    query_hash = hashlib.md5(document.document_string.encode("utf-8")).hexdigest()
                    return f"{label}:{query_hash}"
                """);
        item.setFilename("app/graphql/utils/__init__.py");

        FindingEvidence evidence = builder.build(item, null, hashMetadata());

        assertEquals("possibly_non_security", evidence.attributes().get("security_purpose_hint"));
    }

    private static SastRuleMetadata hashMetadata() {
        return new SastRuleMetadata(
                "python_lang_weak_hash",
                List.of("328"),
                VulnerabilityFamily.WEAK_HASH,
                PromptProfile.WEAK_CRYPTO,
                PolicyProfile.WEAK_CRYPTO_STRICT,
                false,
                true,
                true);
    }

    private static SastRuleMetadata randomMetadata() {
        return new SastRuleMetadata(
                "python_lang_weak_random",
                List.of("330"),
                VulnerabilityFamily.INSUFFICIENT_RANDOM,
                PromptProfile.WEAK_CRYPTO,
                PolicyProfile.WEAK_CRYPTO_STRICT,
                false,
                true,
                true);
    }
}
