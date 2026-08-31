package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

class SastCwePromptGuidanceServiceTest {

    private final SastCwePromptGuidanceService service = new SastCwePromptGuidanceService();

    @Test
    void xssFamilyWithoutCweIdsStillGetsJsonAndSanitizerChecklist() {
        SastRuleMetadata metadata = new SastRuleMetadata(
                null,
                List.of(),
                VulnerabilityFamily.XSS,
                PromptProfile.XSS,
                PolicyProfile.XSS_CONTEXTUAL_ESCAPING,
                true,
                false,
                false);

        String guidance = service.buildGuidance(metadata);

        assertTrue(guidance.contains("JSON HTTP"), guidance);
        assertTrue(guidance.contains("DOMPurify"), guidance);
        assertTrue(guidance.contains("querySelector('script').remove()"), guidance);
        assertTrue(guidance.contains("allowedAttributes"), guidance);
        assertTrue(guidance.contains("UNCERTAIN"), guidance);
    }

    @Test
    void classifiedXssTitleGetsCwe79Checklist() {
        SastRuleClassifier classifier = new SastRuleClassifier(new SastRuleRegistry());
        io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item item =
                new io.mixeway.mixewayflowapi.integrations.scanner.sast.dto.Item();
        item.setTitle("Unsanitized user input in HTTP response (XSS)");

        SastRuleMetadata metadata = classifier.classify(item);

        String guidance = service.buildGuidance(metadata);

        assertTrue(metadata.cweIds().contains("79"), metadata.cweIds().toString());
        assertTrue(guidance.contains("CWE-79"), guidance);
        assertTrue(guidance.contains("JSON HTTP"), guidance);
    }

    @Test
    void permissionsCwe732DecodesBitsReachabilityAndContentClass() {
        SastRuleMetadata metadata = new SastRuleMetadata(
                "go_gosec_file_permissions_file_perm",
                List.of("732"),
                VulnerabilityFamily.PERMISSIONS,
                PromptProfile.MISCONFIGURATION,
                PolicyProfile.CONFIGURATION_REVIEW,
                false,
                false,
                false);

        String guidance = service.buildGuidance(metadata);

        assertTrue(guidance.contains("CWE-732"), guidance);
        assertTrue(guidance.contains("NOT world-writable"), guidance);
        assertTrue(guidance.contains("REACH the inode"), guidance);
        assertTrue(guidance.contains("Path reachability"), guidance);
        assertTrue(guidance.contains("public-by-design"), guidance);
        assertTrue(guidance.contains("G302"), guidance);
        assertTrue(guidance.contains("Go language review"), guidance);
        assertTrue(guidance.contains("not world-writable"), guidance);
        assertTrue(guidance.contains("rw-r--r--"), guidance);
        assertTrue(guidance.contains("git hook"), guidance);
    }

    @Test
    void goWeakHashRuleGetsProtocolAndImportChecklist() {
        SastRuleMetadata metadata = new SastRuleMetadata(
                "go_lang_weak_hash_sha1",
                List.of("328"),
                VulnerabilityFamily.WEAK_HASH,
                PromptProfile.WEAK_CRYPTO,
                PolicyProfile.WEAK_CRYPTO_STRICT,
                false,
                false,
                true);

        String guidance = service.buildGuidance(metadata);

        assertTrue(guidance.contains("CWE-328"), guidance);
        assertTrue(guidance.contains("Go language review"), guidance);
        assertTrue(guidance.contains("crypto/sha1"), guidance);
        assertTrue(guidance.contains("third-party protocol"), guidance);
        assertTrue(guidance.contains("Have I Been Pwned"), guidance);
        assertTrue(guidance.contains("Git object"), guidance);
        assertTrue(guidance.contains("HIBP"), guidance);
    }

    @Test
    void goCommandInjectionRuleTreatsExecCommandAsNonShell() {
        SastRuleMetadata metadata = new SastRuleMetadata(
                "go_gosec_injection_subproc_injection",
                List.of("78"),
                VulnerabilityFamily.COMMAND_INJECTION,
                PromptProfile.INJECTION,
                PolicyProfile.STRICT_SOURCE_TO_SINK,
                true,
                false,
                false);

        String guidance = service.buildGuidance(metadata);

        assertTrue(guidance.contains("exec.Command"), guidance);
        assertTrue(guidance.contains("developer tool CLI argv") || guidance.contains("cli_developer_tool"), guidance);
        assertTrue(guidance.contains("golangci-lint") || guidance.contains("os.Args"), guidance);
    }

    @Test
    void goMissingTlsMinVersionUsesCryptoTlsDefault() {
        SastRuleMetadata metadata = new SastRuleMetadata(
                "go_lang_missing_tls_minversion",
                List.of("327"),
                VulnerabilityFamily.WEAK_CRYPTO,
                PromptProfile.MISCONFIGURATION,
                PolicyProfile.TRANSPORT_SECURITY,
                false,
                false,
                false);

        String guidance = service.buildGuidance(metadata);

        assertTrue(guidance.contains("Go crypto/tls default MinVersion"), guidance);
        assertTrue(guidance.contains("Go language review"), guidance);
        assertTrue(guidance.contains("tls.Config"), guidance);
    }

    @Test
    void goXssRuleCoversHtmlTemplateAndHtmlutil() {
        SastRuleMetadata metadata = new SastRuleMetadata(
                "go_lang_cross_site_scripting",
                List.of("79"),
                VulnerabilityFamily.XSS,
                PromptProfile.XSS,
                PolicyProfile.XSS_CONTEXTUAL_ESCAPING,
                true,
                false,
                false);

        String guidance = service.buildGuidance(metadata);

        assertTrue(guidance.contains("html/template"), guidance);
        assertTrue(guidance.contains("HTMLFormat") || guidance.contains("htmlutil"), guidance);
        assertTrue(guidance.contains("bluemonday") || guidance.contains("NeedPostProcess"), guidance);
    }

    @Test
    void nonGoRuleDoesNotGetGoLanguageSection() {
        SastRuleMetadata metadata = new SastRuleMetadata(
                "javascript_lang_weak_hash_sha1",
                List.of("328"),
                VulnerabilityFamily.WEAK_HASH,
                PromptProfile.WEAK_CRYPTO,
                PolicyProfile.WEAK_CRYPTO_STRICT,
                false,
                false,
                true);

        String guidance = service.buildGuidance(metadata);

        assertTrue(guidance.contains("CWE-328"), guidance);
        org.junit.jupiter.api.Assertions.assertFalse(guidance.contains("Go language review"), guidance);
    }

    @Test
    void xssChecklistCoversSameOriginHtml() {
        SastRuleMetadata metadata = new SastRuleMetadata(
                "javascript_lang_xss_innerhtml",
                List.of("79"),
                VulnerabilityFamily.XSS,
                PromptProfile.XSS,
                PolicyProfile.XSS_CONTEXTUAL_ESCAPING,
                true,
                false,
                false);

        String guidance = service.buildGuidance(metadata);

        assertTrue(guidance.contains("same-origin HTML"), guidance);
        assertTrue(guidance.contains("server-rendered markup"), guidance);
        assertTrue(guidance.contains("html tagged template"), guidance);
        org.junit.jupiter.api.Assertions.assertFalse(guidance.contains("Go language review"), guidance);
    }

    @Test
    void tlsChecklistTreatsVersionMapAsOperatorConfig() {
        SastRuleMetadata metadata = new SastRuleMetadata(
                "go_lang_deprecated_tls_version",
                List.of("327"),
                VulnerabilityFamily.WEAK_CRYPTO,
                PromptProfile.MISCONFIGURATION,
                PolicyProfile.TRANSPORT_SECURITY,
                false,
                false,
                false);

        String guidance = service.buildGuidance(metadata);

        assertTrue(guidance.contains("TLS version map is not active downgrade"), guidance);
        assertTrue(guidance.contains("TLS 1.2+"), guidance);
    }

    @Test
    void ssrfChecklistFollowsSharedHttpClient() {
        SastRuleMetadata metadata = new SastRuleMetadata(
                "go_lang_ssrf",
                List.of("918"),
                VulnerabilityFamily.SSRF,
                PromptProfile.INJECTION,
                PolicyProfile.STRICT_SOURCE_TO_SINK,
                true,
                false,
                false);

        String guidance = service.buildGuidance(metadata);

        assertTrue(guidance.contains("only builds"), guidance);
        assertTrue(guidance.contains("host allow-list on HTTP client"), guidance);
        assertTrue(guidance.contains("webhookHTTPClient") || guidance.contains("shared webhook"), guidance);
    }

    @Test
    void originChecklistAcceptsEventSourceWindowCheck() {
        SastRuleMetadata metadata = new SastRuleMetadata(
                "javascript_lang_postmessage_origin",
                List.of("346"),
                VulnerabilityFamily.ACCESS_CONTROL,
                PromptProfile.GENERAL,
                PolicyProfile.CONFIGURATION_REVIEW,
                false,
                false,
                false);

        String guidance = service.buildGuidance(metadata);

        assertTrue(guidance.contains("event.source"), guidance);
        assertTrue(guidance.contains("non-secret payload"), guidance);
    }

    @Test
    void permissionsChecklistCoversUmaskOn0666() {
        SastRuleMetadata metadata = new SastRuleMetadata(
                "go_gosec_file_permissions_file_perm",
                List.of("732"),
                VulnerabilityFamily.PERMISSIONS,
                PromptProfile.MISCONFIGURATION,
                PolicyProfile.CONFIGURATION_REVIEW,
                false,
                false,
                false);

        String guidance = service.buildGuidance(metadata);

        assertTrue(guidance.contains("0o666") || guidance.contains("0666"), guidance);
        assertTrue(guidance.contains("umask"), guidance);
    }
}
