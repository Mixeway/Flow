package io.mixeway.mixewayflowapi.db.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Getter
@RequiredArgsConstructor
@Table(name = "cloud_scan_info")
public final class CloudScanInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private final long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cloud_subscription_id", nullable = false)
    @JsonIgnore
    private final CloudSubscription cloudSubscription;

    @Column(name = "inserted_date", nullable = false, updatable = false)
    private final LocalDateTime insertedDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "scan_status", nullable = false)
    private CloudSubscription.ScanStatus scanStatus;

    @Column(name = "high_findings", nullable = false)
    private int highFindings;

    @Column(name = "critical_findings", nullable = false)
    private int criticalFindings;

    // Private constructor for JPA
    protected CloudScanInfo() {
        this.id = 0;
        this.cloudSubscription = null;
        this.insertedDate = LocalDateTime.now();
        this.scanStatus = CloudSubscription.ScanStatus.NOT_PERFORMED;
        this.highFindings = 0;
        this.criticalFindings = 0;
    }

    // Public constructor for creating new instances
    public CloudScanInfo(CloudSubscription cloudSubscription,
                         CloudSubscription.ScanStatus scanStatus, int highFindings, int criticalFindings) {
        this.id = 0;
        this.cloudSubscription = cloudSubscription;
        this.scanStatus = scanStatus;
        this.highFindings = highFindings;
        this.criticalFindings = criticalFindings;
        this.insertedDate = LocalDateTime.now();

    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CloudScanInfo that = (CloudScanInfo) o;
        return Objects.equals(cloudSubscription, that.cloudSubscription) &&
                Objects.equals(insertedDate, that.insertedDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(cloudSubscription, insertedDate);
    }

    // Method to update existing ScanInfo fields
    public void updateScanInfo(CloudSubscription.ScanStatus scanStatus, int highFindings, int criticalFindings) {
        this.scanStatus = scanStatus;
        this.highFindings = highFindings;
        this.criticalFindings = criticalFindings;
    }
}
