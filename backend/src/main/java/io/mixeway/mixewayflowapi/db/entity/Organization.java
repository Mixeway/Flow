package io.mixeway.mixewayflowapi.db.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Table(name = "organization")
public class Organization {

    public enum PlanType {
        FREE, SMALL_COMPANY, ENTERPRISE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private final long id;

    @NotBlank
    @Column(name = "name", nullable = false)
    private final String name;

    @Column(name = "created_date", nullable = false, updatable = false)
    private final LocalDateTime createdDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "plan_type", nullable = false)
    private PlanType planType;

    @Column(name = "active", nullable = false)
    private boolean active;

    @OneToMany(mappedBy = "organization", fetch = FetchType.EAGER)
    @JsonIgnore
    private final Set<Team> teams = new HashSet<>();

    @ManyToMany(mappedBy = "organizations")
    @JsonIgnore
    private final Set<UserInfo> users = new HashSet<>();


    // Private constructor for JPA
    protected Organization() {
        this.id = 0;
        this.name = null;
        this.createdDate = null;
        this.planType = PlanType.FREE;
        this.active = true;
    }

    // Public constructor
    public Organization(String name, PlanType planType) {
        this.id = 0;
        this.name = name;
        this.createdDate = LocalDateTime.now();
        this.planType = planType;
        this.active = true;
    }

    public void updatePlanType(PlanType planType) {
        this.planType = planType;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public void addUser(UserInfo user) {
        // Check if the user is already in this organization
        if (!this.users.contains(user)) {
            this.users.add(user);

            // Update the other side of the relationship without calling back
            if (!user.getOrganizations().contains(this)) {
                user.getOrganizations().add(this);
            }
        }
    }


    public void removeUser(UserInfo user) {
        this.users.remove(user);
    }
}