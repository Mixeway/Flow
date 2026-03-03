package io.mixeway.mixewayflowapi.modules.downloader.service;

import io.mixeway.mixewayflowapi.modules.downloader.api.dto.DownloaderLogDto;
import io.mixeway.mixewayflowapi.modules.downloader.db.entity.DownloaderLog;
import io.mixeway.mixewayflowapi.modules.downloader.db.mapper.DownloaderLogMapper;
import io.mixeway.mixewayflowapi.modules.downloader.db.repository.DownloaderLogRepository;
import io.mixeway.mixewayflowapi.modules.downloader.exception.DownloaderFileCorruptedException;
import io.mixeway.mixewayflowapi.modules.downloader.exception.DownloaderFileNotExistsException;
import io.mixeway.mixewayflowapi.modules.downloader.model.DownloaderStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.List;

@Log4j2
@Service
@RequiredArgsConstructor
public class DownloaderLogService {

    @Value( "${downloader.path-name}" )
    private String downloaderDataFilePath;

    @Value( "${downloader.file-limit}" )
    private long downloaderDataFileLimit;

    private final DownloaderLogRepository downloaderLogRepository;
    private final DownloaderLogMapper downloaderLogMapper;

    public DownloaderLog logDataImportStart() {
        DownloaderLog log = new DownloaderLog(DownloaderStatus.IN_PROGRESS.name(), 0, 0);
        return downloaderLogRepository.save(log);
    }

    public DownloaderLog logDataImport(DownloaderStatus status, long processed, long error){
        DownloaderLog log = new DownloaderLog(status.name(), processed, error);
        return downloaderLogRepository.save(log);
    }

    public void updateLog(DownloaderLog log, DownloaderStatus status, long processed, long error){
        log.setStatus(status.name());
        log.setProcessed(processed);
        log.setError(error);

        downloaderLogRepository.save(log);
    }


    public List<DownloaderLogDto> getDownloaderLogs() {
        List<DownloaderLogDto> dtos = downloaderLogRepository.findAll().stream().map(downloaderLogMapper::toDTO).toList();
        dtos.forEach(dto -> dto.setFileExists(new File(System.getProperty("user.dir") + File.separator + downloaderDataFilePath + File.separator + dto.getId() + ".json").exists()));
        return dtos;
    }

    public void saveDownloaderDataFile(String id, String data) throws IOException {
        deleteOldDataFiles();
        Files.writeString(Path.of(System.getProperty("user.dir") + File.separator + downloaderDataFilePath + File.separator + id + ".json"), data);
    }

    private long countDataFiles() throws IOException {
        try (var stream = Files.list(Path.of(System.getProperty("user.dir") + File.separator + downloaderDataFilePath))) {
            return stream
                    .filter(Files::isRegularFile)
                    .count();
        }
    }

    private void deleteOldDataFiles() throws IOException {
        long noDataFiles = countDataFiles();
        if (noDataFiles >= downloaderDataFileLimit) {
            try (var stream = Files.list(Path.of(System.getProperty("user.dir") + File.separator + downloaderDataFilePath))) {

                List<Path> files = stream
                        .filter(Files::isRegularFile)
                        .filter(p -> p.getFileName().toString().endsWith(".json"))
                        .sorted(Comparator.comparingInt(this::extractNumber))
                        .toList();

                //adding 1 to the size ensures that after the save the number of files stays within limit
                long filesToDelete = files.size() - downloaderDataFileLimit + 1;

                for (int i = 0; i < filesToDelete; i++) {
                    Files.deleteIfExists(files.get(i));
                }
            }
        }
    }

    private int extractNumber(Path path) {
        String name = path.getFileName().toString();
        return Integer.parseInt(name.replace(".json", ""));
    }

    public String getDownloaderDataFile(String id) {
        File file = new File(System.getProperty("user.dir") + File.separator + downloaderDataFilePath + File.separator + id + ".json");
        if (!file.exists()) {
            throw new DownloaderFileNotExistsException("File not found", id);
        }
        try {
            return Files.readString(file.toPath());
        } catch (IOException e) {
            log.error("Error reading file {}", e.getMessage());
            throw new DownloaderFileCorruptedException("File is corrupted", id);
        }
    }
}
