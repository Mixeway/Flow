package io.mixeway.mixewayflowapi.db.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

import java.util.List;
import java.util.Objects;

@Entity
@Getter
@Table(name = "cloud_subscription",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"name", "team_id", "project_external_name"})})
public class CloudSubscription {

    public enum ScanStatus {
        SUCCESS, DANGER, WARNING, NOT_PERFORMED, RUNNING
    }

    @OneToMany(mappedBy = "cloudSubscription", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<CloudScanInfo> cloudScanInfos;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name must not be empty")
    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @Column(name = "external_project_name", unique = true)
    private String external_project_name;

    @Enumerated(EnumType.STRING)
    @Column(name = "scan_status", nullable = false)
    private ScanStatus scan_status;


    public CloudSubscription(String name, Team team, String external_project_name) {
        validateName(name);
        validateTeam(team);
        this.name = name;
        this.team = team;
        this.external_project_name = external_project_name;
        this.scan_status = ScanStatus.NOT_PERFORMED;
    }

    // Private constructor for JPA
    protected CloudSubscription() {
    }

    private void validateName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name must not be empty");
        }
    }

    private void validateTeam(Team team) {
        if (team == null) {
            throw new IllegalArgumentException("Team must not be null");
        }
    }

    public void updateName(String newName) {
        validateName(newName);
        this.name = newName;
    }

    void updateExternalProjectName(String externalProjectName) {
        validateName(externalProjectName);
        this.name = externalProjectName;
    }

    public void updateCloudSubscriptionScanStatus(CloudSubscription.ScanStatus status) {
        this.scan_status = status;
    }

    public void updateTeam(Team newTeam) {
        this.team = newTeam;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CloudSubscription that = (CloudSubscription) o;
        return Objects.equals(name, that.name) && Objects.equals(team.getId(), that.team.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, team.getId());
    }
}
