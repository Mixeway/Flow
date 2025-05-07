package io.mixeway.mixewayflowapi.db.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

import java.util.Objects;

@Entity
@Getter
@Table(name = "team", uniqueConstraints = {@UniqueConstraint(columnNames = "name")})
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private final long id;

    @NotBlank(message = "Name must not be empty")
    @Column(name = "name", nullable = false, unique = true)
    private final String name;

    @Column(name = "remoteIdentifier")
    private final String remoteIdentifier;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "organization_id")
    private Organization organization;

    public Team(String name, String remoteIdentifier) {
        validateName(name);
        this.id = 0;
        this.name = name;
        this.remoteIdentifier = remoteIdentifier;
    }

    public Team(String name, String remoteIdentifier, Organization organization) {
        validateName(name);
        this.id = 0;
        this.name = name;
        this.remoteIdentifier = remoteIdentifier;
        this.organization = organization;
    }


    // Private constructor for JPA
    protected Team() {
        this.id = 0;
        this.name = null;
        this.remoteIdentifier = null;
    }

    private void validateName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name must not be empty");
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Team that = (Team) o;
        return Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }

    public void clearOrganization() {
        this.organization = null;
    }
    public void setOrganization(Organization organization) {
        this.organization =organization;
    }
}
