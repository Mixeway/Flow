package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

public enum ExecutionContext {
    SERVER_SIDE,
    WEB_CLIENT,
    DESKTOP_GUI,
    CLI,
    TEST_CODE,
    UNKNOWN
}
