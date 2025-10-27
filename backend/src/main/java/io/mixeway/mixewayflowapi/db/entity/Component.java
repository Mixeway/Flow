package io.mixeway.mixewayflowapi.db.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@ToString(onlyExplicitlyIncluded = true)
@RequiredArgsConstructor
@Table(name = "component", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"name", "version", "groupid"})
})
public final class Component {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private final long id;

    @Column(nullable = false, length = 160)
    @ToString.Include
    private final String groupid;

    @Column(nullable = false, length = 160)
    @ToString.Include
    private final String name;

    @Column(nullable = false, length = 120)
    @ToString.Include
    private final String version;

    @Column(length = 30)
    private final String origin;  // New nullable field

    @CreationTimestamp
    @Column(name = "inserted_date", nullable = false, updatable = false)
    private LocalDateTime insertedDate;

    @ManyToMany(mappedBy = "components")
    @JsonIgnore
    @ToString.Exclude
    private List<Vulnerability> vulnerabilities;

    @ManyToMany(mappedBy = "components", fetch = FetchType.LAZY)
    @JsonIgnore
    @ToString.Exclude
    private List<CodeRepo> codeRepos = new ArrayList<>();


    // Default constructor for JPA
    protected Component() {
        this.id = 0;
        this.groupid = null;
        this.name = null;
        this.version = null;
        this.origin = null;
    }

    // Public constructor for creating new instances
    public Component(String groupid, String name, String version, String origin) {
        this.id = 0;
        this.groupid = groupid != null ? groupid : "";;
        this.name = name;
        this.version = version;
        this.origin = origin;
    }

    public void addCodeRepo(CodeRepo codeRepo) {
        this.codeRepos.add(codeRepo);
    }
}
