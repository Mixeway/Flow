package io.mixeway.mixewayflowapi.integrations.scanner.zap.service;
import org.zaproxy.clientapi.core.ApiResponse;
import org.zaproxy.clientapi.core.ApiResponseElement;
import org.zaproxy.clientapi.core.ClientApi;
import org.zaproxy.clientapi.core.ClientApiException;
import org.zaproxy.clientapi.core.ApiResponseSet;


import java.util.HashMap;
import java.util.Map;


import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import io.mixeway.mixewayflowapi.db.entity.CodeRepo;
import io.mixeway.mixewayflowapi.db.entity.CodeRepoBranch;
import jakarta.annotation.PreDestroy;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import io.mixeway.mixewayflowapi.db.entity.Finding;
import io.mixeway.mixewayflowapi.db.entity.Vulnerability;
import io.mixeway.mixewayflowapi.integrations.scanner.zap.dto.ZapReport;
import io.mixeway.mixewayflowapi.domain.vulnerability.GetOrCreateVulnerabilityService;
import io.mixeway.mixewayflowapi.domain.finding.CreateFindingService;







import java.io.*;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Log4j2
@RequiredArgsConstructor
public class ZAPService {
    private final ExecutorService executorService = Executors.newFixedThreadPool(10);
    private final CreateFindingService createFindingService;
    private final GetOrCreateVulnerabilityService getOrCreateVulnerabilityService;
    private final Object zapLock = new Object();
    private final Map<String, String> activeScanIds = new ConcurrentHashMap<>();


    @Data
    public static class ScanResult {
        private String scanId;
        private String status;
        private List<Alert> alerts;
    }

    @Data
    public static class Alert {
        private String risk;
        private String name;
        private String description;
        private String url;
    }



    /**
     * Run a ZAP scan for the given repository and branch
     *
     * @param repoDir Directory containing the repository code
     * @param codeRepo Repository information
     * @param codeRepoBranch Branch information
     * @return CompletableFuture with scan results
     */
    public CompletableFuture<ScanResult> runZapScan(String repoDir, CodeRepo codeRepo, CodeRepoBranch codeRepoBranch) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                log.info("[ZapService] Starting scan for repo: {}, branch: {}",
                        codeRepo.getName(), codeRepoBranch.getName());

                // Read configuration
                MixewayConfig config = readMixewayConfig(repoDir);

                // Check if config is empty (file was missing)
                if (config.getBackendUrl() == null && config.getOpenApiPath() == null && config.getWebappType() == null) {
                    log.error("[ZapService] Cannot proceed with scan for repo: {}, branch: {} - missing configuration file",
                            codeRepo.getName(), codeRepoBranch.getName());
                    ScanResult result = new ScanResult();
                    result.setScanId(UUID.randomUUID().toString());
                    result.setStatus("failed");
                    result.setAlerts(new ArrayList<>());
                    return result;
                }

                // Determine the webapp type with proper defaults
                String webappType = config.getWebappType();

                // Validate configuration based on webapp type
                if (webappType == null || webappType.isEmpty()) {
                    // No explicit type - determine based on available config
                    if (config.getBackendUrl() != null && !config.getBackendUrl().isEmpty()) {
                        if (config.getOpenApiPath() != null && !config.getOpenApiPath().isEmpty()) {
                            // Both backendUrl and openApiPath are present, default to API
                            webappType = "API";
                            log.info("[ZapService] No webappType specified, defaulting to API scan based on available config");
                        } else {
                            // Only backendUrl is present, default to WWW
                            webappType = "WWW";
                            log.info("[ZapService] No webappType specified, defaulting to WWW scan based on available config");
                        }
                    } else {
                        throw new IllegalArgumentException("backendUrl is required for all scan types");
                    }
                }

                // Validate required fields based on the determined type
                if ("API".equalsIgnoreCase(webappType)) {
                    if (config.getOpenApiPath() == null || config.getOpenApiPath().isEmpty()) {
                        throw new IllegalArgumentException("openApiPath is required for API scans");
                    }
                    if (config.getBackendUrl() == null || config.getBackendUrl().isEmpty()) {
                        throw new IllegalArgumentException("backendUrl is required for API scans");
                    }
                } else if ("WWW".equalsIgnoreCase(webappType)) {
                    if (config.getBackendUrl() == null || config.getBackendUrl().isEmpty()) {
                        throw new IllegalArgumentException("backendUrl is required for WWW scans");
                    }
                } else if ("API-WWW".equalsIgnoreCase(webappType)) {
                    // For API-WWW scans, backendUrl is required, openApiPath is optional but recommended
                    if (config.getBackendUrl() == null || config.getBackendUrl().isEmpty()) {
                        throw new IllegalArgumentException("backendUrl is required for API-WWW scans");
                    }
                    if (config.getOpenApiPath() == null || config.getOpenApiPath().isEmpty()) {
                        log.warn("[ZapService] openApiPath not provided for API-WWW scan - only WWW scan will be performed");
                    }
                } else {
                    throw new IllegalArgumentException("webappType must be 'API', 'WWW', or 'API-WWW'");
                }

                // Read OpenAPI spec for API and API-WWW scans
                String openApiSpec = null;
                if ("API".equalsIgnoreCase(webappType)) {
                    openApiSpec = readOpenApiSpec(repoDir, config.getOpenApiPath());

                    // If OpenAPI spec is required but not found, return a failed scan result
                    if (openApiSpec == null) {
                        log.error("[ZapService] Cannot proceed with API scan for repo: {}, branch: {} - missing OpenAPI specification",
                                codeRepo.getName(), codeRepoBranch.getName());
                        ScanResult result = new ScanResult();
                        result.setScanId(UUID.randomUUID().toString());
                        result.setStatus("failed");
                        result.setAlerts(new ArrayList<>());
                        return result;
                    }
                } else if ("API-WWW".equalsIgnoreCase(webappType)) {
                    // For API-WWW, try to read OpenAPI spec but don't fail if it's missing
                    if (config.getOpenApiPath() != null && !config.getOpenApiPath().isEmpty()) {
                        openApiSpec = readOpenApiSpec(repoDir, config.getOpenApiPath());
                        if (openApiSpec == null) {
                            log.warn("[ZapService] OpenAPI specification not found for API-WWW scan - proceeding with WWW scan only");
                        }
                    }
                }

                // Generate a unique context name for this scan
                String contextName = "Context-" + UUID.randomUUID().toString().substring(0, 8);

                // Run the scan using ZAP Java API with the unique context
                runZapScanWithJavaApi(openApiSpec, config.getBackendUrl(), repoDir, contextName, webappType);

                // Parse the JSON report to create a ScanResult and save findings
                File zapReportDir = new File(repoDir, "zap");
                File reportFile = new File(zapReportDir, "report.json");
                ScanResult result = parseZapReport(reportFile, codeRepo, codeRepoBranch);

                log.info("[ZapService] Completed {} scan for Target {}, repo: {}, branch: {}, found {} alerts",
                        webappType, config.getBackendUrl(), codeRepo.getName(), codeRepoBranch.getName(), result.getAlerts().size());

                return result;
            } catch (Exception e) {
                log.error("[ZapService] Scan failed for repo: {}, branch: {}",
                        codeRepo.getName(), codeRepoBranch.getName(), e);

                throw new RuntimeException("Scan failed: " + e.getMessage(), e);
            }
        }, executorService);
    }









    /**
     * Read the Mixeway configuration file
     *
     * @param repoDir Repository directory
     * @return MixewayConfig object
     * @throws IOException If the file cannot be read
     */
    private MixewayConfig readMixewayConfig(String repoDir) throws IOException {
        File configFile = new File(repoDir, "mixeway.yml");
        if (!configFile.exists()) {
            log.error("[ZapService] Configuration file mixeway.yml not found in {}", repoDir);
            // Return a default configuration or null
            return new MixewayConfig(); // Empty config with null fields
        }
        ObjectMapper yamlMapper = new ObjectMapper(new YAMLFactory());
        return yamlMapper.readValue(configFile, MixewayConfig.class);
    }

    /**
     * Read the OpenAPI specification file
     *
     * @param repoDir Repository directory
     * @param openApiPath Path to the OpenAPI spec file
     * @return OpenAPI specification as a string
     * @throws IOException If the file cannot be read
     */
    private String readOpenApiSpec(String repoDir, String openApiPath) throws IOException {
        File specFile = new File(repoDir, openApiPath);
        if (!specFile.exists()) {
            log.error("[ZapService] OpenAPI specification file not found at: {}", specFile.getAbsolutePath());
            return null;
        }
        return Files.readString(specFile.toPath());
    }

    /**
     * Run a ZAP scan using the Java API
     *
     * @param openApiSpec OpenAPI specification content
     * @param targetUrl Target URL to scan
     * @param repoDir Repository directory
     * @param containerName Name of the ZAP container to use
     */
    /**
     * Run a ZAP scan using the Java API with a unique context
     */

    private void runZapScanWithJavaApi(String openApiSpec, String targetUrl, String repoDir, String contextName, String webappType) {
        try {
            log.info("[ZapService] Running ZAP scan for target: {} using context: {}, scan type: {}",
                    targetUrl, contextName, webappType);

            // Initialize the ZAP API client (connecting to localhost on port 32807)
            ClientApi zapApi = new ClientApi("localhost", 32807, "12345");

            try {
                // Synchronize access to ZAP API for critical operations
                synchronized (zapLock) {
                    // Check if ZAP API is accessible
                    log.debug("[ZapService] Checking ZAP API connection...");
                    ApiResponseElement version = (ApiResponseElement) zapApi.core.version();
                    log.debug("[ZapService] ZAP version: {}", version.getValue());

                    // Create a new context with the unique name
                    log.debug("[ZapService] Creating new context: {}", contextName);
                    zapApi.context.newContext(contextName);

                    // Add the target URL to the context with a broader pattern
                    String urlPattern = targetUrl.replaceAll("(https?://[^/]+).*", "$1.*");
                    log.debug("[ZapService] Adding URL pattern to context {}: {}", contextName, urlPattern);
                    zapApi.context.includeInContext(contextName, urlPattern);

                    // Access the target URL to ensure it's in ZAP's sites tree
                    log.info("[ZapService] Accessing target URL to add it to the sites tree: {}", targetUrl);
                    zapApi.core.accessUrl(targetUrl, "GET");
                    Thread.sleep(2000); // Give ZAP time to process the URL

                    // Get the context ID properly
                    ApiResponse contextResponse = zapApi.context.context(contextName);
                    String contextId = null;
                    if (contextResponse instanceof ApiResponseElement) {
                        contextId = ((ApiResponseElement) contextResponse).getValue();
                    } else if (contextResponse instanceof ApiResponseSet) {
                        // For newer ZAP versions that return a set
                        ApiResponseSet responseSet = (ApiResponseSet) contextResponse;
                        contextId = responseSet.getStringValue("id");
                    }

                    // If this is an API scan, import the OpenAPI spec
                    if ("API".equalsIgnoreCase(webappType)) {
                        // Determine if the spec is JSON or YAML
                        boolean isJson = isJsonFormat(openApiSpec);
                        String fileExtension = isJson ? ".json" : ".yaml";
                        log.info("[ZapService] Detected OpenAPI spec format: {}", isJson ? "JSON" : "YAML");

                        // Create a unique filename for this scan
                        String specFileName = "openapi-spec-" + contextName + fileExtension;

                        // Create temp file with the spec content in a location accessible to ZAP
                        File tempFile = new File(System.getProperty("java.io.tmpdir"), specFileName);
                        Files.writeString(tempFile.toPath(), openApiSpec);
                        log.debug("[ZapService] Saved OpenAPI spec to: {}", tempFile.getAbsolutePath());

                        // Import the OpenAPI spec
                        log.info("[ZapService] Importing OpenAPI spec from: {}", tempFile.getAbsolutePath());
                        Map<String, String> importParams = new HashMap<>();
                        importParams.put("file", tempFile.getAbsolutePath());
                        importParams.put("target", targetUrl);

                        if (contextId != null) {
                            importParams.put("contextId", contextId);
                            log.debug("[ZapService] Using context ID: {}", contextId);
                        } else {
                            log.warn("[ZapService] Could not determine context ID, continuing without it");
                        }

                        ApiResponse importResponse = zapApi.callApi("openapi", "action", "importFile", importParams);
                        log.debug("[ZapService] Import response: {}", importResponse.toString());

                        // Wait for the import to complete
                        log.info("[ZapService] Waiting for OpenAPI import to complete...");
                        Thread.sleep(5000);

                        // Clean up temp file
                        tempFile.delete();
                    } else if ("WWW".equalsIgnoreCase(webappType)) {
                        // For WWW scans, we'll use the spider to discover content
                        log.info("[ZapService] Starting spider scan for WWW target: {}", targetUrl);

                        Map<String, String> spiderParams = new HashMap<>();
                        spiderParams.put("url", targetUrl);
                        spiderParams.put("contextName", contextName);
                        spiderParams.put("maxChildren", "0"); // Use default
                        spiderParams.put("recurse", "true");

                        ApiResponse spiderResponse = zapApi.callApi("spider", "action", "scan", spiderParams);
                        String spiderId = ((ApiResponseElement) spiderResponse).getValue();
                        log.info("[ZapService] Spider scan started with ID: {}", spiderId);

                        // Wait for spider to complete
                        int spiderProgress = 0;
                        while (spiderProgress < 100) {
                            Thread.sleep(2000);
                            ApiResponseElement statusResponse = (ApiResponseElement) zapApi.spider.status(spiderId);
                            spiderProgress = Integer.parseInt(statusResponse.getValue());
                            log.debug("[ZapService] Spider progress: {}%", spiderProgress);
                        }

                        log.info("[ZapService] Spider scan completed for: {}",targetUrl);

                        // Optional: AJAX Spider for modern web applications
                        log.info("[ZapService] Starting AJAX spider for WWW target: {}", targetUrl);
                        Map<String, String> ajaxParams = new HashMap<>();
                        ajaxParams.put("url", targetUrl);
                        ajaxParams.put("contextName", contextName);

                        try {
                            ApiResponse ajaxResponse = zapApi.callApi("ajaxSpider", "action", "scan", ajaxParams);
                            log.info("[ZapService] AJAX spider started: {}", ajaxResponse.toString());

                            // Wait for AJAX spider to complete
                            boolean ajaxRunning = true;
                            while (ajaxRunning) {
                                Thread.sleep(5000);
                                ApiResponseElement ajaxStatusResponse = (ApiResponseElement) zapApi.callApi(
                                        "ajaxSpider", "view", "status", null);
                                ajaxRunning = "running".equalsIgnoreCase(ajaxStatusResponse.getValue());
                                log.debug("[ZapService] AJAX spider status: {}", ajaxStatusResponse.getValue());
                            }

                            log.info("[ZapService] AJAX spider completed for: {}", targetUrl);
                        } catch (Exception e) {
                            log.warn("[ZapService] AJAX spider failed or not available: {}", e.getMessage());
                        }
                    }
                    else if ("API-WWW".equalsIgnoreCase(webappType)) {
                        // For API-WWW, perform both WWW scan first, then API scan
                        log.info("[ZapService] Starting combined API-WWW scan for target: {}", targetUrl);

                        // Phase 1: Perform WWW scan
                        log.info("[ZapService] Phase 1: Performing WWW scan...");

                        // Spider scan
                        log.info("[ZapService] Starting spider scan for WWW target: {}", targetUrl);
                        Map<String, String> spiderParams = new HashMap<>();
                        spiderParams.put("url", targetUrl);
                        spiderParams.put("contextName", contextName);
                        spiderParams.put("maxChildren", "0");
                        spiderParams.put("recurse", "true");

                        ApiResponse spiderResponse = zapApi.callApi("spider", "action", "scan", spiderParams);
                        String spiderId = ((ApiResponseElement) spiderResponse).getValue();
                        log.info("[ZapService] Spider scan started with ID: {}", spiderId);

                        // Wait for spider to complete
                        int spiderProgress = 0;
                        while (spiderProgress < 100) {
                            Thread.sleep(2000);
                            ApiResponseElement statusResponse = (ApiResponseElement) zapApi.spider.status(spiderId);
                            spiderProgress = Integer.parseInt(statusResponse.getValue());
                            log.debug("[ZapService] Spider progress: {}%", spiderProgress);
                        }
                        log.info("[ZapService] Spider scan completed for: {}", targetUrl);

                        // AJAX Spider
                        log.info("[ZapService] Starting AJAX spider for WWW target: {}", targetUrl);
                        Map<String, String> ajaxParams = new HashMap<>();
                        ajaxParams.put("url", targetUrl);
                        ajaxParams.put("contextName", contextName);

                        try {
                            ApiResponse ajaxResponse = zapApi.callApi("ajaxSpider", "action", "scan", ajaxParams);
                            log.info("[ZapService] AJAX spider started: {}", ajaxResponse.toString());

                            boolean ajaxRunning = true;
                            while (ajaxRunning) {
                                Thread.sleep(5000);
                                ApiResponseElement ajaxStatusResponse = (ApiResponseElement) zapApi.callApi(
                                        "ajaxSpider", "view", "status", null);
                                ajaxRunning = "running".equalsIgnoreCase(ajaxStatusResponse.getValue());
                                log.debug("[ZapService] AJAX spider status: {}", ajaxStatusResponse.getValue());
                            }
                            log.info("[ZapService] AJAX spider completed for: {}", targetUrl);
                        } catch (Exception e) {
                            log.warn("[ZapService] AJAX spider failed or not available: {}", e.getMessage());
                        }

                        // Phase 2: Perform API scan if OpenAPI spec is provided
                        if (openApiSpec != null && !openApiSpec.trim().isEmpty()) {
                            log.info("[ZapService] Phase 2: Performing API scan...");

                            boolean isJson = isJsonFormat(openApiSpec);
                            String fileExtension = isJson ? ".json" : ".yaml";
                            log.info("[ZapService] Detected OpenAPI spec format: {}", isJson ? "JSON" : "YAML");

                            String specFileName = "openapi-spec-" + contextName + fileExtension;
                            File tempFile = new File(System.getProperty("java.io.tmpdir"), specFileName);
                            Files.writeString(tempFile.toPath(), openApiSpec);
                            log.debug("[ZapService] Saved OpenAPI spec to: {}", tempFile.getAbsolutePath());

                            log.info("[ZapService] Importing OpenAPI spec from: {}", tempFile.getAbsolutePath());
                            Map<String, String> importParams = new HashMap<>();
                            importParams.put("file", tempFile.getAbsolutePath());
                            importParams.put("target", targetUrl);

                            if (contextId != null) {
                                importParams.put("contextId", contextId);
                                log.debug("[ZapService] Using context ID: {}", contextId);
                            } else {
                                log.warn("[ZapService] Could not determine context ID, continuing without it");
                            }

                            ApiResponse importResponse = zapApi.callApi("openapi", "action", "importFile", importParams);
                            log.debug("[ZapService] Import response: {}", importResponse.toString());

                            log.info("[ZapService] Waiting for OpenAPI import to complete...");
                            Thread.sleep(5000);

                            tempFile.delete();
                        } else {
                            log.warn("[ZapService] OpenAPI spec not provided for API-WWW scan, skipping API phase");
                        }
                    } else {
                        log.warn("[ZapService] Unknown webappType: {}, defaulting to WWW scan", webappType);
                    }
                }

                // Get the sites in the tree to verify the import/spider worked
                ApiResponse sitesResponse = zapApi.core.sites();
                log.info("[ZapService] Sites in tree: {}", sitesResponse.toString());

                // Try to start the active scan
                boolean scanStarted = false;
                String scanId = null;

                // Synchronize access to start the scan
                synchronized (zapLock) {
                    try {
                        log.info("[ZapService] Starting active scan for target: {}", targetUrl);
                        Map<String, String> params = new HashMap<>();
                        params.put("url", targetUrl);
                        params.put("recurse", "true");
                        params.put("inScopeOnly", "false");
                        params.put("contextName", contextName); // Explicitly limit scan to this context

                        ApiResponse activeScanResponse = zapApi.callApi("ascan", "action", "scan", params);
                        scanId = ((ApiResponseElement) activeScanResponse).getValue();
                        log.info("[ZapService] Active scan started with ID: {}", scanId);
                        activeScanIds.put(contextName, scanId); // Track this scan ID
                        scanStarted = true;
                    } catch (Exception e) {
                        log.warn("[ZapService] Active scan failed: {}", e.getMessage());

                        // Try with a more specific URL
                        try {
                            log.info("[ZapService] Trying scan with base URL");
                            String baseUrl = targetUrl.replaceAll("(https?://[^/]+).*", "$1");
                            log.info("[ZapService] Using base URL: {}", baseUrl);

                            Map<String, String> params = new HashMap<>();
                            params.put("url", baseUrl);
                            params.put("contextName", contextName); // Explicitly limit scan to this context

                            ApiResponse activeScanResponse = zapApi.callApi("ascan", "action", "scan", params);
                            scanId = ((ApiResponseElement) activeScanResponse).getValue();
                            log.info("[ZapService] Active scan started with ID: {}", scanId);
                            activeScanIds.put(contextName, scanId); // Track this scan ID
                            scanStarted = true;
                        } catch (Exception e2) {
                            log.warn("[ZapService] Base URL scan failed: {}", e2.getMessage());
                        }
                    }
                }

                // If a scan was started, wait for it to complete
                // If a scan was started, wait for it to complete
                if (scanStarted && scanId != null) {
                    log.debug("[ZapService] Waiting for active scan to complete...");
                    int scanProgress = 0;
                    int retryCount = 0;
                    final int MAX_RETRIES = 5;

                    while (scanProgress < 100 && retryCount < MAX_RETRIES) {
                        try {
                            Thread.sleep(5000); // Check every 5 seconds

                            // Get scan status with retry logic
                            ApiResponseElement statusResponse = null;
                            try {
                                // Only synchronize the actual API call, not the whole loop
                                synchronized (zapLock) {
                                    statusResponse = (ApiResponseElement) zapApi.ascan.status(scanId);
                                }
                            } catch (Exception e) {
                                log.warn("[ZapService] Error getting scan status, retrying: {}", e.getMessage());
                                retryCount++;
                                continue;
                            }

                            scanProgress = Integer.parseInt(statusResponse.getValue());
                            log.debug("[ZapService] Active scan progress for context {}: {}%", contextName, scanProgress);
                            retryCount = 0; // Reset retry count on successful status check
                        } catch (Exception e) {
                            log.warn("[ZapService] Error checking scan progress: {}", e.getMessage());
                            retryCount++;
                            if (retryCount >= MAX_RETRIES) {
                                log.error("[ZapService] Max retries reached for scan progress check");
                                break;
                            }
                        }
                    }

                    if (scanProgress >= 100) {
                        log.info("[ZapService] Active scan completed for {} target: {}", webappType, targetUrl);
                    }

                    // Remove the scan ID from tracking
                    activeScanIds.remove(contextName);
                } else {
                    log.warn("[ZapService] Could not start an active scan");
                }

// Create report directory
                File reportDir = new File(repoDir, "zap");
                reportDir.mkdirs();

// Save the JSON report
                File jsonReport = new File(reportDir, "report.json");

// Get the context-specific JSON report
                log.info("[ZapService] Getting JSON report for context: {}", contextName);

// Use a separate lock for report generation to avoid blocking other scans
                Object reportLock = new Object();

// Synchronize only the actual report generation API call
                boolean reportGenerated = false;
                try {
                    synchronized (reportLock) {
                        // Use the reports API to generate a context-specific report
                        Map<String, String> reportParams = new HashMap<>();
                        reportParams.put("title", "ZAP Scan Report - " + contextName);
                        reportParams.put("template", "traditional-json");
                        reportParams.put("reportDir", reportDir.getAbsolutePath());
                        reportParams.put("reportFileName", "report.json");
                        reportParams.put("contexts", contextName);

                        ApiResponse reportResponse = zapApi.callApi("reports", "action", "generate", reportParams);
                        log.debug("[ZapService] Report generation response: {}", reportResponse.toString());
                        reportGenerated = true;
                    }
                } catch (Exception e) {
                    log.warn("[ZapService] Context-specific report generation failed: {}", e.getMessage());

                    // Fall back to the core API with filtering
                    try {
                        synchronized (zapLock) {
                            byte[] reportBytes = zapApi.core.jsonreport();
                            Files.write(jsonReport.toPath(), reportBytes);
                            log.debug("[ZapService] Saved generic JSON report to {}", jsonReport.getAbsolutePath());
                        }

                        // Filter the report to only include alerts from this context
                        filterReportForContext(jsonReport, contextName);
                        reportGenerated = true;
                    } catch (Exception e2) {
                        log.error("[ZapService] Failed to generate fallback report: {}", e2.getMessage());
                    }
                }

// If the reports API fails, fall back to the core API but filter results
                if (!reportGenerated || !jsonReport.exists()) {
                    log.warn("[ZapService] Report file not created, falling back to core API");
                    try {
                        synchronized (zapLock) {
                            byte[] reportBytes = zapApi.core.jsonreport();
                            Files.write(jsonReport.toPath(), reportBytes);
                            log.debug("[ZapService] Saved generic JSON report to {}", jsonReport.getAbsolutePath());
                        }
                    } catch (Exception e) {
                        log.error("[ZapService] Failed to generate any report: {}", e.getMessage());
                    }
                }

                log.debug("[ZapService] Saved JSON report to {}", jsonReport.getAbsolutePath());

// Clean up by removing the context
                synchronized (zapLock) {
                    log.debug("[ZapService] Removing context: {}", contextName);
                    zapApi.context.removeContext(contextName);
                }


            } catch (ClientApiException e) {
                log.error("[ZapService] ZAP API error: {}", e.getMessage());
                throw new RuntimeException("ZAP API error", e);
            }


        } catch (Exception e) {
            log.error("[ZapService] Error running ZAP scan", e);
            throw new RuntimeException("Failed to run ZAP scan", e);
        }
    }

    /**
     * Filter a ZAP report to only include alerts from a specific context
     * This is a fallback method if context-specific report generation fails
     */
    private void filterReportForContext(File reportFile, String contextName) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode fullReport = mapper.readTree(reportFile);

            // Create a new report structure with only the relevant alerts
            ObjectNode filteredReport = mapper.createObjectNode();

            // Copy all the metadata fields
            fullReport.fields().forEachRemaining(entry -> {
                if (!entry.getKey().equals("sites")) {
                    filteredReport.set(entry.getKey(), entry.getValue());
                }
            });

            // Create a new sites array with filtered alerts
            ArrayNode filteredSites = mapper.createArrayNode();

            // For each site, only include alerts that belong to our context
            // Note: This is a best-effort approach as ZAP doesn't directly mark alerts with context
            // We're using the URL patterns from the context to filter
            JsonNode sites = fullReport.path("sites");
            if (sites.isArray()) {
                for (JsonNode site : sites) {
                    ObjectNode filteredSite = mapper.createObjectNode();

                    // Copy site metadata
                    site.fields().forEachRemaining(entry -> {
                        if (!entry.getKey().equals("alerts")) {
                            filteredSite.set(entry.getKey(), entry.getValue());
                        }
                    });

                    // Filter alerts
                    ArrayNode filteredAlerts = mapper.createArrayNode();
                    JsonNode alerts = site.path("alerts");
                    if (alerts.isArray()) {
                        for (JsonNode alert : alerts) {
                            // Check if any instance URL matches our context
                            // This is an approximation - ideally we'd use ZAP's context membership info
                            JsonNode instances = alert.path("instances");
                            if (instances.isArray()) {
                                for (JsonNode instance : instances) {
                                    String uri = instance.path("uri").asText();
                                    // If we find any matching instance, include the whole alert
                                    if (uri.contains(contextName)) {
                                        filteredAlerts.add(alert);
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    filteredSite.set("alerts", filteredAlerts);
                    filteredSites.add(filteredSite);
                }
            }

            filteredReport.set("sites", filteredSites);

            // Write the filtered report back to the file
            mapper.writerWithDefaultPrettyPrinter().writeValue(reportFile, filteredReport);

        } catch (Exception e) {
            log.error("[ZapService] Error filtering report for context {}: {}", contextName, e.getMessage());
        }
    }



    /**
     * Determine if the OpenAPI spec is in JSON format
     *
     * @param spec OpenAPI specification content
     * @return true if JSON, false if YAML
     */
    private boolean isJsonFormat(String spec) {
        // Simple check: JSON typically starts with { or [
        String trimmed = spec.trim();
        if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
            return true;
        }

        // More thorough check: try to parse as JSON
        try {
            new ObjectMapper().readTree(spec);
            return true;
        } catch (Exception e) {
            // Not valid JSON, assume YAML
            return false;
        }
    }


    public List<Finding> mapZapReportToFindings(ZapReport zapReport, CodeRepo codeRepo, CodeRepoBranch codeRepoBranch) {
        List<Finding> findings = new ArrayList<>();

        if (zapReport.getSites() != null) {
            for (ZapReport.Site site : zapReport.getSites()) {
                if (site.getAlerts() != null) {
                    for (ZapReport.Alert alert : site.getAlerts()) {
                        // Skip informational alerts (riskcode 0)
                        if ("0".equals(alert.getRiskCode())) {
                            continue;
                        }

                        Vulnerability vulnerability = getOrCreateVulnerabilityService.getOrCreate(
                                alert.getName(),
                                alert.getDescription(),
                                alert.getReference(),
                                alert.getSolution(),


                                null,
                                null,
                                null,
                                null
                        );

                        // Get the first instance URI as location
                        String location = "";
                        if (alert.getInstances() != null && !alert.getInstances().isEmpty()) {
                            location = alert.getInstances().get(0).getUri();
                            log.debug("Extracted URI for alert {}: {}", alert.getName(), location);
                        }

                        // Create a finding for each instance
                        if (alert.getInstances() != null && !alert.getInstances().isEmpty()) {
                            for (ZapReport.Instance instance : alert.getInstances()) {
                                 location = instance.getUri();
                                log.debug("Creating finding for alert {} at URI: {}", alert.getName(), location);

                                Finding finding = new Finding(
                                        vulnerability,
                                        null,
                                        codeRepoBranch,
                                        codeRepo,
                                        null,
                                        alert.getOtherInfo(),
                                        location,
                                        mapZapSeverity(alert.getRiskCode()),
                                        Finding.Source.DAST
                                );

                                findings.add(finding);
                            }
                        } else {
                            // If there are no instances, still create one finding with empty location
                            log.debug("Creating finding for alert {} with no instances", alert.getName());
                            Finding finding = new Finding(
                                    vulnerability,
                                    null,
                                    codeRepoBranch,
                                    codeRepo,
                                    null,
                                    alert.getOtherInfo(),
                                    "",
                                    mapZapSeverity(alert.getRiskCode()),
                                    Finding.Source.DAST
                            );

                            findings.add(finding);
                        }

                    }
                }
            }
        }

        return findings;
    }

    private Finding.Severity mapZapSeverity(String riskCode) {
        switch (riskCode) {
            case "4":
                return Finding.Severity.CRITICAL;
            case "3":
                return Finding.Severity.HIGH;
            case "2":
                return Finding.Severity.MEDIUM;
            case "1":
                return Finding.Severity.LOW;
            default:
                return Finding.Severity.INFO;
        }
    }


    /**
     * Parse the ZAP JSON report into a ScanResult object
     *
     * @param reportFile JSON report file
     * @return ScanResult object
     * @throws IOException If the file cannot be read
     */
    private ScanResult parseZapReport(File reportFile, CodeRepo codeRepo, CodeRepoBranch codeRepoBranch) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        ZapReport zapReport = mapper.readValue(reportFile, ZapReport.class);

        // Also save the findings to the database
        List<Finding> findings = mapZapReportToFindings(zapReport, codeRepo, codeRepoBranch);
        createFindingService.saveFindings(findings, codeRepoBranch, codeRepo, Finding.Source.DAST);

        // Create and return the ScanResult for backward compatibility
        ScanResult result = new ScanResult();
        result.setScanId(UUID.randomUUID().toString());
        result.setStatus("100");

        List<Alert> alerts = new ArrayList<>();
        if (zapReport.getSites() != null) {
            for (ZapReport.Site site : zapReport.getSites()) {
                if (site.getAlerts() != null) {
                    for (ZapReport.Alert zapAlert : site.getAlerts()) {
                        Alert alert = new Alert();
                        alert.setRisk(zapAlert.getRiskDesc());
                        alert.setName(zapAlert.getName());
                        alert.setDescription(zapAlert.getDescription());

                        if (zapAlert.getInstances() != null && !zapAlert.getInstances().isEmpty()) {
                            alert.setUrl(zapAlert.getInstances().get(0).getUri());
                        }

                        alerts.add(alert);
                    }
                }
            }
        }

        result.setAlerts(alerts);
        return result;
    }



    /**
     * Process alerts from a site node in the ZAP report
     *
     * @param site Site node from the ZAP report
     * @param alerts List to add alerts to
     */
    private void processAlertsFromSite(JsonNode site, List<Alert> alerts) {
        JsonNode alertsNode = site.path("alerts");
        if (alertsNode.isArray()) {
            for (JsonNode alertNode : alertsNode) {
                Alert alert = new Alert();
                alert.setRisk(alertNode.path("risk").asText());
                alert.setName(alertNode.path("name").asText());
                alert.setDescription(alertNode.path("description").asText());

                // Get the first instance URL
                if (alertNode.has("instances") && alertNode.path("instances").isArray() &&
                        alertNode.path("instances").size() > 0) {
                    alert.setUrl(alertNode.path("instances").get(0).path("uri").asText());
                }

                alerts.add(alert);
            }
        }
    }

    /**
     * Shutdown the executor service
     */
    @PreDestroy
    public void shutdown() {
        executorService.shutdown();
        try {
            if (!executorService.awaitTermination(60, TimeUnit.SECONDS)) {
                executorService.shutdownNow();
            }
        } catch (InterruptedException e) {
            executorService.shutdownNow();
        }
    }
}

/**
 * Mixeway configuration class
 */
@Data
class MixewayConfig {
    private String openApiPath;
    private String backendUrl;
    private String webappType;
}


