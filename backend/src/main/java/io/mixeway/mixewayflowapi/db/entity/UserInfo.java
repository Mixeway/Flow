package io.mixeway.mixewayflowapi.db.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Getter
@Table(name = "users")
public class UserInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private final long id;

    @NotBlank(message = "Username must not be null")
    @Size(max = 20, message = "Username must be up to 20 characters long")
    @Pattern(regexp = "^[a-zA-Z0-9]+$", message = "Username must be alphanumeric")
    @Column(name = "username", nullable = false, unique = true)
    private final String username;

    @JsonIgnore
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;

    @ManyToMany(fetch = FetchType.EAGER)
    private final Set<UserRole> roles = new HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "users_teams",
            joinColumns = @JoinColumn(name = "user_info_id"),
            inverseJoinColumns = @JoinColumn(name = "team_id")
    )
    private final Set<Team> teams = new HashSet<>();

    @Column(name = "api_key")
    private String apiKey;

    @Column(name = "reset_password", nullable = false)
    private boolean resetPassword;

    @Column(name = "active", nullable = false)
    private boolean active;

    // Private constructor for JPA
    protected UserInfo() {
        this.id = 0;
        this.username = null;
        this.password = null;
        this.apiKey = null;
        this.resetPassword = true;
        this.active = true;
    }

    // Public constructor for creating new UserInfo instances
    public UserInfo(String username, String password, Set<UserRole> roles) {
        this.username = validateUsername(username);
        this.password = validatePassword(password);
        this.apiKey = null;
        this.resetPassword = true;
        this.active = true;
        setRoles(roles);
        this.id = 0;
    }

    private String validateUsername(String username) {
        if (username == null || username.length() > 20 || !username.matches("[a-zA-Z0-9]+")) {
            throw new IllegalArgumentException("Invalid username: must be alphanumeric and up to 20 characters long.");
        }
        return username;
    }

    private String validatePassword(String password) {
        if (password != null && password.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long.");
        }
        return password;
    }

    private void setRoles(Set<UserRole> roles) {
        if (roles == null || roles.isEmpty()) {
            throw new IllegalArgumentException("User must have at least one role.");
        }
        this.roles.clear();
        this.roles.addAll(roles);
    }

    public void changePassword(String newPassword) {
        this.password = validatePassword(newPassword);
        this.changeResetPasswordStatus(false);
    }

    public void changeApiKey() {
        this.apiKey = UUID.randomUUID().toString();
    }

    public void changeActiveStatus(boolean newActiveStatus) {
        this.active = newActiveStatus;
    }

    public void changeResetPasswordStatus(boolean newResetPasswordStatus) {
        this.resetPassword = newResetPasswordStatus;
    }

    public void assignToTeam(Team team) {
        this.teams.add(team);
    }

    public void assignRoles(Set<UserRole> newRoles) {
        setRoles(newRoles);
    }

    public String getHighestRole() {
        if (roles.stream().anyMatch(role -> "ADMIN".equals(role.getName()))) {
            return "ADMIN";
        } else if (roles.stream().anyMatch(role -> "TEAM_MANAGER".equals(role.getName()))) {
            return "TEAM_MANAGER";
        } else if (roles.stream().anyMatch(role -> "USER".equals(role.getName()))) {
            return "USER";
        }
        return null; // or throw an exception if no role is found
    }
}
