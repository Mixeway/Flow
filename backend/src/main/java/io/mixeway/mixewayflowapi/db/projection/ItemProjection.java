package io.mixeway.mixewayflowapi.db.projection;

import java.math.BigDecimal;
import java.util.List;

public interface ItemProjection {
    Long getCoderepoId();
    String getName();
    String getUrgency();
    int getCount();
    BigDecimal getEpss();
    boolean isPii();
    boolean isExploitAvailable();
    List<String> getProjectNames();
    List<Integer> getProjectIds();
}