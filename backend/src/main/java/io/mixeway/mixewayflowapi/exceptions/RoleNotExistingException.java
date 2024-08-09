package io.mixeway.mixewayflowapi.exceptions;

public class RoleNotExistingException
        extends RuntimeException {
    public RoleNotExistingException(String errorMessage) {
        super(errorMessage);
    }

}