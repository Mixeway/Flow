package io.mixeway.mixewayflowapi.exceptions;

/**
 * Raised when a new scan cannot start because a recent scan for the same repository is still in the throttle window.
 */
public class ScanThrottledException extends RuntimeException {

    public ScanThrottledException(String message) {
        super(message);
    }
}
