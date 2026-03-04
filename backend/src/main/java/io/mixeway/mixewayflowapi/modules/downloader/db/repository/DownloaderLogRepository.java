package io.mixeway.mixewayflowapi.modules.downloader.db.repository;

import io.mixeway.mixewayflowapi.modules.downloader.db.entity.DownloaderLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DownloaderLogRepository extends JpaRepository<DownloaderLog, Long> {
}