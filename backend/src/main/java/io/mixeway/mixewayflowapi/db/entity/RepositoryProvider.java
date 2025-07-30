package io.mixeway.mixewayflowapi.db.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "repository_providers")
public class RepositoryProvider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CodeRepo.RepoType providerType;

    @Column(nullable = false)
    private String apiUrl;

    @Column(nullable = false, length = 512) // Store encrypted token
    private String encryptedAccessToken;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "default_team_id", nullable = false)
    private Team defaultTeam;

    @Column
    private LocalDateTime lastSyncDate;

    @Column
    private Integer syncedRepoCount;
}
