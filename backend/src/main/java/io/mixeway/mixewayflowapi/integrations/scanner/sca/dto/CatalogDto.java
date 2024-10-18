package io.mixeway.mixewayflowapi.integrations.scanner.sca.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;
import java.util.List;

public class CatalogDto {

    private String title;
    private String catalogVersion;

    private String dateReleased;

    private int count;
    private List<VulnerabilityDto> vulnerabilities;

    // Getters and Setters

    public String getTitle() {
        return title;
    }

    @JsonProperty("title")
    public void setTitle(String title) {
        this.title = title;
    }

    public String getCatalogVersion() {
        return catalogVersion;
    }

    @JsonProperty("catalogVersion")
    public void setCatalogVersion(String catalogVersion) {
        this.catalogVersion = catalogVersion;
    }

    public String getDateReleased() {
        return dateReleased;
    }

    @JsonProperty("dateReleased")
    public void setDateReleased(String dateReleased) {
        this.dateReleased = dateReleased;
    }

    public int getCount() {
        return count;
    }

    @JsonProperty("count")
    public void setCount(int count) {
        this.count = count;
    }

    public List<VulnerabilityDto> getVulnerabilities() {
        return vulnerabilities;
    }

    @JsonProperty("vulnerabilities")
    public void setVulnerabilities(List<VulnerabilityDto> vulnerabilities) {
        this.vulnerabilities = vulnerabilities;
    }
}
