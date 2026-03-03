package io.mixeway.mixewayflowapi.modules.downloader.exception;

import lombok.Getter;

public class DownloaderFileCorruptedException extends RuntimeException {

    @Getter private final String fileName;

    public DownloaderFileCorruptedException(String error, String name) {
        super(error);
        fileName = name;
    }
}
