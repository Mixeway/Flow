package io.mixeway.mixewayflowapi.exceptions;

public class CloudSubscriptionNotFoundException extends RuntimeException {
    public CloudSubscriptionNotFoundException(String message) {
        super(message);
    }
}