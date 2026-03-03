package io.mixeway.mixewayflowapi.modules.downloader.service;

import io.mixeway.mixewayflowapi.modules.downloader.api.gateway.DownloaderRavenGateway;
import io.mixeway.mixewayflowapi.modules.downloader.db.entity.DownloaderLog;
import io.mixeway.mixewayflowapi.modules.downloader.exception.InvalidDataForVulnerabilityException;
import io.mixeway.mixewayflowapi.modules.downloader.model.DownloaderStatus;
import io.mixeway.mixewayflowapi.modules.downloader.model.DownloaderVulnerability;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Log4j2
@Service
@RequiredArgsConstructor
public class DownloaderReportProcessingService {

    private final DownloaderRavenGateway downloaderRavenGateway;
    private final DownloaderLogService downloaderLogService;

    public long processCVEs(Map<String, DownloaderVulnerability> vulnerabilityData) {
        log.debug("Processing Vulnerabilities started");

        DownloaderLog processingLog = downloaderLogService.logDataImportStart();

        Set<DownloaderVulnerability> errors = new HashSet<>();
        vulnerabilityData.forEach((key, data) -> {
            log.debug("Processing Vulnerability: {} started", key);

            try {
                correctData(key, data);
                downloaderRavenGateway.createOrUpdateVulnerability(key, data);
                log.debug("Processing Vulnerability: {} finished", key);

            } catch (InvalidDataForVulnerabilityException e) {
                log.error("Error processing vulnerability {}", e.getMessage());
                errors.add(e.getVulnerabilityData());
            }
        });

        DownloaderStatus status = DownloaderStatus.SUCCESS;
        if(!errors.isEmpty()) status = DownloaderStatus.WARNING;

        downloaderLogService.updateLog(processingLog,
                status,
                vulnerabilityData.size()-errors.size(),
                errors.size());

        log.debug("Processing Vulnerabilities finished");

        return processingLog.getId();
    }

    private void correctData(String name, DownloaderVulnerability data) {
        if(data == null)
            throw new InvalidDataForVulnerabilityException(name, null, "Data cannot be null");

        if(name == null || name.isEmpty())
            throw new InvalidDataForVulnerabilityException(name, data, "Name/Key cannot be null or empty");

        if(data.getSeverity() == null)
            throw new InvalidDataForVulnerabilityException(name, data, "Severity cannot be null");
    }
}
