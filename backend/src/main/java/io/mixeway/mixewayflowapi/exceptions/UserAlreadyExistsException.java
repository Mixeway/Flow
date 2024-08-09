package io.mixeway.mixewayflowapi.exceptions;

public class UserAlreadyExistsException
        extends RuntimeException {
    public UserAlreadyExistsException(String errorMessage) {
        super(errorMessage);
    }
}