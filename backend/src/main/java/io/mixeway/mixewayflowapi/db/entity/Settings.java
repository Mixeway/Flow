package io.mixeway.mixewayflowapi.db.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "settings")
public class Settings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "auth_type_user_pass", nullable = false)
    private boolean authTypeUserPass = false;

    @Column(name = "auth_type_oauth", nullable = false)
    private boolean authTypeOAuth = false;

    @Column(name = "oauth_app_name")
    private String oauthAppName;

    @Column(name = "oauth_secret")
    @JsonIgnore
    private String oauthSecret;

    @Column(name = "oauth_issuer_url")
    private String oauthIssuerUrl;

    @Column(name = "sca_mode_embeded", nullable = false)
    private boolean scaModeEmbeded = false;

    @Column(name = "sca_mode_external", nullable = false)
    private boolean scaModeExternal = false;

    @Column(name = "sca_api_url")
    private String scaApiUrl;

    @Column(name = "sca_api_key")
    @JsonIgnore
    private String scaApiKey;

    @Column(name = "smtp_hostname")
    private String smtpHostname;

    @Column(name = "smtp_port")
    private int smtpPort;

    @Column(name = "smtp_username")
    private String smtpUsername;

    @Column(name = "smtp_password")
    @JsonIgnore
    private String smtpPassword;

    @Column(name = "smtp_tls", nullable = false)
    private boolean smtpTls = false;

    @Column(name = "smtp_starttls", nullable = false)
    private boolean smtpStarttls = false;

    @Column(name = "enable_smtp", nullable = false)
    private boolean enableSmtp = false;

    @Column(name = "enable_wiz", nullable = false)
    private boolean enableWiz = false;

    @Column(name = "wiz_secret")
    @JsonIgnore
    private String wizSecret;

    @Column(name = "wiz_client_id")
    private String wizClientId;

    @Column(name = "gemini_api_key")
    @Setter
    private String geminiApiKey;

    /**
     * Remediation SLA in days per severity, counted from when a finding was first seen.
     * A null value means no SLA is tracked for that severity.
     */
    @Column(name = "sla_critical_days")
    private Integer slaCriticalDays = 14;

    @Column(name = "sla_high_days")
    private Integer slaHighDays = 30;

    @Column(name = "sla_medium_days")
    private Integer slaMediumDays;

    @Column(name = "sla_low_days")
    private Integer slaLowDays;

    public void configSla(Integer criticalDays, Integer highDays, Integer mediumDays, Integer lowDays) {
        this.slaCriticalDays = criticalDays;
        this.slaHighDays = highDays;
        this.slaMediumDays = mediumDays;
        this.slaLowDays = lowDays;
    }

    @Column(name = "sast_llm_enabled", nullable = false)
    private boolean sastLlmEnabled = false;
    @Column(name = "sast_llm_api_url", length = 500)
    private String sastLlmApiUrl;
    @Column(name = "sast_llm_api_key", length = 500)
    @JsonIgnore
    private String sastLlmApiKey;
    @Column(name = "sast_llm_model", length = 200)
    private String sastLlmModel;
    @Column(name = "sast_llm_context_window", nullable = false)
    private int sastLlmContextWindow = 16384;
    @Column(name = "sast_llm_scan_concurrency", nullable = false)
    private int sastLlmScanConcurrency = 2;

    @Column(name = "sca_llm_enabled", nullable = false)
    private boolean scaLlmEnabled = false;
    @Column(name = "sca_llm_api_url", length = 500)
    private String scaLlmApiUrl;
    @Column(name = "sca_llm_api_key", length = 500)
    @JsonIgnore
    private String scaLlmApiKey;
    @Column(name = "sca_llm_model", length = 200)
    private String scaLlmModel;
    @Column(name = "sca_llm_context_window", nullable = false)
    private int scaLlmContextWindow = 8192;
    @Column(name = "sca_llm_scan_concurrency", nullable = false)
    private int scaLlmScanConcurrency = 2;

    @Column(name = "iac_llm_enabled", nullable = false)
    private boolean iacLlmEnabled = false;
    @Column(name = "iac_llm_api_url", length = 500)
    private String iacLlmApiUrl;
    @Column(name = "iac_llm_api_key", length = 500)
    @JsonIgnore
    private String iacLlmApiKey;
    @Column(name = "iac_llm_model", length = 200)
    private String iacLlmModel;
    @Column(name = "iac_llm_context_window", nullable = false)
    private int iacLlmContextWindow = 8192;
    @Column(name = "iac_llm_scan_concurrency", nullable = false)
    private int iacLlmScanConcurrency = 2;

    @Column(name = "secrets_llm_enabled", nullable = false)
    private boolean secretsLlmEnabled = false;
    @Column(name = "secrets_llm_api_url", length = 500)
    private String secretsLlmApiUrl;
    @Column(name = "secrets_llm_api_key", length = 500)
    @JsonIgnore
    private String secretsLlmApiKey;
    @Column(name = "secrets_llm_model", length = 200)
    private String secretsLlmModel;
    @Column(name = "secrets_llm_context_window", nullable = false)
    private int secretsLlmContextWindow = 8192;
    @Column(name = "secrets_llm_scan_concurrency", nullable = false)
    private int secretsLlmScanConcurrency = 2;

    @Column(name = "dast_llm_enabled", nullable = false)
    private boolean dastLlmEnabled = false;
    @Column(name = "dast_llm_api_url", length = 500)
    private String dastLlmApiUrl;
    @Column(name = "dast_llm_api_key", length = 500)
    @JsonIgnore
    private String dastLlmApiKey;
    @Column(name = "dast_llm_model", length = 200)
    private String dastLlmModel;
    @Column(name = "dast_llm_context_window", nullable = false)
    private int dastLlmContextWindow = 8192;
    @Column(name = "dast_llm_scan_concurrency", nullable = false)
    private int dastLlmScanConcurrency = 2;

    /**
     * One LLM endpoint per scanner source, read from columns on this settings row.
     */
    @JsonProperty("llmSources")
    public List<LlmSourceView> getLlmSources() {
        List<LlmSourceView> views = new ArrayList<>();
        for (Finding.Source source : Finding.Source.values()) {
            LlmFields fields = llmFields(source);
            views.add(new LlmSourceView(
                    source.name(),
                    fields.enabled,
                    fields.apiUrl,
                    fields.model,
                    hasText(fields.apiKey),
                    fields.contextWindow,
                    fields.scanConcurrency
            ));
        }
        return views;
    }

    @JsonIgnore
    public boolean isSourceLlmConfigured(Finding.Source source) {
        LlmFields fields = llmFields(source);
        return fields.enabled && hasText(fields.apiUrl) && hasText(fields.apiKey) && hasText(fields.model);
    }

    @JsonIgnore
    public String sourceLlmApiUrl(Finding.Source source) {
        return llmFields(source).apiUrl;
    }

    @JsonIgnore
    public String sourceLlmApiKey(Finding.Source source) {
        return llmFields(source).apiKey;
    }

    @JsonIgnore
    public String sourceLlmModel(Finding.Source source) {
        return llmFields(source).model;
    }

    @JsonIgnore
    public int sourceLlmContextWindow(Finding.Source source) {
        return llmFields(source).contextWindow;
    }

    @JsonIgnore
    public int sourceLlmScanConcurrency(Finding.Source source) {
        return llmFields(source).scanConcurrency;
    }

    public void upsertLlmSource(Finding.Source source, boolean enabled, String apiUrl, String apiKey, String model,
                                int contextWindow, int scanConcurrency) {
        switch (source) {
            case SAST -> {
                this.sastLlmEnabled = enabled;
                this.sastLlmApiUrl = apiUrl;
                this.sastLlmApiKey = apiKey;
                this.sastLlmModel = model;
                this.sastLlmContextWindow = contextWindow;
                this.sastLlmScanConcurrency = scanConcurrency;
            }
            case SCA -> {
                this.scaLlmEnabled = enabled;
                this.scaLlmApiUrl = apiUrl;
                this.scaLlmApiKey = apiKey;
                this.scaLlmModel = model;
                this.scaLlmContextWindow = contextWindow;
                this.scaLlmScanConcurrency = scanConcurrency;
            }
            case IAC -> {
                this.iacLlmEnabled = enabled;
                this.iacLlmApiUrl = apiUrl;
                this.iacLlmApiKey = apiKey;
                this.iacLlmModel = model;
                this.iacLlmContextWindow = contextWindow;
                this.iacLlmScanConcurrency = scanConcurrency;
            }
            case SECRETS -> {
                this.secretsLlmEnabled = enabled;
                this.secretsLlmApiUrl = apiUrl;
                this.secretsLlmApiKey = apiKey;
                this.secretsLlmModel = model;
                this.secretsLlmContextWindow = contextWindow;
                this.secretsLlmScanConcurrency = scanConcurrency;
            }
            case DAST -> {
                this.dastLlmEnabled = enabled;
                this.dastLlmApiUrl = apiUrl;
                this.dastLlmApiKey = apiKey;
                this.dastLlmModel = model;
                this.dastLlmContextWindow = contextWindow;
                this.dastLlmScanConcurrency = scanConcurrency;
            }
            default -> throw new IllegalArgumentException("LLM settings are not stored for " + source);
        }
    }

    private LlmFields llmFields(Finding.Source source) {
        return switch (source) {
            case SAST -> new LlmFields(sastLlmEnabled, sastLlmApiUrl, sastLlmApiKey, sastLlmModel, sastLlmContextWindow, sastLlmScanConcurrency);
            case SCA -> new LlmFields(scaLlmEnabled, scaLlmApiUrl, scaLlmApiKey, scaLlmModel, scaLlmContextWindow, scaLlmScanConcurrency);
            case IAC -> new LlmFields(iacLlmEnabled, iacLlmApiUrl, iacLlmApiKey, iacLlmModel, iacLlmContextWindow, iacLlmScanConcurrency);
            case SECRETS -> new LlmFields(secretsLlmEnabled, secretsLlmApiUrl, secretsLlmApiKey, secretsLlmModel, secretsLlmContextWindow, secretsLlmScanConcurrency);
            case DAST -> new LlmFields(dastLlmEnabled, dastLlmApiUrl, dastLlmApiKey, dastLlmModel, dastLlmContextWindow, dastLlmScanConcurrency);
            default -> new LlmFields(false, null, null, null, 8192, 2);
        };
    }

    private static boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private record LlmFields(boolean enabled, String apiUrl, String apiKey, String model, int contextWindow, int scanConcurrency) {
    }

    @Getter
    public static final class LlmSourceView {
        private final String source;
        private final boolean enabled;
        private final String apiUrl;
        private final String model;
        private final boolean apiKeyConfigured;
        private final int contextWindow;
        private final int scanConcurrency;

        public LlmSourceView(String source, boolean enabled, String apiUrl, String model, boolean apiKeyConfigured,
                             int contextWindow, int scanConcurrency) {
            this.source = source;
            this.enabled = enabled;
            this.apiUrl = apiUrl;
            this.model = model;
            this.apiKeyConfigured = apiKeyConfigured;
            this.contextWindow = contextWindow;
            this.scanConcurrency = scanConcurrency;
        }
    }

    public void enableWiz(String clientId, String secret) {
        this.enableWiz = true;
        this.wizClientId = clientId;
        this.wizSecret = secret;
    }

    public void disableWiz() {
        this.enableWiz = false;
        this.wizClientId = null;
        this.wizSecret = null;
    }

    // Enable Authentication Login
    public void enableAuthLogin() {
        this.authTypeUserPass = true;
    }

    // Disable Authentication Login
    public void disableAuthLogin() {
        this.authTypeUserPass = false;
    }

    // Enable SSO with OAuth configuration
    public void enableSSO(String appName, String secret, String issuerUrl) {
        this.authTypeOAuth = true;
        this.oauthAppName = appName;
        this.oauthSecret = secret;
        this.oauthIssuerUrl = issuerUrl;
    }

    // Disable SSO and clear OAuth configuration
    public void disableSSO() {
        this.authTypeOAuth = false;
        this.oauthAppName = null;
        this.oauthSecret = null;
        this.oauthIssuerUrl = null;
    }

    // Enable SMTP with configuration
    public void enableSMTP(String hostname, int port, String username, String password, boolean tls, boolean starttls) {
        this.enableSmtp = true;
        this.smtpHostname = hostname;
        this.smtpPort = port;
        this.smtpUsername = username;
        this.smtpPassword = password;
        this.smtpTls = tls;
        this.smtpStarttls = starttls;
    }

    // Disable SMTP and clear SMTP configuration
    public void disableSMTP() {
        this.enableSmtp = false;
        this.smtpHostname = null;
        this.smtpPort = 0;
        this.smtpUsername = null;
        this.smtpPassword = null;
        this.smtpTls = false;
        this.smtpStarttls = false;
    }

    public void configScaEmbedded(){
        this.scaModeEmbeded = true;
        this.scaModeExternal = false;
    }
    public void configScaExternalDT(String hostname, String apiKey){
        this.scaModeEmbeded = false;
        this.scaModeExternal = true;
        this.scaApiUrl = hostname;
        this.scaApiKey = apiKey;
    }

    public void configScaEmbeddedInitialized(String hostname, String apikey) {
        this.scaModeEmbeded = true;
        this.scaModeExternal = false;
        this.scaApiKey = apikey;
        this.scaApiUrl = hostname;
    }

}
