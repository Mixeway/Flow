package io.mixeway.mixewayflowapi.db.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "plan_limits")
public class PlanLimits {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "plan_type", nullable = false, unique = true)
    private String planType;

    @Column(name = "max_teams", nullable = false)
    private int maxTeams;

    @Column(name = "max_repos_per_team", nullable = false)
    private int maxReposPerTeam;

    @Column(name = "max_users_per_team", nullable = false)
    private int maxUsersPerTeam;

    // Constructor
    public PlanLimits(String planType, int maxTeams, int maxReposPerTeam, int maxUsersPerTeam) {
        this.planType = planType;
        this.maxTeams = maxTeams;
        this.maxReposPerTeam = maxReposPerTeam;
        this.maxUsersPerTeam = maxUsersPerTeam;
    }
}