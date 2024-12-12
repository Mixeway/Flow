package io.mixeway.mixewayflowapi.db.projection;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ItemDTO {
    private Long coderepoId;
    private String name;
    private String urgency;
    private int count;
    private BigDecimal epss;
    private Boolean pii;
    private Boolean exploitAvailable;
    private List<String> projectNames;
    private List<Long> projectIds;
}
