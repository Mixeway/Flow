package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import io.mixeway.mixewayflowapi.integrations.scanner.sast.service.SourceOriginHunt.Slot;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class SourceOriginHuntTest {

    @Test
    void xssDomReadStillNeedsAWriterSearch() {
        assertTrue(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.XSS), Slot.VALUE, "dom_content", "TRUE_POSITIVE"));
    }

    @Test
    void xssUnknownSourceNeedsAWriterSearch() {
        assertTrue(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.XSS), Slot.VALUE, "unknown", "UNCERTAIN"));
        assertTrue(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.XSS), Slot.VALUE, "", "TRUE_POSITIVE"));
    }

    @Test
    void concreteChannelSkipsTheExtraSearch() {
        assertFalse(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.XSS), Slot.VALUE, "http_request", "TRUE_POSITIVE"));
        assertFalse(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.SQL_INJECTION), Slot.VALUE, "database", "UNCERTAIN"));
        assertFalse(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.OPEN_REDIRECT), Slot.VALUE, "url_fragment", "TRUE_POSITIVE"));
    }

    @Test
    void otherTaintFamiliesHuntOnlyWhenTheSourceIsUnknown() {
        assertTrue(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.SQL_INJECTION), Slot.VALUE, "unknown", "TRUE_POSITIVE"));
        assertTrue(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.PATH_TRAVERSAL), Slot.VALUE, "", "UNCERTAIN"));
        assertFalse(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.PATH_TRAVERSAL), Slot.VALUE, "dom_content", "TRUE_POSITIVE"));
    }

    @Test
    void nonTaintFamiliesAreNotHunted() {
        assertFalse(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.LOGGER_LEAK, false), Slot.VALUE, "unknown", "UNCERTAIN"));
        assertFalse(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.LOGGER_LEAK, false), Slot.ATTRIBUTE_NAME, "unknown", "UNCERTAIN"));
        assertFalse(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.GENERAL), Slot.VALUE, "unknown", "UNCERTAIN"));
        assertFalse(SourceOriginHunt.shouldHunt(null, Slot.VALUE, "unknown", "UNCERTAIN"));
    }

    @Test
    void codeInjectionSlotFollowsTheSink() {
        String setattr = "setattr(user, \"email\", request.POST[\"email\"])";
        String eval = "eval(request.GET[\"x\"])";
        assertEquals(Slot.ATTRIBUTE_NAME, Slot.of(true, CodeInjectionSinkEvidence.hasRealExecutionSink(setattr)));
        assertEquals(Slot.EXECUTED_CODE, Slot.of(true, CodeInjectionSinkEvidence.hasRealExecutionSink(eval)));
        assertEquals(Slot.VALUE, Slot.of(false, true));
    }

    @Test
    void attributeNameIsHuntedOnlyWhileItsOriginIsUnknown() {
        SastRuleMetadata codeInjection = meta(VulnerabilityFamily.COMMAND_INJECTION);
        assertTrue(SourceOriginHunt.shouldHunt(codeInjection, Slot.ATTRIBUTE_NAME, "unknown", "UNCERTAIN"));
        assertTrue(SourceOriginHunt.shouldHunt(codeInjection, Slot.ATTRIBUTE_NAME, "", "UNCERTAIN"));
        assertTrue(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.GENERAL), Slot.ATTRIBUTE_NAME, "unknown", "UNCERTAIN"));
        assertFalse(SourceOriginHunt.shouldHunt(codeInjection, Slot.ATTRIBUTE_NAME, "internal_call", "FALSE_POSITIVE"));
        assertFalse(SourceOriginHunt.shouldHunt(codeInjection, Slot.ATTRIBUTE_NAME, "http_request", "TRUE_POSITIVE"));
        assertFalse(SourceOriginHunt.shouldHunt(codeInjection, Slot.ATTRIBUTE_NAME, "config_file", "FALSE_POSITIVE",
                "setattr(obj, settings.FIELD, value)"));
    }

    @Test
    void executedCodeIsHuntedLikeAValue() {
        assertTrue(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.COMMAND_INJECTION), Slot.EXECUTED_CODE, "unknown", "UNCERTAIN"));
        assertTrue(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.GENERAL), Slot.EXECUTED_CODE, "", "UNCERTAIN"));
        assertFalse(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.COMMAND_INJECTION), Slot.EXECUTED_CODE, "http_request", "TRUE_POSITIVE"));
    }

    @Test
    void attributeNamePromptsNeverTraceTheValue() {
        String system = SourceOriginHunt.systemPrompt(Slot.ATTRIBUTE_NAME);
        String user = SourceOriginHunt.userPrompt(null, meta(VulnerabilityFamily.COMMAND_INJECTION),
                "unknown", "UNCERTAIN", "", Slot.ATTRIBUTE_NAME);
        assertTrue(system.contains("do not trace it"));
        assertTrue(user.contains("Do not search for the VALUE origin"));
        assertTrue(user.contains("2nd argument of setattr"));
        assertFalse(user.contains("assignments of the sink identifier"));
    }

    @Test
    void attributeNameRevisionJudgesTheNameNotTheValue() {
        String prompt = SourceOriginHunt.revisionPrompt("UNCERTAIN", "unknown",
                SourceOriginHunt.formatReport(true, "views.py:12 for key in request.POST", "none", "Keys from POST."),
                Slot.ATTRIBUTE_NAME);
        assertTrue(prompt.contains("Decide by the attribute NAME only"));
        assertTrue(prompt.contains("does not make this finding TRUE_POSITIVE"));
        assertTrue(prompt.contains("- FALSE_POSITIVE: NAME is a string literal"));
        assertTrue(prompt.contains("- TRUE_POSITIVE: NAME comes from request"));
        assertFalse(prompt.contains("controller of the value"));
    }

    @Test
    void revisionAsksForTheTraceEffectBeforeTheVerdict() {
        String prompt = SourceOriginHunt.revisionPrompt("FALSE_POSITIVE", "unknown", "Origin found: yes\n", Slot.ATTRIBUTE_NAME);
        assertTrue(prompt.contains("trace_effect (what the trace shows about who sets NAME"));
        assertTrue(prompt.indexOf("trace_effect") < prompt.indexOf("analysis, reasoning"));
        assertTrue(prompt.indexOf("analysis, reasoning") < prompt.indexOf("verdict, confidence"));
        assertTrue(prompt.contains("If trace_effect says nothing decisive changed, keep the previous verdict."));

        String noCaller = SourceOriginHunt.noCallerRevisionPrompt("build/demo/Sarissa.js", "none", "");
        assertTrue(noCaller.contains(FinalVerdictFormat.ORDER_RULE));
    }

    @Test
    void executedCodePromptsJudgeTheCodeString() {
        String user = SourceOriginHunt.userPrompt(null, meta(VulnerabilityFamily.COMMAND_INJECTION),
                "unknown", "UNCERTAIN", "", Slot.EXECUTED_CODE);
        String revision = SourceOriginHunt.revisionPrompt("UNCERTAIN", "unknown", "Origin found: yes\n", Slot.EXECUTED_CODE);
        assertTrue(user.contains("The sink executes code"));
        assertTrue(revision.contains("For this code-execution sink"));
        assertFalse(SourceOriginHunt.revisionPrompt("UNCERTAIN", "unknown", "Origin found: yes\n")
                .contains("code-execution sink"));
    }

    @Test
    void regexPatternFromUnknownSourceIsHunted() {
        SastRuleMetadata regex = meta(VulnerabilityFamily.REGEX_DOS);
        assertTrue(SourceOriginHunt.shouldHunt(regex, Slot.VALUE, "unknown", "UNCERTAIN"));
        assertFalse(SourceOriginHunt.shouldHunt(regex, Slot.VALUE, "http_request", "TRUE_POSITIVE"));
        assertTrue(SourceOriginHunt.userPrompt(null, regex, "unknown", "UNCERTAIN", "").contains("re.escape"));
    }

    @Test
    void openRedirectDomReadIsHunted() {
        assertTrue(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.OPEN_REDIRECT), Slot.VALUE, "dom_content", "TRUE_POSITIVE"));
    }

    @Test
    void frameworkSettingStillNeedsTheConfigFileAndItsWriter() {
        String settings = "subprocess.call(settings.PRE_CONSUME_SCRIPT, shell=True)";
        assertTrue(SourceOriginHunt.shouldHunt(
                meta(VulnerabilityFamily.COMMAND_INJECTION), Slot.VALUE, "config_file", "FALSE_POSITIVE", settings));
        assertTrue(SourceOriginHunt.configIndirection("config_file", settings));
        assertTrue(SourceOriginHunt.userPrompt(null, meta(VulnerabilityFamily.COMMAND_INJECTION),
                "config_file", "FALSE_POSITIVE", settings).contains("find_files (application*.yml"));
    }

    @Test
    void valueBindingStillNeedsTheConfigFileAndItsWriter() {
        String value = "@Value(\"${script.path}\") String scriptPath";
        assertTrue(SourceOriginHunt.shouldHunt(
                meta(VulnerabilityFamily.COMMAND_INJECTION), Slot.VALUE, "environment_variable", "UNCERTAIN", value));
        assertTrue(SourceOriginHunt.configIndirection("environment_variable", value));
    }

    @Test
    void namedConfigFileReadIsAlreadyASource() {
        String direct = "new FileInputStream(\"/etc/app/server.conf\")";
        assertFalse(SourceOriginHunt.shouldHunt(
                meta(VulnerabilityFamily.PATH_TRAVERSAL), Slot.VALUE, "config_file", "FALSE_POSITIVE", direct));
        assertFalse(SourceOriginHunt.shouldHunt(
                meta(VulnerabilityFamily.COMMAND_INJECTION), Slot.VALUE, "config_file", "FALSE_POSITIVE"));
        assertFalse(SourceOriginHunt.configIndirection("http_request", "settings.PRE_CONSUME_SCRIPT"));
    }

    @Test
    void editorDialogIsNotAFinishedXssSource() {
        assertTrue(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.XSS), Slot.VALUE, "gui_input", "TRUE_POSITIVE"));
        assertTrue(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.OPEN_REDIRECT), Slot.VALUE, "gui_input", "TRUE_POSITIVE"));
        assertFalse(SourceOriginHunt.shouldHunt(meta(VulnerabilityFamily.SQL_INJECTION), Slot.VALUE, "gui_input", "TRUE_POSITIVE"));
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
    void crossFileWriterWithoutImportDataFallsBackToSelfReport() {
        // No import data available for the finding's file: fall back to the model's self-reported
        // caller_verified, the weaker trust-based signal.
        assertFalse(SourceOriginHunt.traceIsUseful(true,
                "tracker.js reads trackerKey from process.env.REACT_APP_TRACKER_KEY",
                "packages/widgets/assets/tracker.js:12 trackerKey", 1,
                false, "packages/ui/components/externals/WidgetTracker/WidgetTracker.tsx", null));

        assertTrue(SourceOriginHunt.traceIsUseful(true,
                "WidgetTracker.tsx imports trackerKey from tracker.js, which reads process.env",
                "packages/widgets/assets/tracker.js:12 trackerKey", 1,
                true, "packages/ui/components/externals/WidgetTracker/WidgetTracker.tsx", ""));

        // Writer in the same file as the sink never needs caller_verified or import data.
        assertTrue(SourceOriginHunt.traceIsUseful(true, "dialog.js assigns link.url from the url field",
                "dialog.js:40", 0, false, "dialog.js", null));
    }

    @Test
    void crossFileWriterWithImportDataIsCheckedDeterministically() {
        // Regression for a WidgetTracker.tsx XSS finding: the hunt found trackerKey written from
        // process.env in an unrelated file (tracker.js) but the finding file's actual imports never
        // reference that file. The deterministic check must reject the trace EVEN THOUGH the model
        // self-reported caller_verified=true — a self-report that contradicts the real source is not
        // trusted once we have hard evidence to check it against.
        String widgetTrackerImports = "import React from 'react';\nimport { TrackerConfig } from './types';\n";
        assertFalse(SourceOriginHunt.traceIsUseful(true,
                "process.env.REACT_APP_TRACKER_KEY is read in tracker.js",
                "packages/widgets/assets/tracker.js:12 trackerKey", 1,
                true, "packages/ui/components/externals/WidgetTracker/WidgetTracker.tsx",
                widgetTrackerImports));

        // When the finding file's imports DO reference the writer's file, the trace is confirmed
        // deterministically — regardless of what the model claims for caller_verified.
        String importsTracker = "import { trackerKey } from '../../../widgets/assets/tracker';\n";
        assertTrue(SourceOriginHunt.traceIsUseful(true,
                "trackerKey is imported from tracker.js",
                "packages/widgets/assets/tracker.js:12 trackerKey", 1,
                false, "packages/ui/components/externals/WidgetTracker/WidgetTracker.tsx",
                importsTracker));
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
