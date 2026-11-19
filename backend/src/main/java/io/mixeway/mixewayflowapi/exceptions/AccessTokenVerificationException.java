package io.mixeway.mixewayflowapi.exceptions;

/**
 * Thrown when a new repository access token could not be confirmed to work against the repository.
 * The message is meant to be shown to the user.
 */
public class AccessTokenVerificationException extends RuntimeException {
    public AccessTokenVerificationException(String message) {
        super(message);
    }
}
