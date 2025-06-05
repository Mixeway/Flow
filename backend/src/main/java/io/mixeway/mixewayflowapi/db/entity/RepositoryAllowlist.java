package io.mixeway.mixewayflowapi.db.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Objects;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "repository_allowlist")
public class RepositoryAllowlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "repository_domain", nullable = false, unique = true)
    private String repositoryDomain;

    @Column(name = "description")
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private java.time.LocalDateTime createdAt;

    @Column(name = "updated_at")
    private java.time.LocalDateTime updatedAt;

    public RepositoryAllowlist(String repositoryDomain, String description) {
        this.repositoryDomain = repositoryDomain;
        this.description = description;
        this.createdAt = java.time.LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRepositoryDomain() {
        return repositoryDomain;
    }

    public void setRepositoryDomain(String repositoryDomain) {
    this.repositoryDomain = repositoryDomain;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public java.time.LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(java.time.LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public java.time.LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(java.time.LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RepositoryAllowlist that = (RepositoryAllowlist) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(repositoryDomain, that.repositoryDomain);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, repositoryDomain);
    }
}
