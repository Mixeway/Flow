package io.mixeway.mixewayflowapi.integrations.ollama.service;

public record AiFpScanResult(int analyzedCount, int suppressedCount) {
    public static AiFpScanResult disabled() {
        return new AiFpScanResult(0, 0);
    }
}
