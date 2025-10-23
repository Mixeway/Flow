package io.mixeway.mixewayflowapi.db.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.aspectj.apache.bcel.classfile.Code;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Getter
@RequiredArgsConstructor
@Table(name = "scan_info")
public final class ScanInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private final long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "coderepo_id", nullable = false)
    @JsonIgnore
    private final CodeRepo codeRepo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "coderepo_branch_id", nullable = false)
    private final CodeRepoBranch codeRepoBranch;

    @Column(nullable = false, length = 40)
    private final String commitId;

    @Column(name = "inserted_date", nullable = false, updatable = false)
    private LocalDateTime insertedDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "sca_scan_status", nullable = false)
    private CodeRepo.ScanStatus scaScanStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "sast_scan_status", nullable = false)
    private CodeRepo.ScanStatus sastScanStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "iac_scan_status", nullable = false)
    private CodeRepo.ScanStatus iacScanStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "secrets_scan_status", nullable = false)
    private CodeRepo.ScanStatus secretsScanStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "gitlab_scan_status", nullable = false)
    private CodeRepo.ScanStatus gitlabScanStatus;

    @Column(name = "sca_high", nullable = false)
    private int scaHigh;

    @Column(name = "sca_critical", nullable = false)
    private int scaCritical;

    @Column(name = "sast_high", nullable = false)
    private int sastHigh;

    @Column(name = "sast_critical", nullable = false)
    private int sastCritical;

    @Column(name = "iac_high", nullable = false)
    private int iacHigh;

    @Column(name = "iac_critical", nullable = false)
    private int iacCritical;

    @Column(name = "secrets_high", nullable = false)
    private int secretsHigh;

    @Column(name = "secrets_critical", nullable = false)
    private int secretsCritical;

    @Column(name = "gitlab_critical", nullable = false)
    private  int gitlabCritical;

    @Column(name = "gitlab_high", nullable = false)
    private  int gitlabHigh;

    @Column(name = "dast_critical", nullable = false)
    private  int dastCritical;

    @Column(name = "dast_high", nullable = false)
    private  int dastHigh;

    // Private constructor for JPA
    protected ScanInfo() {
        this.id = 0;
        this.codeRepo = null;
        this.codeRepoBranch = null;
        this.commitId = null;
        this.insertedDate = LocalDateTime.now();
        this.scaScanStatus = CodeRepo.ScanStatus.NOT_PERFORMED;
        this.sastScanStatus = CodeRepo.ScanStatus.NOT_PERFORMED;
        this.iacScanStatus = CodeRepo.ScanStatus.NOT_PERFORMED;
        this.secretsScanStatus = CodeRepo.ScanStatus.NOT_PERFORMED;
        this.gitlabScanStatus = CodeRepo.ScanStatus.NOT_PERFORMED;
        this.scaHigh = 0;
        this.scaCritical = 0;
        this.sastHigh = 0;
        this.sastCritical = 0;
        this.iacHigh = 0;
        this.iacCritical = 0;
        this.secretsHigh = 0;
        this.secretsCritical = 0;
        this.gitlabHigh = 0;
        this.gitlabCritical = 0;
        this.dastHigh = 0;
        this.dastCritical = 0;
    }

    // Public constructor for creating new instances
    public ScanInfo(CodeRepo codeRepo, CodeRepoBranch codeRepoBranch, String commitId,
                    CodeRepo.ScanStatus scaScanStatus, CodeRepo.ScanStatus sastScanStatus, CodeRepo.ScanStatus iacScanStatus,
                    CodeRepo.ScanStatus secretsScanStatus, CodeRepo.ScanStatus gitlabScanStatus, int scaHigh, int scaCritical, int sastHigh, int sastCritical,
                    int iacHigh, int iacCritical, int secretsHigh, int secretsCritical, int gitlabHigh, int gitlabCritical,
                    int dastHigh, int dastCritical) {
        this.id = 0;
        this.codeRepo = codeRepo;
        this.codeRepoBranch = codeRepoBranch;
        this.commitId = commitId;
        this.scaScanStatus = scaScanStatus;
        this.sastScanStatus = sastScanStatus;
        this.iacScanStatus = iacScanStatus;
        this.secretsScanStatus = secretsScanStatus;
        this.gitlabScanStatus = gitlabScanStatus;
        this.scaHigh = scaHigh;
        this.scaCritical = scaCritical;
        this.sastHigh = sastHigh;
        this.sastCritical = sastCritical;
        this.iacHigh = iacHigh;
        this.iacCritical = iacCritical;
        this.secretsHigh = secretsHigh;
        this.secretsCritical = secretsCritical;
        this.gitlabHigh = gitlabHigh;
        this.gitlabCritical = gitlabCritical;
        this.insertedDate = LocalDateTime.now();
        this.dastCritical = dastCritical;
        this.dastHigh = dastHigh;

    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ScanInfo that = (ScanInfo) o;
        return Objects.equals(commitId, that.commitId) &&
                Objects.equals(insertedDate, that.insertedDate) &&
                Objects.equals(codeRepo, that.codeRepo) &&
                Objects.equals(codeRepoBranch, that.codeRepoBranch);
    }

    @Override
    public int hashCode() {
        return Objects.hash(commitId, insertedDate, codeRepo, codeRepoBranch);
    }

    // Method to update existing ScanInfo fields
    public void updateScanInfo(CodeRepo.ScanStatus scaScanStatus, CodeRepo.ScanStatus sastScanStatus, CodeRepo.ScanStatus iacScanStatus,
                               CodeRepo.ScanStatus secretsScanStatus, CodeRepo.ScanStatus gitlabScanStatus, int scaHigh, int scaCritical, int sastHigh, int sastCritical,
                               int iacHigh, int iacCritical, int secretsHigh, int secretsCritical, int gitlabHigh, int gitlabCritical) {
        this.scaScanStatus = scaScanStatus;
        this.sastScanStatus = sastScanStatus;
        this.iacScanStatus = iacScanStatus;
        this.secretsScanStatus = secretsScanStatus;
        this.gitlabScanStatus = gitlabScanStatus;
        this.scaHigh = scaHigh;
        this.scaCritical = scaCritical;
        this.sastHigh = sastHigh;
        this.sastCritical = sastCritical;
        this.iacHigh = iacHigh;
        this.iacCritical = iacCritical;
        this.secretsHigh = secretsHigh;
        this.secretsCritical = secretsCritical;
        this.gitlabHigh = gitlabHigh;
        this.gitlabCritical = gitlabCritical;
        this.insertedDate = LocalDateTime.now();
    }
    @PreUpdate
    public void preUpdate() {
        this.insertedDate = LocalDateTime.now();
    }
}
