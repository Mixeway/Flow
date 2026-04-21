package io.mixeway.mixewayflowapi.integrations.ollama.dto;

import com.google.gson.annotations.SerializedName;
import lombok.Data;

/**
 * Optional structured output for SECRETS-source AI analysis (JSON field {@code secret_analysis}).
 */
@Data
public class SecretAnalysisDto {
    /**
     * e.g. api_key, database_password, token, placeholder, test_data, example_value
     */
    @SerializedName("credential_category")
    private String credentialCategory;

    /** What service or resource the material likely authenticates to (short). */
    @SerializedName("likely_service")
    private String likelyService;

    /** Masked material e.g. {@code ab******yz} — never raw secrets. */
    @SerializedName("masked_preview")
    private String maskedPreview;

    /** Analyst-facing paragraph; no raw secret values. */
    @SerializedName("enrichment_for_ticket")
    private String enrichmentForTicket;
}
