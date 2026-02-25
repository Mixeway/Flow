package io.mixeway.mixewayflowapi.integrations.repo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class ImportCodeRepoBitbucketResponseDto {
    private String uuid;
    private String description;
    private String language;
    @JsonProperty("full_name")
    private String fullName;
    private String name;
    private String slug;
    private LinksDto links;
    private MainbranchDto mainbranch;

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class LinksDto {
        private HrefDto html;
    }

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class HrefDto {
        private String href;
    }

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class MainbranchDto {
        private String name;
        private String type;
    }

    public String getWebUrl() {
        return links != null && links.getHtml() != null ? links.getHtml().getHref() : null;
    }

    public String getDefaultBranch() {
        return mainbranch != null ? mainbranch.getName() : "main";
    }

    public String getPathWithNamespace() {
        return fullName;
    }

    public int getId() {
        return uuid != null ? Math.abs(uuid.hashCode()) : 0;
    }
}
