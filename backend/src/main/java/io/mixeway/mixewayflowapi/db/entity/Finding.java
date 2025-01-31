package io.mixeway.mixewayflowapi.db.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Getter
@ToString
@RequiredArgsConstructor
@Table(name = "finding")
public final class Finding {

    public enum Severity {
        CRITICAL, HIGH, MEDIUM, LOW, INFO
    }

    public enum Status {
        NEW, EXISTING, SUPRESSED, REMOVED
    }

    public enum SuppressedReason {
        WONT_FIX, FALSE_POSITIVE, ACCEPTED
    }

    public enum Source {
        IAC, SECRETS, SAST, SCA
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private final long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vulnerability_id", nullable = false)
    private final Vulnerability vulnerability;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "component_id")
    private final Component component;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "coderepo_branch_id", nullable = false)
    private final CodeRepoBranch codeRepoBranch;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "coderepo_id", nullable = false)
    private final CodeRepo codeRepo;

    @Column(columnDefinition = "TEXT")
    private final String explanation;

    @Column(length = 200, nullable = false)
    private final String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private final Severity severity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Enumerated(EnumType.STRING)
    private SuppressedReason suppressedReason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private final Source source;

    @CreationTimestamp
    @Column(name = "inserted_date", nullable = false, updatable = false)
    private LocalDateTime insertedDate;

    @UpdateTimestamp
    @Column(name = "updated_date", nullable = false)
    private LocalDateTime updatedDate;

    @OneToMany(mappedBy = "finding", cascade = CascadeType.ALL, orphanRemoval = true)
    private final List<Comment> comments = new ArrayList<>();

    // Default constructor for JPA
    protected Finding() {
        this.id = 0;
        this.vulnerability = null;
        this.component = null;
        this.codeRepoBranch = null;
        this.codeRepo = null;
        this.explanation = null;
        this.location = null;
        this.severity = null;
        this.status = Status.NEW;
        this.source = null;
    }

    public void addComment(Comment comment) {
        comments.add(comment);
    }
    public void removeComment(Comment comment) {
        comments.remove(comment);
    }

    // Public constructor for creating new instances
    public Finding(Vulnerability vulnerability, Component component, CodeRepoBranch codeRepoBranch, CodeRepo codeRepo, String explanation, String location, Severity severity, Source source) {
        this.id = 0;
        this.vulnerability = vulnerability;
        this.component = component;
        this.codeRepoBranch = codeRepoBranch;
        this.codeRepo = codeRepo;
        this.explanation = explanation;
        this.location = location;
        this.severity = severity;
        this.status = Status.NEW;
        this.source = source;
    }

    // Method to update status and suppressed reason
    public void updateStatus(Status newStatus, SuppressedReason suppressedReason) {
        if (newStatus == Status.SUPRESSED && suppressedReason == null) {
            throw new IllegalArgumentException("SuppressedReason must be set if status is SUPRESSED");
        }
        if (newStatus != Status.SUPRESSED) {
            this.suppressedReason = null;
        } else {
            this.suppressedReason = suppressedReason;
        }
        this.status = newStatus;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Finding finding = (Finding) o;
        return Objects.equals(vulnerability, finding.vulnerability) &&
                severity == finding.severity &&
                Objects.equals(location, finding.location) &&
                Objects.equals(codeRepoBranch, finding.codeRepoBranch) &&
                Objects.equals(codeRepo, finding.codeRepo);
    }

    @Override
    public int hashCode() {
        return Objects.hash(vulnerability, severity, location, codeRepoBranch, codeRepo);
    }
    @PreUpdate
    protected void onUpdate() {
        this.updatedDate = LocalDateTime.now();
    }

    public void suppress(String reason){
        if (reason.equals(SuppressedReason.ACCEPTED.toString())){
            this.status = Status.SUPRESSED;
            this.suppressedReason = SuppressedReason.ACCEPTED;
        } else if ( reason.equals(SuppressedReason.FALSE_POSITIVE.toString())){
            this.status = Status.SUPRESSED;
            this.suppressedReason = SuppressedReason.FALSE_POSITIVE;
        } else if ( reason.equals(SuppressedReason.WONT_FIX.toString())){
            this.status = Status.SUPRESSED;
            this.suppressedReason = SuppressedReason.WONT_FIX;
        }
    }
    public void noteFindingDetected() {
        this.updatedDate = LocalDateTime.now();
    }
}
