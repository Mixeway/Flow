package io.mixeway.mixewayflowapi.exceptions;

public class TeamNotFoundException
        extends RuntimeException {

    public TeamNotFoundException(String errorMessage) {
        super(errorMessage);
    }

}