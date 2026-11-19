package io.mixeway.mixewayflowapi.db.projection;

import io.mixeway.mixewayflowapi.db.entity.Finding;

import java.time.LocalDate;

/**
 * The part of a suppressed finding needed to carry its suppression over to the same
 * vulnerability at the same location on another branch.
 */
public interface SuppressedFindingProjection {
    Long getVulnerabilityId();
    String getLocation();
    String getFingerprint();
    Finding.SuppressedReason getSuppressedReason();
    LocalDate getSuppressedUntil();
}
