package io.mixeway.mixewayflowapi.db.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "coderepo_component")
public class CodeRepoComponent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coderepo_id", nullable = false)
    private CodeRepo codeRepo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "component_id", nullable = false)
    private Component component;

    @Column(name = "is_transitive", nullable = false)
    private boolean transitive;

    @CreationTimestamp
    @Column(name = "inserted_date", nullable = false, updatable = false)
    private LocalDateTime insertedDate;

    // Default constructor for JPA
    protected CodeRepoComponent() {
    }

    // Public constructor for creating new instances
    public CodeRepoComponent(CodeRepo codeRepo, Component component, boolean transitive) {
        this.codeRepo = codeRepo;
        this.component = component;
        this.transitive = transitive;
    }
}
