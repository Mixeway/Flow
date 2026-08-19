package io.mixeway.mixewayflowapi.integrations.scanner.sast.service;

public enum PromptProfile {
    INJECTION,
    MISCONFIGURATION,
    WEAK_CRYPTO,
    LOGGING_LEAK,
    TIMING,
    SECRET_EXPOSURE,
    COOKIE_SECURITY,
    CONFIGURATION,
    DESERIALIZATION,
    XSS,
    PATH_TRAVERSAL,
    OPEN_REDIRECT,
    GENERAL
}
