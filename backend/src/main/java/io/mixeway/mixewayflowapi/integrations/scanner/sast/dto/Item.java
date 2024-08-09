package io.mixeway.mixewayflowapi.integrations.scanner.sast.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Item {
    private String id;
    private String title;
    private String description;
    @JsonProperty("documentation_url")
    private String documentationUrl;
    @JsonProperty("line_number")
    private int lineNumber;
    @JsonProperty("full_filename")
    private String fullFilename;
    private String filename;
    @JsonProperty("category_groups")
    private List<String> categoryGroups;
    private CodeLocation source;
    private CodeLocation sink;
    @JsonProperty("parent_line_number")
    private int parentLineNumber;
    private String fingerprint;
    @JsonProperty("old_fingerprint")
    private String oldFingerprint;
    @JsonProperty("code_extract")
    private String codeExtract;
}

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
class CodeLocation {
    private int start;
    private int end;
    private Column column;
}

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
class Column {
    private int start;
    private int end;
}
