package io.mixeway.mixewayflowapi.integrations.scanner.iac.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
public class KicsReport {

    @JsonProperty("kics_version")
    private String kicsVersion;

    @JsonProperty("files_scanned")
    private int filesScanned;

    @JsonProperty("lines_scanned")
    private int linesScanned;

    @JsonProperty("files_parsed")
    private int filesParsed;

    @JsonProperty("lines_parsed")
    private int linesParsed;

    @JsonProperty("lines_ignored")
    private int linesIgnored;

    @JsonProperty("files_failed_to_scan")
    private int filesFailedToScan;

    @JsonProperty("queries_total")
    private int queriesTotal;

    @JsonProperty("queries_failed_to_execute")
    private int queriesFailedToExecute;

    @JsonProperty("queries_failed_to_compute_similarity_id")
    private int queriesFailedToComputeSimilarityId;

    @JsonProperty("scan_id")
    private String scanId;

    @JsonProperty("severity_counters")
    private SeverityCounters severityCounters;

    @JsonProperty("total_counter")
    private int totalCounter;

    @JsonProperty("total_bom_resources")
    private int totalBomResources;

    @JsonProperty("start")
    private String start;

    @JsonProperty("end")
    private String end;

    @JsonProperty("paths")
    private List<String> paths;

    @JsonProperty("queries")
    private List<Query> queries;

    @Data
    public static class SeverityCounters {
        @JsonProperty("CRITICAL")
        private int critical;

        @JsonProperty("HIGH")
        private int high;

        @JsonProperty("INFO")
        private int info;

        @JsonProperty("LOW")
        private int low;

        @JsonProperty("MEDIUM")
        private int medium;

        @JsonProperty("TRACE")
        private int trace;
    }

    @Data
    public static class Query {
        @JsonProperty("query_name")
        private String queryName;

        @JsonProperty("query_id")
        private String queryId;

        @JsonProperty("query_url")
        private String queryUrl;

        @JsonProperty("severity")
        private String severity;

        @JsonProperty("platform")
        private String platform;

        @JsonProperty("cwe")
        private String cwe;

        @JsonProperty("category")
        private String category;

        @JsonProperty("experimental")
        private boolean experimental;

        @JsonProperty("description")
        private String description;

        @JsonProperty("description_id")
        private String descriptionId;

        @JsonProperty("files")
        private List<FileIssue> files;

        @Data
        public static class FileIssue {
            @JsonProperty("file_name")
            private String fileName;

            @JsonProperty("similarity_id")
            private String similarityId;

            @JsonProperty("line")
            private int line;

            @JsonProperty("issue_type")
            private String issueType;

            @JsonProperty("search_key")
            private String searchKey;

            @JsonProperty("search_line")
            private int searchLine;

            @JsonProperty("search_value")
            private String searchValue;

            @JsonProperty("expected_value")
            private String expectedValue;

            @JsonProperty("actual_value")
            private String actualValue;
        }
    }
}
