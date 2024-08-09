package io.mixeway.mixewayflowapi.exceptions;

public class GitException
        extends InterruptedException {
    public GitException(String errorMessage) {
        super(errorMessage);
    }

}