package io.mixeway.mixewayflowapi.modules.downloader.exception;

import lombok.Getter;

public class DownloaderFileNotExistsException extends RuntimeException {

    @Getter private final String fileName;

    public DownloaderFileNotExistsException(String error, String name) {
        super(error);
        fileName = name;
    }
}
