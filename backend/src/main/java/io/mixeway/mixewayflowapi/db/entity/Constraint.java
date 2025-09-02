package io.mixeway.mixewayflowapi.db.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Entity
@Getter
@ToString
@RequiredArgsConstructor
@Table(name = "constraint_table")
public final class Constraint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private final long id;

    @Column (nullable = false)
    private final String text;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "vulnerability_id", nullable = false)
    @Setter @Getter
    private Vulnerability vulnerability;

    public Constraint() {
        this.id = 0;
        this.text = null;
    }

    // Public constructor for creating new instances
    public Constraint(String text) {
        this.text = text;
        this.id = 0;
    }
}
