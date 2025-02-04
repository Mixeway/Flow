package io.mixeway.mixewayflowapi.db.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

import java.util.Objects;

@Entity
@Getter
@Table(name = "cloud_subscription",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"name", "team_id"})})
public class CloudSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name must not be empty")
    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    public CloudSubscription(String name, Team team) {
        validateName(name);
        validateTeam(team);
        this.name = name;
        this.team = team;
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
