package io.mixeway.mixewayflowapi.integrations.ollama.dto;

import com.google.gson.annotations.SerializedName;
import lombok.Data;

import java.util.List;

@Data
public class OllamaTagsResponse {
    private List<ModelEntry> models;

    @Data
    public static class ModelEntry {
        private String name;
        private String model;
        private String digest;
        @SerializedName("size")
        private Long size;
    }
}
