package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class SastDeveloperFacingReasoningTest {

    @Test
    void stripsScoringTaxonomyAndKeepsCodeFacts() {
        String raw = "Evidence category is PROVEN_SOURCE_UNTRUSTED — HTTP source is visible. "
                + "Execution context is web_server with input_source http_request. "
                + "RISKY SCHEME: SQL is concatenated from literals. TRUE_POSITIVE with mid confidence (~0.55). "
                + "origin-tag: all-callsites-pass-literal-arg=true. "
                + "The query is built with userName + \"' AND 1=1\".";

        String cleaned = SastDeveloperFacingReasoning.sanitize(raw);

        assertFalse(cleaned.contains("PROVEN_SOURCE_UNTRUSTED"), cleaned);
        assertFalse(cleaned.contains("execution_context"), cleaned);
        assertFalse(cleaned.contains("input_source"), cleaned);
        assertFalse(cleaned.contains("http_request"), cleaned);
        assertFalse(cleaned.contains("RISKY SCHEME"), cleaned);
        assertFalse(cleaned.contains("mid confidence"), cleaned);
        assertFalse(cleaned.contains("0.55"), cleaned);
        assertFalse(cleaned.contains("origin-tag"), cleaned);
        assertTrue(cleaned.contains("web server") || cleaned.contains("HTTP"), cleaned);
        assertTrue(cleaned.contains("userName"), cleaned);
    }

    @Test
    void mapsTrustedCliContextToPlainLanguage() {
        String cleaned = SastDeveloperFacingReasoning.sanitize(
                "Execution context is cli_developer_tool with input_source internal_call; untrusted input is not proven.");

        assertFalse(cleaned.contains("cli_developer_tool"), cleaned);
        assertFalse(cleaned.contains("internal_call"), cleaned);
        assertTrue(cleaned.toLowerCase().contains("developer command-line")
                || cleaned.toLowerCase().contains("internal application"), cleaned);
    }

    @Test
    void doesNotRewriteCodeIdentifiers() {
        String raw = "The handler reads config_file and copies http_request into dest. "
                + "internal_call() builds the path from file.filepath.";

        String cleaned = SastDeveloperFacingReasoning.sanitize(raw);

        assertTrue(cleaned.contains("config_file"), cleaned);
        assertTrue(cleaned.contains("http_request"), cleaned);
        assertTrue(cleaned.contains("internal_call()"), cleaned);
        assertTrue(cleaned.contains("file.filepath"), cleaned);
    }
}
