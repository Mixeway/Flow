package io.mixeway.mixewayflowapi.modules.downloader.db.mapper;

import io.mixeway.mixewayflowapi.modules.downloader.api.dto.DownloaderLogDto;
import io.mixeway.mixewayflowapi.modules.downloader.db.entity.DownloaderLog;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DownloaderLogMapper {
    DownloaderLogDto toDTO(DownloaderLog downloaderLog);
}
