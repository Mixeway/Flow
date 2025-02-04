package io.mixeway.mixewayflowapi.exceptions;

public class CodeRepoNotFoundException extends RuntimeException {
    public CodeRepoNotFoundException(String message) {
        super(message);
    }
}