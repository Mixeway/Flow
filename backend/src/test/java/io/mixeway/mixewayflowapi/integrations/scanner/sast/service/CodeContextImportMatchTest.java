package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CodeContextImportMatchTest {

    @Test
    void stdlibImportDoesNotPullInSameNamedRepoFile() {
        String imports = "import subprocess\nfrom http.server import HTTPServer, SimpleHTTPRequestHandler\nimport typer";
        assertFalse(CodeContextExtractor.isImportedByStatic(imports, "fastapi/security/http.py"));
        assertFalse(CodeContextExtractor.isImportedByStatic("import http", "pkg/http.py"));
        assertFalse(CodeContextExtractor.isImportedByStatic("const http = require('http');", "src/http.js"));
        assertFalse(CodeContextExtractor.isImportedByStatic("import https from \"node:https\";", "lib/https.ts"));
    }

    @Test
    void repoImportOfAStdlibNamedModuleStillMatches() {
        assertTrue(CodeContextExtractor.isImportedByStatic("from fastapi.security import http", "fastapi/security/http.py"));
        assertTrue(CodeContextExtractor.isImportedByStatic("from . import logging", "app/logging.py"));
        assertTrue(CodeContextExtractor.isImportedByStatic("import http from './http';", "src/http.js"));
        assertTrue(CodeContextExtractor.isImportedByStatic("import fastapi.security.http", "fastapi/security/http.py"));
    }

    @Test
    void nonStdlibNamesAreMatchedAsBefore() {
        assertTrue(CodeContextExtractor.isImportedByStatic("from payments import invoices", "billing/invoices.py"));
        assertFalse(CodeContextExtractor.isImportedByStatic("from payments import invoices", "billing/utils.py"));
    }

    @Test
    void readFullyShownEarlierIsReplacedByANotice() {
        Set<String> shown = new HashSet<>();
        SastFindingVerificationService.rememberNumberedLines("intro\n10| a = 1\n11| b = a\n12| \n", shown);

        String notice = SastFindingVerificationService.alreadyShownReadObservation(
                "src/x.py (lines 10-12):\n10| a = 1\n11| b = a\n12| \n", shown);

        assertEquals("src/x.py (lines 10-12) is already shown verbatim above in this conversation. "
                + "Use those numbered lines; request a different range or file if you need more.", notice);
    }

    @Test
    void readWithAnyNewOrChangedLineIsKept() {
        Set<String> shown = new HashSet<>();
        SastFindingVerificationService.rememberNumberedLines("10| a = 1\n11| b = a\n", shown);

        assertNull(SastFindingVerificationService.alreadyShownReadObservation(
                "src/x.py (lines 10-12):\n10| a = 1\n11| b = a\n12| c = b\n", shown));
        assertNull(SastFindingVerificationService.alreadyShownReadObservation(
                "src/x.py (lines 10-11):\n10| a = 2\n11| b = a\n", shown));
        assertNull(SastFindingVerificationService.alreadyShownReadObservation("File not found: src/x.py", shown));
        assertNull(SastFindingVerificationService.alreadyShownReadObservation(
                "src/x.py (lines 10-11):\n10| a = 1\n11| b = a\n", new HashSet<>()));
    }
}
