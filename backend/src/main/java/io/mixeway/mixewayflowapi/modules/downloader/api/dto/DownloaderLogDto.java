package io.mixeway.mixewayflowapi.modules.downloader.api.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DownloaderLogDto {

    private final long id;
    private LocalDateTime createdDate;
    private String status;
    private long processed;
    private long error;
    private boolean fileExists;
}
