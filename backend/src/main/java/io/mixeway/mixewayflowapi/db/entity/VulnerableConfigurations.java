package io.mixeway.mixewayflowapi.db.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.RequiredArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@EqualsAndHashCode(exclude = "id")
@RequiredArgsConstructor
@Table(name = "vulnerable_configurations")
public class VulnerableConfigurations {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private final long id;

    @ManyToMany(mappedBy = "configurations", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Vulnerability> vulnerabilities = new HashSet<>();

    @Column(name = "criteria")
    private String criteria;

    @Column(name = "version_start_including")
    private String versionStartIncluding;

    @Column(name = "version_start_excluding")
    private String versionStartExcluding;

    @Column(name = "version_end_including")
    private String versionEndIncluding;

    @Column(name = "version_end_excluding")
    private String versionEndExcluding;

    public VulnerableConfigurations() {
        id=0;
    }
}
