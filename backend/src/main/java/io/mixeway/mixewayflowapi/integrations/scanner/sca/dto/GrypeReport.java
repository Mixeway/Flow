package io.mixeway.mixewayflowapi.integrations.scanner.sca.dto;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class GrypeReport {
    @JsonProperty("matches")
    private List<Match> matches;

    @Data
    public static class Match {
        @JsonProperty("vulnerability")
        private Vulnerability vulnerability;

        @JsonProperty("artifact")
        private Artifact artifact;

        @JsonProperty("matchDetails")
        private List<MatchDetail> matchDetails;
    }

    @Data
    public static class Vulnerability {
        @JsonProperty("id")
        private String id;

        @JsonProperty("dataSource")
        private String dataSource;

        @JsonProperty("namespace")
        private String namespace;

        @JsonProperty("severity")
        private String severity;

        @JsonProperty("description")
        private String description;

        @JsonProperty("cvss")
        private List<Cvss> cvss;

        @JsonProperty("knownExploited")
        private List<KnownExploited> knownExploited;

        @JsonProperty("epss")
        private List<Epss> epss;

        @JsonProperty("cwes")
        private List<Cwe> cwes;

        @JsonProperty("fix")
        private Fix fix;

        @JsonProperty("risk")
        private double risk;
    }

    @Data
    public static class Cvss {
        @JsonProperty("type")
        private String type;

        @JsonProperty("version")
        private String version;

        @JsonProperty("vector")
        private String vector;

        @JsonProperty("metrics")
        private Metrics metrics;

        @Data
        public static class Metrics {
            @JsonProperty("baseScore")
            private double baseScore;

            @JsonProperty("exploitabilityScore")
            private double exploitabilityScore;

            @JsonProperty("impactScore")
            private double impactScore;
        }
    }

    @Data
    public static class KnownExploited {
        @JsonProperty("cve")
        private String cve;

        @JsonProperty("vendorProject")
        private String vendorProject;

        @JsonProperty("product")
        private String product;

        @JsonProperty("dateAdded")
        private String dateAdded;

        @JsonProperty("requiredAction")
        private String requiredAction;

        @JsonProperty("dueDate")
        private String dueDate;

        @JsonProperty("knownRansomwareCampaignUse")
        private String knownRansomwareCampaignUse;

        @JsonProperty("urls")
        private List<String> urls;

        @JsonProperty("cwes")
        private List<String> cwes;
    }

    @Data
    public static class Epss {
        @JsonProperty("cve")
        private String cve;

        @JsonProperty("epss")
        private double epss;

        @JsonProperty("percentile")
        private double percentile;

        @JsonProperty("date")
        private String date;
    }

    @Data
    public static class Cwe {
        @JsonProperty("cve")
        private String cve;

        @JsonProperty("cwe")
        private String cwe;

        @JsonProperty("source")
        private String source;

        @JsonProperty("type")
        private String type;
    }

    @Data
    public static class Fix {
        @JsonProperty("versions")
        private List<String> versions;

        @JsonProperty("state")
        private String state;

        @JsonProperty("available")
        private List<AvailableFix> available;

        @Data
        public static class AvailableFix {
            @JsonProperty("version")
            private String version;

            @JsonProperty("date")
            private String date;

            @JsonProperty("kind")
            private String kind;
        }
    }

    @Data
    public static class Artifact {
        @JsonProperty("id")
        private String id;

        @JsonProperty("name")
        private String name;

        @JsonProperty("version")
        private String version;

        @JsonProperty("type")
        private String type;

        @JsonProperty("language")
        private String language;

        @JsonProperty("purl")
        private String purl;
    }

    @Data
    public static class MatchDetail {
        @JsonProperty("type")
        private String type;

        @JsonProperty("matcher")
        private String matcher;

        @JsonProperty("searchedBy")
        private SearchedBy searchedBy;

        @JsonProperty("found")
        private Found found;

        @JsonProperty("fix")
        private Fix fix;

        @Data
        public static class SearchedBy {
            @JsonProperty("language")
            private String language;

            @JsonProperty("namespace")
            private String namespace;

            @JsonProperty("package")
            private PackageInfo pkg;

            @Data
            public static class PackageInfo {
                @JsonProperty("name")
                private String name;

                @JsonProperty("version")
                private String version;
            }
        }

        @Data
        public static class Found {
            @JsonProperty("vulnerabilityID")
            private String vulnerabilityID;

            @JsonProperty("versionConstraint")
            private String versionConstraint;
        }
    }
}
