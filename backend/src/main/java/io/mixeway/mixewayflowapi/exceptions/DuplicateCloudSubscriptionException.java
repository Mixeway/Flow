package io.mixeway.mixewayflowapi.exceptions;

public class DuplicateCloudSubscriptionException extends RuntimeException {
    public DuplicateCloudSubscriptionException(String message) {
        super(message);
    }
}