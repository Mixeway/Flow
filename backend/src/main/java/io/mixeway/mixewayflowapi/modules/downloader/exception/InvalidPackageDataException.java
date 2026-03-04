package io.mixeway.mixewayflowapi.modules.downloader.exception;

import lombok.Getter;

public class InvalidPackageDataException extends RuntimeException {

    @Getter private final String invalidEntry;

    public InvalidPackageDataException(String entry, String message) {
        super(message);
        invalidEntry = entry;
    }
}
