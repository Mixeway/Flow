package io.mixeway.mixewayflowapi.db.projection;

import java.math.BigDecimal;

public interface ItemProjection {
    String getName();
    String getUrgency();
    int getCount();
    BigDecimal getEpss();
    boolean isPii();
    boolean isExploitAvailable();
    String[] getProjectNames();
    Long[] getProjectIds();  // Updated to retrieve project IDs
}