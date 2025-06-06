package io.mixeway.mixewayflowapi.db.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@ToString
@Table(name = "code_repo_finding_stats")
public class CodeRepoFindingStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private final Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "coderepo_id", nullable = false)
    @JsonIgnore
    private final CodeRepo codeRepo;

    @CreationTimestamp
    @Column(name = "date_inserted", nullable = false)
    private LocalDateTime dateInserted;

    @Column(name = "sast_critical", nullable = false)
    private int sastCritical;

    @Column(name = "sast_high", nullable = false)
    private  int sastHigh;

    @Column(name = "sast_medium", nullable = false)
    private  int sastMedium;

    @Column(name = "sast_rest", nullable = false)
    private  int sastRest;

    @Column(name = "sca_critical", nullable = false)
    private  int scaCritical;

    @Column(name = "sca_high", nullable = false)
    private  int scaHigh;

    @Column(name = "sca_medium", nullable = false)
    private  int scaMedium;

    @Column(name = "sca_rest", nullable = false)
    private  int scaRest;

    @Column(name = "iac_critical", nullable = false)
    private  int iacCritical;

    @Column(name = "iac_high", nullable = false)
    private  int iacHigh;

    @Column(name = "iac_medium", nullable = false)
    private  int iacMedium;

    @Column(name = "iac_rest", nullable = false)
    private  int iacRest;

    @Column(name = "secrets_critical", nullable = false)
    private  int secretsCritical;

    @Column(name = "secrets_high", nullable = false)
    private  int secretsHigh;

    @Column(name = "secrets_medium", nullable = false)
    private  int secretsMedium;

    @Column(name = "secrets_rest", nullable = false)
    private  int secretsRest;

    @Column(name = "gitlab_critical", nullable = false)
    private  int gitlabCritical;

    @Column(name = "gitlab_high", nullable = false)
    private  int gitlabHigh;

    @Column(name = "gitlab_medium", nullable = false)
    private  int gitlabMedium;

    @Column(name = "gitlab_rest", nullable = false)
    private  int gitlabRest;

    @Column(name = "opened_findings", nullable = false)
    private  int openedFindings;

    @Column(name = "removed_findings", nullable = false)
    private  int removedFindings;

    @Column(name = "reviewed_findings", nullable = false)
    private  int reviewedFindings;

    @Column(name = "average_fix_time", nullable = false)
    private  int averageFixTime;

    public CodeRepoFindingStats(CodeRepo codeRepo, int sastCritical, int sastHigh, int sastMedium, int sastRest,
                                int scaCritical, int scaHigh, int scaMedium, int scaRest,
                                int iacCritical, int iacHigh, int iacMedium, int iacRest,
                                int secretsCritical, int secretsHigh, int secretsMedium, int secretsRest,
                                int gitlabCritical, int gitlabHigh, int gitlabMedium, int gitlabRest,
                                int openedFindings, int removedFindings, int reviewedFindings, int averageFixTime) {
        this.id = null; // will be set by the database
        this.codeRepo = codeRepo;
        this.dateInserted = LocalDateTime.now().plusDays(2); // or get from an external source if you want to override the CreationTimestamp behavior
        this.sastCritical = sastCritical;
        this.sastHigh = sastHigh;
        this.sastMedium = sastMedium;
        this.sastRest = sastRest;
        this.scaCritical = scaCritical;
        this.scaHigh = scaHigh;
        this.scaMedium = scaMedium;
        this.scaRest = scaRest;
        this.iacCritical = iacCritical;
        this.iacHigh = iacHigh;
        this.iacMedium = iacMedium;
        this.iacRest = iacRest;
        this.secretsCritical = secretsCritical;
        this.secretsHigh = secretsHigh;
        this.secretsMedium = secretsMedium;
        this.secretsRest = secretsRest;
        this.gitlabCritical = secretsCritical;
        this.gitlabHigh = secretsHigh;
        this.gitlabMedium = secretsMedium;
        this.gitlabRest = secretsRest;
        this.openedFindings = openedFindings;
        this.removedFindings = removedFindings;
        this.reviewedFindings = reviewedFindings;
        this.averageFixTime = averageFixTime;
    }

    public CodeRepoFindingStats(){
        this.id = null; // will be set by the database
        this.codeRepo = null;
        this.dateInserted = LocalDateTime.now().plusDays(1); // or get from an external source if you want to override the CreationTimestamp behavior
        this.sastCritical = 0;
        this.sastHigh = 0;
        this.sastMedium = 0;
        this.sastRest = 0;
        this.scaCritical = 0;
        this.scaHigh = 0;
        this.scaMedium = 0;
        this.scaRest = 0;
        this.iacCritical = 0;
        this.iacHigh = 0;
        this.iacMedium = 0;
        this.iacRest = 0;
        this.secretsCritical = 0;
        this.secretsHigh = 0;
        this.secretsMedium = 0;
        this.secretsRest = 0;
        this.gitlabCritical = 0;
        this.gitlabHigh = 0;
        this.gitlabMedium = 0;
        this.gitlabRest = 0;
        this.openedFindings = 0;
        this.removedFindings = 0;
        this.reviewedFindings = 0;
        this.averageFixTime = 0;
    }
}
