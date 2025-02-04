package io.mixeway.mixewayflowapi.db.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

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
