package io.mixeway.mixewayflowapi.db.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Entity
@Getter
@Setter
@Table(name = "app_data_type")
public final class AppDataType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "category_name", nullable = false)
    private String categoryName;

    @Column(name = "name", nullable = false)
    private String name;

    @ElementCollection
    @CollectionTable(name = "app_data_type_category_groups", joinColumns = @JoinColumn(name = "app_data_type_id"))
    @Column(name = "category_group")
    private List<String> categoryGroups;

    @ElementCollection
    @CollectionTable(name = "app_data_type_location", joinColumns = @JoinColumn(name = "app_data_type_id"))
    @MapKeyColumn(name = "key")
    @Column(name = "value")
    private Map<String, String> location;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "coderepo_id", nullable = false)
    @JsonIgnore
    private CodeRepo codeRepo;

    protected AppDataType() {
    }

    public AppDataType(String categoryName, String name, CodeRepo codeRepo) {
        this.categoryName = categoryName;
        this.name = name;
        this.codeRepo = codeRepo;
    }

    public AppDataType updateCategory(List<String> categoryGroups){
        this.categoryGroups = categoryGroups;
        return this;
    }

    public AppDataType updateLocations(Map<String, String > locations) {
        this.location = locations;
        return this;
    }
}
