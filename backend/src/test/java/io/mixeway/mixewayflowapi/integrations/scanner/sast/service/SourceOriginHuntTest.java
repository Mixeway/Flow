package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class SourceOriginHuntTest {

    @Test
    void xssDomReadStillNeedsAWriterSearch() {
        assertTrue(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.XSS), false, "dom_content", "TRUE_POSITIVE"));
    }

    @Test
    void xssUnknownSourceNeedsAWriterSearch() {
        assertTrue(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.XSS), false, "unknown", "UNCERTAIN"));
        assertTrue(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.XSS), false, "", "TRUE_POSITIVE"));
    }

    @Test
    void concreteChannelSkipsTheExtraSearch() {
        assertFalse(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.XSS), false, "http_request", "TRUE_POSITIVE"));
        assertFalse(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.SQL_INJECTION), false, "database", "UNCERTAIN"));
        assertFalse(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.OPEN_REDIRECT), false, "url_fragment", "TRUE_POSITIVE"));
    }

    @Test
    void otherTaintFamiliesHuntOnlyWhenTheSourceIsUnknown() {
        assertTrue(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.SQL_INJECTION), false, "unknown", "TRUE_POSITIVE"));
        assertTrue(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.PATH_TRAVERSAL), false, "", "UNCERTAIN"));
        assertFalse(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.PATH_TRAVERSAL), false, "dom_content", "TRUE_POSITIVE"));
    }

    @Test
    void nonTaintAndCodeInjectionAreNotHunted() {
        assertFalse(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.LOGGER_LEAK, false), false, "unknown", "UNCERTAIN"));
        assertFalse(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.XSS), true, "unknown", "UNCERTAIN"));
        assertFalse(SourceOriginHunt.shouldHunt(null, false, "unknown", "UNCERTAIN"));
    }

    @Test
    void openRedirectDomReadIsHunted() {
        assertTrue(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.OPEN_REDIRECT), false, "dom_content", "TRUE_POSITIVE"));
    }

    @Test
    void frameworkSettingStillNeedsTheConfigFileAndItsWriter() {
        String settings = "subprocess.call(settings.PRE_CONSUME_SCRIPT, shell=True)";
        assertTrue(SourceOriginHunt.shouldHunt(
                meta(VulnerabilityFamily.COMMAND_INJECTION), false, "config_file", "FALSE_POSITIVE", settings));
        assertTrue(SourceOriginHunt.configIndirection("config_file", settings));
        assertTrue(SourceOriginHunt.userPrompt(null, meta(VulnerabilityFamily.COMMAND_INJECTION),
                "config_file", "FALSE_POSITIVE", settings).contains("application.yml"));
    }

    @Test
    void valueBindingStillNeedsTheConfigFileAndItsWriter() {
        String value = "@Value(\"${script.path}\") String scriptPath";
        assertTrue(SourceOriginHunt.shouldHunt(
                meta(VulnerabilityFamily.COMMAND_INJECTION), false, "environment_variable", "UNCERTAIN", value));
        assertTrue(SourceOriginHunt.configIndirection("environment_variable", value));
    }

    @Test
    void namedConfigFileReadIsAlreadyASource() {
        String direct = "new FileInputStream(\"/etc/app/server.conf\")";
        assertFalse(SourceOriginHunt.shouldHunt(
                meta(VulnerabilityFamily.PATH_TRAVERSAL), false, "config_file", "FALSE_POSITIVE", direct));
        assertFalse(SourceOriginHunt.shouldHunt(
                meta(VulnerabilityFamily.COMMAND_INJECTION), false, "config_file", "FALSE_POSITIVE"));
        assertFalse(SourceOriginHunt.configIndirection("http_request", "settings.PRE_CONSUME_SCRIPT"));
    }

    @Test
    void editorDialogIsNotAFinishedXssSource() {
        assertTrue(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.XSS), false, "gui_input", "TRUE_POSITIVE"));
        assertTrue(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.OPEN_REDIRECT), false, "gui_input", "TRUE_POSITIVE"));
        assertFalse(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.SQL_INJECTION), false, "gui_input", "TRUE_POSITIVE"));
    }

    @Test
    void usefulTraceRequiresANamedWriter() {
        assertTrue(SourceOriginHunt.traceIsUseful(true, "dialog.js assigns link.url from the url field", "dialog.js:40", 0));
        assertFalse(SourceOriginHunt.traceIsUseful(false, "", "", 0));
        assertFalse(SourceOriginHunt.traceIsUseful(false, "no writer", "unknown", 0));
        assertFalse(SourceOriginHunt.traceIsUseful(false, "Matches (20): plugin.js href", "", 3));
        assertFalse(SourceOriginHunt.traceIsUseful(true, "found something", "unknown", 2));
    }

    @Test
    void emptyAndErrorObservationsAreNotProductive() {
        assertFalse(SourceOriginHunt.productiveObservation("No matches found for pattern: href"));
        assertFalse(SourceOriginHunt.productiveObservation("File not found: missing.js"));
        assertTrue(SourceOriginHunt.productiveObservation("Matches (1):\nplugin.js:120: href = linkData.url\n"));
    }

    @Test
    void candidateSymbolsPreferDottedSinkValues() {
        List<String> symbols = SourceOriginHunt.candidateSymbols(
                "wrapInLink(img, shift.newData.link); doc.createElement('a', {attributes:{href: linkData.url}})");
        assertTrue(symbols.contains("shift.newData.link"));
        assertTrue(symbols.contains("linkData.url"));
        assertTrue(symbols.contains("wrapInLink"));
        assertTrue(symbols.contains("doc.createElement"));
    }

    @Test
    void reportKeepsTheWriterAndTheNeutralizer() {
        String report = SourceOriginHunt.formatReport(true, "image2/dialogs.js:40 url field",
                "link.js isUrlValid is not called from wrapInLink", "The dialog writes url into linkData.url.");
        assertTrue(report.contains("Origin found: yes"));
        assertTrue(report.contains("image2/dialogs.js:40"));
        assertTrue(report.contains("isUrlValid"));
        assertFalse(report.contains("ReAct"));
    }

    @Test
    void vendoredAndDemoPathsAreRecognized() {
        assertTrue(SourceOriginHunt.isVendoredOrDemoPath(
                "geoserver/build/cite/wms11/citewms-1.1/mbdemos/lib/util/sarissa/Sarissa.js"));
        assertTrue(SourceOriginHunt.isVendoredOrDemoPath("web/static/vendor/jquery.js"));
        assertTrue(SourceOriginHunt.isVendoredOrDemoPath("app\\node_modules\\lodash\\template.js"));
        assertTrue(SourceOriginHunt.isVendoredOrDemoPath("public/js/chart.min.js"));
        assertFalse(SourceOriginHunt.isVendoredOrDemoPath("src/main/java/org/geoserver/ows/AbstractURLPublisher.java"));
        assertFalse(SourceOriginHunt.isVendoredOrDemoPath("src/lib/render.js"));
        assertFalse(SourceOriginHunt.isVendoredOrDemoPath("build"));
    }

    @Test
    void emptyHuntRevisesOnlyUncertainVendoredFindings() {
        String sarissa = "geoserver/build/cite/wms11/citewms-1.1/mbdemos/lib/util/sarissa/Sarissa.js";
        assertTrue(SourceOriginHunt.shouldReviseWithoutCaller("UNCERTAIN", false, "", 4, sarissa));
        assertTrue(SourceOriginHunt.shouldReviseWithoutCaller("UNCERTAIN", false, "none", 2, sarissa));
        assertFalse(SourceOriginHunt.shouldReviseWithoutCaller("TRUE_POSITIVE", false, "", 4, sarissa));
        assertFalse(SourceOriginHunt.shouldReviseWithoutCaller("UNCERTAIN", false, "", 1, sarissa));
        assertFalse(SourceOriginHunt.shouldReviseWithoutCaller("UNCERTAIN", true, "", 4, sarissa));
        assertFalse(SourceOriginHunt.shouldReviseWithoutCaller("UNCERTAIN", false, "", 4, "src/app/render.js"));
    }

    @Test
    void noCallerPromptForbidsTruePositiveAndCapsConfidence() {
        String prompt = SourceOriginHunt.noCallerRevisionPrompt("build/demo/Sarissa.js", "none", "No caller of updateContentFromURI.");
        assertTrue(prompt.contains("Do not return TRUE_POSITIVE"));
        assertTrue(prompt.contains(String.valueOf(SourceOriginHunt.NO_CALLER_FP_MAX_CONFIDENCE)));
        assertTrue(prompt.contains("In-repo callers of the enclosing function: none"));
    }

    private static SastRuleMetadata meta(VulnerabilityFamily family) {
        return meta(family, true);
    }

    private static SastRuleMetadata meta(VulnerabilityFamily family, boolean requiresTaint) {
        return new SastRuleMetadata(
                "rule",
                List.of("79"),
                family,
                PromptProfile.GENERAL,
                PolicyProfile.STRICT_SOURCE_TO_SINK,
                requiresTaint,
                false,
                false);
    }
}
