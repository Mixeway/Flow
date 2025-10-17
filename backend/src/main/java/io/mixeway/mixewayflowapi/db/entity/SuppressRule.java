package io.mixeway.mixewayflowapi.db.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Table(name = "suppress_rule")
public class SuppressRule {

    public enum Scope {
        GLOBAL, TEAM, PROJECT
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private UserInfo owner;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Scope scope;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vulnerability_id", nullable = false)
    private Vulnerability vulnerability;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coderepo_id")
    private CodeRepo codeRepo;

    @Column(name = "path_regex")
    private String pathRegex;

    @Column(name = "created_date", nullable = false)
    private LocalDateTime createdDate;

    @Column(name = "comment")
    private String comment; // optional textual note provided at creation time

    // Constructor for new SuppressRule
    public SuppressRule(UserInfo owner, Scope scope, Vulnerability vulnerability, Team team, CodeRepo codeRepo, String pathRegex, String comment) {
        this.owner = owner;
        this.scope = scope;
        this.vulnerability = vulnerability;
        this.team = team;
        this.codeRepo = codeRepo;
        this.pathRegex = pathRegex;
        this.createdDate = LocalDateTime.now();
        this.comment = comment;
    }


    // Default constructor for JPA
    protected SuppressRule() {
        this.createdDate = LocalDateTime.now();
    }
}