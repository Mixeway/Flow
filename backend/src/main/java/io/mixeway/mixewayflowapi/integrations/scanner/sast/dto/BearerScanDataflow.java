package io.mixeway.mixewayflowapi.integrations.scanner.sast.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class BearerScanDataflow {
    @JsonProperty("data_types")
    private List<DataType> dataTypes;

    @JsonProperty("dependencies")
    private List<Dependency> dependencies;

    public List<DataType> getDataTypes() {
        return dataTypes;
    }

    public void setDataTypes(List<DataType> dataTypes) {
        this.dataTypes = dataTypes;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    @Data
    public static class DataType {
        @JsonProperty("category_name")
        private String categoryName;

        @JsonProperty("category_groups")
        private List<String> categoryGroups;

        @JsonProperty("name")
        private String name;

        @JsonProperty("detectors")
        private List<Detector> detectors;

        // Getters and setters
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    @Data
    public static class Detector {
        @JsonProperty("name")
        private String name;

        @JsonProperty("locations")
        private List<Location> locations;

        // Getters and setters
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    @Data
    public static class Location {
        @JsonProperty("filename")
        private String filename;

        @JsonProperty("full_filename")
        private String fullFilename;

        @JsonProperty("start_line_number")
        private int startLineNumber;

        @JsonProperty("start_column_number")
        private int startColumnNumber;

        @JsonProperty("end_column_number")
        private int endColumnNumber;

        @JsonProperty("field_name")
        private String fieldName;

        @JsonProperty("object_name")
        private String objectName;

        // Getters and setters
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    @Data
    public static class Dependency {
        private String name;
        private String version;
        private String filename;
        private String detector;
    }
}
