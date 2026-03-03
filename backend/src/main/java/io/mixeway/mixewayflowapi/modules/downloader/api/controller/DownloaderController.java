package io.mixeway.mixewayflowapi.modules.downloader.api.controller;

import io.mixeway.mixewayflowapi.modules.downloader.api.dto.DownloaderApiMessage;
import io.mixeway.mixewayflowapi.modules.downloader.api.dto.DownloaderLogDto;
import io.mixeway.mixewayflowapi.modules.downloader.exception.InvalidDataForVulnerabilityException;
import io.mixeway.mixewayflowapi.modules.downloader.model.DownloaderVulnerability;
import io.mixeway.mixewayflowapi.modules.downloader.service.DownloaderLogService;
import io.mixeway.mixewayflowapi.modules.downloader.service.DownloaderReportMappingService;
import io.mixeway.mixewayflowapi.modules.downloader.service.DownloaderReportProcessingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Log4j2
public class DownloaderController {

    private final DownloaderReportMappingService downloaderReportMappingService;
    private final DownloaderLogService downloaderLogService;
    private final DownloaderReportProcessingService downloaderReportProcessingService;

    @PostMapping(value= "/api/v1/downloader/update")
    public ResponseEntity<DownloaderApiMessage> updateDatabase(@RequestBody String downloaderReport){
        if (downloaderReport == null)
            return ResponseEntity.badRequest().body(new DownloaderApiMessage("Downloader report cannot be null"));

        if (downloaderReport.isEmpty())
            return ResponseEntity.badRequest().body(new DownloaderApiMessage("Downloader report cannot be empty"));

        Map<String, DownloaderVulnerability> cves;
        try {
            cves = downloaderReportMappingService.parseReport(downloaderReport.trim());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new DownloaderApiMessage("Invalid JSON file"));
        }

        if (cves == null || cves.isEmpty())
            return ResponseEntity.badRequest().body(new DownloaderApiMessage("No CVEs found in the report"));

        try {
            long jobId = downloaderReportProcessingService.processCVEs(cves);
            downloaderLogService.saveDownloaderDataFile(String.valueOf(jobId), downloaderReport);

        } catch (InvalidDataForVulnerabilityException e) {
            return ResponseEntity.badRequest().body(
                    new DownloaderApiMessage(("Invalid data for Vulnerability: " + e.getVulnerabilityName() +". Problem: " + e.getMessage()))
            );
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(
                    new DownloaderApiMessage(("Error saving a file. Problem: " + e.getMessage()))
            );
        }

        return ResponseEntity.ok(new DownloaderApiMessage("Update of the database has started"));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping(value ="/api/v1/downloader/log")
    public ResponseEntity<List<DownloaderLogDto>> getDownloaderLogs(){
        return ResponseEntity.ok(downloaderLogService.getDownloaderLogs());
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping(value ="/api/v1/downloader/file", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> getDownloaderDataFile(@RequestParam String id){
        return ResponseEntity.ok(downloaderLogService.getDownloaderDataFile(id));
    }
}
