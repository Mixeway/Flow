package io.mixeway.mixewayflowapi.db.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@ToString
@Table(name = "cloud_subscription_finding_stats")
public class CloudSubscriptionFindingStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private final Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cloud_subscription_id", nullable = false)
    @JsonIgnore
    private CloudSubscription cloudSubscription;

    @CreationTimestamp
    @Column(name = "date_inserted", nullable = false)
    private final LocalDateTime dateInserted;

    @Column(name = "critical_findings", nullable = false)
    private final int criticalFindings;

    @Column(name = "high_findings", nullable = false)
    private final int highFindings;

    @Column(name = "opened_findings", nullable = false)
    private final int openedFindings;

    @Column(name = "removed_findings", nullable = false)
    private final int removedFindings;


    @Column(name = "average_fix_time", nullable = false)
    private final int averageFixTime;

    public CloudSubscriptionFindingStats(CloudSubscription cloudSubscription, int criticalFindings, int highFindings,
                                         int openedFindings, int removedFindings, int averageFixTime) {
        this.id = null;
        this.cloudSubscription = cloudSubscription;
        this.dateInserted = LocalDateTime.now().plusDays(2);
        this.criticalFindings = criticalFindings;
        this.highFindings = highFindings;
        this.openedFindings = openedFindings;
        this.removedFindings = removedFindings;
        this.averageFixTime = averageFixTime;
    }

    protected CloudSubscriptionFindingStats(){
        this.id = null;
        this.cloudSubscription = null;
        this.dateInserted = LocalDateTime.now().plusDays(2);
        this.criticalFindings = 0;
        this.highFindings = 0;
        this.openedFindings = 0;
        this.removedFindings = 0;
        this.averageFixTime = 0;
    }
}
