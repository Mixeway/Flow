package io.mixeway.mixewayflowapi.exceptions;

public class QuotaExceededException extends RuntimeException {
    public QuotaExceededException(String message) {
        super(message);
    }
}