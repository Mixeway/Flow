package io.mixeway.mixewayflowapi.db.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;

import java.net.MalformedURLException;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Getter
@Table(name = "coderepo")
public final class CodeRepo {

    public enum ScanStatus {
        SUCCESS, DANGER, WARNING, NOT_PERFORMED, RUNNING
    }
    public enum RepoType {
        GITLAB, GITHUB
    }


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private final long id;

    @NotBlank
    @Pattern(regexp = "^[a-zA-Z0-9-_/ ]+$", message = "Name must be alphanumeric with dashes allowed")
    @Column(nullable = false, unique = true)
    private final String name;

    @NotBlank
    @Pattern(regexp = "^https?://.+$", message = "Invalid URL format")
    @Column(nullable = false)
    private final String repourl;

    @NotBlank
    @Pattern(regexp = "^[a-zA-Z0-9._-]+$", message = "Invalid access token format")
    @Column(name = "access_token", nullable = false)
    @JsonIgnore
    private final String accessToken;

    @Column(name = "remote_id", nullable = false)
    private final int remoteId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "default_branch_id", nullable = false)
    private CodeRepoBranch defaultBranch;

    @OneToMany(mappedBy = "codeRepo", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<CodeRepoBranch> branches;

    @Column(name = "inserted_date", nullable = false, updatable = false)
    private final LocalDateTime insertedDate;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "coderepo_languages", joinColumns = @JoinColumn(name = "coderepo_id"))
    @MapKeyColumn(name = "language")
    @Column(name = "percent_of_code")
    private Map<String, Integer> languages = new HashMap<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "sast_scan", nullable = false)
    private ScanStatus sastScan;

    @Enumerated(EnumType.STRING)
    @Column(name = "sca_scan", nullable = false)
    private ScanStatus scaScan;

    @Enumerated(EnumType.STRING)
    @Column(name = "iac_scan", nullable = false)
    private ScanStatus iacScan;

    @Enumerated(EnumType.STRING)
    @Column(name = "secrets_scan", nullable = false)
    private ScanStatus secretsScan;

    @Enumerated(EnumType.STRING)
    @Column(name = "gitlab_scan", nullable = false)
    private ScanStatus gitlabScan;

    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(
            name = "coderepo_component",
            joinColumns = @JoinColumn(name = "coderepo_id"),
            inverseJoinColumns = @JoinColumn(name = "component_id")
    )
    private List<Component> components;

    @OneToMany(mappedBy = "codeRepo", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AppDataType> appDataTypes;

    @OneToMany(mappedBy = "codeRepo", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<ScanInfo> scanInfos;

    @Column(name = "sca_uuid", nullable = false)
    private String scaUUID;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private RepoType type;


    // Private constructor for JPA
    protected CodeRepo() {
        this.remoteId = 0;
        this.id = 0;
        this.name = null;
        this.repourl = null;
        this.accessToken = null;
        this.team = null;
        this.defaultBranch = null;
        this.branches = null;
        this.components = new ArrayList<>();
        this.insertedDate = LocalDateTime.now();
        this.sastScan = ScanStatus.NOT_PERFORMED;
        this.scaScan = ScanStatus.NOT_PERFORMED;
        this.iacScan = ScanStatus.NOT_PERFORMED;
        this.secretsScan = ScanStatus.NOT_PERFORMED;
        this.gitlabScan = ScanStatus.NOT_PERFORMED;
        this.type = RepoType.GITLAB;
        this.scaUUID = null;
        this.appDataTypes = new ArrayList<>();
    }

    // Public constructor for creating new instances
    public CodeRepo(String name, String repourl, String accessToken, Team team, int remoteId, RepoType repoType) {
        this.id = 0;
        this.remoteId = remoteId;
        this.name = name.replace(" ","");
        this.repourl = repourl;
        this.accessToken = accessToken;
        this.team = team;
        this.insertedDate = LocalDateTime.now();
        this.components = new ArrayList<>();
        this.sastScan = ScanStatus.NOT_PERFORMED;
        this.scaScan = ScanStatus.NOT_PERFORMED;
        this.iacScan = ScanStatus.NOT_PERFORMED;
        this.secretsScan = ScanStatus.NOT_PERFORMED;
        this.gitlabScan = ScanStatus.NOT_PERFORMED;
        this.scaUUID = null;
        this.appDataTypes = new ArrayList<>();
        this.type = repoType;
    }

    // Methods to change mutable fields
    public void upsertLanguage(String language, int percentOfCode) {
        if (languages == null) {
            languages = new HashMap<>();
        }
        languages.put(language, percentOfCode);
    }

    public void updateBranch(CodeRepoBranch codeRepoBranch){
        this.defaultBranch = codeRepoBranch;
    }

    public void updateSastScanStatus(ScanStatus status) {
        this.sastScan = status;
    }

    public void updateScaScanStatus(ScanStatus status) {
        this.scaScan = status;
    }

    public void updateIacScanStatus(ScanStatus status) {
        this.iacScan = status;
    }

    public void updateSecretsScanStatus(ScanStatus status) {
        this.secretsScan = status;
    }

    public void updateGitLabScanStatus(ScanStatus status) {
        this.gitlabScan = status;
    }

    public void startScan(){
        this.secretsScan = ScanStatus.RUNNING;
        this.iacScan = ScanStatus.RUNNING;
        this.scaScan = ScanStatus.RUNNING;
        this.sastScan = ScanStatus.RUNNING;
        this.gitlabScan = ScanStatus.RUNNING;

    }

    public String getGitHostUrl() throws MalformedURLException {
        URL url = new URL(this.repourl);
        String port = (url.getPort() == -1) ? "" : ":" + url.getPort();
        return url.getProtocol() + "://" + url.getHost() + port;
    }

    // Method to set the components list
    public void setComponents(List<Component> newComponents) {
        this.components.clear(); // Clear the existing components

        for (Component component : newComponents) {
            if (!this.components.contains(component)) { // Check if already added
                this.components.add(component);
                component.addCodeRepo(this); // Maintain bidirectional relationship
            }
        }
    }

    public boolean isScanRunning(){
        return this.sastScan.equals(ScanStatus.RUNNING) &&
                this.iacScan.equals(ScanStatus.RUNNING) &&
                this.secretsScan.equals(ScanStatus.RUNNING) &&
                this.scaScan.equals(ScanStatus.RUNNING) &&
                this.gitlabScan.equals(ScanStatus.RUNNING);
    }

    public boolean isScanNotRunning(){
        return !this.sastScan.equals(ScanStatus.RUNNING) &&
                !this.iacScan.equals(ScanStatus.RUNNING) &&
                !this.secretsScan.equals(ScanStatus.RUNNING) &&
                !this.scaScan.equals(ScanStatus.RUNNING) &&
                !this.gitlabScan.equals(ScanStatus.RUNNING);
    }


    public void setScaUUID(String uuid){
        this.scaUUID = uuid;
    }

    // Add method to update team
    public void updateTeam(Team newTeam) {
        this.team = newTeam;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CodeRepo that = (CodeRepo) o;
        return Objects.equals(name, that.name) && Objects.equals(repourl, that.repourl)
                && Objects.equals(team, that.team);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }
}
