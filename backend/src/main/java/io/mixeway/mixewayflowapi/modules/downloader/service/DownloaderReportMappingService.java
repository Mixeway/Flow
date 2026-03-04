package io.mixeway.mixewayflowapi.modules.downloader.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.mixeway.mixewayflowapi.modules.downloader.model.DownloaderVulnerability;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

import java.util.Map;

//TODO: Write accessibility test
/*
@Test
void serviceShouldOnlyBeAccessedByMasterPackage() {
    classes().that().haveSimpleName("InternalService")
        .should().onlyBeAccessed().byAnyPackage("com.example.master", "com.example.master.internal")
        .check(new ClassFileImporter().importPackages("com.example"));
}
 */
@Log4j2
@Component
public class DownloaderReportMappingService {

    private final ObjectMapper objectMapper;

    public DownloaderReportMappingService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public Map<String, DownloaderVulnerability> parseReport(String json){
        try {
            return objectMapper.readValue(json, new TypeReference<>() {});
        } catch (JsonMappingException e) {
            log.error("Error mapping JSON file {}", e.getMessage());
            throw new IllegalArgumentException();
        } catch (JsonProcessingException e) {
            log.error("Error processing JSON file {}", e.getMessage());
            throw new IllegalArgumentException();
        }
    }

    public String toJson(Map<String, DownloaderVulnerability> map) {
        try {
            return objectMapper.writeValueAsString(map);
        } catch (JsonProcessingException e) {
            log.error("Error serializing JSON {}", e.getMessage());
            throw new IllegalArgumentException();
        }
    }
}
