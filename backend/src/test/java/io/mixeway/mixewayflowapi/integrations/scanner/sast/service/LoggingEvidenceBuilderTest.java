package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class LoggingEvidenceBuilderTest {

    private final LoggingEvidenceBuilder builder = new LoggingEvidenceBuilder();

    @Test
    void validationErrorCurrencyIsGenericNonSensitive() {
        Item item = new Item();
        item.setTitle("Leakage of sensitive data in exception message");
        item.setCodeExtract("raise ValidationError({\"currency\": \"Invalid currency code.\"})");
        item.setFilename("saleor/graphql/account/i18n.py");

        FindingEvidence evidence = builder.build(item, null, exceptionMetadata());

        assertEquals("no_obvious_secret", evidence.attributes().get("data_sensitivity"));
        assertEquals("true", evidence.attributes().get("generic_validation_exception"));
        assertTrue(LoggingEvidenceBuilder.looksLikeGenericValidationException(item.getCodeExtract()));
    }

    @Test
    void apiKeyInExceptionRemainsSensitive() {
        Item item = new Item();
        item.setCodeExtract("raise Exception(f\"Invalid api_key={configuration['api_key']}\")");
        item.setFilename("saleor/plugins/sendgrid/plugin.py");

        FindingEvidence evidence = builder.build(item, null, exceptionMetadata());

        assertEquals("secret_or_pii_candidate", evidence.attributes().get("data_sensitivity"));
        assertFalse(LoggingEvidenceBuilder.hasNoObviousSecretContent(item.getCodeExtract()));
    }

    @Test
    void phoneInExceptionIsSensitiveVocabularyButSameUserValidationFeedback() {
        String code = "raise ValidationError({\"phone\": cleaned_input[\"phone\"]})";
        assertFalse(LoggingEvidenceBuilder.hasNoObviousSecretContent(code));
        assertTrue(LoggingEvidenceBuilder.looksLikeSameUserValidationFeedback(code));
    }

    @Test
    void passwordInValidationErrorIsNotSameUserFeedback() {
        assertFalse(LoggingEvidenceBuilder.looksLikeSameUserValidationFeedback(
                "raise ValidationError({\"password\": form.password})"));
    }

    @Test
    void phoneValidationEvidenceMarksSameUserAudience() {
        Item item = new Item();
        item.setTitle("Leakage of sensitive data in exception message");
        item.setCodeExtract("raise ValidationError({\"phone\": f\"'{phone}' is not a valid phone number.\"})");
        item.setFilename("app/graphql/account/i18n.py");

        FindingEvidence evidence = builder.build(item, null, exceptionMetadata());

        assertEquals("true", evidence.attributes().get("same_user_validation_feedback"));
        assertEquals("same_request_user", evidence.attributes().get("audience"));
    }

    @Test
    void bearerDescriptionEmailExampleDoesNotForceSensitive() {
        Item item = new Item();
        item.setTitle("Leakage of sensitive data in exception message");
        item.setDescription("Do not raise Exception(f\"User '{user.email}' is unauthorized\")");
        item.setCodeExtract("raise ValidationError({\"currency\": errors})");
        item.setFilename("saleor/graphql/account/i18n.py");

        FindingEvidence evidence = builder.build(item, null, exceptionMetadata());

        assertEquals("no_obvious_secret", evidence.attributes().get("data_sensitivity"));
        assertEquals("true", evidence.attributes().get("generic_validation_exception"));
    }

    private static SastRuleMetadata exceptionMetadata() {
        return new SastRuleMetadata(
                "python_lang_exception",
                List.of("200"),
                VulnerabilityFamily.EXCEPTION_LEAK,
                PromptProfile.LOGGING_LEAK,
                PolicyProfile.LOGGING_CONTENT_AND_AUDIENCE,
                false,
                true,
                true);
    }
}
