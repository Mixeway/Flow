package io.mixeway.mixewayflowapi.integrations.ollama.dto;

import com.google.gson.annotations.SerializedName;
import lombok.Data;

@Data
public class FpVerdictDto {
    private String verdict;
    private String confidence;
    /** Detailed rationale; prompts request multi-sentence output. */
    private String reasoning;

    @SerializedName("secret_analysis")
    private SecretAnalysisDto secretAnalysis;
}
