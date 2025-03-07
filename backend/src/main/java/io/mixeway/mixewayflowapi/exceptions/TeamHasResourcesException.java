package io.mixeway.mixewayflowapi.exceptions;

/**
 * Exception thrown when attempting to delete a team that has associated resources
 */
public class TeamHasResourcesException extends RuntimeException {
    public TeamHasResourcesException(String message) {
        super(message);
    }
}