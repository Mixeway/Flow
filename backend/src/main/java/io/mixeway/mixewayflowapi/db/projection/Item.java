package io.mixeway.mixewayflowapi.db.projection;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class Item {
    private String name;
    private String urgency;
    private int count;
    private BigDecimal epss;
    private boolean pii;
    private boolean exploitAvailable;
    private List<Project> projects;

    // Constructors, getters, and setters
    // ...
}


